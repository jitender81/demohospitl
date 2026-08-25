// Save as: api/_lib/models.ts
import mongoose, { Schema } from 'mongoose';

// ---------- User ----------
const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ['patient', 'doctor', 'reception', 'department', 'admin', 'superadmin'],
      required: true,
    },
    hospital_id: { type: String, required: true },
    phone: { type: String },
  },
  { timestamps: true }
);

// Reuse the model if it's already compiled (avoids "model overwrite" errors
// during Vercel's hot function reuse).
export const User = mongoose.models.User || mongoose.model('User', UserSchema);

// ---------- ChatMessage ----------
const ChatMessageSchema = new Schema(
  {
    patientId: { type: String, required: true, index: true },
    sender: { type: String, enum: ['patient', 'reception'], required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true } // gives us createdAt automatically
);

export const ChatMessage =
  mongoose.models.ChatMessage || mongoose.model('ChatMessage', ChatMessageSchema);


const OtpSchema = new Schema({
  phone: { type: String, required: true, index: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

export const Otp = mongoose.models.Otp || mongoose.model('Otp', OtpSchema);