import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

const SignalChart = ({ selectedPair }) => {
  const [trendData, setTrendData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTrend = async () => {
    try {
      const res = await axios.get("https://tradesage-backend.onrender.com/analytics/confidence", {
        params: { pair: selectedPair, limit: 100 }
      });
      setTrendData(res.data.trend[selectedPair] || []);
    } catch (err) {
      console.error("Error loading trend data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedPair) fetchTrend();
  }, [selectedPair]);

  return (
    <div style={{ padding: "1rem" }}>
      <h2>📊 Confidence Trend: {selectedPair}</h2>
      {loading ? (
        <p>Loading chart data...</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trendData}>
            <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
            <XAxis dataKey="x" tick={{ fontSize: 12 }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="y" name="Confidence %" stroke="#2ecc71" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default SignalChart;
