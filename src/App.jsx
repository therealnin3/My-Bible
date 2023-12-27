import { useEffect, useState } from "react";
import { openDB } from "idb";

// Import icons
import { FiPlay, FiSkipBack, FiSkipForward, FiPause } from "react-icons/fi";

// Import components
import DropDown from "./components/DropDown";

function App() {
  // Variables - Display
  const [displaySkeleton, setDisplaySkeleton] = useState(true);
  const [isPaused, setIsPaused] = useState(true);
  const [changeBookByDropDown, setChangeBookByDropDown] = useState(false);

  // Variables - Bible
  const [Bible, setBible] = useState(null);
  const [bookNames, setBookNames] = useState(null);
  const [book, setBook] = useState(0);
  const [chapter, setChapter] = useState(0);
  const [verse, setVerse] = useState(0);

  // Create database on first load
  useEffect(() => {
    createDatabase();
  }, []);

  // When user selectes a new book by dropdown, reset chapter and verse
  useEffect(() => {
    setChapter(0);
    setVerse(0);
    setChangeBookByDropDown(false);
  }, [changeBookByDropDown]);

  const nextVerse = () => {
    if (verse + 1 < Bible[book].chapters[chapter].length) {
      setVerse(verse + 1);
    } else if (chapter + 1 < Bible[book].chapters.length) {
      setChapter(chapter + 1);
      setVerse(0);
    } else if (book + 1 < Bible.length) {
      setBook(book + 1);
      setChapter(0);
      setVerse(0);
    } else {
      setBook(0);
      setChapter(0);
      setVerse(0);
    }
  };

  const previousVerse = () => {
    if (verse - 1 >= 0) {
      setVerse(verse - 1);
    } else if (chapter - 1 >= 0) {
      setChapter(chapter - 1);
      setVerse(Bible[book].chapters[chapter - 1].length - 1);
    } else if (book - 1 >= 0) {
      setBook(book - 1);
      setChapter(Bible[book - 1].chapters.length - 1);
      setVerse(
        Bible[book - 1].chapters[Bible[book - 1].chapters.length - 1].length - 1
      );
    } else {
      setBook(Bible.length - 1);
      setChapter(Bible[Bible.length - 1].chapters.length - 1);
      setVerse(
        Bible[Bible.length - 1].chapters[
          Bible[Bible.length - 1].chapters.length - 1
        ].length - 1
      );
    }
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
                    setSelectedItem={setBook}
                    bookNames={bookNames}
                    setChangeBookByDropDown={setChangeBookByDropDown}
                  />
                </span>
                <span className="flex flex-row gap-2">
                  <DropDown
                    selectedItem={chapter}
                    setSelectedItem={setChapter}
                    maxNumber={Bible[book].chapters.length}
                  />
                  <label>:</label>
                  <DropDown
                    selectedItem={verse}
                    setSelectedItem={setVerse}
                    maxNumber={Bible[book].chapters[chapter].length}
                  />
                </span>
              </div>
              <div className="flex flex-1 bg-purple-500 rounded-lg p-4">
                {Bible[book].chapters[chapter][verse]}
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
                  onClick={previousVerse}
                  size={24}
                  className="text-purple-500 fill-purple-500"
                />
              </div>
              <div className="p-2 rounded-lg bg-yellow-500">
                {isPaused ? (
                  <FiPlay
                    size={24}
                    className="text-purple-500 fill-purple-500"
                  />
                ) : (
                  <FiPause
                    size={24}
                    className="text-purple-500 fill-purple-500"
                  />
                )}
              </div>
              <div className="p-2 rounded-lg bg-yellow-500">
                <FiSkipForward
                  onClick={nextVerse}
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
