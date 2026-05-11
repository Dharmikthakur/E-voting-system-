import dbConnect from './src/lib/db.js';
import User from './src/models/User.js';
import mongoose from 'mongoose';

async function check() {
  await dbConnect();
  const count = await User.countDocuments();
  console.log(`Total users: ${count}`);
  const all = await User.find({}, 'name email role');
  console.log('Users:', all);
  mongoose.connection.close();
}

check();
