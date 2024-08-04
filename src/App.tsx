import axios from 'axios';
import { useEffect, useState } from 'react';

function App() {
  const [screenshots, setScreenshots] = useState([]);
  const [selectedScreenshot, setSelectedScreenshot] = useState<{filename:string, url:string}|null>(null);

  useEffect(() => {
    fetchScreenshots();
  }, []);

  const fetchScreenshots = async () => {
    try {
      const response = await axios.get('/api/screenshots');
      setScreenshots(response.data);
    } catch (error) {
      console.error('Error fetching screenshots:', error);
    }
  };

  const fetchScreenshot = async (filename: string) => {
    try {
      const response = await axios.get(`/api/screenshot/${filename}`, {
        responseType: 'blob',
      });
      const url = URL.createObjectURL(response.data);
      setSelectedScreenshot({ filename, url });
    } catch (error) {
      console.error('Error fetching screenshot:', error);
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>Screenshot Viewer</h1>
      <div style={{ display: 'flex' }}>
        <div style={{ width: '30%', marginRight: '20px' }}>
          <h2>Screenshots</h2>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {screenshots.map((filename) => (
              <li key={filename} style={{ marginBottom: '10px' }}>
                <button onClick={() => fetchScreenshot(filename)} style={{ width: '100%', textAlign: 'left' }}>
                  {filename}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div style={{ width: '70%' }}>
          <h2>Selected Screenshot</h2>
          {selectedScreenshot ? (
            <div>
              <h3>{selectedScreenshot.filename}</h3>
              <img src={selectedScreenshot.url} alt={selectedScreenshot.filename} style={{ maxWidth: '100%' }} />
            </div>
          ) : (
            <p>No screenshot selected</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;