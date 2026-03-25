import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

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

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // ===============================
  // STEP 1 → REGISTER (SEND OTP)
  // ===============================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/auth/register", formData);

      // ✅ Works for both 200 & 201
      if (response.status === 200 || response.status === 201) {
        alert(response.data.message || "OTP sent to your email");
        setIsOtpStep(true);
      }

    } catch (error) {
      const status = error.response?.status;

      if (status === 409) {
        alert(error.response.data.message); // Email already exists
      } else {
        // ⚠️ fallback (important)
        alert("OTP might be sent. Please check your email.");
        setIsOtpStep(true);
      }
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // STEP 2 → VERIFY OTP
  // ===============================
  const handleVerifyOtp = async () => {
    if (!otp) {
      alert("Please enter OTP");
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/verify-registration-otp", {
        email: formData.email,
        otp: otp
      });

      alert("Registration successful!");
      navigate("/login");

    } catch (error) {
      alert(error.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // RESEND OTP
  // ===============================
  const handleResendOtp = async () => {
    try {
      await api.post("/auth/register", formData);
      alert("OTP resent successfully!");
    } catch (error) {
      alert("Failed to resend OTP");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        {!isOtpStep ? (
          <>
            <h2 style={styles.title}>Create Your NeoBank Account</h2>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                onChange={handleChange}
                required
                style={styles.input}
              />

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                onChange={handleChange}
                required
                style={styles.input}
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
                required
                style={styles.input}
              />

              <button
                type="submit"
                style={styles.primaryBtn}
                disabled={loading}
              >
                {loading ? "Sending OTP..." : "Create Account"}
              </button>
            </form>

            <p style={styles.switchText}>
              Already have an account?{" "}
              <span style={styles.link} onClick={() => navigate("/login")}>
                Login
              </span>
            </p>
          </>
        ) : (
          <>
            <h2 style={styles.title}>Verify OTP</h2>

            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              style={styles.input}
            />

            <button
              onClick={handleVerifyOtp}
              style={styles.primaryBtn}
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <p style={styles.switchText}>
              Didn’t receive OTP?{" "}
              <span style={styles.link} onClick={handleResendOtp}>
                Resend
              </span>
            </p>
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
  }
};

export default Register;