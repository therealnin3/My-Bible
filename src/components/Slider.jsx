import React from "react";

function Slider({
  sliderName,
  sliderValue,
  setSliderValue,
  min,
  max,
  stepSize,
}) {
  return (
    <div className="flex flex-col gap-1">
      <label>{sliderName}</label>
      <div className="flex flex-row items-center gap-2">
        <div className="flex flex-col gap-2 w-full">
          <input
            id="volume"
            type="range"
            min={min}
            max={max}
            step={stepSize ? stepSize : 1}
            value={sliderValue}
            onChange={(e) => setSliderValue(e.target.value)}
            className="range range-primary"
          />{" "}
          {stepSize && (
            <div className="w-full flex justify-between text-xs px-2">
              {Array.from(
                { length: Math.floor((max - min) / stepSize) + 1 },
                (_, i) => min + i * stepSize
              ).map((value, index) => (
                <span key={index}>{value}</span>
              ))}
            </div>
          )}
        </div>
        <label className="px-4 py-3 w-16 flex items-center justify-center border border-primary rounded-lg">
          {sliderValue}
        </label>
      </div>
    </div>
  );
}

export default Slider;
