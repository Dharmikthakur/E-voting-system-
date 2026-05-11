import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/auth';
import { setSetting } from '@/lib/settings';

export async function POST(req) {
  try {
    if (!(await isAdmin(req))) {
      return NextResponse.json({ message: 'Access Denied' }, { status: 403 });
    }

    await setSetting('electionOpen', false);
    return NextResponse.json({ message: 'Election is now CLOSED', open: false });
  } catch (err) {
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}
