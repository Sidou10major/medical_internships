require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

(async () => {
  // Connect to local MongoDB before starting the server
  await connectDB();
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
})();
