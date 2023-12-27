import { useEffect, useState } from "react";
import { openDB } from "idb";

function App() {
  // Variables
  const [book, setBook] = useState(1);
  const [chapter, setChapter] = useState(1);
  const [verse, setVerse] = useState(1);
  const [displayText, setDisplayText] = useState("");

  // Store Bible in IndexedDB
  useEffect(() => {
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
            fetchVerse({ book: book, chapter: chapter, verse: verse });
          });
      })
      .catch((error) => {
        console.error("Error fetching Bible.json:", error);
      });
  }, []);

  // Fetch verse from IndexedDB
  async function fetchVerse({ book, chapter, verse }) {
    console.log("Start fetching verse...");
    try {
      const db = await openDB("myDatabase", 1);
      const tx = db.transaction("Bible", "readonly");
      const store = tx.objectStore("Bible");
      const bookData = await store.get(book - 1); // 0-indexed
      const chapterData = bookData.chapters[chapter - 1]; // 0-indexed
      const verseData = chapterData[verse - 1]; // 0-indexed
      setDisplayText(verseData); // Change display text
    } catch (error) {
      console.error("Error", error);
    } finally {
      console.log("Successfully fetched verse!");
    }
  }

  return (
    <div className="w-screen h-screen p-4 bg-red-500 flex flex-col">
      <header className="w-full h-28 bg-green-500"></header>
      <main className="flex flex-1 bg-yellow-500">
        <div className="flex flex-1 my-4 bg-purple-500 rounded-lg p-4">
          {displayText}
        </div>
      </main>
      <footer className="w-full h-52 bg-blue-500"></footer>
    </div>
  );
}

export default App;
