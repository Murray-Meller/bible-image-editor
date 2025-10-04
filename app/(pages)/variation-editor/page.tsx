'use client';

import { useState } from 'react';
import { handleImageUpload } from '../../actions/actions';
import { ImageEditResult } from '../../services';

export default function ImageEditor() {
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [data, setData] = useState<ImageEditResult[]>([]);

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
      const prompt = formData.get('variationPrompt') as string;

      const finalPrompt = `
	  		Your job is to edit the image but - very importantly - keep the style, characters and features as per the original image.
			${prompt}	
		`;

      // Prepare data for image upload
      const newFormData = new FormData();
      newFormData.append('prompt', finalPrompt);
      newFormData.append('variations', '1');
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
      <main className="container mx-auto p-4 max-w-3xl">
        <h1 className="text-3xl font-bold mb-6 text-center">Variation Editor</h1>

        {error && (
          <div className="bg-red-500 text-white p-3 rounded-md mb-4">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="images" className="block text-sm font-medium text-gray-300 mb-2">
              Images to vary
            </label>
            <input
              type="file"
              id="images"
              name="images"
              multiple
              accept="image/*"
              required={true}
              onChange={handleFileChange}
              className="mt-1 p-2 block w-full text-gray-300 rounded-md cursor-pointer bg-gray-800 text-white text"
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
            <label
              htmlFor="variationPropmpt"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              What variation should be applied to these images?
            </label>
            <textarea
              id="variationPropmpt"
              name="variationPropmpt"
              rows={5}
              required
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

        {data.length > 0 && (
          <>
            <h2 className="mt-4 text-xl font-bold">Result</h2>

            <div className="grid grid-cols-2 gap-4">
              {data.map((result, index) => (
                <figure key={index}>
                  <img
                    src={`data:image/[format];base64,` + result.imageBase64}
                    alt={`Result ${index + 1}`}
                    className="w-full h-auto rounded-lg"
                  />
                  <figcaption className="mt-1 text-sm text-gray-400 text-wrap wrap-break-word">
                    Saved here: {result.path}
                  </figcaption>
                </figure>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
