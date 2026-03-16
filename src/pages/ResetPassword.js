import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";

function ResetPassword(){

  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const [password,setPassword] = useState("");
  const [message,setMessage] = useState("");

  const handleSubmit = async(e)=>{
    e.preventDefault();

    try{

      await api.post("/auth/reset-password",{
        email,
        newPassword:password
      });

      setMessage("Password updated successfully");

      setTimeout(()=>{
        navigate("/login");
      },2000);

    }catch(err){
      setMessage("Password reset failed");
    }
  };

  return(

    <div style={styles.container}>
      <div style={styles.card}>

        <h2>Reset Password</h2>

        <form onSubmit={handleSubmit}>

          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            style={styles.input}
            required
          />

          <button style={styles.btn}>
            Reset Password
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

export default ResetPassword;