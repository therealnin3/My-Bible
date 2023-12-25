import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMoreHorizontal, FiMenu, FiX } from "react-icons/fi";
import { GlobalContext } from "../context/GlobalContext";
import DropDownMenuItem from "./DropDownMenuItem";

function HeaderComponent() {
  // Global variables
  const { Bible, setSelectedBook } = React.useContext(GlobalContext);

  // Local variables
  const [isSelectingBook, setIsSelectingBook] = useState(false);
  const [isOpeningSettings, setIsOpeningSettings] = useState(false);
  const [allBooks] = useState(Bible.map((book) => book.name));

  const navigate = useNavigate();
  const handleRoute = () => {
    navigate("/My-Bible/Settings");
  };

  return (
    <>
      <div
        className={`${
          isSelectingBook ? "w-60 p-4" : "w-0 p-0 overflow-hidden"
        } absolute inset-0 transition-all duration-300 bg-base-100 flex flex-col rounded-lg z-50 `}
      >
        <div
          className={`${
            isSelectingBook ? "" : "w-0"
          } flex overflow-hidden px-4 pt-2 pb-4 items-center justify-between`}
        >
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
          {allBooks.map((bookName, index) => (
            <DropDownMenuItem
              key={index}
              itemValue={bookName}
              onClick={() => {
                setSelectedBook(index);
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
        <div className="relative">
          <FiMoreHorizontal
            onClick={() => setIsOpeningSettings(!isOpeningSettings)}
            size={24}
            className="text-primary"
          />

          <div
            className={`${
              isOpeningSettings ? "h-fit px-3 py-2 w-fit" : "h-0 w-0"
            } absolute right-1 z-50 top-10 bg-base-100 rounded-lg transition-all overflow-hidden`}
          >
            <DropDownMenuItem
              onClick={handleRoute}
              itemValue={"Voice Settings"}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default HeaderComponent;
