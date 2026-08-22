import sys
import json
import os
import torch
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer

def debug_print(msg):
    print(json.dumps({"type": "debug", "message": msg}))
    sys.stdout.flush()

def load_model_with_fallback(primary_model, fallback_model):
    device = "cuda" if torch.cuda.is_available() else "cpu"
    
    debug_print(f"Device detected: {device}")
    
    try:
        debug_print(f"Attempting to load primary model: {primary_model}")
        tokenizer = AutoTokenizer.from_pretrained(primary_model)
        model = AutoModelForSeq2SeqLM.from_pretrained(primary_model)
        model = model.to(device)
        model.eval()
        debug_print(f"Successfully loaded primary model: {primary_model}")
        return tokenizer, model, device, primary_model
    except Exception as e:
        debug_print(f"Failed to load primary model: {str(e)}")
        if fallback_model and primary_model != fallback_model:
            debug_print(f"Falling back to model: {fallback_model}")
            try:
                tokenizer = AutoTokenizer.from_pretrained(fallback_model)
                model = AutoModelForSeq2SeqLM.from_pretrained(fallback_model)
                model = model.to(device)
                model.eval()
                debug_print(f"Successfully loaded fallback model: {fallback_model}")
                return tokenizer, model, device, fallback_model
            except Exception as e2:
                debug_print(f"Failed to load fallback model: {str(e2)}")
                sys.exit(1)
        else:
            sys.exit(1)

def translate_batch(batch_items, source_lang, target_lang, tokenizer, model, device):
    texts = [item['text'] for item in batch_items]
    
    try:
        tokenizer.src_lang = source_lang
        inputs = tokenizer(texts, return_tensors="pt", padding=True, truncation=True, max_length=256).to(device)
        
        if hasattr(tokenizer, "lang_code_to_id"):
            forced_bos_token_id = tokenizer.lang_code_to_id.get(target_lang)
        else:
            forced_bos_token_id = tokenizer.convert_tokens_to_ids(target_lang)
            if forced_bos_token_id == tokenizer.unk_token_id:
                forced_bos_token_id = None
                
        if forced_bos_token_id is None:
            return {"success": False, "error": f"Invalid target_lang: {target_lang}"}
            
        with torch.no_grad():
            outputs = model.generate(
                **inputs, 
                forced_bos_token_id=forced_bos_token_id, 
                max_length=256, 
                num_beams=1
            )
        
        translated_texts = tokenizer.batch_decode(outputs, skip_special_tokens=True)
        
        for i, item in enumerate(batch_items):
            item['text'] = translated_texts[i]
            
        return {"success": True, "items": batch_items}
    except Exception as e:
        return {"success": False, "error": str(e)}

def main():
    primary_model = os.environ.get("TRANSLATION_MODEL", "facebook/nllb-200-distilled-600M")
    fallback_model = "facebook/nllb-200-distilled-600M"
    
    debug_print("Starting NLLB Worker...")
    tokenizer, model, device, active_model = load_model_with_fallback(primary_model, fallback_model)
    
    print(json.dumps({"type": "ready", "model": active_model, "device": device}))
    sys.stdout.flush()
    
    for line in sys.stdin:
        line = line.strip()
        if not line:
            continue
            
        try:
            req = json.loads(line)
            req_id = req.get("id")
            source_lang = req.get("source_lang", "eng_Latn")
            target_lang = req.get("target_lang")
            items = req.get("items", [])
            
            res = translate_batch(items, source_lang, target_lang, tokenizer, model, device)
            res["id"] = req_id
            
            print(json.dumps(res))
            sys.stdout.flush()
        except Exception as e:
            print(json.dumps({"success": False, "error": str(e)}))
            sys.stdout.flush()

if __name__ == "__main__":
    main()

