const Vehicle = require('../models/Vehicle');

const createVehicle = async (req, res) => {
  try {
    const { make, model, year, category, price, quantity, imageUrl, description, specs } = req.body;

    const newVehicle = new Vehicle({ make, model, year, category, price, quantity, imageUrl, description, specs });
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
    // Optional pagination (Issue 11) — defaults keep existing tests green
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 20);
    const skip  = (page - 1) * limit;

    const [vehicles, total] = await Promise.all([
      Vehicle.find({}).skip(skip).limit(limit),
      Vehicle.countDocuments({}),
    ]);

    res.status(200).json({
      vehicles,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const searchVehicles = async (req, res) => {
  try {
    const { make, model, category, minPrice, maxPrice } = req.query;

    let query = {};
    if (make)     query.make     = new RegExp(make, 'i');
    if (model)    query.model    = new RegExp(model, 'i');
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

    // Explicit field whitelist — prevents mass-assignment vulnerability (Issue 4)
    const { make, model, year, category, price, quantity, imageUrl, description, specs } = req.body;
    if (make        !== undefined) vehicle.make        = make;
    if (model       !== undefined) vehicle.model       = model;
    if (year        !== undefined) vehicle.year        = year;
    if (category    !== undefined) vehicle.category    = category;
    if (price       !== undefined) vehicle.price       = price;
    if (quantity    !== undefined) vehicle.quantity    = quantity;
    if (imageUrl    !== undefined) vehicle.imageUrl    = imageUrl;
    if (description !== undefined) vehicle.description = description;
    if (specs       !== undefined) vehicle.specs       = specs;

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
