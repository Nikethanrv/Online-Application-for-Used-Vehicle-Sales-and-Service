import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Homepage.css";

const UNSPLASH_ACCESS_KEY = ""//WDbM-V_NqCGYB37tQnD797i5bqcbKB4O_ZazTMfwyOs"; // Replace with your Unsplash API key

const Homepage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  // Track login status
  const [isLoggedIn, setisLoggedIn] = useState(false)
  
  useEffect(() => {
    // To check if a user is logged in
    const token = localStorage.getItem("token")
    if (token) {
      setisLoggedIn(true)
    } else {
      setisLoggedIn(false)
      navigate("/")
    }

    const fetchCarData = async () => {
      try {
        let carData = [];

        // Fetching actual data from MongoDB
        const response = await fetch("http://localhost:3000/api/car");
        carData = await response.json();

        // Simulated local data for testing
        /*
        carData = [
          { id: 1, make: "Toyota", model: "Camry", year: 2020, mileage: "30,000 miles", transmission: "Automatic", fuelType: "Petrol", condition: "Used", location: "Los Angeles, CA", price: "18,500" },
          
          { id: 2, make: "Honda", model: "Civic", year: 2019, mileage: "40,000 miles", transmission: "Manual", fuelType: "Diesel", condition: "Certified Pre-Owned", location: "San Francisco, CA", price: "15,200" },
          { id: 3, make: "Ford", model: "Mustang", year: 2021, mileage: "10,000 miles", transmission: "Automatic", fuelType: "Petrol", condition: "New", location: "New York, NY", price: "35,000" },
          { id: 4, make: "Chevrolet", model: "Malibu", year: 2018, mileage: "50,000 miles", transmission: "Automatic", fuelType: "Hybrid", condition: "Used", location: "Chicago, IL", price: "17,000" },
          { id: 5, make: "Nissan", model: "Altima", year: 2020, mileage: "28,000 miles", transmission: "CVT", fuelType: "Petrol", condition: "Certified Pre-Owned", location: "Houston, TX", price: "19,000" },
          { id: 6, make: "BMW", model: "3 Series", year: 2017, mileage: "60,000 miles", transmission: "Automatic", fuelType: "Diesel", condition: "Used", location: "Miami, FL", price: "25,500" },
        ];
        */
        const updatedCars = await Promise.all(
          carData.map(async (car) => {
            try {
              const res = await axios.get(
                `https://api.unsplash.com/photos/random?query=${car.make} ${car.model}&client_id=${UNSPLASH_ACCESS_KEY}`
              );
              return { ...car, image: res.data.urls.regular };
            } catch (error) {
              console.error("Error fetching image for", car.make, car.model, error);
              return { ...car, image: "https://source.unsplash.com/800x500/?car" }; // Fallback image
            }
          })
        );

        setCars(updatedCars);
      } catch (error) {
        console.error("Error fetching car data:", error);
      }
    };

    fetchCarData();
  }, []);

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
            <div key={car.id} className="car-card" onClick={() => handleClick(car)}>
              <img src={car.image} alt={car.make} className="car-image" />
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
            <img src={selectedCar.image} alt={selectedCar.make} className="popup-image" />
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
