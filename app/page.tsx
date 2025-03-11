'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  // Simuliraj učitavanje sadržaja za bolji UX
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-indigo-900 to-black text-white overflow-hidden">
      {/* Interaktivni pozadinski elementi */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.15),transparent_70%)] opacity-50 pointer-events-none animate-pulse-slow" />
      
      {/* Pozadinski dekorativni elementi */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-indigo-600/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl animate-float-delay" />
      
      {/* Glavni sadržaj */}
      <main className={`relative z-10 text-center px-4 py-16 max-w-4xl transition-all duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0 translate-y-8'}`}>
        {/* Logo i naslov */}
        <div className="flex items-center justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-white">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
              <line x1="12" y1="19" x2="12" y2="23"></line>
              <line x1="8" y1="23" x2="16" y2="23"></line>
            </svg>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white to-indigo-300 animate-fade-in">
            Immutable Voice
          </h1>
        </div>

        {/* Opis i značajke */}
        <p className="mt-6 text-lg md:text-xl text-gray-200 leading-relaxed animate-fade-in-delay">
          Empowering whistleblowers with a secure, decentralized platform to share truth anonymously.
        </p>
        
        {/* Glavne značajke */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="p-4 bg-indigo-900/30 backdrop-blur-sm rounded-xl border border-indigo-700/30 transform hover:scale-105 transition-all">
            <div className="w-12 h-12 mx-auto bg-indigo-600/30 rounded-full flex items-center justify-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-indigo-300">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white">Complete Anonymity</h3>
            <p className="mt-2 text-sm text-gray-300">Your identity remains protected through advanced cryptographic methods.</p>
          </div>
          
          <div className="p-4 bg-indigo-900/30 backdrop-blur-sm rounded-xl border border-indigo-700/30 transform hover:scale-105 transition-all">
            <div className="w-12 h-12 mx-auto bg-indigo-600/30 rounded-full flex items-center justify-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-indigo-300">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white">Blockchain Secured</h3>
            <p className="mt-2 text-sm text-gray-300">Data stored permanently on Arweave, immune to censorship and tampering.</p>
          </div>
          
          <div className="p-4 bg-indigo-900/30 backdrop-blur-sm rounded-xl border border-indigo-700/30 transform hover:scale-105 transition-all">
            <div className="w-12 h-12 mx-auto bg-indigo-600/30 rounded-full flex items-center justify-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-indigo-300">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white">Global Access</h3>
            <p className="mt-2 text-sm text-gray-300">Anyone, anywhere can access these documents without censorship or restrictions.</p>
          </div>
        </div>

        {/* Call-to-Action gumbi */}
        <div className="mt-10 flex flex-col md:flex-row gap-4 justify-center">
          <Link
            href="/upload"
            className="group relative px-8 py-4 bg-indigo-600 rounded-full font-semibold shadow-lg hover:bg-indigo-700 hover:shadow-indigo-600/30 transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10">Upload a Document</span>
            <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:translate-y-0"></span>
          </Link>
          <Link
            href="/documents"
            className="px-8 py-4 bg-transparent border-2 border-indigo-500 text-indigo-300 rounded-full font-semibold hover:bg-indigo-500/20 hover:text-white transition-all duration-300"
          >
            View Documents
          </Link>
        </div>

        {/* Statistika ili dodatne informacije */}
        <div className="mt-16 flex flex-col md:flex-row gap-8 justify-center text-center">
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-white">100+</span>
            <span className="text-sm text-gray-400">Documents Shared</span>
          </div>
          <div className="h-12 border-l border-indigo-500/30 hidden md:block"></div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-white">Forever</span>
            <span className="text-sm text-gray-400">Storage Duration</span>
          </div>
          <div className="h-12 border-l border-indigo-500/30 hidden md:block"></div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-white">Worldwide</span>
            <span className="text-sm text-gray-400">Accessibility</span>
          </div>
        </div>
      </main>

      {/* Dodatne informacije */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 mb-16">
        <div className="text-center">
          <span className="inline-block px-4 py-1 bg-indigo-900/30 text-indigo-300 rounded-full text-xs mb-4">Powered by Arweave</span>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 w-full py-6 border-t border-indigo-800/30 bg-black/20 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm mb-4 md:mb-0">
            Built for truth. Secured for the future.
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              About
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              How It Works
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              Privacy
            </a>
          </div>
        </div>
      </footer>

      {/* CSS Animacije */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseSlow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes floatDelay {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
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
        .animate-float {
          animation: float 15s ease-in-out infinite;
        }
        .animate-float-delay {
          animation: floatDelay 18s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}