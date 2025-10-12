# GameBet 2.0 Launch Options

This document describes all available ways to launch and run the GameBet 2.0 application.

## 🚀 Quick Start Options

### Fastest Launch Methods
```bash
# Super quick development start
make run
make start

# Interactive launcher (recommended for beginners)
make launch-script

# Traditional development launch
make launch
```

## 📋 Complete Launch Reference

### Direct Make Commands (Traditional)
```bash
make launch              # Launch development server directly
make launch-dev          # Launch with environment verification
make launch-prod         # Launch production build locally
make launch-debug        # Launch with Node.js debugging enabled
```

### Launch Script Integration (Recommended)
```bash
make launch-script       # Interactive launcher menu
make launch-script-dev   # Development mode via script
make launch-script-prod  # Production mode via script  
make launch-script-debug # Debug mode via script
make launch-script-build # Build project via script
make launch-script-verify # Verify environment via script
make launch-script-status # Show project status via script
make launch-script-info  # Show project info via script
make launch-script-help  # Show launcher help
```

### Direct Script Usage
```bash
./launch.sh              # Interactive menu (default: dev)
./launch.sh dev          # Development server
./launch.sh prod         # Production server
./launch.sh debug        # Debug mode with inspector
./launch.sh build        # Build project only
./launch.sh verify       # Verify environment
./launch.sh status       # Show project status
./launch.sh info         # Show project information
./launch.sh help         # Show help menu
```

### VS Code Integration
- **F5** or **Ctrl+F5** → Select "🚀 Launch GameBet Server"
- **Command Palette** → "Tasks: Run Task" → Select launch task
- **Debug Panel** → Select configuration and start

### NPM Scripts (Low-level)
```bash
npm start               # Direct Node.js server start
npm run build           # Build only
npm run verify          # Verify only
```

## 🛠️ Setup and Maintenance

### Initial Setup
```bash
make setup-launch       # Make launch script executable
make check-launch       # Verify launch script status
make install            # Install dependencies
```

### Build and Package
```bash
make build              # Build project
make package            # Package for distribution
make verify             # Verify environment
```

## 🎯 Recommended Workflow

### For New Users
1. `make install` - Install dependencies
2. `make launch-script` - Use interactive launcher
3. Choose option from menu

### For Developers
1. `make run` - Quick development start
2. Open http://localhost:3000
3. Start coding!

### For Production Testing
1. `make launch-script-prod` - Production mode
2. Test production build locally

### For Debugging
1. `make launch-debug` - Enable Node.js inspector
2. Open chrome://inspect
3. Debug your code

## 🔧 Environment Variables

All launch methods respect these environment variables:
- `NODE_ENV` - development/production
- `PORT` - Server port (default: 3000)
- `DEBUG` - Debug namespace
- `JWT_SECRET` - JWT signing secret

## 📊 Status Monitoring

Check project status anytime:
```bash
make status              # Build system status
make info               # Project information
make launch-script-status # Comprehensive status via script
```

## 🆘 Troubleshooting

### Launch Script Issues
```bash
make check-launch        # Check if script exists and is executable
make setup-launch        # Make script executable
```

### Server Won't Start
```bash
make verify             # Check environment
make clean              # Clean build artifacts
make install            # Reinstall dependencies
```

### Port Conflicts
```bash
# Use different port
PORT=3001 make launch
PORT=3001 ./launch.sh dev
```

## 🔗 Related Documentation

- **[README.md](README.md)** - Main project documentation
- **[USAGE.md](USAGE.md)** - Detailed usage guide
- **[INSTALLATION.md](INSTALLATION.md)** - Installation instructions
- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Common issues and solutions

---

**💡 Tip**: Use `make help` to see all available Make targets, or `./launch.sh help` for launch script options.