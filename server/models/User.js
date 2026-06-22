const mongoose = require('mongoose');

const stateSchema = new mongoose.Schema({
  streak: { type: Number, default: 0 },
  lastActionDate: { type: String, default: "" },
  co2Offset: { type: Number, default: 0.0 },
  waterSaved: { type: Number, default: 0.0 },
  totalItemsLogged: { type: Number, default: 0 },
  itemsCategorized: {
    organic: { type: Number, default: 0 },
    recyclable: { type: Number, default: 0 },
    hazardous: { type: Number, default: 0 },
    landfill: { type: Number, default: 0 }
  },
  gameHighScore: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  xp: { type: Number, default: 0 },
  scannedToday: { type: Number, default: 0 },
  gameStreakMaxToday: { type: Number, default: 0 },
  readMercuryThermometer: { type: Boolean, default: false },
  readCatalogIds: { type: [String], default: [] },
  historyLogs: { type: [Number], default: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0] }
}, { _id: false });

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  state: {
    type: stateSchema,
    default: () => ({})
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
