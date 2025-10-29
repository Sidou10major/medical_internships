const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log(`✅ Connected to local MongoDB at ${uri}`);
  } catch (err) {
    console.error('❌ Local MongoDB connection failed:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
