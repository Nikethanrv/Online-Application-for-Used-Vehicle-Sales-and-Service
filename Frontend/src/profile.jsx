import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "./Profile.css";

const Profile = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
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
  );
  
};

export default Profile;