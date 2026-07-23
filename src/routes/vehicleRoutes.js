const express = require('express');
const { body, validationResult } = require('express-validator');
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

/**
 * Reusable middleware to return 400 with all validation errors (Issue 8)
 */
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
  }
  next();
};

const vehicleValidators = [
  body('make').trim().notEmpty().withMessage('Make is required'),
  body('model').trim().notEmpty().withMessage('Model is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a non-negative number'),
  body('quantity').isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer'),
];

router.get('/search', protect, searchVehicles);

router.route('/')
  .post(protect, vehicleValidators, handleValidation, createVehicle)
  .get(protect, getVehicles);

router.post('/:id/purchase', protect, purchaseVehicle);
router.post(
  '/:id/restock',
  protect,
  admin,
  [body('quantity').isInt({ min: 1 }).withMessage('Restock quantity must be a positive integer')],
  handleValidation,
  restockVehicle
);

router.route('/:id')
  .put(protect, updateVehicle)
  .delete(protect, admin, deleteVehicle);

module.exports = router;
