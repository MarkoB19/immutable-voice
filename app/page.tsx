'use client';

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-indigo-900 to-black text-white overflow-hidden">
      {/* Background Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.15),transparent_70%)] opacity-50 pointer-events-none animate-pulse-slow" />

      {/* Main Content */}
      <main className="relative z-10 text-center px-4 py-16 max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white to-indigo-300 animate-fade-in">
          Immutable Voice
        </h1>
        <p className="mt-6 text-lg md:text-xl text-gray-200 leading-relaxed animate-fade-in-delay">
          Empowering whistleblowers with a secure, decentralized platform to share truth anonymously.
        </p>

        {/* Call-to-Action Buttons */}
        <div className="mt-10 flex flex-col md:flex-row gap-4 justify-center">
          <a
            href="/upload"
            className="px-6 py-3 bg-indigo-600 rounded-full font-semibold shadow-lg hover:bg-indigo-700 hover:scale-105 transition-all duration-300"
          >
            Upload a Document
          </a>
          <a
            href="/documents"
            className="px-6 py-3 bg-transparent border-2 border-indigo-500 text-indigo-300 rounded-full font-semibold hover:bg-indigo-500/20 hover:text-white transition-all duration-300"
          >
            View Documents
          </a>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 flex flex-col md:flex-row gap-6 justify-center text-sm text-gray-300">
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

      {/* Footer */}
      <footer className="absolute bottom-6 text-gray-400 text-sm animate-fade-in-delay">
        Built for truth. Secured for the future.
      </footer>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseSlow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }
        .animate-fade-in {
          animation: fadeIn 1s ease-out forwards;
        }
        .animate-fade-in-delay {
          animation: fadeIn 1s ease-out 0.5s forwards;
          opacity: 0;
        }
        .animate-pulse-slow {
          animation: pulseSlow 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}