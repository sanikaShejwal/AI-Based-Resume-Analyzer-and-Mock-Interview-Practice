import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Auth() {
  const [isRegister, setIsRegister] = useState(false); // toggle login/register
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async () => {
    const url = isRegister
      ? "http://localhost:5000/register"
      : "http://localhost:5000/login";

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.access_token) {
        localStorage.setItem("token", data.access_token);
        navigate("/dashboard");
      } else {
        alert(data.message || "Something went wrong");
      }
    } catch (err) {
      alert("Backend not running ❌");
      console.error(err);
    }
  };

  // ---------------- Styles ----------------
  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      backgroundColor: "#f0f2f5",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    card: {
      backgroundColor: "white",
      padding: 40,
      borderRadius: 12,
      boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
      width: 360,
      textAlign: "center",
    },
    header: { color: "#1e3a8a", marginBottom: 20 },
    input: {
      width: "100%",
      padding: 10,
      marginBottom: 15,
      borderRadius: 6,
      border: "1px solid #ccc",
      fontSize: 14,
    },
    button: {
      width: "100%",
      padding: 12,
      backgroundColor: "#1e3a8a",
      color: "white",
      border: "none",
      borderRadius: 6,
      fontSize: 16,
      fontWeight: 600,
      cursor: "pointer",
      transition: "all 0.3s",
    },
    toggle: {
      marginTop: 15,
      color: "#1e3a8a",
      cursor: "pointer",
      textDecoration: "underline",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.header}>{isRegister ? "Register" : "Login"}</h2>

        <input
          style={styles.input}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          style={styles.button}
          onClick={handleSubmit}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#3b5998")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#1e3a8a")}
        >
          {isRegister ? "Register" : "Login"}
        </button>
<button
  onClick={() => navigate("/login")}
  style={{
    width: "100%",
    padding: "12px",
    marginTop: "10px",
    backgroundColor: "#4285F4",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer"
  }}
>
  Sign in with Google
</button>
        <div style={styles.toggle} onClick={() => setIsRegister(!isRegister)}>
          {isRegister
            ? "Already have an account? Login"
            : "New user? Register"}
        </div>
      </div>
    </div>
  );
}

export default Auth;