import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Candidate from '@/models/Candidate';

export async function GET() {
  try {
    await dbConnect();
    const candidates = await Candidate.find().sort({ createdAt: -1 });
    return NextResponse.json(candidates);
  } catch (err) {
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}
