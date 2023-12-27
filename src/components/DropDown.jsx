import React from "react";

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
}) {
  if (maxNumber) {
    const numbers = [...Array(maxNumber).keys()];

    console.log(numbers);
    return (
      <div className="dropdown dropdown-bottom dropdown-end">
        <div tabIndex={0} role="button" className="btn m-1">
          {selectedItem + 1}
        </div>
        <ul
          tabIndex={0}
          className="w-fit dropdown-content h-52 flex flex-col overflow-y-auto z-[1] menu p-2 shadow bg-base-100 rounded-box"
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
        <div tabIndex={0} role="button" className="btn m-1">
          {bookNames[selectedItem]}
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content h-52 flex flex-col overflow-y-auto z-[1] w-fit menu p-2 shadow bg-base-100 rounded-box"
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