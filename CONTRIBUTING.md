# Contributing to GameBet 2.0

Thank you for your interest in contributing to GameBet 2.0! This document provides guidelines and best practices for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Documentation](#documentation)
- [Release Process](#release-process)

---

## Code of Conduct

### Our Standards

- Be respectful and inclusive
- Welcome newcomers and help them get started
- Focus on what is best for the community
- Show empathy towards other community members
- Give and accept constructive feedback gracefully

### Unacceptable Behavior

- Harassment, discrimination, or offensive comments
- Trolling, insulting/derogatory comments
- Publishing others' private information
- Other conduct which could reasonably be considered inappropriate

---

## Getting Started

### Prerequisites

Before you begin, ensure you have:

- Node.js 16+ and npm installed
- Git for version control
- A GitHub account
- Basic knowledge of JavaScript, Node.js, and Express
- (Optional) Android development knowledge for mobile work

### Initial Setup

1. **Fork the Repository**
   ```bash
   # Click "Fork" button on GitHub
   # Then clone your fork:
   git clone https://github.com/YOUR_USERNAME/GameBet2.0-.git
   cd GameBet2.0-
   ```

2. **Add Upstream Remote**
   ```bash
   git remote add upstream https://github.com/1716/GameBet2.0-.git
   git remote -v
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Verify Setup**
   ```bash
   npm run verify
   npm run build
   ```

---

## Development Workflow

### Creating a Feature Branch

```bash
# Update your fork
git checkout main
git pull upstream main
git push origin main

# Create feature branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/bug-description
```

### Branch Naming Convention

Use descriptive branch names:

- `feature/add-new-game` - New features
- `fix/login-bug` - Bug fixes
- `docs/update-readme` - Documentation updates
- `refactor/optimize-build` - Code refactoring
- `test/add-unit-tests` - Adding tests
- `chore/update-dependencies` - Maintenance tasks

### Making Changes

1. **Make Your Changes**
   - Write clean, readable code
   - Follow existing code style
   - Add comments for complex logic
   - Update documentation as needed

2. **Test Your Changes**
   ```bash
   # Run verification
   npm run verify
   
   # Build the project
   npm run build
   
   # Test specific functionality
   npm start  # Start dev server
   ```

3. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: add new game feature"
   ```

### Keeping Your Branch Updated

```bash
# Fetch latest changes from upstream
git fetch upstream

# Rebase your branch
git rebase upstream/main

# Force push to your fork (if needed)
git push origin feature/your-feature-name --force-with-lease
```

---

## Coding Standards

### JavaScript Style Guide

#### General Principles

- Use ES6+ features when appropriate
- Prefer `const` over `let`, avoid `var`
- Use meaningful variable and function names
- Keep functions small and focused
- Avoid deeply nested code

#### Code Style

```javascript
// Good
const getUserById = async (userId) => {
  try {
    const user = await database.getUser(userId);
    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

// Avoid
function getUser(id) {
  var u = db.get(id);
  return u;
}
```

#### Naming Conventions

- **Variables/Functions**: camelCase (`userName`, `fetchData`)
- **Classes**: PascalCase (`GameManager`, `UserController`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_RETRIES`, `API_URL`)
- **Files**: kebab-case for scripts (`build-system.js`), camelCase for modules (`userService.js`)

#### Comments

```javascript
// Good - Explain WHY, not WHAT
// Hash password for security before storing in database
const hashedPassword = await bcrypt.hash(password, 10);

// Avoid - States the obvious
// Set x to 10
const x = 10;
```

### File Organization

```
GameBet2.0-/
├── src/                      # Frontend source code
│   ├── index.html
│   ├── main.js
│   ├── styles.css
│   └── manifest.json
├── scripts/                  # Build automation scripts
│   ├── build.js
│   ├── package.js
│   ├── deploy.js
│   └── verify.js
├── server.js                 # Backend server
├── database.js               # Database operations
└── tests/                    # Test files (if added)
    ├── unit/
    └── integration/
```

### Error Handling

Always handle errors appropriately:

```javascript
// Good
try {
  const result = await riskyOperation();
  console.log('✅ Operation successful:', result);
  return result;
} catch (error) {
  console.error('❌ Operation failed:', error);
  throw new Error(`Failed to complete operation: ${error.message}`);
}

// Avoid
const result = await riskyOperation();  // No error handling
```

### Logging

Use consistent emoji prefixes for logs:

```javascript
console.log('🏗️  Building project...');
console.log('✅ Build completed successfully');
console.log('⚠️  Warning: Missing optional file');
console.error('❌ Error: Build failed');
console.log('📦 Packaging artifacts...');
console.log('🚀 Deploying to production...');
console.log('🔍 Verifying deployment...');
```

---

## Commit Guidelines

### Commit Message Format

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

#### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks, dependency updates
- `perf`: Performance improvements
- `ci`: CI/CD changes

#### Examples

```bash
# Feature
git commit -m "feat(games): add poker game support"

# Bug fix
git commit -m "fix(auth): resolve JWT token expiration issue"

# Documentation
git commit -m "docs(readme): update installation instructions"

# With body and breaking change
git commit -m "feat(api): change authentication endpoint

BREAKING CHANGE: /api/login endpoint now requires email instead of username

Closes #123"
```

### Commit Best Practices

1. **Make Atomic Commits**
   - One logical change per commit
   - Easy to review and revert if needed

2. **Write Clear Messages**
   - Present tense ("add feature" not "added feature")
   - Imperative mood ("fix bug" not "fixes bug")
   - First line: 50 characters or less
   - Body: wrap at 72 characters

3. **Reference Issues**
   ```bash
   git commit -m "fix(betting): resolve odds calculation bug

   Fixed incorrect odds calculation for multi-bet scenarios.
   
   Fixes #456"
   ```

---

## Pull Request Process

### Before Submitting

1. **Ensure Your Code Works**
   ```bash
   npm run verify
   npm run build
   npm run package
   ```

2. **Update Documentation**
   - Update README.md if needed
   - Add/update code comments
   - Update CHANGELOG.md

3. **Rebase on Latest Main**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

### Creating a Pull Request

1. **Push Your Branch**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Open Pull Request on GitHub**
   - Go to your fork on GitHub
   - Click "New Pull Request"
   - Select your branch
   - Fill in the PR template

### Pull Request Template

```markdown
## Description
Brief description of what this PR does.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Related Issue
Closes #(issue number)

## Changes Made
- List key changes
- Use bullet points
- Be specific

## Testing
Describe how you tested your changes:
- [ ] Tested locally
- [ ] Tested on Android device
- [ ] Tested in multiple browsers
- [ ] Verified build process works

## Screenshots (if applicable)
Add screenshots to show visual changes.

## Checklist
- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review of my code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings or errors
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
```

### Code Review Process

1. **Maintainers Review**
   - Expect feedback and questions
   - Be responsive to comments
   - Make requested changes

2. **Address Feedback**
   ```bash
   # Make changes
   git add .
   git commit -m "refactor: address PR feedback"
   git push origin feature/your-feature-name
   ```

3. **Approval and Merge**
   - Once approved, maintainer will merge
   - Squash merge for feature branches
   - Merge commit for important features

### After Merge

1. **Delete Your Branch**
   ```bash
   git branch -d feature/your-feature-name
   git push origin --delete feature/your-feature-name
   ```

2. **Update Your Fork**
   ```bash
   git checkout main
   git pull upstream main
   git push origin main
   ```

---

## Testing

### Manual Testing

1. **Build Testing**
   ```bash
   # Clean build
   npm run clean
   npm run build
   
   # Verify outputs
   ls -la build/
   ```

2. **Server Testing**
   ```bash
   # Start development server
   npm start
   
   # Test in browser at http://localhost:3000
   ```

3. **Android Testing**
   ```bash
   # Build APK
   npm run build
   npm run package
   
   # Install on device/emulator
   adb install package/android/GameBet.apk
   ```

### Automated Testing (Future)

When test suite is added:

```bash
# Run all tests
npm test

# Run specific test file
npm test -- tests/unit/auth.test.js

# Run with coverage
npm test -- --coverage
```

### Testing Checklist

Before submitting PR:

- [ ] Feature works as expected
- [ ] No console errors or warnings
- [ ] Tested on multiple browsers (Chrome, Firefox, Safari)
- [ ] Tested on Android device (if mobile changes)
- [ ] Build process completes successfully
- [ ] No breaking changes to existing features
- [ ] Performance is acceptable

---

## Documentation

### Code Documentation

```javascript
/**
 * Authenticates user with JWT token
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @returns {Promise<Object>} User object with JWT token
 * @throws {Error} If authentication fails
 */
async function authenticateUser(email, password) {
  // Implementation
}
```

### README Updates

When adding new features:

1. Update feature list
2. Add usage examples
3. Update configuration section if needed

### API Documentation

Document API endpoints:

```javascript
/**
 * POST /api/auth/login
 * 
 * Request Body:
 * {
 *   "email": "user@example.com",
 *   "password": "securepassword"
 * }
 * 
 * Response:
 * {
 *   "token": "jwt.token.here",
 *   "user": { ... }
 * }
 * 
 * Errors:
 * - 401: Invalid credentials
 * - 400: Missing required fields
 */
```

### Changelog Updates

Update CHANGELOG.md for each significant change:

```markdown
## [Unreleased]

### Added
- New poker game support (#123)

### Changed
- Improved authentication flow (#124)

### Fixed
- Fixed odds calculation bug (#125)

### Deprecated
- Old betting API endpoints (use v2 instead)
```

---

## Release Process

### Version Numbering

Follow [Semantic Versioning](https://semver.org/):

- **MAJOR** version (1.0.0 → 2.0.0): Breaking changes
- **MINOR** version (1.0.0 → 1.1.0): New features, backward compatible
- **PATCH** version (1.0.0 → 1.0.1): Bug fixes, backward compatible

### Creating a Release

For maintainers only:

```bash
# Ensure main is up to date
git checkout main
git pull upstream main

# Create release
make release-minor  # or release-major, release-patch

# Or manually
npm run release 1.1.0 minor

# Push release
git push upstream main --tags
```

### Release Checklist

- [ ] All tests pass
- [ ] CHANGELOG.md updated
- [ ] Version bumped in package.json
- [ ] Release notes prepared
- [ ] Tested in staging environment
- [ ] Documentation updated
- [ ] Breaking changes documented
- [ ] Migration guide provided (if needed)

---

## Getting Help

### Communication Channels

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and ideas
- **Pull Requests**: Code contributions and reviews

### Asking Questions

When asking for help:

1. Search existing issues first
2. Provide context and details
3. Include error messages and logs
4. Share relevant code snippets
5. Describe what you've tried

### Reporting Bugs

Use this template:

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
 - OS: [e.g., Windows 10]
 - Browser: [e.g., Chrome 120]
 - Version: [e.g., 1.0.0]

**Additional context**
Any other relevant information.
```

---

## Recognition

Contributors will be recognized:

- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- GitHub contributor badge on profile

---

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (ISC License).

---

## Thank You!

Your contributions make GameBet 2.0 better for everyone. Whether you're fixing bugs, adding features, improving documentation, or helping other contributors, your work is valued and appreciated!

---

*Last Updated: 2025-10-11*  
*Version: 1.0.0*
