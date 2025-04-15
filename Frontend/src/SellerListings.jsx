import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./Homepage.css";

const SellerListings = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setisLoggedIn] = useState(false);
  const [listings, setListings] = useState([]);
  const [interestedBuyers, setInterestedBuyers] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setisLoggedIn(true);
      const tokenUserId = jwtDecode(token);
      const userId = tokenUserId.userId;
      const fetchSellerListings = async () => {
        try {
          const response = await axios.get(
            `http://localhost:3000/api/car/listings?userId=${userId}`
          );
          setListings(response.data);
        } catch (error) {
          console.error(error);
        }
      };

      fetchSellerListings();
    } else {
      setisLoggedIn(false);
      navigate("/");
    }
  }, [navigate]);

  const handleInterestedBuyers = async (carId) => {
    setShowPopup(true);
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      navigate("/");
      return;
    }

    try {
      
      const tokenUserId = jwtDecode(token);
      const userId = tokenUserId.userId;
      console.log(carId, userId)
      const response = await axios.get(
        `http://localhost:3000/api/messages/getMessages?car_id=${carId}&seller_id=${userId}`
      );
      console.log(response.data)
      setInterestedBuyers(response.data)
    } catch (error) {
      console.error("Error fetching interested buyers:", error);
    }
  };

  const handleAccept = async (docId, carId) => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/messages/acceptBuyer?doc_id=${docId}&car_id=${carId}`
        )
        console.log(response.data)
        alert("Buyer Accepted Successfully")
      } catch (error) {
        console.error("Error accepting buyer:", error);
      } 
  }

  const handleReject = async (docId, carId) => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/messages/rejectBuyer?doc_id=${docId}&car_id=${carId}`
        )
        console.log(response.data)
        alert("Buyer rejected Successfully")
      } catch (error) {
        console.error("Error rejecting buyer:", error);
      } 
  }

  return (
    <div>
      <h1>YOUR LISTINGS</h1>
      <div className="listings">
        {listings.length > 0 ? (
          listings.map((car) => (
            <div key={car._id}>
              <img src={car.image} alt={car.make} />
              <div>
                <h2>
                  {car.make} {car.model}
                </h2>
                <p>
                  {car.year} • {car.mileage} kms • {car.transmission}
                </p>
                <h3>₹{car.price}</h3>
              </div>
              <button onClick={() => handleInterestedBuyers(car._id)}>
                INTERESTED BUYERS
              </button>
            </div>
          ))
        ) : (
          <p>No cars listed for sale</p>
        )}
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
          <h2>Interested Buyers</h2>
          <div className="buyers">
            {interestedBuyers.length > 0 ? (
              interestedBuyers.map((buyer) => (
                <div key={buyer._id}>
                  Buyer Name: {buyer.buyer_name} <br />
                  Buyer Email: {buyer.buyer_email} <br />
                  Buyer Phone: {buyer.buyer_phone} <br />
                  Buyer Location: {buyer.buyer_location} <br />
                  Bargain Price: {buyer.price_bargain_range} <br />
                  Query: {buyer.query} <br />

                  <button onClick={() => handleAccept(buyer._id, buyer.car_id)}>ACCEPT</button>
                  <button onClick={() => handleReject(buyer._id, buyer.car_id)}>REJECT</button>
                </div>
              ))
            ) : (
              <p>No interested buyers</p>
            )}
          </div>
          <button type="button" onClick={() => setShowPopup(false)}>
            Close
          </button>
        </div>
      )}

      <Link to="/">
        <button>Back to DashBoard</button>
      </Link>
      <Link to="/sell">
        <button>List car for sale</button>
      </Link>
    </div>
  );
};

export default SellerListings;