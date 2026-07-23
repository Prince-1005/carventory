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
      await mongoose.disconnect();
      process.exit(0);
    }

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
  } catch (err) {
    console.error('❌  Seed failed:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
