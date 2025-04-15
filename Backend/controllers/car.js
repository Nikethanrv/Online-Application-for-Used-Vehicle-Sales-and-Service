const Car = require('../models/car_model');


const fetchCars = async (req, res, next) => {
    const seller_id = req.query.userId
    try {
        if (seller_id) {
            const docs = await Car.find({seller_id: {$ne : seller_id}}, { __v: 0, createdAt: 0, updatedAt: 0})
            res.json(docs)
        }
    } catch (error) {
        res.status(500).json({
            message: "Internal server error: " + error
        })
    }
}

// To get Seller's listings
const fetchListings = async (req, res, next) => {
    const seller_id = req.query.userId
    try {
        if (seller_id) {
            const listings = await Car.find({ seller_id: seller_id })
            res.status(200).json(listings)
        }
    } catch (error) {
        console.error("Error fetching listings:", error)
        res.status(500).json({
            message: "Failed to fetch listings"
        })
    }
}

// To get Car details by ID
const fetchCarDetails = async (req, res, next) => {
    const car_id = req.query.car_id
    try {
        if (car_id) {
            const listings = await Car.findById({ _id: car_id })
            res.status(200).json(listings)
        }
    } catch (error) {
        console.error("Error fetching listings:", error)
        res.status(500).json({
            message: "Failed to fetch listings"
        })
    }
}
//
const registerCar = (req, res, next) => {
        Car.findOne({ make: req.body.make, model: req.body.model, year: req.body.year })
        .then(ExistingCar => {
            if(ExistingCar) {
                return res.status(409).json({
                    message: 'Car is already listed!'
                })
            }
            else {
                const car = new Car({
                    make: req.body.make,
                    model: req.body.model,
                    year: req.body.year,
                    mileage: req.body.mileage,
                    transmission: req.body.transmission,
                    fuelType: req.body.fuelType,
                    condition: req.body.condition,
                    price: req.body.price,
                    image: req.body.image,
                    name: req.body.name,
                    phone: req.body.phone,
                    email: req.body.email,
                    location: req.body.location,
                    seller_id: req.body.seller_id
                });

                car.save()
                .then(response => {
                    res.json({
                        message: "Car registered successfully for sale"
                    })
                })
                .catch(error => {
                    res.json({
                        message: "An error occurred: " + error
                    })
                })
            }
        })
        .catch(error => {
            console.error("Error registering car:", error);
            res.status(500).json({ message: "Internal server error: " + error.message });
        })
};

const updateCar = async (req, res, next) => {
    const carId = req.query.carId;

    // 1. Validate carId
    if (!carId) {
        return res.status(400).json({ message: "Car ID is required" });
    }

    try {
        // 2. Construct updatedData object.  Handle missing fields.
        const updatedData = {
            make: req.body.make,
            model: req.body.model,
            year: req.body.year,
            transmission: req.body.transmission,
            fuelType: req.body.fuelType,
            condition: req.body.condition,
            price: req.body.price,
            image: req.body.image
        };

        // Remove any undefined values from updatedData
        Object.keys(updatedData).forEach(key => {
            if (updatedData[key] === undefined) {
                delete updatedData[key];
            }
        });

        // 3. Check if the car exists
        const existingCar = await Car.findOne({ _id: carId });  // Use await with promises
        if (!existingCar) {
            return res.status(404).json({ message: "Car not found" });
        }

        // 4. Update the car
        const updatedCar = await Car.findOneAndUpdate({ _id: carId }, { $set: updatedData }, { new: true }); // "new: true" returns the updated document

        // 5. Respond with the updated car
        res.status(200).json({
            message: "Car details updated successfully",
            data: updatedCar // Optionally return the updated car data
        });

    } catch (error) {
        // 6. Handle errors properly
        console.error("Error updating car:", error); // Log the error for debugging
        if (error.name === 'CastError') {
            return res.status(400).json({ message: "Invalid Car ID format" });
        }
        res.status(500).json({ message: "Internal server error", error: error.message }); // Include the error message
    }
};


const deleteCar = (req, res, next) => {
    Car.findOneAndDelete({ 'seller_details.name': req.body.seller_details.name, model_name: req.body.model_name })
    .then(validCreds => {
        if (validCreds) {
            res.json({
                message: "Car details deleted successfully"
            });
        } else {
            res.json({
                message: "Invalid input"
            });
        }
    })
    .catch(error => {
        res.json({
            message: "An error occurred while deleting the car details"
        });
    });
};

module.exports = {
    fetchCars,
    registerCar,
    updateCar,
    deleteCar,
    fetchListings,
    fetchCarDetails
};