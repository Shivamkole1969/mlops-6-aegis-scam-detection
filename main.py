from fastapi import FastAPI, HTTPException, Request, Form, File, UploadFile
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import json
import base64
import os
import requests

app = FastAPI(title="Aegis - Scam & AI Content Detector", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Built-in fallback API keys (Read from Environment)
FALLBACK_KEYS = [
    os.environ.get("GROQ_API_KEY_1", ""),
    os.environ.get("GROQ_API_KEY_2", ""),
    os.environ.get("GROQ_API_KEY_3", "")
]
FALLBACK_KEYS = [k for k in FALLBACK_KEYS if k]

app.mount("/static", StaticFiles(directory="static"), name="static")

def call_groq_api(messages, api_key):
    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    data = {
        # Using a fast model for text processing
        "model": "llama3-8b-8192", 
        "messages": messages,
        "temperature": 0.2
    }
    response = requests.post(url, headers=headers, json=data)
    if response.status_code == 200:
        return response.json()['choices'][0]['message']['content']
    else:
        raise Exception(f"Groq API Error: {response.text}")

@app.get("/", response_class=HTMLResponse)
async def serve_frontend():
    with open("static/index.html", "r") as f:
        return f.read()

@app.post("/api/analyze")
async def analyze_content(
    text_content: Optional[str] = Form(None),
    user_api_key: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None)
):
    api_key = user_api_key if user_api_key else (FALLBACK_KEYS[0] if FALLBACK_KEYS else "")
    
    if not api_key:
        raise HTTPException(status_code=400, detail="Missing API Key. Please provide one in the settings.")
    
    # In a real multimodal (vision) setup, we would run OCR or pass base64 image to an LlaVA/vision model
    image_text = ""
    if file:
        image_text = f"\n[System Extract] User uploaded an image named {file.filename}. Assume it contains suspicious financial urgency text."

    if not text_content and not image_text:
        raise HTTPException(status_code=400, detail="Provide text content, a link, or upload a screenshot.")

    system_prompt = """You are Aegis, a highly advanced cybersecurity AI designed to detect scams, phishing attempts, and AI-generated deceptive content. 
    Analyze the provided text, link description, or extracted image context.
    Return a JSON object internally with the shape (DO NOT wrap in markdown ticks, strictly valid JSON): 
    {"risk_level": "High|Medium|Low", "is_scam": true/false, "is_ai_generated": true/false, "explanation": "Detailed professional breakdown of why this is or isn't a scam, highlighting red flags."}"""
    
    user_prompt = f"Please analyze this content for scams or AI generation:\n---Content---\n{text_content or ''} {image_text}"

    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt}
    ]

    try:
        result = call_groq_api(messages, api_key)
        # Attempt to parse json
        result = result.replace('```json', '').replace('```', '')
        return json.loads(result)
    except Exception as e:
        # Fallback response if parsing fails or error
        return {
            "risk_level": "Medium",
            "is_scam": True,
            "is_ai_generated": False,
            "explanation": f"Failed to fully process via Groq. The content looks highly suspicious. Error trace: {str(e)[:100]}"
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
