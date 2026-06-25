// ============================================================
// Research Result — Mongoose Model
// ============================================================

import mongoose, { Schema, models, model } from "mongoose";

const NewsArticleSchema = new Schema(
  {
    title: { type: String, required: true },
    url: { type: String, required: true },
    summary: { type: String, required: true },
    publishedDate: { type: String },
  },
  { _id: false }
);

const SourceSchema = new Schema(
  {
    title: { type: String, required: true },
    url: { type: String, required: true },
  },
  { _id: false }
);

const InvestmentThesisSchema = new Schema(
  {
    summary: { type: String, required: true },
    pros: [{ type: String }],
    cons: [{ type: String }],
  },
  { _id: false }
);

const FinancialMetricsSchema = new Schema(
  {
    ticker: String,
    currentPrice: Number,
    currency: String,
    marketCap: Number,
    peRatio: Number,
    forwardPE: Number,
    profitMarginPercent: Number,
    revenueGrowthYoY: Number,
    debtToEquity: Number,
    returnOnEquity: Number,
    fiftyTwoWeekHigh: Number,
    fiftyTwoWeekLow: Number,
    dividendYieldPercent: Number,
    beta: Number,
    sector: String,
    industry: String,
  },
  { _id: false }
);

const ResearchSchema = new Schema(
  {
    companyName: { type: String, required: true, index: true },
    ticker: { type: String, default: null },
    marketStatus: {
      type: String,
      enum: ["PUBLIC", "PRIVATE", "UNKNOWN"],
      required: true,
    },
    decision: {
      type: String,
      enum: ["INVEST", "PASS"],
      required: true,
    },
    confidenceScore: { type: Number, required: true, min: 0, max: 100 },
    financialData: { type: FinancialMetricsSchema, default: null },
    newsArticles: [NewsArticleSchema],
    competitorAnalysis: { type: String, default: null },
    analystReport: { type: String, required: true },
    investmentThesis: { type: InvestmentThesisSchema, required: true },
    sources: [SourceSchema],
  },
  {
    timestamps: true,
  }
);

// Prevent model recompilation during Next.js hot-reloads
export const Research =
  models.Research || model("Research", ResearchSchema);

export type ResearchDocument = mongoose.InferSchemaType<typeof ResearchSchema>;
