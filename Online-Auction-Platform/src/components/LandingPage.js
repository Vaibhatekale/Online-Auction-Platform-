import React from "react";
import "./LandingPage.css"; // ✅ CSS file import

const LandingPage = () => {
  return (
    <div className="landing-container">
      <h1>Welcome to Online Auction Platform</h1>
      <img
        src="https://via.placeholder.com/600x300"
        alt="Auction Banner"
        className="banner-image"
      />
      <p>Bid on the best items and win exciting deals!</p>
    </div>
  );
};

export default LandingPage;

