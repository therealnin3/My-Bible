import { useEffect, useState } from "react";
import { openDB } from "idb";

// Import icons
import { FiPlay, FiSkipBack, FiSkipForward, FiPause } from "react-icons/fi";

// Import components
import DropDown from "./components/DropDown";

function App() {
  // Variables
  const [book, setBook] = useState(1);
  const [displayBook, setDisplayBook] = useState("");
  const [allBooks, setAllBooks] = useState([]);
  const [chapter, setChapter] = useState(1);
  const [verse, setVerse] = useState(1);
  const [displayText, setDisplayText] = useState("");

  const [isPaused, setPaused] = useState(true);

  // Store Bible in IndexedDB
  useEffect(() => {
    if (!("indexedDB" in window)) {
      console.log("This browser doesn't support IndexedDB");
      return;
    }
    fetch("/My-Bible/Bible.json")
      .then((response) => response.json())
      .then((data) => {
        openDB("myDatabase", 1, {
          upgrade(db) {
            db.createObjectStore("Bible", { keyPath: "id" });
          },
        })
          .then((db) => {
            const tx = db.transaction("Bible", "readwrite");
            const store = tx.objectStore("Bible");
            data.forEach((item, index) => {
              item.id = index;
              store.put(item);
            });
            return tx.done;
          })
          .then(() => {
            setAllBooks(data.map((book) => book.name));
            fetchVerse({ book: book, chapter: chapter, verse: verse });
          });
      })
      .catch((error) => {
        console.error("Error fetching Bible.json:", error);
      });
  }, []);

  // Fetch verse when book, chapter, or verse changes
  useEffect(() => {
    fetchVerse({ book: book, chapter: chapter, verse: verse });
  }, [book, chapter, verse]);

  // Update display book when book changes
  useEffect(() => {
    setDisplayBook(allBooks[book - 1]);
  }, [book]);

  //TODO: fix maxNumber from dropdown

  // Fetch verse from IndexedDB
  async function fetchVerse({ book, chapter, verse }) {
    console.log("Start fetching verse...", book, chapter, verse);
    try {
      const db = await openDB("myDatabase", 1);
      const tx = db.transaction("Bible", "readonly");
      const store = tx.objectStore("Bible");
      const bookData = await store.get(book - 1); // 0-indexed
      const chapterData = bookData.chapters[chapter - 1]; // 0-indexed
      const verseData = chapterData[verse - 1]; // 0-indexed

      // Display text
      setDisplayBook(bookData.name);
      setDisplayText(verseData);
    } catch (error) {
      console.error("Error", error);
    } finally {
      console.log("Successfully fetched verse!");
    }
  }

  // Go to next verse
  async function nextVerse() {
    try {
      const db = await openDB("myDatabase", 1);
      const tx = db.transaction("Bible", "readonly");
      const store = tx.objectStore("Bible");
      const bookData = await store.get(book - 1); // 0-indexed

      // Check if the current verse is the last verse in the current chapter
      if (verse < bookData.chapters[chapter - 1].length) {
        setVerse(verse + 1);
      }
      // Check if the current verse is the last verse in the last chapter of the current book
      else if (chapter < bookData.chapters.length) {
        setChapter(chapter + 1);
        setVerse(1);
      }
      // Check if the current verse is the last verse in the last chapter of the last book
      else if (book < allBooks.length) {
        setBook(book + 1);
        setChapter(1);
        setVerse(1);
      }
      // Reset to the first verse in the first chapter in the first book
      else {
        setBook(1);
        setChapter(1);
        setVerse(1);
      }
    } catch (error) {
      console.error("Error", error);
    }
  }

  // Go to previous verse
  async function previousVerse() {
    try {
      const db = await openDB("myDatabase", 1);
      const tx = db.transaction("Bible", "readonly");
      const store = tx.objectStore("Bible");
      const bookData = await store.get(book - 1); // 0-indexed

      // Check if the current verse is the first verse in the current chapter
      if (verse > 1) {
        setVerse(verse - 1);
      }
      // Check if the current verse is the first verse in the first chapter of the current book
      else if (chapter > 1) {
        setChapter(chapter - 1);
        setVerse(bookData.chapters[chapter - 1].length);
      }
      // Check if the current verse is the first verse in the first chapter of the first book
      else if (book > 1) {
        setBook(book - 1);
        setChapter(allBooks[book - 2].chapters.length);
        setVerse(
          allBooks[book - 2].chapters[allBooks[book - 2].chapters.length - 1]
            .length
        );
      }
      // Reset to the last verse in the last chapter in the last book
      else {
        setBook(allBooks.length);
        setChapter(allBooks[allBooks.length - 1].chapters.length);
        setVerse(
          allBooks[allBooks.length - 1].chapters[
            allBooks[allBooks.length - 1].chapters.length - 1
          ].length
        );
      }
    } catch (error) {
      console.error("Error", error);
    }
  }

  return (
    <div className="w-screen h-screen p-4 bg-red-500 flex flex-col">
      <header className="w-full h-28 bg-green-500"></header>
      <main className="flex flex-1 bg-yellow-500">
        <div className="flex w-full flex-col gap-2 my-3">
          <div className="flex flex-row w-full bg-purple-500 rounded-lg p-4">
            <span>
              <DropDown
                selectedItem={displayBook}
                setSelectedItem={setBook}
                bookNames={allBooks}
              />
            </span>
            <span className="flex flex-row gap-2">
              <DropDown
                selectedItem={chapter}
                setSelectedItem={setChapter}
                maxNumber={20}
              />
              <label>:</label>
              <DropDown
                selectedItem={verse}
                setSelectedItem={setVerse}
                maxNumber={20}
              />
            </span>
          </div>
          <div className="flex flex-1 bg-purple-500 rounded-lg p-4">
            {displayText}
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
                onClick={() => setPaused(false)}
              />
            ) : (
              <FiPause
                size={24}
                className="text-purple-500 fill-purple-500"
                onClick={() => setPaused(true)}
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
    </div>
  );
}

export default App;
