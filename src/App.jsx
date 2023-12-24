// Default imports
import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";

// Import Context
import { GlobalContext } from "./context/GlobalContext";

// Import Components
import HeaderComponent from "./components/HeaderComponent";
import MainComponent from "./components/MainComponent";

// Import Assets
import Bible from "./assets/eng_bible.json";

function App() {
  // Global Variables
  const [selectedBook, setSelectedBook] = useState("Genesis");
  const [selectedChapter, setSelectedChapter] = useState(0);
  const [selectedVerse, setSelectedVerse] = useState(0);
  const [selectedText, setSelectedText] = useState("");
  const [allBooks] = useState(Bible.map((book) => book.name));

  // Stats for selected book
  const [selectedBookChaptersAmount, setSelectedBookChaptersAmount] =
    useState(null);
  const [selectedChapterVersesAmount, setSelectedChapterVersesAmount] =
    useState(null);

  useEffect(() => {
    // Reset selected chapter and verse
    setSelectedVerse(0);
    setSelectedChapter(0);

    const book = Bible.find((book) => book.name === selectedBook);
    if (book) {
      setSelectedBookChaptersAmount(book.chapters.length);
      setSelectedChapterVersesAmount(book.chapters[selectedChapter].length);
    } else {
      setSelectedBookChaptersAmount(0);
      setSelectedChapterVersesAmount(0);
    }
  }, [selectedBook]);

  useEffect(() => {
    // Reset selected verse
    setSelectedVerse(0);

    const book = Bible.find((book) => book.name === selectedBook);
    if (book) {
      setSelectedBookChaptersAmount(book.chapters.length);
      setSelectedChapterVersesAmount(book.chapters[selectedChapter].length);
    } else {
      setSelectedBookChaptersAmount(0);
      setSelectedChapterVersesAmount(0);
    }
  }, [selectedChapter]);

  useEffect(() => {
    const book = Bible.find((book) => book.name === selectedBook);
    if (book) {
      setSelectedText(book.chapters[selectedChapter][selectedVerse]);
    } else {
      setSelectedText("No book selected");
    }
  }, [selectedBook, selectedChapter, selectedVerse]);

  return (
    <div className="h-screen w-screen flex flex-col bg-base-300 px-10 py-7 relative">
      <GlobalContext.Provider
        value={{
          Bible,
          allBooks,

          selectedBookChaptersAmount,
          selectedChapterVersesAmount,

          selectedBook,
          setSelectedBook,
          selectedChapter,
          setSelectedChapter,
          selectedVerse,
          setSelectedVerse,
          selectedText,
        }}
      >
        <HeaderComponent />
        <MainComponent />
      </GlobalContext.Provider>
    </div>
  );
}

export default App;
