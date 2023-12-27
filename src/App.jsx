import { useEffect, useState } from "react";
import { openDB } from "idb";

// Import icons
import { FiPlay, FiSkipBack, FiSkipForward, FiPause } from "react-icons/fi";

// Import components
import DropDown from "./components/DropDown";

function App() {
  // Variables
  const [Bible, setBible] = useState(null);
  const [book, setBook] = useState(0);
  const [chapter, setChapter] = useState(0);
  const [verse, setVerse] = useState(0);

  // Create database on first load
  useEffect(() => {
    createDatabase();
  }, []);

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
  }

  return (
    <div className="w-screen h-screen p-4 bg-red-500 flex flex-col">
      <header className="w-full h-28 bg-green-500"></header>
      <main className="flex flex-1 bg-yellow-500">
        <div className="flex w-full flex-col gap-2 my-3">
          <div className="flex flex-row w-full bg-purple-500 rounded-lg p-4">
            <span>
              {/* <DropDown
                selectedItem={book}
                setSelectedItem={setBook}
                bookNames={allBooks}
              /> */}
            </span>
            <span className="flex flex-row gap-2">
              {/* <DropDown
                selectedItem={chapter}
                setSelectedItem={setChapter}
                maxNumber={maxChapter}
              /> */}
              <label>:</label>
              {/* <DropDown
                selectedItem={verse}
                setSelectedItem={setVerse}
                maxNumber={maxVerse}
              /> */}
            </span>
          </div>
          <div className="flex flex-1 bg-purple-500 rounded-lg p-4">AWE</div>
        </div>
      </main>
      <footer className="w-full h-52 bg-blue-500 flex gap-4 flex-col justify-center items-center">
        <div className="h-2 w-full relative rounded-lg bg-orange-500">
          <div className="h-full w-1/2 absolute rounded-lg bg-pink-500"></div>
        </div>
        <div className="w-full items-center justify-center flex flex-row gap-2">
          <div className="p-2 rounded-lg bg-yellow-500">
            {/* <FiSkipBack
              onClick={previousVerse}
              size={24}
              className="text-purple-500 fill-purple-500"
            /> */}
          </div>
          <div className="p-2 rounded-lg bg-yellow-500">
            {/* {isPaused ? (
              <FiPlay
                size={24}
                className="text-purple-500 fill-purple-500"
                onClick={() => startSpeaking(displayText)}
              />
            ) : (
              <FiPause
                size={24}
                className="text-purple-500 fill-purple-500"
                onClick={() => stopSpeaking()}
              />
            )} */}
          </div>
          <div className="p-2 rounded-lg bg-yellow-500">
            {/* <FiSkipForward
              onClick={nextVerse}
              size={24}
              className="text-purple-500 fill-purple-500"
            /> */}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
