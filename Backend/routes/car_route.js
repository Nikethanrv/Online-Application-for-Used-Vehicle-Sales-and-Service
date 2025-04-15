const express = require('express')
const router = express.Router()

const car_sale = require('../controllers/car')

router.get('/', car_sale.fetchCars)
router.post('/reg', car_sale.registerCar)
router.put('/update', car_sale.updateCar)
router.post('/delete', car_sale.deleteCar)
router.get('/listings', car_sale.fetchListings)
router.get('/carDetails', car_sale.fetchCarDetails)

module.exports = router