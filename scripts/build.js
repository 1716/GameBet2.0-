#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

console.log('🏗️  Starting GameBet build process...');

// Create build directory
const buildDir = 'build';
if (fs.existsSync(buildDir)) {
  console.log('🧹 Cleaning existing build directory...');
  fs.removeSync(buildDir);
}

fs.ensureDirSync(buildDir);
console.log('📁 Created build directory');

// Copy web application files
const srcDir = 'src';
if (fs.existsSync(srcDir)) {
  console.log('📋 Copying web application files...');
  fs.copySync(srcDir, buildDir);
  console.log('✅ Copied web application files');
} else {
    console.error('Error: src directory not found');
    process.exit(1);
}


// Copy other essential files to build
const filesToCopy = [
  'assetlinks.json',
  'README.md',
  'GameBet.aab',
  'GameBet.apk'
];

console.log('📋 Copying additional files to build directory...');

for (const file of filesToCopy) {
  if (fs.existsSync(file)) {
    fs.copySync(file, path.join(buildDir, file));
    console.log(`✅ Copied ${file}`);
  } else {
    console.warn(`⚠️  ${file} not found, skipping...`);
  }
}

// Create manifest file
const manifest = {
  name: 'GameBet 2.0',
  version: require('../package.json').version,
  buildTime: new Date().toISOString(),
  files: ['index.html', 'style.css', 'main.js', 'assetlinks.json', 'README.md'],
  platform: 'web',
  type: 'pwa'
};

fs.writeJsonSync(path.join(buildDir, 'manifest.json'), manifest, { spaces: 2 });
console.log('📄 Created build manifest');

// Generate checksums
console.log('🔐 Generating checksums...');
const crypto = require('crypto');
const checksums = {};
const allFiles = fs.readdirSync(buildDir);

for (const file of allFiles) {
  const filePath = path.join(buildDir, file);
  if (fs.statSync(filePath).isFile()) {
    const content = fs.readFileSync(filePath);
    checksums[file] = crypto.createHash('sha256').update(content).digest('hex');
  }
}

fs.writeJsonSync(path.join(buildDir, 'checksums.json'), checksums, { spaces: 2 });
console.log('✅ Generated checksums');

console.log('🎉 Build completed successfully!');
console.log(`📦 Build artifacts available in: ${buildDir}/`);
