import React from "react";
import { FiChevronDown } from "react-icons/fi";

function DropDown({
  selectedItem,
  selectedRef,
  setSelectedItem,
  maxNumber,
  bookNames,
  setChangeBookByDropDown,
  setChangeChapterByDropDown,
  stopPlayingText,
  setIsPaused,
  icon,
}) {
  if (maxNumber) {
    const numbers = [...Array(maxNumber).keys()];
    return (
      <div className="dropdown dropdown-end dropdown-bottom">
        <div
          tabIndex={0}
          role="button"
          className="flex flex-row items-center gap-2"
        >
          {icon === "left" && (
            <FiChevronDown size={20} className="text-primary" />
          )}
          {selectedItem + 1}
          {icon === "right" && (
            <FiChevronDown size={20} className="text-primary" />
          )}
        </div>

        <ul
          tabIndex={0}
          className="menu dropdown-content z-[1] flex h-52 w-fit flex-col overflow-y-auto rounded-box bg-base-100 p-2 shadow"
        >
          {numbers.map((number) => (
            <li
              className="w-fit"
              key={number}
              onClick={() => {
                setSelectedItem(number);
                selectedRef.current = number;
                stopPlayingText();
                setIsPaused(true);
                {
                  setChangeChapterByDropDown &&
                    setChangeChapterByDropDown(true);
                }
              }}
            >
              <a>{number + 1}</a>
            </li>
          ))}
        </ul>
      </div>
    );
  } else {
    return (
      <div className="dropdown">
        <div
          tabIndex={0}
          role="button"
          className="flex flex-row items-center gap-2"
        >
          {icon === "left" && (
            <FiChevronDown size={20} className="text-primary" />
          )}
          {bookNames[selectedItem]}
          {icon === "right" && (
            <FiChevronDown size={20} className="text-primary" />
          )}
        </div>
        <ul
          tabIndex={0}
          className="menu dropdown-content z-[1] flex h-52 w-fit flex-col overflow-y-auto rounded-box bg-base-100 p-2 shadow"
        >
          {bookNames.map((bookName, index) => (
            <li
              className="w-fit"
              key={index}
              onClick={() => {
                setSelectedItem(index);
                selectedRef.current = index;
                setChangeBookByDropDown(true);
                stopPlayingText();
                setIsPaused(true);
              }}
            >
              <a>{bookName}</a>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default DropDown;
