#!/bin/bash

# Set variables
REPO_URL="https://github.com/1716/GameBet2.0-"
BRANCH="main"
COMMIT_MESSAGE="Automated commit"

# Navigate to the project directory
cd GameBet2.0-

# Check for changes
if git diff-index --quiet HEAD --; then
    echo "No changes to commit"
    exit 0
fi

# Add all changes
git add .

# Commit changes
git commit -m "$COMMIT_MESSAGE"

# Push to GitHub
git push "$REPO_URL" "$BRANCH"