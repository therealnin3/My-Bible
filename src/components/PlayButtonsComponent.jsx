import React, { useState, useEffect, useRef } from "react";
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
  } = React.useContext(GlobalContext);

  // Local variables
  const [isPaused, setIsPaused] = useState(true);
  const [isAutoPlay, setIsAutoPlay] = useState(false);

  // Check for autoplay
  const isAutoPlayRef = useRef(isAutoPlay);
  useEffect(() => {
    isAutoPlayRef.current = isAutoPlay;
    if (isAutoPlay && !isPaused) {
      readText(Bible[selectedBook].chapters[selectedChapter][selectedVerse]);
    }
  }, [selectedBook, selectedChapter, selectedVerse, isAutoPlay]);

  // Speech Synthesis
  const synth = window.speechSynthesis;
  const readText = (text) => {
    // Create a new SpeechSynthesisUtterance instance
    console.log("Started reading...");
    setIsPaused(false);
    const utterance = new SpeechSynthesisUtterance(text);

    utterance.onend = () => {
      if (isAutoPlayRef.current) {
        nextVerse();
        console.log("Naturally stopped, adding new verse...");
      } else {
        setIsPaused(true);
        console.log("Naturally stopped...");
      }
    };

    // Speak the text
    synth.speak(utterance);
  };

  // Click stop button
  const handleStop = () => {
    console.log("Forcefully stopped...");
    setIsPaused(true);
    synth.cancel();
  };

  const nextVerse = () => {
    // Check if autoplay is still enabled
    if (!isAutoPlay) {
      setIsPaused(true);
      return;
    }

    // Check if there is a next verse in the same book
    if (
      selectedVerse + 1 <
      Bible[selectedBook].chapters[selectedChapter].length
    ) {
      setSelectedVerse((prevVerse) => prevVerse + 1);
    }

    // Check if there is a next chapter in the same book
    else if (selectedChapter + 1 < Bible[selectedBook].chapters.length) {
      setSelectedChapter((prevChapter) => prevChapter + 1);
      setSelectedVerse(0);
    }

    // Check if there is a next book
    else if (selectedBook + 1 < Bible.length) {
      setSelectedBook((prevBook) => prevBook + 1);
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
    // // Check if there is previous verse in the same chapter
    // if (selectedVerse - 1 >= 0) {
    //   setSelectedVerse(selectedVerse - 1);
    // }
    // // Check if there is a previous chapter in the same book
    // else if (selectedChapter - 1 >= 0) {
    //   setSelectedChapter(selectedChapter - 1);
    //   setSelectedVerse(0);
    // }
    // // Check if there is a previous book
    // else if (selectedBook - 1 >= 0) {
    //   setSelectedBook(selectedBook - 1);
    //   setSelectedChapter(Bible[selectedBook].chapters.length - 1);
    //   setSelectedVerse(0);
    // }
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
        onClick={
          isPaused
            ? () =>
                readText(
                  Bible[selectedBook].chapters[selectedChapter][selectedVerse]
                )
            : handleStop
        }
        className="bg-content-100 w-fit h-fit rounded-full p-4"
      >
        {isPaused ? (
          <FiPlay size={24} className="text-base-300 fill-base-300" />
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
      ) : (
        <FiToggleLeft onClick={() => setIsAutoPlay(!isAutoPlay)} size={25} />
      )}
    </div>
  );
}

export default PlayButtonsComponent;
