<<<<<<< HEAD
'use client'; // Add this directive to make it a Client Component

export default function Home() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-800 text-white overflow-hidden">
      {/* Background Overlay for Depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.1),transparent_70%)] pointer-events-none" />

      {/* Main Content */}
      <main className="relative z-10 text-center px-6 py-12 max-w-3xl">
        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white to-indigo-300 animate-fade-in">
          Immutable Voice
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-gray-300 leading-relaxed max-w-xl mx-auto animate-fade-in-delay">
          A decentralized platform empowering whistleblowers to securely and anonymously share truth with the world.
        </p>

        {/* Call-to-Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/upload"
            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
          >
            Upload a Document
          </a>
          <a
            href="/documents"
            className="px-6 py-3 bg-transparent border border-indigo-400 text-indigo-300 font-semibold rounded-lg hover:bg-indigo-900/50 hover:text-white transition-all duration-300"
          >
            View Documents
          </a>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <span className="text-indigo-400">🔒</span> End-to-End Encryption
          </div>
          <div className="flex items-center gap-2">
            <span className="text-indigo-400">🌐</span> Powered by Arweave
          </div>
          <div className="flex items-center gap-2">
            <span className="text-indigo-400">👤</span> Complete Anonymity
          </div>
        </div>
      </main>

      {/* Subtle Footer */}
      <footer className="absolute bottom-4 text-gray-500 text-sm">
        <p>Built for truth. Secured for the future.</p>
      </footer>

      {/* CSS for Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 1s ease-out forwards;
        }
        .animate-fade-in-delay {
          animation: fadeIn 1s ease-out 0.3s forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}
=======
'use client';
import { useState, useEffect } from "react";
import { authenticateWithArConnect } from "../utils/auth";

export default function Home() {
  const [userAddress, setUserAddress] = useState<string | null>(null);

  useEffect(() => {
    const storedAddress = localStorage.getItem("userAddress");
    if (storedAddress) setUserAddress(storedAddress);
  }, []);

  const handleLogin = async () => {
    const address = await authenticateWithArConnect();
    if (address) setUserAddress(address);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold">Immutable Voice</h1>
      <p className="mt-4 text-lg">A decentralized platform for whistleblowers.</p>

      {userAddress ? (
        <p className="mt-4 text-green-400">Authenticated as: {userAddress}</p>
      ) : (
        <button
          onClick={handleLogin}
          className="mt-4 px-4 py-2 bg-blue-500 rounded-lg"
        >
          Authenticate with ArConnect
        </button>
      )}
    </div>
  );
}
>>>>>>> ee8870ac6feea4d398335c5327e0cf56e46ed5a3
