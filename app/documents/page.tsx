'use client';
<<<<<<< HEAD
import { useState, useEffect, useMemo, useCallback } from "react";
import { fetchAllDocuments } from "../../utils/arweave";

interface Document {
  id: string;
  url: string;
  title: string;
  description: string;
  timestamp: string;
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [sortBy, setSortBy] = useState<"title" | "timestamp">("timestamp");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const DOCS_PER_PAGE = 6;

  useEffect(() => {
    loadDocuments();
  }, [page, sortBy, sortOrder]);

  const loadDocuments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const offset = (page - 1) * DOCS_PER_PAGE;
      const docs = await fetchAllDocuments(offset, DOCS_PER_PAGE);
      if (page === 1) {
        setDocuments(docs);
      } else {
        setDocuments((prev) => [...prev, ...docs]);
      }
      setHasMore(docs.length === DOCS_PER_PAGE);
    } catch (err) {
      setError("Failed to load documents. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [page]);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const timeout = setTimeout(() => setSearch(value), 300);
    return () => clearTimeout(timeout);
  }, []);

  const filteredDocs = useMemo(() => {
    let result = [...documents];
    result = result.filter(
      (doc) =>
        (doc.title?.toLowerCase().includes(search.toLowerCase()) || false) ||
        (doc.description?.toLowerCase().includes(search.toLowerCase()) || false)
    );
    result.sort((a, b) => {
      if (sortBy === "title") {
        return sortOrder === "asc"
          ? (a.title || "").localeCompare(b.title || "")
          : (b.title || "").localeCompare(a.title || "");
      } else {
        return sortOrder === "asc"
          ? a.timestamp.localeCompare(b.timestamp)
          : b.timestamp.localeCompare(a.timestamp);
      }
    });
    return result;
  }, [documents, search, sortBy, sortOrder]);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-200 p-8">
      {/* Header Section */}
      <header className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
          All Uploaded Documents
        </h1>
        <p className="mt-3 text-lg text-gray-600 max-w-2xl">
          Explore a collection of documents securely stored on Immutable Voice.
        </p>
      </header>

      {/* Search and Sorting Section */}
      <div className="w-full max-w-3xl flex flex-col items-center gap-6 mb-10">
        <input
          type="text"
          placeholder="Search by title or description..."
          onChange={handleSearch}
          className="w-full p-4 text-gray-900 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
          aria-label="Search documents"
        />
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <div className="flex items-center gap-2">
            <label htmlFor="sortBy" className="text-gray-700 font-medium">Sort by:</label>
            <select
              id="sortBy"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "title" | "timestamp")}
              className="p-2 bg-white border border-gray-300 rounded-lg text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-500"
            >
              <option value="title">Title</option>
              <option value="timestamp">Timestamp</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="sortOrder" className="text-gray-700 font-medium">Order:</label>
            <select
              id="sortOrder"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
              className="p-2 bg-white border border-gray-300 rounded-lg text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-500"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Document List */}
      {loading && page === 1 ? (
        <div className="flex items-center justify-center mt-12">
          <svg className="animate-spin h-10 w-10 text-indigo-600" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <span className="ml-3 text-gray-600 text-lg">Loading documents...</span>
        </div>
      ) : error ? (
        <p className="mt-12 text-red-600 font-medium text-lg animate-pulse">{error}</p>
      ) : filteredDocs.length > 0 ? (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
          {filteredDocs.map((doc) => (
            <li
              key={doc.id}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              <h2 className="text-xl font-semibold text-gray-800 line-clamp-1">
                {doc.title || "Untitled"}
              </h2>
              <p className="text-gray-600 mt-2 line-clamp-2">
                {doc.description || "No description available"}
              </p>
              <p className="text-sm text-gray-500 mt-3">
                Uploaded: {new Date(doc.timestamp).toLocaleDateString()}
              </p>
              <div className="mt-4 flex gap-3">
                <a
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 font-medium hover:text-indigo-800 transition-colors"
                  aria-label={`View document ${doc.title}`}
                >
                  View Document
                </a>
                <button
                  onClick={() => navigator.clipboard.writeText(doc.url)}
                  className="text-gray-500 hover:text-indigo-600 transition-colors"
                  title="Copy URL"
                >
                  📋 Copy
                </button>
              </div>
=======
import { useState, useEffect } from "react";
import { fetchAllDocuments } from "../../utils/arweave";

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<{ id: string; url: string; title: string; description: string; timestamp: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    setLoading(true);
    const docs = await fetchAllDocuments();
    setDocuments(docs);
    setLoading(false);
  };

  const filteredDocs = documents.filter(doc =>
  (doc.title ? doc.title.toLowerCase().includes(search.toLowerCase()) : false) ||
  (doc.description ? doc.description.toLowerCase().includes(search.toLowerCase()) : false)
);


  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold">All Uploaded Documents</h1>
      <p className="mt-4">Here are all documents uploaded to Immutable Voice.</p>

      <input type="text" placeholder="Search by title or description..."
        value={search} onChange={(e) => setSearch(e.target.value)}
        className="mt-4 p-2 border rounded w-1/2" />

      {loading ? (
        <p className="mt-4">Loading...</p>
      ) : filteredDocs.length > 0 ? (
        <ul className="mt-4">
          {filteredDocs.map((doc) => (
            <li key={doc.id} className="mt-2">
              <p className="text-xl font-bold">{doc.title}</p>
              <p className="text-gray-500">{doc.description}</p>
              <p className="text-sm text-gray-400">Uploaded on {doc.timestamp}</p>
              <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                View Document
              </a>
>>>>>>> ee8870ac6feea4d398335c5327e0cf56e46ed5a3
            </li>
          ))}
        </ul>
      ) : (
<<<<<<< HEAD
        <p className="mt-12 text-gray-500 text-lg">
          {search ? "No documents match your search." : "No documents available yet."}
        </p>
      )}

      {/* Load More Button */}
      {hasMore && !loading && filteredDocs.length > 0 && (
        <button
          onClick={() => setPage((prev) => prev + 1)}
          className="mt-10 px-6 py-3 bg-indigo-600 text-white rounded-xl shadow-md hover:bg-indigo-700 transform hover:scale-105 transition-all duration-300"
        >
          Load More
        </button>
      )}

      {/* Loading Indicator for Additional Pages */}
      {loading && page > 1 && (
        <div className="mt-6 flex items-center justify-center">
          <svg className="animate-spin h-6 w-6 text-indigo-600" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <span className="ml-2 text-gray-600">Loading more...</span>
        </div>
      )}
    </div>
  );
}
=======
        <p className="mt-4 text-red-500">No documents found.</p>
      )}
    </div>
  );
}
>>>>>>> ee8870ac6feea4d398335c5327e0cf56e46ed5a3
