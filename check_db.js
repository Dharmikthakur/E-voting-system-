import dbConnect from './src/lib/db.js';
import Candidate from './src/models/Candidate.js';
import mongoose from 'mongoose';

async function check() {
  await dbConnect();
  const count = await Candidate.countDocuments();
  console.log(`Total candidates: ${count}`);
  const all = await Candidate.find({}, 'name');
  console.log('Names:', all.map(c => c.name));
  mongoose.connection.close();
}

check();
