import dbConnect from './src/lib/db.js';
import Candidate from './src/models/Candidate.js';
import mongoose from 'mongoose';

const candidates = [
  {
    name: "John Doe",
    party: "Progressive Party",
    manifesto: "Building a better future for everyone through technology and education.",
    color: "#3b82f6",
    symbol: "🚀"
  },

  // heyy 
  {
    name: "Jane Smith",
    party: "Unity Coalition",
    manifesto: "Focusing on community growth and sustainable development.",
    color: "#10b981",
    symbol: "🤝"
  },
  {
    name: "Michael Johnson",
    party: "Liberty Alliance",
    manifesto: "Fighting for individual freedoms and economic prosperity for all citizens.",
    color: "#ef4444",
    symbol: "🗽"
  },
  {
    name: "Emily Davis",
    party: "Forward Progress",
    manifesto: "Empowering the next generation through education reform and student support.",
    color: "#8b5cf6",
    symbol: "📈"
  },
  {
    name: "David Chen",
    party: "Tech Unity",
    manifesto: "Leveraging technology to create a more efficient and transparent government.",
    color: "#06b6d4",
    symbol: "💻"
  },
  {
    name: "Maria Garcia",
    party: "Community First",
    manifesto: "Strengthening our neighborhoods and supporting local small businesses.",
    color: "#ec4899",
    symbol: "🏠"
  },
  {
    name: "James Wilson",
    party: "Heritage Party",
    manifesto: "Preserving our traditions while building a stable foundation for the future.",
    color: "#64748b",
    symbol: "🏛️"
  }
];

async function seed() {
  try {
    console.log('🔄 Connecting to database...');
    await dbConnect();
    
    // Clear existing candidates
    await Candidate.deleteMany({});
    console.log('🗑️  Cleared existing candidates');
    
    // Insert new candidates
    await Candidate.insertMany(candidates);
    console.log('✅ Sample candidates inserted successfully');
    
    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();
