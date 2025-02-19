import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage"; // ✅ Landing Page
import SignIn from "./components/SignIn"; // ✅ Sign-In Page
import "./App.css"; // ✅ Existing CSS

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />  {/* Default Page */}
        <Route path="/signin" element={<SignIn />} /> {/* Sign-In Page */}
      </Routes>
    </Router>
  );
}

export default App;
