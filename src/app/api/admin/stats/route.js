import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Candidate from '@/models/Candidate';
import { isAdmin } from '@/lib/auth';
import { getSetting } from '@/lib/settings';

export async function GET(req) {
  try {
    if (!(await isAdmin(req))) {
      return NextResponse.json({ message: 'Access Denied' }, { status: 403 });
    }

    await dbConnect();
    const totalRegistered = await User.countDocuments({ role: 'voter' });
    const totalVoted = await User.countDocuments({ role: 'voter', hasVoted: true });
    const totalCandidates = await Candidate.countDocuments();
    const turnout = totalRegistered > 0 ? Math.round((totalVoted / totalRegistered) * 100) : 0;
    const electionOpen = await getSetting('electionOpen', true);

    return NextResponse.json({ totalRegistered, totalVoted, totalCandidates, turnout, electionOpen });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}
