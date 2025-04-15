import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "./Profile.css";

const Profile = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateProfile, setUpdateProfile] = useState(false)
  const [deleteProfile, setDeleteProfile] = useState(false)

  const [pendingRequests, setPendingRequests] = useState([])
  const [acceptedRequests, setAcceptedRequests] = useState([])
  const [rejectedRequests, setRejectedRequests] = useState([])

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
  })
  const [showPopup, setShowPopup] = useState(false)
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
  })

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
            setFormDetails(response.data)
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!userDetails) {
    return <div>User details not found.</div>;
  }

  
  // When Update button is clicked
  const updateButton = () => {
    setUpdateProfile(true)
  }
  
  const handleUpdateSubmit = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem("token");
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.userId;
    try {
      const response = await axios.put(`http://localhost:3000/api/user/update?userId=${userId}`, formDetails, {
        headers: {
          Authorization: token,
        },
      })

      if (response.data.message === "Account updated successfully") {
        console.log("Profile updated successfully", response.data)
        setUserDetails(response.data)
        setUpdateProfile(false)
        alert("Successfully updated!")
        window.location.reload()
      } else {
        console.error("Error updating profile: ", response.data.message)
      }
    } catch (error) {
      console.error("Error updating profile: ", error)
    }
    
  }

  // When Delete button is clicked
  
  const deleteButton = () => {
    setDeleteProfile(true)
  }

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

      console.log(userId)
      const response = await axios.get(
        `http://localhost:3000/api/messages/getPendingRequests?buyer_id=${userId}`
      );
      console.log(response.data)
      setPendingRequests(response.data)
      console.log("Pending requests fetched successfully", response.data);
    } catch (error) {
      console.error("Error fetching pending requests:", error);
    }
  }

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

      console.log(userId)
      const response = await axios.get(
        `http://localhost:3000/api/messages/getAcceptedRequests?buyer_id=${userId}`
      );
      console.log(response.data)
      setAcceptedRequests(response.data)
      console.log("Accepted requests fetched successfully", response.data);
    } catch (error) {
      console.error("Error fetching accepted requests:", error);
    }
  }

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

      console.log(userId)
      const response = await axios.get(
        `http://localhost:3000/api/messages/getRejectedRequests?buyer_id=${userId}`
      );
      console.log(response.data)
      setRejectedRequests(response.data)
      console.log("Rejected requests fetched successfully", response.data);
    } catch (error) {
      console.error("Error fetching rejected requests:", error);
    }
  }


  const getCarDetails = async (carId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/car/carDetails?car_id=${carId}`
      )
      setCarDetails(response.data)
      // console.log(carDetails)
      // console.log("Pending requests fetched successfully", response.data);
      setShowPopup(true)
    } catch (error) {
      console.error("Error fetching car details:", error);
    } 
  }
  return (
    <div>
      <div className="profile-container">
        <h2>Profile</h2>
        <p><strong>Full Name:</strong> {userDetails.full_name}</p>
        <p><strong>Email:</strong> {userDetails.email}</p>
        <p><strong>Phone Number:</strong> {userDetails.phone_number}</p>
        {userDetails.address && (
          <div className="address-container">
            <h3>Address</h3>
            <p><strong>Street:</strong> {userDetails.address.street}</p>
            <p><strong>City:</strong> {userDetails.address.city}</p>
            <p><strong>State:</strong> {userDetails.address.state}</p>
          </div>
        )}
      </div>

      <div>
        <div className="profile-buttons">
          <button onClick={updateButton}>UPDATE PROFILE</button>
          <button onClick={deleteButton}>DELETE PROFILE</button>
        </div>

        {updateProfile && (
          <div>
            <h1>UPDATE PROFILE</h1>
            <form onSubmit={handleUpdateSubmit}>
              Full Name: <input type="text" value={formDetails.full_name} name="full_name" onChange={handleChange}/><br />
              
              Email ID: <input type="text" value={formDetails.email} name="email"  onChange={handleChange}/><br />
              
              Password: <input type="text" value={formDetails.password} name="password" onChange={handleChange}/><br />
              
              Phone Number: <input type="text" value={formDetails.phone_number} name="phone_number" onChange={handleChange}/><br />
              
              <h3>Address</h3>
              Street: <input type="text" value={formDetails.address.street} name="address.street" onChange={handleChange}/><br />
              
              City: <input type="text" value={formDetails.address.city} name="address.city" onChange={handleChange}/><br />
              
              State: <input type="text" value={formDetails.address.state} name="address.state" onChange={handleChange}/><br />
              
              <input type="submit" value="SUBMIT"/>
            </form>
          </div>
        )}
      </div>

      <div>
        {/* Pending requests*/}
        <button onClick={handlePendingRequests}><h1>PENDING REQUESTS</h1></button>

        {/* Accepted requests*/}
        <button onClick={handleAcceptedRequests}><h1>ACCEPTED REQUESTS</h1></button>

        {/* Rejected requests*/}
        <button onClick={handleRejectedRequests}><h1>REJECTED REQUESTS</h1></button>

        {pendingRequests && pendingRequests.length > 0 ? (
          <div>
            <h2>Pending Requests</h2>
            {pendingRequests.map((request, index) => (
              <div key={request._id}>
                <p><strong>Seller ID:</strong> {request.seller_id}</p>
                <p><strong>Car ID:</strong> {request.car_id}</p>
                <p><strong>Your Bargained Price:</strong> {request.price_bargain_range}</p>
                <p><strong>Your Query:</strong> {request.query}</p>
                <p><strong>Status:</strong> {request.status}</p>

                <button onClick={() => getCarDetails(request.car_id)}>SHOW CAR DETAILS</button>
              </div>
            ))}
          </div>
        ) : (
          <p></p>
        )}
        
        {acceptedRequests && acceptedRequests.length > 0 ? (
          <div>
            <h2>Accepted Requests</h2>
            {acceptedRequests.map((request, index) => (
              <div key={request._id}>
                <p><strong>Seller ID:</strong> {request.seller_id}</p>
                <p><strong>Car ID:</strong> {request.car_id}</p>
                <p><strong>Status:</strong> {request.status}</p>

                <button onClick={() => getCarDetails(request.car_id)}>SHOW CAR DETAILS</button>
              </div>
            ))}
          </div>
        ) : (
          <p></p>
        )}
        
        {rejectedRequests && rejectedRequests.length > 0 ? (
          <div>
            <h2>Rejected Requests</h2>
            {rejectedRequests.map((request, index) => (
              <div key={request._id}>
                <p><strong>Seller ID:</strong> {request.seller_id}</p>
                <p><strong>Car ID:</strong> {request.car_id}</p>
                <p><strong>Status:</strong> {request.status}</p>

                <button onClick={() => getCarDetails(request.car_id)}>SHOW CAR DETAILS</button>
              </div>
            ))}
          </div>
        ) : (
          <p></p>
        )}

{showPopup && carDetails && (
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
    {/*<p><strong>Location:</strong> {carDetails.location || "N/A"}</p>*/}
    {carDetails.image && (
          <img
            src={carDetails.image}
            alt={`${carDetails.make} ${carDetails.model}`}
            style={{ width: "100%", borderRadius: "10px", marginTop: "10px" }}
          />
        )}
        <button onClick={() => setShowPopup(false)}>Close</button>
      </div>
    )}
      </div>
    </div>
  );
  
};

export default Profile;