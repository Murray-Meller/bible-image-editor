'use server';

// List of bible books for reference detection
// const bibleBooks = [
//   'Genesis',
//   'Exodus',
//   'Leviticus',
//   'Numbers',
//   'Deuteronomy',
//   'Joshua',
//   'Judges',
//   'Ruth',
//   '1 Samuel',
//   '2 Samuel',
//   '1 Kings',
//   '2 Kings',
//   '1 Chronicles',
//   '2 Chronicles',
//   'Ezra',
//   'Nehemiah',
//   'Esther',
//   'Job',
//   'Psalms',
//   'Proverbs',
//   'Ecclesiastes',
//   'Song of Solomon',
//   'Song of Songs',
//   'Isaiah',
//   'Jeremiah',
//   'Lamentations',
//   'Ezekiel',
//   'Daniel',
//   'Hosea',
//   'Joel',
//   'Amos',
//   'Obadiah',
//   'Jonah',
//   'Micah',
//   'Nahum',
//   'Habakkuk',
//   'Zephaniah',
//   'Haggai',
//   'Zechariah',
//   'Malachi',
//   'Matthew',
//   'Mark',
//   'Luke',
//   'John',
//   'Acts',
//   'Acts of the Apostles',
//   'Romans',
//   '1 Corinthians',
//   '2 Corinthians',
//   'Galatians',
//   'Ephesians',
//   'Philippians',
//   'Colossians',
//   '1 Thessalonians',
//   '2 Thessalonians',
//   '1 Timothy',
//   '2 Timothy',
//   'Titus',
//   'Philemon',
//   'Hebrews',
//   'James',
//   '1 Peter',
//   '2 Peter',
//   '1 John',
//   '2 John',
//   '3 John',
//   'Jude',
//   'Revelation',
// ];

// Utility to check if input is a bible reference
// function isBibleReference(input: string): boolean {
//   if (input.length > 30) return false;

//   const normalized = input.toLowerCase();
//   return bibleBooks.some((book) => normalized.includes(book.toLowerCase()));
// }

// Example Bible API fetch (uses ESV API, replace with your preferred API)
async function fetchBiblePassage(reference: string) {
  // Replace with your API endpoint and key
  const apiKey = process.env.REACT_APP_BIBLE_API_KEY;
  const url = `https://api.esv.org/v3/passage/text/?q=${encodeURIComponent(reference)}`;
  const response = await fetch(url, {
    headers: { Authorization: `Token ${apiKey}` },
  });
  const data = await response.json();
  return data.passages ? data.passages.join(' ') : '';
}

// Remove chapter and verse numbers from passage
function tidyPassage(text: string) {
  // Remove patterns like "1:1", "John 3:16", etc.
  return text
    .replace(/\b\d+:\d+\b/g, '')
    .replace(/\b([A-Za-z ]+)\s+\d+:\d+\b/g, '')
    .replace(/\n/g, ' ')
    .trim();
}

const getInitialInformation = async (input: string) => {
  //   if (!isBibleReference(input)) {
  //     return input;
  //   }

  try {
    const passage = await fetchBiblePassage(input);
    return tidyPassage(passage);
  } catch (err) {
    console.warn('Error fetching passage from api:', err);
    return input;
  }
};

const generateInstructions = async (script: string) => {
  const prompt = `
	${script} 

Using this script create a prompt for a salient or representative image according to the following criteria.

Variable: Subject description (if any)
Variable: Scene/environment description
Fixed: art style bold outline bible illustration style watercolor painting block colours
Fixed: lighting soft flat
Fixed: environment simple background gradient sky
Fixed: color scheme muted warm earthy tones
Variable: point of view ?
Fixed: minimal shading

Start by outputting a detailed description. Then refine the prompt detail down to its most essential components. Use around 50 words or less than 300 characters, it will be tokenised anyway, so we can ignore stop words, punctuation and most of the grammar.
	`;

  // TODO - pass to language model to generate instructions
  return 'todo';
};

export async function generateScript(formData: FormData): Promise<string> {
  const reference = formData.get('input') as string;

  if (!reference) {
    throw new Error('input is required');
  }

  const script = await getInitialInformation(reference);
  console.log('Obtained script information:', script);

  const instructions = await generateInstructions(script);
  console.log('Generated instructions:', instructions);

  return instructions;
}
