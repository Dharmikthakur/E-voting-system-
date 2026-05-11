import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Candidate from '@/models/Candidate';
import Vote from '@/models/Vote';
import { verifyToken } from '@/lib/auth';
import { getSetting } from '@/lib/settings';

export async function POST(req) {
  try {
    await dbConnect();
    const userData = verifyToken(req);
    if (!userData) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const electionOpen = await getSetting('electionOpen', true);
    if (!electionOpen) {
      return NextResponse.json({ message: 'Election is currently closed. Voting is not allowed.' }, { status: 400 });
    }

    const { candidateId } = await req.json();
    const userId = userData.id;

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    if (user.hasVoted) {
      return NextResponse.json({ message: 'You have already cast your vote' }, { status: 400 });
    }

    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return NextResponse.json({ message: 'Candidate not found' }, { status: 404 });
    }

    const vote = new Vote({
      user: userId,
      candidate: candidateId,
    });

    await vote.save();

    candidate.voteCount += 1;
    await candidate.save();

    user.hasVoted = true;
    user.votedAt = new Date();
    user.votedFor = candidateId;
    await user.save();

    return NextResponse.json({ message: 'Vote successfully cast', candidateName: candidate.name });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}
