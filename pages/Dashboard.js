import React, { useState } from "react";
import SignalChart from "../components/SignalChart";
import SignalHistory from "../components/SignalHistory";

const Dashboard = () => {
  const [selectedPair, setSelectedPair] = useState("EUR/USD");

  return (
    <div>
      <h1>📊 TradeSage FX Dashboard</h1>

      {/* Pair Selector (Optional UI) */}
      <select
        value={selectedPair}
        onChange={(e) => setSelectedPair(e.target.value)}
        style={{ marginBottom: "1rem" }}
      >
        <option>EUR/USD</option>
        <option>USD/JPY</option>
        <option>GBP/USD</option>
        <option>AUD/USD</option>
        <option>USD/CHF</option>
        <option>EUR/JPY</option>
      </select>

      {/* Confidence Chart */}
      <SignalChart selectedPair={selectedPair} />

      {/* Historical Signal List */}
      <SignalHistory />
    </div>
  );
};

export default Dashboard;
