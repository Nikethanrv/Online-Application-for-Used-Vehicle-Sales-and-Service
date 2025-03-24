const express = require('express')
const router = express.Router()

const car_sale = require('../controllers/car')

router.get('/', car_sale.fetchCars)
router.post('/reg', car_sale.registerCar)
router.post('/update', car_sale.updateCar)
router.post('/delete', car_sale.deleteCar)

module.exports = router