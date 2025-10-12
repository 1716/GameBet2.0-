# GameBet 2.0 - Premium Gaming & Betting Platform

A Progressive Web App (PWA) gaming and betting platform converted to native Android application.

## 📚 Documentation

**[📖 Complete Documentation Index](DOCS.md)** - Browse all documentation with detailed descriptions

### Quick Links

- **[Installation Guide](INSTALLATION.md)** - Complete setup instructions for all platforms
- **[Deployment Guide](DEPLOYMENT.md)** - Step-by-step deployment to Play Store, web servers, Firebase
- **[API Documentation](API.md)** - Complete API reference with examples
- **[Architecture](ARCHITECTURE.md)** - System architecture and design
- **[Usage Guide](USAGE.md)** - Practical examples and common workflows
- **[Contributing](CONTRIBUTING.md)** - How to contribute to the project
- **[Troubleshooting](TROUBLESHOOTING.md)** - Solutions for common issues
- **[Security](SECURITY.md)** - Security policies and best practices
- **[Changelog](CHANGELOG.md)** - Version history and release notes
- **[Workflows](/.github/workflows/README.md)** - CI/CD workflow documentation

## 🚀 Quick Start

### Prerequisites
- Node.js 16 or higher
- npm or yarn
- Make (optional, for Makefile commands)

For detailed requirements, see [INSTALLATION.md](INSTALLATION.md).

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

For complete installation instructions including Android and web deployment, see [INSTALLATION.md](INSTALLATION.md).

### Build and Package
```bash
# Full build process
npm run build

# Package for distribution
npm run package

# Or use make for combined workflow
make build package
```

For detailed build instructions and troubleshooting, see [USAGE.md](USAGE.md).

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
- `make launch` - Launch development server
- `make launch-dev` - Launch with verification
- `make launch-prod` - Launch production build
- `make launch-debug` - Launch with debugging
- `make info` - Show project information
- `make status` - Show build status

### Launch Script
```bash
# Quick launch options
./launch.sh dev      # Development server
./launch.sh prod     # Production server  
./launch.sh debug    # Debug mode
./launch.sh build    # Build project
./launch.sh verify   # Verify environment
./launch.sh status   # Show status
./launch.sh help     # Show help
```

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

The project includes comprehensive GitHub Actions workflows:

- **Automated Build** - Automatic build, package, and quality checks on push/PR
- **Build and Package** - Traditional build and test workflow
- **Release** - Create releases with artifacts and publish to GitHub
- **Deploy** - Automated deployment to Firebase Hosting

### Workflow Features

- ✅ Automated APK and AAB building
- ✅ Quality checks and validation
- ✅ Artifact retention for 30-90 days
- ✅ Multiple deployment targets (staging, web, android-store)
- ✅ Manual workflow triggers
- ✅ Build status notifications

For CI/CD setup and configuration, see [INSTALLATION.md](INSTALLATION.md#cicd-setup).

## 📱 App Information

- **Package Name:** `app.replit.game_bet_fix_sbuff6912.twa`
- **Platform:** Android (PWA-based)
- **Content Rating:** Mature 17+
- **Category:** Games
- **Version:** 1.0.0

## 🔐 Security

**⚠️ Important Security Notice:**

- Demo signing keystore included for **development only**
- **Never use demo keys in production!**
- Regenerate signing keys for production releases
- Use environment variables for sensitive configs

For complete security guidelines, see [SECURITY.md](SECURITY.md).

### Quick Security Checklist

- [ ] Replace demo signing keys with production keys
- [ ] Set secure JWT_SECRET environment variable
- [ ] Enable HTTPS for web deployment
- [ ] Configure proper CORS settings
- [ ] Implement rate limiting
- [ ] Review security best practices

See [SECURITY.md](SECURITY.md) for detailed security requirements.

## 📄 License

ISC License - see package.json for details

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guide](CONTRIBUTING.md) for details on:

- Code of conduct
- Development workflow
- Coding standards
- Commit conventions
- Pull request process
- Testing requirements

### Quick Contribution Steps

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes following our [coding standards](CONTRIBUTING.md#coding-standards)
4. Run verification: `npm run verify`
5. Commit your changes (`git commit -m 'feat: add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

For detailed guidelines, see [CONTRIBUTING.md](CONTRIBUTING.md).

## 📞 Support

### Getting Help

- 📖 Check [Documentation](INSTALLATION.md) for setup and usage
- 🔧 Review [Troubleshooting Guide](TROUBLESHOOTING.md) for common issues
- 🐛 [Open an issue](https://github.com/1716/GameBet2.0-/issues) for bugs
- 💬 Start a [discussion](https://github.com/1716/GameBet2.0-/discussions) for questions

### Additional Resources

- [PWABuilder Documentation](https://docs.pwabuilder.com/#/builder/android)
- [Android App Links Guide](https://developer.android.com/training/app-links)
- [Firebase Hosting Guide](https://firebase.google.com/docs/hosting)
- [Express.js Documentation](https://expressjs.com/)

## 🔗 Links

- **Repository:** https://github.com/1716/GameBet2.0-
- **Issues:** https://github.com/1716/GameBet2.0-/issues
- **Releases:** https://github.com/1716/GameBet2.0-/releases
- **Discussions:** https://github.com/1716/GameBet2.0-/discussions