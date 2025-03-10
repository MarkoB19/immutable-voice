'use client';
import { useState } from "react";
import { authenticateWithArConnect, getStoredUserAddress } from "../utils/auth";

export default function Home() {
  const [userAddress, setUserAddress] = useState<string | null>(getStoredUserAddress());

  const handleLogin = async () => {
    const address = await authenticateWithArConnect();
    if (address) setUserAddress(address);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-4xl font-bold">Immutable Voice</h1>
      <p className="text-gray-400">A decentralized platform for whistleblowers.</p>
      {!userAddress ? (
        <button onClick={handleLogin} className="mt-4 px-6 py-2 bg-blue-500 text-white rounded">
          Authenticate with ArConnect
        </button>
      ) : (
        <p className="mt-4 text-green-400">Authenticated as: {userAddress}</p>
      )}
    </div>
  );
}
