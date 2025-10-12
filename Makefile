# GameBet 2.0 Build System
# Premium Gaming & Betting Platform

.PHONY: help install install-force install-dev install-prod check-deps verify verify-safe build build-safe build-force package deploy release clean clean-all test info status dev dev-safe prod launch launch-dev launch-prod launch-debug setup-launch check-launch launch-script launch-script-dev launch-script-prod launch-script-debug launch-script-build launch-script-verify launch-script-status launch-script-info launch-script-help run start quick-build quick-package quick-deploy create-launch backup-launch restore-launch dev-setup dev-reset check-system check-port kill-server diagnose fix-common emergency-reset launch-with-logs launch-background launch-help workspace-info

# Default target
help: ## Show this help message
	@echo "GameBet 2.0 Build System"
	@echo "========================"
	@echo ""
	@echo "Available targets:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

install: ## Install dependencies
	@echo "📦 Installing dependencies..."
	npm install

install-force: ## Force reinstall all dependencies
	@echo "🔄 Force reinstalling dependencies..."
	rm -rf node_modules package-lock.json
	npm install

install-dev: ## Install development dependencies only
	@echo "🛠️ Installing development dependencies..."
	npm install --only=dev

install-prod: ## Install production dependencies only  
	@echo "🏭 Installing production dependencies..."
	npm install --only=production

check-deps: ## Check for missing dependencies
	@echo "🔍 Checking dependencies..."
	@if [ ! -d "node_modules" ]; then \
		echo "❌ node_modules not found - run 'make install'"; \
		exit 1; \
	fi
	@echo "✅ Dependencies are installed"
	@npm ls --depth=0 2>/dev/null || echo "⚠️ Some dependencies may be missing"

verify: check-deps ## Verify build environment
	@echo "🔍 Verifying environment..."
	npm run verify

verify-safe: ## Verify environment with error handling
	@echo "🔍 Safe verification (with error handling)..."
	@if [ ! -d "node_modules" ]; then \
		echo "⚠️ Dependencies missing, installing..."; \
		make install; \
	fi
	@if npm run verify 2>/dev/null; then \
		echo "✅ Environment verification passed"; \
	else \
		echo "❌ Environment verification failed"; \
		echo "💡 Try: make install-force"; \
		exit 1; \
	fi

build: verify ## Build the project
	@echo "🏗️  Building project..."
	npm run build

build-safe: verify-safe ## Build project with safe verification
	@echo "🏗️  Safe building project..."
	npm run build

build-force: install-force ## Force clean build
	@echo "🏗️  Force building project..."
	make clean
	npm run build

package: build ## Package the project
	@echo "📦 Packaging project..."
	npm run package

deploy: package ## Deploy to staging
	@echo "🚀 Deploying to staging..."
	npm run deploy

deploy-web: package ## Deploy for web
	@echo "🌐 Preparing web deployment..."
	DEPLOY_TARGET=web npm run deploy

deploy-android: package ## Deploy for Android store
	@echo "📱 Preparing Android store deployment..."
	DEPLOY_TARGET=android-store npm run deploy

release: ## Create a new release
	@echo "🏷️  Creating release..."
	npm run release

release-patch: ## Create a patch release
	@echo "🏷️  Creating patch release..."
	npm version patch
	npm run release

release-minor: ## Create a minor release
	@echo "🏷️  Creating minor release..."
	npm version minor
	npm run release

release-major: ## Create a major release
	@echo "🏷️  Creating major release..."
	npm version major
	npm run release

clean: ## Clean build artifacts
	@echo "🧹 Cleaning build artifacts..."
	npm run clean

clean-all: ## Clean everything including node_modules
	@echo "🧹 Cleaning everything..."
	npm run clean -- --all

test: build ## Run tests and verification
	@echo "🧪 Running tests..."
	@echo "Verifying build integrity..."
	@test -f build/GameBet.aab || (echo "❌ GameBet.aab not found" && exit 1)
	@test -f build/GameBet.apk || (echo "❌ GameBet.apk not found" && exit 1)
	@test -f build/assetlinks.json || (echo "❌ assetlinks.json not found" && exit 1)
	@test -f build/manifest.json || (echo "❌ manifest.json not found" && exit 1)
	@test -f build/checksums.json || (echo "❌ checksums.json not found" && exit 1)
	@echo "✅ All tests passed"

