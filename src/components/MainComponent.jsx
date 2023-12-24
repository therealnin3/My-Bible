import { React } from "react";

// Import components
import PlayButtonsComponent from "./PlayButtonsComponent";
import TimeLineComponent from "./TimeLineComponent";
import TitleAndTextComponent from "./TitleAndTextComponent";

function MainComponent() {
  return (
    <div className="flex-1 gap-3 mt-16 flex flex-col">
      <TitleAndTextComponent />
      {/* Empty div to push down rest of components */}
      <div className="flex-1"></div>
      <div className="flex flex-col justify-center pb-10">
        <TimeLineComponent />
        <PlayButtonsComponent />
      </div>
    </div>
  );
}

export default MainComponent;
