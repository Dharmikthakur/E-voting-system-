import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/auth';
import { setSetting } from '@/lib/settings';

export async function POST(req) {
  try {
    if (!(await isAdmin(req))) {
      return NextResponse.json({ message: 'Access Denied' }, { status: 403 });
    }

    await setSetting('electionOpen', true);
    return NextResponse.json({ message: 'Election is now OPEN', open: true });
  } catch (err) {
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}
