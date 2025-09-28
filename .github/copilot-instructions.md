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
  - `main.js` - Main application logic (minified)
  - `auth.js` - Authentication handling
  - `style.css` - Application styles
  - `manifest.json` - PWA manifest
  - `index.html` - Main application page
  - `withdrawal.html` - Withdrawal interface
- `scripts/` - Build automation (verify, build, package, deploy, release)
- `server.js` - Express.js backend API with game data and auth endpoints
- `database.js` - Database abstraction layer using LowDB
- `GameBet.aab` & `GameBet.apk` - Pre-built Android packages
- `assetlinks.json` - Android App Links verification
- `Makefile` - Developer convenience commands
- `.github/workflows/` - CI/CD automation (build.yml, deploy.yml, release.yml)

## Development Workflow

### Daily Development Process
1. **Start Development Server**: `npm start` (runs server on http://localhost:3000)
2. **Verify Environment**: `npm run verify` before making changes
3. **Make Changes**: Edit files in `src/` for frontend, `server.js` for backend
4. **Test Changes**: Restart server and test in browser
5. **Build Test**: `npm run build` to verify build process
6. **Commit**: Use meaningful commit messages with emojis

### Debugging
- **Frontend Issues**: Use browser dev tools, check console for errors
- **Backend Issues**: Check server logs, test API endpoints directly
- **Build Issues**: Run `npm run verify` and check file permissions
- **Authentication Issues**: Verify JWT token format and expiration
- **Android Issues**: Test in browser first, then check assetlinks.json

### Local Testing
```bash
# Start development server
npm start

# In another terminal, test API endpoints
curl -X GET http://localhost:3000/api/games
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"password"}'
```

### Code Style & Standards
- Use vanilla JavaScript (ES6+) for frontend - no frameworks
- Follow existing patterns for authentication and API integration
- Maintain separation between frontend (src/) and backend (server.js)
- Use consistent error handling with try/catch and proper HTTP status codes
- Follow existing logging patterns with emoji prefixes (🏗️, ✅, ⚠️, etc.)
- Frontend JavaScript is minified in main.js - edit unminified source carefully
- Use semantic HTML5 elements and modern CSS features
- Follow REST API conventions for backend endpoints
- Use JWT tokens for authentication - never expose secrets in frontend code

### Code Patterns
- **Authentication**: Use JWT tokens with proper header format `Authorization: Bearer <token>`
- **API Responses**: Always return JSON with consistent structure `{success: boolean, message: string, data?: any}`
- **Error Handling**: Use appropriate HTTP status codes (200, 400, 401, 403, 500)
- **Database Operations**: Use the database.js module for all data persistence
- **Frontend State**: Use localStorage for user session persistence
- **DOM Manipulation**: Use native JavaScript DOM APIs, no jQuery

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
- Never commit production secrets or API keys
- Use environment variables for sensitive configuration in production

### Environment Variables (Production)
```bash
# Server Configuration
PORT=3000
NODE_ENV=production

# Security
JWT_SECRET=your_secure_jwt_secret_here
SESSION_SECRET=your_secure_session_secret

# Database (if using external DB in production)
DATABASE_URL=your_database_connection_string

# Deployment
DEPLOY_TARGET=production
```

## Common Development Tasks

### Adding New Games
1. Add to the `games` array in `server.js`
2. Ensure proper validation for game properties (id, title, description, image, odds)
3. Update frontend display logic if needed in `src/main.js`

**Game Object Structure:**
```javascript
{
  id: number,           // Unique identifier
  title: string,        // Game display name
  description: string,  // Game description
  image: string,        // Image URL (placeholder or real image)
  odds: number         // Betting odds (e.g., 1.5, 2.0)
}
```

### Game Management
- Games are stored in-memory in the `games` array in `server.js`
- For production, consider moving to a proper database
- Always validate odds are positive numbers
- Ensure image URLs are accessible and appropriate
- Test new games thoroughly before deployment

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
- Ensure all features work in Android WebView environment
- Consider touch interactions and mobile UX patterns
- Verify that all images and assets are properly optimized for mobile

### PWA Considerations
- Service workers are not currently implemented - consider adding for offline support
- Manifest.json defines app metadata for Android deployment
- Icons and splash screens should be properly configured
- Test "Add to Home Screen" functionality
- Ensure proper viewport meta tags for mobile rendering

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
5. Verify that server starts correctly with `npm start`
6. Test API endpoints manually if making backend changes

### Testing Strategy
- **Frontend**: Manual testing in browser and Android WebView context
- **Backend**: Test API endpoints with tools like curl or Postman
- **Build System**: Verify all build artifacts are generated correctly
- **Security**: Always test authentication flows and input validation

### CI/CD Integration
- All PRs trigger automated builds via GitHub Actions workflows:
  - `build.yml` - Build and package verification
  - `deploy.yml` - Deployment preparation
  - `release.yml` - Release creation and publishing
- Build artifacts are automatically generated and stored
- Android packages (AAB/APK) are created and validated
- Deployment files are prepared for multiple targets (staging, web, android-store)

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