info: ## Show project information
	@echo "GameBet 2.0 - Premium Gaming & Betting Platform"
	@echo "================================================"
	@echo "Version: $(shell node -p "require('./package.json').version")"
	@echo "Author: $(shell node -p "require('./package.json').author")"
	@echo "Repository: $(shell node -p "require('./package.json').repository.url")"
	@echo ""
	@echo "Available files:"
	@ls -la *.aab *.apk *.json 2>/dev/null || echo "  No build files found (run 'make build' first)"

status: ## Show build status
	@echo "Build Status"
	@echo "============"
	@echo -n "Build directory: "
	@if [ -d "build" ]; then echo "✅ exists"; else echo "❌ missing"; fi
	@echo -n "Package directory: "
	@if [ -d "package" ]; then echo "✅ exists"; else echo "❌ missing"; fi
	@echo -n "Deploy directory: "
	@if [ -d "deploy" ]; then echo "✅ exists"; else echo "❌ missing"; fi
	@echo -n "Release directory: "
	@if [ -d "releases" ]; then echo "✅ exists"; else echo "❌ missing"; fi

# Development workflow
dev: clean verify build test ## Full development workflow

# Production workflow  
prod: clean verify-safe build package deploy-web deploy-android release ## Full production workflow

# Safe development workflow (with better error handling)
dev-safe: clean check-system verify-safe build-safe test ## Safe development workflow

# Launch commands
launch: ## Launch GameBet server for development
	@echo "🚀 Launching GameBet 2.0 Development Server..."
	@echo "Server will be available at: http://localhost:3000"
	@echo "Press Ctrl+C to stop the server"
	@echo ""
	NODE_ENV=development npm start

launch-dev: verify ## Launch with full development setup
	@echo "🚀 Launching GameBet 2.0 with full dev setup..."
	@echo "Running verification first..."
	@make launch

launch-prod: build ## Launch production build locally
	@echo "🚀 Launching GameBet 2.0 production build..."
	@echo "Server will be available at: http://localhost:3000"
	NODE_ENV=production npm start

launch-debug: ## Launch server with debugging enabled
	@echo "🐛 Launching GameBet 2.0 with debugging..."
	@echo "Debugger will be available at: chrome://inspect"
	NODE_ENV=development node --inspect server.js

# Launch script integration
setup-launch: ## Make launch script executable
	@echo "⚙️ Setting up launch script..."
	@if [ ! -f "launch.sh" ]; then \
		echo "❌ launch.sh not found. Please create it first."; \
		echo "💡 You can use: touch launch.sh && make setup-launch"; \
		exit 1; \
	fi
	chmod +x launch.sh
	@echo "✅ Launch script is now executable"

check-launch: ## Check if launch script exists and is executable
	@echo "🔍 Checking launch script..."
	@if [ -f "launch.sh" ]; then \
		echo "✅ launch.sh exists"; \
		if [ -x "launch.sh" ]; then \
			echo "✅ launch.sh is executable"; \
		else \
			echo "⚠️ launch.sh is not executable (run 'make setup-launch')"; \
		fi \
	else \
		echo "❌ launch.sh not found"; \
	fi

launch-script: setup-launch ## Use launch.sh script (interactive launcher)
	@echo "🚀 Running GameBet 2.0 Interactive Launcher..."
	./launch.sh

launch-script-dev: setup-launch ## Use launch.sh for development
	./launch.sh dev

launch-script-prod: setup-launch ## Use launch.sh for production
	./launch.sh prod

launch-script-debug: setup-launch ## Use launch.sh for debugging
	./launch.sh debug

launch-script-build: ## Use launch.sh to build
	./launch.sh build

launch-script-verify: ## Use launch.sh to verify environment
	./launch.sh verify

launch-script-status: ## Use launch.sh to show status
	./launch.sh status

launch-script-info: ## Use launch.sh to show info
	./launch.sh info

launch-script-help: ## Show launch.sh help
	./launch.sh help

# Convenient aliases
run: launch-script-dev ## Alias for launch-script-dev (quick development start)

start: launch-script-dev ## Alias for launch-script-dev (alternative quick start)

