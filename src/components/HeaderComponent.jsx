import React, { useState } from "react";

import { FiMoreHorizontal, FiMenu, FiX } from "react-icons/fi";
import { GlobalContext } from "../context/GlobalContext";
import DropDownMenuItem from "./DropDownMenuItem";

function HeaderComponent() {
  // Global variables
  const { allBooks, setSelectedBook } = React.useContext(GlobalContext);

  // Local variables
  const [isSelectingBook, setIsSelectingBook] = useState(true);

  return (
    <>
      <div
        className={`${
          isSelectingBook ? "w-60 p-4" : "w-0 p-0 overflow-hidden"
        } absolute inset-0 transition-all duration-300 bg-base-100 flex flex-col rounded-lg z-50 `}
      >
        <div className="flex px-4 pt-2 pb-4 items-center justify-between">
          <label className="text-lg font-semibold whitespace-nowrap">
            Select a book
          </label>
          <FiX
            onClick={() => setIsSelectingBook(!isSelectingBook)}
            size={24}
            className="hover:rotate-90 transition-all"
          />
        </div>
        <div className="flex flex-col overflow-auto">
          {allBooks.map((bookName) => (
            <DropDownMenuItem
              key={bookName}
              itemValue={bookName}
              onClick={() => {
                setSelectedBook(bookName);
                setIsSelectingBook(!isSelectingBook);
              }}
            />
          ))}
        </div>
      </div>
      <div className="w-full flex flex-row items-center justify-between">
        <FiMenu
          onClick={() => setIsSelectingBook(!isSelectingBook)}
          size={24}
        />
        <span className="text-lg font-semibold">Currently playing</span>
        <FiMoreHorizontal size={24} className="text-primary" />
      </div>
    </>
  );
}

export default HeaderComponent;
