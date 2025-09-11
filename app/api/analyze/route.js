// app/api/analyze/route.js
import util from "util";
import { analyzeContract as geminiAnalyze } from "../utils/geminiClient";

export async function POST(req) {
  try {
    const { contract } = await req.json();
    console.log("Contract received:", contract);

    if (!process.env.GEMINI_API_KEY) {
      console.error("API key missing!");
      return new Response(
        JSON.stringify({
          report: "API key not set",
          metrics: [],
          suggestions: [],
        }),
        { status: 500 }
      );
    }

    const parsedResults = await geminiAnalyze(contract);

    // ✅ Pretty-print results so metrics don't collapse into [Object]
   console.log("Parsed results:", util.inspect(parsedResults, { depth: null, colors: true }));


    const auditResults = {
      report:
        parsedResults.find((s) => s.section === "Audit Report")?.details ||
        "Audit parsing failed.",
      metrics:
        parsedResults.find((s) => s.section === "Metric Scores")?.details || [],
      suggestions:
        parsedResults.find((s) => s.section === "Suggestions for Improvement")
          ?.details || ["No suggestions available."],
    };

    return new Response(JSON.stringify(auditResults));
  } catch (err) {
    console.error("Error in /api/analyze:", err);
    return new Response(
      JSON.stringify({
        report: "Audit parsing failed.",
        metrics: [],
        suggestions: ["No suggestions available."],
      }),
      { status: 500 }
    );
  }
}
