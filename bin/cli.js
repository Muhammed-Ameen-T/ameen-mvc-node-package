#!/usr/bin/env node
const inquirer = require('inquirer');
const chalk = require('chalk');
const initializeProject = require('../index');
const path = require('path');

console.log(chalk.blue('Welcome to Ameen\'s MERN MVC Project Generator!'));
console.log(chalk.blue('Setting up a new MERN project...'));

const questions = [
  {
    type: 'input',
    name: 'projectName',
    message: 'What is your project name?',
    validate: input => {
      // Windows-compatible filename validation
      if (/^[^<>:"/\\|?*]+$/.test(input)) return true;
      return 'Project name contains invalid characters for Windows';
    }
  }
];

inquirer.prompt(questions)
  .then(answers => {
    const projectName = answers.projectName.trim();
    console.log(chalk.green(`Creating new MERN project: ${projectName}`));
    initializeProject(projectName);
  })
  .catch(error => {
    console.error(chalk.red('Error creating project:'), error);
    process.exit(1);
  });