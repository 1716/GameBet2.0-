# GitHub Actions Workflows

This directory contains CI/CD workflows for automating GameBet 2.0 build, test, deployment, and release processes.

## Available Workflows

### 1. Automated Build (`automated-build.yml`)

**Purpose:** Comprehensive automated build pipeline with quality checks and optional deployment.

**Triggers:**
- Push to `main` branch (excluding documentation changes)
- Pull requests to `main`
- Manual trigger via workflow_dispatch

**Jobs:**
1. **Build** - Verifies environment, builds project, packages artifacts
2. **Quality** - Validates build integrity and file sizes
3. **Deploy** - (Optional) Prepares deployment for selected target
4. **Notify** - Reports build status

**Manual Trigger Options:**
- `deploy_target`: Choose deployment target (none, staging, web, android-store, all)

**Usage:**
```bash
# Trigger manually via GitHub CLI
gh workflow run automated-build.yml -f deploy_target=staging

# Or via GitHub UI:
# Actions > Automated APK Build and Release > Run workflow
```

**Artifacts:**
- `gamebet-build-{sha}` - Build artifacts (30 days retention)
- `gamebet-android-{sha}` - Android packages (90 days retention)
- `gamebet-deploy-{target}-{sha}` - Deployment files (30 days retention)

---

### 2. Build and Package (`build.yml`)

**Purpose:** Traditional build and test workflow.

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main`

**Jobs:**
1. **Build** - Builds and packages the project
2. **Test** - Verifies build integrity

**Artifacts:**
- `gamebet-build-{sha}` - All build artifacts (30 days)
- `gamebet-android-{sha}` - Android APK/AAB only (90 days)

**Usage:**
Automatically runs on push/PR. No manual intervention needed.

---

### 3. Release (`release.yml`)

**Purpose:** Create versioned releases with GitHub Releases.

**Triggers:**
- Push of version tags (v*.*.*)
- Manual trigger via workflow_dispatch

**Manual Trigger Inputs:**
- `version`: Release version (e.g., 1.0.0)
- `release_type`: patch, minor, or major

**Process:**
1. Builds and packages the project
2. Creates release artifacts
3. Generates release notes
4. Creates GitHub Release
5. Uploads APK and AAB to release

**Usage:**

**Via Git Tags:**
```bash
# Create and push tag
git tag v1.0.0
git push origin v1.0.0

# Workflow automatically triggers
```

**Via Manual Trigger:**
```bash
# Using GitHub CLI
gh workflow run release.yml -f version=1.0.0 -f release_type=minor

# Or via GitHub UI:
# Actions > Release > Run workflow
```

**Artifacts:**
- `gamebet-release-v{version}` - Complete release package (365 days)
- Release assets attached to GitHub Release

---

### 4. Deploy to Firebase (`deploy.yml`)

**Purpose:** Deploy to Firebase Hosting.

**Triggers:**
- Push to `main` branch

**Requirements:**
- `FIREBASE_TOKEN` secret must be configured

**Process:**
1. Installs dependencies
2. Deploys to Firebase Hosting
3. Deploys Firebase Functions (if present)

**Setup:**
```bash
# Generate Firebase token
firebase login:ci

# Add token to GitHub Secrets:
# Settings > Secrets and variables > Actions > New repository secret
# Name: FIREBASE_TOKEN
# Value: [your token]
```

**Usage:**
Automatically runs on push to main. No manual intervention needed.

---

## Workflow Configuration

### Required Secrets

Configure these in: **Settings > Secrets and variables > Actions**

| Secret | Required For | Description |
|--------|-------------|-------------|
| `FIREBASE_TOKEN` | deploy.yml | Firebase deployment token |
| `GOOGLE_PLAY_KEY` | Future releases | Google Play API key (JSON) |
| `ANDROID_SIGNING_KEY` | Production builds | Production signing key (base64) |
| `ANDROID_SIGNING_PASS` | Production builds | Keystore password |
| `ANDROID_KEY_ALIAS` | Production builds | Key alias name |

### Environment Variables

Set these for custom configurations:

```yaml
env:
  NODE_ENV: production
  DEPLOY_TARGET: staging
  BUILD_NUMBER: ${{ github.run_number }}
