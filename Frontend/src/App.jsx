import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./Homepage";
import CarDetails from "./CarDetails"; // Import the details page
import Signup from "./signUp";
import Login from "./login";
// import InputDisplay from "./Prac";
function App() {
  return (
    <Router>
       <Routes>
         <Route path="/" element={<Homepage />} />
         <Route path="/signup" element={<Signup />}></Route>
         <Route path="/login" element={<Login />}></Route>
         <Route path="/car-details" element={<CarDetails />} />
       </Routes>
     </Router>
  );
}

export default App;
