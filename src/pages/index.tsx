import { Geist, Geist_Mono } from "next/font/google";
import React, { useState } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  const [word, setWord] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean | undefined>(undefined);
  const [synonymWordList, setSynonymWordList] = useState<Array<string>>([]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (word != null && word.trim().length > 0) {
      const response = await fetch(`https://api.datamuse.com/words?rel_syn=${word}`);

      const wordList: Array<string> = (await response.json() as Array<{ word: string; score: number }>).map((datamuseResponse => {
        return datamuseResponse.word
      }));

      setSynonymWordList(wordList);
      setIsLoading(false)
    } else {
      setError('Enter a valid word to search')
    }
  }

  return (
    <section className="synonym-finder">
      <form className="form" onSubmit={(e) => handleFormSubmit(e)}>
        <label htmlFor="word-input" className="label">
          Enter the word to find a synonym:
        </label>
        <input
          value={word}
          onChange={(e) => setWord(e.target.value)}
          type="text"
          id="word-input"
          className="word"
          name="word"
          placeholder="Enter the word to find a synonym:"
        />
        {
          error && (
            <span>There is an error</span>
          )
        }
        <button className="submit">
          Find
        </button>
      </form>

      {
        !error && isLoading != null && isLoading && (
          <div className="loader">
            Loading...
          </div>
        )
      }

      {
        !error && isLoading != null && !isLoading && (
          <ul>
            Synonym List
            {
              synonymWordList.length === 0 && (
                <>
                  <br />
                  <span>No Synonyms found</span>
                </>
              )
            }
            {synonymWordList.map((synonym) => {
              return (
                <li>
                  {synonym}
                </li>
              )
            })}
          </ul>
        )
      }


    </section>
  );
}
