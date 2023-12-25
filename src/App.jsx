// Default imports
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import VoiceSettingsPage from "./pages/VoiceSettingsPage";

// Import Context
import { GlobalContext } from "./context/GlobalContext";

// Import Components
import HeaderComponent from "./components/HeaderComponent";
import MainComponent from "./components/MainComponent";

// Import Assets
import Bible from "./assets/eng_bible.json";

function App() {
  // Global Variables
  const [selectedBook, setSelectedBook] = useState(0);
  const [selectedChapter, setSelectedChapter] = useState(0);
  const [selectedVerse, setSelectedVerse] = useState(0);

  // State variables for pitch, speed, and volume
  const [voicePitch, setVoicePitch] = useState(50);
  const [voiceSpeed, setVoiceSpeed] = useState(50);
  const [voiceVolume, setVoiceVolume] = useState(50);

  // Stats for selected book
  const [selectedBookChaptersAmount, setSelectedBookChaptersAmount] =
    useState(null);
  const [selectedChapterVersesAmount, setSelectedChapterVersesAmount] =
    useState(null);

  useEffect(() => {
    // Reset selected chapter and verse
    setSelectedVerse(0);
    setSelectedChapter(0);
    setSelectedBookChaptersAmount(Bible[selectedBook].chapters.length);
    setSelectedChapterVersesAmount(
      Bible[selectedBook].chapters[selectedChapter].length
    );
  }, [selectedBook]);

  useEffect(() => {
    // Reset selected verse
    setSelectedVerse(0);
    setSelectedBookChaptersAmount(Bible[selectedBook].chapters.length);
    setSelectedChapterVersesAmount(
      Bible[selectedBook].chapters[selectedChapter].length
    );
  }, [selectedChapter]);

  return (
    <div className="h-screen w-screen flex flex-col bg-base-300 px-10 py-7 relative">
      <Router>
        <GlobalContext.Provider
          value={{
            Bible,
            selectedBookChaptersAmount,
            selectedChapterVersesAmount,
            selectedBook,
            setSelectedBook,
            selectedChapter,
            setSelectedChapter,
            selectedVerse,
            setSelectedVerse,
            voicePitch,
            setVoicePitch,
            voiceSpeed,
            setVoiceSpeed,
            voiceVolume,
            setVoiceVolume,
          }}
        >
          <Routes>
            <Route path="/My-Bible/Settings" element={<VoiceSettingsPage />} />
            <Route
              path="/My-Bible/"
              element={
                <>
                  <HeaderComponent />
                  <MainComponent />
                </>
              }
            />
          </Routes>
        </GlobalContext.Provider>
      </Router>
    </div>
  );
}

export default App;
