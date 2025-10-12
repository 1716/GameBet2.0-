#!/bin/bash

# GameBet 2.0 Launch Script
# Quick launcher for development and testing

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Emojis for better UX
ROCKET="🚀"
GEAR="⚙️"
CHECK="✅"
CROSS="❌"
WARNING="⚠️"
INFO="ℹ️"

echo -e "${PURPLE}╔══════════════════════════════════════════════╗${NC}"
echo -e "${PURPLE}║           GameBet 2.0 Launcher              ║${NC}"
echo -e "${PURPLE}║      Premium Gaming & Betting Platform      ║${NC}"
echo -e "${PURPLE}╚══════════════════════════════════════════════╝${NC}"
echo

# Function to show help
show_help() {
    echo -e "${CYAN}Available launch options:${NC}"
    echo -e "  ${GREEN}./launch.sh dev${NC}     - Launch development server"
    echo -e "  ${GREEN}./launch.sh prod${NC}    - Launch production server"
    echo -e "  ${GREEN}./launch.sh debug${NC}   - Launch with debugging"
    echo -e "  ${GREEN}./launch.sh build${NC}   - Build the project"
    echo -e "  ${GREEN}./launch.sh verify${NC}  - Verify environment"
    echo -e "  ${GREEN}./launch.sh status${NC}  - Show project status"
    echo -e "  ${GREEN}./launch.sh info${NC}    - Show project information"
    echo -e "  ${GREEN}./launch.sh help${NC}    - Show this help"
    echo
}

# Function to check if node is available
check_node() {
    if ! command -v node &> /dev/null; then
        echo -e "${CROSS} ${RED}Node.js is not installed or not in PATH${NC}"
        exit 1
    fi
}

# Function to check if npm is available
check_npm() {
    if ! command -v npm &> /dev/null; then
        echo -e "${CROSS} ${RED}npm is not installed or not in PATH${NC}"
        exit 1
    fi
}

# Function to install dependencies if needed
check_dependencies() {
    if [ ! -d "node_modules" ]; then
        echo -e "${WARNING} ${YELLOW}Installing dependencies...${NC}"
        npm install
    fi
}

# Main launch logic
case "${1:-dev}" in
    "dev"|"development")
        echo -e "${ROCKET} ${GREEN}Starting GameBet 2.0 Development Server...${NC}"
        check_node
        check_npm
        check_dependencies
        echo -e "${INFO} ${CYAN}Server will be available at: http://localhost:3000${NC}"
        echo -e "${INFO} ${CYAN}Press Ctrl+C to stop the server${NC}"
        echo
        NODE_ENV=development npm start
        ;;
    
    "prod"|"production")
        echo -e "${ROCKET} ${GREEN}Starting GameBet 2.0 Production Server...${NC}"
        check_node
        check_npm
        check_dependencies
        echo -e "${INFO} ${CYAN}Building project first...${NC}"
        make build
        echo -e "${INFO} ${CYAN}Server will be available at: http://localhost:3000${NC}"
        NODE_ENV=production npm start
        ;;
    
    "debug")
        echo -e "${GEAR} ${BLUE}Starting GameBet 2.0 with Debugging...${NC}"
        check_node
        check_npm
        check_dependencies
        echo -e "${INFO} ${CYAN}Debugger will be available at: chrome://inspect${NC}"
        echo -e "${INFO} ${CYAN}Server will be available at: http://localhost:3000${NC}"
        NODE_ENV=development node --inspect server.js
        ;;
    
    "build")
        echo -e "${GEAR} ${BLUE}Building GameBet 2.0...${NC}"
        check_node
        check_npm
        make build
        ;;
    
    "verify")
        echo -e "${GEAR} ${BLUE}Verifying GameBet 2.0 Environment...${NC}"
        check_node
        check_npm
        make verify
        ;;
    
    "status")
        echo -e "${INFO} ${CYAN}GameBet 2.0 Status:${NC}"
        make status
        ;;
    
    "info")
        echo -e "${INFO} ${CYAN}GameBet 2.0 Information:${NC}"
        make info
        ;;
    
    "help"|"--help"|"-h")
        show_help
        ;;
    
    *)
        echo -e "${CROSS} ${RED}Unknown option: $1${NC}"
        echo
        show_help
        exit 1
        ;;
esac