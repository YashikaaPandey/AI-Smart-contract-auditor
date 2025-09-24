import OpenAI from "openai";

export interface AuditMetric {
  metric: string;
  score: number;
}

export interface AuditResult {
  section: string;
  details: string | AuditMetric[];
}

export const analyzeContract = async (
  contract: string,
  apiKey: string
): Promise<AuditResult[]> => {
  const openai = new OpenAI({
    apiKey,
  });

  const params = {
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: `Your role and goal is to be an AI Smart Contract Auditor. Your job is to perform an audit on the given smart contract. Here is the smart contract: ${contract}.
        Please provide the results in the following JSON array format for easy front-end display:
        [
          {
            "section": "Audit Report",
            "details": "A detailed audit report of the smart contract, covering security, performance, and any other relevant aspects."
          },
          {
            "section": "Metric Scores",
            "details": [
              {
                "metric": "Security",
                "score": 0-10
              },
              {
                "metric": "Performance",
                "score": 0-10
              },
              {
                "metric": "Other Key Areas",
                "score": 0-10
              },
              {
                "metric": "Gas Efficiency",
                "score": 0-10
              },
              {
                "metric": "Code Quality",
                "score": 0-10
              },
              {
                "metric": "Documentation",
                "score": 0-10
              }
            ]
          },
          {
            "section": "Suggestions for Improvement",
            "details": "Suggestions for improving the smart contract in terms of security, performance, and any other identified weaknesses."
          }
        ]`,
      },
    ],
  };

  const chatCompletion = await openai.chat.completions.create(params);

  const rawContent = chatCompletion.choices[0]?.message?.content ?? "[]";

  let auditResults: AuditResult[] = [];
  try {
    auditResults = JSON.parse(rawContent);
  } catch (error) {
    console.error("Failed to parse AI response as JSON:", error, rawContent);
  }

  return auditResults;
};
