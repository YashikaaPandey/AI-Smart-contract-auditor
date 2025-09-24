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
      console.error(`API request failed with status ${res.status}`);
      throw new Error(`API request failed with status ${res.status}`);
    }

    const data = await res.json();

    // Extract sections
    const reportSection: string = data.report || "Audit parsing failed.";
    const metricsSection: { metric: string; score: number }[] = Array.isArray(data.metrics)
      ? data.metrics
      : [];

    // Suggestions: always return an array
    let suggestionsSection: string[] = [];
    if (Array.isArray(data.suggestions)) {
      suggestionsSection = data.suggestions;
    } else if (typeof data.suggestions === "string") {
      suggestionsSection = data.suggestions
        .split(/\n/)
        .map((s: string) => s.trim())
        .filter((s: string) => s.length > 0);
    } else {
      suggestionsSection = ["No suggestions available."];
    }

    return {
      report: reportSection,
      metrics: metricsSection,
      suggestions: suggestionsSection,
    };
  } catch (error) {
    console.error("Failed to fetch audit results:", error);
    return {
      report: "Audit parsing failed.",
      metrics: [],
      suggestions: ["No suggestions available."],
    };
  }
};
