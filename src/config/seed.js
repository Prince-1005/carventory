require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');

/**
 * Seed script: Creates the one admin account in the database.
 * Run once with:  npm run seed
 *
 * If the admin already exists it will skip creation safely (idempotent).
 */
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_EMAIL    = process.env.ADMIN_EMAIL    || 'admin@carventory.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@123!';

async function seed() {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/carventory';
    await mongoose.connect(uri);
    console.log('✅  Connected to MongoDB');

    const existing = await User.findOne({ email: ADMIN_EMAIL });
    if (existing) {
      console.log(`ℹ️   Admin already exists (${ADMIN_EMAIL}) — skipping creation.`);
    } else {
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
      const admin = new User({
        username: ADMIN_USERNAME,
        email:    ADMIN_EMAIL,
        password: hashedPassword,
        role:     'admin',
      });
      await admin.save();
      console.log(`🎉  Admin account created:`);
      console.log(`     Email:    ${ADMIN_EMAIL}`);
      console.log(`     Password: ${ADMIN_PASSWORD}`);
      console.log(`\n⚠️   Change the admin password in production via ADMIN_PASSWORD env var.`);
    }

    const Vehicle = require('../models/Vehicle');
    await Vehicle.deleteMany({});
    console.log('ℹ️   Cleared existing vehicles. Seeding demo vehicles...');
    const demoVehicles = [
      { make: 'Porsche', model: '911 GT3 RS', category: 'Supercar', price: 241300, quantity: 3 },
      { make: 'Tesla', model: 'Model S Plaid', category: 'Electric', price: 89990, quantity: 5 },
      { make: 'BMW', model: 'M5 Competition', category: 'Executive Sedan', price: 120500, quantity: 2 },
      { make: 'Mercedes-Benz', model: 'AMG GT 63 S E Performance', category: 'Gran Turismo', price: 194900, quantity: 1 },
      { make: 'Audi', model: 'RS e-tron GT', category: 'Electric', price: 147100, quantity: 4 },
      { make: 'Ferrari', model: '296 GTB', category: 'Supercar', price: 338250, quantity: 0 },
      { make: 'Range Rover', model: 'SV Long Wheelbase', category: 'Luxury SUV', price: 234000, quantity: 3 },
      { make: 'Aston Martin', model: 'DB12 Coupe', category: 'Gran Turismo', price: 245000, quantity: 2 }
    ];
    await Vehicle.insertMany(demoVehicles);
    console.log(`🎉  Seeded ${demoVehicles.length} demo vehicles into the database.`);

  } catch (err) {
    console.error('❌  Seed failed:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
