import { Geist, Geist_Mono } from "next/font/google";
import { useState } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  const [synonymWordList, setSynonymWordList] = useState<Array<string>>([]);

  const findSynonym = async (formData: FormData) => {
    const word = formData.get('word') as string | null;

    if (word != null && word.trim().length > 0) {
      const response = await fetch(`https://api.datamuse.com/words?rel_syn=${word}`)

      const wordList: Array<string> = (await response.json() as Array<{ word: string; score: number }>).map((datamuseResponse => {
        return datamuseResponse.word
      }));

      setSynonymWordList(wordList);
    }

  }

  return (
    <section className="synonym-finder">
      <form action={findSynonym} className="form">
        <label htmlFor="word" className="label">
          Enter the word to find a synonym:
        </label>
        <input type="text" className="word" name="word" placeholder="Enter the word to find a synonym:" />
        <button className="submit">
          Find
        </button>
      </form>
    </section>
  );
}
