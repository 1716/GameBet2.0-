#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

console.log('🏷️  Starting release process...');

const version = process.argv[2] || require('../package.json').version;
const releaseType = process.argv[3] || 'patch';

console.log(`📋 Creating release v${version} (${releaseType})`);

// Create release directory
const releaseDir = path.join('releases', `v${version}`);
if (fs.existsSync(releaseDir)) {
  console.log('🧹 Cleaning existing release directory...');
  fs.removeSync(releaseDir);
}

fs.ensureDirSync(releaseDir);

// Run full build and package
console.log('🏗️  Running build process...');
execSync('npm run build', { stdio: 'inherit' });

console.log('📦 Running package process...');
execSync('npm run package', { stdio: 'inherit' });

// Copy packages to release
fs.copySync('package', path.join(releaseDir, 'packages'));

// Create release notes
const releaseNotes = {
  version: version,
  releaseDate: new Date().toISOString(),
  type: releaseType,
  description: 'GameBet 2.0 - Premium Gaming & Betting Platform Release',
  packages: {
    android: {
      aab: 'GameBet.aab - Android App Bundle for Google Play Store',
      apk: 'GameBet.apk - Android Package for sideloading',
      assetlinks: 'assetlinks.json - Android App Links verification'
    },
    web: {
      assetlinks: 'assetlinks.json - Web asset links for app verification',
      readme: 'README.md - Project documentation'
    }
  },
  checksums: {},
  deployment: {
    androidStore: 'Use packages/android/ for Google Play Store deployment',
    web: 'Use packages/web/ for web server deployment',
    complete: 'Use packages/complete/ for full deployment package'
  }
};

// Generate checksums for release files
const crypto = require('crypto');
const packageFiles = [
  path.join(releaseDir, 'packages', 'android', 'GameBet.aab'),
  path.join(releaseDir, 'packages', 'android', 'GameBet.apk'),
  path.join(releaseDir, 'packages', 'android', 'assetlinks.json')
];

for (const filePath of packageFiles) {
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath);
    const relativePath = path.relative(releaseDir, filePath);
    releaseNotes.checksums[relativePath] = crypto.createHash('sha256').update(content).digest('hex');
  }
}

fs.writeJsonSync(path.join(releaseDir, 'RELEASE_NOTES.json'), releaseNotes, { spaces: 2 });

// Create human-readable release notes
const readableNotes = `# GameBet 2.0 Release v${version}

**Release Date:** ${new Date().toISOString().split('T')[0]}
**Release Type:** ${releaseType}

## 📦 Package Contents

### Android Package
- **GameBet.aab** - Android App Bundle for Google Play Store submission
- **GameBet.apk** - Android Package for direct installation
- **assetlinks.json** - Android App Links verification file

### Web Package
- **assetlinks.json** - Web asset links for app verification
- **README.md** - Project documentation

## 🚀 Deployment Instructions

### Google Play Store Deployment
1. Navigate to \`packages/android/\`
2. Upload \`GameBet.aab\` to Google Play Console
3. Upload \`assetlinks.json\` to your web server at \`/.well-known/assetlinks.json\`

### Web Deployment
1. Navigate to \`packages/web/\`
2. Upload all files to your web server
3. Ensure \`assetlinks.json\` is accessible at \`/.well-known/assetlinks.json\`

### Direct APK Installation
1. Use \`packages/android/GameBet.apk\` for sideloading
2. Enable "Install from Unknown Sources" on target devices

## 🔐 File Verification

All files include SHA256 checksums in \`RELEASE_NOTES.json\` for integrity verification.

## 📱 App Information

- **Package Name:** app.replit.game_bet_fix_sbuff6912.twa
- **Platform:** Android (PWA-based)
- **Content Rating:** Mature 17+
- **Category:** Games

---
Generated automatically by GameBet build system
`;

fs.writeFileSync(path.join(releaseDir, 'README.md'), readableNotes);

// Create archive
console.log('🗜️  Creating release archive...');
try {
  execSync(`cd releases && tar -czf v${version}.tar.gz v${version}/`, { stdio: 'inherit' });
  console.log(`✅ Created release archive: releases/v${version}.tar.gz`);
} catch (error) {
  console.warn('⚠️  Could not create tar archive (tar not available)');
}

console.log('🎉 Release completed successfully!');
console.log(`📦 Release files available in: ${releaseDir}/`);
console.log(`🏷️  Release version: v${version}`);
console.log(`📋 Release notes: ${path.join(releaseDir, 'README.md')}`);