const express = require('express');
const { protect } = require('../middleware/auth');
const { createVehicle, getVehicles } = require('../controllers/vehicleController');

const router = express.Router();

router.route('/')
  .post(protect, createVehicle)
  .get(protect, getVehicles);

module.exports = router;
