import React, { useEffect, useState } from 'react';

function App() {
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [uploading, setUploading] = useState(false);

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

  return (
    <div style={{ textAlign: 'center', fontFamily: 'Arial', padding: '40px' }}>
      <h1>TradeSage FX 📈</h1>
      <p>Smart trading signals with screenshot intelligence</p>

      {loading ? <p>Loading signals...</p> : error ? (
        <p style={{ color: 'red' }}>Failed to load signals. Try again later.</p>
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
            {signals.map((s, i) => (
              <tr key={i}>
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

      <hr style={{ margin: '40px 0' }} />
      <h3>📤 Upload Screenshot for Analysis</h3>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <br /><br />
      <button onClick={handleAnalyze} disabled={!file || uploading}>
        {uploading ? 'Analyzing...' : 'Analyze Screenshot'}
      </button>

      {analysis && (
        <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc' }}>
          <h4>📊 Analysis Result</h4>
          <pre>{JSON.stringify(analysis, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
