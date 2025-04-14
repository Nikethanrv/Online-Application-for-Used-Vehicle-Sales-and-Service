import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
// import { jwt_decode } from 'jwt-decode';

const UNSPLASH_ACCESS_KEY = "WDbM-V_NqCGYB37tQnD797i5bqcbKB4O_ZazTMfwyOs";

const Dashboard = () => {
  const navigate = useNavigate();
  const [bgImage, setBgImage] = useState(
    "https://source.unsplash.com/1600x900/?luxury-cars"
  );
  const [isLoggedIn, setisLoggedIn] = useState(false);
  // const [userName, setUserName] = useState("")

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      /*try {
        const tokenUserName = jwt_decode(token) 
        setUserName(tokenUserName.full_name)
      } catch (error) {
        console.log(error)
      }*/
      setisLoggedIn(true);
    } else {
      setisLoggedIn(false);
    }

    const fetchImage = async () => {
      try {
        const res = await axios.get(
          `https://api.unsplash.com/photos/random?query=luxury-cars&client_id=${UNSPLASH_ACCESS_KEY}`
        );
        setBgImage(res.data.urls.regular);
      } catch (error) {
        console.error("Error fetching background image", error);
      }
    };
    fetchImage();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setisLoggedIn(false);
    navigate("/");
    window.location.reload();
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "20px",
        color: "white",
        textShadow: "3px 3px 6px rgba(0,0,0,0.8)",
        position: "relative",
      }}
    >
      <div
        style={{
          background: "rgba(0, 0, 0, 0.5)",
          padding: "30px",
          borderRadius: "12px",
          backdropFilter: "blur(10px)",
          textAlign: "center",
          boxShadow: "5px 5px 15px rgba(0, 0, 0, 0.4)",
        }}
      >
        <h1
          style={{
            fontSize: "48px",
            fontWeight: "bold",
            marginBottom: "30px",
            animation: "fadeIn 1.5s ease-in-out",
          }}
        >
          Welcome!
        </h1>
        {isLoggedIn && (
          <div
            style={{ display: "flex", gap: "30px", justifyContent: "center" }}
          >
            <button
              style={{
                padding: "20px 40px",
                fontSize: "22px",
                backgroundColor: "#28a745",
                color: "white",
                fontWeight: "bold",
                border: "none",
                borderRadius: "12px",
                cursor: "pointer",
                boxShadow: "5px 5px 15px rgba(0, 0, 0, 0.4)",
                transition: "transform 0.2s ease-in-out, background-color 0.3s",
              }}
              onClick={() => navigate("/home")}
              onMouseOver={(e) => (e.target.style.transform = "scale(1.15)")}
              onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
            >
              Buy
            </button>

            <button
              style={{
                padding: "20px 40px",
                fontSize: "22px",
                backgroundColor: "#28a745",
                color: "white",
                fontWeight: "bold",
                border: "none",
                borderRadius: "12px",
                cursor: "pointer",
                boxShadow: "5px 5px 15px rgba(0, 0, 0, 0.4)",
                transition: "transform 0.2s ease-in-out, background-color 0.3s",
              }}
              onClick={() => navigate("/sell")}
              onMouseOver={(e) => (e.target.style.transform = "scale(1.15)")}
              onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
            >
              Sell
            </button>

            <button
              style={{
                padding: "20px 40px",
                fontSize: "22px",
                backgroundColor: "#28a745",
                color: "white",
                fontWeight: "bold",
                border: "none",
                borderRadius: "12px",
                cursor: "pointer",
                boxShadow: "5px 5px 15px rgba(0, 0, 0, 0.4)",
                transition: "transform 0.2s ease-in-out, background-color 0.3s",
              }}
              onClick={() => navigate("/listings")}
              onMouseOver={(e) => (e.target.style.transform = "scale(1.15)")}
              onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
            >
            Manage Listings
            </button>
            <div className="user-account">
              <Link to="/profile">
                <button
                  style={{
                    padding: "20px 40px",
                    fontSize: "22px",
                    backgroundColor: "#28a745",
                    color: "white",
                    fontWeight: "bold",
                    border: "none",
                    borderRadius: "12px",
                    cursor: "pointer",
                    boxShadow: "5px 5px 15px rgba(0, 0, 0, 0.4)",
                    transition:
                      "transform 0.2s ease-in-out, background-color 0.3s",
                  }}
                  onClick={() => navigate("/sell")}
                  onMouseOver={(e) =>
                    (e.target.style.transform = "scale(1.15)")
                  }
                  onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
                >
                  Your Profile
                </button>
              </Link>
            </div>
            <div className="logout-button">
              <button
                onClick={() => {
                  handleLogout();
                  navigate("/sell");
                }}
                style={{
                  padding: "20px 40px",
                  fontSize: "22px",
                  backgroundColor: "#28a745",
                  color: "white",
                  fontWeight: "bold",
                  border: "none",
                  borderRadius: "12px",
                  cursor: "pointer",
                  boxShadow: "5px 5px 15px rgba(0, 0, 0, 0.4)",
                  transition:
                    "transform 0.2s ease-in-out, background-color 0.3s",
                }}
                onMouseOver={(e) => (e.target.style.transform = "scale(1.15)")}
                onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
              >
                Logout
              </button>
            </div>
          </div>
        )}
        {!isLoggedIn && (
          <div className="auth-buttons">
            <Link to="/signup">
              <button
                style={{
                  padding: "10px 20px",
                  fontSize: "22px",
                  width: "130px",
                  marginRight: "10px",
                  backgroundColor: "#28a745",
                  color: "white",
                  fontWeight: "bold",
                  border: "none",
                  borderRadius: "12px",
                  cursor: "pointer",
                  boxShadow: "5px 5px 15px rgba(0, 0, 0, 0.4)",
                  transition:
                    "transform 0.2s ease-in-out, background-color 0.3s",
                }}
                onMouseOver={(e) => (e.target.style.transform = "scale(1.15)")}
                onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
              >
                Sign Up
              </button>
            </Link>
            <Link to="/login">
              <button
                style={{
                  padding: "10px 20px",
                  fontSize: "22px",
                  width: "130px",
                  marginLeft: "10px",
                  backgroundColor: "#28a745",
                  color: "white",
                  fontWeight: "bold",
                  border: "none",
                  borderRadius: "12px",
                  cursor: "pointer",
                  boxShadow: "5px 5px 15px rgba(0, 0, 0, 0.4)",
                  transition:
                    "transform 0.2s ease-in-out, background-color 0.3s",
                }}
                onMouseOver={(e) => (e.target.style.transform = "scale(1.15)")}
                onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
              >
                Login
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
