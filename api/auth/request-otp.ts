// Save as: api/auth/request-otp.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectToDatabase } from '../_lib/mongodb';
import { Otp } from '../_lib/models';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ detail: 'Method not allowed' });
  }

  const { phone } = req.body || {};
  const cleanPhone = (phone || '').replace(/[^0-9]/g, '').slice(-10);

  if (cleanPhone.length !== 10) {
    return res.status(400).json({ detail: 'Please provide a valid 10-digit mobile number' });
  }

  try {
    await connectToDatabase();

    // Generate a real random 6-digit OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Replace any previous unexpired OTP for this phone with the new one
    await Otp.findOneAndUpdate(
      { phone: cleanPhone },
      { phone: cleanPhone, otp: generatedOtp, expiresAt },
      { upsert: true, new: true }
    );

    // TODO: this is where the real WhatsApp Business API send call goes later.
    // For now, we return the OTP directly in the response so you can test end-to-end.
    console.log(`OTP for ${cleanPhone}: ${generatedOtp}`);

    return res.status(200).json({
      success: true,
      message: 'OTP generated (WhatsApp sending not yet wired up — shown here for testing)',
      otp: generatedOtp, // remove this field once real WhatsApp sending is in place
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ detail: 'Server error generating OTP' });
  }
}