import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./styles/signup.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    phone_number: "",
    street: "",
    city: "",
    state: "",
    zip_code: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/user/reg", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: formData.full_name,
          email: formData.email,
          password: formData.password,
          phone_number: formData.phone_number,
          address: {
            street: formData.street,
            city: formData.city,
            state: formData.state,
            zip_code: formData.zip_code,
          },
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Account created successfully");
        navigate("/login");
      } else {
        alert(data.message || "Signup failed");
      }
    } catch (error) {
      alert("An error occurred while signing up");
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <h2>Create LUCI CARS Account</h2>
        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" name="full_name" required onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" required onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" required onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input type="tel" name="phone_number" required onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Street</label>
            <input type="text" name="street" required onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>City</label>
            <input type="text" name="city" required onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>State</label>
            <input type="text" name="state" required onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Zip Code</label>
            <input type="text" name="zip_code" required onChange={handleChange} />
          </div>
          <button type="submit" className="signup-submit">Create Account</button>
        </form>
        <p className="login-link">
          Already have an account? <Link to="/login">Sign in here</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
