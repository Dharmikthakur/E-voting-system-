import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Candidate from '@/models/Candidate';
import { getSetting } from '@/lib/settings';

export async function GET() {
  try {
    await dbConnect();
    const candidates = await Candidate.find().sort({ voteCount: -1 });
    const totalVotes = candidates.reduce((acc, c) => acc + c.voteCount, 0);
    const electionOpen = await getSetting('electionOpen', true);
    
    return NextResponse.json({ candidates, totalVotes, electionOpen });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}
