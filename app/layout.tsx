'use client';
import { useEffect, useState } from "react";
import { getStoredUserAddress } from "../utils/auth";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [userAddress, setUserAddress] = useState<string | null>(null);

  useEffect(() => {
    const storedAddress = getStoredUserAddress();
    if (storedAddress) {
      setUserAddress(storedAddress);
    }
  }, []);

  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
