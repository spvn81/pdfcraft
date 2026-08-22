import fs from 'fs';
import path from 'path';
import { spawn, execSync } from 'child_process';
import readline from 'readline';

const TRANSLATION_DIR = path.join(process.cwd(), 'scripts', 'translation');
const CACHE_FILE = path.join(TRANSLATION_DIR, 'translation_cache.json');

export function loadEnv() {
  const envPath = path.join(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    const lines = content.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const match = trimmed.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        let value = match[2].trim();
        // Remove surrounding quotes if they exist
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
          value = value.substring(1, value.length - 1);
        }
        if (process.env[key] === undefined) {
          process.env[key] = value;
        }
      }
    }
  }
}

export class Cache {
  constructor() {
    this.data = {};
    if (fs.existsSync(CACHE_FILE)) {
      try {
        this.data = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
      } catch (e) {
        console.warn('⚠️ Cache file corrupted. Starting fresh.');
      }
    }
  }
  
  get(locale, text) {
    return this.data[locale] && this.data[locale][text];
  }
  
  set(locale, text, translated) {
    if (!this.data[locale]) this.data[locale] = {};
    this.data[locale][text] = translated;
  }
  
  save() {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(this.data, null, 2));
  }
}

export class IndicTrans2Provider {
  constructor() {
    this.worker = null;
    this.pending = new Map();
    this.reqId = 0;
  }
  
  async init() {
    const executables = ['python', 'py', 'python3'];
    let systemPython = null;
    for (const exe of executables) {
      try {
        const v = execSync(`${exe} --version`, { encoding: 'utf8', stdio: 'pipe' });
        if (v.toLowerCase().includes('python')) {
          systemPython = exe;
          break;
        }
      } catch (e) {}
    }
    
    if (!systemPython) throw new Error('Python not found');
    
    let venvPython = systemPython;
    const venvDir = path.join(TRANSLATION_DIR, '.venv');
    if (fs.existsSync(venvDir)) {
      venvPython = process.platform === 'win32' 
        ? path.join(venvDir, 'Scripts', 'python.exe')
        : path.join(venvDir, 'bin', 'python');
    }
    
    return new Promise((resolve, reject) => {
      this.worker = spawn(venvPython, [path.join(TRANSLATION_DIR, 'worker.py')], {
        env: { ...process.env, PYTHONUNBUFFERED: "1" }
      });
      
      this.worker.stderr.on('data', (data) => {
        // Optionally log or just consume to prevent buffer overflow
        // process.stderr.write(`[Worker STDERR] ${data}`);
      });
      
      const rl = readline.createInterface({ input: this.worker.stdout });
      
      rl.on('line', (line) => {
        try {
          const msg = JSON.parse(line);
          if (msg.type === 'debug') {
            // console.log(`[Worker Debug] ${msg.message}`);
          } else if (msg.type === 'ready') {
            console.log(`✅ Worker Ready. Model: ${msg.model}, Device: ${msg.device}`);
            resolve();
          } else if (msg.id !== undefined) {
            const cb = this.pending.get(msg.id);
            if (cb) {
              this.pending.delete(msg.id);
              if (msg.success) {
                cb.resolve(msg.items);
              } else {
                cb.reject(new Error(msg.error));
              }
            }
          }
        } catch (e) {
          console.error('[Worker stdout parsing error]', line);
        }
      });
      
      this.worker.on('exit', (code) => {
        if (code !== 0) {
          console.error(`Worker exited with code ${code}`);
          if (this.pending.size > 0) reject(new Error('Worker died during initialization'));
        }
      });
    });
  }
  
  translateBatch(items, sourceLang, targetLang) {
    return new Promise((resolve, reject) => {
      this.reqId++;
      const id = `req-${this.reqId}`;
      this.pending.set(id, { resolve, reject });
      this.worker.stdin.write(JSON.stringify({ id, source_lang: sourceLang, target_lang: targetLang, items }) + '\n');
    });
  }
  
  close() {
    if (this.worker) this.worker.kill();
  }
}

export const LANG_MAP = {
  hi: 'hin_Deva', te: 'tel_Telu', ta: 'tam_Taml', kn: 'kan_Knda',
  ml: 'mal_Mlym', bn: 'ben_Beng', mr: 'mar_Deva', gu: 'guj_Gujr',
  pa: 'pan_Guru', or: 'odia_Orya', ur: 'urd_Arab'
};

const ALLOWED_IDENTICAL_TERMS = new Set([
  'PDF', 'OCR', 'API', 'JSON', 'HTML', 'CSS', 'JavaScript', 'ZIP',
  'Next.js', 'WebAssembly', 'SVG', 'TIFF', 'JPEG', 'PNG', 'WebP', 'DPI', 'RFC', 'SHA-256'
]);

export function isTechnicalOrAllowed(text) {
  if (ALLOWED_IDENTICAL_TERMS.has(text)) return true;
  if (!Number.isNaN(Number(text))) return true;
  if (text.startsWith('http://') || text.startsWith('https://')) return true;
  if (/^\.[a-z0-9]+$/i.test(text)) return true;
  return false;
}

export function extractPlaceholders(text) {
  if (typeof text !== 'string') return [];
  const matches = text.match(/\{[^}]+\}/g);
  return matches ? [...new Set(matches)].sort() : [];
}

export function extractTags(text) {
  if (typeof text !== 'string') return [];
  const matches = text.match(/<\/?[a-zA-Z0-9]+[^>]*>/g);
  return matches ? [...new Set(matches)].sort() : [];
}

export function flattenObj(obj, parent = '', res = {}) {
  for (let key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      let propName = parent ? parent + '.' + key : key;
      if (typeof obj[key] == 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        flattenObj(obj[key], propName, res);
      } else {
        res[propName] = obj[key];
      }
    }
  }
  return res;
}

export function unflattenObj(data) {
  let result = {};
  for (let i in data) {
    let keys = i.split('.');
    keys.reduce((r, e, j) => {
      return r[e] || (r[e] = isNaN(Number(keys[j + 1])) ? (keys.length - 1 == j ? data[i] : {}) : []);
    }, result);
  }
  return result;
}
