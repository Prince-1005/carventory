const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  make:        { type: String, required: true, trim: true },
  model:       { type: String, required: true, trim: true },
  year:        { type: Number },
  category:    { type: String, required: true, trim: true },
  price:       { type: Number, required: true, min: 0 },
  quantity:    { type: Number, required: true, min: 0 },
  imageUrl:    { type: String, trim: true },
  description: { type: String, trim: true },
  specs: {
    horsepower:   { type: Number },
    acceleration: { type: String, trim: true },
    transmission: { type: String, trim: true },
    fuelType:     { type: String, trim: true },
    topSpeed:     { type: String, trim: true },
  }
}, { timestamps: true });

// Compound index on the fields used by searchVehicles (Issue 10)
vehicleSchema.index({ make: 1, model: 1, category: 1, price: 1 });

module.exports = mongoose.model('Vehicle', vehicleSchema);
