import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signin } from "../API";  // ✅ Import API function
import "./Login.css";  

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await signin({ username: email, password });  // ✅ Correct API Call
      localStorage.setItem("token", data.token);
      alert("Login Successful!");
      navigate("/dashboard");  
    } catch (error) {
      setError("Invalid Credentials! ❌");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
