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
    try {
      const res = await axios.get("https://tradesage-backend.onrender.com/signals");
      setSignals(res.data.signals || []);
    } catch (err) {
      console.error("Failed to fetch signals:", err);
    }
  };

  const getBadge = (type) => (
    <span style={{
      backgroundColor: TRADE_COLORS[type] || "#7f8c8d",
      color: "#fff",
      padding: "4px 8px",
      borderRadius: "4px",
      fontSize: "0.9rem",
      fontWeight: "bold"
    }}>{type}</span>
  );

  const filteredSignals = signals
    .filter(s => selectedPair === "" || s.pair === selectedPair)
    .sort((a, b) => b[sortKey] - a[sortKey]);

  return (
    <div className="dashboard">
      <h2>📈 TradeSage FX: Multi-Timeframe Signals</h2>

      <div className="filter-bar">
        <label>
          Pair:
          <select onChange={e => setSelectedPair(e.target.value)} value={selectedPair}>
            <option value="">All Pairs</option>
            {Array.from(new Set(signals.map(s => s.pair))).map(pair => (
              <option key={pair} value={pair}>{pair}</option>
            ))}
          </select>
        </label>

        <label>
          Sort by:
          <select onChange={e => setSortKey(e.target.value)} value={sortKey}>
            <option value="confidence">Confidence</option>
            <option value="timestamp">Timestamp</option>
          </select>
        </label>
      </div>

      <table className="signal-table">
        <thead>
          <tr>
            <th>Pair</th>
            <th>Timeframe</th>
            <th>Strategy</th>
            <th>Type</th>
            <th>Bias</th>
            <th>Confidence</th>
            <th>Entry</th>
            <th>TP</th>
            <th>SL</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {filteredSignals.length === 0 ? (
            <tr><td colSpan="10">⚠️ No signals found for current filter.</td></tr>
          ) : (
            filteredSignals.map((s, idx) => (
              <tr key={idx}>
                <td>{s.pair}</td>
                <td>{s.timeframe}</td>
                <td>{s.strategy}</td>
                <td>{getBadge(s.trade_type)}</td>
                <td>{s.macro_bias}</td>
                <td>{(s.confidence * 100).toFixed(1)}%</td>
                <td>{s.entry}</td>
                <td>{s.take_profit}</td>
                <td>{s.stop_loss}</td>
                <td>{s.timestamp}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SignalDashboard;
