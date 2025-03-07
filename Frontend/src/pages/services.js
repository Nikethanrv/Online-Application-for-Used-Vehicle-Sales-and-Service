import { useEffect, useState } from "react";
import "./styles/services.css";

const ServicePage = () => {
    const [services, setServices] = useState([]);
    const [cars, setCars] = useState([]);
    const [selectedCar, setSelectedCar] = useState("");
    const [serviceType, setServiceType] = useState("");
    const [serviceDate, setServiceDate] = useState("");
    const [serviceCenter, setServiceCenter] = useState("");

    // Load user’s booked services
    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await fetch("/api/service/user"); // Fetch user's services
                if (!response.ok) throw new Error("Failed to fetch services");
                const data = await response.json();
                setServices(data);
            } catch (error) {
                console.error("Error fetching services:", error);
            }
        };

        const fetchCars = async () => {
            try {
                const response = await fetch("/api/cars/user"); // Fetch user's cars
                if (!response.ok) throw new Error("Failed to fetch cars");
                const data = await response.json();
                setCars(data);
            } catch (error) {
                console.error("Error fetching cars:", error);
            }
        };

        fetchServices();
        fetchCars();
    }, []);

    // Book a new service
    const handleBookService = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("/api/service/book", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    carId: selectedCar,
                    serviceType,
                    serviceDate,
                    serviceCenter
                })
            });

            if (!response.ok) throw new Error("Failed to book service");
            
            const data = await response.json();
            alert("Service booked successfully!");
            setServices([...services, data.service]);
        } catch (error) {
            console.error("Error booking service:", error);
        }
    };

    return (
        <div className="service-page">
            <h2>Car Service Booking</h2>
            
            {/* Book Service Form */}
            <form className="service-form" onSubmit={handleBookService}>
                <select onChange={(e) => setSelectedCar(e.target.value)} required>
                    <option value="">Select Your Car</option>
                    {cars.map((car) => (
                        <option key={car._id} value={car._id}>{car.model_name}</option>
                    ))}
                </select>
                
                <select onChange={(e) => setServiceType(e.target.value)} required>
                    <option value="">Select Service Type</option>
                    <option value="Oil Change">Oil Change</option>
                    <option value="Tire Check">Tire Check</option>
                    <option value="Battery Replacement">Battery Replacement</option>
                    <option value="Engine Repair">Engine Repair</option>
                    <option value="General Service">General Service</option>
                </select>

                <input type="date" onChange={(e) => setServiceDate(e.target.value)} required />
                <input type="text" placeholder="Service Center" onChange={(e) => setServiceCenter(e.target.value)} required />

                <button type="submit">Book Service</button>
            </form>

            {/* Display Booked Services */}
            <h3>Your Booked Services</h3>
            <ul className="booked-services">
                {services.map((service) => (
                    <li key={service._id}>
                        <strong>{service.serviceType}</strong> for <em>{service.car.model_name}</em> on {new Date(service.serviceDate).toLocaleDateString()}  
                        - <span>{service.status}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ServicePage;
