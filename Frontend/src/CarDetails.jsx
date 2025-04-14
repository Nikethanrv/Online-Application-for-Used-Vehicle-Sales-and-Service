import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const CarDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const car = location.state?.car;

  if (!car) {
    return (
      <p style={{ textAlign: "center", fontSize: "20px", marginTop: "50px" }}>
        No car details available.
      </p>
    );
  }

  const handleChatClick = () => {
    navigate('/chat'); // Make sure /chat route is set up
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#eef2f3", display: "flex", flexDirection: "column", alignItems: "center", padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ fontSize: "28px", color: "#1e3a8a", marginBottom: "20px" }}>{car.make} {car.model}</h1>
      
      <img src={car.image} alt={car.make} style={{ width: "80%", maxWidth: "600px", borderRadius: "10px", marginBottom: "20px" }} />

      <div style={{ background: "white", padding: "20px", borderRadius: "10px", width: "90%", maxWidth: "700px", boxShadow: "0px 4px 8px rgba(0,0,0,0.2)" }}>
        <h2 style={{ color: "#1e3a8a", textAlign: "center" }}>Car Specifications</h2>
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
          <tbody>
            {Object.entries(car).map(([key, value]) => (
              key !== "image" && <tr key={key}><td style={tdStyle}>{key.replace(/([A-Z])/g, ' $1')}</td><td style={tdStyle}>{value}</td></tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
        <button onClick={() => navigate(-1)} style={buttonStyle("#dc2626")}>Go Back</button>
        <button onClick={handleChatClick} style={buttonStyle("#2563eb")}>Chat with Seller</button>
      </div>
    </div>
  );
};

const tdStyle = { padding: "10px", borderBottom: "1px solid #ddd", fontSize: "18px", color: "#555" };
const buttonStyle = (bgColor) => ({ padding: "12px 18px", borderRadius: "8px", backgroundColor: bgColor, color: "white", border: "none", cursor: "pointer" });

export default CarDetails;
