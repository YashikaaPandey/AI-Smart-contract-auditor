#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const { analyzeContract } = require("./api/geminiClient.js");

async function main() {
  const args = process.argv.slice(2);

  if (args[0] === "check" && args[1]) {
    const filePath = path.resolve(args[1]);
    console.log(`\nChecking file at path: ${filePath}`);

    const contractCode = fs.readFileSync(filePath, "utf-8");

    console.log("Analyzing contract with Gemini...\n");

    const results = await analyzeContract(contractCode);

    console.log("=== Audit Results ===");

    for (const section of results) {
      console.log(`\n## ${section.section}`);
      if (Array.isArray(section.details)) {
        section.details.forEach((d) => {
          if (typeof d === "object") {
            console.log(`- ${d.metric}: ${d.score}`);
          } else {
            console.log(`- ${d}`);
          }
        });
      } else {
        console.log(section.details);
      }
    }
  } else {
    console.log("Usage: auditai check <path-to-your-contract-file>");
  }
}

main();
