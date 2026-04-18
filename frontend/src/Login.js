import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "./firebase";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ✅ NEW: message state
  const [message, setMessage] = useState("");
  const [type, setType] = useState(""); // success / error

  const navigate = useNavigate();

  // ✅ GOOGLE LOGIN
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const res = await fetch("http://localhost:5000/google-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: user.email,
          name: user.displayName
        })
      });

      const data = await res.json();

      localStorage.setItem("token", data.token);
      navigate("/dashboard");

    } catch (err) {
      console.error("Google login error:", err);
      setType("error");
      setMessage("Google login failed ❌");
    }
  };

  // ✅ NORMAL LOGIN
  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (data.access_token) {
        localStorage.setItem("token", data.access_token);

        setType("success");
        setMessage("Login successful ✅");

        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);

      } else {
        setType("error");
        setMessage(data.message || "Login failed ❌");
      }

    } catch (err) {
      setType("error");
      setMessage("Backend not running ❌");
      console.log(err);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Placement Guide 🚀</h1>

      <div style={styles.card}>
        <h2 style={{ textAlign: "center" }}>Login</h2>

        {/* ✅ MESSAGE BOX */}
        {message && (
          <div
            style={{
              padding: "10px",
              borderRadius: "6px",
              backgroundColor: type === "error" ? "#ffdddd" : "#ddffdd",
              color: type === "error" ? "#d8000c" : "#2e7d32",
              textAlign: "center",
              fontSize: "14px"
            }}
          >
            {message}
          </div>
        )}

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <button style={styles.loginBtn} onClick={handleLogin}>
          Login
        </button>

        <div style={{ textAlign: "center", margin: "10px 0" }}>OR</div>

        <button style={styles.googleBtn} onClick={handleGoogleLogin}>
          🔵 Continue with Google
        </button>
      </div>
    </div>
  );
}

// ✅ STYLES (UNCHANGED)
const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(to right, #667eea, #764ba2)",
    fontFamily: "Arial"
  },

  title: {
    color: "white",
    marginBottom: 20
  },

  card: {
    background: "white",
    padding: 30,
    borderRadius: 12,
    width: 320,
    display: "flex",
    flexDirection: "column",
    gap: 15,
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
  },

  input: {
    padding: 10,
    borderRadius: 6,
    border: "1px solid #ccc",
    fontSize: 14
  },

  loginBtn: {
    padding: 12,
    background: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    fontWeight: "bold"
  },

  googleBtn: {
    padding: 12,
    background: "#DB4437",
    color: "white",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    fontWeight: "bold"
  }
};

export default Login;