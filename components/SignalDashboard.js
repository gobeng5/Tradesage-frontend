import React, { useEffect, useState } from "react";
import axios from "axios";
import "./SignalDashboard.css";

const TRADE_COLORS = {
  "Intraday": "#2980b9",
  "Swing Trade": "#8e44ad",
  "Day Trade": "#27ae60"
};

const SignalDashboard = () => {
  const [signals, setSignals] = useState([]);
  const [selectedPair, setSelectedPair] = useState("");
  const [sortKey, setSortKey] = useState("confidence");

  useEffect(() => {
    fetchSignals();
  }, []);

  const fetchSignals = async () => {
    const res = await axios.get("https://tradesage-backend.onrender.com/signals");
    setSignals(res.data.signals || []);
  };

  const getBadge = (type) => (
    <span style={{
      backgroundColor: TRADE_COLORS[type] || "#7f8c8d",
      color: "#fff",
      padding: "4px 8px",
      borderRadius: "4px"
    }}>{type}</span>
  );

  const filtered = signals
    .filter(s => selectedPair === "" || s.pair === selectedPair)
    .sort((a, b) => b[sortKey] - a[sortKey]);

  return (
    <div className="dashboard">
      <h2>📈 Multi-Timeframe Signals</h2>

      <div className="filter-bar">
        <select onChange={e => setSelectedPair(e.target.value)}>
          <option value="">All Pairs</option>
          {Array.from(new Set(signals.map(s => s.pair))).map(pair => (
            <option key={pair} value={pair}>{pair}</option>
          ))}
        </select>

        <select onChange={e => setSortKey(e.target.value)}>
          <option value="confidence">Confidence</option>
          <option value="timestamp">Timestamp</option>
        </select>
      </div>

      <div className="signal-grid">
        {filtered.map((signal, idx) => (
          <div key={idx} className="signal-card">
            <h3>{signal.pair}</h3>
            <p><strong>🧠 Confidence:</strong> {signal.confidence * 100}%</p>
            <p><strong>📊 Strategy:</strong> {signal.strategy}</p>
            <p><strong>📍 Entry:</strong> {signal.entry}</p>
            <p><strong>🏁 TP:</strong> {signal.take_profit}</p>
            <p><strong>🛑 SL:</strong> {signal.stop_loss}</p>
            <p><strong>🔁 Outcome:</strong> {signal.outcome || "Pending"}</p>
            <p><strong>🕒 Time:</strong> {signal.timestamp}</p>
            <p><strong>📌 Bias:</strong> {signal.macro_bias}</p>
            <p><strong>🏷 Type:</strong> {getBadge(signal.trade_type)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SignalDashboard;
