import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignIn.css"; 

const SignIn = ({ setIsLoggedIn }) => { 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (email && password) {
      localStorage.setItem("token", "userToken"); 
      setIsLoggedIn(true); 
      navigate("/"); 
    } else {
      alert("Please enter valid credentials!");
    }
  };

  return (
    <div className="signin-container">
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default SignIn;
