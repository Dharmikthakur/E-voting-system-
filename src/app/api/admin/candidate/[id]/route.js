import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Candidate from '@/models/Candidate';
import { isAdmin } from '@/lib/auth';

export async function DELETE(req, { params }) {
  try {
    if (!(await isAdmin(req))) {
      return NextResponse.json({ message: 'Access Denied' }, { status: 403 });
    }

    await dbConnect();
    const { id } = await params;
    await Candidate.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Candidate removed' });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}
