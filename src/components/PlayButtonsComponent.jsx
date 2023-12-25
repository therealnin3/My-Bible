import React, { useState, useEffect } from "react";
import {
  FiPlay,
  FiSquare,
  FiSkipBack,
  FiSkipForward,
  FiPause,
  FiToggleLeft,
  FiToggleRight,
  FiCircle,
} from "react-icons/fi";
import { GlobalContext } from "../context/GlobalContext";

function PlayButtonsComponent() {
  // Global variables
  const {
    Bible,
    selectedBook,
    setSelectedBook,
    selectedChapter,
    setSelectedChapter,
    selectedVerse,
    setSelectedVerse,
    selectedText,
  } = React.useContext(GlobalContext);

  // Local variables
  const [isPaused, setIsPaused] = React.useState(true);
  const [utterance, setUtterance] = useState(null);
  const [isAutoPlay, setIsAutoPlay] = useState(false);

  useEffect(() => {
    const synth = window.speechSynthesis;
    const u = new SpeechSynthesisUtterance(selectedText);

    u.onend = () => {
      synth.cancel();
      setIsPaused(true);
      console.log("Finished reading");
    };

    setUtterance(u);
    return () => {
      synth.cancel();
    };
  }, [selectedText]);

  const handlePlay = () => {
    const synth = window.speechSynthesis;

    if (synth.paused) {
      synth.resume();
      console.log("Resuming...");
    } else {
      synth.speak(utterance);
      console.log("Reading...");
    }

    setIsPaused(false);
  };

  const handlePause = () => {
    const synth = window.speechSynthesis;
    synth.pause();
    console.log("Paused...");
    setIsPaused(true);
  };

  const handleStop = () => {
    const synth = window.speechSynthesis;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(selectedText);
    setUtterance(u);
    setIsPaused(true);
    console.log("Stopped and reset");
  };

  const nextVerse = () => {
    // Check if there is a next verse in the same book
    if (
      selectedVerse + 1 <
      Bible[selectedBook].chapters[selectedChapter].length
    ) {
      setSelectedVerse(selectedVerse + 1);
    }

    // Check if there is a next chapter in the same book
    else if (selectedChapter + 1 < Bible[selectedBook].chapters.length) {
      setSelectedChapter(selectedChapter + 1);
      setSelectedVerse(0);
    }

    // Check if there is a next book
    else if (selectedBook + 1 < Bible.length) {
      setSelectedBook(selectedBook + 1);
      setSelectedChapter(0);
      setSelectedVerse(0);
    }

    // If there is no next verse, chapter or book, reset to the beginning
    else {
      setSelectedBook(0);
      setSelectedChapter(0);
      setSelectedVerse(0);
    }
  };

  const previousVerse = () => {
    // Check if there is previous verse in the same chapter
    if (selectedVerse - 1 >= 0) {
      setSelectedVerse(selectedVerse - 1);
    }

    // Check if there is a previous chapter in the same book
    else if (selectedChapter - 1 >= 0) {
      setSelectedChapter(selectedChapter - 1);
      setSelectedVerse(0);
    }

    // Check if there is a previous book
    else if (selectedBook - 1 >= 0) {
      setSelectedBook(selectedBook - 1);
      setSelectedChapter(Bible[selectedBook].chapters.length - 1);
      setSelectedVerse(0);
    }
  };

  return (
    <div className="flex flex-row gap-5 items-center justify-center">
      <FiSquare
        onClick={() => handleStop()}
        className="text-conent-100 fill-content-100"
        size={20}
      />
      <FiSkipBack
        onClick={previousVerse}
        size={24}
        className="text-content-100 fill-content-100"
      />
      <div
        onClick={isPaused ? handlePlay : handleStop}
        className="bg-content-100 w-fit h-fit rounded-full p-4"
      >
        {isPaused ? (
          <FiPlay
            onClick={handlePlay}
            size={24}
            className="text-base-300 fill-base-300"
          />
        ) : (
          <FiPause size={24} className="text-base-300 fill-base-300" />
        )}
      </div>
      <FiSkipForward
        onClick={nextVerse}
        size={24}
        className="text-content-100 fill-content-100"
      />
      {isAutoPlay ? (
        <FiToggleLeft onClick={() => setIsAutoPlay(!isAutoPlay)} size={25} />
      ) : (
        <div className="relative flex flex-col items-center justify-center">
          <FiToggleRight
            onClick={() => setIsAutoPlay(!isAutoPlay)}
            className="text-primary"
            size={25}
          />
          <FiCircle
            className="absolute top-7 fill-primary border-none text-primary"
            size={6}
          />
        </div>
      )}
    </div>
  );
}

export default PlayButtonsComponent;
