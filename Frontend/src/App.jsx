import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./Homepage";
import CarDetails from "./CarDetails"; // Import the details page
// import InputDisplay from "./Prac";
function App() {
  return (
    <Router>
       <Routes>
         <Route path="/" element={<Homepage />} />
         <Route path="/car-details" element={<CarDetails />} />
       </Routes>
     </Router>
  );
}

export default App;
