import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import "./styles/CarDetails.css";

const CarDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const car = location.state?.car;

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
    status: "pending",
  });

  const [isLoggedIn, setisLoggedIn] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setisLoggedIn(true);
      try {
        const tokenUserId = jwtDecode(token);
        const userId = tokenUserId.userId;

        const fetchUserDetails = async () => {
          try {
            const response = await axios.get(
              `http://localhost:3000/api/user/details/${userId}`,
              { headers: { Authorization: token } }
            );
            setInterestedDetails((prev) => ({
              ...prev,
              buyer_name: response.data.full_name,
              buyer_phone: response.data.phone_number,
              buyer_email: response.data.email,
              buyer_location: response.data.location,
              buyer_id: userId,
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
    }
  }, []);

  if (!car) {
    return <p className="no-car-message">No car details available.</p>;
  }

  const handleChatClick = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setisLoggedIn(false);
      navigate("/dashboard");
    } else {
      setShowPopup(true);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInterestedDetails({ ...interestedDetails, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/api/messages/send",
        interestedDetails
      );
      setToastMessage("Interest submitted successfully");
      setToastType("success");
      setTimeout(() => {
        setToastMessage("");
        setToastType("");
      }, 3000); 
    } catch (error) {
      console.error("Error submitting interest:", error);
      setToastMessage("Error submitting interest. Please try again.");
      setToastType("error");
      setTimeout(() => {
        setToastMessage("");
        setToastType("");
      }, 3000);
    }
    setShowPopup(false);
  };

  return (
    <div className="car-details-container">
      {/* Toast Message */}
      {toastMessage && (
        <div className={`toast-message ${toastType}`}>
          {toastMessage}
        </div>
      )}

      <div className="car-content">
        <div className="car-img-container">
          <img src={car.image} alt={car.make} className="car-img" />
        </div>

        <div className="car-specs-container">
          <h1 className="car-title">
            {car.make} <span className="car-model">{car.model}</span>
          </h1>

          <div className="specs-card">
            <h2 className="specs-title">Car Specifications</h2>
            <div className="specs-grid">
              {Object.entries(car).map(
                ([key, value]) =>
                  key !== "image" && (
                    <React.Fragment key={key}>
                      <div className="spec-label">
                        {key.replace(/([A-Z])/g, " $1")}
                      </div>
                      <div className="spec-value">{value}</div>
                    </React.Fragment>
                  )
              )}
            </div>
          </div>

          <div className="button-group">
            <button className="bck-button" onClick={() => navigate(-1)}>
              Go Back
            </button>
            <button className="interested-button" onClick={handleChatClick}>
              I'm Interested
            </button>
          </div>
        </div>
      </div>

      {showPopup && (
        <div className="specs-card" style={{ position: "fixed", top: "10%", left: "50%", transform: "translateX(-50%)", zIndex: 1000 }}>
          <h2 className="specs-title">Sale</h2>
          <form onSubmit={handleSubmit}>
            <label htmlFor="range">Price Bargain Range</label>
            <input
              type="range"
              name="price_bargain_range"
              min={car.price / 2}
              max={car.price}
              step={1000}
              value={interestedDetails.price_bargain_range}
              onChange={handleChange}
              style={{ width: "100%", marginBottom: "10px" }}
            />
            <p>Selected Price: ₹{interestedDetails.price_bargain_range}</p>

            <label htmlFor="query">Query:</label>
            <textarea
              name="query"
              value={interestedDetails.query}
              onChange={handleChange}
              rows="4"
              cols="50"
              placeholder="Enter your query here..."
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "5px",
                marginBottom: "10px",
              }}
            />

            <div className="button-group">
              <button type="submit" className="interested-button">
                Submit
              </button>
              <button
                type="button"
                className="bck-button"
                onClick={() => setShowPopup(false)}
              >
                Close
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default CarDetails;