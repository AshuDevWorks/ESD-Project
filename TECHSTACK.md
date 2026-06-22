# EcoSegregate - Tech Stack & Installation Guide

Complete technical documentation for the EcoSegregate project, including all technologies used, their purposes, installation instructions, and identified gaps.

---

## 📋 Table of Contents
1. [Tech Stack Overview](#tech-stack-overview)
2. [Frontend Technologies](#frontend-technologies)
3. [Backend Technologies](#backend-technologies)
4. [Infrastructure & Database](#infrastructure--database)
5. [Development Tools](#development-tools)
6. [Installation Guide](#installation-guide)
7. [Missing Packages](#missing-packages)
8. [Running the Application](#running-the-application)
9. [Environment Setup](#environment-setup)
10. [Dependency Compatibility](#dependency-compatibility)

---

## 🏗️ Tech Stack Overview

### Architecture Type
**Full-Stack MERN Variant** (MongoDB, Express, React, Node.js) with client-side AI

### System Requirements
- **Node.js:** v14.0.0 or higher
- **npm:** v6.0.0 or higher
- **MongoDB:** v4.4 or higher (local or Atlas)
- **Modern Browser:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **RAM:** Minimum 2GB for development
- **Storage:** ~500MB for node_modules and dependencies

---

## 🎨 Frontend Technologies

### Core Framework

| Package | Version | Purpose | Installation |
|---------|---------|---------|--------------|
| **React** | ^19.2.6 | UI library with Hooks for component management and state | `npm install react@latest` |
| **React DOM** | ^19.2.6 | React rendering engine for browser DOM manipulation | `npm install react-dom@latest` |

**Why React 19?**
- Latest Hooks API for functional components
- Better performance with concurrent rendering
- Improved error boundaries
- Enhanced server component support

### Build Tool & Dev Server

| Package | Version | Purpose | Installation |
|---------|---------|---------|--------------|
| **Vite** | ^8.0.12 | Lightning-fast build tool with HMR (Hot Module Replacement) | `npm install vite@^8.0.12 -D` |
| **@vitejs/plugin-react** | ^6.0.1 | Official Vite plugin for React with JSX support | `npm install @vitejs/plugin-react@^6.0.1 -D` |

**Why Vite?**
- 10-100x faster than Webpack
- Native ES modules
- Instant server start (<100ms)
- Lightning-fast HMR
- Optimized build output

### AI & Machine Learning (Client-Side)

| Package | Version | Purpose | Installation |
|---------|---------|---------|--------------|
| **TensorFlow.js** | Latest | JavaScript ML library for browser-based inference | CDN: `<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest"></script>` |
| **MobileNet** | Latest | Pre-trained CNN model for image classification | CDN: `<script src="https://cdn.jsdelivr.net/npm/@tensorflow-models/mobilenet@latest"></script>` |

**Why TensorFlow.js?**
- Client-side processing (no server latency)
- Privacy-preserving (data stays on user's device)
- Works offline after initial load
- Real-time predictions (~50-200ms per image)
- Supports WebGL acceleration

**Why MobileNet?**
- Lightweight (~13MB download)
- Fast inference on mobile devices
- 1000+ object categories including waste items
- 88.5% ImageNet accuracy
- Pre-trained weights ready to use

**CDN Loading Method:**
Currently loaded via CDN to:
- Reduce bundle size
- Enable browser caching
- Support offline mode
- Avoid build complexity

**Alternative: Install via npm**
```bash
npm install @tensorflow/tfjs @tensorflow-models/mobilenet
```

### Styling & Fonts

| Package | Version | Purpose | Installation |
|---------|---------|---------|--------------|
| **Google Fonts** | N/A | Font library (Outfit, Space Grotesk) | Linked via `<link>` in HTML |
| **Custom CSS** | N/A | Custom design system with CSS variables | `src/App.css`, `src/index.css` |

**CSS Architecture:**
- CSS Grid for layouts
- Flexbox for components
- CSS custom properties (variables) for theming
- CSS animations for transitions
- Responsive design (mobile-first)

### Code Quality

| Package | Version | Purpose | Installation |
|---------|---------|---------|--------------|
| **ESLint** | ^10.3.0 | JavaScript linter to catch syntax errors and style issues | `npm install eslint@^10.3.0 -D` |
| **@eslint/js** | ^10.0.1 | ESLint's recommended configuration | `npm install @eslint/js@^10.0.1 -D` |
| **eslint-plugin-react-hooks** | ^7.1.1 | Linting rules for React Hooks best practices | `npm install eslint-plugin-react-hooks@^7.1.1 -D` |
| **eslint-plugin-react-refresh** | ^0.5.2 | Linting rules for Vite React Fast Refresh | `npm install eslint-plugin-react-refresh@^0.5.2 -D` |
| **globals** | ^17.6.0 | Global variable definitions for ESLint | `npm install globals@^17.6.0 -D` |

**Type Checking (Optional)**

| Package | Version | Purpose | Installation |
|---------|---------|---------|--------------|
| **@types/react** | ^19.2.14 | TypeScript type definitions for React | `npm install @types/react@^19.2.14 -D` |
| **@types/react-dom** | ^19.2.3 | TypeScript type definitions for React DOM | `npm install @types/react-dom@^19.2.3 -D` |

---

## 🔧 Backend Technologies

### Server Framework

| Package | Version | Purpose | Installation |
|---------|---------|---------|--------------|
| **Express** | ^4.19.2 | Lightweight web framework for building REST APIs | `npm install express@^4.19.2` |

**Why Express?**
- Minimal and flexible
- Massive ecosystem of middleware
- Easy routing configuration
- Production-ready
- Lightweight (15KB)
- 50k+ npm packages built on Express

### Database & ODM

| Package | Version | Purpose | Installation |
|---------|---------|---------|--------------|
| **Mongoose** | ^8.4.1 | MongoDB Object Data Modeling library with schema validation | `npm install mongoose@^8.4.1` |

**Why Mongoose?**
- Schema validation on application level
- Built-in data validation and type casting
- Middleware hooks (pre/post)
- Query building
- Relationship support (references)
- Default value handling

**Mongoose Schema in Project:**
```javascript
// User schema with state management
{
  username: String,
  password: String (hashed),
  state: Object (user game/scan data),
  createdAt: Date
}
```

### Authentication & Security

| Package | Version | Purpose | Installation |
|---------|---------|---------|--------------|
| **jsonwebtoken (JWT)** | ^9.0.2 | Creates and verifies stateless authentication tokens | `npm install jsonwebtoken@^9.0.2` |
| **bcryptjs** | ^2.4.3 | Password hashing with salt rounds for security | `npm install bcryptjs@^2.4.3` |

**JWT Flow:**
```
User Login → Verify Credentials → Generate JWT Token → Set HttpOnly Cookie → Client Stores Token
```

**bcryptjs Configuration:**
```javascript
// Salt rounds: 10 (default in code)
// Hash time: ~100ms per password
// Security level: Production-ready
```

### HTTP & CORS

| Package | Version | Purpose | Installation |
|---------|---------|---------|--------------|
| **cors** | ^2.8.5 | Enable Cross-Origin Resource Sharing for frontend-backend communication | `npm install cors@^2.8.5` |
| **cookie-parser** | ^1.4.6 | Parse and set HTTP cookies for session management | `npm install cookie-parser@^1.4.6` |
| **express** built-in | N/A | Built-in body parser for JSON/URL-encoded data | N/A |

**CORS Configuration:**
```javascript
// Allowed origins: localhost:5173, 127.0.0.1:5173
// Credentials: true (for cookies)
// Methods: GET, POST, PUT, DELETE
```

### Environment Variables

| Package | Version | Purpose | Installation |
|---------|---------|---------|--------------|
| **dotenv** | ^16.4.5 | Load environment variables from `.env` file into `process.env` | `npm install dotenv@^16.4.5` |

**.env Variables Required:**
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/ecosegregate
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

---

## 💾 Infrastructure & Database

### Database Management

| Technology | Version | Purpose | Setup |
|------------|---------|---------|-------|
| **MongoDB** | 4.4+ | NoSQL document database for storing user data and app state | Local: `mongod` or Atlas: Connection URI |
| **Mongoose** | ^8.4.1 | ODM for MongoDB interactions | `npm install mongoose@^8.4.1` |

**Collections:**
- `users` - User profiles, hashed passwords, app state

**Indexes:**
- `username` - Unique index for quick lookups
- `createdAt` - For sorting users by registration date

**Connection String Examples:**

Local MongoDB:
```
mongodb://127.0.0.1:27017/ecosegregate
```

MongoDB Atlas (Cloud):
```
mongodb+srv://<username>:<password>@<cluster>.mongodb.net/ecosegregate?retryWrites=true&w=majority
```

---

## 🛠️ Development Tools

### Runtime Environment

| Package | Version | Purpose | Installation |
|---------|---------|---------|--------------|
| **Node.js** | v14+ | JavaScript runtime for backend | Download from [nodejs.org](https://nodejs.org) |
| **npm** | v6+ | Node Package Manager for dependency management | Included with Node.js |

### Development Utilities

| Package | Version | Purpose | Installation |
|---------|---------|---------|--------------|
| **nodemon** | ^3.1.3 | Auto-restarts server on file changes during development | `npm install nodemon@^3.1.3 -D` |

**nodemon vs Node:**
- Node: Requires manual restart on code changes
- nodemon: Automatic restart (dev-only, saves time)
- Used in: `npm run dev` script

---

## 📥 Installation Guide

### Step 1: Prerequisites Installation

#### Install Node.js & npm
```bash
# Windows (using Chocolatey)
choco install nodejs

# Windows (using Windows Package Manager)
winget install OpenJS.NodeJS

# Or download from: https://nodejs.org (LTS recommended)

# Verify installation
node --version  # Should show v18.x or higher
npm --version   # Should show v9.x or higher
```

#### Install MongoDB (Choose One)

**Option A: Local MongoDB Installation**
```bash
# Windows (using Chocolatey)
choco install mongodb

# Start MongoDB service
net start MongoDB

# Or use MongoDB Community Edition
# Download from: https://www.mongodb.com/try/download/community
```

**Option B: MongoDB Atlas (Cloud - Recommended)**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create cluster
4. Get connection string
5. Add to `.env` file

### Step 2: Backend Setup

```bash
# Navigate to server directory
cd d:\College\ESD_01\server

# Install all dependencies
npm install

# Verify installation
npm list

# Create .env file
echo PORT=5000 > .env
echo MONGODB_URI=mongodb://127.0.0.1:27017/ecosegregate >> .env
echo JWT_SECRET=ecosegregate_secret_key_default_987654 >> .env
echo NODE_ENV=development >> .env

# Or use Notepad
notepad .env
```

**Complete Server Setup:**
```bash
cd server
npm install bcryptjs@^2.4.3 cookie-parser@^1.4.6 cors@^2.8.5 dotenv@^16.4.5 express@^4.19.2 jsonwebtoken@^9.0.2 mongoose@^8.4.1
npm install nodemon@^3.1.3 -D
```

### Step 3: Frontend Setup

```bash
# Navigate to client directory
cd d:\College\ESD_01\client

# Install all dependencies
npm install

# Verify installation
npm list

# Check for peer dependency warnings
npm audit
```

**Complete Frontend Setup:**
```bash
cd client
npm install react@latest react-dom@latest
npm install vite@^8.0.12 @vitejs/plugin-react@^6.0.1 -D
npm install eslint@^10.3.0 @eslint/js@^10.0.1 eslint-plugin-react-hooks@^7.1.1 eslint-plugin-react-refresh@^0.5.2 globals@^17.6.0 -D
npm install @types/react@^19.2.14 @types/react-dom@^19.2.3 -D
```

### Step 4: Verify Installation

```bash
# Check Node.js
node -v

# Check npm
npm -v

# Check MongoDB connection (if local)
mongosh  # or mongo for older versions

# In mongosh, test connection:
db.version()
```

---

## ⚠️ Missing Packages

### Identified Gaps in Current Setup

#### 1. **Audio Synthesis Library** ⚠️ MISSING
**Used in:** `src/utils/SoundSynth.js`  
**Current Status:** Custom implementation (likely using Web Audio API)  
**Recommended Package:** 
```bash
npm install tone
# Version: ^14.8.49
# Size: ~290KB
# Purpose: Music and audio synthesis
```

**Alternative Solutions:**
- **Howler.js** - Sound library for web
  ```bash
  npm install howler
  ```
- **Pixi.js** - (if advanced audio/graphics needed)
  ```bash
  npm install pixi.js
  ```

---

#### 2. **Form Validation Library** ⚠️ OPTIONAL
**Used in:** Authentication forms  
**Current Status:** Manual validation in `AuthOverlay.jsx`  
**Recommended Package:**
```bash
npm install zod
# OR
npm install yup
# Purpose: Schema validation for login/registration
```

**Example with Zod:**
```javascript
import { z } from 'zod';

const loginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(8)
});
```

---

#### 3. **HTTP Client Optimization** ⚠️ OPTIONAL
**Used in:** API calls (currently using Fetch API)  
**Current Status:** Native Fetch API  
**Recommended Package:**
```bash
npm install axios
# Version: ^1.6.0
# Purpose: Simplified HTTP requests with interceptors
```

**Benefits:**
- Automatic JSON serialization
- Request/response interceptors
- Timeout management
- Request cancellation

---

#### 4. **UI Component Library** ⚠️ OPTIONAL
**Used in:** Custom components  
**Current Status:** Custom CSS components  
**Recommended Packages (if needed):**
```bash
# Material-UI
npm install @mui/material @emotion/react @emotion/styled

# OR Tailwind CSS
npm install -D tailwindcss postcss autoprefixer

# OR DaisyUI
npm install daisyui
```

---

#### 5. **State Management** ⚠️ OPTIONAL
**Used in:** App state (currently using React hooks + localStorage)  
**Current Status:** Local useState/localStorage  
**Recommended Package (if app scales):**
```bash
npm install zustand
# OR
npm install redux @reduxjs/toolkit react-redux
```

---

#### 6. **Testing Libraries** ⚠️ MISSING
**Purpose:** Unit and integration testing  
**Recommended Setup:**
```bash
# Vitest + React Testing Library
npm install -D vitest @testing-library/react @testing-library/jest-dom

# OR Jest + React Testing Library
npm install -D jest @testing-library/react @babel/preset-react
```

---

#### 7. **Error Tracking** ⚠️ OPTIONAL
**Purpose:** Monitor production errors  
**Recommended Package:**
```bash
npm install @sentry/react
# Purpose: Error logging and monitoring
```

---

#### 8. **Analytics** ⚠️ OPTIONAL
**Purpose:** Track user behavior  
**Recommended Package:**
```bash
npm install react-ga4
# Purpose: Google Analytics integration
```

---

#### 9. **Image Processing** ⚠️ OPTIONAL (for AI Scanner enhancement)
**Purpose:** Pre-process images before AI classification  
**Recommended Package:**
```bash
npm install jimp
# OR
npm install sharp (backend only)
```

---

#### 10. **WebSocket Support** ⚠️ OPTIONAL
**Purpose:** Real-time multiplayer features  
**Recommended Packages:**
```bash
# Server
npm install socket.io

# Client
npm install socket.io-client
```

---

## 🚀 Running the Application

### Terminal Setup

**Terminal 1 - Start Backend:**
```bash
cd d:\College\ESD_01\server
npm run dev
```

**Expected Output:**
```
Connected to MongoDB
Server running on port 5000
Demo user seeded successfully
API ready at: http://localhost:5000
```

**Terminal 2 - Start Frontend:**
```bash
cd d:\College\ESD_01\client
npm run dev
```

**Expected Output:**
```
VITE v8.0.12 ready in 123 ms
➜  Local:   http://localhost:5173/
➜  Press h to show help
```

### Access the Application
```
Frontend: http://localhost:5173
Backend API: http://localhost:5000/api
```

### Scripts Reference

**Client Scripts:**
```bash
npm run dev      # Start Vite dev server with HMR
npm run build    # Build for production (dist/ folder)
npm run preview  # Preview production build locally
npm run lint     # Run ESLint to check code quality
```

**Server Scripts:**
```bash
npm run dev      # Start with nodemon (auto-restart)
npm start        # Start Node.js server directly
```

---

## 🔧 Environment Setup

### Backend .env File
**Location:** `server/.env`

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://127.0.0.1:27017/ecosegregate
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecosegregate

# Authentication
JWT_SECRET=ecosegregate_secret_key_default_987654
JWT_EXPIRY=7d
```

### Frontend Configuration
**Location:** `client/vite.config.js`

```javascript
export default {
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:5000'  // Proxy API calls
    }
  }
}
```

### MongoDB Connection Strings

**Local Development:**
```
mongodb://127.0.0.1:27017/ecosegregate
```

**MongoDB Atlas (Production):**
```
mongodb+srv://<username>:<password>@<cluster>.<region>.mongodb.net/ecosegregate?retryWrites=true&w=majority
```

**Connection Options:**
```
?maxPoolSize=10&minPoolSize=5&serverSelectionTimeoutMS=5000
```

---

## 📦 Dependency Compatibility

### Node.js Version Matrix

| Node Version | Status | Notes |
|-------------|--------|-------|
| v14.x | ✅ Supported | Oldest supported LTS |
| v16.x | ✅ Supported | LTS (EOL: 2023-09-11) |
| v18.x | ✅ Supported | Current LTS (Recommended) |
| v20.x | ✅ Supported | Latest LTS (Recommended) |
| v21.x | ⚠️ Experimental | Use with caution |

### Package Compatibility

```
React 19.x requires Node.js ≥ 14.0.0
Vite 8.x requires Node.js ≥ 14.6.0
Express 4.x requires Node.js ≥ 0.10.0
Mongoose 8.x requires Node.js ≥ 14.0.0
```

### Known Issues

**Issue:** Vite build fails with "Cannot find module"
```bash
# Solution: Clear node_modules and reinstall
rm -r node_modules
npm install
```

**Issue:** MongoDB connection timeout
```bash
# Solution: Verify MongoDB is running
# Windows:
net start MongoDB

# Or check connection string in .env
```

**Issue:** Port already in use
```bash
# Kill process using port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or change PORT in .env
PORT=5001
```

---

## 📊 Performance Optimizations

### Frontend Optimizations
- **Code Splitting:** Vite automatically code-splits at build time
- **Lazy Loading:** React.lazy() for route-based splitting
- **Image Optimization:** Use modern formats (WebP)
- **CSS Minification:** Automatic via Vite

### Backend Optimizations
- **Database Indexing:** Indexes on `username`, `createdAt`
- **Connection Pooling:** Mongoose handles with defaults
- **Caching:** Consider Redis for session storage
- **Compression:** Add middleware: `npm install compression`

### AI Model Optimizations
- **TensorFlow.js WebGL:** Automatic acceleration
- **Model Caching:** Browser's IndexedDB caches model
- **Quantization:** MobileNet is already quantized

---

## 🔒 Security Considerations

### Passwords
```javascript
// bcryptjs with 10 salt rounds
// Hash time: ~100ms (production-safe)
const salt = await bcrypt.genSalt(10);
const hash = await bcrypt.hash(password, salt);
```

### JWT Tokens
```javascript
// 7-day expiration
// Signed with secret key
// Stored in httpOnly cookie (XSS protected)
```

### CORS
```javascript
// Restricted to localhost
// Credentials enabled for cookies
// Only http methods: GET, POST, PUT, DELETE
```

---

## 📝 Package Update Guide

### Check for Updates
```bash
# List outdated packages
npm outdated

# Check for vulnerabilities
npm audit
```

### Update Packages
```bash
# Update all packages to latest
npm update

# Update specific package
npm install package-name@latest

# Check package versions
npm list package-name
```

### Updating Major Versions
```bash
# Be cautious with major version updates
# Always test after updating

# Example: Update React from 18 to 19
npm install react@latest react-dom@latest
npm run lint  # Check for breaking changes
npm run build # Verify build works
```

---

## 🎓 Recommended Additional Packages

For production deployment, consider adding:

```bash
# Error Handling
npm install @sentry/react

# API Documentation
npm install swagger-ui-express

# Database Admin UI
npm install mongo-express

# Rate Limiting
npm install express-rate-limit

# Security Headers
npm install helmet

# Request Logging
npm install morgan

# Compression
npm install compression
```

---

## 📚 Resources

### Documentation Links
- **React:** https://react.dev
- **Vite:** https://vitejs.dev
- **Express:** https://expressjs.com
- **MongoDB:** https://docs.mongodb.com
- **Mongoose:** https://mongoosejs.com
- **TensorFlow.js:** https://www.tensorflow.org/js
- **MobileNet:** https://github.com/tensorflow/tfjs-models/tree/master/mobilenet

### Useful Commands

```bash
# Clear npm cache
npm cache clean --force

# Install packages from package-lock.json
npm ci

# Check package sizes
npm ls --depth=0

# Check for security vulnerabilities
npm audit fix

# Generate package-lock.json
npm install --save-exact
```

---

## ✅ Quick Start Checklist

- [ ] Install Node.js v18 or higher
- [ ] Install MongoDB locally or use MongoDB Atlas
- [ ] Clone/navigate to project directory
- [ ] Run `npm install` in both `client/` and `server/`
- [ ] Create `.env` file in `server/` with correct values
- [ ] Start MongoDB service
- [ ] Run `npm run dev` in server terminal
- [ ] Run `npm run dev` in client terminal
- [ ] Access http://localhost:5173 in browser
- [ ] Login with demo/password123

---

## 🆘 Troubleshooting

### Common Installation Issues

**npm install fails:**
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules
rm -r node_modules

# Reinstall
npm install
```

**Module not found errors:**
```bash
# Check if all dependencies are installed
npm list

# Install missing package
npm install missing-package-name
```

**Port conflicts:**
```bash
# Change port in .env
PORT=5001
```

**MongoDB connection issues:**
```bash
# Test local connection
mongosh

# Test Atlas connection in .env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
```

---

**Last Updated:** June 2026  
**Project:** EcoSegregate - Environmental Science & Development  
**Node Version:** v18 LTS (Recommended)  
**npm Version:** v9+
