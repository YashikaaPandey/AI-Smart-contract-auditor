import { GoogleGenerativeAI } from "@google/generative-ai";

export async function analyzeContract(contractCode) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
You are an AI smart contract auditor.
Analyze the following Solidity contract and return ONLY valid JSON in this exact structure:

[
  { "section": "Audit Report", "details": "..." },
  { "section": "Metric Scores", "details": [
      { "metric": "Security", "score": 0 },
      { "metric": "Performance", "score": 0 },
      { "metric": "Other Key Areas", "score": 0 },
      { "metric": "Gas Efficiency", "score": 0 },
      { "metric": "Code Quality", "score": 0 },
      { "metric": "Documentation", "score": 0 }
    ]
  },
  { "section": "Suggestions for Improvement", "details": "Suggestions for improving the smart contract in terms of security, performance, and any other weaknesses" }
]

Rules:
- Do not include markdown formatting like \`\`\`json.
- Scores must be integers (0–10).
- Suggestions must be returned as a numbered list in a single string (1., 2., 3., ...).

Contract:
${contractCode}
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response.text();

  try {
    let parsed = JSON.parse(response);

    // Ensure metric scores are numbers
    parsed.forEach(section => {
      if (section.section === "Metric Scores" && Array.isArray(section.details)) {
        section.details = section.details.map(metric => ({
          metric: metric.metric,
          score: Number(metric.score) || 0
        }));
      }

      // Format suggestions as numbered list
      if (section.section === "Suggestions for Improvement" && typeof section.details === "string") {
        const suggestionsArray = section.details
          .split(/[\n]+/)
          .map(s => s.trim())
          .filter(Boolean);

        // Rebuild as numbered string if not already numbered
        section.details = suggestionsArray
          .map((s, idx) => (s.match(/^\d+\./) ? s : `${idx + 1}. ${s}`))
          .join("\n");
      }
    });

    return parsed;
  } catch (err) {
    console.warn("⚠️ Gemini returned unstructured text, using fallback.", err);
    return [
      { section: "Audit Report", details: response },
      { section: "Metric Scores", details: [] },
      { section: "Suggestions for Improvement", details: "1. Parsing failed." }
    ];
  }
}

