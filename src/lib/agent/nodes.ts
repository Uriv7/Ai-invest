// ============================================================
// LangGraph Nodes — The Agentic Workflow
// ============================================================

import { ChatGroq } from "@langchain/groq";
import { z } from "zod";
import type { AgentStateType } from "./state";
import {
  COMPANY_CLASSIFIER_PROMPT,
  FINANCIAL_ANALYST_PROMPT,
  INVESTMENT_BOARD_PROMPT,
} from "./prompts";
import {
  fetchFinancialData,
  searchCompanyNews,
  analyzeCompetitors,
} from "./tools";

// Initialize LLM. Using Groq for speed, but fallback to xAI if needed
// The key provided (gsk_...) is a Groq key.
const getLLM = (temperature = 0, model = "llama-3.3-70b-versatile") => {
  return new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: model,
    temperature: temperature,
  });
};

// ============================================================
// 1. Company Classifier Node
// ============================================================
export async function companyClassifierNode(state: AgentStateType) {
  console.log(`[Node] Classifying: ${state.companyName}`);
  const llm = getLLM(0, "llama-3.1-8b-instant"); // Fast model for classification

  const schema = z.object({
    marketStatus: z.enum(["PUBLIC", "PRIVATE", "UNKNOWN"]),
    ticker: z.string().nullable(),
    description: z.string(),
  });

  const structuredLlm = llm.withStructuredOutput(schema);
  
  const response = await structuredLlm.invoke([
    { role: "system", content: COMPANY_CLASSIFIER_PROMPT },
    { role: "user", content: `Company Name: ${state.companyName}` },
  ]);

  return {
    marketStatus: response.marketStatus,
    ticker: response.ticker,
    companyDescription: response.description,
    currentStep: `Classified as ${response.marketStatus} company`,
  };
}

// ============================================================
// 2A. Financial Researcher Node
// ============================================================
export async function financialResearcherNode(state: AgentStateType) {
  if (state.marketStatus !== "PUBLIC" || !state.ticker) {
    return { currentStep: "Skipping financial data (Private company)" };
  }

  console.log(`[Node] Fetching financials for: ${state.ticker}`);
  try {
    const { metrics, sources } = await fetchFinancialData(state.ticker);
    return {
      financialData: metrics,
      sources: sources,
      currentStep: "Fetched financial metrics from Yahoo Finance",
    };
  } catch (error) {
    console.error("Financial fetch error:", error);
    return {
      error: "Failed to fetch financial data",
      currentStep: "Error fetching financial metrics",
    };
  }
}

// ============================================================
// 2B. News Researcher Node
// ============================================================
export async function newsResearcherNode(state: AgentStateType) {
  console.log(`[Node] Fetching news for: ${state.companyName}`);
  try {
    const { articles, sources } = await searchCompanyNews(state.companyName);
    return {
      newsArticles: articles,
      sources: sources,
      currentStep: "Analyzed recent news and market sentiment",
    };
  } catch (error) {
    console.error("News fetch error:", error);
    return {
      error: "Failed to fetch news",
      currentStep: "Error fetching news",
    };
  }
}

// ============================================================
// 2C. Competitor Researcher Node
// ============================================================
export async function competitorResearcherNode(state: AgentStateType) {
  console.log(`[Node] Analyzing competitors for: ${state.companyName}`);
  try {
    const { analysis, sources } = await analyzeCompetitors(state.companyName);
    return {
      competitorAnalysis: analysis,
      sources: sources,
      currentStep: "Mapped competitive landscape and industry trends",
    };
  } catch (error) {
    console.error("Competitor analysis error:", error);
    return {
      error: "Failed to analyze competitors",
      currentStep: "Error analyzing competitors",
    };
  }
}

// ============================================================
// 3. Senior Analyst Node (Synthesis)
// ============================================================
export async function seniorAnalystNode(state: AgentStateType) {
  console.log(`[Node] Synthesizing data for: ${state.companyName}`);
  const llm = getLLM(0.2); // Slightly higher temp for creative synthesis

  const dataPayload = `
    Company: ${state.companyName}
    Status: ${state.marketStatus}
    Ticker: ${state.ticker || "N/A"}
    Description: ${state.companyDescription}
    
    Financial Metrics:
    ${JSON.stringify(state.financialData || "Not available (Private company)", null, 2)}
    
    Recent News & Sentiment:
    ${JSON.stringify(state.newsArticles, null, 2)}
    
    Competitor Analysis:
    ${state.competitorAnalysis}
  `;

  const response = await llm.invoke([
    { role: "system", content: FINANCIAL_ANALYST_PROMPT },
    { role: "user", content: `Please analyze the following data:\n${dataPayload}` },
  ]);

  return {
    analystReport: typeof response.content === "string" ? response.content : "",
    currentStep: "Synthesized comprehensive research report",
  };
}

// ============================================================
// 4. Investment Board Node (Decision)
// ============================================================
export async function investmentBoardNode(state: AgentStateType) {
  console.log(`[Node] Making final decision for: ${state.companyName}`);
  const llm = getLLM(0); // Strict, deterministic decision

  const schema = z.object({
    decision: z.enum(["INVEST", "PASS"]),
    confidenceScore: z.number().min(0).max(100),
    investmentThesis: z.object({
      summary: z.string(),
      pros: z.array(z.string()).min(3).max(5),
      cons: z.array(z.string()).min(3).max(5),
    }),
  });

  // Explicitly name the tool extraction for better compatibility with Groq's parser
  const structuredLlm = llm.withStructuredOutput(schema, { name: "extract" });

  const response = await structuredLlm.invoke([
    { role: "system", content: INVESTMENT_BOARD_PROMPT },
    { 
      role: "user", 
      content: `Please render a final verdict based on this analyst report:\n\n${state.analystReport}` 
    },
  ]);

  return {
    decision: response.decision,
    confidenceScore: response.confidenceScore,
    investmentThesis: response.investmentThesis,
    currentStep: `Final Verdict: ${response.decision}`,
  };
}
