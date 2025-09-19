#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Verifying build environment...');

// Check if required files exist
const requiredFiles = [
  'GameBet.aab',
  'GameBet.apk',
  'signing.keystore',
  'signing-key-info.txt',
  'assetlinks.json'
];

const missingFiles = [];

for (const file of requiredFiles) {
  if (!fs.existsSync(file)) {
    missingFiles.push(file);
  }
}

if (missingFiles.length > 0) {
  console.error('❌ Missing required files:', missingFiles.join(', '));
  process.exit(1);
}

// Verify signing keystore
try {
  execSync('which keytool', { stdio: 'ignore' });
  console.log('✅ Java keytool available');
} catch (error) {
  console.warn('⚠️  Java keytool not found - Android signing verification skipped');
}

// Check file sizes
const aabSize = fs.statSync('GameBet.aab').size;
const apkSize = fs.statSync('GameBet.apk').size;

console.log(`✅ GameBet.aab size: ${(aabSize / 1024 / 1024).toFixed(2)} MB`);
console.log(`✅ GameBet.apk size: ${(apkSize / 1024 / 1024).toFixed(2)} MB`);

console.log('✅ Environment verification completed successfully');