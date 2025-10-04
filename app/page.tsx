'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center font-sans">
      <h1 className="text-3xl font-bold mb-12 text-center">GRN AI Utilities</h1>

      <Link href={'/frame-generator'}>
        <button
          type="button"
          className="mb-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Generate Frame
        </button>
      </Link>
    </div>
  );
}
