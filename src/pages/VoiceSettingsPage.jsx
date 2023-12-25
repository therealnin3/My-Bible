import React from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

function VoiceSettingsPage() {
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
          <input className="w-full" type="range" min="0" max="100" step="1" />
        </div>
        <div>
          <span>Speed</span>
          <input className="w-full" type="range" min="0" max="100" step="1" />
        </div>
        <div>
          <span>Volume</span>
          <input className="w-full" type="range" min="0" max="100" step="1" />
        </div>
      </div>
    </div>
  );
}

export default VoiceSettingsPage;
