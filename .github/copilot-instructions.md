# GameBet 2.0 - GitHub Copilot Instructions

## Project Overview

GameBet 2.0 is a Progressive Web App (PWA) gaming and betting platform that's converted to a native Android application. This is a full-stack JavaScript project with Express.js backend, vanilla JavaScript frontend, and comprehensive build/deployment automation.

## Architecture & Technology Stack

### Core Technologies
- **Frontend**: Vanilla JavaScript, HTML5, CSS3 (PWA)
- **Backend**: Node.js, Express.js, JWT authentication
- **Database**: JSON-based with LowDB
- **Build System**: Custom Node.js scripts with Make automation
- **Deployment**: Android (AAB/APK), Web, Firebase
- **CI/CD**: GitHub Actions workflows

### Key Files & Directories
- `src/` - Frontend PWA source code
- `scripts/` - Build automation (verify, build, package, deploy, release)
- `server.js` - Express.js backend API
- `GameBet.aab` & `GameBet.apk` - Pre-built Android packages
- `assetlinks.json` - Android App Links verification
- `Makefile` - Developer convenience commands
- `.github/workflows/` - CI/CD automation

## Development Guidelines

### Code Style & Standards
- Use vanilla JavaScript (ES6+) for frontend - no frameworks
- Follow existing patterns for authentication and API integration
- Maintain separation between frontend (src/) and backend (server.js)
- Use consistent error handling with try/catch and proper HTTP status codes
- Follow existing logging patterns with emoji prefixes (🏗️, ✅, ⚠️, etc.)

### Build System Integration
- Always use existing npm scripts: `verify`, `build`, `package`, `deploy`, `release`
- Build scripts are in `scripts/` directory - understand before modifying
- Use `make` commands for convenience: `make dev`, `make prod`, `make help`
- Never modify core build files without understanding the full pipeline

### Security Considerations
- This is a gaming/betting platform - be extra careful with authentication
- JWT tokens are used for authentication - follow existing patterns
- Signing keys in repo are FOR DEVELOPMENT ONLY
- Always validate user inputs, especially bet amounts and game interactions
- Follow existing CORS and security header patterns

## Common Development Tasks

### Adding New Games
1. Add to the `games` array in `server.js`
2. Ensure proper validation for game properties (id, title, description, image, odds)
3. Update frontend display logic if needed in `src/main.js`

### API Modifications
- Follow existing REST patterns: `/api/games`, `/api/bets`, `/api/auth/*`
- Use middleware for authentication where needed
- Return consistent JSON responses with proper HTTP status codes
- Update both backend routes and frontend fetch calls

### Frontend Changes
- Keep PWA manifest updated in `src/manifest.json`
- Maintain mobile-first responsive design
- Test on both web and Android app contexts
- Follow existing DOM manipulation patterns (no jQuery or frameworks)

### Build & Deployment
- Run `npm run verify` before building
- Use `npm run build` for development builds
- Use `make prod` for full production pipeline
- Deployment targets: `staging`, `web`, `android-store`
- Check `DEPLOYMENT.md` files in deploy directories

## Testing & Verification

### Before Committing
1. Run `npm run verify` to check environment
2. Run `npm run build` to ensure build works
3. Test both web and Android contexts if possible
4. Check `make status` for build system health

### CI/CD Integration
- All PRs trigger automated builds via GitHub Actions
- Build artifacts are generated and stored
- Android packages (AAB/APK) are automatically created
- Deployment files are prepared for multiple targets

## File Naming & Organization

### Scripts
- All build scripts in `scripts/` directory
- Use descriptive names: `verify.js`, `build.js`, `package.js`, etc.
- Follow existing logging and error handling patterns

### Frontend
- Keep all frontend files in `src/` directory
- Use semantic HTML5 and modern CSS
- JavaScript files should be modular and focused

### Documentation
- Update `README.md` for user-facing changes
- Update `USAGE.md` for build system changes
- Update `ARCHITECTURE.md` for structural changes

## Performance & Optimization

### Frontend Optimization
- Keep JavaScript vanilla and lightweight (it's already minified in main.js)
- Optimize images and assets for mobile/web
- Maintain PWA performance standards

### Build Optimization
- Build system already includes optimization scripts
- Don't add unnecessary dependencies
- Use existing minification and compression

## Deployment Patterns

### Android Deployment
- Uses existing AAB/APK files as base
- Requires proper assetlinks.json configuration
- Store listing metadata in `store-listing.json`

### Web Deployment
- Apache configuration via `.htaccess`
- HTTPS enforcement and security headers
- Asset links for app verification

### Firebase Integration
- Firebase configuration in `firebase.json`
- Functions in `functions/` directory
- Database integration via `database.js`

## Common Pitfalls to Avoid

1. **Don't modify signing keys** - they're for development only
2. **Don't break the build pipeline** - understand scripts before changing
3. **Don't add heavy dependencies** - keep it lightweight
4. **Don't ignore security** - this handles real money/betting
5. **Don't skip verification** - always run `npm run verify`
6. **Don't commit build artifacts** - they're generated automatically

## Getting Help

- Check `make help` for available commands
- Review `USAGE.md` for practical examples
- Check `ARCHITECTURE.md` for system understanding
- Look at existing GitHub Actions logs for CI/CD issues
- Build issues: run `make status` and `npm run verify`

## Key Commands Reference

```bash
# Development
make install      # Setup dependencies
make dev         # Full development workflow
make status      # Check build status

# Building
npm run verify   # Check environment
npm run build    # Build project
npm run package  # Create packages

# Deployment
make deploy-web     # Web deployment
make deploy-android # Android store deployment
make release       # Create new release

# Maintenance
npm run clean    # Clean build artifacts
make clean-all   # Deep clean everything
```

Remember: This is a production gaming/betting platform. Always prioritize security, performance, and reliability in any changes you make.