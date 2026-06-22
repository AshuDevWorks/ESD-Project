# EcoSegregate 🌍♻️

A gamified waste segregation assistant that leverages AI and machine learning to help users properly classify and manage waste. EcoSegregate educates users about waste segregation while tracking their environmental impact and providing engaging game mechanics to encourage sustainable behavior.

---

## 🎯 Project Overview

EcoSegregate is a full-stack web application designed to combat climate change by promoting proper waste segregation. The platform uses AI-powered image recognition, gamification, and educational tools to make waste management engaging and impactful.

**Mission:** Help users reduce landfill waste, conserve resources, and track their positive environmental contributions.

---

## ✨ Key Features

### 1. **AI Scanner Module**
- 📸 Real-time camera-based waste recognition using TensorFlow/MobileNet
- Instant classification of waste items into categories:
  - 🌱 Organic (compostable)
  - ♻️ Recyclable (plastics, metals, paper)
  - ⚠️ Hazardous (e-waste, batteries, chemicals)
  - 🗑️ Landfill (non-recyclable)
- Manual correction capability for AI misclassifications
- Drag-and-drop image upload support
- Real-time scanning status indicators

### 2. **Gamified Bin Drop Game**
- 🎮 Interactive sorting game with falling waste items
- Progressive difficulty levels with increasing speed
- Lives system (3 lives per game)
- Streak tracking (bonus multipliers for consecutive correct sorts)
- High score leaderboard integration
- Audio feedback and visual feedback
- Real-time score and statistics display

### 3. **Dashboard & Daily Quests**
- 📊 Central hub with key metrics and progress overview
- **Daily Quests:**
  - Complete 3 AI scans
  - Achieve 10-streak in the sorting game
  - Read about hazardous waste (mercury thermometer)
- Environmental impact metrics:
  - CO₂ offset tracking
  - Water saved calculation
  - Diversion rate analysis
- 7-day activity history graph
- Rotating eco tips and educational content

### 4. **Waste Catalog & Education**
- 📚 Comprehensive database of 50+ waste items with detailed information
- Filterable by waste category (organic, recyclable, hazardous, landfill)
- Interactive learning cards with:
  - Item name and category
  - Proper disposal instructions
  - Environmental impact facts
  - Recycling/composting tips
- Search functionality
- Achievement tracking for catalog exploration

### 5. **Analytics & Achievements**
- 📈 Detailed statistics dashboard showing:
  - Total items logged
  - Items per category breakdown
  - Diversion rate (% diverted from landfills)
  - XP points and level progression
  - Current streak status
- 🏆 Achievement system with multiple badges:
  - Recycle Rookie (1 recyclable item)
  - Compost Master (5+ organic items)
  - Hazard Control (3+ hazardous items)
  - E-Waste Warrior (5+ electronic items)
  - Streak Champion (50+ day streak)
  - Mercury Master (hazard knowledge)
  - Scanner Expert (10+ AI scans)
  - Game Master (high score achievement)

### 6. **User Authentication & Progress Saving**
- 🔐 Secure user registration and login
- JWT-based authentication with 7-day session persistence
- Password encryption using bcryptjs
- Persistent user state storage via MongoDB
- Automatic local fallback storage
- Cookie-based session management

---

## 🏗️ Project Structure

```
ESD_01/
├── client/                          # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── AIScanner.jsx       # Camera-based waste recognition
│   │   │   ├── Analytics.jsx       # Stats and achievements
│   │   │   ├── AuthOverlay.jsx     # Login/register interface
│   │   │   ├── BinDropGame.jsx     # Gamified sorting game
│   │   │   ├── Dashboard.jsx       # Main dashboard with quests
│   │   │   └── WasteCatalog.jsx    # Educational waste database
│   │   ├── utils/
│   │   │   ├── SoundSynth.js       # Audio feedback system
│   │   │   └── wasteDatabase.js    # Waste item definitions & metadata
│   │   ├── App.jsx                 # Main application logic
│   │   ├── App.css                 # Styling
│   │   ├── index.css               # Global styles
│   │   └── main.jsx                # Entry point
│   ├── package.json
│   ├── vite.config.js
│   ├── eslint.config.js
│   └── public/
│
├── server/                          # Node.js backend
│   ├── models/
│   │   └── User.js                 # User schema and authentication
│   ├── routes/
│   │   ├── auth.js                 # Authentication endpoints
│   │   └── state.js                # User state persistence
│   ├── server.js                   # Express server configuration
│   ├── package.json
│   └── .env                        # Environment variables
```

