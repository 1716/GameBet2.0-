# GameBet 2.0 - VS Code Launch Configuration Guide

## 🚀 **Available Launch Configurations**

VS Code is now configured with **13 launch configurations** and **multiple compound configurations** for GameBet 2.0.

### **🎯 Primary Launch Options (Recommended)**

#### **1. 🚀 Launch GameBet Server** ⭐ (Default)
- **Type**: Node.js Debug
- **Purpose**: Main development server with debugging
- **Pre-task**: Environment verification
- **Port**: 3000
- **Environment**: Development
- **Usage**: Press **F5** or **Ctrl+F5**

#### **2. 🚀 Full GameBet Launch** (Compound)
- **Type**: Compound configuration
- **Purpose**: Complete launch with verification
- **Includes**: Server launch + environment check
- **Usage**: Select from Debug dropdown

#### **3. 🏗️ Build & Run** (Compound)
- **Type**: Compound configuration  
- **Purpose**: Build project then launch server
- **Includes**: Build + Server launch
- **Usage**: Select from Debug dropdown

### **🛠️ Development Configurations**

#### **Build & Package**
- 🏗️ **Build Project** - Build the project only
- 📦 **Package Application** - Package for distribution
- 🔍 **Verify Environment** - Check system requirements

#### **Deployment**
- 🚀 **Deploy to Staging** - Deploy to staging environment
- 🌐 **Deploy Web** - Web deployment preparation
- 📱 **Deploy Android** - Android store deployment

#### **Maintenance**
- 🧹 **Clean Build** - Clean build artifacts
- 🏷️ **Create Release** - Create new release

### **🐛 Debug Configurations**

#### **Advanced Debugging**
- 🐛 **Debug Server** - Server with Node.js inspector
- 🧪 **Debug Build Script** - Debug the build process
- 🎯 **Launch via Script** - Launch using bash script

#### **Web Browser Integration**  
- 🎮 **Launch PWA (Chrome)** - Launch with browser integration

## 📋 **VS Code Tasks Integration**

### **Available Tasks** (Ctrl+Shift+P → "Tasks: Run Task")

#### **Server Management**
- **Start GameBet Server** - Background server start
- **🎯 Makefile Launch Server** - Launch via Makefile
- **🚀 Quick Launch via Make** - Quick development start

#### **Build & Test**  
- **🏗️ Build GameBet** (Default build task)
- **📦 Package GameBet** - Package application
- **🧪 Run Tests** (Default test task)

#### **Maintenance & Diagnostics**
- **🔍 Verify Environment** - Environment check
- **🧹 Clean All** - Clean everything
- **🔧 Make Diagnose** - Full diagnostics
- **📊 Project Status** - Show build status
- **ℹ️ Project Info** - Project information

## 🎛️ **How to Use**

### **Quick Start (Recommended)**
1. **Press F5** → Automatically launches default configuration
2. **Or** use Command Palette: **"Debug: Start Debugging"**
3. **Or** click Debug icon in sidebar → Select configuration → Start

### **Task-Based Launch**
1. **Ctrl+Shift+P** → **"Tasks: Run Task"**
2. Select **"🚀 Quick Launch via Make"**
3. Server starts via Makefile integration

### **Manual Configuration Selection**
1. Click **Debug icon** in sidebar (Ctrl+Shift+D)
2. Select desired configuration from dropdown
3. Click **Start Debugging** (▶️) or press **F5**

### **Compound Configurations**
1. Select **"🚀 Full GameBet Launch"** for complete setup
2. Select **"🏗️ Build & Run"** for build-then-run workflow

## 🔧 **Integration with Makefile**

### **Direct Makefile Integration**
All launch configurations work seamlessly with Makefile targets:

```bash
# These work via VS Code tasks:
make run              # Quick development start  
make launch           # Direct server launch
make diagnose         # Full system diagnostics
make dev-setup        # Complete environment setup
```

### **Background Tasks**
VS Code tasks automatically handle:
- ✅ **Dependency checking** before launch
- ✅ **Environment verification** 
- ✅ **Port availability** checking
- ✅ **Process management** (start/stop)

## 🆘 **Troubleshooting Launch Issues**

### **"No Launch Configuration" Error**

#### **Quick Fix:**
1. **Run diagnostic**: `make diagnose`
2. **Fix dependencies**: `make fix-common`  
3. **Refresh VS Code**: Reload window (Ctrl+Shift+P → "Reload Window")

#### **Manual Fix:**
```bash
# 1. Check system requirements
make check-system

# 2. Install dependencies
make install

# 3. Setup launch script
make setup-launch

# 4. Test launch
make run
```

### **Port 3000 In Use**
```bash
# Check what's using the port
make check-port

# Kill existing processes
make kill-server

# Try launch again
make run
```

### **Dependencies Missing (fs-extra error)**
```bash
# Force reinstall dependencies
make install-force

# Verify installation
make verify-safe

# Test build
make build-safe
```

### **Launch Script Issues**
```bash
# Check launch script status
make check-launch

# Recreate if needed
make backup-launch    # (optional)
make create-launch

# Make executable
make setup-launch
```

### **Complete Reset (Nuclear Option)**
```bash
# Emergency reset - use with caution!
make emergency-reset
```

## 📊 **Configuration Summary**

- **Total Configurations**: 13 individual + 2 compound
- **Background Tasks**: 8 integrated tasks  
- **Makefile Integration**: Full bidirectional integration
- **Error Handling**: Comprehensive error recovery
- **Auto-Setup**: Automatic dependency and environment management

## 💡 **Best Practices**

1. **Use F5** for quick development start (default configuration)
2. **Use compound configurations** for complex workflows
3. **Run `make diagnose`** if issues occur
4. **Use `make run`** from terminal for fastest start
5. **Check tasks** (Ctrl+Shift+P → Tasks) for additional options

---

**🚀 Ready to launch!** Press **F5** or select a configuration from the Debug panel to get started!

For more help: `make launch-help` or `make help`