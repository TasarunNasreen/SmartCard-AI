# SmartCard AI Form Answers (simple questions basic )

## What architecture would you choose and why?

I would choose a modular RAG architecture with deterministic business logic for finance calculations. The system has a web/mobile frontend for the digital card, QR sharing, and money dashboard. Requests go through an API Gateway for authentication, rate limiting, and routing. Profile, vCard, transactions, and savings goals are stored in a relational database. Knowledge used by the assistant is indexed into a vector database with embeddings, while exact finance totals are calculated by backend services instead of guessed by the LLM.

This architecture is fast because common answers, QR payloads, profile lookups, and repeated AI responses are cached in Redis. It is accurate because the assistant retrieves trusted user data, re-ranks the most relevant chunks, uses structured prompts with strict grounding rules, and cites the context used. The LLM is used for explanation and recommendations, while calculations, validation, and progress tracking remain deterministic.

## Which components would you use in your system?

- RAG (Retrieval-Augmented Generation)
- Vector Database
- Embedding Model
- Caching Layer
- Re-ranking
- Prompt Engineering
- Memory Layer
- API Gateway
- Monitoring / Evaluation
- Other: relational database, QR/vCard service, authentication, background workers, audit logs

## Which LLM would you choose?

Gemini Flash.

I would choose Gemini Flash for the main assistant because it is fast, cost-efficient, and strong enough for short personal finance explanations, profile summaries, and card-sharing guidance. For complex financial planning or long reasoning, I would add a fallback to GPT-4 or Claude, but the default production path should prioritize speed and low latency.

## How would you improve response accuracy?

I would improve accuracy by separating facts, calculations, and generation. The database is the source of truth for profile and transaction data. The backend calculates totals, savings rate, category spend, and goal progress before the LLM sees the request. RAG retrieves only relevant verified context from the user's profile, vCard, transaction summaries, and help documents. A re-ranker improves context quality before generation.

The prompt would instruct the model to answer only from retrieved context, cite which data it used, and say when information is missing. I would add validation checks for numerical answers, cache only versioned responses, collect thumbs-up/down feedback, run regression tests on common questions, monitor latency and groundedness, and use human review for risky financial advice.

## Short System Description

SmartCard AI is a digital business card and money manager. Users enter personal details, generate a QR code containing their vCard, track income and expenses, set a monthly savings goal, and ask an AI assistant questions about their profile or financial progress. The assistant uses RAG and deterministic calculations so responses are both fast and grounded in the user's real data.

## Build Steps

1. Create the frontend with HTML, CSS, and JavaScript.
2. Add a profile form and convert the profile into vCard text.
3. Generate a QR image from the vCard payload.
4. Store profile, goal, and transaction data in localStorage for the prototype.
5. Add transaction entry, totals, savings, goal progress, and chart rendering.
6. Build a simple retrieval layer over profile and money summaries.
7. Add a cache for repeated assistant questions.
8. For production, replace localStorage with PostgreSQL, add Redis, add a vector database, add real embeddings, and connect Gemini Flash through a secure backend.

## Files Included

- `index.html`: user interface
- `styles.css`: responsive visual design
- `app.js`: QR, vCard, money tracking, chart, retrieval, and assistant logic
- `architecture.svg`: architecture diagram for upload