---

## 🛠️ Technology Stack

### Frontend
- **React 19.2.6** - UI framework with hooks
- **Vite 8.0.12** - Fast build tool and dev server
- **TensorFlow.js + MobileNet** - AI model for image classification
- **Vanilla CSS** - Styling with custom design system

### Backend
- **Node.js + Express 4.19.2** - REST API server
- **MongoDB 8.4.1** - NoSQL database
- **JWT (jsonwebtoken)** - Stateless authentication
- **bcryptjs** - Password hashing
- **CORS & Cookie Parser** - Cross-origin requests and session management
- **Mongoose** - MongoDB ODM

### Development Tools
- **Vite** - Hot module reloading
- **ESLint** - Code linting
- **Nodemon** - Auto-restart during development

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or Atlas URI)
- Modern browser with camera access (for AI Scanner)

### Installation

#### 1. Clone and Setup
```bash
cd d:\College\ESD_01
```

#### 2. Backend Setup
```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/ecosegregate
JWT_SECRET=ecosegregate_secret_key_default_987654
NODE_ENV=development
```

#### 3. Frontend Setup
```bash
cd ../client
npm install
```

### Running the Application

#### Start Backend (Terminal 1)
```bash
cd server
npm run dev
# or for production: npm start
```
Backend runs on `http://localhost:5000`

#### Start Frontend (Terminal 2)
```bash
cd client
npm run dev
```
Frontend runs on `http://localhost:5173`

### Default Demo Account
- **Username:** `demo`
- **Password:** `password123`

---

## 📱 Core Functionality

### Authentication Flow
1. Users register with username and password
2. Password is hashed with bcryptjs (salt rounds: 10)
3. JWT token generated and stored as httpOnly cookie (7-day expiration)
4. Session checked on app load via `/api/session` endpoint
5. Automatic fallback to localStorage for offline mode

### AI Scanner Workflow
1. User captures/uploads image or uses live camera
2. TensorFlow MobileNet model classifies the object
3. Results categorized into waste type
4. User can confirm or manually correct classification
5. Action logged to user state with environmental metrics updated
6. Daily scan count incremented (limited to 3/day for quests)

### Game Mechanics
1. Random waste items spawn at top of screen
2. User drags items to correct colored bins
3. Correct sorts increase score and streak
4. Incorrect sorts reduce lives
5. Speed increases with score progression
6. Game ends when lives reach 0
7. Statistics synced to user profile

### Progress Tracking
- XP earned from scanning and gaming
- Level progression (based on total items logged)
- Streak system (consecutive daily activity)
- Environmental metrics:
  - CO₂ offset: 1.5 kg per item diverted
  - Water saved: 300 liters per item diverted
- 7-day activity history maintained

### Data Persistence
- User state synced to MongoDB after each action
- Local storage backup for offline functionality
- State includes: streaks, scores, metrics, achievements, history logs
- Automatic merge of default state with user data on load

---

## 🎓 Educational Content

### Waste Catalog Database
The application includes a comprehensive waste database with 50+ items covering:
- **Organic Items:** banana peels, food waste, plant matter
- **Recyclable Items:** plastic bottles, aluminum cans, glass jars, paper boxes
- **Hazardous Items:** batteries, LED bulbs, smartphones, thermometers
- **Landfill Items:** broken ceramics, styrofoam, contaminated materials

Each item includes:
- Category classification
- Proper disposal method
- Environmental impact facts
- Tips for recycling/composting
- Common contamination issues

### Eco Tips System
Rotating educational tips covering:
- Plastic bag contamination in recycling
- Methane emissions from landfill decomposition
- E-waste toxicity
- Material-specific recycling rules
- Transport footprint optimization
- Microplastic prevention

---

## 📊 API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `GET /api/session` - Check current session

### User State
- `GET /api/state` - Retrieve user state
- `POST /api/state` - Update user state

---

## 🎯 Achievement System

