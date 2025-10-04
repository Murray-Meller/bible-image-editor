'use client';

import { useState } from 'react';
import { handleImageUpload } from './actions/actions';

export default function Home() {
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [data, setData] = useState<string[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newPreviews = Array.from(files).map((file) => URL.createObjectURL(file));
      setPreviews(newPreviews);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      setLoading(true);
      setData([]);
      setError(undefined);

      // Build prompt
      const formData = new FormData(event.currentTarget);
      const prompt = formData.get('prompt') as string;
      const frameDetails = formData.get('frameDetails') as string;

      const combinedPrompt = `
		Notice these features of the given image:
		${frameDetails} 
		
		Your job is to edit the image but - very importantly - keep the style, characters and features as per the original image.
		
		Now update the image to reflect this change:
		${prompt}
	  `;

      // Prepare data for image upload
      const newFormData = new FormData();
      newFormData.append('prompt', combinedPrompt);
      for (const image of formData.getAll('images') as File[]) {
        newFormData.append('images', image);
      }

      const result = await handleImageUpload(newFormData);
      setData(result);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center font-sans">
      <main className="container mx-auto p-4 max-w-xl">
        <h1 className="text-3xl font-bold mb-6 text-center">Frame Generator</h1>

        {error && (
          <div className="bg-red-500 text-white p-3 rounded-md mb-4">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="images" className="block text-sm font-medium text-gray-300 mb-2">
              Input Frame
            </label>
            <input
              type="file"
              id="images"
              name="images"
              accept="image/*"
              required={true}
              onChange={handleFileChange}
              className="mt-1 p-2 block w-full text-sm text-gray-300 border border-gray-600 rounded-md cursor-pointer bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          {previews.length > 0 && (
            <div className="grid grid-cols-3 gap-4">
              {previews.map((preview, index) => (
                <img
                  key={index}
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-auto rounded-lg"
                />
              ))}
            </div>
          )}

          <div>
            <label htmlFor="frameDetails" className="block text-sm font-medium text-gray-300 mb-2">
              What important details should the AI notice before editing the image?
            </label>
            <textarea
              id="frameDetails"
              name="frameDetails"
              rows={5}
              required
              className="mt-1 p-2 block w-full rounded-md border-gray-600 bg-gray-800 shadow-sm focus:border-indigo-500 focus:ring-indigo-500  text-white text"
            />
          </div>

          <div>
            <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">
              What should the new image look like?
            </label>
            <textarea
              id="prompt"
              name="prompt"
              rows={5}
              required
              className="mt-1 p-2 block w-full rounded-md border-gray-600 bg-gray-800 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-white text"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex justify-center py-3 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>

        {data.length > 0 && (
          <>
            <h2 className="mt-4 text-xl font-bold">Result</h2>

            <ul className="list-disc list-inside">
              {data.map((result: string, idx: number) => (
                <li key={idx}>{result}</li>
              ))}
            </ul>
          </>
        )}
      </main>
    </div>
  );
}
