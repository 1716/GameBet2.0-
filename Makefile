# GameBet 2.0 Build System
# Premium Gaming & Betting Platform

.PHONY: help install build package deploy release clean verify

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

verify: ## Verify build environment
	@echo "🔍 Verifying environment..."
	npm run verify

build: verify ## Build the project
	@echo "🏗️  Building project..."
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
prod: clean verify build package deploy-web deploy-android release ## Full production workflow

# Quick commands
quick-build: ## Quick build without verification
	npm run build

quick-package: ## Quick package without build
	npm run package

quick-deploy: ## Quick deploy without package
	npm run deploy