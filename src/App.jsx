import React, { useEffect, useState } from 'react';

function App() {
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://tradesage-backend.onrender.com/signals')
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
    <div style={{ textAlign: 'center', marginTop: '40px', fontFamily: 'Arial' }}>
      <h1>TradeSage FX 📈</h1>
      <p>Smart trading signals in real-time</p>

      {loading ? (
        <p>Loading signals...</p>
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
