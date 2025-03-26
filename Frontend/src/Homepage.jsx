import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Homepage.css";

const Homepage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [isLoggedIn, setisLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setisLoggedIn(true);
    } else {
      setisLoggedIn(false);
      navigate("/");
    }

    const fetchCarData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/car"); 
        setCars(response.data); 
      } catch (error) {
        console.error("Error fetching car data:", error);
      }
    };

    fetchCarData();
  }, [navigate]);

  const handleClick = (car) => setSelectedCar(car);
  const closePopup = () => setSelectedCar(null);
  const goToDetails = (car) => navigate("/car-details", { state: { car } });

  const filteredCars = cars.filter((car) =>
    car.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
    car.model.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="homepage">
      <header className="header">🚗 Used Cars Marketplace</header>

      {isLoggedIn && (
        <Link to="/">
          <button>Back to Dashboard</button>
        </Link>
      )}

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for cars..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="car-list">
        {filteredCars.length > 0 ? (
          filteredCars.map((car) => (
            <div key={car._id} className="car-card" onClick={() => handleClick(car)}>
              <img src={car.image} alt={car.make} className="car-image" /> {/* Use Base64 image */}
              <div className="car-details">
                <h2>{car.make} {car.model}</h2>
                <p>{car.year} • {car.mileage} • {car.transmission}</p>
                <h3>${car.price}</h3>
              </div>
            </div>
          ))
        ) : (
          <p className="no-results">No cars found</p>
        )}
      </div>

      {selectedCar && (
        <div className="popup-overlay">
          <div className="popup">
            <h2>{selectedCar.make} {selectedCar.model}</h2>
            <img src={selectedCar.image} alt={selectedCar.make} className="popup-image" /> {/* Use Base64 image */}
            <p>{selectedCar.year} • {selectedCar.mileage} • {selectedCar.transmission}</p>
            <h3>${selectedCar.price}</h3>
            <div className="popup-buttons">
              <button onClick={() => goToDetails(selectedCar)}>Show All Details</button>
              <button onClick={closePopup}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Homepage;