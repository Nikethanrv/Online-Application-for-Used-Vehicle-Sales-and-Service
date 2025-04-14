import React, { useState, useEffect } from "react";
import { useNavigate, Link, data } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const SellPage = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [carDetails, setCarDetails] = useState({
    make: "",
    model: "",
    year: "",
    mileage: 0,
    transmission: "",
    fuelType: "",
    condition: "",
    price: "",
    image: null,
    name: "",
    phone: "",
    email: "",
    location: "",
    seller_id: ""
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [isLoggedIn, setisLoggedIn] = useState(false);

  useEffect(() => {
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
            setCarDetails((prevDetails) => ({
              ...prevDetails,
              name: response.data.full_name,
              phone: response.data.phone_number,
              email: response.data.email,
              location: response.location,
              seller_id: userId
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
  }, []);

  const handleAgree = () => setShowForm(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCarDetails({ ...carDetails, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCarDetails({ ...carDetails, image: reader.result });
      };
      reader.readAsDataURL(file);
      setImagePreview(URL.createObjectURL(file));
      setCarDetails({ ...carDetails, image: file });
    } else {
      setCarDetails({ ...formData, image: null });
    }
  };

  const validateForm = () => {
    let newErrors = {};
    if (!carDetails.make.trim()) newErrors.make = "Car make is required.";
    if (!carDetails.model.trim()) newErrors.model = "Car model is required.";
    if (
      !carDetails.year.trim() ||
      isNaN(carDetails.year) ||
      carDetails.year < 1886 ||
      carDetails.year > new Date().getFullYear()
    )
      newErrors.year = "Enter a valid year.";
    if (
      !carDetails.price.trim() ||
      isNaN(carDetails.price) ||
      carDetails.price <= 0
    )
      newErrors.price = "Enter a valid price.";

    if (!carDetails.image) newErrors.image = "Car image is required.";
    if (!carDetails.transmission)
      newErrors.transmission = "Transmission is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await fetch("http://localhost:3000/api/car/reg", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(carDetails),
      });
      const data = await response.json()
      if (response.ok) {
        console.log(data.message);
        setCarDetails({
          make: "",
          model: "",
          year: "",
          mileage: 0,
          transmission: "",
          fuelType: "",
          condition: "",
          price: "",
          image: null,
          name: "",
          phone: "",
          email: "",
          location: "",
        });
        setShowPopup(true);
      } else {
        alert(data.message)
      }
    } catch (error) {
      alert(error)
    }
    {setTimeout(() => {
      setShowPopup(false)
      window.location.reload(false)
    }, 1000);}
  };

  return (
    <div
      style={{
        padding: "20px",
        textAlign: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      {isLoggedIn && (
        <Link to="/">
          <button
      style={{
        padding: "10px 15px",
        backgroundColor: "#555",
        color: "white",
        border: "none",
        marginBottom:"10px",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "14px",
        transition: "background 0.3s ease",
      }}
      onMouseOver={(e) => (e.target.style.backgroundColor = "#333")}
      onMouseOut={(e) => (e.target.style.backgroundColor = "#555")}
    >Back to Dashboard</button>
        </Link>
      )}
      {!showForm && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "10px",
              textAlign: "center",
            }}
          >
            <h2>Terms & Conditions</h2>
            <p>
              You must provide accurate details about the car you are selling.
            </p>
            <button
              onClick={handleAgree}
              style={{
                padding: "10px 20px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              I Agree
            </button>
          </div>
        </div>
      )}
      {showForm && (
        <div
          style={{
            maxWidth: "500px",
            margin: "auto",
            background: "white",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
          }}
        >
          <h2>Sell Your Car</h2>
          <input
            type="text"
            value={carDetails.name}
            readOnly
            style={{
              width: "80%",
              padding: "10px",
              marginBottom: "10px",
              backgroundColor: "#e9ecef",
            }}
          />
          <input
            type="text"
            value={carDetails.phone}
            readOnly
            style={{
              width: "80%",
              padding: "10px",
              marginBottom: "10px",
              backgroundColor: "#e9ecef",
            }}
          />
          <input
            type="text"
            value={carDetails.email}
            readOnly
            style={{
              width: "80%",
              padding: "10px",
              marginBottom: "10px",
              backgroundColor: "#e9ecef",
            }}
          />
          <input
            type="text"
            name="make"
            placeholder="Car Make"
            onChange={handleChange}
            style={{ width: "80%", padding: "10px", marginBottom: "10px" }}
          />
          {errors.make && <p style={{ color: "red" }}>{errors.make}</p>}
          <input
            type="text"
            name="model"
            placeholder="Car Model"
            onChange={handleChange}
            style={{ width: "80%", padding: "10px", marginBottom: "10px" }}
          />
          {errors.model && <p style={{ color: "red" }}>{errors.model}</p>}
          <input
            type="text"
            name="year"
            placeholder="Year"
            onChange={handleChange}
            style={{ width: "80%", padding: "10px", marginBottom: "10px" }}
          />
          {errors.year && <p style={{ color: "red" }}>{errors.year}</p>}
          <input
            type="number"
            name="mileage"
            placeholder="Total Miles Driven"
            onChange={handleChange}
            style={{ width: "80%", padding: "10px", marginBottom: "10px" }}
          />
          {errors.mileage && <p style={{ color: "red" }}>{errors.mileage}</p>}

          <select
            name="transmission"
            onChange={handleChange}
            style={{ width: "85%", padding: "10px", marginBottom: "10px" }}
            defaultValue=""
          >
            <option value="" disabled>
              Select Transmission
            </option>
            <option value="Automatic">Automatic</option>
            <option value="Manual">Manual</option>
            <option value="Hybrid">Hybrid</option>
          </select>
          {errors.transmission && (
            <p style={{ color: "red" }}>{errors.transmission}</p>
          )}

          <input
            type="text"
            name="fuelType"
            placeholder="Fuel Type"
            onChange={handleChange}
            style={{ width: "80%", padding: "10px", marginBottom: "10px" }}
          />
          {errors.fuelType && <p style={{ color: "red" }}>{errors.fuelType}</p>}

          <input
            type="text"
            name="condition"
            placeholder="Condition"
            onChange={handleChange}
            style={{ width: "80%", padding: "10px", marginBottom: "10px" }}
          />
          {errors.condition && (
            <p style={{ color: "red" }}>{errors.condition}</p>
          )}

          <input
            type="text"
            name="price"
            placeholder="Price in INR(₹)"
            onChange={handleChange}
            style={{ width: "80%", padding: "10px", marginBottom: "10px" }}
          />
          {errors.price && <p style={{ color: "red" }}>{errors.price}</p>}

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ width: "80%", padding: "10px", marginBottom: "10px" }}
          />
          {errors.image && <p style={{ color: "red" }}>{errors.image}</p>}
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Car Preview"
              style={{ width: "90%", height: "auto", borderRadius: "10px" }}
            />
          )}

          <button
            onClick={handleSubmit}
            style={{
              width: "90%",
              padding: "10px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              marginTop: "10px",
            }}
          >
            Submit
          </button>
        </div>
      )}
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
          <h3>
            Car posted for sale!
          </h3>
        </div>
      )}
      <Link to="/listings">
            <button>View/Manage Listings</button>
      </Link>
    </div>
  );
};

export default SellPage;
