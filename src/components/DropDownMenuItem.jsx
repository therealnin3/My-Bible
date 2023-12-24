import React from "react";

function DropDownMenuItem({ itemValue, onClick }) {
  return (
    <div
      onClick={onClick}
      className="flex cursor-pointer flex-row w-full px-4 py-2 whitespace-nowrap bg-base-100 rounded-lg hover:bg-primary"
    >
      {itemValue}
    </div>
  );
}

export default DropDownMenuItem;
