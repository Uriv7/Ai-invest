import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db/connection";
import { Research } from "@/lib/db/models/Research";
import { researchGraph } from "@/lib/agent/graph";

// Required for SSE streaming on Vercel
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { companyName } = await req.json();

    if (!companyName) {
      return NextResponse.json(
        { error: "Company name is required" },
        { status: 400 }
      );
    }

    const stream = new TransformStream();
    const writer = stream.writable.getWriter();
    const encoder = new TextEncoder();

    // Run graph asynchronously
    (async () => {
      try {
        const eventStream = await researchGraph.stream(
          { companyName },
          { streamMode: "updates" }
        );

        let finalState: any = null;

        for await (const chunk of eventStream) {
          // chunk is an object with a single key (the node name) containing the state update
          const nodeName = Object.keys(chunk)[0];
          const stateUpdate = Object.values(chunk)[0] as any;
          finalState = { ...finalState, ...stateUpdate };

          if (stateUpdate?.currentStep) {
            await writer.write(
              encoder.encode(
                `data: ${JSON.stringify({
                  type: "step",
                  nodeId: nodeName,
                  step: stateUpdate.currentStep,
                  timestamp: new Date().toISOString(),
                })}\n\n`
              )
            );
          }
        }

        // Save to DB
        await dbConnect();
        const researchDoc = await Research.create({
          companyName: finalState.companyName || companyName,
          ticker: finalState.ticker,
          marketStatus: finalState.marketStatus,
          decision: finalState.decision,
          confidenceScore: finalState.confidenceScore,
          financialData: finalState.financialData,
          newsArticles: finalState.newsArticles,
          competitorAnalysis: finalState.competitorAnalysis,
          analystReport: finalState.analystReport,
          investmentThesis: finalState.investmentThesis,
          sources: finalState.sources,
        });

        // Send final result
        await writer.write(
          encoder.encode(
            `data: ${JSON.stringify({
              type: "result",
              data: researchDoc.toJSON(),
              timestamp: new Date().toISOString(),
            })}\n\n`
          )
        );
      } catch (error) {
        console.error("Agent error:", error);
        await writer.write(
          encoder.encode(
            `data: ${JSON.stringify({
              type: "error",
              error:
                error instanceof Error ? error.message : "Unknown error occurred",
              timestamp: new Date().toISOString(),
            })}\n\n`
          )
        );
      } finally {
        await writer.close();
      }
    })();

    return new Response(stream.readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Route error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
