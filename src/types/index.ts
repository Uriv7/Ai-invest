// ============================================================
// AI Investment Research Agent — Shared Type Definitions
// ============================================================

/** Market classification of the company */
export type MarketStatus = "PUBLIC" | "PRIVATE" | "UNKNOWN";

/** Final investment verdict */
export type InvestmentDecision = "INVEST" | "PASS";

/** Financial metrics fetched from Yahoo Finance */
export interface FinancialMetrics {
  ticker: string;
  currentPrice: number | null;
  currency: string;
  marketCap: number | null;
  peRatio: number | null;
  forwardPE: number | null;
  profitMarginPercent: number | null;
  revenueGrowthYoY: number | null;
  debtToEquity: number | null;
  returnOnEquity: number | null;
  fiftyTwoWeekHigh: number | null;
  fiftyTwoWeekLow: number | null;
  dividendYieldPercent: number | null;
  beta: number | null;
  sector: string | null;
  industry: string | null;
}

/** A news article from Tavily search */
export interface NewsArticle {
  title: string;
  url: string;
  summary: string;
  publishedDate?: string;
}

/** The structured investment thesis */
export interface InvestmentThesis {
  summary: string;
  pros: string[];
  cons: string[];
}

/** A source/citation used by the agent */
export interface Source {
  title: string;
  url: string;
}

/** Complete research result — what gets saved to MongoDB and rendered in the UI */
export interface ResearchResult {
  companyName: string;
  ticker: string | null;
  marketStatus: MarketStatus;
  decision: InvestmentDecision;
  confidenceScore: number;
  financialData: FinancialMetrics | null;
  newsArticles: NewsArticle[];
  competitorAnalysis: string | null;
  analystReport: string;
  investmentThesis: InvestmentThesis;
  sources: Source[];
  createdAt: Date;
}

/** Streaming step events pushed to the frontend via SSE */
export interface AgentStepEvent {
  type: "step" | "result" | "error";
  step?: string;
  nodeId?: string;
  status?: "running" | "completed" | "failed";
  data?: ResearchResult;
  error?: string;
  timestamp: string;
}

/** API request body for /api/research */
export interface ResearchRequest {
  companyName: string;
}

/** History item from MongoDB (with _id) */
export interface ResearchHistoryItem extends ResearchResult {
  _id: string;
}
