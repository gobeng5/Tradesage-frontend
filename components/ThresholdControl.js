import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ThresholdControl.css";

const SESSION_THRESHOLDS = {
  "Sydney": 0.78,
  "Tokyo": 0.80,
  "London": 0.88,
  "New York": 0.90,
  "Tokyo-London": 0.85,
  "London-New York": 0.86,
};

const ThresholdControl = () => {
  const [currentSession, setCurrentSession] = useState("");
  const [activeThreshold, setActiveThreshold] = useState(0.8);
  const [manualOverride, setManualOverride] = useState("");
  const [overrideApplied, setOverrideApplied] = useState(false);

  useEffect(() => {
    detectSession();
  }, []);

  const detectSession = () => {
    const hour = new Date().getUTCHours();

    let session = "Sydney";
    if (hour >= 22 || hour < 2) session = "Sydney";
    else if (hour >= 2 && hour < 9) session = "Tokyo";
    else if (hour >= 9 && hour < 14) session = "London";
    else if (hour >= 14 && hour < 17) session = "London-New York";
    else if (hour >= 17 && hour < 20) session = "New York";
    else if (hour >= 8 && hour < 9) session = "Tokyo-London";

    setCurrentSession(session);
    setActiveThreshold(SESSION_THRESHOLDS[session] || 0.80);
  };

  const applyOverride = () => {
    if (manualOverride && !isNaN(manualOverride)) {
      axios.post("https://tradesage-backend.onrender.com/config/threshold", {
        override_threshold: parseFloat(manualOverride),
      });
      setOverrideApplied(true);
    }
  };

  return (
    <div className="threshold-control">
      <h3>🧠 Session-Based Confidence Control</h3>
      <p><strong>🕒 Current Session:</strong> {currentSession}</p>
      <p><strong>🎯 Default Threshold:</strong> {activeThreshold}</p>

      <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
        <input
          type="number"
          step="0.01"
          placeholder="Enter manual threshold"
          value={manualOverride}
          onChange={(e) => setManualOverride(e.target.value)}
        />
        <button onClick={applyOverride}>Apply Override</button>
      </div>

      {overrideApplied && (
        <p style={{ marginTop: "0.5rem", color: "#27ae60" }}>
          ✅ Override applied! New threshold: {manualOverride}
        </p>
      )}
    </div>
  );
};

export default ThresholdControl;
