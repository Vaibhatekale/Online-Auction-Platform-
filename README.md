# 🏆 Online Auction Platform  

## 📌 Project Overview  
This is a **Full Stack Online Auction Platform**, where users can:  
✅ List items for auction  
✅ Place bids in real-time  
✅ Track auction progress live  
✅ Make secure payments using **Razorpay**  

This platform provides a **seamless** and **secure** online auction experience using modern web technologies.

---

## 🏗️ **Tech Stack**  
| **Category**  | **Technology**  |
|--------------|---------------|
| Frontend | React.js, React Router, Bootstrap |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose ORM) |
| WebSockets | Socket.io |
| Authentication | JWT (JSON Web Token) |
| Payment Gateway | Razorpay |
| Deployment | Docker, GitHub |

---

## 📂 **Project Structure**  
📂 Online-Auction-Platform  
 ├── 📁 **backend** (Node.js, Express, MongoDB)  
 │ ├── 📂 controllers/ (Logic for authentication, auctions, payments)  
 │ ├── 📂 models/ (User, AuctionItem schemas)  
 │ ├── 📂 routes/ (API routes for users, auctions, payments)  
 │ ├── 📄 server.js (Main server file)  
 │ ├── 📄 razorpay.js (Razorpay integration)  
 │ ├── 📄 .env (Environment variables)  
 │  
 ├── 📁 **frontend** (React.js, Bootstrap)  
 │ ├── 📂 src/  
 │ │ ├── 📂 components/ (UI Components)  
 │ │ ├── 📂 pages/ (Home, Auction, Login, Signup)  
 │ │ ├── 📄 App.js (Main application)  
 │ │ ├── 📄 index.js (Entry point)  
 │  
 ├── 📂 **public** (Static assets)  
 ├── 📄 **docker-compose.yml** (For containerized deployment)  
 ├── 📄 **package.json** (Dependencies and scripts)  
 ├── 📄 **README.md** (This file)  

---

## 🚀 **Features**  
✅ **User Authentication** (Signup/Login using JWT)  
✅ **Real-time Bidding** using WebSockets  
✅ **Secure Payment System** (Integrated with Razorpay)  
✅ **Admin Panel** (For managing auctions)  
✅ **Mobile Responsive Design**  

---

## 🛠️ **Installation & Setup**  
### **1️⃣ Clone the Repository**  
```bash
git clone https://github.com/Vaibhatekale/Online-Auction-Platform-.git
cd Online-Auction-Platform

 Backend Setup
 cd backend
npm install

 Setup .env file:
Create a .env file in backend/ and add:
MONGO_URI=mongodb://127.0.0.1:27017/auctionDB
JWT_SECRET=your_secret_key
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret

Start backend:
node server.js

 Frontend Setup
 cd frontend
npm install
npm start

App will run on: http://localhost:3000

 API Endpoints
 Authentication Routes
Method	Endpoint	Description
POST	/api/signup	Register a new user
POST	/api/signin	Login a user and get JWT
POST	/api/logout	Logout user

Payment Routes
Method	Endpoint	Description
POST	/api/create-order	Create a Razorpay order
POST	/api/verify-payment	Verify Razorpay payment

Screenshots
 Home Page
 Bidding System

📜 License
This project is licensed under the MIT License.

👨‍💻 Contributors
Vaibhav Tekale (@Vaibhatekale)

 Feedback & Support
For any issues or feature requests, feel free to open an issue or contact me at:
📧 Email: vaibhavtekale9325@gmail.com
📌 GitHub: https://github.com/Vaibhatekale

What This Updated README Includes
✔ Project Overview
✔ Tech Stack
✔ Project Structure
✔ Features
✔ Installation Guide
✔ API Endpoints
✔ Screenshots Section
✔ License & Contributors Info