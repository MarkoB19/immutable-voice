'use client';
import { useState } from "react";
import { uploadToArweave } from "../../utils/arweave";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadUrl, setUploadUrl] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    const url = await uploadToArweave(file);
    setUploadUrl(url);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-2xl font-bold">Upload a Document</h1>

      <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} className="mt-4" />
      <button onClick={handleUpload} className="mt-4 px-6 py-2 bg-green-500 text-white rounded">
        Upload to Arweave
      </button>

      {uploadUrl && (
        <p className="mt-4 text-blue-400">
          Uploaded: <a href={uploadUrl} target="_blank">{uploadUrl}</a>
        </p>
      )}
    </div>
  );
}
