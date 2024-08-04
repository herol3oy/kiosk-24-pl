import axios from "axios";
import { useCallback, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";

const WEBSITES = [
  { key: "interia", url: "https://interia.pl" },
  { key: "onet", url: "https://onet.pl" },
  { key: "theguardian", url: "https://theguardian.com" },
  { key: "wyborcza", url: "https://wyborcza.pl" },
];

const WORKER_URL = "https://green-snow-8c39.potato0.workers.dev";

function App() {
  const [screenshots, setScreenshots] = useState([]);
  const [selectedScreenshot, setSelectedScreenshot] = useState<{
    filename: string;
    url: string;
  } | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedWebsite, setSelectedWebsite] = useState(WEBSITES[0].key);

  const fetchScreenshots = async () => {
    try {
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      const response = await axios.get(`${WORKER_URL}/screenshots`);
      const allScreenshots = response.data;
      const filteredScreenshots = allScreenshots.filter((filename: string) =>
        filename.startsWith(`${selectedWebsite}_${formattedDate}`)
      );
      setScreenshots(filteredScreenshots);
    } catch (error) {
      console.error("Error fetching screenshots:", error);
    }
  };

  const fetchScreenshot = async (filename: string) => {
    try {
      const response = await axios.get(`${WORKER_URL}/screenshot/${filename}`, {
        responseType: "blob",
      });
      const url = URL.createObjectURL(response.data);
      setSelectedScreenshot({ filename, url });
    } catch (error) {
      console.error("Error fetching screenshot:", error);
    }
  };

  const handleDateChange = useCallback((date: Date | null) => {
    if (date) {
      setSelectedDate(date);
    }
  }, []);

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        maxWidth: "800px",
        margin: "0 auto",
        padding: "20px",
      }}
    >
      <h1>Screenshot Viewer</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          fetchScreenshots();
        }}
        style={{ marginBottom: "20px" }}
      >
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="website">Website: </label>
          <select
            id="website"
            value={selectedWebsite}
            onChange={(e) => setSelectedWebsite(e.target.value)}
          >
            {WEBSITES.map((website) => (
              <option key={website.key} value={website.key}>
                {website.url}
              </option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="date">Date: </label>
          <DatePicker
            id="date"
            selected={selectedDate}
            onChange={handleDateChange}
          />
        </div>
        <button type="submit">Fetch Screenshots</button>
      </form>
      <div style={{ display: "flex" }}>
        <div style={{ width: "30%", marginRight: "20px" }}>
          <h2>Screenshots</h2>
          <ul style={{ listStyleType: "none", padding: 0 }}>
            {screenshots.map((filename) => (
              <li key={filename} style={{ marginBottom: "10px" }}>
                <button
                  onClick={() => fetchScreenshot(filename)}
                  style={{ width: "100%", textAlign: "left" }}
                >
                  {filename}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div style={{ width: "70%" }}>
          <h2>Selected Screenshot</h2>
          {selectedScreenshot ? (
            <div>
              <h3>{selectedScreenshot.filename}</h3>
              <img
                src={selectedScreenshot.url}
                alt={selectedScreenshot.filename}
                style={{ maxWidth: "100%" }}
              />
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
