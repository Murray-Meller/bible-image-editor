'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center font-sans ">
      <main className="container mx-auto p-4 max-w-md flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-12 text-center">GRN AI Utilities</h1>
        <Link
          className="w-full mb-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          href={'/scripter'}
        >
          Generate Prompt (for OpenArt)
        </Link>

        <Link
          className="w-full mb-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          href={'https://openart.ai/'}
        >
          Generate initial image (using OpenArt)
        </Link>

        <Link
          className="w-full mb-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          href={'/frame-generator'}
        >
          AI Frame Editor
        </Link>
      </main>
    </div>
  );
}
