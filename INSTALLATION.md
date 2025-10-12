# GameBet 2.0 - Complete Installation Guide

This guide provides comprehensive installation instructions for GameBet 2.0 across all platforms and environments.

## Table of Contents

- [System Requirements](#system-requirements)
- [Development Environment Setup](#development-environment-setup)
- [Production Environment Setup](#production-environment-setup)
- [Android Installation](#android-installation)
- [Web Installation](#web-installation)
- [CI/CD Setup](#cicd-setup)
- [Verification](#verification)

---

## System Requirements

### Development Requirements

#### Minimum Requirements
- **Operating System**: Windows 10+, macOS 10.15+, or Linux (Ubuntu 18.04+)
- **Node.js**: Version 16.x or higher (18.x recommended)
- **npm**: Version 8.x or higher
- **RAM**: 4GB minimum, 8GB recommended
- **Disk Space**: 2GB free space

#### Additional Tools (Optional but Recommended)
- **Make**: For using Makefile commands (pre-installed on macOS/Linux)
- **Git**: Version 2.x or higher
- **Java JDK**: Version 11 or higher (for Android signing operations)
- **Code Editor**: VS Code, Sublime Text, or similar

### Production Requirements

#### For Web Deployment
- Web server: Apache 2.4+ or Nginx 1.18+
- HTTPS certificate (required for PWA features)
- Domain name with DNS configured

#### For Android Deployment
- Google Play Console account
- Android signing keystore (for production)
- Google Play Developer account ($25 one-time fee)

---

## Development Environment Setup

### Step 1: Install Node.js and npm

#### On Windows:
1. Download Node.js installer from [nodejs.org](https://nodejs.org/)
2. Run the installer and follow the prompts
3. Verify installation:
   ```powershell
   node --version
   npm --version
   ```

#### On macOS:
Using Homebrew:
```bash
brew install node@18
node --version
npm --version
```

Or download from [nodejs.org](https://nodejs.org/)

#### On Linux (Ubuntu/Debian):
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
node --version
npm --version
```

### Step 2: Install Java JDK (for Android operations)

#### On Windows:
1. Download from [Oracle JDK](https://www.oracle.com/java/technologies/downloads/) or [OpenJDK](https://adoptium.net/)
2. Install and add to PATH
3. Verify: `java -version`

#### On macOS:
```bash
brew install openjdk@11
java -version
```

#### On Linux:
```bash
sudo apt-get update
sudo apt-get install openjdk-11-jdk
java -version
```

### Step 3: Install Make (Optional)

#### On Windows:
- Install via Chocolatey: `choco install make`
- Or use Windows Subsystem for Linux (WSL)

#### On macOS:
```bash
# Usually pre-installed, verify with:
make --version

# If not installed:
xcode-select --install
```

#### On Linux:
```bash
sudo apt-get install build-essential
make --version
```

### Step 4: Clone the Repository

```bash
# Using HTTPS
git clone https://github.com/1716/GameBet2.0-.git
cd GameBet2.0-

# Or using SSH
git clone git@github.com:1716/GameBet2.0-.git
cd GameBet2.0-
```

### Step 5: Install Project Dependencies

```bash
# Using npm
npm install

# Or using make
make install
```

This will install all required dependencies:
- `express` - Web server framework
- `fs-extra` - Enhanced file system operations
- `jsonwebtoken` - JWT authentication
- `bcryptjs` - Password hashing
- `lowdb` - JSON database
- `cors` - Cross-origin resource sharing
- And other development dependencies

### Step 6: Verify Installation

```bash
# Verify the environment
npm run verify

# Or using make
make verify
```

Expected output:
```
🔍 Verifying build environment...
✅ Java keytool available
✅ GameBet.aab size: 3.82 MB
✅ GameBet.apk size: 6.10 MB
✅ Environment verification completed successfully
```

---

## Production Environment Setup

### For Production Deployment

1. **Create Production Environment Variables**
   ```bash
   # Create .env file (not committed to repo)
   cat > .env << EOF
   NODE_ENV=production
   PORT=3000
   JWT_SECRET=your-secure-random-secret-key
   DEPLOY_TARGET=production
   EOF
   ```

2. **Generate Production Signing Keys**
   ```bash
   # Generate new keystore for production
   keytool -genkey -v -keystore signing.keystore \
     -alias gamebet-production \
     -keyalg RSA \
     -keysize 2048 \
     -validity 10000
   
   # Store keystore credentials securely
   # DO NOT commit production keys to version control
   ```

3. **Update Configuration**
   - Replace demo signing keys with production keys
   - Update `signing-key-info.txt` with production credentials
   - Configure Firebase credentials (if using Firebase)
   - Set up Google Play Console credentials

---

## Android Installation

### For End Users

#### Method 1: Google Play Store (Recommended)
1. Open Google Play Store on your Android device
2. Search for "GameBet 2.0"
3. Tap "Install"
4. Open the app once installed

#### Method 2: Direct APK Installation (Sideloading)

**Prerequisites:**
- Android 5.0 (Lollipop) or higher
- At least 100MB free storage

**Steps:**

1. **Download the APK**
   - Download `GameBet.apk` from the latest GitHub release
   - Or from your organization's distribution server

2. **Enable Unknown Sources**
   - Go to **Settings > Security**
   - Enable **Unknown sources** or **Install unknown apps**
   - (On Android 8.0+: Settings > Apps > Special access > Install unknown apps)

3. **Install the APK**
   - Open your file manager
   - Navigate to the downloaded `GameBet.apk`
   - Tap the file to start installation
   - Follow on-screen prompts
   - Tap "Install" to confirm

4. **Verify Installation**
   - Look for the GameBet icon in your app drawer
   - Open the app to verify it launches correctly

**Troubleshooting:**
- If installation is blocked, ensure "Unknown sources" is enabled
- Check if you have sufficient storage space
- Verify the APK file is not corrupted (check SHA256 checksum)

### For Developers

#### Building the APK

```bash
# Full build process
npm run build

# Package for distribution
npm run package

# APK will be in package/android/GameBet.apk
```

#### Signing the APK

The APK is automatically signed during the build process using the keystore in the repository.

For production, replace with your own keystore:
```bash
# Create production keystore
keytool -genkey -v -keystore production.keystore \
  -alias gamebet-key \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000

# Update signing configuration in build scripts
```

---

## Web Installation

### Deployment to Web Server

#### Step 1: Build Web Package

```bash
# Build and package for web
npm run build
npm run package

# Or using make
make build package
```

#### Step 2: Prepare Web Deployment

```bash
# Create web deployment files
DEPLOY_TARGET=web npm run deploy

# Or using make
make deploy-web
```

Files will be in `deploy/web/`:
- `assetlinks.json` - App verification file
- `.htaccess` - Apache configuration
- `README.md` - Documentation
- `DEPLOYMENT.md` - Deployment instructions

#### Step 3: Upload to Web Server

**For Apache:**
```bash
# Upload files via SCP
scp -r deploy/web/* user@yourserver.com:/var/www/html/

# Or using FTP/SFTP client
```

**For Nginx:**
1. Upload files to web root
2. Configure nginx.conf with equivalent rules to .htaccess
3. Reload Nginx: `sudo nginx -s reload`

#### Step 4: Configure App Links

Upload `assetlinks.json` to:
```
https://yourdomain.com/.well-known/assetlinks.json
```

Verify it's accessible:
```bash
curl https://yourdomain.com/.well-known/assetlinks.json
```

#### Step 5: Enable HTTPS

PWA features require HTTPS. Use Let's Encrypt for free SSL:

```bash
# Install certbot
sudo apt-get install certbot python3-certbot-apache

# Get certificate
sudo certbot --apache -d yourdomain.com

# Auto-renewal
sudo certbot renew --dry-run
```

### Deployment to Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Deploy
firebase deploy --only hosting

# Or using npm script
npm run deploy-firebase
```

---

## CI/CD Setup

### GitHub Actions Setup

The repository includes pre-configured GitHub Actions workflows:

#### 1. Build Workflow (`.github/workflows/build.yml`)
- Triggered on: Push to main/develop, Pull requests
- Actions: Build, package, test, upload artifacts
- Artifacts retained for 30-90 days

#### 2. Release Workflow (`.github/workflows/release.yml`)
- Triggered on: Version tags (v*.*.*)
- Actions: Create release, build packages, publish to GitHub
- Manual trigger available via workflow_dispatch

#### 3. Deploy Workflow (`.github/workflows/deploy.yml`)
- Triggered on: Push to main
- Actions: Deploy to Firebase hosting

### Required Secrets

Configure these in GitHub repository settings (Settings > Secrets and variables > Actions):

```bash
FIREBASE_TOKEN          # Firebase deployment token
GOOGLE_PLAY_KEY        # Google Play API key (JSON)
ANDROID_SIGNING_KEY    # Production signing key (base64 encoded)
ANDROID_SIGNING_PASS   # Keystore password
ANDROID_KEY_ALIAS      # Key alias name
```

### Setting Up Firebase Token

```bash
# Generate Firebase token
firebase login:ci

# Copy the token and add to GitHub secrets as FIREBASE_TOKEN
```

### Triggering Manual Release

```bash
# Via GitHub UI:
# 1. Go to Actions > Release > Run workflow
# 2. Enter version and release type
# 3. Click "Run workflow"

# Via GitHub CLI:
gh workflow run release.yml -f version=1.0.0 -f release_type=minor
```

---

## Verification

### Verify Complete Installation

```bash
# Check all components
make status

# Expected output:
# Build Status
# ============
# Build directory: ✅ exists (or ❌ missing if not built yet)
# Package directory: ✅ exists (or ❌ missing if not packaged yet)
# Deploy directory: ✅ exists (or ❌ missing if not deployed yet)
# Release directory: ✅ exists (or ❌ missing if no releases yet)
```

### Run Full Build Test

```bash
# Development workflow
make dev

# Or step by step:
npm run clean
npm run verify
npm run build
npm run package

# Check outputs
ls -la build/
ls -la package/
```

### Verify Android Package

```bash
# Check APK integrity
cd package/android/

# On Linux/macOS:
sha256sum GameBet.apk

# Compare with checksums in build/checksums.json
```

### Verify Web Deployment

```bash
# Check web package
cd deploy/web/

# Verify assetlinks.json is valid JSON
cat assetlinks.json | jq .

# Check if all required files exist
ls -la
```

---

## Post-Installation Steps

### 1. Update Configuration

Edit necessary configuration files:
- `package.json` - Update version, author, repository URL
- `assetlinks.json` - Update package name and SHA256 fingerprints
- `firebase.json` - Update Firebase project ID
- `.firebaserc` - Update project aliases

### 2. Set Up Git Hooks (Optional)

```bash
# Install husky for git hooks
npm install --save-dev husky

# Set up pre-commit hook
npx husky install
npx husky add .husky/pre-commit "npm run verify"
```

### 3. Configure IDE (Optional)

**VS Code:**
Create `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "eslint.enable": true,
  "eslint.validate": ["javascript"]
}
```

### 4. Set Up Development Server

```bash
# Start development server
npm start

# Server will run on http://localhost:3000
# Access the web app at that URL
```

---

## Next Steps

After successful installation:

1. **Review Documentation**
   - Read [USAGE.md](USAGE.md) for build system usage
   - Read [ARCHITECTURE.md](ARCHITECTURE.md) for system architecture
   - Read [DEPLOYMENT.md](DEPLOYMENT.md) for deployment guides

2. **Run First Build**
   ```bash
   make dev
   ```

3. **Test the Application**
   - Test Android APK on physical device or emulator
   - Test web version in browser
   - Verify all features work correctly

4. **Set Up Version Control**
   ```bash
   git checkout -b develop
   # Make your changes
   git commit -m "Initial setup"
   git push origin develop
   ```

5. **Configure CI/CD**
   - Add required secrets to GitHub
   - Test workflows by creating a test commit
   - Verify artifacts are generated correctly

---

## Getting Help

If you encounter issues during installation:

1. Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for common problems
2. Run `make status` to diagnose build system issues
3. Run `npm run verify` to check environment
4. Review logs in `.github/workflows/` for CI/CD issues
5. Open an issue on GitHub with detailed error messages

---

## Additional Resources

- [Official Documentation](https://github.com/1716/GameBet2.0-)
- [PWA Builder Documentation](https://docs.pwabuilder.com/)
- [Android App Links Guide](https://developer.android.com/training/app-links)
- [Firebase Hosting Guide](https://firebase.google.com/docs/hosting)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

---

*Last Updated: 2025-10-11*  
*Version: 1.0.0*