# Quick commands
quick-build: ## Quick build without verification
	npm run build

quick-package: ## Quick package without build
	npm run package

quick-deploy: ## Quick deploy without package
	npm run deploy

# Launch file management
create-launch: ## Create launch.sh from template
	@echo "📝 Creating launch.sh script..."
	@if [ -f "launch.sh" ]; then \
		echo "⚠️ launch.sh already exists"; \
		echo "💡 Use 'make backup-launch' first if you want to preserve it"; \
		exit 1; \
	fi
	@echo '#!/bin/bash' > launch.sh
	@echo '# GameBet 2.0 Launch Script - Auto-generated' >> launch.sh
	@echo 'set -e' >> launch.sh
	@echo 'echo "🚀 GameBet 2.0 Quick Launcher"' >> launch.sh
	@echo 'case "$${1:-dev}" in' >> launch.sh
	@echo '    "dev") NODE_ENV=development npm start ;;' >> launch.sh
	@echo '    "prod") NODE_ENV=production npm start ;;' >> launch.sh
	@echo '    "debug") NODE_ENV=development node --inspect server.js ;;' >> launch.sh
	@echo '    "build") make build ;;' >> launch.sh
	@echo '    "verify") make verify ;;' >> launch.sh
	@echo '    "status") make status ;;' >> launch.sh
	@echo '    "info") make info ;;' >> launch.sh
	@echo '    "help") echo "Usage: ./launch.sh [dev|prod|debug|build|verify|status|info|help]" ;;' >> launch.sh
	@echo '    *) echo "Unknown option: $$1. Use help for options." ;;' >> launch.sh
	@echo 'esac' >> launch.sh
	@chmod +x launch.sh
	@echo "✅ launch.sh created and made executable"

backup-launch: ## Backup existing launch.sh
	@echo "💾 Backing up launch.sh..."
	@if [ -f "launch.sh" ]; then \
		cp launch.sh launch.sh.backup.$$(date +%Y%m%d_%H%M%S); \
		echo "✅ Backup created: launch.sh.backup.$$(date +%Y%m%d_%H%M%S)"; \
	else \
		echo "❌ No launch.sh found to backup"; \
	fi

restore-launch: ## Restore launch.sh from latest backup
	@echo "♻️ Restoring launch.sh from backup..."
	@LATEST=$$(ls -t launch.sh.backup.* 2>/dev/null | head -1); \
	if [ -n "$$LATEST" ]; then \
		cp "$$LATEST" launch.sh; \
		chmod +x launch.sh; \
		echo "✅ Restored from: $$LATEST"; \
	else \
		echo "❌ No backup files found"; \
		exit 1; \
	fi

# Enhanced development workflow
dev-setup: install setup-launch ## Complete development setup
	@echo "🛠️ Setting up development environment..."
	@echo "✅ Development environment ready!"
	@echo "💡 Use 'make run' or './launch.sh' to start"

dev-reset: clean-all install-force setup-launch ## Reset development environment
	@echo "🔄 Resetting development environment..."
	@echo "✅ Development environment reset complete!"

# System checks
check-system: ## Check system requirements
	@echo "🔍 Checking system requirements..."
	@echo -n "Node.js: "
	@if command -v node >/dev/null 2>&1; then \
		echo "✅ $$(node --version)"; \
	else \
		echo "❌ Not installed"; \
	fi
	@echo -n "npm: "
	@if command -v npm >/dev/null 2>&1; then \
		echo "✅ $$(npm --version)"; \
	else \
		echo "❌ Not installed"; \
	fi
	@echo -n "Make: "
	@if command -v make >/dev/null 2>&1; then \
		echo "✅ $$(make --version | head -1)"; \
	else \
		echo "❌ Not installed"; \
	fi
	@echo -n "Git: "
	@if command -v git >/dev/null 2>&1; then \
		echo "✅ $$(git --version)"; \
	else \
		echo "❌ Not installed"; \
	fi

# Port management
check-port: ## Check if port 3000 is available
	@echo "🔍 Checking port 3000..."
	@if lsof -i:3000 >/dev/null 2>&1; then \
		echo "⚠️ Port 3000 is in use:"; \
		lsof -i:3000; \
		echo "💡 Kill process with: kill -9 <PID>"; \
	else \
		echo "✅ Port 3000 is available"; \
	fi

