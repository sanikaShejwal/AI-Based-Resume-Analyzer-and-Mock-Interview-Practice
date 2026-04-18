import { useEffect, useState } from "react";

function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

const fetchProfile = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      console.log("No token ❌");
      window.location.href = "/";
      return;
    }

    const res = await fetch("http://localhost:5000/profile", {
      method: "GET",
      headers: {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
      }
    });

    // ✅ HANDLE ERROR RESPONSE
    if (!res.ok) {
      console.log("Unauthorized or error ❌");
      localStorage.removeItem("token");
      window.location.href = "/";
      return;
    }

    const data = await res.json();
    setUser(data);

  } catch (err) {
    console.log("Fetch error:", err);
  }
};
  // ---------------- Styles ----------------
  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      minHeight: "100vh",
      backgroundColor: "#f7f9fc",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      paddingTop: 50,
    },
    header: {
      color: "#1e3a8a",
      marginBottom: 50,
      fontSize: "2.5rem",
      fontWeight: "bold",
      textAlign: "center",
    },
    card: {
      backgroundColor: "white",
      padding: 35,
      borderRadius: 15,
      boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
      width: 380,
      textAlign: "center",
      marginBottom: 40,
      transition: "transform 0.2s, box-shadow 0.2s",
    },
    cardHover: {
      transform: "scale(1.03)",
      boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
    },
    userInfo: {
      fontSize: 16,
      color: "#333",
      lineHeight: 1.6,
    },
    buttonContainer: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: 15,
    },
    button: {
      backgroundColor: "#1e3a8a",
      color: "white",
      border: "none",
      padding: "12px 25px",
      borderRadius: 8,
      fontWeight: 600,
      cursor: "pointer",
      transition: "all 0.3s",
      fontSize: 15,
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    },
    buttonHover: {
      backgroundColor: "#3b5998",
      boxShadow: "0 6px 15px rgba(0,0,0,0.15)",
    },
  };

  // Button hover effect
  const handleHover = (e) => {
    Object.assign(e.target.style, styles.buttonHover);
  };
  const handleLeave = (e) => {
    Object.assign(e.target.style, styles.button);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Dashboard 🎉</h2>

      {/* Profile Card */}
      <div
        style={styles.card}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        {!user && <p style={styles.userInfo}>Loading profile...</p>}
        {user && (
          <div style={styles.userInfo}>
            <p>
              <strong>ID:</strong> {user.id}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div style={styles.buttonContainer}>
        <button
          style={styles.button}
          onMouseOver={handleHover}
          onMouseOut={handleLeave}
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/";
          }}
        >
          Logout
        </button>

        <button
          style={styles.button}
          onMouseOver={handleHover}
          onMouseOut={handleLeave}
          onClick={() => (window.location.href = "/upload")}
        >
          Upload Resume
        </button>

        <button
          style={styles.button}
          onMouseOver={handleHover}
          onMouseOut={handleLeave}
          onClick={() => (window.location.href = "/interview")}
        >
          🎤 Start Mock Interview
        </button>
      </div>
    </div>
  );
}

export default Dashboard;