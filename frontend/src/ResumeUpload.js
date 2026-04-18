import { useState, useEffect } from "react";

function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [analysisMap, setAnalysisMap] = useState({});

  // ---------------- Styles ----------------
  const styles = {
    container: {
      padding: "50px 20px",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      maxWidth: 1000,
      margin: "0 auto",
      backgroundColor: "#f7f9fc",
      minHeight: "100vh",
    },
    header: {
      color: "#1e3a8a",
      marginBottom: 25,
      fontSize: "2.2rem",
      textAlign: "center",
      fontWeight: "bold",
    },
    inputWrapper: {
      display: "flex",
      gap: 10,
      alignItems: "center",
      marginBottom: 20,
      flexWrap: "wrap",
      justifyContent: "center",
    },
    input: {
      padding: 12,
      borderRadius: 8,
      border: "1px solid #ccc",
      fontSize: 16,
      cursor: "pointer",
      flex: "1 1 250px",
    },
    card: {
      marginBottom: 20,
      borderRadius: 12,
      boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
      backgroundColor: "white",
      padding: 25,
      transition: "transform 0.2s",
    },
    cardHover: {
      transform: "scale(1.02)",
    },
    filename: { fontSize: 16, fontWeight: 600, color: "#1e3a8a" },
    button: {
      padding: "10px 20px",
      margin: "10px 5px 0 0",
      borderRadius: 8,
      border: "none",
      cursor: "pointer",
      fontWeight: 600,
      transition: "all 0.3s",
      fontSize: 14,
    },
    buttonPrimary: {
      backgroundColor: "#1e3a8a",
      color: "white",
    },
    buttonSecondary: {
      backgroundColor: "#2196F3",
      color: "white",
    },
    buttonDanger: {
      backgroundColor: "#f44336",
      color: "white",
    },
    buttonNeutral: {
      backgroundColor: "#777",
      color: "white",
    },
    analysisBox: {
      marginTop: 15,
      backgroundColor: "#eef1f6",
      padding: 15,
      borderRadius: 8,
      fontSize: 14,
      color: "#333",
      boxShadow: "inset 0 0 5px rgba(0,0,0,0.05)",
      whiteSpace: "pre-wrap",
    },
  };

  // Hover effects
  const handleHover = (e, bg) => (e.target.style.backgroundColor = bg);
  const handleLeave = (e, original) => (e.target.style.backgroundColor = original);

  // ---------------- Fetch My Resumes ----------------
  const fetchResumes = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await fetch("http://localhost:5000/my-resumes", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status === 401) {
      alert("Unauthorized! Please login again.");
      return;
    }

    const data = await res.json();
    setResumes(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  // ---------------- Upload ----------------
  const uploadFile = async () => {
    if (!file) return alert("Select a file first");

    const formData = new FormData();
    formData.append("file", file);

    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:5000/upload-resume", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const data = await res.json();
    alert(data.message);
    fetchResumes();
  };

  // ---------------- Download ----------------
  const downloadSpecific = async (id, filename) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:5000/download-resume/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
  };

  // ---------------- Delete ----------------
  const deleteResume = async (id) => {
    const token = localStorage.getItem("token");
    await fetch(`http://localhost:5000/delete-resume/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchResumes();
  };

  // ---------------- Preview ----------------
  const previewResume = async (id) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:5000/download-resume/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    window.open(url);
  };

  // ---------------- Analyze ----------------
  const analyzeResume = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/analyze-resume/${id}`, {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      });
      const data = await res.json();
      setAnalysisMap((prev) => ({ ...prev, [id]: data.analysis || "No analysis returned" }));
    } catch (err) {
      console.error("Analyze error:", err);
      setAnalysisMap((prev) => ({ ...prev, [id]: "Failed to analyze resume" }));
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>📄 Upload Your Resume</h2>

      <div style={styles.inputWrapper}>
        <input type="file" style={styles.input} onChange={(e) => setFile(e.target.files[0])} />
        <button
          style={{ ...styles.button, ...styles.buttonPrimary }}
          onClick={uploadFile}
          onMouseOver={(e) => handleHover(e, "#3b5998")}
          onMouseOut={(e) => handleLeave(e, "#1e3a8a")}
        >
          Upload
        </button>
      </div>

      <h3 style={{ ...styles.header, fontSize: "1.6rem", marginTop: 40 }}>My Resumes</h3>

      {resumes.map((r) => (
        <div
          key={r.id}
          style={styles.card}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <span style={styles.filename}>{r.filename}</span>

          <div style={{ marginTop: 15 }}>
            <button
              style={{ ...styles.button, ...styles.buttonNeutral }}
              onClick={() => previewResume(r.id)}
            >
              👁 Preview
            </button>
            <button
              style={{ ...styles.button, ...styles.buttonSecondary }}
              onClick={() => downloadSpecific(r.id, r.filename)}
            >
              ⬇ Download
            </button>
            <button
              style={{ ...styles.button, ...styles.buttonDanger }}
              onClick={() => deleteResume(r.id)}
            >
              ❌ Delete
            </button>
            <button
              style={{ ...styles.button, ...styles.buttonPrimary }}
              onClick={() => analyzeResume(r.id)}
            >
              ⭐ Analyze
            </button>
          </div>

          {analysisMap[r.id] && (
            <div style={styles.analysisBox}>
              <strong>Analysis:</strong>
              <div>{analysisMap[r.id]}</div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default ResumeUpload;