"use client";

import { Dialog } from "@headlessui/react";
import { Loader2 } from "lucide-react";

export default function ResultsModal({ isOpen = false, closeModal = () => {}, loading = false, results = null }) {
  return (
    <Dialog open={isOpen} onClose={closeModal} className="relative z-50">
      <div className="fixed inset-0 bg-black bg-opacity-50" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center px-4 text-center">
        <Dialog.Panel className="bg-neutral-900 rounded-2xl p-6 w-full max-w-3xl text-left text-white shadow-xl max-h-[80vh] overflow-y-auto">
          <Dialog.Title className="text-2xl font-bold mb-4 text-center">
            Audit Results
          </Dialog.Title>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              <span className="ml-3 text-lg">Analyzing contract...</span>
            </div>
          ) : results ? (
            <div className="space-y-6">
              {/* Audit Report */}
              <div>
                <h3 className="text-xl font-semibold mb-2">Audit Report</h3>
                <p className="text-gray-300 whitespace-pre-line">
                  {results.report || "No audit details available."}
                </p>
              </div>

              {/* Metric Scores with Dynamic Circle Colors */}
<div>
  <h3 className="text-xl font-semibold mb-4">Metric Scores</h3>
  <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
    {results.metrics && results.metrics.length > 0 ? (
      results.metrics.map((metric, idx) => {
        // Determine circle color based on score
        const circleColor = metric.score <= 4 ? "red" : "green";

        return (
          <div key={idx} className="flex flex-col items-center">
            <div className="relative w-20 h-20">
              <svg className="w-20 h-20">
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="gray"
                  strokeWidth="6"
                  fill="none"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke={circleColor}
                  strokeWidth="6"
                  fill="none"
                  strokeDasharray={2 * Math.PI * 36}
                  strokeDashoffset={2 * Math.PI * 36 * (1 - metric.score / 10)}
                  strokeLinecap="round"
                  transform="rotate(-90 40 40)"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center font-semibold">
                {metric.score}/10
              </span>
            </div>
            <span className="mt-2 text-sm">{metric.metric}</span>
          </div>
        );
      })
    ) : (
      <p className="text-gray-400">No metrics available.</p>
    )}
  </div>
</div>


              {/* Suggestions */}
              <div>
                <h3 className="text-xl font-semibold mb-2">Suggestions for Improvement</h3>
                {results.suggestions && results.suggestions.length > 0 ? (
                  <ul className="list-disc list-inside space-y-1 text-gray-300">
                    {results.suggestions.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400">No suggestions available.</p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-gray-400 text-center">No audit results available.</p>
          )}

          <div className="mt-6 flex justify-end">
            <button
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
