import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import logo from "../assets/logo.png";

function Register() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: ""
  });

  const [otp, setOtp] = useState("");
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const getPasswordStrength = () => {

    const pwd = formData.password;

    if (pwd.length < 6) return "Weak";

    if (
      pwd.match(/[A-Z]/) &&
      pwd.match(/[0-9]/)
    ) {
      return "Strong";
    }

    return "Medium";
  };

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);

    setErrorMessage("");
    setMessage("");

    try {

      const response = await api.post(
        "/auth/register",
        formData
      );

      setMessage(
        response.data.message ||
        "OTP sent successfully!"
      );

      setIsOtpStep(true);

    } catch (err) {

      if (err.response) {

        // RATE LIMIT
        if (err.response.status === 429) {

          setErrorMessage(
            err.response.data.message ||
            "Too many registration attempts. Try again later."
          );

        }

        // EMAIL ALREADY EXISTS
        else if (err.response.status === 409) {

          setErrorMessage(
            err.response.data.message ||
            "Email already exists"
          );

        }

        // OTHER BACKEND ERRORS
        else {

          setErrorMessage(
            err.response.data.message ||
            "Registration failed"
          );

        }

      } else {

        setErrorMessage(
          "Server not responding"
        );

      }

    } finally {

      setLoading(false);

    }
  };

  const handleVerifyOtp = async () => {

    if (!otp) {
      return setErrorMessage("Enter OTP");
    }

    setLoading(true);

    setErrorMessage("");
    setMessage("");

    try {

      const response = await api.post(
        "/auth/verify-registration-otp",
        {
          email: formData.email,
          otp
        }
      );

      setMessage(
        response.data.message ||
        "Registration successful!"
      );

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {

      if (err.response) {

        setErrorMessage(
          err.response.data.message ||
          err.response.data ||
          "Invalid OTP"
        );

      } else {

        setErrorMessage(
          "Server not responding"
        );

      }

    } finally {

      setLoading(false);

    }
  };

  return (

    <div style={styles.container}>

      {/* Animated Background */}
      <div style={styles.blob1}></div>
      <div style={styles.blob2}></div>
      <div style={styles.blob3}></div>

      <div style={styles.card}>

        <img
          src={logo}
          alt="logo"
          style={styles.logo}
        />

        {!isOtpStep ? (
          <>

            <h2 style={styles.title}>
              Create Account
            </h2>

            <form onSubmit={handleSubmit}>

              <input
                name="fullName"
                placeholder="Full Name"
                onChange={handleChange}
                required
                style={styles.input}
              />

              <input
                name="email"
                type="email"
                placeholder="Email"
                onChange={handleChange}
                required
                style={styles.input}
              />

              <div style={{ position: "relative" }}>

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  placeholder="Password"
                  onChange={handleChange}
                  required
                  style={styles.input}
                />

                <span
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  style={styles.eye}
                >
                  {showPassword ? "🙈" : "👁"}
                </span>

              </div>

              <p style={styles.strength}>
                Strength: {getPasswordStrength()}
              </p>

              <button
                style={styles.btn}
                disabled={loading}
              >
                {loading
                  ? "Processing..."
                  : "Create Account"}
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

            <p style={styles.switch}>

              Already have an account?{" "}

              <span
                onClick={() => navigate("/login")}
                style={styles.link}
              >
                Login
              </span>

            </p>

          </>
        ) : (
          <>

            <h2 style={styles.title}>
              Verify OTP
            </h2>

            <input
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value)
              }
              style={styles.input}
            />

            <button
              onClick={handleVerifyOtp}
              style={styles.btn}
            >
              {loading
                ? "Verifying..."
                : "Verify OTP"}
            </button>

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

          </>
        )}

      </div>

    </div>
  );
}

// ===============================
// STYLES
// ===============================
const styles = {

  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
    background:
      "linear-gradient(-45deg, #1e3a8a, #2563eb, #9333ea, #06b6d4)",
    backgroundSize: "400% 400%",
    animation: "gradientMove 10s ease infinite"
  },

  card: {
    width: "90%",
    maxWidth: "520px",
    padding: "45px",
    borderRadius: "20px",
    background: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(12px)",
    boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
    color: "#fff",
    zIndex: 1
  },

  logo: {
    width: "80px",
    margin: "0 auto 10px",
    display: "block"
  },

  title: {
    textAlign: "center",
    marginBottom: "20px"
  },

  input: {
    width: "100%",
    padding: "14px",
    marginBottom: "15px",
    borderRadius: "10px",
    border: "none",
    background: "rgba(255,255,255,0.2)",
    color: "#fff"
  },

  btn: {
    width: "100%",
    padding: "14px",
    borderRadius: "10px",
    border: "none",
    background: "#fff",
    color: "#1e3a8a",
    fontWeight: "bold",
    cursor: "pointer"
  },

  switch: {
    textAlign: "center",
    marginTop: "15px"
  },

  link: {
    cursor: "pointer",
    fontWeight: "bold"
  },

  eye: {
    position: "absolute",
    right: "10px",
    top: "12px",
    cursor: "pointer"
  },

  strength: {
    fontSize: "13px",
    marginBottom: "10px"
  },

  success: {
    marginTop: "15px",
    color: "#4ade80",
    textAlign: "center",
    fontWeight: "bold"
  },

  error: {
    marginTop: "15px",
    color: "#ff4d4f",
    textAlign: "center",
    fontWeight: "bold"
  },

  blob1: {
    position: "absolute",
    width: "300px",
    height: "300px",
    background: "#3b82f6",
    borderRadius: "50%",
    top: "-100px",
    left: "-100px",
    filter: "blur(120px)",
    opacity: 0.7,
    animation: "float1 8s ease-in-out infinite"
  },

  blob2: {
    position: "absolute",
    width: "300px",
    height: "300px",
    background: "#9333ea",
    borderRadius: "50%",
    bottom: "-100px",
    right: "-100px",
    filter: "blur(120px)",
    opacity: 0.7,
    animation: "float2 10s ease-in-out infinite"
  },

  blob3: {
    position: "absolute",
    width: "200px",
    height: "200px",
    background: "#06b6d4",
    borderRadius: "50%",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    filter: "blur(100px)",
    opacity: 0.5,
    animation: "float3 12s ease-in-out infinite"
  }

};

export default Register;