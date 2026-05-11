import { NextResponse } from 'next/server';
import { getSetting } from '@/lib/settings';

export async function GET() {
  try {
    const open = await getSetting('electionOpen', true);
    return NextResponse.json({ open });
  } catch (err) {
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}
