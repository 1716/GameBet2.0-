#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');

console.log('🧹 Starting cleanup process...');

const dirsToClean = ['build', 'package', 'deploy', 'releases'];

for (const dir of dirsToClean) {
  if (fs.existsSync(dir)) {
    console.log(`🗑️  Removing ${dir}/`);
    fs.removeSync(dir);
  }
}

// Clean node_modules if requested
if (process.argv.includes('--all') || process.argv.includes('--node-modules')) {
  if (fs.existsSync('node_modules')) {
    console.log('🗑️  Removing node_modules/');
    fs.removeSync('node_modules');
  }
}

// Clean package-lock if requested
if (process.argv.includes('--all') || process.argv.includes('--lock')) {
  if (fs.existsSync('package-lock.json')) {
    console.log('🗑️  Removing package-lock.json');
    fs.removeSync('package-lock.json');
  }
}

console.log('✅ Cleanup completed!');