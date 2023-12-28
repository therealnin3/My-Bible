import { useEffect, useState, useRef } from "react";
import { openDB } from "idb";
import Slider from "./components/Slider";
import "./index.css";

//TODO: BUG -- select big chapter, switch to book with fewer chapters

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
    setChapter(0);
    setVerse(0);
    setChangeBookByDropDown(false);
  }, [changeBookByDropDown]);

  // When user selects a new chapter by dropdown, reset verse
  const [changeChapterByDropDown, setChangeChapterByDropDown] = useState(false);
  useEffect(() => {
    setVerse(0);
    setChangeChapterByDropDown(false);
  }, [changeChapterByDropDown]);

  // Create database on first load
  useEffect(() => {
    createDatabase();

    const synth = window.speechSynthesis;

    const populateVoices = () => {
      setVoicesList(synth.getVoices());
      setSelectedVoice(synth.getVoices()[0]);
    };

    populateVoices();
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = populateVoices;
    }
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
  const [progressBar, setProgressBar] = useState(0);
  const startPlayingText = (text) => {
    const words = text.split(" ");
    let wordCounter = 0;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = selectedVoice;
    utterance.lang = selectedVoice.lang;
    utterance.volume = volume / 100;
    utterance.rate = speed;
    utterance.pitch = pitch;

    utterance.onboundary = (event) => {
      if (event.name === "word") {
        wordCounter += 1;
        const progress = (wordCounter / words.length) * 100;
        setProgressBar(progress);
      }
    };

    utterance.onend = () => {
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
    window.speechSynthesis.cancel();
    setProgressBar(0);
  };

  // Sliders
  const [voicesList, setVoicesList] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [volume, setVolume] = useState(50);
  const [speed, setSpeed] = useState(1);
  const [pitch, setPitch] = useState(1);

  return (
    <div className="w-screen h-screen p-4 bg-red-500 flex flex-col">
      {displaySkeleton || Bible === null ? (
        <div>SKELETON</div>
      ) : (
        <>
          <header className="w-full h-28 bg-green-500">
            <button
              className="btn"
              onClick={() => {
                document.getElementById("my_modal_3").showModal();
                setIsPaused(true);
                stopPlayingText();
              }}
            >
              voice settings
            </button>
            <dialog id="my_modal_3" className="modal p-4 w-full h-full">
              <div className="w-full modal-box max-h-screen h-full rounded-lg p-4 flex flex-col">
                <form method="dialog">
                  {/* if there is a button in form, it will close the modal */}
                  <button className="btn">X</button>
                </form>

                <div className="dropdown">
                  <div tabIndex={0} role="button" className="btn m-1">
                    {selectedVoice.name}
                  </div>
                  <ul
                    tabIndex={0}
                    className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
                  >
                    {voicesList.map((voice) => (
                      <li
                        key={voice.name}
                        className="menu-item"
                        onClick={() => {
                          setSelectedVoice(voice);
                        }}
                      >
                        <a>{voice.name}</a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-col gap-10">
                  <Slider
                    sliderName={"Volume"}
                    sliderValue={volume}
                    setSliderValue={setVolume}
                    min={0}
                    max={100}
                  />
                  <Slider
                    sliderName={"Speed"}
                    sliderValue={speed}
                    setSliderValue={setSpeed}
                    stepSize={0.5}
                    min={0.5}
                    max={5}
                  />
                  <Slider
                    sliderName={"Pitch"}
                    sliderValue={pitch}
                    setSliderValue={setPitch}
                    stepSize={0.25}
                    min={0}
                    max={2}
                  />
                </div>
              </div>
            </dialog>
          </header>
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
                {Bible[book].chapters[chapter][verse]}
              </div>
            </div>
          </main>
          <footer className="w-full h-52 bg-blue-500 flex gap-4 flex-col justify-center items-center">
            <progress
              className="progress progress-primary w-full"
              value={progressBar}
              max="100"
            ></progress>
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
                      startPlayingText(Bible[book].chapters[chapter][verse]);
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
