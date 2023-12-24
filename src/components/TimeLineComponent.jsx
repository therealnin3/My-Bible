import React from "react";

function TimeLineComponent() {
  return (
    <div className="flex flex-col gap-1">
      <div className="w-full bg-base-200 rounded-lg h-2 relative">
        <div className="absolute w-3/4 h-full bg-content-100 rounded-full"></div>
      </div>
      <div className="w-full flex flex-row justify-between items-center text-content-200">
        <label>2:42</label>
        <label>-1:21</label>
      </div>
    </div>
  );
}

export default TimeLineComponent;
