import { useState, useEffect } from "react";

export default function DictionaryApp() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedWord, setSelectedWord] = useState(null);
  const [meaning, setMeaning] = useState(null);

  // Fetch suggestions on typing
  useEffect(() => {
    if(query.length === 0)
    {
        setSuggestions([]);
        setSelectedWord(null);
        setMeaning(null);
    }
    else if (query.length > 0) {
      fetch(`https://api.datamuse.com/words?sp=${query}*`)
        .then(res => res.json())
        .then(data => setSuggestions(data.slice(0, 8))); // limit results
    }
  }, [query]);

  // Fetch meaning when a word is selected
  const fetchMeaning = (word) => {
    
    setSelectedWord(word);
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
      .then(res => res.json())
      .then(data => {
        if(query.length === 0)
        {
            setSelectedWord(null);
        }
        else if (Array.isArray(data)) {
          setMeaning(data[0].meanings[0].definitions[0].definition);
        } else {
          setMeaning("No definition found.");
        }
      });
    
  };

  return (
    <div className="main-div">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Type a word..."
        className="border p-2 w-full rounded"
      />

      {/* Suggestions */}
      <ul className="mt-2 bg-gray-50 rounded shadow">
        {suggestions.map((item, index) => (
          <li
            key={index}
            onClick={() => fetchMeaning(item.word)}
            className="p-2 hover:bg-gray-200 cursor-pointer"
          >
            <button>{item.word}</button>
          </li>
        ))}
      </ul>

      {/* Show meaning */}
      {selectedWord && (
        <div>
          <h2>{selectedWord}</h2>
          <p>{meaning || "Loading..."}</p>
        </div>
      )}
    </div>
  );
}

