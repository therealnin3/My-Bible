import { useEffect, useState, useRef } from "react";
import { openDB } from "idb";
import Slider from "./components/Slider";
import "./index.css";
import { FiChevronDown } from "react-icons/fi";

//TODO: BUG -- select big chapter, switch to book with fewer chapters

// Import icons
import {
  FiPlay,
  FiBook,
  FiSkipBack,
  FiSkipForward,
  FiPause,
  FiExternalLink,
  FiSettings,
} from "react-icons/fi";

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
  const [displayAllVoices, setDisplayAllVoices] = useState(false); // State for displaying all voices

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

    let data;
    try {
      const response = await fetch("/My-Bible/Bible.json");
      data = await response.json();
      const tx = db.transaction("myObjectStore", "readwrite");
      await tx.store.put(data, "bibleData");
    } catch (error) {
      console.log("Fetch failed, trying to load from IndexedDB");
      const storedData = await db.get("myObjectStore", "bibleData");
      if (storedData) {
        data = storedData;
      } else {
        console.log("No data found in IndexedDB");
      }
    }

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
    <div className="flex h-screen w-screen flex-col overflow-y-auto bg-base-100 p-9 text-base-content">
      {displaySkeleton || Bible === null ? (
        <div>SKELETON</div>
      ) : (
        <div className="flex h-full w-full flex-col gap-3">
          <header className="flex w-full flex-row items-center justify-between px-5 pb-3">
            <FiExternalLink className="text-primary" size={20} />
            <div className="flex flex-row items-center gap-2">
              <FiBook size={20} />
              <label className="text-lg font-semibold">Audio Bible</label>
            </div>
            <button
              className=""
              onClick={() => {
                document.getElementById("my_modal_3").showModal();
                setIsPaused(true);
                stopPlayingText();
              }}
            >
              <FiSettings className="text-primary" size={20} />
            </button>
            <dialog
              id="my_modal_3"
              className="modal flex h-full w-full items-center justify-center p-4"
            >
              <div className="modal-box flex h-fit w-full flex-col rounded-lg p-8">
                <label className="text-md flex w-full items-center justify-center px-4 pb-4 font-bold">
                  Voice Settings
                </label>
                <div className="flex w-full flex-col pb-4">
                  <div className="flex w-full flex-row gap-3">
                    <div
                      onClick={() => setDisplayAllVoices(!displayAllVoices)}
                      className="flex w-full flex-row gap-3 rounded-lg bg-base-200 px-4 py-2"
                    >
                      <div className="flex flex-1 flex-col">
                        <label className="text-md font-semibold">
                          {selectedVoice.name}
                        </label>
                        <label className="text-sm">{selectedVoice.lang}</label>
                      </div>
                      <FiChevronDown
                        className="flex h-full items-center justify-center text-primary"
                        size={24}
                      />
                    </div>
                  </div>
                  <div className="relative w-full">
                    {displayAllVoices && (
                      <div className="absolute left-0 top-1 z-50 h-[290px] w-full overflow-auto rounded-lg bg-base-300 px-4 py-2 shadow-lg">
                        {voicesList.map((voice) => (
                          <div
                            onClick={() => {
                              setSelectedVoice(voice);
                              setDisplayAllVoices(false);
                            }}
                          >
                            {voice.name === selectedVoice.name ? (
                              <div className="flex flex-col rounded-lg bg-primary px-2 py-1 text-primary-content">
                                <label className="text-md font-semibold">
                                  {selectedVoice.name}
                                </label>
                                <label className="text-sm">
                                  {selectedVoice.lang}
                                </label>
                              </div>
                            ) : (
                              <div className="flex flex-col rounded-lg px-2 py-1 hover:bg-base-100">
                                <label className="text-md font-semibold">
                                  {voice.name}
                                </label>
                                <label className="text-sm">{voice.lang}</label>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-8">
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
                  <Slider
                    sliderName={"Volume"}
                    sliderValue={volume}
                    setSliderValue={setVolume}
                    min={0}
                    max={100}
                  />
                  <form method="dialog">
                    {/* if there is a button in form, it will close the modal */}
                    <button className="btn btn-outline btn-primary  flex w-full items-center justify-center">
                      Save and close
                    </button>
                  </form>
                </div>
              </div>
            </dialog>
          </header>
          <main className="flex flex-1">
            <div className="flex w-full flex-col gap-3">
              <div className="flex w-full flex-row items-center justify-center rounded-lg bg-base-300 px-5 py-3">
                <span className="flex-1">
                  <DropDown
                    selectedItem={book}
                    selectedRef={bookRef}
                    setSelectedItem={setBook}
                    bookNames={bookNames}
                    setChangeBookByDropDown={setChangeBookByDropDown}
                    stopPlayingText={stopPlayingText}
                    setIsPaused={setIsPaused}
                    icon={"right"}
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
                    icon={"left"}
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
                    icon={"right"}
                  />
                </span>
              </div>
              <div className="flex flex-1 rounded-lg bg-base-300 px-5 py-3">
                {Bible[book].chapters[chapter][verse]}
              </div>
            </div>
          </main>
          <footer className="flex w-full flex-col items-center justify-center gap-3 rounded-lg bg-base-300 p-5">
            <progress
              className="progress progress-primary w-full"
              value={progressBar}
              max="100"
            ></progress>
            <div className="flex w-full flex-row items-center justify-center gap-3">
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
                className="fill-base-content text-base-content"
              />

              <div
                onClick={() => {
                  isPaused
                    ? startPlayingText(Bible[book].chapters[chapter][verse])
                    : stopPlayingText();
                  setIsPaused(!isPaused);
                }}
                className="rounded-full bg-base-content p-4"
              >
                {isPaused ? (
                  <FiPlay size={24} className="fill-base-300 text-base-300" />
                ) : (
                  <FiPause size={24} className="fill-base-300 text-base-300" />
                )}
              </div>

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
                className="fill-base-content text-base-content"
              />
            </div>
          </footer>
        </div>
      )}
    </div>
  );
}

export default App;
