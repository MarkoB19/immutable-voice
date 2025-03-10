'use client';
import { useState, useEffect } from "react";
import { fetchAllDocuments } from "../../utils/arweave";

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadDocuments() {
      const fetchedDocs = await fetchAllDocuments();
      setDocuments(fetchedDocs);
    }
    loadDocuments();
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-2xl font-bold">Uploaded Documents</h1>
      <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="mt-4 p-2 border rounded bg-gray-800 text-white w-1/2" />
      <ul className="mt-6">{documents.map((doc) => <li key={doc.id}>{doc.title}</li>)}</ul>
    </div>
  );
}
