# SmartCard AI

SmartCard AI is a from-scratch starter project for a digital business card, QR contact sharing, money manager, and fast RAG-style assistant.

## What It Does

- Stores personal/business card details.
- Builds a vCard payload and QR code.
- Downloads a `.vcf` contact file.
- Tracks income, expenses, savings, and monthly goal progress.
- Draws a simple money chart.
- Answers questions using a small local retrieval and caching flow.

## Run It

Open `index.html` in your browser.

No install step is required. The QR image uses the public `api.qrserver.com` image endpoint, so the QR code needs internet access to render. The app data is saved in browser `localStorage`.

## Production Upgrade Path

For a real deployed system:

1. Frontend: React, Next.js, or Flutter.
2. API Gateway: authentication, rate limits, request validation.
3. Database: PostgreSQL for profile, QR/vCard records, transactions, goals.
4. Cache: Redis for QR payloads, repeated answers, user summaries.
5. Vector DB: Pinecone, Weaviate, Qdrant, or pgvector.
6. Embeddings: Gemini Embeddings or OpenAI text-embedding models.
7. Re-ranking: cross-encoder or managed ranking model.
8. LLM: Gemini Flash for fast default answers; GPT-4/Claude fallback for hard cases.
9. Monitoring: latency, cost, cache hit rate, groundedness, user feedback.

## Architecture Diagram

Use `architecture.svg` as the uploadable architecture diagram.

## Form Answers

Open `answers.md` for ready-to-paste answers to the architecture questions.
