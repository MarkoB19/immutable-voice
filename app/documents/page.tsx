'use client';
import { useState, useEffect } from "react";
import { fetchAllDocuments } from "../../utils/arweave";

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const docsPerPage = 10;

  useEffect(() => {
    async function loadDocuments() {
      const fetchedDocs = await fetchAllDocuments();
      setDocuments(fetchedDocs);
    }
    loadDocuments();
  }, []);

  const filteredDocs = documents.filter((doc) =>
    (doc.title ? doc.title.toLowerCase().includes(search.toLowerCase()) : false) ||
    (doc.description ? doc.description.toLowerCase().includes(search.toLowerCase()) : false)
  );

  const totalPages = Math.ceil(filteredDocs.length / docsPerPage);
  const displayedDocs = filteredDocs.slice((currentPage - 1) * docsPerPage, currentPage * docsPerPage);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-3xl font-bold">Uploaded Documents</h1>

      <input
        type="text"
        placeholder="Search documents..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mt-4 p-2 border rounded w-1/2 bg-gray-800 text-white"
      />

      <div className="mt-6 w-full max-w-4xl">
        {displayedDocs.map((doc) => (
          <div key={doc.id} className="p-4 border rounded mb-2 bg-gray-800">
            <h2 className="text-lg font-semibold">{doc.title}</h2>
            <p className="text-sm text-gray-400">{doc.description}</p>
            <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-blue-400">
              View Document
            </a>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-between mt-4">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="px-4 py-2 bg-gray-600 text-white rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-4 py-2">{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          className="px-4 py-2 bg-gray-600 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
