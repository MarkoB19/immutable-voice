'use client';
import { useState, useEffect, useRef } from 'react';
import { uploadToArweave } from '../../utils/arweave';
import { authenticateWithArConnect } from '../../utils/auth';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [userAddress, setUserAddress] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [keywords, setKeywords] = useState<string>('');
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragAreaRef = useRef<HTMLDivElement>(null);

  // Load userAddress from localStorage after mount
  useEffect(() => {
    const storedAddress = localStorage.getItem('userAddress');
    if (storedAddress) {
      setUserAddress(storedAddress);
    }
  }, []);

  // Setup drag and drop handlers
  useEffect(() => {
    const dragArea = dragAreaRef.current;
    if (!dragArea) return;

    const preventDefault = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDragOver = (e: DragEvent) => {
      preventDefault(e);
      dragArea.classList.add('border-indigo-500');
    };

    const handleDragLeave = (e: DragEvent) => {
      preventDefault(e);
      dragArea.classList.remove('border-indigo-500');
    };

    const handleDrop = (e: DragEvent) => {
      preventDefault(e);
      dragArea.classList.remove('border-indigo-500');
      
      if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
        const droppedFile = e.dataTransfer.files[0];
        setFile(droppedFile);
        if (!title) setTitle(droppedFile.name.split('.').slice(0, -1).join('.'));
      }
    };

    dragArea.addEventListener('dragover', handleDragOver);
    dragArea.addEventListener('dragleave', handleDragLeave);
    dragArea.addEventListener('drop', handleDrop);

    return () => {
      dragArea.removeEventListener('dragover', handleDragOver);
      dragArea.removeEventListener('dragleave', handleDragLeave);
      dragArea.removeEventListener('drop', handleDrop);
    };
  }, [title]);

  // Auto-hide notifications after a delay
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const showNotification = (message: string, isError = false) => {
    if (isError) {
      setError(message);
      setSuccess(null);
    } else {
      setSuccess(message);
      setError(null);
    }
  };

  const handleLogin = async () => {
    setError(null);
    setIsAuthenticating(true);
    try {
      const address = await authenticateWithArConnect();
      if (address) {
        setUserAddress(address);
        localStorage.setItem('userAddress', address);
        showNotification('Successfully connected to ArConnect');
      } else {
        showNotification('Authentication failed. Ensure ArConnect is installed.', true);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Authentication error';
      showNotification(errorMessage, true);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogout = () => {
    setUserAddress('');
    localStorage.removeItem('userAddress');
    showNotification('Disconnected from ArConnect');
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
      const errorMessage = !file 
        ? 'Please select a file' 
        : !userAddress 
        ? 'Please authenticate first' 
        : 'Please add a title';
      
      showNotification(errorMessage, true);
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
        showNotification('Document uploaded successfully');
      } else {
        showNotification('Upload failed.', true);
      }
    } catch (err) {
      const errorMessage = 'Upload error: ' + (err instanceof Error ? err.message : 'Unknown error');
      showNotification(errorMessage, true);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-black flex items-center justify-center p-6 relative">
      {/* Fixed position notifications */}
      {error && (
        <div className="fixed top-4 right-4 bg-red-900 text-white p-4 rounded-lg shadow-lg z-50 max-w-md animate-fade-in flex items-center">
          <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex-grow">{error}</div>
          <button onClick={() => setError(null)} className="ml-2 text-white hover:text-red-200">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
      
      {success && (
        <div className="fixed top-4 right-4 bg-green-800 text-white p-4 rounded-lg shadow-lg z-50 max-w-md animate-fade-in flex items-center">
          <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          <div className="flex-grow">{success}</div>
          <button onClick={() => setSuccess(null)} className="ml-2 text-white hover:text-green-200">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      <div className="max-w-2xl w-full bg-gray-800/95 p-8 rounded-xl shadow-2xl backdrop-blur-sm">
        <h1 className="text-3xl font-bold text-white mb-2">Upload Document</h1>
        <p className="text-gray-300 mb-6">Securely share your truth with the world, permanently stored on Arweave.</p>

        {!userAddress ? (
          <div className="mb-6 p-6 border-2 border-dashed border-gray-600 rounded-lg text-center">
            <svg className="w-16 h-16 mx-auto text-indigo-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <p className="mb-4 text-gray-300">Authenticate to start uploading your documents</p>
            <button
              onClick={handleLogin}
              disabled={isAuthenticating}
              className="px-6 py-3 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 hover:scale-105 transition-all duration-300 flex items-center justify-center mx-auto"
            >
              {isAuthenticating ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Connecting...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Connect with ArConnect
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="mb-6 p-4 bg-green-900/30 rounded-lg flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-400 rounded-full mr-2 animate-pulse"></div>
              <p className="text-green-200">
                Connected: {userAddress.slice(0, 6)}...{userAddress.slice(-4)}
              </p>
            </div>
            <button 
              onClick={handleLogout}
              className="text-gray-300 hover:text-white text-sm underline"
            >
              Disconnect
            </button>
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label className="block text-gray-200 mb-2 font-medium">Title <span className="text-red-400">*</span></label>
            <input
              type="text"
              placeholder="Enter a title for your document"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all duration-200 border border-gray-600"
            />
          </div>

          <div>
            <label className="block text-gray-200 mb-2 font-medium">Description</label>
            <textarea
              placeholder="Describe what your document contains"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none min-h-28 transition-all duration-200 border border-gray-600"
            />
          </div>

          <div>
            <label className="block text-gray-200 mb-2 font-medium">Keywords</label>
            <input
              type="text"
              placeholder="e.g., whistleblower, evidence, documentation"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              className="w-full p-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all duration-200 border border-gray-600"
            />
            <p className="text-gray-400 text-sm mt-1">Separate keywords with commas</p>
          </div>

          <div 
            ref={dragAreaRef}
            className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center transition-colors duration-200 hover:border-indigo-400"
          >
            {file ? (
              <div>
                <div className="mb-3">
                  <svg className="w-10 h-10 mx-auto text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-lg text-white mb-2 font-medium">{file.name}</p>
                <p className="text-sm text-gray-300 mb-4">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
                <button
                  onClick={() => {
                    setFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="text-red-300 hover:text-red-200 transition-colors flex items-center mx-auto"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Remove File
                </button>
              </div>
            ) : (
              <div>
                <svg
                  className="w-16 h-16 mx-auto text-gray-400 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <p className="text-lg text-gray-300 mb-3">Drag and drop your file here</p>
                <p className="text-sm text-gray-400 mb-4">or</p>
                <label className="px-4 py-2 bg-indigo-600 text-white rounded-full cursor-pointer hover:bg-indigo-700 transition-all duration-300 inline-flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  Browse Files
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-gray-400 mt-4">Supports PDF, DOC, DOCX, TXT, JPG, PNG</p>
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
            } transition-all duration-300 flex items-center justify-center`}
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
                Uploading to Arweave...
              </span>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Upload Document
              </>
            )}
          </button>

          {uploadedUrl && (
            <div className="mt-6 p-6 bg-indigo-900/50 rounded-lg border border-indigo-700">
              <div className="flex items-center mb-3">
                <svg className="w-6 h-6 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <h3 className="font-bold text-white text-lg">Upload Successful!</h3>
              </div>
              <p className="text-gray-200 mb-3">Your document is now stored permanently on the Arweave network.</p>
              <div className="bg-gray-800/80 p-3 rounded-lg mb-3">
                <p className="text-sm text-gray-300 break-all font-mono">
                  <a
                    href={uploadedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-300 hover:text-indigo-200"
                  >
                    {uploadedUrl}
                  </a>
                </p>
              </div>
              <div className="flex gap-4">
                <a
                  href={uploadedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-all duration-300 flex-1 text-center"
                >
                  View Document
                </a>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(uploadedUrl);
                    showNotification('Link copied to clipboard');
                  }}
                  className="px-4 py-2 bg-gray-700 text-gray-200 rounded-full hover:bg-gray-600 transition-all duration-300 flex items-center justify-center"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  Copy Link
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add necessary CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
}