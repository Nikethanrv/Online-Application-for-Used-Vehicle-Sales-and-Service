const UserProfile = require('../models/user_model')

// For an user to register
const register = (req, res, next) => {
    UserProfile.findOne({uname: req.body.uname})
    .then(existingUname => {
        if(existingUname) {
            return res.json({
                message: 'Username already exists'
            })
        }
        let userProf = new UserProfile({
            uname: req.body.uname,
            pwd: req.body.pwd
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
    UserProfile.findOne({uname: req.body.uname, pwd: req.body.pwd})
    .then(validUser => {
        if (validUser) {
            res.json({
                message: "Successfully logged in"
            })
        }
        else {
            res.json({
                message: "Incorrect credentials. Try again."
            })
        }
    })
    .catch(error => {
        res.json({
            message: "An error occured"
        })
    })
}

// for an user to update his/her account details
const updateAcc = (req, res, next) => {
    let uname = req.body.uname
    let updatedData = {
        pwd: req.body.pwd
    }
    UserProfile.findOne({uname:uname})
    .then(unameExists => {
        if (unameExists) {
            UserProfile.findOneAndUpdate({uname: uname}, {$set: updatedData})
            .then(() => {
                res.json({
                    message: "Account updated successfully"
                })
            })
            .catch(error => {
                res.json({
                    message: "An error occured"
                })
            })
        }
        else {
            res.json({
                message: "Username doesnt exist"
            })
        }
    })
    .catch(error => {
        res.json({
            message: "An error occured while checking the username"
        })
    })
}

// for an user to delete his/her account
const deleteAcc = (req, res, next) => {
    UserProfile.findOneAndDelete({uname: req.body.uname, pwd: req.body.pwd})
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