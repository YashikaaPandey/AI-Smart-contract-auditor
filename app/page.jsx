"use client";

import { useState } from "react";
import Header from "@/components/header";
import ContractInput from "@/components/contract-input";
import ResultsModal from "@/components/result-modal";
import { analyzeContract } from "@/utils/ai-prompt";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [contract, setContract] = useState("");
  const [results, setResults] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const analyze = async () => {
    setIsModalOpen(true);
    setLoading(true);
    try {
      const auditResults = await analyzeContract(contract);
      setResults(auditResults);
    } catch (error) {
      console.error("Error analyzing contract:", error);
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-between p-24">
      <Header />
      <ContractInput contract={contract} setContract={setContract} analyze={analyze} />
      <ResultsModal
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        loading={loading}
        results={results}
      />
    </main>
  );
}

