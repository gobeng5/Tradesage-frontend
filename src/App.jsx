import React, { useEffect, useState } from 'react';

const TRADE_COLORS = {
  "Intraday": "#2980b9",
  "Swing Trade": "#8e44ad",
  "Day Trade": "#27ae60"
};

function App() {
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [selectedPair, setSelectedPair] = useState("");
  const [sortKey, setSortKey] = useState("confidence");

  const fetchSignals = () => {
    fetch('https://tradesage-backend.onrender.com/signals')
      .then(res => res.json())
      .then(data => {
        setSignals(data.signals || []);
        setLoading(false);
        setError(false);
      })
      .catch(() => {
        setLoading(false);
        setError(true);
      });
  };

  useEffect(() => {
    fetchSignals();
    const interval = setInterval(fetchSignals, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setAnalysis(null);
  };

  const handleAnalyze = () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    fetch('https://tradesage-backend.onrender.com/analyze', {
      method: 'POST',
      body: formData,
    })
      .then(res => res.json())
      .then(data => {
        setAnalysis(data);
        setUploading(false);
      })
      .catch(err => {
        console.error('Error analyzing image:', err);
        setUploading(false);
      });
  };

  const getBadge = (type) => (
    <span style={{
      backgroundColor: TRADE_COLORS[type] || "#7f8c8d",
      color: "#fff",
      padding: "4px 8px",
      borderRadius: "4px",
      fontSize: "0.8rem",
      fontWeight: "bold"
    }}>{type}</span>
  );

  const filteredSignals = signals
    .filter(s => selectedPair === "" || s.pair === selectedPair)
    .sort((a, b) => b[sortKey] - a[sortKey]);

  return (
    <div style={{ fontFamily: 'Arial', padding: '40px' }}>
      <h1 style={{ textAlign: 'center' }}>TradeSage FX 📈</h1>
      <p style={{ textAlign: 'center' }}>Smart trading signals with screenshot intelligence</p>

      <div style={{ margin: '20px 0', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <label>
          Pair:
          <select onChange={e => setSelectedPair(e.target.value)} value={selectedPair} style={{ marginLeft: '0.5rem' }}>
            <option value="">All Pairs</option>
            {Array.from(new Set(signals.map(s => s.pair))).map(pair => (
              <option key={pair} value={pair}>{pair}</option>
            ))}
          </select>
        </label>
        <label>
          Sort:
          <select onChange={e => setSortKey(e.target.value)} value={sortKey} style={{ marginLeft: '0.5rem' }}>
            <option value="confidence">Confidence</option>
            <option value="timestamp">Timestamp</option>
          </select>
        </label>
      </div>

      {loading ? <p>Loading signals...</p> : error ? (
        <p style={{ color: 'red' }}>Failed to load signals. Try again later.</p>
      ) : (
        <table style={{ margin: '0 auto', borderCollapse: 'collapse', width: '90%' }}>
          <thead>
            <tr style={{ backgroundColor: '#f4f4f4' }}>
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
              <tr><td colSpan="10" style={{ textAlign: 'center' }}>⚠️ No signals found for current filter.</td></tr>
            ) : (
              filteredSignals.map((s, i) => (
                <tr key={i}>
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
      )}

      <hr style={{ margin: '40px 0' }} />
      <h3 style={{ textAlign: 'center' }}>📤 Upload Screenshot for Analysis</h3>
      <div style={{ textAlign: 'center' }}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <br /><br />
        <button onClick={handleAnalyze} disabled={!file || uploading}>
          {uploading ? 'Analyzing...' : 'Analyze Screenshot'}
        </button>
      </div>

      {analysis && (
        <div style={{
          marginTop: '30px',
          padding: '20px',
          border: '1px solid #ccc',
          maxWidth: '800px',
          margin: '30px auto'
        }}>
          <h4>📊 Analysis Result</h4>
          <pre style={{ textAlign: 'left' }}>{JSON.stringify(analysis, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
