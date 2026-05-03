const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Candidate = require('./models/Candidate');

dotenv.config();

const candidates = [
  { name: 'Alice Smith', party: 'Progressive Party', manifesto: 'Better healthcare and education for all.' },
  { name: 'Bob Jones', party: 'Conservative Party', manifesto: 'Lower taxes and stronger economy.' },
  { name: 'Carol Williams', party: 'Green Party', manifesto: 'Focus on renewable energy and climate change.' }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/evoting');
    console.log('MongoDB Connected');
    
    await Candidate.deleteMany();
    await Candidate.insertMany(candidates);
    
    console.log('Database seeded with candidates');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();
