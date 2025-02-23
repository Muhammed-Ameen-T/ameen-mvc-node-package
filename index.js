const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

function createDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function createFile(filePath, content) {
  const normalizedContent = content.replace(/\n/g, '\r\n');
  fs.writeFileSync(filePath, normalizedContent);
}

function executeCommand(command, cwd) {
  return new Promise((resolve, reject) => {
    exec(command, { cwd, shell: 'cmd.exe' }, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error}`);
        reject(error);
        return;
      }
      resolve(stdout);
    });
  });
}

async function initializeProject(projectName) {
  const baseDir = path.join(process.cwd(), projectName);
  const clientDir = path.join(baseDir, 'client');
  
  // Create base project directory
  createDirectory(baseDir);
  
  // Backend package.json
  const packageJson = {
    "name": projectName,
    "version": "1.0.0",
    "description": "MERN Stack Project with MVC Architecture",
    "main": "server.js",
    "scripts": {
      "start": "node server.js",
      "server": "nodemon server.js",
      "client": "cd client && npm run dev",
      "dev": "concurrently \"npm run server\" \"npm run client\"",
      "install-client": "cd client && npm install",
      "build": "cd client && npm run build",
      "preview": "cd client && npm run preview"
    },
    "dependencies": {
      "express": "^4.18.2",
      "mongoose": "^7.0.0",
      "dotenv": "^16.0.3",
      "cors": "^2.8.5",
      "morgan": "^1.10.0",
      "helmet": "^6.0.1",
      "compression": "^1.7.4",
      "jsonwebtoken": "^9.0.0",
      "bcryptjs": "^2.4.3"
    },
    "devDependencies": {
      "nodemon": "^2.0.20",
      "concurrently": "^7.6.0"
    }
  };

  // Create backend directories
  const directories = [
    'controllers',
    'models',
    'routes',
    'middleware',
    'config',
    'utils',
    'tests'
  ];

  directories.forEach(dir => createDirectory(path.join(baseDir, dir)));

  // Initialize backend files
  const backendFiles = {
    'server.js': `
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());

// Routes
app.use('/api/users', require('./routes/userRoutes'));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/dist'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(\`Server running on port \${PORT}\`));
`,

    // ... (keep your existing backend files)
  };

  // Write backend files
  Object.entries(backendFiles).forEach(([filename, content]) => {
    const filePath = path.join(baseDir, filename);
    createDirectory(path.dirname(filePath));
    createFile(filePath, content.trim());
  });

  try {
    // Initialize git
    await executeCommand('git init', baseDir);

    // Create Vite React client
    console.log('Creating Vite React application...');
    await executeCommand('npm create vite@latest client -- --template react-ts', baseDir);

    // Client-side files
    const clientFiles = {
      'tailwind.config.js': `
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {"50":"#eff6ff","100":"#dbeafe","200":"#bfdbfe","300":"#93c5fd","400":"#60a5fa","500":"#3b82f6","600":"#2563eb","700":"#1d4ed8","800":"#1e40af","900":"#1e3a8a","950":"#172554"}
      }
    },
    fontFamily: {
      'body': [
        'Inter', 
        'ui-sans-serif', 
        'system-ui', 
        '-apple-system', 
        'system-ui', 
        'Segoe UI', 
        'Roboto', 
        'Helvetica Neue', 
        'Arial', 
        'Noto Sans', 
        'sans-serif', 
        'Apple Color Emoji', 
        'Segoe UI Emoji', 
        'Segoe UI Symbol', 
        'Noto Color Emoji'
      ],
      'sans': [
        'Inter', 
        'ui-sans-serif', 
        'system-ui', 
        '-apple-system', 
        'system-ui', 
        'Segoe UI', 
        'Roboto', 
        'Helvetica Neue', 
        'Arial', 
        'Noto Sans', 
        'sans-serif', 
        'Apple Color Emoji', 
        'Segoe UI Emoji', 
        'Segoe UI Symbol', 
        'Noto Color Emoji'
      ]
    }
  },
  plugins: [require('@tailwindcss/forms')]
}`,

      'postcss.config.js': `
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`,

      'src/index.css': `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .btn-primary {
    @apply py-2 px-4 bg-primary-500 text-white font-semibold rounded-lg shadow-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-opacity-75;
  }
}`,

      'src/App.tsx': `
import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App`,

      'src/components/Navbar.tsx': `
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-2xl font-bold text-primary-600">
                ${projectName}
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link to="/" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Home
              </Link>
              <Link to="/dashboard" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar`,

      'src/pages/Home.tsx': `
const Home = () => {
  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to ${projectName}
            </h1>
            <p className="text-gray-600">
              Built with Vite + React + TypeScript + Tailwind
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home`,

      'src/pages/Dashboard.tsx': `
const Dashboard = () => {
  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-gray-600">
          Welcome to your dashboard. This is a protected route.
        </p>
      </div>
    </div>
  )
}

export default Dashboard`,

      'vite.config.ts': `
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})`,

      '.env': `
VITE_API_URL=http://localhost:5000/api`
    };

    // Write client files
    Object.entries(clientFiles).forEach(([filename, content]) => {
      const filePath = path.join(clientDir, filename);
      createDirectory(path.dirname(filePath));
      createFile(filePath, content.trim());
    });

    // Install client dependencies
    console.log('Installing client dependencies...');
    const clientDeps = [
      'react-router-dom',
      '@tanstack/react-query',
      'axios',
      'react-hook-form',
      'zod',
      '@hookform/resolvers',
      'clsx',
      'tailwind-merge'
    ];

    const clientDevDeps = [
      'tailwindcss',
      'postcss',
      'autoprefixer',
      '@tailwindcss/forms',
      '@types/node',
      '@typescript-eslint/eslint-plugin',
      '@typescript-eslint/parser',
      'eslint-plugin-react-hooks',
      'eslint-plugin-react-refresh'
    ];

    await executeCommand(`cd client && npm install ${clientDeps.join(' ')}`, baseDir);
    await executeCommand(`cd client && npm install -D ${clientDevDeps.join(' ')}`, baseDir);

    // Install backend dependencies
    console.log('Installing backend dependencies...');
    await executeCommand('npm install', baseDir);

    console.log(`
Project ${projectName} has been created successfully!

To get started:
1. cd ${projectName}
2. Update the .env file with your MongoDB URI
3. npm install
4. npm run dev

The project includes:
✨ Backend:
- Express with MVC architecture
- MongoDB with Mongoose
- JWT Authentication
- API Routes setup

🎨 Frontend:
- Vite + React + TypeScript
- Tailwind CSS with custom configuration
- React Router for navigation
- React Query for data fetching
- Form handling with React Hook Form
- Environment configuration
- ESLint + TypeScript setup

Happy coding! 🚀
    `);
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

module.exports = initializeProject;