'use client';
import { generateScript } from '../../actions/scripter';
import React, { useState } from 'react';

const BibleInput = () => {
  const [output, setOutput] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      setLoading(true);
      setOutput(undefined);
      setError(undefined);

      const formData = new FormData(event.currentTarget);
      const result = await generateScript(formData);

      setOutput(result);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center font-sans">
      <main className="container mx-auto p-4 max-w-3xl">
        <h1 className="text-3xl font-bold mb-6 text-center">Scripter</h1>

        {error && (
          <div className="bg-red-500 text-white p-3 rounded-md mb-4">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="input" className="block text-sm font-medium text-gray-300 mb-2">
              Enter story:
            </label>
            <textarea
              id="input"
              name="input"
              required={true}
              rows={5}
              placeholder="e.g. John 3:16 or your script"
              className="mt-1 p-2 block w-full text-gray-300 rounded-md cursor-pointer bg-gray-800 text-white text"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md disabled:bg-gray-500"
          >
            {loading ? 'Processing...' : 'Submit'}
          </button>
        </form>

        {output && (
          <div className="mt-6 bg-gray-800 p-4 rounded-md">
            <h2 className="text-xl font-bold mb-2">Output:</h2>
            <div className="whitespace-pre-wrap">{output}</div>
          </div>
        )}
      </main>
    </div>
  );
};

export default BibleInput;
