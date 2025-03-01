import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaUserPlus, FaSignInAlt, FaHome, FaGavel } from "react-icons/fa";
import "./Navbar.css";

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); 
    setIsLoggedIn(false);
    navigate("/signin");
  };

  return (
    <nav className="navbar">
      <h2 className="logo"><FaGavel /> Online Auction</h2>
      <div className="nav-links">
        <Link to="/"><FaHome /> Home</Link>
        {!isLoggedIn ? (
          <>
            <Link to="/signin"><FaSignInAlt /> Login</Link>
            <Link to="/signup"><FaUserPlus /> Sign Up</Link>
          </>
        ) : (
          <button onClick={handleLogout} className="logout-btn">
            <FaSignOutAlt /> Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
