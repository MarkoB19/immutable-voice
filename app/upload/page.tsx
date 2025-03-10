'use client';
import { useState } from "react";
import { uploadToArweave } from "../../utils/arweave";
import { authenticateWithArConnect } from "../../utils/auth";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [keywords, setKeywords] = useState<string>("");
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const handleLogin = async () => {
    const address = await authenticateWithArConnect();
    setUserAddress(address);
  };

  const handleUpload = async () => {
    if (!file || !userAddress) {
      alert("Please select a file and authenticate first.");
      return;
    }

    const url = await uploadToArweave(file, userAddress, title, description, keywords);
    if (url) {
      setUploadedUrl(url);
    } else {
      alert("Upload failed.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-3xl font-bold">Upload a Document</h1>
      <p className="mt-4">Securely upload your whistleblower document to Arweave.</p>

      <button onClick={handleLogin} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
        Authenticate with ArConnect
      </button>

      {userAddress && <p className="mt-4 text-green-400">Authenticated as: {userAddress}</p>}

      <input type="text" placeholder="Document Title" value={title} onChange={(e) => setTitle(e.target.value)}
        className="mt-4 p-2 border rounded w-1/2 bg-gray-800 text-white" />

      <textarea placeholder="Document Description" value={description} onChange={(e) => setDescription(e.target.value)}
        className="mt-2 p-2 border rounded w-1/2 h-20 bg-gray-800 text-white" />

      <input type="text" placeholder="Keywords (comma-separated)" value={keywords} onChange={(e) => setKeywords(e.target.value)}
        className="mt-2 p-2 border rounded w-1/2 bg-gray-800 text-white" />

      {/* File picker styled as a button */}
      <label className="mt-4 px-4 py-2 bg-gray-500 text-white rounded cursor-pointer">
        Choose File
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="hidden"
        />
      </label>
      <p className="mt-2 text-gray-400">{file ? file.name : "No file chosen"}</p>

      <button onClick={handleUpload} className="mt-4 px-4 py-2 bg-green-500 text-white rounded">
        Upload to Arweave
      </button>

      {uploadedUrl && (
        <div className="mt-4 p-4 border rounded bg-gray-800 text-white">
          <p>File uploaded successfully:</p>
          <a href={uploadedUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400">
            {uploadedUrl}
          </a>
        </div>
      )}
    </div>
  );
}
