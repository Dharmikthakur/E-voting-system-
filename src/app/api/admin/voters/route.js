import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { isAdmin } from '@/lib/auth';

export async function GET(req) {
  try {
    if (!(await isAdmin(req))) {
      return NextResponse.json({ message: 'Access Denied' }, { status: 403 });
    }

    await dbConnect();
    const voters = await User.find({ role: 'voter' })
      .select('-password')
      .populate('votedFor', 'name party')
      .sort({ createdAt: -1 });

    return NextResponse.json(voters);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}
