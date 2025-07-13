import React, { useEffect, useState } from "react";
import axios from "axios";
import "./SignalHistory.css";

const SignalHistory = () => {
  const [history, setHistory] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🧠 Filters
  const [signalType, setSignalType] = useState("All");
  const [confidenceLevel, setConfidenceLevel] = useState("All");
  const [pair, setPair] = useState("All");

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [history, signalType, confidenceLevel, pair]);

  const fetchHistory = async () => {
    try {
      const res = await axios.get("https://tradesage-backend.onrender.com/history");
      setHistory(res.data.history);
    } catch (err) {
      console.error("Error fetching history:", err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filteredData = [...history];

    if (signalType !== "All") {
      filteredData = filteredData.filter((h) => h.signal_type === signalType);
    }

    if (confidenceLevel !== "All") {
      filteredData = filteredData.filter((h) => {
        const score = h.confidence;
        if (confidenceLevel === "Strong") return score >= 0.9;
        if (confidenceLevel === "Moderate") return score >= 0.75 && score < 0.9;
        return score < 0.75;
      });
    }

    if (pair !== "All") {
      filteredData = filteredData.filter((h) => h.pair === pair);
    }

    setFiltered(filteredData);
  };

  const getConfidenceColor = (score) => {
    if (score >= 0.9) return "#2ecc71";
    if (score >= 0.75) return "#f1c40f";
    return "#e74c3c";
  };

  const uniquePairs = [...new Set(history.map((h) => h.pair))];

  return (
    <div className="signal-history">
      <h2>🧠 Filtered Signal History</h2>

      {/* 🔎 Filter Controls */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem", flexWrap: "wrap" }}>
        <select value={signalType} onChange={(e) => setSignalType(e.target.value)}>
          <option value="All">All Signals</option>
          <option value="Buy">Buy</option>
          <option value="Hold">Hold</option>
        </select>

        <select value={confidenceLevel} onChange={(e) => setConfidenceLevel(e.target.value)}>
          <option value="All">All Confidence</option>
          <option value="Strong">Strong (&ge; 90%)</option>
          <option value="Moderate">Moderate (75–89%)</option>
          <option value="Weak">Weak (&lt; 75%)</option>
        </select>

        <select value={pair} onChange={(e) => setPair(e.target.value)}>
          <option value="All">All Pairs</option>
          {uniquePairs.map((p, i) => (
            <option key={i} value={p}>{p}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Loading signal logs...</p>
      ) : filtered.length === 0 ? (
        <p>No signals match these filters.</p>
      ) : (
        <div className="signal-grid">
          {filtered.map((item, index) => (
            <div className="signal-card" key={index}>
              <div className="card-header">
                <strong>{item.pair}</strong>
                <span style={{ color: getConfidenceColor(item.confidence) }}>
                  {item.confidence * 100}% Confidence
                </span>
              </div>
              <div className="card-body">
                <p><strong>Signal:</strong> {item.signal_type}</p>
                <p><strong>Strategy:</strong> {item.strategy || "Composite Strategy"}</p>
                <p><strong>Indicators:</strong> {item.indicators.join(", ")}</p>
                <p><strong>Confirmations:</strong> {item.confirmations.join(", ")}</p>
                <p><strong>Logged At:</strong> {new Date(item.logged_at).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SignalHistory;
