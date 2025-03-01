import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuctions } from "./API";  // ✅ API Call Import (Updated Path)
import "./Dashboard.css";

const Dashboard = () => {
  const [auctions, setAuctions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const { data } = await getAuctions();  // ✅ Fetch Auction Data
        setAuctions(data);
      } catch (error) {
        console.error("Error fetching auctions:", error);
      }
    };
    fetchAuctions();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");  // ✅ Token Delete
    alert("Logout Successful!");
    navigate("/login");  // ✅ Redirect to Login Page
  };

  return (
    <div className="dashboard-container">
      <h2>Welcome to Auction Dashboard</h2>
      <button className="logout-btn" onClick={handleLogout}>Logout</button>

      <h3>Available Auctions</h3>
      <ul>
        {auctions.length > 0 ? (
          auctions.map((item) => (
            <li key={item._id}>
              <h4>{item.itemName}</h4>
              <p>{item.description}</p>
              <p>Current Bid: ${item.currentBid}</p>
            </li>
          ))
        ) : (
          <p>No auctions available.</p>
        )}
      </ul>
    </div>
  );
};

export default Dashboard;
