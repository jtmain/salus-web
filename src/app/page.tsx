"use client";  // Ensures this runs on the client
import Link from 'next/link';

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <Link 
        href="/start"
        className="mt-4 px-6 py-3 bg-sky-400 text-white rounded-md hover:bg-sky-500 transition-colors"
      >
        Start Your Evaluation
      </Link>
    </div>
  );
}
