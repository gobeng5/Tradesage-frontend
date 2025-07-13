import React from "react";
import SignalHistory from "../components/SignalHistory";

const Dashboard = () => {
  return (
    <div>
      <h1>📊 TradeSage FX Dashboard</h1>
      <SignalHistory />
      {/* You can add SignalList or LiveSignal components here */}
    </div>
  );
};

export default Dashboard;
