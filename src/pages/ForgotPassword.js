import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function ForgotPassword() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      await api.post("/auth/forgot-password", { email });

      setMessage("OTP sent to your email");

      navigate("/verify-otp", { state: { email } });

    } catch (error) {
      setMessage("User not found");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        <h2>Forgot Password</h2>

        <form onSubmit={handleSubmit}>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />

          <button style={styles.btn}>
            Send OTP
          </button>

        </form>

        <p>{message}</p>

      </div>
    </div>
  );
}

const styles = {
  container:{
    minHeight:"90vh",
    display:"flex",
    justifyContent:"center",
    alignItems:"center",
    background:"#f4f7fb"
  },
  card:{
    width:"350px",
    padding:"30px",
    background:"white",
    borderRadius:"10px"
  },
  input:{
    width:"100%",
    padding:"12px",
    marginBottom:"15px"
  },
  btn:{
    width:"100%",
    padding:"12px",
    background:"#2563eb",
    color:"white",
    border:"none",
    borderRadius:"8px"
  }
};

export default ForgotPassword;