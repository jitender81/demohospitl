// Save as: api/chat/[patientId].ts
// Handles both:
//   GET  /api/chat/:patientId        -> list messages for that patient
//   POST /api/chat/:patientId        -> send a new message

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectToDatabase } from '../_lib/mongodb';
import { ChatMessage } from '../_lib/models';
import { verifyToken } from '../_lib/jwt';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { patientId } = req.query;

  if (!patientId || typeof patientId !== 'string') {
    return res.status(400).json({ detail: 'Missing patientId' });
  }

  // Basic auth check: require a valid token for reading/writing chat
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ detail: 'Invalid or missing token' });
  }

  try {
    await connectToDatabase();

    if (req.method === 'GET') {
      const messages = await ChatMessage.find({ patientId }).sort({ createdAt: 1 });
      return res.status(200).json(
        messages.map((m) => ({
          id: m._id.toString(),
          patientId: m.patientId,
          sender: m.sender,
          message: m.message,
          read: m.read,
          timestamp: m.get('createdAt'),
        }))
      );
    }

    if (req.method === 'POST') {
      const { sender, message } = req.body || {};
      if (!sender || !message) {
        return res.status(400).json({ detail: 'sender and message are required' });
      }

      const saved = await ChatMessage.create({ patientId, sender, message });

      return res.status(201).json({
        id: saved._id.toString(),
        patientId: saved.patientId,
        sender: saved.sender,
        message: saved.message,
        read: saved.read,
        timestamp: saved.get('createdAt'),
      });
    }

    return res.status(405).json({ detail: 'Method not allowed' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ detail: 'Server error handling chat' });
  }
}