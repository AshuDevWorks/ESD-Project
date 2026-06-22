require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const authRoutes = require('./routes/auth');
const stateRoutes = require('./routes/state');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ecosegregate';

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Database connection
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB.');
    seedDemoUser();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

// API Routes
app.use('/api', authRoutes);
app.use('/api', stateRoutes);

// Seeding standard demo user account
async function seedDemoUser() {
  try {
    const demoUsername = 'demo';
    const demoPassword = 'password123';
    const cleanUsername = demoUsername.toLowerCase();

    const existingUser = await User.findOne({ username: cleanUsername });
    if (!existingUser) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(demoPassword, salt);

      const demoUser = new User({
        username: cleanUsername,
        password: hashedPassword,
        state: {
          streak: 3,
          co2Offset: 4.8,
          waterSaved: 54.0,
          totalItemsLogged: 12,
          itemsCategorized: {
            organic: 4,
            recyclable: 6,
            hazardous: 1,
            landfill: 1
          },
          gameHighScore: 180,
          level: 2,
          xp: 150,
          scannedToday: 1,
          gameStreakMaxToday: 8,
          readMercuryThermometer: true,
          readCatalogIds: ['plastic_bottle', 'banana_peel', 'alkaline_battery', 'thermometer'],
          historyLogs: [0.5, 1.2, 2.0, 2.8, 3.4, 4.0, 4.8]
        }
      });

      await demoUser.save();
      console.log('----------------------------------------------------');
      console.log(`Demo user created successfully:`);
      console.log(`  Username: ${demoUsername}`);
      console.log(`  Password: ${demoPassword}`);
      console.log('----------------------------------------------------');
    }
  } catch (err) {
    console.error('Failed to seed demo user:', err);
  }
}

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong on the server' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`EcoSegregate backend API running on port ${PORT}`);
});
