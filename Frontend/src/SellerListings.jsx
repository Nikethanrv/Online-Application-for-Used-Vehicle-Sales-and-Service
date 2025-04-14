import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./Homepage.css";

const SellerListings = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setisLoggedIn] = useState(false);

  const [listings, setListings] = useState([]);
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setisLoggedIn(true);
      const tokenUserId = jwtDecode(token);
      const userId = tokenUserId.userId;
      // console.log(userId);
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

  return (
    <div>
      <h1>YOUR LISTINGS</h1>
      <div className="listings">
        {listings.length > 0 ? (
          listings.map((car) => (
            <div key={car._id}>
              <img src={car.image} alt={car.make} />{" "}
              <div>
                <h2>
                  {car.make} {car.model}
                </h2>
                <p>
                  {car.year} • {car.mileage} kms • {car.transmission}
                </p>
                <h3>₹{car.price}</h3>
              </div>
            </div>
          ))
        ) : (
          <p>No cars listed for sale</p>
        )}
      </div>
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
