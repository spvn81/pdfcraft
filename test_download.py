from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import traceback
try:
    print("Loading tokenizer...")
    tokenizer = AutoTokenizer.from_pretrained('facebook/nllb-200-distilled-600M')
    print("Tokenizer loaded. Loading model...")
    m = AutoModelForSeq2SeqLM.from_pretrained('facebook/nllb-200-distilled-600M')
    print("Model loaded successfully.")
except Exception as e:
    traceback.print_exc()
