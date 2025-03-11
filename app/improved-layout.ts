import Navbar from "../components/Navbar";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-white min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow p-6 container mx-auto">{children}</main>
        <footer className="p-4 text-center text-gray-500 text-sm">
          Immutable Voice - Secure decentralized document sharing
        </footer>
      </body>
    </html>
  );
}
