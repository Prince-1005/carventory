const express = require('express');
const { protect } = require('../middleware/auth');
const { createVehicle, getVehicles, searchVehicles } = require('../controllers/vehicleController');

const router = express.Router();

router.get('/search', protect, searchVehicles);

router.route('/')
  .post(protect, createVehicle)
  .get(protect, getVehicles);

module.exports = router;
