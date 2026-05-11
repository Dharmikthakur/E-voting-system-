import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Candidate from '@/models/Candidate';
import { isAdmin } from '@/lib/auth';

export async function POST(req) {
  try {
    if (!(await isAdmin(req))) {
      return NextResponse.json({ message: 'Access Denied' }, { status: 403 });
    }

    await dbConnect();
    const { name, party, manifesto, color, symbol } = await req.json();

    const newCandidate = new Candidate({ name, party, manifesto, color, symbol });
    const candidate = await newCandidate.save();

    return NextResponse.json(candidate);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}
