import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar"; 
import LandingPage from "./components/LandingPage"; 
import SignIn from "./components/SignIn"; 
import SignUp from "./components/SignUp"; 
import "./App.css"; 

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    // ✅ Token change detect करके state update करेगा
    const checkAuth = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /> 
      <Routes>
        <Route path="/" element={<LandingPage />} /> 
        <Route path="/signin" element={<SignIn setIsLoggedIn={setIsLoggedIn} />} /> 
        <Route path="/signup" element={<SignUp setIsLoggedIn={setIsLoggedIn} />} /> 
      </Routes>
    </Router>
  );
}

export default App;
