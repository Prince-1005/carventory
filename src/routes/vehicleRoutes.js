const express = require('express');
const { protect, admin } = require('../middleware/auth');
const { 
  createVehicle, 
  getVehicles, 
  searchVehicles, 
  updateVehicle, 
  deleteVehicle,
  purchaseVehicle,
  restockVehicle
} = require('../controllers/vehicleController');

const router = express.Router();

router.get('/search', protect, searchVehicles);

router.route('/')
  .post(protect, createVehicle)
  .get(protect, getVehicles);

router.post('/:id/purchase', protect, purchaseVehicle);
router.post('/:id/restock', protect, admin, restockVehicle);

router.route('/:id')
  .put(protect, updateVehicle)
  .delete(protect, admin, deleteVehicle);

module.exports = router;
