import jwt from 'jsonwebtoken';
import User from '@/models/User';
import dbConnect from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

export async function verifyToken(req) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) return null;

  const token = authHeader.split(' ')[1] || authHeader;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded.user;
  } catch (err) {
    return null;
  }
}

export async function isAdmin(req) {
  await dbConnect();
  const userData = await verifyToken(req);
  if (!userData) return false;

  const user = await User.findById(userData.id);
  return user && user.role === 'admin';
}

export function generateToken(user) {
  const payload = { user: { id: user.id } };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '100d' });
}
