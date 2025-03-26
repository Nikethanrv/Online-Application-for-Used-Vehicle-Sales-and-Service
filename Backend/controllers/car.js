const Car = require('../models/car_model');

// For a user to register their car for sale (NEED TO AUTOFILL NAME AND LOCATION IN UI ITSELF AND MAKE IT NON EDITABLE)

const fetchCars = async (req, res, next) => {
    try {
        const docs = await Car.find({}, {_id:0, __v: 0, createdAt: 0, updatedAt: 0})
        res.json(docs)
    } catch (error) {
        res.status(500).json({
            message: "Internal server error: " + error
        })
    }
}

const registerCar = async (req, res, next) => {
    try {
        /*
        const = await Car.findOne({ id: req.body.id })
        if () {
            return res.status(400).json({
                message: "Car is already registered"
            })
        }*/
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
            location: req.body.location
        });

        await car.save()
        res.status(201).json({
            message: "Car registered successfully for sale"
        })
    } catch (error) {
        console.error("Error registering car:", error);
        res.status(500).json({ message: "Internal server error: " + error.message });
    }
};

// For a user to update his/her car (that is to be sold) details (AUTOFILL NAME AND LOCATION - Set Non editable) -- Need Update Button
const updateCar = (req, res, next) => {
    let updatedData = {
        model_name: req.body.model_name,
        price: req.body.price,
        mileage: req.body.mileage,
        specs: {
            fuel_type: req.body.specs.fuel_type,
            transmission: req.body.specs.transmission
        },
        seller_details: {
            name: req.body.seller_details.name,
            location: req.body.seller_details.location
        }
    };
    Car.findOne({ model_name: req.body.model_name, 'seller_details.name': req.body.seller_details.name })
    .then(modelExists => {
        if (modelExists) {
            Car.findOneAndUpdate({ model_name: req.body.model_name, 'seller_details.name': req.body.seller_details.name }, { $set: updatedData })
            .then(() => {
                res.json({
                    message: "Car details updated successfully"
                });
            })
            .catch(error => {
                res.json({
                    message: "An error occurred while updating the car details"
                });
            });
        } else {
            res.json({
                message: "Car model hasn't been registered"
            });
        }
    })
    .catch(error => {
        res.json({
            message: "An error occurred while checking the car details"
        });
    });
};

// For a user to delete his/her car details (AUTOFILL NAME AND LOCATION - Set Non-editable) -- Need Delete Button
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
    deleteCar
};