// ============================================================
// LangGraph Compilation — Orchestrating the Nodes
// ============================================================

import { StateGraph, START, END } from "@langchain/langgraph";
import { AgentState } from "./state";
import {
  companyClassifierNode,
  financialResearcherNode,
  newsResearcherNode,
  competitorResearcherNode,
  seniorAnalystNode,
  investmentBoardNode,
} from "./nodes";

// Create the StateGraph
const workflow = new StateGraph(AgentState)
  // Add all nodes
  .addNode("classifier", companyClassifierNode)
  .addNode("finance", financialResearcherNode)
  .addNode("news", newsResearcherNode)
  .addNode("competitors", competitorResearcherNode)
  .addNode("analyst", seniorAnalystNode)
  .addNode("board", investmentBoardNode)

  // Entry point
  .addEdge(START, "classifier")

  // After classification, fan out to parallel research tasks
  // (The finance node will simply skip doing work if the company is private)
  .addEdge("classifier", "finance")
  .addEdge("classifier", "news")
  .addEdge("classifier", "competitors")

  // After all research tasks finish, fan in to the analyst
  .addEdge(["finance", "news", "competitors"], "analyst")

  // Analyst feeds into the final board decision
  .addEdge("analyst", "board")

  // Terminal node
  .addEdge("board", END);

// Compile the graph
export const researchGraph = workflow.compile();
