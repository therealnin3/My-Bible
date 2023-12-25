import React from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { GlobalContext } from "../context/GlobalContext";

function VoiceSettingsPage() {
  // Global variables
  const {
    voicePitch,
    setVoicePitch,
    voiceSpeed,
    setVoiceSpeed,
    voiceVolume,
    setVoiceVolume,
  } = React.useContext(GlobalContext);

  const navigate = useNavigate();
  const handleRoute = () => {
    navigate("/");
  };

  return (
    <div className="flex-1 text-content">
      <div className="flex w-full mb-4">
        <FiArrowLeft onClick={handleRoute} size={24} className="text-primary" />
      </div>
      <div className="flex flex-col gap-4">
        <select className="bg-base-100 px-2 py-1 rounded-lg">
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
          <option value="option3">Option 3</option>
        </select>
        <div>
          <span>Pitch</span>
          <div className="flex flex-row gap-4">
            <input
              className="w-full"
              type="range"
              min="0"
              max="100"
              step="1"
              value={voicePitch}
              onChange={(e) => setVoicePitch(Number(e.target.value))}
            />
            <label className="px-4 py-2 w-16 flex items-center justify-center font-semibold bg-primary text-content-100 rounded-lg">
              {voicePitch}
            </label>
          </div>
        </div>
        <div>
          <span>Speed</span>
          <div className="flex flex-row gap-4">
            <input
              className="w-full"
              type="range"
              min="0"
              max="100"
              step="1"
              value={voiceSpeed}
              onChange={(e) => setVoiceSpeed(Number(e.target.value))}
            />
            <label className="px-4 py-2 w-16 flex items-center justify-center font-semibold bg-primary text-content-100 rounded-lg">
              {voiceSpeed}
            </label>
          </div>
        </div>
        <div>
          <span>Volume</span>
          <div className="flex flex-row gap-4">
            <input
              id="volume"
              className="w-full"
              type="range"
              min="0"
              max="100"
              step="1"
              value={voiceVolume}
              onChange={(e) => setVoiceVolume(Number(e.target.value))}
            />
            <label className="px-4 py-2 w-16 flex items-center justify-center font-semibold bg-primary text-content-100 rounded-lg">
              {voiceVolume}
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VoiceSettingsPage;
