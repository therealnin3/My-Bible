import React from "react";

import { FiPlay, FiSkipBack, FiSkipForward } from "react-icons/fi";

function PlayButtonsComponent() {
  return (
    <div className="flex flex-row gap-5 items-center justify-center">
      <FiSkipBack size={24} className="text-content-100 fill-content-100" />
      <div className="bg-content-100 w-fit h-fit rounded-full p-4">
        <FiPlay size={24} className="text-base-300 fill-base-300" />
      </div>
      <FiSkipForward size={24} className="text-content-100 fill-content-100" />
    </div>
  );
}

export default PlayButtonsComponent;
