import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./Homepage";
import CarDetails from "./CarDetails"; // Import the details page
import Signup from "./signUp";
import Login from "./login";
import Dashboard from "./DashBoard";
import SellPage from "./SellPage"; // Upcoming sell component
import Profile from "./profile";
// import InputDisplay from "./Prac";
function App() {
  return (
    <Router>
       <Routes>
         <Route path="/" element={<Dashboard />} />
         <Route path="/home" element={<Homepage />} />
         <Route path="/signup" element={<Signup />}></Route>
         <Route path="/login" element={<Login />}></Route>
         <Route path="/car-details" element={<CarDetails />} />
         <Route path="/sell" element={<SellPage />} />
         <Route path="/profile" element={<Profile />}></Route>
       </Routes>
     </Router>
  );
}

export default App;
