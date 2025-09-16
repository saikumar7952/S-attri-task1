import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UploadModal from "../components/UploadModal"; // make sure this file exists

export default function Dashboard() {
  const [contracts, setContracts] = useState([]);
  const [filteredContracts, setFilteredContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // search + filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [riskFilter, setRiskFilter] = useState("All");

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // modal state
  const [showUpload, setShowUpload] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetch("/contracts.json")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load contracts");
        return res.json();
      })
      .then((data) => {
        setContracts(data);
        setFilteredContracts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // filtering logic
  useEffect(() => {
    let filtered = contracts;

    if (search) {
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.parties.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (statusFilter !== "All") {
      filtered = filtered.filter((c) => c.status === statusFilter);
    }

    if (riskFilter !== "All") {
      filtered = filtered.filter((c) => c.risk === riskFilter);
    }

    setFilteredContracts(filtered);
    setCurrentPage(1); // reset page when filters/search change
  }, [search, statusFilter, riskFilter, contracts]);

  if (loading) return <p className="text-white p-6">Loading contracts...</p>;
  if (error) return <p className="text-red-400 p-6">Error: {error}</p>;
  if (filteredContracts.length === 0)
    return <p className="text-white p-6">No contracts found</p>;

  // pagination calculations
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentContracts = filteredContracts.slice(
    indexOfFirst,
    indexOfLast
  );
  const totalPages = Math.ceil(filteredContracts.length / rowsPerPage);

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      {/* Header with Upload button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">📊 Contracts Dashboard</h1>
        <button
          onClick={() => setShowUpload(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Upload Contract
        </button>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name or parties..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 rounded bg-gray-700 text-white flex-1"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded bg-gray-700 text-white"
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Expired">Expired</option>
          <option value="Renewal Due">Renewal Due</option>
        </select>

        <select
          value={riskFilter}
          onChange={(e) => setRiskFilter(e.target.value)}
          className="px-3 py-2 rounded bg-gray-700 text-white"
        >
          <option value="All">All Risk</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      {/* Table */}
      <table className="w-full border border-gray-700 rounded-lg overflow-hidden">
        <thead className="bg-gray-800">
          <tr>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Parties</th>
            <th className="p-3 text-left">Expiry</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Risk</th>
          </tr>
        </thead>
        <tbody>
          {currentContracts.map((c) => (
            <tr
              key={c.id}
              onClick={() => navigate(`/contracts/${c.id}`)}
              className="odd:bg-gray-800 even:bg-gray-700 hover:bg-gray-600 cursor-pointer"
            >
              <td className="p-3">{c.name}</td>
              <td className="p-3">{c.parties}</td>
              <td className="p-3">{c.expiry}</td>
              <td className="p-3">{c.status}</td>
              <td className="p-3">{c.risk}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination controls */}
      <div className="flex justify-center mt-6 space-x-2">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
          className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50"
        >
          Prev
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === i + 1 ? "bg-blue-600" : "bg-gray-700"
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
          className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Upload Modal */}
      {showUpload && <UploadModal onClose={() => setShowUpload(false)} />}
    </div>
  );
}
