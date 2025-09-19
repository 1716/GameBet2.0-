#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Starting deployment process...');

const deploymentTarget = process.env.DEPLOY_TARGET || 'staging';
const packageDir = 'package';

// Ensure package exists
if (!fs.existsSync(packageDir)) {
  console.log('📦 Package directory not found, running package first...');
  execSync('npm run package', { stdio: 'inherit' });
}

console.log(`🎯 Deploying to: ${deploymentTarget}`);

// Create deployment directory
const deployDir = path.join('deploy', deploymentTarget);
fs.ensureDirSync(deployDir);

// Copy appropriate package based on deployment target
switch (deploymentTarget) {
  case 'android-store':
    console.log('📱 Preparing Android Store deployment...');
    fs.copySync(path.join(packageDir, 'android'), deployDir);
    
    // Create store listing files
    const storeListing = {
      appName: 'GameBet 2.0',
      packageName: 'app.replit.game_bet_fix_sbuff6912.twa',
      version: require('../package.json').version,
      description: 'Premium Gaming & Betting Platform',
      category: 'Games',
      contentRating: 'Mature 17+',
      deploymentDate: new Date().toISOString()
    };
    
    fs.writeJsonSync(path.join(deployDir, 'store-listing.json'), storeListing, { spaces: 2 });
    break;

  case 'web':
    console.log('🌐 Preparing Web deployment...');
    fs.copySync(path.join(packageDir, 'web'), deployDir);
    
    // Create .htaccess for web server
    const htaccess = `
# GameBet 2.0 Web Configuration
RewriteEngine On

# Force HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Asset Links
<Files "assetlinks.json">
    Header set Content-Type "application/json"
    Header set Access-Control-Allow-Origin "*"
</Files>

# Security Headers
Header always set X-Frame-Options DENY
Header always set X-Content-Type-Options nosniff
Header always set Referrer-Policy "strict-origin-when-cross-origin"
`;
    
    fs.writeFileSync(path.join(deployDir, '.htaccess'), htaccess.trim());
    break;

  default:
    console.log('📋 Preparing staging deployment...');
    fs.copySync(path.join(packageDir, 'complete'), deployDir);
}

// Create deployment manifest
const deploymentManifest = {
  target: deploymentTarget,
  version: require('../package.json').version,
  deploymentDate: new Date().toISOString(),
  files: fs.readdirSync(deployDir),
  checksum: require('crypto').createHash('sha256').update(JSON.stringify(fs.readdirSync(deployDir))).digest('hex')
};

fs.writeJsonSync(path.join(deployDir, 'deployment-manifest.json'), deploymentManifest, { spaces: 2 });

console.log('✅ Deployment preparation completed!');
console.log(`🚀 Deployment files ready in: ${deployDir}/`);
console.log(`📝 Deployment target: ${deploymentTarget}`);

// Create deployment instructions
const instructions = `
# Deployment Instructions for ${deploymentTarget}

## Files Ready for Deployment:
${fs.readdirSync(deployDir).map(file => `- ${file}`).join('\n')}

## Next Steps:
${deploymentTarget === 'android-store' ? 
  '1. Upload GameBet.aab to Google Play Console\n2. Upload assetlinks.json to your web server\n3. Update store listing with store-listing.json data' :
  deploymentTarget === 'web' ?
  '1. Upload files to your web server\n2. Ensure .htaccess is properly configured\n3. Verify assetlinks.json is accessible' :
  '1. Review all files in the deployment directory\n2. Choose appropriate deployment method\n3. Follow platform-specific deployment guides'
}

Generated: ${new Date().toISOString()}
`;

fs.writeFileSync(path.join(deployDir, 'DEPLOYMENT.md'), instructions.trim());

console.log('📋 Deployment instructions created');
console.log('🎉 Ready for deployment!');