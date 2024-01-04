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
    <div className="flex flex-col">
      <label>{sliderName}</label>
      <div className="flex flex-row items-center gap-4">
        <div className="relative flex w-full flex-col gap-2">
          <input
            id="volume"
            type="range"
            min={min}
            max={max}
            step={stepSize ? stepSize : 1}
            value={sliderValue}
            onChange={(e) => setSliderValue(e.target.value)}
            className="range range-primary"
          />
          {/* Range if given */}
          {stepSize && (
            <div className="absolute top-8 flex w-full justify-between px-2 text-xs">
              {Array.from(
                { length: Math.floor((max - min) / stepSize) + 1 },
                (_, i) => min + i * stepSize,
              ).map((value, index) => (
                <span key={index}>{value}</span>
              ))}
            </div>
          )}
        </div>
        <div className="flex h-10 w-12 items-center justify-center rounded-lg border border-primary">
          <label className="">{sliderValue}</label>
        </div>
      </div>
    </div>
  );
}

export default Slider;
