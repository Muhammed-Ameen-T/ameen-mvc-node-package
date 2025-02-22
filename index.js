// index.js
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

function createDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function createFile(filePath, content) {
  // Ensure Windows-style line endings
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
  
  // Create base project directory
  createDirectory(baseDir);
  
  // Initialize package.json (same as before)
  const packageJson = {
    "name": projectName,
    "version": "1.0.0",
    "description": "MERN Stack Project with MVC Architecture",
    "main": "server.js",
    "scripts": {
      "start": "node server.js",
      "server": "nodemon server.js",
      "client": "cd client && npm start",
      "dev": "concurrently \"npm run server\" \"npm run client\"",
      "install-client": "cd client && npm install",
      "build": "cd client && npm run build",
      "heroku-postbuild": "npm run install-client && npm run build"
    },
    "dependencies": {
      "express": "^4.18.2",
      "mongoose": "^7.0.0",
      "dotenv": "^16.0.3",
      "cors": "^2.8.5",
      "morgan": "^1.10.0",
      "helmet": "^6.0.1",
      "compression": "^1.7.4"
    },
    "devDependencies": {
      "nodemon": "^2.0.20",
      "concurrently": "^7.6.0"
    }
  };

  // Create directories using Windows path separators
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

  // Write package.json
  createFile(path.join(baseDir, 'package.json'), JSON.stringify(packageJson, null, 2));

  // Rest of your files remain the same
  const files = {
    'server.js': `
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
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
// Add more routes as needed

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(\`Server running on port \${PORT}\`));
`,

    'controllers/userController.js': `
const User = require('../models/User');

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createUser = async (req, res) => {
  const user = new User(req.body);
  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
`,

    'models/User.js': `
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
`,

    'routes/userRoutes.js': `
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', userController.getUsers);
router.post('/', userController.createUser);

module.exports = router;
`,

    'middleware/auth.js': `
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};
`,

    'config/db.js': `
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(\`MongoDB Connected: \${conn.connection.host}\`);
  } catch (error) {
    console.error(\`Error: \${error.message}\`);
    process.exit(1);
  }
};

module.exports = connectDB;
`,

    '.env': `
MONGODB_URI=mongodb://localhost:27017/your-database
JWT_SECRET=your-secret-key
NODE_ENV=development
PORT=5000
`,

    '.gitignore': `
node_modules/
.env
build/
.DS_Store
`,

    'README.md': `
# ${projectName}

MERN Stack project with MVC architecture.

## Setup

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Create a .env file in the root directory with your MongoDB URI and JWT secret:
   \`\`\`
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   \`\`\`

3. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

## Scripts

- \`npm start\`: Start the production server
- \`npm run server\`: Start the development server with nodemon
- \`npm run client\`: Start the React development server
- \`npm run dev\`: Run both backend and frontend development servers
- \`npm run build\`: Build the React application
`
};

  // Write all files using Windows path handling
  Object.entries(files).forEach(([filename, content]) => {
    const filePath = path.join(baseDir, filename);
    createDirectory(path.dirname(filePath));
    createFile(filePath, content.trim());
  });

  try {
    // Initialize git using Windows commands
    await executeCommand('git init', baseDir);

    // Create React client using npx
    console.log('Creating React application...');
    await executeCommand('npx create-react-app client', baseDir);

    // Install dependencies
    console.log('Installing dependencies...');
    await executeCommand('npm install', baseDir);

    console.log(`
Project ${projectName} has been created successfully!

To get started:
1. cd ${projectName}
2. Update the .env file with your MongoDB URI
3. npm install
4. npm run dev

The project structure has been set up with:
- MVC architecture
- Basic user model, controller, and routes
- Authentication middleware
- Configuration setup
- Development and production scripts
- React client setup
    `);
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

module.exports = initializeProject;