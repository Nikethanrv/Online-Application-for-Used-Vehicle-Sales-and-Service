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
    </div>
  );
  
};

export default Profile;