'use client';
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import debounce from 'lodash.debounce'; // Ensure this is installed: npm install lodash.debounce
import { fetchAllDocuments } from '../../utils/arweave';

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
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [sortBy, setSortBy] = useState<'title' | 'timestamp'>('timestamp');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const DOCS_PER_PAGE = 6;

  // Ref for the sentinel element to observe
  const observerRef = useRef<HTMLDivElement | null>(null);

  const loadDocuments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const offset = (page - 1) * DOCS_PER_PAGE;
      const docs = await fetchAllDocuments(offset, DOCS_PER_PAGE);
      setDocuments((prev) => (page === 1 ? docs : [...prev, ...docs]));
      setHasMore(docs.length === DOCS_PER_PAGE);
    } catch (err) {
      setError('Failed to load documents.');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    loadDocuments(); // Including loadDocuments in the dependency array
  }, [page, sortBy, sortOrder, loadDocuments]);

  const handleSearch = useCallback(
    debounce((value: string) => {
      setSearch(value);
      setPage(1); // Reset to first page on search
      setDocuments([]); // Clear documents on new search
    }, 300),
    []
  );

  const filteredDocs = useMemo(() => {
    let result = [...documents].filter(
      (doc) =>
        (doc.title?.toLowerCase().includes(search.toLowerCase()) || false) ||
        (doc.description?.toLowerCase().includes(search.toLowerCase()) || false)
    );
    result.sort((a, b) =>
      sortBy === 'title'
        ? sortOrder === 'asc'
          ? (a.title || '').localeCompare(b.title || '')
          : (b.title || '').localeCompare(a.title || '')
        : sortOrder === 'asc'
        ? a.timestamp.localeCompare(b.timestamp)
        : b.timestamp.localeCompare(a.timestamp)
    );
    return result;
  }, [documents, search, sortBy, sortOrder]);

  // Infinite scroll logic
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 } // Trigger when 10% of the sentinel is visible
    );

    const currentObserverRef = observerRef.current;
    if (currentObserverRef) {
      observer.observe(currentObserverRef);
    }

    return () => {
      if (currentObserverRef) {
        observer.unobserve(currentObserverRef);
      }
    };
  }, [hasMore, loading]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-indigo-900 to-black pt-24 pb-12">
      {/* Header Section */}
      <header className="text-center mb-12 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white to-indigo-300 animate-fade-in">
          All Documents
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto animate-fade-in-delay">
          Discover documents securely stored on Immutable Voice.
        </p>
      </header>

      {/* Search and Sort Controls */}
      <div className="max-w-4xl mx-auto mb-12 px-4">
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search by title or description..."
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full p-4 pr-12 rounded-full bg-gray-800/80 text-white placeholder-gray-400 border border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-md transition-all duration-300"
            aria-label="Search documents"
          />
          <svg
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <div className="flex items-center gap-2">
            <label htmlFor="sortBy" className="text-gray-300 font-medium">
              Sort by:
            </label>
            <select
              id="sortBy"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'title' | 'timestamp')}
              className="p-3 bg-gray-800/80 border border-gray-700 rounded-full text-white shadow-md focus:ring-2 focus:ring-indigo-500 outline-none transition-all duration-300"
              aria-label="Sort documents by"
            >
              <option value="title">Title</option>
              <option value="timestamp">Date</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="sortOrder" className="text-gray-300 font-medium">
              Order:
            </label>
            <select
              id="sortOrder"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
              className="p-3 bg-gray-800/80 border border-gray-700 rounded-full text-white shadow-md focus:ring-2 focus:ring-indigo-500 outline-none transition-all duration-300"
              aria-label="Sort order"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Documents List */}
      <div className="max-w-6xl mx-auto px-4">
        {loading && page === 1 ? (
          <div className="text-center mt-12">
            <div className="inline-flex items-center gap-3 text-gray-300 animate-pulse">
              <svg className="animate-spin h-8 w-8 text-indigo-500" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Loading documents...
            </div>
          </div>
        ) : error ? (
          <p className="mt-12 text-center text-red-400 font-medium animate-pulse">{error}</p>
        ) : filteredDocs.length > 0 ? (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDocs.map((doc) => (
              <li
                key={doc.id}
                className="bg-gray-800/80 p-6 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 border border-gray-700"
              >
                <h2 className="text-xl font-semibold text-white truncate">
                  {doc.title || 'Untitled'}
                </h2>
                <p className="mt-2 text-gray-400 line-clamp-2">
                  {doc.description || 'No description available'}
                </p>
                <p className="mt-3 text-sm text-gray-500">
                  Uploaded: {new Date(doc.timestamp).toLocaleDateString()}
                </p>
                <div className="mt-4 flex gap-3">
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-400 font-medium hover:text-indigo-300 transition-colors"
                    aria-label={`View document ${doc.title}`}
                  >
                    View
                  </a>
                  <button
                    onClick={() => navigator.clipboard.writeText(doc.url)}
                    className="text-gray-400 hover:text-indigo-400 transition-colors"
                    aria-label="Copy document URL"
                  >
                    Copy
                  </button>
                </div>
              </li>
            ))}
            {/* Sentinel for IntersectionObserver */}
            {hasMore && <div ref={observerRef} />}
          </ul>
        ) : (
          <p className="mt-12 text-center text-gray-400 text-lg">
            {search ? 'No documents match your search.' : 'No documents available yet.'}
          </p>
        )}

        {loading && page > 1 && (
          <div className="text-center mt-6">
            <div className="inline-flex items-center gap-2 text-gray-300">
              <svg className="animate-spin h-6 w-6 text-indigo-500" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Loading more...
            </div>
          </div>
        )}
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 1s ease-out forwards;
        }
        .animate-fade-in-delay {
          animation: fadeIn 1s ease-out 0.5s forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}
