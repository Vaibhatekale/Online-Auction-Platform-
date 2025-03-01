import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5001", // ✅ Backend Server URL
});

// ✅ Signup API Call
export const signup = (userData) => API.post("/signup", userData);

// ✅ Signin API Call
export const signin = (userData) => API.post("/signin", userData);

// ✅ Logout Function
export const logout = () => {
  localStorage.removeItem("token"); // ✅ Remove Token
};

// ✅ Get Auctions API Call
export const getAuctions = () => API.get("/auctions");

export default API;
