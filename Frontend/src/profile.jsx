import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "./styles/Profile.css";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Profile = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateProfile, setUpdateProfile] = useState(false);
  const [deleteProfile, setDeleteProfile] = useState(false);

  const [pendingRequests, setPendingRequests] = useState([]);
  const [acceptedRequests, setAcceptedRequests] = useState([]);
  const [rejectedRequests, setRejectedRequests] = useState([]);

  const [carDetails, setCarDetails] = useState({
    make: "",
    model: "",
    year: "",
    mileage: 0,
    transmission: "",
    fuelType: "",
    condition: "",
    price: "",
    name: "",
    phone: "",
    email: "",
    location: "",
    image: ""
  });
  
  const [showPopup, setShowPopup] = useState(false);
  const [formDetails, setFormDetails] = useState({
    full_name: "",
    email: "",
    password: "",
    phone_number: "",
    address: {
      street: "",
      city: "",
      state: ""
    }
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId;

        axios
          .get(`http://localhost:3000/api/user/profile/${userId}`, {
            headers: {
              Authorization: token,
            },
          })
          .then((response) => {
            setUserDetails(response.data);
            setFormDetails(response.data);
            setLoading(false);
          })
          .catch((err) => {
            setError(err);
            setLoading(false);
          });
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    } else {
      setError(new Error("No token found"));
      setLoading(false);
    }
  }, []);

  const updateButton = () => {
    setUpdateProfile(true);
  };
  
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.userId;
    try {
      const response = await axios.put(
        `http://localhost:3000/api/user/update?userId=${userId}`,
        formDetails,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (response.data.message === "Account updated successfully") {
        setUserDetails(response.data);
        setUpdateProfile(false);
        toast.success("Successfully Updated!", {
          position: "top-right",
          autoClose: 2000,
        });
        
        setTimeout(() => {
          window.location.reload(); // or navigate('/')
        }, 2500); // wait until toast is shown
      } else {
        console.error("Error updating profile: ", response.data.message);
      }
    } catch (error) {
      console.error("Error updating profile: ", error);
    }
  };

  const deleteButton = () => {
    setDeleteProfile(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const addressPart = name.split(".")[1];
      setFormDetails(prevState => ({
        ...prevState,
        address: {
          ...prevState.address,
          [addressPart]: value,
        },
      }));
    } else {
      setFormDetails(prevState => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handlePendingRequests = async () => {
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
        `http://localhost:3000/api/messages/getPendingRequests?buyer_id=${userId}`
      );
      setPendingRequests(response.data);
    } catch (error) {
      console.error("Error fetching pending requests:", error);
    }
  };

  const handleAcceptedRequests = async () => {
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
        `http://localhost:3000/api/messages/getAcceptedRequests?buyer_id=${userId}`
      );
      setAcceptedRequests(response.data);
    } catch (error) {
      console.error("Error fetching accepted requests:", error);
    }
  };

  const handleRejectedRequests = async () => {
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
        `http://localhost:3000/api/messages/getRejectedRequests?buyer_id=${userId}`
      );
      setRejectedRequests(response.data);
    } catch (error) {
      console.error("Error fetching rejected requests:", error);
    }
  };

  const getCarDetails = async (carId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/car/carDetails?car_id=${carId}`
      );
      setCarDetails(response.data);
      setShowPopup(true);
    } catch (error) {
      console.error("Error fetching car details:", error);
    } 
  };

  if (loading) {
    return <div className="loading-state">Loading...</div>;
  }

  if (error) {
    return <div className="error-state">Error: {error.message}</div>;
  }

  if (!userDetails) {
    return <div className="not-found">User details not found.</div>;
  }

  return (
    <div className="profile-container">
      <ToastContainer />
      <div className="profile-header">
        <h2>My Profile</h2>
      </div>

      <div className="profile-content">
        <div className="profile-info-section">
          <div className="profile-details">
            <p><strong>Full Name:</strong> {userDetails.full_name}</p>
            <p><strong>Email:</strong> {userDetails.email}</p>
            <p><strong>Phone Number:</strong> {userDetails.phone_number}</p>
            {userDetails.address && (
              <div className="address-section">
                <h3 className="address-header">Address</h3>
                <p><strong>Street:</strong> {userDetails.address.street}</p>
                <p><strong>City:</strong> {userDetails.address.city}</p>
                <p><strong>State:</strong> {userDetails.address.state}</p>
              </div>
            )}
          </div>

          <div className="profile-buttons">
            <button onClick={updateButton}>UPDATE PROFILE</button>
          </div>
        </div>

        {updateProfile && (
          <div className="update-form">
            <h1>UPDATE PROFILE</h1>
            <form onSubmit={handleUpdateSubmit}>
              <label>Full Name:</label>
              <input 
                type="text" 
                value={formDetails.full_name} 
                name="full_name" 
                onChange={handleChange}
                required
              />
              
              <label>Email ID:</label>
              <input 
                type="email" 
                value={formDetails.email} 
                name="email"  
                onChange={handleChange}
                required
              />
              
              <label>Password:</label>
              <input 
                type="password" 
                value={formDetails.password} 
                name="password" 
                onChange={handleChange}
                required
              />
              
              <label>Phone Number:</label>
              <input 
                type="tel" 
                value={formDetails.phone_number} 
                name="phone_number" 
                onChange={handleChange}
                required
              />
              
              <h3>Address</h3>
              <label>Street:</label>
              <input 
                type="text" 
                value={formDetails.address.street} 
                name="address.street" 
                onChange={handleChange}
              />
              
              <label>City:</label>
              <input 
                type="text" 
                value={formDetails.address.city} 
                name="address.city" 
                onChange={handleChange}
              />
              
              <label>State:</label>
              <input 
                type="text" 
                value={formDetails.address.state} 
                name="address.state" 
                onChange={handleChange}
              />
              
              <input type="submit" value="SUBMIT"/>
            </form>
          </div>
        )}
      </div>

      <div className="requests-section">
        <div className="requests-header">
          <button onClick={handlePendingRequests}>Pending Requests</button>
          <button onClick={handleAcceptedRequests}>Accepted Requests</button>
          <button onClick={handleRejectedRequests}>Rejected Requests</button>
        </div>

        <div className="request-list">
          {pendingRequests && pendingRequests.length > 0 && (
            <div>
              <h2>Pending Requests</h2>
              {pendingRequests.map((request) => (
                <div className="request-item" key={request._id}>
                  <p><strong>Seller ID:</strong> {request.seller_id}</p>
                  <p><strong>Car ID:</strong> {request.car_id}</p>
                  <p><strong>Your Bargained Price:</strong> ₹{request.price_bargain_range}</p>
                  <p><strong>Your Query:</strong> {request.query}</p>
                  <p><strong>Status:</strong> {request.status}</p>
                  <button onClick={() => getCarDetails(request.car_id)}>SHOW CAR DETAILS</button>
                </div>
              ))}
            </div>
          )}
          
          {acceptedRequests && acceptedRequests.length > 0 && (
            <div>
              <h2>Accepted Requests</h2>
              {acceptedRequests.map((request) => (
                <div className="request-item" key={request._id}>
                  <p><strong>Seller ID:</strong> {request.seller_id}</p>
                  <p><strong>Car ID:</strong> {request.car_id}</p>
                  <p><strong>Status:</strong> {request.status}</p>
                  <button onClick={() => getCarDetails(request.car_id)}>SHOW CAR DETAILS</button>
                </div>
              ))}
            </div>
          )}
          
          {rejectedRequests && rejectedRequests.length > 0 && (
            <div>
              <h2>Rejected Requests</h2>
              {rejectedRequests.map((request) => (
                <div className="request-item" key={request._id}>
                  <p><strong>Seller ID:</strong> {request.seller_id}</p>
                  <p><strong>Car ID:</strong> {request.car_id}</p>
                  <p><strong>Status:</strong> {request.status}</p>
                  <button onClick={() => getCarDetails(request.car_id)}>SHOW CAR DETAILS</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showPopup && (
        <>
          <div className="popup-overlay" onClick={() => setShowPopup(false)}></div>
          <div className="car-popup">
            <h2>Car Details</h2>
            <p><strong>Make:</strong> {carDetails.make || "N/A"}</p>
            <p><strong>Model:</strong> {carDetails.model || "N/A"}</p>
            <p><strong>Year:</strong> {carDetails.year || "N/A"}</p>
            <p><strong>Mileage:</strong> {carDetails.mileage || "N/A"} kms</p>
            <p><strong>Transmission:</strong> {carDetails.transmission || "N/A"}</p>
            <p><strong>Fuel Type:</strong> {carDetails.fuelType || "N/A"}</p>
            <p><strong>Condition:</strong> {carDetails.condition || "N/A"}</p>
            <p><strong>Price:</strong> ₹{carDetails.price || "N/A"}</p>
            <p><strong>Seller Name:</strong> {carDetails.name || "N/A"}</p>
            <p><strong>Seller Phone:</strong> {carDetails.phone || "N/A"}</p>
            <p><strong>Seller Email:</strong> {carDetails.email || "N/A"}</p>
            {carDetails.image && (
              <img
                src={carDetails.image}
                alt={`${carDetails.make} ${carDetails.model}`}
              />
            )}
            <button onClick={() => setShowPopup(false)}>Close</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;