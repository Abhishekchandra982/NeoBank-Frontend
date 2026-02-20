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

    try {
      const response = await api.post("/auth/login", formData);

      const token = response.data.token;

      // Store token
      setToken(token);

      // Decode token to get role
      const decoded = decodeToken(token);
      const role = decoded.role;

      alert("Login successful!");

      if (role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/user");
      }

    } catch (error) {
      alert("Invalid credentials");
      console.error(error.response?.data || error.message);
    }
  };

  return (
    <div>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          onChange={handleChange}
          required
        />
        <br /><br />

        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          onChange={handleChange}
          required
        />
        <br /><br />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;