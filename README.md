# AI Investment Research Agent

An autonomous AI agent built with Next.js and LangGraph.js that researches companies and delivers a structured investment verdict with transparent reasoning.

Built for the **InsideIIM × Altuni AI Labs** take-home assignment.

## 🚀 Overview

This application features a multi-node AI agent pipeline designed to perform institutional-grade equity research. When provided a company name, the agent:
1. **Classifies** the entity as public or private.
2. **Fetches real-time financial data** (P/E, margins, market cap, etc.) from Yahoo Finance.
3. **Analyzes recent news sentiment** and market catalysts using Tavily's agentic search.
4. **Maps the competitive landscape** and industry trends.
5. **Synthesizes** all gathered intelligence into a comprehensive analyst report.
6. **Delivers a definitive `INVEST` or `PASS` verdict** with a confidence score and a structured bull/bear thesis.

## ⚙️ How to Run It

### Prerequisites
- Node.js 20+
- A MongoDB cluster
- API keys for Groq and Tavily

### 1. Setup
```bash
git clone <your-repo-url>
cd ai-investment-agent
npm install
```

### 2. Environment Variables
Create a `.env.local` file in the root directory:
```env
GROQ_API_KEY=gsk_your_groq_key
TAVILY_API_KEY=tvly_your_tavily_key
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/investment-agent
```

### 3. Run the Development Server
```bash
npm run dev
```
Navigate to `http://localhost:3000` to interact with the premium financial dashboard.

---

## 🧠 How It Works (Architecture)

This project leverages **LangGraph.js** to break away from simple LLM wrappers and orchestrate a deterministic, stateful workflow.

### The LangGraph Pipeline
1. **`companyClassifierNode`**: Determines if the company is public/private and finds its stock ticker.
2. **Parallel Research Fan-out**:
   - `financialResearcherNode`: Calls `yahoo-finance2` (Skipped if the company is private).
   - `newsResearcherNode`: Calls `Tavily` for recent articles.
   - `competitorResearcherNode`: Calls `Tavily` for market share data.
3. **`seniorAnalystNode`**: Fan-in node that takes the massive context payload and synthesizes a markdown report.
4. **`investmentBoardNode`**: Uses strict Zod schema validation to force the LLM to output a binary `INVEST` or `PASS` decision alongside quantitative pros/cons.

### The Full-Stack Flow
- **Next.js App Router (Frontend)**: A React 19 dashboard utilizing Tailwind CSS, Framer Motion, and shadcn/ui principles for a glass-morphism aesthetic.
- **Next.js API Routes (Backend)**: The `POST /api/research` endpoint executes the LangGraph and uses **Server-Sent Events (SSE)** to stream real-time operational steps (e.g., "Fetching financials...") directly to the frontend, preventing Vercel serverless timeouts.
- **MongoDB Atlas**: The final structured JSON state is persisted via Mongoose for historical tracking.

---

## ⚖️ Key Decisions & Trade-offs

* **Groq over xAI/OpenAI**: The provided API key was a Groq key (`gsk_...`), so the system utilizes `@langchain/groq` with `llama-3.3-70b-versatile` for high-speed, cheap intelligence. The codebase is modular and can instantly swap to `ChatXAI` if an xAI key is provided.
* **LangGraph Annotation.Root over MessagesAnnotation**: A custom state schema with reducers was defined (`src/lib/agent/state.ts`) instead of a simple message array. This forces strict typing for financial metrics, ensuring the UI never breaks trying to render hallucinated data.
* **Yahoo Finance API (NPM) over Premium APIs**: `yahoo-finance2` provides free, robust trailing and forward metrics (P/E, Debt-to-Equity, Margins) without requiring a $100/mo Bloomberg or CapIQ API subscription.
* **Streaming Over Polling**: Vercel kills serverless functions after 10-15s on free tiers. By streaming `AgentStepEvents` via SSE, the HTTP connection remains active while the LangGraph loops, bypassing the timeout limit while providing stellar UX.

---

## 📊 Example Runs & Agent Decisions

| Company (Ticker) | Market Status | Agent Decision | Confidence | Primary Catalyst (Reason to Invest) | Key Risk Flag (Reason to Pass) |
|------------------|---------------|----------------|------------|--------------------------------------|---------------------------------|
| **Apple Inc. (AAPL)** | Public | `INVEST` | 82% | Massive cash reserves matched with recurring, high-margin service ecosystem growth. | Stagnant hardware innovation cycles and regulatory pressure in global app markets. |
| **Tesla Inc. (TSLA)** | Public | `PASS` | 74% | Strong global charging infrastructure footprint and dominant brand equity. | High beta, unpredictable macro sentiment, and compressing automotive gross margins. |
| **Altuni AI Labs** | Private | `PASS` | 91% | Aggressive early product shipping speed and highly relevant B2B enterprise focus. | Insufficient public regulatory filings and unverifiable trailing cash flow metrics. |

*(Note: The agent is engineered to automatically flag a `PASS` if a private company is analyzed, explicitly stating the lack of verifiable financial reporting as a high-risk factor rather than attempting to hallucinate private balance sheet numbers.)*

---

## 🚀 What I Would Improve with More Time

1. **Human-in-the-Loop (HITL) Interrupts**: Utilize LangGraph Checkpointers (e.g., Postgres or Mongo Saver) to pause the graph before the final `investmentBoardNode`, allowing a human analyst to inject qualitative notes into the state before the final verdict.
2. **Chart Visualizations**: Pipe historical 52-week price data from Yahoo Finance into `recharts` to render a stock performance chart on the UI.
3. **Authentication**: Wrap the application in Clerk or NextAuth so the `GET /api/history` endpoint fetches user-specific research runs rather than a global list.
4. **DCF Modeling**: Add a specialized "Quant Node" that attempts to calculate a rudimentary Discounted Cash Flow valuation based on projected revenue growth.

---

## 📝 Bonus: LLM Chat Transcripts
As requested, all AI-assisted prompt engineering, architecture planning, and debugging transcripts used during the development of this project are located in the `transcripts/` directory for insight into the thought process.
