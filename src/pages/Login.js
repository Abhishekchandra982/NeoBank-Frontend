import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { setToken } from "../utils/token";

function Login() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const decodeToken = (token) => {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMessage("");

    try {

      const response = await api.post("/auth/login", formData);

      const token = response.data.token;

      setToken(token);

      const decoded = decodeToken(token);
      const role = decoded.role;

      if (role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/user");
      }

    } catch (error) {
      setErrorMessage("Invalid email or password");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        <h2 style={styles.title}>Welcome Back to NeoBank</h2>

        <form onSubmit={handleSubmit}>

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <p
            style={styles.forgot}
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password?
          </p>

          <button type="submit" style={styles.primaryBtn}>
            Login
          </button>

        </form>

        {errorMessage && (
          <p style={styles.error}>{errorMessage}</p>
        )}

        <p style={styles.switchText}>
          Don’t have an account?{" "}
          <span
            style={styles.link}
            onClick={() => navigate("/")}
          >
            Register
          </span>
        </p>

      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "90vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f4f7fb"
  },

  card: {
    width: "380px",
    background: "white",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
  },

  title: {
    textAlign: "center",
    marginBottom: "25px",
    color: "#1e3a8a"
  },

  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "14px"
  },

  forgot: {
    textAlign: "right",
    fontSize: "13px",
    color: "#2563eb",
    cursor: "pointer",
    marginBottom: "15px"
  },

  primaryBtn: {
    width: "100%",
    padding: "12px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer"
  },

  switchText: {
    marginTop: "20px",
    textAlign: "center",
    fontSize: "14px"
  },

  link: {
    color: "#2563eb",
    cursor: "pointer",
    fontWeight: "bold"
  },

  error: {
    marginTop: "15px",
    color: "red",
    textAlign: "center"
  }
};

export default Login;