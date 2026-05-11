import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Candidate from '@/models/Candidate';
import Settings from '@/models/Settings';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    await dbConnect();

    // 1. Clear existing data (Optional, but ensures a clean seed)
    await User.deleteMany({});
    await Candidate.deleteMany({});
    await Settings.deleteMany({});

    // 2. Create Admin User
    const adminSalt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', adminSalt);
    await User.create({
      name: 'System Admin',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'admin'
    });

    // 4. Create Candidates
    const candidates = await Candidate.create([
      {
        name: 'Alexander Reed',
        party: 'Liberty Alliance',
        manifesto: 'Focusing on individual freedom and economic growth.',
        color: '#3b82f6',
        symbol: '🦅'
      },
      {
        name: 'Sarah Jenkins',
        party: 'Green Progress',
        manifesto: 'Sustainability and renewable energy for all.',
        color: '#10b981',
        symbol: '🌿'
      },
      {
        name: 'Robert Chen',
        party: 'Unity Party',
        manifesto: 'Building bridges and social security for every citizen.',
        color: '#ef4444',
        symbol: '🤝'
      }
    ]);

    // 5. Create Sample Voters & Cast Votes
    const voterSalt = await bcrypt.genSalt(10);
    const voterPassword = await bcrypt.hash('voter123', voterSalt);
    
    const voters = [
      { name: 'John Doe', email: 'john@example.com', password: voterPassword, role: 'voter', voteForIdx: 0 },
      { name: 'Jane Smith', email: 'jane@example.com', password: voterPassword, role: 'voter', voteForIdx: 1 },
      { name: 'Alice Brown', email: 'alice@example.com', password: voterPassword, role: 'voter', voteForIdx: 1 },
      { name: 'Michael Scott', email: 'michael@example.com', password: voterPassword, role: 'voter', voteForIdx: 2 },
      { name: 'Pam Beesly', email: 'pam@example.com', password: voterPassword, role: 'voter', voteForIdx: 1 }
    ];

    for (const v of voters) {
      const newUser = await User.create({
        name: v.name,
        email: v.email,
        password: v.password,
        role: v.role,
        hasVoted: true,
        votedAt: new Date(),
        votedFor: candidates[v.voteForIdx]._id
      });
      
      // Increment candidate vote count
      await Candidate.findByIdAndUpdate(candidates[v.voteForIdx]._id, { $inc: { voteCount: 1 } });
    }

    // 6. Initialize Settings
    await Settings.create({ key: 'electionOpen', value: true });

    return NextResponse.json({ 
      message: 'Database seeded with 5 votes cast!', 
      admin: 'admin@example.com / admin123',
      voters: 'voter123 password for all sample accounts'
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Seeding failed', error: err.message }, { status: 500 });
  }
}
