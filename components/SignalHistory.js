import React, { useEffect, useState } from "react";
import axios from "axios";
import "./SignalHistory.css"; // Styling file

const SignalHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      const res = await axios.get("https://tradesage-backend.onrender.com/history");
      setHistory(res.data.history);
    } catch (err) {
      console.error("Error fetching signal history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const getConfidenceColor = (score) => {
    if (score >= 0.9) return "#2ecc71"; // Strong
    if (score >= 0.75) return "#f1c40f"; // Moderate
    return "#e74c3c"; // Weak
  };

  return (
    <div className="signal-history">
      <h2>🕒 Signal History</h2>
      {loading ? (
        <p>Loading signals...</p>
      ) : (
        <div className="signal-grid">
          {history.map((item, index) => (
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
