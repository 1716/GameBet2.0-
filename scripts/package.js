#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

console.log('📦 Starting packaging process...');

const packageDir = 'package';
const buildDir = 'build';

// Ensure build exists
if (!fs.existsSync(buildDir)) {
  console.log('🏗️  Build directory not found, running build first...');
  execSync('npm run build', { stdio: 'inherit' });
}

// Create package directory
if (fs.existsSync(packageDir)) {
  console.log('🧹 Cleaning existing package directory...');
  fs.removeSync(packageDir);
}

fs.ensureDirSync(packageDir);

// Create different package types
console.log('📋 Creating distribution packages...');

// 1. Android Package (AAB + APK)
const androidDir = path.join(packageDir, 'android');
fs.ensureDirSync(androidDir);
fs.copySync(path.join(buildDir, 'GameBet.aab'), path.join(androidDir, 'GameBet.aab'));
fs.copySync(path.join(buildDir, 'GameBet.apk'), path.join(androidDir, 'GameBet.apk'));
fs.copySync(path.join(buildDir, 'assetlinks.json'), path.join(androidDir, 'assetlinks.json'));
console.log('✅ Created Android package');

// 2. Web Package
const webDir = path.join(packageDir, 'web');
fs.ensureDirSync(webDir);
fs.copySync(path.join(buildDir, 'assetlinks.json'), path.join(webDir, 'assetlinks.json'));
fs.copySync(path.join(buildDir, 'README.md'), path.join(webDir, 'README.md'));
console.log('✅ Created Web package');

// 3. Complete Package
const completeDir = path.join(packageDir, 'complete');
fs.copySync(buildDir, completeDir);
console.log('✅ Created Complete package');

// Create package info
const packageInfo = {
  name: 'GameBet 2.0 Distribution',
  version: require('../package.json').version,
  packageTime: new Date().toISOString(),
  packages: {
    android: {
      description: 'Android APK and AAB files with asset links',
      files: ['GameBet.aab', 'GameBet.apk', 'assetlinks.json']
    },
    web: {
      description: 'Web deployment files',
      files: ['assetlinks.json', 'README.md']
    },
    complete: {
      description: 'Complete build artifacts',
      files: 'All build files'
    }
  }
};

fs.writeJsonSync(path.join(packageDir, 'package-info.json'), packageInfo, { spaces: 2 });

console.log('🎉 Packaging completed successfully!');
console.log(`📦 Packages available in: ${packageDir}/`);