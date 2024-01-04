import React, { useState, useRef } from "react";
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
  const [showDropDown, setShowDropDown] = useState(false);

  if (maxNumber) {
    const numbers = [...Array(maxNumber).keys()];
    return (
      <div onClick={() => setShowDropDown(!showDropDown)} className="relative">
        <div className="flex flex-row items-center justify-center gap-2">
          {icon === "left" && (
            <FiChevronDown size={20} className="text-primary" />
          )}
          {selectedItem + 1}
          {icon === "right" && (
            <FiChevronDown size={20} className="text-primary" />
          )}
        </div>

        {/* Drop-Down */}
        <div
          className={`${
            showDropDown
              ? "h-[300px] w-16 overflow-auto"
              : "h-0 w-0 overflow-hidden"
          } absolute left-0 top-10 h-52 rounded-lg bg-base-300 shadow-lg transition-all`}
        >
          <ul className="flex flex-col items-center justify-center px-2 py-1">
            {numbers.map((number) => (
              <li
                className="flex flex-row items-center justify-center rounded-lg px-4 py-1 hover:bg-base-100"
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
                {number + 1}
              </li>
            ))}
          </ul>
        </div>
      </div>
      // <div className="dropdown dropdown-end dropdown-bottom">
      //   <div
      //     tabIndex={0}
      //     role="button"
      //     className="flex flex-row items-center gap-2 bg-blue-500"
      //   >
      //     {icon === "left" && (
      //       <FiChevronDown size={20} className="text-primary" />
      //     )}
      //     {selectedItem + 1}
      //     {icon === "right" && (
      //       <FiChevronDown size={20} className="text-primary" />
      //     )}
      //   </div>

      //   <ul
      //     tabIndex={0}
      //     className="menu dropdown-content z-[1] m-0 flex h-[300px] w-fit flex-col items-center overflow-y-auto rounded-box bg-base-200 p-2 shadow"
      //   >
      //     {numbers.map((number) => (
      //       <li
      //         className="m-0 flex h-fit w-fit items-center justify-center p-0"
      //         key={number}
      //         onClick={() => {
      //           setSelectedItem(number);
      //           selectedRef.current = number;
      //           stopPlayingText();
      //           setIsPaused(true);
      //           {
      //             setChangeChapterByDropDown &&
      //               setChangeChapterByDropDown(true);
      //           }
      //         }}
      //       >
      //         <a>{number + 1}</a>
      //       </li>
      //     ))}
      //   </ul>
      // </div>
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
