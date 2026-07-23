const Vehicle = require('../models/Vehicle');

const createVehicle = async (req, res) => {
  try {
    const { make, model, category, price, quantity } = req.body;

    const newVehicle = new Vehicle({
      make,
      model,
      category,
      price,
      quantity
    });

    await newVehicle.save();

    res.status(201).json({
      message: 'Vehicle created successfully',
      vehicle: newVehicle
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({});
    res.status(200).json({ vehicles });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const searchVehicles = async (req, res) => {
  try {
    const { make, model, category, minPrice, maxPrice } = req.query;
    
    let query = {};
    if (make) query.make = new RegExp(make, 'i');
    if (model) query.model = new RegExp(model, 'i');
    if (category) query.category = new RegExp(category, 'i');
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const vehicles = await Vehicle.find(query);
    res.status(200).json({ vehicles });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createVehicle,
  getVehicles,
  searchVehicles
};
