# GameBet 2.0 - Premium Gaming & Betting Platform

A Progressive Web App (PWA) gaming and betting platform converted to native Android application.

## 🚀 Quick Start

### Prerequisites
- Node.js 16 or higher
- npm or yarn
- Make (optional, for Makefile commands)

### Installation
```bash
# Clone the repository
git clone https://github.com/1716/GameBet2.0-.git
cd GameBet2.0-

# Install dependencies
npm install

# Or using make
make install
```

### Build and Package
```bash
# Full build process
npm run build

# Package for distribution
npm run package

# Or use make for combined workflow
make build package
```

## 📋 Available Commands

### NPM Scripts
- `npm run verify` - Verify build environment
- `npm run build` - Build the project
- `npm run package` - Package for distribution
- `npm run deploy` - Prepare deployment files
- `npm run release` - Create a new release
- `npm run clean` - Clean build artifacts

### Make Commands
- `make help` - Show all available commands
- `make dev` - Full development workflow
- `make prod` - Full production workflow
- `make info` - Show project information
- `make status` - Show build status

## 📦 Project Structure

```
GameBet2.0-/
├── GameBet.aab          # Android App Bundle
├── GameBet.apk          # Android Package
├── assetlinks.json      # Android App Links verification
├── signing.keystore     # Android signing keystore
├── signing-key-info.txt # Signing key information
├── scripts/             # Build automation scripts
├── .github/workflows/   # CI/CD workflows
├── package.json         # Project configuration
├── Makefile            # Build automation
└── README.md           # This file
```

## 🏗️ Build Process

The build system creates multiple output formats:

### Build Output (`build/`)
- `GameBet.aab` - Android App Bundle
- `GameBet.apk` - Android Package
- `assetlinks.json` - App Links verification
- `manifest.json` - Build manifest
- `checksums.json` - File integrity checksums

### Package Output (`package/`)
- `android/` - Android-specific files
- `web/` - Web deployment files
- `complete/` - All build artifacts

### Deployment Output (`deploy/`)
- `staging/` - Staging deployment
- `web/` - Web server deployment
- `android-store/` - Google Play Store deployment

## 🚀 Deployment

### Android Store Deployment
```bash
# Prepare for Google Play Store
make deploy-android

# Files will be in deploy/android-store/
```

### Web Deployment
```bash
# Prepare for web server
make deploy-web

# Files will be in deploy/web/
```

### Manual Deployment
1. Use files from `package/android/` for Android deployment
2. Use files from `package/web/` for web deployment
3. Upload `assetlinks.json` to `/.well-known/assetlinks.json` on your web server

## 🏷️ Releases

### Automatic Releases
```bash
# Create patch release (1.0.0 -> 1.0.1)
make release-patch

# Create minor release (1.0.0 -> 1.1.0)
make release-minor

# Create major release (1.0.0 -> 2.0.0)
make release-major
```

### Manual Releases
```bash
# Create custom release
npm run release 1.2.3 minor
```

## 🔧 CI/CD

The project includes GitHub Actions workflows:

- **Build** - Automatic build and package on push/PR
- **Release** - Create releases with artifacts
- **Deploy** - Automated deployment preparation

## 📱 App Information

- **Package Name:** `app.replit.game_bet_fix_sbuff6912.twa`
- **Platform:** Android (PWA-based)
- **Content Rating:** Mature 17+
- **Category:** Games

## 🔐 Security

- Signing keystore and credentials are included for development
- Use proper security practices in production
- Regenerate signing keys for production releases

## 📄 License

ISC License - see package.json for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `make test`
5. Submit a pull request

## 📞 Support

For support and documentation, visit the [PWABuilder documentation](https://docs.pwabuilder.com/#/builder/android).