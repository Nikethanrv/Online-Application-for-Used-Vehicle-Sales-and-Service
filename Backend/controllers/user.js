const UserProfile = require('../models/user_model')
const jwt = require('jsonwebtoken')
// For an user to register
const register = (req, res) => {
    UserProfile.findOne({email: req.body.email})
    .then(existingEmail => {
        if(existingEmail) {
            return res.json({
                message: 'Email already exists'
            })
        }
        let userProf = new UserProfile({
            full_name: req.body.full_name,
            email: req.body.email,
            password: req.body.password,
            phone_number: req.body.phone_number,
            address: {
                street: req.body.address.street,
                city: req.body.address.city,
                state: req.body.address.state,
                zip_code: req.body.zip_code
            }
        })
        
        userProf.save()
        .then(response => {
            res.json({
                message: "Registered successfully"
            })
        })
        .catch(error => {
            res.json({
                message: "An error occured"
            })
        })
    })
    .catch(error => {
        res.json({
            message: "An error occured"
        })
    })
}

// for user to login
const login = (req, res, next) => {
    UserProfile.findOne({email: req.body.email, password: req.body.password})
    .then(validUser => {
        if (!validUser) {
            return res.json({
                message: 'Incorrect credentials. Try again.'
            })
        }
        const token = jwt.sign({ userId: validUser._id, full_name: validUser.full_name }, 'super-top-secret-key')
        res.json({
            message: "Successfully logged in", 
            token: token
        })
    })
    .catch(error => {
        res.json({
            message: "An error occured during login"
        })
    })
}

// for an user to update his/her account details
const updateAcc = (req, res, next) => {
    let email = req.body.email
    let password = req.body.password
    let updatedData = {
        full_name: req.body.full_name,
        phone_number: req.body.phone_number,
        address: {
            street: req.body.address.street,
            city: req.body.address.city,
            state: req.body.address.state,
            zip_code: req.body.zip_code
        }
    }
    UserProfile.findOne({email:email, password: password})
    .then(emailExists => {
        if (emailExists) {
            UserProfile.findOneAndUpdate({email: email}, {$set: updatedData})
            .then(() => {
                res.json({
                    message: "Account updated successfully"
                })
            })
            .catch(error => {
                res.json({
                    message: "An error occurred while updating the account"
                })
            })
        }
        else {
            res.json({
                message: "Incorrect credentials"
            })
        }
    })
    .catch(error => {
        res.json({
            message: "An error occured while checking the email and password"
        })
    })
}

// for an user to delete his/her account
const deleteAcc = (req, res, next) => {
    UserProfile.findOneAndDelete({email: req.body.email, password: req.body.password})
    .then(validCreds => {
        if (validCreds) {
            res.json({
                message: "Account deleted successfully"
            })
        }
        else {
            res.json({
                message: "Invalid credentials"
            })
        }
    })
    .catch(error => {
        res.json({
            message: "An error occured"
        })
    })
}

module.exports = {
    register, login, updateAcc, deleteAcc
}