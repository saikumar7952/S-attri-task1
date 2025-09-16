import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ContractDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/contracts/${id}.json`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load contract");
        return res.json();
      })
      .then((data) => {
        setContract(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p className="p-6">Loading contract...</p>;
  if (error) return <p className="p-6 text-red-500">Error: {error}</p>;
  if (!contract) return <p className="p-6">No contract found</p>;

  return (
    <div className="p-6 space-y-6 bg-gray-100 min-h-screen">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="px-4 py-2 bg-gray-200 rounded-lg"
      >
        ← Back
      </button>

      {/* Metadata */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-2">{contract.name}</h1>
        <p className="text-gray-600">Parties: {contract.parties}</p>
        <p className="text-gray-600">Start: {contract.start}</p>
        <p className="text-gray-600">Expiry: {contract.expiry}</p>
        <p className="text-gray-600">Status: {contract.status}</p>
        <p className="text-gray-600">Risk: {contract.risk}</p>
      </div>

      {/* Clauses */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Clauses</h2>
        <div className="grid gap-4">
          {contract.clauses?.map((c, i) => (
            <div key={i} className="bg-gray-50 p-4 rounded-lg shadow">
              <h3 className="font-semibold">{c.title}</h3>
              <p className="text-gray-600">{c.summary}</p>
              <p className="text-sm text-gray-500">
                Confidence: {(c.confidence * 100).toFixed(0)}%
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* AI Insights */}
      <div>
        <h2 className="text-xl font-semibold mb-2">AI Insights</h2>
        <div className="space-y-3">
          {contract.insights?.map((i, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center p-4 bg-white rounded-lg shadow"
            >
              <span>{i.message}</span>
              <span
                className={`px-2 py-1 rounded text-sm ${
                  i.risk === "High"
                    ? "bg-red-100 text-red-600"
                    : i.risk === "Medium"
                    ? "bg-yellow-100 text-yellow-600"
                    : "bg-green-100 text-green-600"
                }`}
              >
                {i.risk}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Evidence */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Evidence</h2>
        <div className="space-y-3">
          {contract.evidence?.map((e, idx) => (
            <div key={idx} className="p-4 border rounded-lg bg-gray-50">
              <p className="font-semibold">{e.source}</p>
              <p className="text-gray-600">{e.snippet}</p>
              <p className="text-sm text-gray-500">
                Relevance: {(e.relevance * 100).toFixed(0)}%
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
