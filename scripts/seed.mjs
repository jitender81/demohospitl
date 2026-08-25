// Save as: scripts/seed.mjs
// Run locally once with: node scripts/seed.mjs
// Requires MONGODB_URI to be set in your local .env file (not committed to git).

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Missing MONGODB_URI in your .env file');
  process.exit(1);
}

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true, lowercase: true },
    passwordHash: String,
    role: String,
    hospital_id: String,
    phone: String,
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB Atlas');

  const passwordHash = await bcrypt.hash('Test@1234', 10);

  const existing = await User.findOne({ email: 'reception@pulsehealth.in' });
  if (existing) {
    console.log('Demo reception user already exists, skipping.');
  } else {
    await User.create({
      name: 'Demo Reception',
      email: 'reception@pulsehealth.in',
      passwordHash,
      role: 'reception',
      hospital_id: 'hosp-delhi-01',
      phone: '9876543210',
    });
    console.log('Created demo reception user: reception@pulsehealth.in / Test@1234');
  }

  const existingPatient = await User.findOne({ email: 'patient@pulsehealth.in' });
  if (existingPatient) {
    console.log('Demo patient user already exists, skipping.');
  } else {
    await User.create({
      name: 'Demo Patient',
      email: 'patient@pulsehealth.in',
      passwordHash,
      role: 'patient',
      hospital_id: 'hosp-delhi-01',
      phone: '9876543211',
    });
    console.log('Created demo patient user: patient@pulsehealth.in / Test@1234');
  }

  await mongoose.disconnect();
  console.log('Done.');
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
