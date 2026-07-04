import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function ForgotPassword() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {

    e.preventDefault();

    setMessage("");
    setErrorMessage("");

    try {

      const response = await api.post(
        "/auth/forgot-password",
        { email }
      );

      setMessage(
        response.data ||
        "OTP sent to your email"
      );

      setTimeout(() => {

        navigate("/verify-otp", {
          state: { email }
        });

      }, 1000);

    } catch (error) {

      if (error.response) {

        // RATE LIMIT
        if (error.response.status === 429) {

          setErrorMessage(
            error.response.data.message ||
            error.response.data ||
            "Too many OTP requests. Try again later."
          );

        }

        // USER NOT FOUND
        else if (error.response.status === 400) {

          setErrorMessage(
            error.response.data.message ||
            error.response.data ||
            "User not found"
          );

        }

        // OTHER ERRORS
        else {

          setErrorMessage(
            error.response.data.message ||
            "Something went wrong"
          );

        }

      } else {

        setErrorMessage(
          "Server not responding"
        );

      }
    }
  };

  return (

    <div style={styles.container}>

      <div style={styles.card}>

        <h2 style={styles.title}>
          Forgot Password
        </h2>

        <form onSubmit={handleSubmit}>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            style={styles.input}
            required
          />

          <button style={styles.btn}>
            Send OTP
          </button>

        </form>

        {message && (
          <p style={styles.success}>
            {message}
          </p>
        )}

        {errorMessage && (
          <p style={styles.error}>
            {errorMessage}
          </p>
        )}

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
    width: "350px",
    padding: "30px",
    background: "white",
    borderRadius: "10px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
  },

  title: {
    textAlign: "center",
    marginBottom: "20px",
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

  btn: {
    width: "100%",
    padding: "12px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer"
  },

  success: {
    marginTop: "15px",
    color: "green",
    textAlign: "center",
    fontWeight: "bold"
  },

  error: {
    marginTop: "15px",
    color: "red",
    textAlign: "center",
    fontWeight: "bold"
  }

};

export default ForgotPassword;