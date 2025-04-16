import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./styles/Homepage.css";
import { jwtDecode } from "jwt-decode";
import { FaCar, FaTachometerAlt, FaGasPump, FaCalendarAlt, FaExchangeAlt, FaSearch, FaArrowRight, FaArrowLeft } from "react-icons/fa";


const Homepage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      const tokenUserId = jwtDecode(token);
      const userId = tokenUserId.userId;
      const fetchCarData = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/api/car?userId=${userId}`);
          setCars(response.data);
        } catch (error) {
          console.error("Error fetching car data:", error);
        }
      };

      fetchCarData();
    } else {
      setIsLoggedIn(false);
      navigate("/");
    }
  }, [navigate]);

  const handleClick = (car) => setSelectedCar(car);
  const closePopup = () => setSelectedCar(null);
  const goToDetails = (car) => navigate("/car-details", { state: { car } });

  const filteredCars = cars.filter(
    (car) =>
      car.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.model.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="homepage">
      <h1 className="listings-header">Used Cars Marketplace</h1>
      {isLoggedIn && (
        <Link to="/">
          <button className="dashbrd-button"><FaArrowLeft/>&nbsp;&nbsp; Back to Dashboard</button>
        </Link>
      )}

      <div className="search-bar">
        <div className="search-input-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search for cars..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="car-list">
        {filteredCars.length > 0 ? (
          filteredCars.map((car) => (
            <div
              key={car._id}
              className="car-card"
              onClick={() => handleClick(car)}
            >
              <img src={car.image} alt={car.make} className="car-image" />
              <div className="car-details">
                <h2>
                  <FaCar /> {car.make} {car.model}
                </h2>
                <p>
                  <FaCalendarAlt /> {car.year}
                </p>
                <p>
                  <FaTachometerAlt /> {car.mileage} kms
                </p>
                <p>
                  <FaExchangeAlt /> {car.transmission}
                </p>
                <p>
                  <FaGasPump /> {car.fuelType}
                </p>
                <div className="price-container">
                  <h3>₹{car.price.toLocaleString()}</h3>
                  <span className="arrow">
                    <FaArrowRight />
                  </span>

                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="no-results">No cars found matching your search</p>
        )}
      </div>

      {selectedCar && (
        <div className="popup-overlay">
          <div className="popup">
            {/* <button className="popup-close" onClick={closePopup}>&times;</button> */}
            <h2>
              <FaCar /> {selectedCar.make} {selectedCar.model}
            </h2>
            <img
              src={selectedCar.image}
              alt={selectedCar.make}
              className="popup-image"
            />
            <div className="popup-details">
              <p>
                <FaCalendarAlt /> <strong>Year:</strong> {selectedCar.year}
              </p>
              <p>
                <FaTachometerAlt /> <strong>Mileage:</strong> {selectedCar.mileage} kms
              </p>
              <p>
                <FaExchangeAlt /> <strong>Transmission:</strong> {selectedCar.transmission}
              </p>
              <p>
                <FaGasPump /> <strong>Fuel Type:</strong> {selectedCar.fuelType}
              </p>
            </div>
            <h3>₹{selectedCar.price.toLocaleString()}</h3>
            <div className="popup-buttons">
              <button onClick={() => goToDetails(selectedCar)}>
                Show All Details
              </button>
              <button onClick={closePopup}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Homepage;