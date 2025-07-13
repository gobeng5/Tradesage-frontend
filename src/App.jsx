import React, { useEffect, useState } from 'react';

function App() {
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchSignals = () => {
    fetch('https://tradesage-backend.onrender.com/signals')
      .then(response => response.json())
      .then(data => {
        setSignals(data.signals || []);
        setLoading(false);
        setError(false);
      })
      .catch(err => {
        console.error('Error fetching signals:', err);
        setLoading(false);
        setError(true);
      });
  };

  useEffect(() => {
    fetchSignals(); // Initial fetch
    const interval = setInterval(fetchSignals, 15 * 60 * 1000); // Every 15 mins
    return () => clearInterval(interval); // Clean up
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '40px', fontFamily: 'Arial' }}>
      <h1>TradeSage FX 📈</h1>
      <p>Smart trading signals in real-time</p>

      {loading ? (
        <p>Loading signals...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>
          Failed to load signals. Check backend status or try again later.
        </p>
      ) : (
        <table style={{ margin: '20px auto', borderCollapse: 'collapse', width: '80%' }}>
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
