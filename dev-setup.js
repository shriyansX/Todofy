#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Todofy Development Setup Script');
console.log('===================================\n');

function runCommand(command, description) {
  console.log(`📦 ${description}...`);
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${description} completed!\n`);
    return true;
  } catch (error) {
    console.error(`❌ ${description} failed:`, error.message);
    return false;
  }
}

function checkFile(filePath, description) {
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${description} exists`);
    return true;
  } else {
    console.log(`❌ ${description} missing`);
    return false;
  }
}

function createEnvFile(filePath, content) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Created ${filePath}`);
  } else {
    console.log(`📄 ${filePath} already exists`);
  }
}

// Main setup process
async function main() {
  console.log('🔍 Checking project structure...');
  
  // Check if we're in the right directory
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  if (!checkFile(packageJsonPath, 'Root package.json')) {
    console.log('❌ Please run this script from the project root directory');
    process.exit(1);
  }

  // Check client and server directories
  checkFile(path.join(process.cwd(), 'client'), 'Client directory');
  checkFile(path.join(process.cwd(), 'server'), 'Server directory');

  console.log('\n🔧 Creating environment files...');
  
  // Create server .env
  const serverEnvPath = path.join(process.cwd(), 'server', '.env');
  const serverEnvContent = `MONGODB_URI=mongodb://localhost:27017/todofy
PORT=5000
NODE_ENV=development`;
  createEnvFile(serverEnvPath, serverEnvContent);

  // Create client .env
  const clientEnvPath = path.join(process.cwd(), 'client', '.env');
  const clientEnvContent = `REACT_APP_API_URL=http://localhost:5000/api`;
  createEnvFile(clientEnvPath, clientEnvContent);

  console.log('\n📦 Installing dependencies...');
  
  // Install root dependencies
  if (!runCommand('npm install', 'Installing root dependencies')) {
    console.log('❌ Failed to install root dependencies');
    process.exit(1);
  }

  // Install server dependencies
  if (!runCommand('cd server && npm install', 'Installing server dependencies')) {
    console.log('❌ Failed to install server dependencies');
    process.exit(1);
  }

  // Install client dependencies
  if (!runCommand('cd client && npm install', 'Installing client dependencies')) {
    console.log('❌ Failed to install client dependencies');
    process.exit(1);
  }

  console.log('🎉 Setup completed successfully!\n');
  
  console.log('📋 Next steps:');
  console.log('1. Make sure MongoDB is running on your system');
  console.log('   - Install MongoDB: https://docs.mongodb.com/manual/installation/');
  console.log('   - Start MongoDB: mongod');
  console.log('   - Or use MongoDB Atlas for cloud database');
  console.log('');
  console.log('2. Start the development server:');
  console.log('   npm run dev');
  console.log('');
  console.log('3. Open your browser and navigate to:');
  console.log('   Frontend: http://localhost:3000');
  console.log('   Backend API: http://localhost:5000/api');
  console.log('');
  console.log('🚀 Happy coding with Todofy!');
}

// Handle errors
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error.message);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('❌ Unhandled Rejection:', reason);
  process.exit(1);
});

// Run the setup
main().catch(console.error);