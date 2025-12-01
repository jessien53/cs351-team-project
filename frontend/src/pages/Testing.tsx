import { useState } from "react";

export default function DisjointSet() {
  const [unionA, setUnionA] = useState("");
  const [unionB, setUnionB] = useState("");
  const [findId, setFindId] = useState("");
  const [unionResult, setUnionResult] = useState("");
  const [findResult, setFindResult] = useState("");

  const handleUnion = async () => {
    if (!unionA || !unionB) return;
    try {
      const res = await fetch(`/union/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ a: unionA, b: unionB }),
      });

      const data = await res.json();
      setUnionResult(JSON.stringify(data));
    } catch (error) {
      setUnionResult(`Error: ${error}`);
    }
  };

  const handleFind = async () => {
    if (!findId) return;
    try {
      const res = await fetch(`/find/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: findId }),
      });

      const data = await res.json();
      setFindResult(JSON.stringify(data));
    } catch (error) {
      setFindResult(`Error: ${error}`);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto space-y-6 bg-gray-50 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center">Disjoint Set (Union-Find)</h2>

      {/* Union */}
      <div className="space-y-2">
        <h3 className="font-semibold">Union</h3>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Node A"
            value={unionA}
            onChange={(e) => setUnionA(e.target.value)}
            className="flex-1 p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Node B"
            value={unionB}
            onChange={(e) => setUnionB(e.target.value)}
            className="flex-1 p-2 border rounded"
          />
        </div>
        <button
          onClick={handleUnion}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Union
        </button>
        <p className="text-gray-700">Result: {unionResult}</p>
      </div>

      {/* Find */}
      <div className="space-y-2">
        <h3 className="font-semibold">Find</h3>
        <input
          type="text"
          placeholder="Node ID"
          value={findId}
          onChange={(e) => setFindId(e.target.value)}
          className="p-2 border rounded"
        />
        <button
          onClick={handleFind}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Find Root
        </button>
        <p className="text-gray-700">Root: {findResult}</p>
      </div>
    </div>
  );
}
