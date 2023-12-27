import { useEffect, useState, useRef } from "react";
import { openDB } from "idb";

// Import icons
import { FiPlay, FiSkipBack, FiSkipForward, FiPause } from "react-icons/fi";

// Import components
import DropDown from "./components/DropDown";

function App() {
  // Variables - Display
  const [displaySkeleton, setDisplaySkeleton] = useState(true);
  const [isPaused, setIsPaused] = useState(true);

  // Variables - Bible
  const [Bible, setBible] = useState(null);
  const [bookNames, setBookNames] = useState(null);
  const [book, setBook] = useState(0); // State for rendering and user interaction
  const [chapter, setChapter] = useState(0); // State for rendering and user interaction
  const [verse, setVerse] = useState(0); // State for rendering and user interaction
  const bookRef = useRef(0); // Create a ref for bookRef
  const chapterRef = useRef(0); // Create a ref for chapterRef
  const verseRef = useRef(0); // Create a ref for verseRef

  // Sync the state and ref values
  useEffect(() => {
    bookRef.current = book;
    chapterRef.current = chapter;
    verseRef.current = verse;
  }, [book, chapter, verse]);

  // When user selects a new book by dropdown, reset chapter and verse
  const [changeBookByDropDown, setChangeBookByDropDown] = useState(false);
  useEffect(() => {
    console.log("changeBookByDropDown");
    setChapter(0);
    setVerse(0);
    setChangeBookByDropDown(false);
  }, [changeBookByDropDown]);

  // When user selects a new chapter by dropdown, reset verse
  const [changeChapterByDropDown, setChangeChapterByDropDown] = useState(false);
  useEffect(() => {
    console.log("changeChapterByDropDown");
    setVerse(0);
    setChangeChapterByDropDown(false);
  }, [changeChapterByDropDown]);

  // Create database on first load
  useEffect(() => {
    createDatabase();
  }, []);

  // Set Book, chapterRef, verseRef to next verseRef
  const nextVerse = () => {
    if (
      verseRef.current + 1 <
      Bible[bookRef.current].chapters[chapterRef.current].length
    ) {
      verseRef.current += 1;
    } else if (
      chapterRef.current + 1 <
      Bible[bookRef.current].chapters.length
    ) {
      chapterRef.current += 1;
      verseRef.current = 0;
    } else if (bookRef.current + 1 < Bible.length) {
      bookRef.current += 1;
      chapterRef.current = 0;
      verseRef.current = 0;
    } else {
      bookRef.current = 0;
      chapterRef.current = 0;
      verseRef.current = 0;
    }

    return Bible[bookRef.current].chapters[chapterRef.current][
      verseRef.current
    ];
  };

  // Set Book, chapterRef, verseRef to previous verseRef
  const previousVerse = () => {
    if (verseRef.current - 1 >= 0) {
      verseRef.current -= 1;
    } else if (chapterRef.current - 1 >= 0) {
      chapterRef.current -= 1;
      verseRef.current =
        Bible[bookRef.current].chapters[chapterRef.current].length - 1;
    } else if (bookRef.current - 1 >= 0) {
      bookRef.current -= 1;
      chapterRef.current = Bible[bookRef.current].chapters.length - 1;
      verseRef.current =
        Bible[bookRef.current].chapters[chapterRef.current].length - 1;
    } else {
      bookRef.current = Bible.length - 1;
      chapterRef.current = Bible[bookRef.current].chapters.length - 1;
      verseRef.current =
        Bible[bookRef.current].chapters[chapterRef.current].length - 1;
    }

    return Bible[bookRef.current].chapters[chapterRef.current][
      verseRef.current
    ];
  };

  // Create database function and set Bible state
  async function createDatabase() {
    const db = await openDB("myDatabase", 1, {
      upgrade(db) {
        db.createObjectStore("myObjectStore");
      },
    });

    const response = await fetch("/My-Bible/Bible.json");
    const data = await response.json();
    const tx = db.transaction("myObjectStore", "readwrite");
    await tx.store.put(data, "bibleData");

    setBible(data);
    setBookNames(data.map((book) => book.name));
    setDisplaySkeleton(false);
  }

  // Text to speech
  const startPlayingText = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 4;
    utterance.pitch = 1;
    utterance.onend = () => {
      console.log("Finished reading text.");
      const nextVerseText = nextVerse();
      setBook(bookRef.current);
      setChapter(chapterRef.current);
      setVerse(verseRef.current);
      startPlayingText(nextVerseText);
    };
    window.speechSynthesis.speak(utterance);
  };

  // Text to speech
  const stopPlayingText = () => {
    console.log("Forcefully stopped reading text.");
    window.speechSynthesis.cancel();
  };

  return (
    <div className="w-screen h-screen p-4 bg-red-500 flex flex-col">
      {displaySkeleton ? (
        <div></div>
      ) : (
        <>
          <header className="w-full h-28 bg-green-500"></header>
          <main className="flex flex-1 bg-yellow-500">
            <div className="flex w-full flex-col gap-2 my-3">
              <div className="flex flex-row w-full bg-purple-500 rounded-lg p-4">
                <span>
                  <DropDown
                    selectedItem={book}
                    selectedRef={bookRef}
                    setSelectedItem={setBook}
                    bookNames={bookNames}
                    setChangeBookByDropDown={setChangeBookByDropDown}
                    stopPlayingText={stopPlayingText}
                    setIsPaused={setIsPaused}
                  />
                </span>
                <span className="flex flex-row gap-2">
                  <DropDown
                    selectedItem={chapter}
                    selectedRef={chapterRef}
                    setSelectedItem={setChapter}
                    maxNumber={Bible[bookRef.current].chapters.length}
                    setChangeChapterByDropDown={setChangeChapterByDropDown}
                    stopPlayingText={stopPlayingText}
                    setIsPaused={setIsPaused}
                  />
                  <label>:</label>
                  <DropDown
                    selectedItem={verse}
                    selectedRef={verseRef}
                    setSelectedItem={setVerse}
                    maxNumber={
                      Bible[bookRef.current].chapters[chapterRef.current].length
                    }
                    stopPlayingText={stopPlayingText}
                    setIsPaused={setIsPaused}
                  />
                </span>
              </div>
              <div className="flex flex-1 bg-purple-500 rounded-lg p-4">
                {
                  Bible[bookRef.current].chapters[chapterRef.current][
                    verseRef.current
                  ]
                }
              </div>
            </div>
          </main>
          <footer className="w-full h-52 bg-blue-500 flex gap-4 flex-col justify-center items-center">
            <div className="h-2 w-full relative rounded-lg bg-orange-500">
              <div className="h-full w-1/2 absolute rounded-lg bg-pink-500"></div>
            </div>
            <div className="w-full items-center justify-center flex flex-row gap-2">
              <div className="p-2 rounded-lg bg-yellow-500">
                <FiSkipBack
                  onClick={() => {
                    previousVerse();
                    stopPlayingText();
                    setIsPaused(true);
                    setBook(bookRef.current);
                    setChapter(chapterRef.current);
                    setVerse(verseRef.current);
                  }}
                  size={24}
                  className="text-purple-500 fill-purple-500"
                />
              </div>
              <div className="p-2 rounded-lg bg-yellow-500">
                {isPaused ? (
                  <FiPlay
                    onClick={() => {
                      startPlayingText(
                        Bible[bookRef.current].chapters[chapterRef.current][
                          verseRef.current
                        ]
                      );
                      setIsPaused(false);
                    }}
                    size={24}
                    className="text-purple-500 fill-purple-500"
                  />
                ) : (
                  <FiPause
                    onClick={() => {
                      stopPlayingText();
                      setIsPaused(true);
                    }}
                    size={24}
                    className="text-purple-500 fill-purple-500"
                  />
                )}
              </div>
              <div className="p-2 rounded-lg bg-yellow-500">
                <FiSkipForward
                  onClick={() => {
                    nextVerse();
                    stopPlayingText();
                    setIsPaused(true);
                    setBook(bookRef.current);
                    setChapter(chapterRef.current);
                    setVerse(verseRef.current);
                  }}
                  size={24}
                  className="text-purple-500 fill-purple-500"
                />
              </div>
            </div>
          </footer>
        </>
      )}
    </div>
  );
}

export default App;
