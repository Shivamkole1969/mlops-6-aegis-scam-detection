---
title: Aegis Detector
emoji: 🛡️
colorFrom: blue
colorTo: indigo
sdk: docker
app_port: 7860
---
# Aegis - Scam & AI Content Detector

## 🌟 STAR Summary

- **Situation:** With the rise of Generative AI, malicious actors are increasingly using LLMs to craft highly convincing phishing emails, spoof bank SMS messages, and generate deceptive deepfake texts at scale, leaving non-technical users completely vulnerable to financial scams.
- **Task:** Build a public-facing cybersecurity GenAI tool ("Aegis") that allows anyone to easily paste suspicious messages, links, or upload screenshots to receive an instant, intelligent risk assessment detailing whether the content was AI-generated or constitutes a scam.
- **Action:** 
  1. **Backend LLM Integration:** Developed an asynchronous **FastAPI** backend that interfaces directly with the ultra-fast **Groq API**. Employed prompt engineering techniques and system instructions to condition the `Llama3` model into a strict cybersecurity analyst role.
  2. **Multi-modal Capabilities:** Engineered endpoints capable of receiving both raw text and binary image files (screenshots) via `Multipart/form-data`, passing extracted contextual signals to the inference engine.
  3. **Frontend Architecture:** Designed an intuitive, responsive, and aesthetically premium "Glassmorphism" UI using pure **HTML/CSS/JS**. Implemented custom API key injection on the client side, allowing users to override default rate-limited keys with their own for persistent, private usage.
- **Result:** Successfully deployed a robust AI-detection application capable of breaking down the anatomy of a scam step-by-step for the end user in under 800 milliseconds per request. The architecture serves as a scalable template for trust/safety pipelines in FinTech environments looking to protect users from fraud.

## 🛠 Tech Stack Used (MLOps Alignment)
*   **Backend REST API:** Python (FastAPI, Uvicorn)
*   **Generative AI / LLMs:** Groq API (Llama 3 8B), Prompt Engineering
*   **Frontend UI:** Vanilla JavaScript, HTML5, CSS3 (Glassmorphism design)
*   **Dependency Management:** `pip`, `uvicorn`

## 🚀 How to Run Locally

1. Create a virtual environment and install dependencies:
   ```bash
   pip install fastapi uvicorn requests python-multipart
   ```
2. Start the FastAPI server (which also serves the static frontend):
   ```bash
   python main.py
   ```
3. Open your browser and navigate to:
   [http://localhost:8000](http://localhost:8000)

## 🌐 Deploying to HuggingFace Spaces (Optional)

This project can be easily deployed for free on HF Spaces as a Docker container.
1. Create a new Space on huggingface.co -> Select "Docker" as the environment.
2. Push your `main.py`, `static` folder, and `Dockerfile` to the repository.
3. Your app will automatically build and become publicly accessible to anyone!
