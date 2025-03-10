'use client';
import { useState, useEffect, useRef } from 'react';
import { uploadToArweave } from '../../utils/arweave';
import { authenticateWithArConnect } from '../../utils/auth';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [userAddress, setUserAddress] = useState<string | null>(null); // Initialize as null
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [keywords, setKeywords] = useState<string>('');
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load userAddress from localStorage after mount
  useEffect(() => {
    const storedAddress = localStorage.getItem('userAddress');
    setUserAddress(storedAddress);
  }, []);

  const handleLogin = async () => {
    setError(null);
    try {
      const address = await authenticateWithArConnect();
      if (address) {
        setUserAddress(address);
        localStorage.setItem('userAddress', address); // Persist to localStorage
      } else {
        setError('Authentication failed. Ensure ArConnect is installed.');
      }
    } catch (err) {
      setError('Authentication error.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (!title) setTitle(selectedFile.name.split('.').slice(0, -1).join('.'));
    }
  };

  const handleUpload = async () => {
    if (!file || !userAddress || !title.trim()) {
      setError(!file ? 'Select a file.' : !userAddress ? 'Authenticate first.' : 'Add a title.');
      return;
    }
    setError(null);
    setIsUploading(true);
    try {
      const url = await uploadToArweave(file, userAddress, title, description, keywords);
      if (url) {
        setUploadedUrl(url);
        setFile(null);
        setTitle('');
        setDescription('');
        setKeywords('');
        if (fileInputRef.current) fileInputRef.current.value = '';
      } else setError('Upload failed.');
    } catch (err) {
      setError('Upload error: ' + (err instanceof Error ? err.message : 'Unknown'));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-black flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-gray-800/95 p-8 rounded-xl shadow-2xl">
        <h1 className="text-3xl font-bold text-white mb-2">Upload Document</h1>
        <p className="text-gray-300 mb-6">Securely share your truth with the world.</p>

        {error && (
          <div className="mb-6 p-4 bg-red-900/50 rounded-lg text-red-200">{error}</div>
        )}

        {userAddress === null ? (
          <div className="text-center text-gray-300 mb-6">Loading...</div>
        ) : !userAddress ? (
          <div className="mb-6 p-6 border-2 border-dashed border-gray-600 rounded-lg text-center">
            <p className="mb-4 text-gray-300">Authenticate to upload</p>
            <button
              onClick={handleLogin}
              className="px-6 py-3 bg-indigo-600 text-white rounded-full shadow-md hover:bg-indigo-700 hover:scale-105 transition-all duration-300"
            >
              Connect with ArConnect
            </button>
          </div>
        ) : (
          <div className="mb-6 p-4 bg-green-900/50 rounded-lg flex items-center">
            <div className="w-3 h-3 bg-green-400 rounded-full mr-2 animate-pulse"></div>
            <p className="text-green-200">
              Connected: {userAddress.slice(0, 6)}...{userAddress.slice(-4)}
            </p>
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label className="block text-gray-200 mb-2 font-medium">Title</label>
            <input
              type="text"
              placeholder="Enter a title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-gray-200 mb-2 font-medium">Description</label>
            <textarea
              placeholder="Describe your document"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none min-h-28 transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-gray-200 mb-2 font-medium">Keywords</label>
            <input
              type="text"
              placeholder="e.g., whistleblower, evidence"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              className="w-full p-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all duration-200"
            />
          </div>

          <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
            {file ? (
              <div>
                <p className="text-lg text-white mb-2">{file.name}</p>
                <p className="text-sm text-gray-300 mb-4">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
                <button
                  onClick={() => {
                    setFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="text-red-300 hover:text-red-200 transition-colors"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div>
                <svg
                  className="w-12 h-12 mx-auto text-gray-400 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <label className="px-4 py-2 bg-indigo-600 text-white rounded-full cursor-pointer hover:bg-indigo-700 transition-all duration-300">
                  Browse Files
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            )}
          </div>

          <button
            onClick={handleUpload}
            disabled={isUploading || !file || !userAddress}
            className={`w-full py-3 rounded-full font-semibold text-white shadow-md ${
              isUploading || !file || !userAddress
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 hover:scale-105'
            } transition-all duration-300`}
          >
            {isUploading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Uploading...
              </span>
            ) : (
              'Upload Document'
            )}
          </button>

          {uploadedUrl && (
            <div className="mt-6 p-6 bg-indigo-900/50 rounded-lg">
              <h3 className="font-bold text-white mb-2">Success!</h3>
              <p className="text-gray-200 mb-3">Stored on Arweave permanently.</p>
              <p className="text-sm text-gray-300 break-all">
                <a
                  href={uploadedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-300 hover:text-indigo-200"
                >
                  {uploadedUrl}
                </a>
              </p>
              <div className="mt-4 flex gap-4">
                <a
                  href={uploadedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-all duration-300"
                >
                  View
                </a>
                <button
                  onClick={() => navigator.clipboard.writeText(uploadedUrl)}
                  className="px-4 py-2 bg-gray-700 text-gray-200 rounded-full hover:bg-gray-600 transition-all duration-300"
                >
                  Copy
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}