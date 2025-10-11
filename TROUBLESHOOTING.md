# GameBet 2.0 - Troubleshooting Guide

This guide helps you diagnose and resolve common issues with GameBet 2.0 build, deployment, and runtime operations.

## Table of Contents

- [Build Issues](#build-issues)
- [Deployment Issues](#deployment-issues)
- [Android Issues](#android-issues)
- [Web Issues](#web-issues)
- [CI/CD Issues](#cicd-issues)
- [Server Issues](#server-issues)
- [Development Environment Issues](#development-environment-issues)
- [Performance Issues](#performance-issues)

---

## Build Issues

### Issue: "Cannot find module 'fs-extra'"

**Symptom:**
```
Error: Cannot find module 'fs-extra'
```

**Solution:**
```bash
# Install dependencies
npm install

# If that doesn't work, clean and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Prevention:**
Always run `npm install` after cloning or pulling changes.

---

### Issue: "Java keytool not available"

**Symptom:**
```
⚠️  Java keytool not available
```

**Solution:**

**On Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install openjdk-11-jdk
```

**On macOS:**
```bash
brew install openjdk@11
```

**On Windows:**
1. Download JDK from [Oracle](https://www.oracle.com/java/technologies/downloads/)
2. Install and add to PATH
3. Verify: `java -version`

**Verification:**
```bash
keytool -help
```

---

### Issue: "Build directory already exists"

**Symptom:**
Build fails with errors about existing files.

**Solution:**
```bash
# Clean previous builds
npm run clean

# Or manually
rm -rf build/ package/ deploy/ releases/

# Then rebuild
npm run build
```

---

### Issue: "Permission denied" during build

**Symptom:**
```
EACCES: permission denied
```

**Solution:**

**On Linux/macOS:**
```bash
# Fix script permissions
chmod +x scripts/*.js

# Fix file ownership
sudo chown -R $USER:$USER .
```

**On Windows:**
Run terminal as Administrator or check antivirus settings.

---

### Issue: Build succeeds but files are missing

**Symptom:**
Build completes but `build/` directory is empty or missing files.

**Diagnosis:**
```bash
# Check build status
make status

# Verify source files exist
ls -la GameBet.aab GameBet.apk assetlinks.json
```

**Solution:**
```bash
# Ensure source files are present
# If missing, restore from Git
git checkout GameBet.aab GameBet.apk assetlinks.json

# Rebuild
npm run clean
npm run build
```

---

## Deployment Issues

### Issue: "Deploy target not recognized"

**Symptom:**
```
Unknown deployment target
```

**Solution:**
```bash
# Valid targets: staging, web, android-store
DEPLOY_TARGET=web npm run deploy

# Or use make commands
make deploy-web
make deploy-android
```

---

### Issue: ".htaccess not working"

**Symptom:**
Security headers or redirects not applied on Apache server.

**Diagnosis:**
```bash
# Check if mod_rewrite is enabled
apache2ctl -M | grep rewrite

# Check AllowOverride setting
grep -r "AllowOverride" /etc/apache2/
```

**Solution:**
```bash
# Enable mod_rewrite and mod_headers
sudo a2enmod rewrite
sudo a2enmod headers

# Update virtual host configuration
sudo nano /etc/apache2/sites-available/000-default.conf

# Add/modify:
<Directory /var/www/html>
    AllowOverride All
</Directory>

# Restart Apache
sudo systemctl restart apache2
```

**Verification:**
```bash
curl -I https://yourdomain.com | grep -i "x-frame-options"
```

---

### Issue: "assetlinks.json not accessible"

**Symptom:**
Android App Links not working, assetlinks.json returns 404.

**Diagnosis:**
```bash
# Test accessibility
curl https://yourdomain.com/.well-known/assetlinks.json

# Check file location
ls -la /var/www/html/.well-known/assetlinks.json
```

**Solution:**

**On Apache:**
```apache
# Add to virtual host config
Alias /.well-known /var/www/html/.well-known
<Directory /var/www/html/.well-known>
    Require all granted
    Options -Indexes
</Directory>
```

**On Nginx:**
```nginx
location /.well-known/ {
    allow all;
}
```

**Create directory and upload file:**
```bash
# Create directory
sudo mkdir -p /var/www/html/.well-known

# Copy file
sudo cp deploy/web/assetlinks.json /var/www/html/.well-known/

# Set permissions
sudo chmod 644 /var/www/html/.well-known/assetlinks.json
```

---

### Issue: SSL certificate errors

**Symptom:**
```
SSL certificate problem: unable to get local issuer certificate
```

**Solution:**

**Using Let's Encrypt:**
```bash
# Install certbot
sudo apt-get install certbot python3-certbot-apache

# Get certificate
sudo certbot --apache -d yourdomain.com

# Verify renewal
sudo certbot renew --dry-run
```

**Check certificate:**
```bash
openssl s_client -connect yourdomain.com:443 -servername yourdomain.com
```

---

## Android Issues

### Issue: "App not installed" on Android

**Symptom:**
Android shows "App not installed" error when installing APK.

**Possible Causes:**

1. **Insufficient Storage**
   - Free up at least 100MB
   - Clear cache of other apps

2. **Incompatible Android Version**
   - GameBet requires Android 5.0+
   - Check device version in Settings > About Phone

3. **Corrupted APK**
   ```bash
   # Verify checksum
   sha256sum GameBet.apk
   # Compare with checksums.json
   ```

4. **Signature Conflict**
   - Uninstall old version first
   - Settings > Apps > GameBet > Uninstall

**Solution:**
```bash
# On device:
# 1. Uninstall old version
# 2. Redownload APK
# 3. Verify download is complete
# 4. Retry installation
```

---

### Issue: "Unknown sources" setting not found

**Symptom:**
Can't find setting to enable app installation.

**Solution:**

**Android 8.0+:**
1. Go to Settings > Apps
2. Tap menu (⋮) > Special access
3. Tap "Install unknown apps"
4. Select your browser or file manager
5. Enable "Allow from this source"

**Android 7.0 and below:**
1. Go to Settings > Security
2. Enable "Unknown sources"

---

### Issue: App crashes on startup

**Symptom:**
App opens briefly then closes.

**Diagnosis:**
```bash
# Connect device via USB
# Enable USB debugging in Developer Options

# View logs
adb logcat | grep GameBet

# Or view all crash logs
adb logcat *:E
```

**Common Causes:**

1. **WebView Issues**
   - Update Android System WebView in Play Store

2. **Memory Issues**
   - Close other apps
   - Restart device

3. **Corrupted Data**
   - Clear app data: Settings > Apps > GameBet > Storage > Clear Data

---

### Issue: Signing key mismatch

**Symptom:**
```
Signature verification failed
```

**Solution:**
```bash
# For development, use the provided keys
# For production, ensure you're using the same key for updates

# Check key fingerprint
keytool -list -v -keystore signing.keystore -alias my-key-alias
```

**Important:** Never change signing keys for published apps!

---

## Web Issues

### Issue: "Service Worker registration failed"

**Symptom:**
PWA features not working, console shows Service Worker errors.

**Requirements:**
- HTTPS required (except localhost)
- Valid SSL certificate
- Service Worker file accessible

**Solution:**
```bash
# Check if HTTPS is enabled
curl -I https://yourdomain.com

# Verify service worker file
curl https://yourdomain.com/service-worker.js

# Check console for specific errors
# Open browser DevTools > Console
```

---

### Issue: PWA install prompt not showing

**Symptom:**
"Add to Home Screen" prompt doesn't appear.

**Requirements:**
- [ ] HTTPS enabled
- [ ] manifest.json present and valid
- [ ] Service worker registered
- [ ] User engagement (several visits)

**Diagnosis:**
```javascript
// In browser console:
// Check manifest
fetch('/manifest.json').then(r => r.json()).then(console.log)

// Check Service Worker
navigator.serviceWorker.getRegistrations().then(console.log)
```

**Solution:**
1. Verify manifest.json is accessible
2. Check manifest for errors (DevTools > Application > Manifest)
3. Ensure all icons exist
4. Wait for engagement threshold (visit site multiple times)

---

### Issue: CORS errors

**Symptom:**
```
Access to fetch at '...' has been blocked by CORS policy
```

**Solution:**

**In server.js:**
```javascript
const cors = require('cors');

// Allow all origins (development only)
app.use(cors());

// Or specify origins (production)
app.use(cors({
  origin: ['https://yourdomain.com'],
  credentials: true
}));
```

**Verify CORS headers:**
```bash
curl -I -X OPTIONS https://yourdomain.com/api/endpoint
```

---

### Issue: Static files not loading

**Symptom:**
CSS/JS files return 404 errors.

**Diagnosis:**
```bash
# Check file paths
curl -I https://yourdomain.com/styles.css
curl -I https://yourdomain.com/main.js
```

**Solution:**

**Apache:**
```apache
# In .htaccess
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    # Don't rewrite files that exist
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.*)$ index.html [L]
</IfModule>
```

**Nginx:**
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

---

## CI/CD Issues

### Issue: GitHub Actions workflow fails

**Symptom:**
Workflow status shows red X on GitHub.

**Diagnosis:**
1. Click on failed workflow
2. Click on failed job
3. Expand failed step to see error

**Common Issues:**

#### Missing Dependencies
```yaml
# Ensure this is in workflow:
- name: Install dependencies
  run: npm ci
```

#### Build Failures
```bash
# Test locally first
npm run verify
npm run build
```

#### Upload Artifact Failures
```yaml
# Check artifact paths exist
- name: Upload artifacts
  uses: actions/upload-artifact@v3
  with:
    name: build-output
    path: |
      build/
      package/
```

---

### Issue: "secrets not found" in GitHub Actions

**Symptom:**
```
Error: Input required and not supplied: FIREBASE_TOKEN
```

**Solution:**
1. Go to repository Settings > Secrets and variables > Actions
2. Click "New repository secret"
3. Add required secrets:
   - FIREBASE_TOKEN
   - GOOGLE_PLAY_KEY (if deploying to Play Store)
   - ANDROID_SIGNING_KEY (for production signing)

**Get Firebase token:**
```bash
firebase login:ci
# Copy token and add to GitHub secrets
```

---

### Issue: Release workflow not triggering

**Symptom:**
Pushing tag doesn't trigger release workflow.

**Diagnosis:**
```bash
# Check workflow trigger configuration
cat .github/workflows/release.yml | grep "on:"
```

**Solution:**
```bash
# Ensure tag format matches (v*.*.*)
git tag v1.0.0
git push origin v1.0.0

# Or trigger manually
# Go to Actions > Release > Run workflow
```

---

## Server Issues

### Issue: "Port already in use"

**Symptom:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:**

**Find process using port:**
```bash
# Linux/macOS
lsof -i :3000
# Or
netstat -tulpn | grep 3000

# Windows
netstat -ano | findstr :3000
```

**Kill process:**
```bash
# Linux/macOS
kill -9 <PID>

# Windows
taskkill /PID <PID> /F

# Or use different port
PORT=3001 npm start
```

---

### Issue: Database connection errors

**Symptom:**
```
Error: Cannot connect to database
```

**Solution:**

**Check database file:**
```bash
# Verify db.json exists
ls -la db.json

# Check permissions
chmod 644 db.json
```

**Initialize database:**
```javascript
// In database.js, ensure initialization
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db.json');
const db = low(adapter);

// Set defaults
db.defaults({ users: [], games: [], bets: [] }).write();
```

---

### Issue: JWT authentication errors

**Symptom:**
```
Error: jwt malformed
```

**Solution:**

**Check JWT_SECRET:**
```bash
# Ensure JWT_SECRET is set
echo $JWT_SECRET

# Or in .env file
cat .env | grep JWT_SECRET
```

**Regenerate tokens:**
```javascript
// Clear old tokens from database
// Force users to log in again
```

---

## Development Environment Issues

### Issue: "npm install" fails

**Symptom:**
```
npm ERR! code ENOENT
```

**Solution:**

**Clear npm cache:**
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Use specific npm version:**
```bash
npm install -g npm@8
npm install
```

**Check Node version:**
```bash
node --version
# Should be 16+ (18 recommended)

# Update if needed
nvm install 18
nvm use 18
```

---

### Issue: Make commands not working

**Symptom:**
```
make: command not found
```

**Solution:**

**Install make:**

**Linux:**
```bash
sudo apt-get install build-essential
```

**macOS:**
```bash
xcode-select --install
```

**Windows:**
```bash
choco install make
# Or use WSL (Windows Subsystem for Linux)
```

**Alternative:** Use npm scripts directly
```bash
# Instead of: make build
# Use: npm run build
```

---

### Issue: Git merge conflicts

**Symptom:**
```
CONFLICT (content): Merge conflict in <file>
```

**Solution:**
```bash
# View conflicts
git status

# Edit conflicted files
# Look for markers: <<<<<<<, =======, >>>>>>>

# After resolving
git add <resolved-files>
git commit

# Or abort merge
git merge --abort
```

---

## Performance Issues

### Issue: Slow build times

**Symptom:**
Build takes several minutes.

**Solution:**

**Use build cache:**
```bash
# In GitHub Actions, ensure cache is configured:
- uses: actions/cache@v3
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
```

**Local optimization:**
```bash
# Use npm ci instead of npm install (faster)
npm ci

# Parallel execution
# Run independent tasks in parallel
```

---

### Issue: Large file sizes

**Symptom:**
APK/AAB files are very large.

**Solution:**

**Optimize assets:**
```bash
# Compress images
# Use WebP format for images
# Minify JavaScript/CSS (already done in build)
```

**Check file sizes:**
```bash
ls -lh package/android/
```

**Expected sizes:**
- GameBet.aab: ~4MB
- GameBet.apk: ~6MB

---

### Issue: High memory usage

**Symptom:**
Node process uses excessive memory.

**Solution:**

**Increase Node memory:**
```bash
# Set memory limit
export NODE_OPTIONS=--max-old-space-size=4096

# Then run build
npm run build
```

**Monitor memory:**
```bash
# Check memory during build
top
# Or
htop
```

---

## Getting More Help

### Diagnostic Commands

Run these to gather information:

```bash
# System information
node --version
npm --version
java -version
make --version

# Project status
make status
npm run verify

# Check logs
cat /var/log/apache2/error.log  # Apache
cat /var/log/nginx/error.log    # Nginx
journalctl -u apache2 -n 50     # Systemd

# Git status
git status
git log --oneline -n 5
```

### Reporting Issues

When reporting issues, include:

1. **Error Message:** Full error text
2. **Environment:** OS, Node version, npm version
3. **Steps to Reproduce:** Exact commands run
4. **Expected vs Actual:** What should happen vs what happens
5. **Logs:** Relevant log excerpts
6. **Diagnostic Output:** Results from commands above

### Create Issue Template

```markdown
**Environment:**
- OS: [e.g., Ubuntu 20.04]
- Node.js: [e.g., 18.17.0]
- npm: [e.g., 8.19.0]

**Command Run:**
```bash
npm run build
```

**Error Message:**
```
[Paste full error message]
```

**Steps to Reproduce:**
1. Clone repository
2. Run npm install
3. Run npm run build
4. Error occurs

**Expected Behavior:**
Build should complete successfully.

**Actual Behavior:**
Build fails with error above.

**Additional Context:**
[Any other relevant information]
```

---

## Additional Resources

- [Node.js Documentation](https://nodejs.org/docs/)
- [npm Documentation](https://docs.npmjs.com/)
- [Apache Documentation](https://httpd.apache.org/docs/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Android Developer Guide](https://developer.android.com/guide)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

---

*Last Updated: 2025-10-11*  
*Version: 1.0.0*
