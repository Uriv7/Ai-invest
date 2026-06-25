// ============================================================
// LangGraph Agent State — Annotation.Root Schema
// ============================================================

import { Annotation } from "@langchain/langgraph";
import type {
  MarketStatus,
  InvestmentDecision,
  FinancialMetrics,
  NewsArticle,
  InvestmentThesis,
  Source,
} from "@/types";

/**
 * The shared state that flows through every node in the LangGraph pipeline.
 * Uses Annotation.Root for type-safe state management with reducers.
 *
 * Each node reads the fields it needs and returns partial updates.
 * Fields without reducers use last-write-wins semantics.
 */
export const AgentState = Annotation.Root({
  // ---- Input ----
  companyName: Annotation<string>,

  // ---- Classification ----
  marketStatus: Annotation<MarketStatus>({
    reducer: (_prev, next) => next,
    default: () => "UNKNOWN" as MarketStatus,
  }),
  ticker: Annotation<string | null>({
    reducer: (_prev, next) => next,
    default: () => null,
  }),
  companyDescription: Annotation<string>({
    reducer: (_prev, next) => next,
    default: () => "",
  }),

  // ---- Research Data ----
  financialData: Annotation<FinancialMetrics | null>({
    reducer: (_prev, next) => next,
    default: () => null,
  }),
  newsArticles: Annotation<NewsArticle[]>({
    reducer: (_prev, next) => next,
    default: () => [],
  }),
  competitorAnalysis: Annotation<string | null>({
    reducer: (_prev, next) => next,
    default: () => null,
  }),

  // ---- Analysis ----
  analystReport: Annotation<string>({
    reducer: (_prev, next) => next,
    default: () => "",
  }),

  // ---- Decision ----
  decision: Annotation<InvestmentDecision>({
    reducer: (_prev, next) => next,
    default: () => "PASS" as InvestmentDecision,
  }),
  confidenceScore: Annotation<number>({
    reducer: (_prev, next) => next,
    default: () => 0,
  }),
  investmentThesis: Annotation<InvestmentThesis>({
    reducer: (_prev, next) => next,
    default: () => ({ summary: "", pros: [], cons: [] }),
  }),

  // ---- Metadata ----
  sources: Annotation<Source[]>({
    reducer: (prev, next) => [...prev, ...next],
    default: () => [],
  }),
  currentStep: Annotation<string>({
    reducer: (_prev, next) => next,
    default: () => "",
  }),
  error: Annotation<string | null>({
    reducer: (_prev, next) => next,
    default: () => null,
  }),
});

export type AgentStateType = typeof AgentState.State;
