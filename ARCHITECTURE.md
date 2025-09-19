# GameBet 2.0 Build System Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     GameBet 2.0 Build System                    │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Source Files  │    │   Build Scripts │    │  CI/CD Workflows │
│                 │    │                 │    │                 │
│ • GameBet.aab   │───▶│ • verify.js     │───▶│ • build.yml     │
│ • GameBet.apk   │    │ • build.js      │    │ • release.yml   │
│ • assetlinks.js │    │ • package.js    │    │ • deploy.yml    │
│ • signing.*     │    │ • deploy.js     │    │                 │
│                 │    │ • release.js    │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        │                       │                       │
        │                       │                       │
        ▼                       ▼                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Build Pipeline                           │
├─────────────────┬─────────────────┬─────────────────┬──────────┤
│    Verify       │     Build       │    Package      │  Deploy  │
│                 │                 │                 │          │
│ • Environment   │ • Copy files    │ • Android pkg   │ • Staging│
│ • Dependencies  │ • Generate      │ • Web pkg       │ • Web    │
│ • File integrity│   manifests     │ • Complete pkg  │ • Store  │
│ • Signing keys  │ • Create        │ • Archive       │          │
│                 │   checksums     │                 │          │
└─────────────────┴─────────────────┴─────────────────┴──────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Output Structure                         │
├─────────────────┬─────────────────┬─────────────────┬──────────┤
│     build/      │    package/     │    deploy/      │releases/ │
│                 │                 │                 │          │
│ • GameBet.aab   │ • android/      │ • staging/      │ • v1.0.0/│
│ • GameBet.apk   │ • web/          │ • web/          │ • *.tar.gz│
│ • assetlinks    │ • complete/     │ • android-store/│          │
│ • manifest.json │ • package-info  │ • DEPLOYMENT.md │          │
│ • checksums     │                 │                 │          │
└─────────────────┴─────────────────┴─────────────────┴──────────┘
```

## Component Details

### 1. Source Files
- **GameBet.aab**: Android App Bundle for Google Play Store
- **GameBet.apk**: Android Package for direct installation  
- **assetlinks.json**: Android App Links verification
- **signing.keystore**: Android signing certificate
- **signing-key-info.txt**: Signing credentials

### 2. Build Scripts
- **verify.js**: Environment and dependency verification
- **build.js**: Main build process and artifact generation
- **package.js**: Create distribution packages
- **deploy.js**: Prepare deployment configurations
- **release.js**: Version management and release creation
- **clean.js**: Cleanup build artifacts

### 3. CI/CD Workflows
- **build.yml**: Automated build and testing
- **release.yml**: Release creation and GitHub publishing
- **deploy.yml**: Deployment preparation and artifacts

### 4. Command Interface
```
┌─────────────────────────────────────────────────────────────┐
│                    Command Interface                        │
├─────────────────┬─────────────────┬─────────────────────────┤
│   NPM Scripts   │  Make Commands  │       Manual CLI        │
│                 │                 │                         │
│ npm run verify  │ make verify     │ node scripts/verify.js  │
│ npm run build   │ make build      │ node scripts/build.js   │
│ npm run package │ make package    │ node scripts/package.js │
│ npm run deploy  │ make deploy     │ DEPLOY_TARGET=web       │
│ npm run release │ make release    │ node scripts/deploy.js  │
│ npm run clean   │ make clean      │                         │
└─────────────────┴─────────────────┴─────────────────────────┘
```

## Data Flow

### Build Flow
```
Source Files → Verify → Build → Package → Deploy → Release
     │           │        │        │        │        │
     ▼           ▼        ▼        ▼        ▼        ▼
Environment   Copy    Create    Prepare   Create   Archive
Check         Files   Packages  Deploy    Release  & Tag
              +       (Android, Configs   Files    
              Generate Web,     (.htaccess,
              Metadata Complete) store-listing)
```

### Deployment Targets
```
┌─────────────────┐
│   Package       │
│   Output        │
└─────────┬───────┘
          │
    ┌─────┼─────┐
    ▼     ▼     ▼
┌─────────┐ ┌─────────┐ ┌─────────────┐
│Staging  │ │   Web   │ │Android Store│
│         │ │         │ │             │
│Complete │ │assetlinks│ │GameBet.aab  │
│package  │ │.htaccess │ │assetlinks   │
│         │ │README   │ │store-listing│
└─────────┘ └─────────┘ └─────────────┘
```

## Integration Points

### GitHub Actions
- Triggered on push/PR to main branches
- Automated artifact generation and publishing
- Release creation with tagged versions

### Package Managers
- NPM for dependency management
- Node.js for cross-platform scripting
- Make for developer convenience

### Deployment Targets
- **Staging**: Complete development package
- **Web**: Apache/nginx ready files with .htaccess
- **Android Store**: Google Play Console ready bundle

## Security Considerations

### Development
- Demo signing keys included for testing
- Open source friendly configuration

### Production
- Regenerate signing keys for production
- Use environment variables for sensitive configs
- Implement proper secret management

---

This architecture ensures:
- ✅ Reproducible builds
- ✅ Multiple deployment targets
- ✅ Version management
- ✅ CI/CD integration
- ✅ Cross-platform compatibility
- ✅ Security best practices