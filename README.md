<div align="center">

# 🚀 ameen-mvc - A Modern MERN Stack CLI Generator

<p align="center">
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square" alt="PRs Welcome" />
  <img src="https://img.shields.io/badge/license-MIT-orange.svg?style=flat-square" alt="License" />
  <img src="https://img.shields.io/badge/MERN-Stack-blue.svg?style=flat-square" alt="MERN Stack" />
</p>

A CLI tool to generate a modern, Windows-compatible MERN stack project with MVC architecture.

</div>

## 📖 Overview

**ameen-mvc** is a simple and efficient CLI tool to generate a MERN (MongoDB, Express.js, React, Node.js) stack project with a clean MVC architecture. It helps developers set up a full-stack project within seconds.

## ✨ Features

✅ **MERN Stack Ready** - Generates a full-stack project with backend and frontend.

✅ **MVC Architecture** - Organized file structure for scalability.

✅ **Windows-Compatible** - Ensures smooth setup on Windows.

✅ **Pre-configured Scripts** - Includes development, production, and deployment scripts.

✅ **Authentication Middleware** - JWT-based authentication setup included.

✅ **MongoDB Configuration** - Pre-set for database connection with `.env` support.

✅ **Git Initialization** - Initializes a Git repository for easy version control.

## 🛠️ Installation

To install the CLI globally on your system, run:

```sh
npm install -g ameen-mvc
```

## 🚀 Usage

To create a new MERN project, run:

```sh
ameen-mvc myProject
```

This will:

✔ Create a new `myProject/` directory.

✔ Generate a MERN MVC folder structure.

✔ Install backend dependencies.

✔ Initialize Git.

✔ Create a React frontend inside `client/`.

## 📂 Project Structure

```bash
myProject/
│── client/               # React frontend (Generated using create-react-app)
│── controllers/          # Business logic (MVC)
│── models/               # Mongoose schemas
│── routes/               # Express routes
│── middleware/           # JWT authentication, logging, etc.
│── config/               # Database connection
│── utils/                # Helper functions
│── tests/                # Test cases
│── .gitignore            # Ignoring unnecessary files
│── .env                  # Environment variables
│── package.json          # Project metadata & scripts
│── server.js             # Express server entry point
└── README.md             # Project documentation
```

## 📜 Available Scripts

Inside your generated project, you can run:

🔹 **Start Backend Server**
```sh
npm start
```

🔹 **Start React Frontend**
```sh
cd client
npm start
```

🔹 **Run Both Backend & Frontend Together**
```sh
npm run dev
```

🔹 **Install Frontend Dependencies**
```sh
npm run install-client
```

🔹 **Build Frontend for Production**
```sh
npm run build
```

## ⚙ Configuration

Before running the project, configure your `.env` file:

```ini
MONGODB_URI=mongodb://localhost:27017/your-database
JWT_SECRET=your-secret-key
PORT=5000
```

## 🛠 Dependencies

### **Backend**
- Express.js
- Mongoose
- Morgan
- Helmet
- Compression
- Cors
- Dotenv
- JWT Authentication

### **Development Tools**
- Nodemon
- Concurrently

## 🙌 Contributing

Contributions are welcome! Follow these steps:

1. Fork this repository.
2. Create a feature branch:
   ```sh
   git checkout -b feature-newFeature
   ```
3. Commit your changes:
   ```sh
   git commit -m "feat: add new feature"
   ```
4. Push to your branch:
   ```sh
   git push origin feature-newFeature
   ```
5. Open a Pull Request.

## 📜 License

This project is licensed under the MIT License - feel free to use and modify it!

## ⭐ Show Some Love

If you found this tool useful, please ⭐ star this repository on GitHub! 😊

🔗 **GitHub Repo**: [ameen-mvc](https://github.com/Muhammed-Ameen-T/ameen-mvc-npm-package))

🔗 **NPM Package**: [ameen-mvc](https://www.npmjs.com/package/ameen-mvc/))

<div align="center">

**Thank you for using ameen-mvc! 🎉**

</div>

