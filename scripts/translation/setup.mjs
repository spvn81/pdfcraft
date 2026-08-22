import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const TRANSLATION_DIR = path.join(process.cwd(), 'scripts', 'translation');
const VENV_DIR = path.join(TRANSLATION_DIR, '.venv');
const REQ_FILE = path.join(TRANSLATION_DIR, 'requirements.txt');

function run(cmd, inherit = true) {
  try {
    return execSync(cmd, { stdio: inherit ? 'inherit' : 'pipe', encoding: 'utf8' }).trim();
  } catch (e) {
    return null;
  }
}

function detectPython() {
  const executables = ['python', 'py', 'python3'];
  for (const exe of executables) {
    const version = run(`${exe} --version`, false);
    if (version && version.toLowerCase().includes('python')) {
      console.log(`✅ Found Python: ${exe} (${version})`);
      return exe;
    }
  }
  return null;
}

function getVenvPython() {
  if (process.platform === 'win32') {
    return path.join(VENV_DIR, 'Scripts', 'python.exe');
  }
  return path.join(VENV_DIR, 'bin', 'python');
}

function getVenvPip() {
  if (process.platform === 'win32') {
    return path.join(VENV_DIR, 'Scripts', 'pip.exe');
  }
  return path.join(VENV_DIR, 'bin', 'pip');
}

console.log('=== IndicTrans2 Local Translation Setup ===\n');

const systemPython = detectPython();
if (!systemPython) {
  console.error('❌ Python is not installed or not in PATH.');
  process.exit(1);
}

if (!fs.existsSync(VENV_DIR)) {
  console.log(`\nCreating virtual environment at ${VENV_DIR}...`);
  const venvCmd = `${systemPython} -m venv "${VENV_DIR}"`;
  run(venvCmd);
  if (!fs.existsSync(VENV_DIR)) {
    console.error('❌ Failed to create virtual environment.');
    process.exit(1);
  }
  console.log('✅ Virtual environment created successfully.');
} else {
  console.log(`\n✅ Virtual environment already exists at ${VENV_DIR}`);
}

const venvPython = getVenvPython();
const venvPip = getVenvPip();

console.log('\nInstalling/Upgrading dependencies...');
run(`"${venvPip}" install --upgrade pip`);
run(`"${venvPip}" install -r "${REQ_FILE}"`);

console.log('\nVerifying PyTorch and CUDA...');
const torchCheckCode = `
import torch
print(f"PyTorch Version: {torch.__version__}")
if torch.cuda.is_available():
    print(f"CUDA Available: Yes (Device: {torch.cuda.get_device_name(0)})")
else:
    print("CUDA Available: No (Will use CPU)")
`;
const tmpCheckFile = path.join(TRANSLATION_DIR, 'check.py');
fs.writeFileSync(tmpCheckFile, torchCheckCode);
try {
  run(`"${venvPython}" "${tmpCheckFile}"`);
} catch (e) {
  console.log("Failed to verify PyTorch (it might not be fully installed).");
}
if (fs.existsSync(tmpCheckFile)) {
  fs.unlinkSync(tmpCheckFile);
}

console.log('\n✅ Local Translation Setup Complete!');
