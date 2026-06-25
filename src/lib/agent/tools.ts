// ============================================================
// Research Tools — Yahoo Finance + Tavily Search
// ============================================================

import type { FinancialMetrics, NewsArticle, Source } from "@/types";
import yahooFinance from "yahoo-finance2";

// ============================================================
// 1. YAHOO FINANCE — Financial Data Fetcher
// ============================================================

/**
 * Fetches comprehensive financial metrics for a given stock ticker.
 * Uses yahoo-finance2 for real data — runs server-side only.
 */
export async function fetchFinancialData(
  ticker: string
): Promise<{ metrics: FinancialMetrics; sources: Source[] }> {
  try {
    const [quote, quoteSummary] = await Promise.all([
      (yahooFinance.quote(ticker) as Promise<any>).catch(() => null),
      (yahooFinance.quoteSummary(ticker, {
        modules: ["financialData", "summaryDetail", "defaultKeyStatistics", "assetProfile"],
      }) as Promise<any>).catch(() => null),
    ]);

    const financialData = quoteSummary?.financialData;
    const summaryDetail = quoteSummary?.summaryDetail;
    const keyStats = quoteSummary?.defaultKeyStatistics;
    const profile = quoteSummary?.assetProfile;

    const metrics: FinancialMetrics = {
      ticker,
      currentPrice: quote?.regularMarketPrice ?? null,
      currency: quote?.currency ?? "USD",
      marketCap: quote?.marketCap ?? null,
      peRatio: summaryDetail?.trailingPE ?? null,
      forwardPE: summaryDetail?.forwardPE ?? null,
      profitMarginPercent: financialData?.profitMargins
        ? financialData.profitMargins * 100
        : null,
      revenueGrowthYoY: financialData?.revenueGrowth
        ? financialData.revenueGrowth * 100
        : null,
      debtToEquity: financialData?.debtToEquity ?? null,
      returnOnEquity: financialData?.returnOnEquity
        ? financialData.returnOnEquity * 100
        : null,
      fiftyTwoWeekHigh: summaryDetail?.fiftyTwoWeekHigh ?? null,
      fiftyTwoWeekLow: summaryDetail?.fiftyTwoWeekLow ?? null,
      dividendYieldPercent: summaryDetail?.dividendYield
        ? summaryDetail.dividendYield * 100
        : null,
      beta: summaryDetail?.beta ?? null,
      sector: profile?.sector ?? null,
      industry: profile?.industry ?? null,
    };

    const sources: Source[] = [
      {
        title: `Yahoo Finance: ${ticker} Quote`,
        url: `https://finance.yahoo.com/quote/${ticker}`,
      },
      {
        title: `Yahoo Finance: ${ticker} Financials`,
        url: `https://finance.yahoo.com/quote/${ticker}/financials`,
      },
    ];

    return { metrics, sources };
  } catch (error) {
    console.error(`[YahooFinance] Error fetching ${ticker}:`, error);
    throw new Error(
      `Failed to fetch financial data for ${ticker}: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

// ============================================================
// 2. TAVILY SEARCH — News & Competitor Research
// ============================================================

interface TavilySearchResult {
  title: string;
  url: string;
  content: string;
  publishedDate?: string;
}

interface TavilyResponse {
  results: TavilySearchResult[];
}

/**
 * Searches for recent news about a company using the Tavily API.
 */
export async function searchCompanyNews(
  companyName: string
): Promise<{ articles: NewsArticle[]; sources: Source[] }> {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) throw new Error("TAVILY_API_KEY is not set");

  const query = `${companyName} latest financial news market analysis 2024 2025`;

  const response = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: apiKey,
      query,
      search_depth: "advanced",
      max_results: 8,
      include_answer: false,
      include_raw_content: false,
    }),
  });

  if (!response.ok) {
    throw new Error(`Tavily API error: ${response.status} ${response.statusText}`);
  }

  const data: TavilyResponse = await response.json();

  const articles: NewsArticle[] = data.results.map((r) => ({
    title: r.title,
    url: r.url,
    summary: r.content.slice(0, 500),
    publishedDate: r.publishedDate,
  }));

  const sources: Source[] = data.results.map((r) => ({
    title: r.title,
    url: r.url,
  }));

  return { articles, sources };
}

/**
 * Searches for competitive landscape and industry analysis using Tavily.
 */
export async function analyzeCompetitors(
  companyName: string
): Promise<{ analysis: string; sources: Source[] }> {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) throw new Error("TAVILY_API_KEY is not set");

  const query = `${companyName} competitors market share industry analysis competitive landscape`;

  const response = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: apiKey,
      query,
      search_depth: "advanced",
      max_results: 5,
      include_answer: true,
      include_raw_content: false,
    }),
  });

  if (!response.ok) {
    throw new Error(`Tavily API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  // Combine the Tavily answer with individual result summaries
  let analysis = data.answer || "";
  if (data.results && data.results.length > 0) {
    const resultSummaries = data.results
      .map((r: TavilySearchResult) => `- ${r.title}: ${r.content.slice(0, 300)}`)
      .join("\n");
    analysis += `\n\nKey findings:\n${resultSummaries}`;
  }

  const sources: Source[] = (data.results || []).map((r: TavilySearchResult) => ({
    title: r.title,
    url: r.url,
  }));

  return { analysis, sources };
}
