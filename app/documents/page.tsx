'use client';
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
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-red-500">No documents found.</p>
      )}
    </div>
  );
}
