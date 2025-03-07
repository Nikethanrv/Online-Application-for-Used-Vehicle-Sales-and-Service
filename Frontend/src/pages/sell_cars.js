import React, { useState } from "react";
import "./styles/sell_cars.css";

const CarForm = ({ sellerName, sellerLocation }) => {
  const [car, setCar] = useState({
    model_name: "",
    price: "",
    mileage: "",
    specs: {
      fuel_type: "",
      transmission: "",
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("specs.")) {
      const key = name.split(".")[1];
      setCar({ ...car, specs: { ...car.specs, [key]: value } });
    } else {
      setCar({ ...car, [name]: value });
    }
  };

  const handleSubmit = async (action) => {
    try {
      const url = `http://localhost:5000/cars/${action}`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...car,
          seller_details: { name: sellerName, location: sellerLocation },
        }),
      });

      const data = await response.json();
      alert(data.message);
    } catch (error) {
      alert("An error occurred");
    }
  };

  return (
    <div className="car-form-container">
      <h2>Register Car for Sale</h2>
      <input className="input-field" value={sellerName} disabled />
      <input className="input-field" value={sellerLocation} disabled />
      <input name="model_name" placeholder="Model Name" className="input-field" onChange={handleChange} />
      <input name="price" placeholder="Price" type="number" className="input-field" onChange={handleChange} />
      <input name="mileage" placeholder="Mileage" type="number" className="input-field" onChange={handleChange} />
      <input name="specs.fuel_type" placeholder="Fuel Type" className="input-field" onChange={handleChange} />
      <input name="specs.transmission" placeholder="Transmission" className="input-field" onChange={handleChange} />
      <div className="button-group">
        <button className="register-btn" onClick={() => handleSubmit("register")}>Register</button>
      </div>
    </div>
  );
};

export default CarForm;
