import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { getSetting } from '@/lib/settings';

export async function GET() {
  try {
    await dbConnect();
    const totalRegistered = await User.countDocuments({ role: 'voter' });
    const totalVoted = await User.countDocuments({ role: 'voter', hasVoted: true });
    const turnout = totalRegistered > 0 ? Math.round((totalVoted / totalRegistered) * 100) : 0;
    const electionOpen = await getSetting('electionOpen', true);
    
    return NextResponse.json({ totalRegistered, totalVoted, turnout, electionOpen });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}
