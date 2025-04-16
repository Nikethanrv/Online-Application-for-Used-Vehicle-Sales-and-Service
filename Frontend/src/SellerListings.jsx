import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { FaCar, FaTachometerAlt, FaGasPump, FaCalendarAlt, FaExchangeAlt, FaArrowLeft } from "react-icons/fa";
import "./styles/SellerListings.css";

const SellerListings = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [listings, setListings] = useState([]);
  const [interestedBuyers, setInterestedBuyers] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "" });


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
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
      setIsLoggedIn(false);
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
      const response = await axios.get(
        `http://localhost:3000/api/messages/getMessages?car_id=${carId}&seller_id=${userId}`
      );
      setInterestedBuyers(response.data);
    } catch (error) {
      console.error("Error fetching interested buyers:", error);
    }
  };

  const handleAccept = async (docId, carId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/messages/acceptBuyer?doc_id=${docId}&car_id=${carId}`
      );
      setToast({ message: "Buyer Accepted Successfully", type: "success" });
      setTimeout(() => setToast({ message: "", type: "" }), 3000);
      handleInterestedBuyers(carId);
      
    } catch (error) {
      console.error("Error accepting buyer:", error);
      setToast({ message: "Error accepting buyer", type: "error" });
      setTimeout(() => setToast({ message: "", type: "" }), 3000);
    }
  };

  const handleReject = async (docId, carId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/messages/rejectBuyer?doc_id=${docId}&car_id=${carId}`
      );
      setToast({ message: "Buyer Rejected Successfully", type: "error" });
      setTimeout(() => setToast({ message: "", type: "" }), 3000);
      handleInterestedBuyers(carId);
    } catch (error) {
      console.error("Error rejecting buyer:", error);
      setToast({ message: "Error rejecting buyer", type: "error" });
      setTimeout(() => setToast({ message: "", type: "" }), 3000);
    }
  };
  return (
    <div className="seller-listings-container">
      <h1 className="listings-header">YOUR LISTINGS</h1>

      <div className="listings-grid">
        {listings.length > 0 ? (
          listings.map((car) => (
            <div className="listing-card" key={car._id}>
              <img
                src={car.image}
                alt={`${car.make} ${car.model}`}
                className="listing-image"
              />
              <div className="listing-details">
                <h2>{car.make} {car.model}</h2>
                <p><FaCalendarAlt /> {car.year}</p>
                <p><FaTachometerAlt /> {car.mileage} kms</p>
                <p><FaExchangeAlt /> {car.transmission}</p>
                <p><FaGasPump /> {car.fuelType}</p>
                <h3>₹{car.price.toLocaleString()}</h3>
              </div>
              <div className="listing-actions">
                <button
                  className="listing-button"
                  onClick={() => handleInterestedBuyers(car._id)}
                >
                  Interested Buyers
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-listings">
            <p>No cars listed for sale</p>
            <Link to="/sell" className="sell-button" style={{ display: 'inline-block', marginTop: '20px' }}>
              List Your First Car
            </Link>
          </div>
        )}
      </div>

      {toast.message && (
        <div className={`custom-toast ${toast.type}`}>
          {toast.message}
        </div>
      )}


      {showPopup && (
        <>
          <div className="popup-overlay" onClick={() => setShowPopup(false)}></div>
          <div className="buyer-popup">
            <h2>Interested Buyers</h2>
            <div className="buyers">
              {interestedBuyers.length > 0 ? (
                interestedBuyers.map((buyer) => (
                  <div className="buyer-item" key={buyer._id}>
                    <p><strong>Buyer Name:</strong> {buyer.buyer_name}</p>
                    <p><strong>Email:</strong> {buyer.buyer_email}</p>
                    <p><strong>Phone:</strong> {buyer.buyer_phone}</p>
                    <p><strong>Location:</strong> {buyer.buyer_location}</p>
                    <p><strong>Bargain Price:</strong> ₹{buyer.price_bargain_range}</p>
                    <p><strong>Query:</strong> {buyer.query}</p>
                    <div className="buyer-actions">
                      <button onClick={() => handleAccept(buyer._id, buyer.car_id)}>
                        ACCEPT
                      </button>
                      <button onClick={() => handleReject(buyer._id, buyer.car_id)}>
                        REJECT
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p>No interested buyers</p>
              )}
            </div>
            <button
              className="popup-close"
              onClick={() => setShowPopup(false)}
            >
              Close
            </button>
          </div>
        </>
      )}

      {listings.length > 0 && (
        <div className="page-actions">
          <Link to="/">
            <button className="dashboard-button"><FaArrowLeft/>&nbsp;&nbsp;Back to Dashboard</button>
          </Link>
          <Link to="/sell">
            <button className="sell-button">Sell Another Car</button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default SellerListings;