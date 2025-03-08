import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="p-4 bg-gray-900 text-white flex justify-between">
      <h1 className="text-xl font-bold">Immutable Voice</h1>
      <div>
        <Link href="/" className="ml-4">Home</Link>
        <Link href="/upload" className="ml-4">Upload</Link>
        <Link href="/documents" className="ml-4">Documents</Link>
      </div>
    </nav>
  );
}
