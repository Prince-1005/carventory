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

const updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    Object.assign(vehicle, req.body);
    const updatedVehicle = await vehicle.save();
    res.status(200).json({ message: 'Vehicle updated', vehicle: updatedVehicle });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    await vehicle.deleteOne();
    res.status(200).json({ message: 'Vehicle removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const purchaseVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    if (vehicle.quantity <= 0) {
      return res.status(400).json({ message: 'Vehicle out of stock' });
    }

    vehicle.quantity -= 1;
    await vehicle.save();

    res.status(200).json({ message: 'Vehicle purchased successfully', vehicle });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const restockVehicle = async (req, res) => {
  try {
    const { quantity } = req.body;
    if (!quantity || quantity <= 0) {
      return res.status(400).json({ message: 'Invalid restock quantity' });
    }

    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    vehicle.quantity += Number(quantity);
    await vehicle.save();

    res.status(200).json({ message: 'Vehicle restocked successfully', vehicle });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createVehicle,
  getVehicles,
  searchVehicles,
  updateVehicle,
  deleteVehicle,
  purchaseVehicle,
  restockVehicle
};
