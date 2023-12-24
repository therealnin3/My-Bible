import React from "react";

import { FiBookOpen, FiChevronDown } from "react-icons/fi";
import { GlobalContext } from "../context/GlobalContext";
import DropDownMenuItem from "./DropDownMenuItem";

function TitleAndTextComponent() {
  // Global variables
  const {
    selectedBookChaptersAmount,
    selectedChapterVersesAmount,
    selectedBook,
    selectedChapter,
    setSelectedChapter,
    selectedVerse,
    setSelectedVerse,
    selectedText,
  } = React.useContext(GlobalContext);

  // Local variables
  const [isSelectingChapter, setIsSelectingChapter] = React.useState(false);
  const [isSelectingVerse, setIsSelectingVerse] = React.useState(false);

  // Local functions
  const handleChapterSelection = () => {
    setIsSelectingChapter(!isSelectingChapter);
  };

  const handleVerseSelection = () => {
    setIsSelectingVerse(!isSelectingVerse);
  };

  return (
    <>
      <div className="flex h-fit flex-row w-full gap-3 bg-base-200 px-4 py-2 rounded-lg">
        <FiBookOpen size={24} />
        {/* Book-Name */}
        <div className="flex flex-1 flex-row gap-1">
          <span className="font-semibold">{selectedBook}</span>
        </div>
        {/* Chapter-AND-Verse */}
        <div className="flex flex-row gap-1">
          {/* Chapter-Dropdown */}
          <div className="relative">
            <FiChevronDown
              size={24}
              className={`${
                isSelectingChapter ? "rotate-180" : "rotate-0"
              } transition-all text-primary cursor-pointer`}
              onClick={handleChapterSelection}
            />

            <div
              className={`${
                isSelectingChapter
                  ? "h-[300px] p-2 "
                  : "h-0 p-0 overflow-hidden"
              } transition-all absolute top-10 w-fit flex left-[-10px] flex-col gap-1 bg-base-100 rounded-lg`}
            >
              <div className="flex flex-col overflow-auto">
                {Array.from(
                  { length: selectedBookChaptersAmount },
                  (_, index) => (
                    <DropDownMenuItem
                      key={index}
                      itemValue={index + 1}
                      onClick={() => {
                        setSelectedChapter(index);
                      }}
                    />
                  )
                )}
              </div>
            </div>
          </div>
          <span className="font-semibold">
            {selectedChapter + 1} : {selectedVerse + 1}
          </span>
          {/* Verse-Dropdown */}
          <div className="relative">
            <FiChevronDown
              size={24}
              className={`${
                isSelectingVerse ? "rotate-180" : "rotate-0"
              } transition-all text-primary cursor-pointer`}
              onClick={handleVerseSelection}
            />
            <div
              className={`${
                isSelectingVerse ? "h-[300px] p-2 " : "h-0 p-0 overflow-hidden"
              } transition-all absolute top-10 w-fit flex left-[-10px] flex-col gap-1 bg-base-100 rounded-lg`}
            >
              <div className="flex flex-col overflow-auto">
                {Array.from(
                  { length: selectedChapterVersesAmount },
                  (_, index) => (
                    <DropDownMenuItem
                      key={index}
                      itemValue={index + 1}
                      onClick={() => {
                        setSelectedVerse(index);
                      }}
                    />
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Paragraph */}
      <div className="flex h-1/2 flex-row w-full gap-3 bg-base-200 px-4 py-2 rounded-lg">
        <p>{selectedText}</p>
      </div>
    </>
  );
}

export default TitleAndTextComponent;
