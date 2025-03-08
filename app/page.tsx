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
