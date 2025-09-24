// app/utils/ai-prompt.ts

export interface AuditResult {
  report: string;
  metrics: { metric: string; score: number }[];
  suggestions: string[];
}

export const analyzeContract = async (contract: string): Promise<AuditResult> => {
  try {
    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contract }),
    });

    if (!res.ok) {
      throw new Error(`API request failed with status ${res.status}`);
    }

    const data = await res.json();

    // If AI returned a stringified JSON array, parse it
    let parsed = data;
    if (typeof data === "string") {
      parsed = JSON.parse(data);
    }

    // If AI returned the array of sections
    if (Array.isArray(parsed)) {
      const reportSection = parsed.find((s) => s.section === "Audit Report")?.details || "No report available.";
      const metricsSection = parsed.find((s) => s.section === "Metric Scores")?.details || [];
      const suggestionsRaw = parsed.find((s) => s.section === "Suggestions for Improvement")?.details || [];

      // Ensure suggestions are always an array of strings
      let suggestionsSection: string[] = [];
      if (Array.isArray(suggestionsRaw)) {
        suggestionsSection = suggestionsRaw;
      } else if (typeof suggestionsRaw === "string") {
        suggestionsSection = suggestionsRaw
          .split(/\n/)
          .map((s: string) => s.trim())
          .filter((s: string) => s.length > 0);
      }

      return {
        report: reportSection,
        metrics: metricsSection,
        suggestions: suggestionsSection,
      };
    }

    // Fallback if data already in expected shape
    return {
      report: data.report || "No report available.",
      metrics: data.metrics || [],
      suggestions: data.suggestions || ["No suggestions available."],
    };
  } catch (error) {
    console.error("Failed to parse audit results:", error);
    return {
      report: "Audit parsing failed.",
      metrics: [],
      suggestions: ["Parsing failed."],
    };
  }
};
