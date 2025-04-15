import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const CarDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const car = location.state?.car;
  // console.log(car);
  const [interestedDetails, setInterestedDetails] = useState({
    seller_id: car?.seller_id || "",
    car_id: car?._id || "",
    buyer_id: "",
    buyer_name: "",
    buyer_email: "",
    buyer_phone: "",
    buyer_location: "",
    price_bargain_range: 0,
    query: "",
    status: "pending"
  });
  const [isLoggedIn, setisLoggedIn] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const data = {
    model: car.model,
    make: car.make,
    year: car.year,
  };

  if (!car) {
    return (
      <p style={{ textAlign: "center", fontSize: "20px", marginTop: "50px" }}>
        No car details available.
      </p>
    );
  }

  const handleChatClick = () => {
    //localStorage.setItem('carDetails', JSON.stringify(data))
    //navigate('/chat')
    setShowPopup(true);
    const token = localStorage.getItem("token");
    if (token) {
      setisLoggedIn(true);

      try {
        const tokenUserId = jwtDecode(token);
        const userId = tokenUserId.userId;
        // console.log(userId)
        const fetchUserDetails = async () => {
          try {
            const response = await axios.get(
              `http://localhost:3000/api/user/details/${userId}`,
              {
                headers: {
                  Authorization: token,
                },
              }
            );
            // Using "_id" for filtering cars for the Seller Listings
            setInterestedDetails((prevDetails) => ({
              ...prevDetails,
              buyer_name: response.data.full_name,
              buyer_phone: response.data.phone_number,
              buyer_email: response.data.email,
              buyer_location: response.data.location,
              buyer_id: userId
            }));
          } catch (error) {
            console.error("Error fetching user details", error);
          }
        };
        fetchUserDetails();
      } catch (error) {
        console.log(error);
      }
    } else {
      setisLoggedIn(false);
      navigate("/dashboard");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInterestedDetails({ ...interestedDetails, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(interestedDetails);
    try {
      const response = await axios.post(
        "http://localhost:3000/api/messages/send",
        interestedDetails
      );
      console.log("Interest submitted successfully:", response.data);
      alert("Interest submitted successfully");
    } catch (error) {
      console.error("Error submitting interest:", error);
      alert("Error submitting interest. Please try again.");
    }
    setShowPopup(false);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#eef2f3",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ fontSize: "28px", color: "#1e3a8a", marginBottom: "20px" }}>
        {car.make} {car.model}
      </h1>

      <img
        src={car.image}
        alt={car.make}
        style={{
          width: "80%",
          maxWidth: "600px",
          borderRadius: "10px",
          marginBottom: "20px",
        }}
      />

      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "10px",
          width: "90%",
          maxWidth: "700px",
          boxShadow: "0px 4px 8px rgba(0,0,0,0.2)",
        }}
      >
        <h2 style={{ color: "#1e3a8a", textAlign: "center" }}>
          Car Specifications
        </h2>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "10px",
          }}
        >
          <tbody>
            {Object.entries(car).map(
              ([key, value]) =>
                key !== "image" && (
                  <tr key={key}>
                    <td style={tdStyle}>{key.replace(/([A-Z])/g, " $1")}</td>
                    <td style={tdStyle}>{value}</td>
                  </tr>
                )
            )}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
        <button onClick={() => navigate(-1)} style={buttonStyle("#dc2626")}>
          Go Back
        </button>
        <button onClick={handleChatClick} style={buttonStyle("#2563eb")}>
          I'm Interested
        </button>
      </div>

      {showPopup && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "white",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
          }}
        >
          <h2>Sale</h2>
          <form onSubmit={handleSubmit}>
            Price Bargain Range:
            <input
              type="range"
              name="price_bargain_range"
              min={(car.price)/2}
              max={(car.price)}
              value={interestedDetails.price_bargain_range}
              onChange={handleChange}
              style={{ width: "100%", margin: "10px 0" }}
            />
            <p>Selected Price: ₹{interestedDetails.price_bargain_range}</p><br />
            <label htmlFor="query">Query:</label><br />
            <textarea
              name="query"
              value={interestedDetails.query}
              onChange={handleChange}
              rows="4"
              cols="50"
              placeholder="Enter your query here..."
              style={{ width: "100%", padding: "10px", borderRadius: "5px" }}
            />
            <button type="submit" style={buttonStyle("#4ade80")}>
              Submit
            </button>
            <button
              type="button"
              onClick={() => setShowPopup(false)}
              style={buttonStyle("#dc2626")}
            >
              Close
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

const tdStyle = {
  padding: "10px",
  borderBottom: "1px solid #ddd",
  fontSize: "18px",
  color: "#555",
};
const buttonStyle = (bgColor) => ({
  padding: "12px 18px",
  borderRadius: "8px",
  backgroundColor: bgColor,
  color: "white",
  border: "none",
  cursor: "pointer",
});

export default CarDetails;