```

---

## Workflow Best Practices

### 1. Branch Protection

Configure branch protection rules for `main`:
- Require pull request reviews
- Require status checks to pass (build.yml)
- Enforce up-to-date branches

### 2. Artifact Management

- **Build artifacts**: 30 days retention (frequent builds)
- **Android packages**: 90 days retention (for testing)
- **Release artifacts**: 365 days retention (important releases)

### 3. Secrets Management

- Never commit secrets to repository
- Use GitHub Secrets for sensitive data
- Rotate secrets regularly
- Use environment-specific secrets

### 4. Testing Strategy

```yaml
# Add testing step to workflows
- name: Run tests
  run: npm test
  
- name: Run linting
  run: npm run lint
```

---

## Monitoring Workflows

### View Workflow Runs

```bash
# List recent workflow runs
gh run list

# View specific run
gh run view [run-id]

# View run logs
gh run view [run-id] --log
```

### Troubleshooting Failed Workflows

1. **Check workflow logs** in GitHub Actions tab
2. **Review error messages** in failed steps
3. **Verify secrets** are configured correctly
4. **Test locally** using same commands
5. **Check artifact uploads** completed successfully

Common issues:
- Missing dependencies: Run `npm ci` instead of `npm install`
- Permission errors: Check file permissions and secrets
- Timeout errors: Increase timeout or optimize build
- Artifact errors: Verify paths exist before upload

---

## Local Testing

Test workflows locally using [act](https://github.com/nektos/act):

```bash
# Install act
brew install act  # macOS
# or
curl https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash

# Run workflow locally
act push --workflows .github/workflows/automated-build.yml

# Run specific job
act push --workflows .github/workflows/automated-build.yml --job build
```

---

## Workflow Optimization

### Caching

Speed up workflows with caching:

```yaml
- name: Cache dependencies
  uses: actions/cache@v3
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-
```

### Concurrent Jobs

Run independent jobs in parallel:

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    
  test:
    runs-on: ubuntu-latest
    needs: build  # Wait for build to complete
    
  lint:
    runs-on: ubuntu-latest  # Runs in parallel with build
```

### Matrix Builds

Test on multiple versions:

```yaml
strategy:
  matrix:
    node-version: [16, 18, 20]
    os: [ubuntu-latest, windows-latest, macos-latest]
```

---

## Security Considerations

### Workflow Security

1. **Use pinned actions** for security:
   ```yaml
   uses: actions/checkout@v3
   # Instead of: uses: actions/checkout@main
   ```

2. **Limit permissions**:
   ```yaml
   permissions:
     contents: read
     packages: write
   ```

3. **Validate inputs**:
   ```yaml
   - name: Validate input
     run: |
       if [[ ! "${{ inputs.version }}" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
         echo "Invalid version format"
         exit 1
       fi
   ```

4. **Secrets handling**:
   ```yaml
   # Good - Use secrets
   env:
     API_KEY: ${{ secrets.API_KEY }}
   
   # Bad - Never do this
   run: echo ${{ secrets.API_KEY }}  # Logs secret!
   ```

---

## Extending Workflows

### Add Custom Jobs

```yaml
custom-job:
  name: Custom Job
  runs-on: ubuntu-latest
  needs: build
  
  steps:
  - name: Custom Step
    run: |
      echo "Add custom logic here"
```

### Add Notifications

```yaml
- name: Notify Slack
  if: failure()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    text: Build failed!
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

### Add Code Coverage

```yaml
- name: Upload coverage
  uses: codecov/codecov-action@v3
  with:
    files: ./coverage/lcov.info
```

---

## Maintenance

### Regular Tasks

- **Review workflow runs** weekly
- **Update action versions** monthly
- **Rotate secrets** quarterly
- **Clean old artifacts** (automatic based on retention)
- **Review and optimize** performance

### Updating Actions

```yaml
# Check for updates
gh api repos/actions/checkout/releases/latest

# Update workflow
# Change: uses: actions/checkout@v3
# To: uses: actions/checkout@v4
```

---

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Workflow Syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [GitHub Actions Marketplace](https://github.com/marketplace?type=actions)
- [Community Forums](https://github.community/c/code-to-cloud/github-actions/41)

---

## Support

For workflow issues:

1. Check [TROUBLESHOOTING.md](../TROUBLESHOOTING.md#cicd-issues)
2. Review workflow logs in Actions tab
3. Test commands locally
4. Open an issue with workflow logs

---

*Last Updated: 2025-10-11*  
*Version: 1.0.0*
