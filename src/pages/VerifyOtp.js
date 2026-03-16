import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";

function VerifyOtp(){

  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const [otp,setOtp] = useState("");
  const [message,setMessage] = useState("");

  const handleVerify = async(e)=>{
    e.preventDefault();

    try{

      await api.post("/auth/verify-otp",{
        email,
        otp
      });

      navigate("/reset-password",{state:{email}});

    }catch(err){
      setMessage("Invalid or expired OTP");
    }
  };

  return(

    <div style={styles.container}>
      <div style={styles.card}>

        <h2>Verify OTP</h2>

        <form onSubmit={handleVerify}>

          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e)=>setOtp(e.target.value)}
            style={styles.input}
            required
          />

          <button style={styles.btn}>
            Verify OTP
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

export default VerifyOtp;