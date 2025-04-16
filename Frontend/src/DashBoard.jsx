import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import StyledButton from "./styles/StyledButton";
import "./styles/Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);

      try {
        // Decode token to get user ID
        const decoded = jwtDecode(token);
        const userId = decoded.userId;

        // Fetch user details
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
            setUsername(response.data.full_name);
          } catch (error) {
            console.error("Error fetching user details:", error);
          }
        };

        fetchUserDetails();
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUsername("");
    navigate("/");
    window.location.reload();
  };

  return (
    <div className="dealer-container">
      {/* Video Background */}
      <video autoPlay loop muted playsInline className="video-background">
        <source src="/assets/video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Semi-transparent overlay */}
      <div className="overlay"></div>

      {/* Navigation */}
      <nav className="dealer-nav">
        <div className="logo"><em>S3H</em> CAR DEALER</div>
        <div className="nav-links">
          {isLoggedIn ? (
            <>
              <StyledButton onClick={() => navigate("/home")}>CARS TO BUY</StyledButton>
              <StyledButton onClick={() => navigate("/sell")}>SELL YOUR CAR</StyledButton>
              <StyledButton onClick={() => navigate("/listings")}>Manage Listings</StyledButton>
              <StyledButton onClick={() => navigate("/profile")}>YOUR PROFILE</StyledButton>
              <StyledButton onClick={handleLogout}>LOGOUT</StyledButton>
            </>
          ) : (
            <>
              <StyledButton onClick={() => navigate("/login")}>Login</StyledButton>
              <StyledButton onClick={() => navigate("/signup")}>Signup</StyledButton>
            </>
          )}
        </div>
      </nav>

      {/* Hero Content */}
      <div className="hero-content">
        {isLoggedIn && (
          <div className="welcome-message">
            <em>Welcome,</em> {username}!
          </div>
        )}
        <h1>USED CAR DEALER WEBSITE</h1>
        <p className="tagline">Used Vehicle Sales and Service </p>
        <h2 className="main-heading">BEST <em>CAR DEALER</em> IN TOWN!</h2>
        <StyledButton onClick={() => navigate("/contact")}>
          BOOK CAR SERVICE
        </StyledButton>
      </div>
    </div>
  );
};

export default Dashboard;