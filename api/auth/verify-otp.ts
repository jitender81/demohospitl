// Save as: api/auth/verify-otp.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectToDatabase } from '../_lib/mongodb';
import { Otp, User } from '../_lib/models';
import { signToken } from '../_lib/jwt';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ detail: 'Method not allowed' });
  }

  const { phone, otp } = req.body || {};
  const cleanPhone = (phone || '').replace(/[^0-9]/g, '').slice(-10);

  if (cleanPhone.length !== 10 || !otp) {
    return res.status(400).json({ detail: 'Phone number and OTP are required' });
  }

  try {
    await connectToDatabase();

    const record = await Otp.findOne({ phone: cleanPhone });

    if (!record) {
      return res.status(400).json({ detail: 'No OTP request found for this number. Please request a new OTP.' });
    }

    if (record.expiresAt.getTime() < Date.now()) {
      return res.status(400).json({ detail: 'This OTP has expired. Please request a new one.' });
    }

    if (record.otp !== otp) {
      return res.status(400).json({ detail: 'Incorrect OTP. Please try again.' });
    }

    // OTP is valid — delete it so it can't be reused
    await Otp.deleteOne({ _id: record._id });

    // Find existing patient by phone
    const user = await User.findOne({ phone: cleanPhone, role: 'patient' });

    if (!user) {
      return res.status(404).json({
        detail: `No patient registered with mobile number +91 ${cleanPhone}. Please sign up first.`,
      });
    }

    const token = signToken({ sub: user.email, role: user.role });

    return res.status(200).json({
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
        hospital_id: user.hospital_id,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ detail: 'Server error verifying OTP' });
  }
}