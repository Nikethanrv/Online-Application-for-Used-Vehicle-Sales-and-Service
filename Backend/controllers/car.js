const Car = require('../models/car_model');

// For a user to register their car for sale (NEED TO AUTOFILL NAME AND LOCATION IN UI ITSELF AND MAKE IT NON EDITABLE)
const registerCar = (req, res, next) => {
    Car.findOne({ 'seller_details.name': req.body.seller_details.name, model_name: req.body.model_name })
    .then(existingName => {
        if (existingName) {
            return res.json({
                message: 'Model already registered'
            });
        }
        let car = new Car({
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
        });

        car.save()
        .then(response => {
            res.json({
                message: "Registered successfully"
            });
        })
        .catch(error => {
            res.json({
                message: "An error occurred while saving the car details"
            });
        });
    })
    .catch(error => {
        res.json({
            message: "An error occurred while checking the car details"
        });
    });
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
    registerCar,
    updateCar,
    deleteCar
};