import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./Homepage";
import CarDetails from "./CarDetails";
import Signup from "./signUp";
import Login from "./login";
import Dashboard from "./DashBoard";
import SellPage from "./SellPage"; 
import Profile from "./profile"
import SellerListings from './SellerListings'
import Contact from "./contact";

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
         <Route path="/listings" element={<SellerListings />}></Route>
         <Route path="/contact" element={<Contact />}></Route>
       </Routes>
     </Router>
  );
}

export default App;