Users unlock badges by:
| Badge | Requirement |
|-------|-------------|
| ♻️ Recycle Rookie | Log 1 recyclable item |
| 🪱 Compost Master | Segregate 5+ organic items |
| ⚠️ Hazard Control | Keep 3+ hazardous items separate |
| 📱 E-Waste Warrior | Sort 5+ electronic items |
| 🔥 Streak Champion | Maintain 50+ day streak |
| 🌡️ Mercury Master | Read hazard safety info |
| 📸 Scanner Expert | Complete 10+ AI scans |
| 🎮 Game Master | Achieve high score |

---

## 🔒 Security Features

- **Password Security:** bcryptjs with salt rounds (10)
- **Session Management:** JWT tokens with 7-day expiration
- **CORS Configuration:** Restricted to localhost origins
- **Cookie Security:** httpOnly flag, secure mode in production
- **Input Validation:** Username/password requirements enforced
- **Database:** MongoDB with Mongoose schema validation

---

## 🎨 User Interface Design

- **Modern Neon Theme:** Cyan (#00F2FE), green (#00F59B), red (#FF4170)
- **Responsive Layout:** Works on desktop and tablet
- **Accessibility:** Semantic HTML, keyboard navigation
- **Sound Design:** 
  - Click sounds for interactions
  - Success/failure audio cues
  - Game background audio
  - Volume toggle available

---

## 📈 Environmental Impact Tracking

The application calculates and tracks:
- **CO₂ Offset:** Equivalent emissions saved per item diverted
- **Water Savings:** Water conservation per item diverted
- **Diversion Rate:** Percentage of waste diverted from landfills
- **Daily Activity:** Items logged per day (7-day history)

---

## 🛠️ Development Commands

### Client
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

### Server
```bash
npm run dev      # Start with nodemon (auto-restart)
npm start        # Start production server
```

---

## 📝 Environment Variables

### Server (.env)
```env
PORT=5000                                          # API port
MONGODB_URI=mongodb://127.0.0.1:27017/ecosegregate # Database URL
JWT_SECRET=ecosegregate_secret_key_default_987654  # JWT secret key
NODE_ENV=development                               # Environment mode
```

---

## 🐛 Troubleshooting

### AI Scanner Not Working
- Ensure browser has camera permissions
- Check that TensorFlow/MobileNet scripts are loaded
- Try uploading an image instead of using camera
- Check browser console for errors

### MongoDB Connection Issues
- Verify MongoDB is running locally or check Atlas URI
- Check `MONGODB_URI` in .env file
- Ensure correct credentials for MongoDB Atlas

### Authentication Issues
- Clear cookies and localStorage: `localStorage.clear()`
- Check JWT_SECRET matches between server and requests
- Verify server is running on correct port

### Game Performance
- Close other browser tabs
- Disable browser extensions
- Check system resources
- Reduce quality of canvas if needed

---

## 🎓 Learning Outcomes

Users learn:
- Proper waste classification and segregation
- Environmental impact of waste management
- Recycling contamination issues
- E-waste and hazardous material handling
- Resource conservation principles
- Sustainable lifestyle habits

---

## 🔮 Future Enhancements

Potential features for expansion:
- [ ] Community leaderboards
- [ ] Share achievements on social media
- [ ] Multiplayer competitive modes
- [ ] Integration with local recycling facilities
- [ ] Real-time waste collection scheduling
- [ ] Augmented reality waste recognition
- [ ] Carbon credit system
- [ ] Waste tracking over time with predictions
- [ ] Community challenges
- [ ] Integration with municipal waste systems

---

## 📄 License

This project is developed as an educational initiative for sustainable waste management.

---

## 👥 Contributing

This project is part of an Environmental Science and Development course. For contributions, please ensure:
- Code follows ESLint rules
- All features are tested
- Documentation is updated
- Authentication security is maintained

---

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review browser console for error messages
3. Verify all environment variables are set correctly
4. Ensure both client and server are running

---

## 🌱 Make a Difference

Every piece of waste sorted properly:
- ♻️ Recovers valuable resources
- 💨 Reduces greenhouse gas emissions
- 💧 Conserves precious water
- 🌍 Protects our planet

**Start sorting today with EcoSegregate!**

---

**Last Updated:** June 2026  
**Project:** Environmental Science & Development (ESD_01)