kill-server: ## Kill any process running on port 3000
	@echo "🔪 Killing processes on port 3000..."
	@if lsof -ti:3000 >/dev/null 2>&1; then \
		lsof -ti:3000 | xargs kill -9; \
		echo "✅ Processes killed"; \
	else \
		echo "ℹ️ No processes running on port 3000"; \
	fi

# Troubleshooting and diagnostics
diagnose: ## Run full system diagnostics
	@echo "🏥 Running GameBet 2.0 Diagnostics..."
	@echo "======================================"
	@make check-system
	@echo ""
	@make check-deps
	@echo ""
	@make check-launch
	@echo ""
	@make check-port
	@echo ""
	@make status
	@echo ""
	@echo "🩺 Diagnostic complete!"

fix-common: ## Fix common issues automatically
	@echo "🔧 Fixing common issues..."
	@echo "1. Installing/updating dependencies..."
	@make install-force
	@echo "2. Setting up launch script..."
	@make setup-launch 2>/dev/null || make create-launch
	@echo "3. Cleaning old build artifacts..."
	@make clean
	@echo "✅ Common fixes applied!"

emergency-reset: ## Emergency reset (use with caution)
	@echo "🚨 EMERGENCY RESET - This will delete everything!"
	@echo "Press Ctrl+C within 5 seconds to cancel..."
	@sleep 5
	@echo "Proceeding with emergency reset..."
	@make kill-server
	@make clean-all
	@rm -rf node_modules package-lock.json
	@rm -f launch.sh.backup.*
	@make install
	@make setup-launch 2>/dev/null || make create-launch
	@echo "🆘 Emergency reset complete!"

# Launch script enhancements  
launch-with-logs: setup-launch ## Launch with detailed logging
	@echo "📋 Launching with detailed logs..."
	./launch.sh dev 2>&1 | tee gamebet-launch.log

launch-background: setup-launch ## Launch in background
	@echo "🎭 Launching in background..."
	nohup ./launch.sh dev > gamebet-background.log 2>&1 &
	@echo "✅ Server started in background (PID: $$!)"
	@echo "📋 Log file: gamebet-background.log"
	@echo "🔪 Stop with: make kill-server"

# Documentation and help
launch-help: ## Show detailed launch help
	@echo "🚀 GameBet 2.0 Launch Help"
	@echo "=========================="
	@echo ""
	@echo "📋 Available launch methods:"
	@echo "  make run                 - Quick development start"
	@echo "  make start               - Alternative quick start"
	@echo "  make launch              - Direct server launch"
	@echo "  make launch-script       - Interactive launcher"
	@echo "  ./launch.sh              - Direct script usage"
	@echo ""
	@echo "🛠️ Setup and maintenance:"
	@echo "  make dev-setup           - Complete dev environment setup"
	@echo "  make diagnose            - Run full diagnostics"
	@echo "  make fix-common          - Fix common issues"
	@echo ""
	@echo "🆘 Troubleshooting:"
	@echo "  make check-port          - Check if port 3000 is free"
	@echo "  make kill-server         - Kill server processes"
	@echo "  make emergency-reset     - Nuclear option (resets everything)"
	@echo ""
	@echo "📖 More help: make help"

workspace-info: ## Show workspace information
	@echo "📊 GameBet 2.0 Workspace Information"
	@echo "===================================="
	@echo "📁 Working Directory: $$(pwd)"
	@echo "🌿 Git Branch: $$(git branch --show-current 2>/dev/null || echo 'Not a git repository')"
	@echo "📦 Project: $$(node -p "require('./package.json').name" 2>/dev/null || echo 'package.json not found')"
	@echo "🏷️ Version: $$(node -p "require('./package.json').version" 2>/dev/null || echo 'unknown')"
	@echo "👤 Author: $$(node -p "require('./package.json').author" 2>/dev/null || echo 'unknown')"
	@echo "🔗 Repository: $$(node -p "require('./package.json').repository.url" 2>/dev/null || echo 'unknown')"
	@echo ""
	@echo "📂 Key Files:"
	@ls -la server.js launch.sh package.json Makefile 2>/dev/null || echo "Some key files missing"