import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "./styles/SellPage.css";
import { FaArrowLeft } from "react-icons/fa";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SellPage = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [activeSection, setActiveSection] = useState("sellerInfo"); // Start with seller info first
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);

      try {
        const tokenUserId = jwtDecode(token);
        const userId = tokenUserId.userId;
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

            // Debug: Log the entire response to see the structure
            console.log("User details response:", response.data);

            // Safely construct location from address object
            const userAddress = response.data.address || {};
            const locationParts = [
              userAddress.street,
              userAddress.city,
              userAddress.state
            ].filter(Boolean);

            // const location = locationParts.length > 0
            //   ? locationParts.join(", ")
            //   : "Location not specified";

            setCarDetails((prevDetails) => ({
              ...prevDetails,
              name: response.data.full_name || "",
              phone: response.data.phone_number || "",
              email: response.data.email || "",
              location: response.data.location,
              seller_id: userId
            }));
          } catch (error) {
            console.error("Error fetching user details", error);
            // Set default location if there's an error
            setCarDetails(prev => ({ ...prev, location: "Location not available" }));
          }
        };
        fetchUserDetails();
      } catch (error) {
        console.log(error);
      }
    } else {
      setIsLoggedIn(false);
      navigate("/dashboard");
    }
  }, [navigate]);

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
    }
  };

  const validateSellerInfo = () => {
    let newErrors = {};
    if (!carDetails.name.trim()) newErrors.name = "Name is required.";
    if (!carDetails.phone.trim()) newErrors.phone = "Phone is required.";
    if (!carDetails.email.trim()) newErrors.email = "Email is required.";
    if (!carDetails.location.trim()) newErrors.location = "Location is required.";
    if (!carDetails.price.trim() || isNaN(carDetails.price) || carDetails.price <= 0)
      newErrors.price = "Enter a valid price.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateCarDetails = () => {
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
    if (!carDetails.transmission)
      newErrors.transmission = "Transmission is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (activeSection === "sellerInfo" && validateSellerInfo()) {
      setActiveSection("carDetails");
    } else if (activeSection === "carDetails" && validateCarDetails()) {
      setActiveSection("imageUpload");
    }
  };

  const handleBack = () => {
    if (activeSection === "carDetails") {
      setActiveSection("sellerInfo");
    } else if (activeSection === "imageUpload") {
      setActiveSection("carDetails");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!carDetails.image) {
      setErrors({ ...errors, image: "Car image is required." });
      toast.error("Car image is required", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
  
    try {
      const response = await fetch("http://localhost:3000/api/car/reg", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(carDetails),
      });
      const data = await response.json();
      
      if (response.ok) {
        toast.success("Car posted successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
          window.location.reload(false);
        }, 1000);
      } else {
        toast.error(data.message || "Failed to post car", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error("An error occurred while posting the car", {
        position: "top-right",
        autoClose: 3000,
      });
      console.error("Error posting car", error);
    }
  };

  return (
    <div className="sell-page-container">
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      {isLoggedIn && (
        <Link to="/">
          <button className="dashboard-button">
            <FaArrowLeft />&nbsp;&nbsp;Back to Dashboard
          </button>
        </Link>
      )}

      {!showForm && (
        <div className="terms-overlay">
          <div className="terms-container">
            <h2>Terms & Conditions</h2>
            <p>You must provide accurate details about the car you are selling.</p>
            <button onClick={handleAgree} className="agree-button">
              I Agree
            </button>
          </div>
        </div>
      )}

      {showForm && (
        <div className="sell-form-container">
          <h2>Sell Your Car</h2>

          {/* Navigation Tabs */}
          <div className="form-sections">
            <button
              className={`section-tab ${activeSection === "sellerInfo" ? "active" : ""}`}
              onClick={() => setActiveSection("sellerInfo")}
            >
              Seller Info
            </button>
            <button
              className={`section-tab ${activeSection === "carDetails" ? "active" : ""}`}
              onClick={() => activeSection !== "sellerInfo" && setActiveSection("carDetails")}
              disabled={activeSection === "sellerInfo"}
            >
              Car Details
            </button>
            <button
              className={`section-tab ${activeSection === "imageUpload" ? "active" : ""}`}
              onClick={() => activeSection === "imageUpload" && setActiveSection("imageUpload")}
              disabled={activeSection !== "imageUpload"}
            >
              Upload Image
            </button>
          </div>

          {/* Seller Information Section */}
          {activeSection === "sellerInfo" && (
            <div className="form-section">
              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  readOnly
                  placeholder="Your Name"
                  value={carDetails.name}
                  onChange={handleChange}
                  className="form-input,read-only-input"
                />
                {errors.name && <p className="error-message">{errors.name}</p>}
              </div>

              <div className="form-group">
                <input
                  type="text"
                  name="phone"
                  readOnly
                  placeholder="Your Phone"
                  value={carDetails.phone}
                  onChange={handleChange}
                  className="form-input"
                />
                {errors.phone && <p className="error-message">{errors.phone}</p>}
              </div>

              <div className="form-group">
                <input
                  type="text"
                  name="email"
                  readOnly
                  placeholder="Your Email"
                  value={carDetails.email}
                  onChange={handleChange}
                  className="form-input"
                />
                {errors.email && <p className="error-message">{errors.email}</p>}
              </div>

              <div className="form-group">
                <input
                  type="text"
                  value={carDetails.location}
                  readOnly
                  className="read-only-input"
                  placeholder="Your Location"
                />
                {errors.location && <p className="error-message">{errors.location}</p>}
              </div>

              <div className="form-group">
                <input
                  type="text"
                  name="price"
                  placeholder="Price in INR(₹)"
                  value={carDetails.price}
                  onChange={handleChange}
                  className="form-input"
                />
                {errors.price && <p className="error-message">{errors.price}</p>}
              </div>

              <button onClick={handleNext} className="next-button">
                Next: Car Details
              </button>
            </div>
          )}

          {/* Car Details Section */}
          {activeSection === "carDetails" && (
            <div className="form-section">
              <div className="form-group">
                <input
                  type="text"
                  name="make"
                  placeholder="Car Make"
                  value={carDetails.make}
                  onChange={handleChange}
                  className="form-input"
                />
                {errors.make && <p className="error-message">{errors.make}</p>}
              </div>

              <div className="form-group">
                <input
                  type="text"
                  name="model"
                  placeholder="Car Model"
                  value={carDetails.model}
                  onChange={handleChange}
                  className="form-input"
                />
                {errors.model && <p className="error-message">{errors.model}</p>}
              </div>

              <div className="form-group">
                <input
                  type="text"
                  name="year"
                  placeholder="Year"
                  value={carDetails.year}
                  onChange={handleChange}
                  className="form-input"
                />
                {errors.year && <p className="error-message">{errors.year}</p>}
              </div>

              <div className="form-group">
                <input
                  type="number"
                  name="mileage"
                  placeholder="Total Miles Driven"
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <select
                  name="transmission"
                  value={carDetails.transmission}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="" disabled>Select Transmission</option>
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
                {errors.transmission && <p className="error-message">{errors.transmission}</p>}
              </div>

              <div className="form-group">
                <input
                  type="text"
                  name="fuelType"
                  placeholder="Fuel Type"
                  value={carDetails.fuelType}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <input
                  type="text"
                  name="condition"
                  placeholder="Condition"
                  value={carDetails.condition}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-actions">
                <button onClick={handleBack} className="back-button">
                  Back
                </button>
                <button onClick={handleNext} className="next-button">
                  Next: Upload Image
                </button>
              </div>
            </div>
          )}

          {/* Image Upload Section */}
          {activeSection === "imageUpload" && (
            <div className="form-section">
              <div className="form-group">
                <label htmlFor="car-image" className="file-input-label">
                  Upload Car Image
                  <input
                    id="car-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="file-input"
                  />
                </label>
                {errors.image && <p className="error-message">{errors.image}</p>}
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Car Preview"
                    className="image-preview"
                  />
                )}
              </div>

              <div className="form-actions">
                <button onClick={handleBack} className="back-button">
                  Back
                </button>
                <button onClick={handleSubmit} className="submit-button">
                  Submit Listing
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* {showPopup && (
        <div className="success-popup">
          <h3>Car posted for sale!</h3>
        </div>
      )} */}

      <Link to="/listings">
        <button className="listings-button">View/Manage Listings</button>
      </Link>
    </div>
  );
};

export default SellPage;