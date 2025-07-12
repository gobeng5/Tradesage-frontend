import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://YOUR-BACKEND-URL/signals')
      .then(response => response.json())
      .then(data => {
        setSignals(data.signals || []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching signals:', error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="App">
      <h1>TradeSage FX 📈</h1>
      <p>High-probability trading signals</p>

      {loading ? (
        <p>Loading signals...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Pair</th>
              <th>Timeframe</th>
              <th>Strategy</th>
              <th>Type</th>
              <th>Confidence</th>
            </tr>
          </thead>
          <tbody>
            {signals.map((s, index) => (
              <tr key={index}>
                <td>{s.pair}</td>
                <td>{s.timeframe}</td>
                <td>{s.strategy}</td>
                <td>{s.signal_type}</td>
                <td>{(s.confidence * 100).toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
