import React, { useEffect, useState } from "react";

function ResultHistory() {
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const res = await fetch("http://localhost:5000/results", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      const data = await res.json();
      setResults(data.results || []);
    } catch (err) {
      console.log("ERROR:", err);
    }
  };

  // ---------------- STYLES ----------------
  const container = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minHeight: "100vh",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: "#f0f2f5",
    paddingTop: 50,
    paddingBottom: 50,
  };

  const card = {
    backgroundColor: "white",
    padding: 30,
    borderRadius: 12,
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
    width: "90%",
    maxWidth: 700,
    textAlign: "center",
  };

  const table = {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: 20,
  };

  const th = {
    backgroundColor: "#1e3a8a",
    color: "white",
    padding: "10px",
    fontSize: 14,
    border: "1px solid #ddd",
  };

  const td = {
    padding: "10px",
    border: "1px solid #ddd",
    fontSize: 14,
  };

  const rowHover = (e) => (e.currentTarget.style.backgroundColor = "#f5f5f5");
  const rowOut = (e) => (e.currentTarget.style.backgroundColor = "white");

  return (
    <div style={container}>
      <h1 style={{ color: "#1e3a8a", marginBottom: 30 }}>📊 Interview History</h1>

      <div style={card}>
        {results.length === 0 ? (
          <p>No results yet.</p>
        ) : (
          <table style={table}>
            <thead>
              <tr>
                <th style={th}>Score</th>
                <th style={th}>Time (sec)</th>
                <th style={th}>Date</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r, index) => (
                <tr
                  key={index}
                  onMouseOver={rowHover}
                  onMouseOut={rowOut}
                  style={{ backgroundColor: "white" }}
                >
                  <td style={td}>{r.score} / 50</td>
                  <td style={td}>{r.time_taken}</td>
                  <td style={td}>{r.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default ResultHistory;