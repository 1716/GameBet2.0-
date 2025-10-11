# GameBet 2.0 - Deployment Guide

Complete guide for deploying GameBet 2.0 to various platforms including Google Play Store, web servers, and Firebase.

## Table of Contents

- [Pre-Deployment Checklist](#pre-deployment-checklist)
- [Google Play Store Deployment](#google-play-store-deployment)
- [Web Server Deployment](#web-server-deployment)
- [Firebase Hosting Deployment](#firebase-hosting-deployment)
- [Direct APK Distribution](#direct-apk-distribution)
- [Staging Environment](#staging-environment)
- [Production Best Practices](#production-best-practices)
- [Rollback Procedures](#rollback-procedures)

---

## Pre-Deployment Checklist

Before deploying to any environment, ensure:

### Code Quality
- [ ] All tests pass: `npm test` (if tests are configured)
- [ ] Code is linted: `npm run lint` (if linter is configured)
- [ ] Build succeeds: `npm run build`
- [ ] No console errors or warnings

### Configuration
- [ ] Version number updated in `package.json`
- [ ] Environment variables configured
- [ ] API endpoints point to production
- [ ] Debug logging disabled
- [ ] Analytics tracking configured

### Security
- [ ] Production signing keys generated (not demo keys)
- [ ] Secrets removed from code
- [ ] HTTPS enabled for web deployment
- [ ] API authentication configured
- [ ] Rate limiting enabled

### Documentation
- [ ] CHANGELOG updated
- [ ] Release notes prepared
- [ ] User documentation updated
- [ ] API documentation current

### Testing
- [ ] Tested on target Android versions
- [ ] Tested in target browsers
- [ ] Performance testing completed
- [ ] Security audit performed

---

## Google Play Store Deployment

### Prerequisites

1. **Google Play Developer Account**
   - Cost: $25 one-time fee
   - Sign up at: https://play.google.com/console/signup

2. **Production Signing Key**
   ```bash
   # Generate production keystore (if not already done)
   keytool -genkey -v -keystore production.keystore \
     -alias gamebet-production \
     -keyalg RSA \
     -keysize 2048 \
     -validity 10000
   ```

3. **App Assets Ready**
   - App icon (512x512 PNG)
   - Feature graphic (1024x500)
   - Screenshots (minimum 2 per form factor)
   - Privacy policy URL
   - Store listing description

### Step 1: Prepare Android App Bundle

```bash
# Clean previous builds
npm run clean

# Verify environment
npm run verify

# Build project
npm run build

# Package for distribution
npm run package

# Prepare for Android Store
DEPLOY_TARGET=android-store npm run deploy
```

The Android App Bundle will be at:
```
deploy/android-store/GameBet.aab
```

### Step 2: Create App in Play Console

1. **Login to Play Console**
   - Visit: https://play.google.com/console/
   - Select your developer account

2. **Create New App**
   - Click "Create app"
   - Enter app name: "GameBet 2.0"
   - Select default language
   - Choose app or game: Game
   - Free or paid: Choose based on your model
   - Accept policies

3. **Set Up App Signing**
   - Navigate to: Setup > App signing
   - Choose: "Let Google manage and protect your key"
   - Upload your upload keystore certificate
   - Google will generate and manage the app signing key

### Step 3: Upload App Bundle

1. **Navigate to Production Track**
   - Go to: Release > Production
   - Click "Create new release"

2. **Upload AAB**
   - Click "Upload"
   - Select `deploy/android-store/GameBet.aab`
   - Wait for upload and processing

3. **Add Release Notes**
   ```
   Version 1.0.0
   
   • Initial release of GameBet 2.0
   • Premium gaming and betting platform
   • Secure authentication system
   • Real-time game updates
   • Optimized performance
   ```

4. **Review and Rollout**
   - Review release details
   - Set rollout percentage (start with 10-20% for staged rollout)
   - Click "Review release"
   - Click "Start rollout to Production"

### Step 4: Complete Store Listing

Use the metadata from `deploy/android-store/store-listing.json`:

1. **Main Store Listing**
   - **App name**: GameBet 2.0
   - **Short description**: Premium Gaming & Betting Platform
   - **Full description**: (Use description from store-listing.json)
   - **App icon**: Upload 512x512 PNG
   - **Feature graphic**: Upload 1024x500 PNG
   - **App category**: Games
   - **Content rating**: Complete questionnaire (Mature 17+)
   - **Privacy policy**: Add URL

2. **Screenshots**
   - Minimum 2 screenshots per form factor
   - Phone: 16:9 or 9:16 aspect ratio
   - Tablet: Screenshots optimized for larger screens (if supported)
   - Take screenshots of key features

3. **Contact Details**
   - Email address
   - Phone number (optional)
   - Website URL

### Step 5: Upload Asset Links

Upload `assetlinks.json` to your web server:

```bash
# Upload to your web server
scp deploy/android-store/assetlinks.json user@server:/.well-known/

# Verify it's accessible
curl https://yourdomain.com/.well-known/assetlinks.json
```

This enables Android App Links functionality.

### Step 6: Complete Content Rating

1. Navigate to: Content rating
2. Complete the questionnaire honestly
3. Expected rating: Mature 17+ (due to betting/gambling content)
4. Submit for rating

### Step 7: Set Up Pricing and Distribution

1. **Pricing**
   - Set as Free or Paid
   - Configure in-app purchases if applicable

2. **Countries**
   - Select available countries
   - Note: Gambling apps may be restricted in some regions
   - Review local gambling laws

3. **Program Opt-in**
   - Consider Google Play Pass (if eligible)
   - Android Excellence program

### Step 8: Submit for Review

1. Review all sections for completeness
2. Fix any warnings or errors
3. Click "Submit for review"

**Review Timeline:**
- Initial review: 1-7 days
- Updates: Usually faster (hours to 2 days)

### Step 9: Monitor Release

After approval:

1. **Check Play Console Dashboard**
   - Monitor install numbers
   - Check crash reports
   - Review user ratings and feedback

2. **Staged Rollout**
   ```
   Day 1: 10% rollout - Monitor for issues
   Day 3: 25% rollout - If stable
   Day 5: 50% rollout - If stable
   Day 7: 100% rollout - Full release
   ```

3. **Emergency Halt**
   - If critical issues found: Halt rollout immediately
   - Fix issues and upload new version
   - Resume rollout after verification

---

## Web Server Deployment

### Apache Deployment

#### Step 1: Prepare Deployment

```bash
# Build and package
npm run build
npm run package

# Prepare web deployment
DEPLOY_TARGET=web npm run deploy
```

Files will be in `deploy/web/`:
- `assetlinks.json`
- `.htaccess`
- `README.md`
- `DEPLOYMENT.md`

#### Step 2: Configure Apache

1. **Enable Required Modules**
   ```bash
   sudo a2enmod rewrite
   sudo a2enmod headers
   sudo a2enmod ssl
   sudo systemctl restart apache2
   ```

2. **Configure Virtual Host**
   ```apache
   <VirtualHost *:443>
       ServerName yourdomain.com
       DocumentRoot /var/www/gamebet
       
       SSLEngine on
       SSLCertificateFile /etc/ssl/certs/yourdomain.com.crt
       SSLCertificateKeyFile /etc/ssl/private/yourdomain.com.key
       
       <Directory /var/www/gamebet>
           Options -Indexes +FollowSymLinks
           AllowOverride All
           Require all granted
       </Directory>
       
       # App Links
       Alias /.well-known /var/www/gamebet/.well-known
       <Directory /var/www/gamebet/.well-known>
           Require all granted
       </Directory>
   </VirtualHost>
   ```

#### Step 3: Upload Files

```bash
# Create directory
ssh user@server 'sudo mkdir -p /var/www/gamebet'

# Upload files
scp -r deploy/web/* user@server:/var/www/gamebet/

# Set permissions
ssh user@server 'sudo chown -R www-data:www-data /var/www/gamebet'
ssh user@server 'sudo chmod -R 755 /var/www/gamebet'
```

#### Step 4: Configure SSL

Using Let's Encrypt (free SSL):

```bash
# Install certbot
sudo apt-get install certbot python3-certbot-apache

# Obtain certificate
sudo certbot --apache -d yourdomain.com -d www.yourdomain.com

# Test auto-renewal
sudo certbot renew --dry-run
```

#### Step 5: Verify Deployment

```bash
# Check if site is accessible
curl -I https://yourdomain.com

# Verify assetlinks.json
curl https://yourdomain.com/.well-known/assetlinks.json

# Check headers
curl -I https://yourdomain.com | grep -i "x-frame-options\|x-content-type-options"
```

### Nginx Deployment

#### Step 1: Configure Nginx

Create `/etc/nginx/sites-available/gamebet`:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;
    
    root /var/www/gamebet;
    index index.html index.htm;
    
    # SSL Configuration
    ssl_certificate /etc/ssl/certs/yourdomain.com.crt;
    ssl_certificate_key /etc/ssl/private/yourdomain.com.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    
    # Security Headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # App Links
    location /.well-known/ {
        allow all;
    }
    
    # Main application
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### Step 2: Enable Site

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/gamebet /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

---

## Firebase Hosting Deployment

### Step 1: Install Firebase CLI

```bash
# Install globally
npm install -g firebase-tools

# Verify installation
firebase --version
```

### Step 2: Login and Initialize

```bash
# Login to Firebase
firebase login

# Initialize project (if not already done)
firebase init hosting

# Select options:
# - Use existing project
# - Public directory: build
# - Configure as SPA: Yes
# - Set up automatic builds: No (we handle this separately)
```

### Step 3: Configure Firebase

The `firebase.json` is already configured:

```json
{
  "hosting": {
    "public": "build",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(jpg|jpeg|gif|png|svg|webp)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  }
}
```

### Step 4: Build and Deploy

```bash
# Build project
npm run build

# Deploy to Firebase
firebase deploy --only hosting

# Or deploy with message
firebase deploy --only hosting -m "Production release v1.0.0"
```

### Step 5: Deploy Functions (if using)

```bash
# Install function dependencies
cd functions
npm install
cd ..

# Deploy functions
firebase deploy --only functions

# Or deploy everything
firebase deploy
```

### Step 6: Configure Custom Domain

1. **In Firebase Console**
   - Go to Hosting section
   - Click "Add custom domain"
   - Enter your domain: `yourdomain.com`
   - Follow DNS configuration instructions

2. **Update DNS Records**
   Add DNS records as shown in Firebase Console:
   ```
   A Record: @ -> 151.101.1.195
   A Record: @ -> 151.101.65.195
   ```

3. **Wait for SSL Provisioning**
   - Firebase automatically provisions SSL certificate
   - Usually takes 1-24 hours

### Step 7: Verify Deployment

```bash
# Check deployment status
firebase hosting:channel:list

# View deployment URL
firebase hosting:channel:open
```

---

## Direct APK Distribution

For distributing APK outside of Google Play Store:

### Step 1: Prepare APK

```bash
# Build and package
npm run build
npm run package

# APK location
ls -lh package/android/GameBet.apk
```

### Step 2: Generate Checksums

```bash
# Generate SHA256 checksum
cd package/android
sha256sum GameBet.apk > GameBet.apk.sha256

# Or on macOS
shasum -a 256 GameBet.apk > GameBet.apk.sha256
```

### Step 3: Create Download Page

Create a simple HTML page for distribution:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Download GameBet 2.0</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
    <h1>GameBet 2.0 - Download</h1>
    
    <h2>Android Installation</h2>
    <ol>
        <li>Download the APK below</li>
        <li>Enable "Unknown Sources" in Settings</li>
        <li>Install the downloaded APK</li>
    </ol>
    
    <a href="GameBet.apk" download>
        <button>Download GameBet.apk (6.1 MB)</button>
    </a>
    
    <h3>Verify Integrity</h3>
    <p>SHA256: <code>[insert checksum here]</code></p>
    
    <h3>Requirements</h3>
    <ul>
        <li>Android 5.0 or higher</li>
        <li>100MB free storage</li>
    </ul>
</body>
</html>
```

### Step 4: Host APK

Upload to your server:

```bash
# Create downloads directory
ssh user@server 'mkdir -p /var/www/downloads'

# Upload APK and checksum
scp GameBet.apk GameBet.apk.sha256 download.html user@server:/var/www/downloads/
```

### Step 5: Set Up Analytics (Optional)

Track downloads using server logs or analytics:

```bash
# In Apache .htaccess
<Files "GameBet.apk">
    Header set Content-Disposition "attachment"
    # Log downloads
</Files>
```

---

## Staging Environment

### Create Staging Deployment

```bash
# Build project
npm run build
npm run package

# Deploy to staging
npm run deploy
# Or
make deploy

# Files in deploy/staging/
```

### Staging Best Practices

1. **Use Separate Database**
   - Don't use production database
   - Use staging/test data

2. **Environment Variables**
   ```bash
   NODE_ENV=staging
   API_URL=https://staging-api.yourdomain.com
   DEBUG=true
   ```

3. **Password Protection**
   - Use .htpasswd for Apache
   - Use basic auth for Nginx

4. **Testing Checklist**
   - [ ] All features work
   - [ ] No console errors
   - [ ] Performance is acceptable
   - [ ] Mobile responsive
   - [ ] Analytics working

---

## Production Best Practices

### Security

1. **Use HTTPS Everywhere**
   - Enforce HTTPS redirects
   - Use HSTS headers
   - Valid SSL certificate

2. **Content Security Policy**
   ```apache
   Header set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
   ```

3. **Rate Limiting**
   - Implement API rate limiting
   - Protect against DDoS

### Monitoring

1. **Set Up Logging**
   - Application logs
   - Server logs
   - Error tracking (Sentry, Rollbar)

2. **Uptime Monitoring**
   - Use UptimeRobot or Pingdom
   - Set up alerts

3. **Analytics**
   - Google Analytics
   - Firebase Analytics
   - Custom metrics

### Backups

1. **Database Backups**
   ```bash
   # Daily automated backup
   0 2 * * * /usr/bin/backup-database.sh
   ```

2. **File Backups**
   - Use rsync or similar
   - Keep multiple versions
   - Test restores regularly

### Performance

1. **Enable Caching**
   - Browser caching
   - CDN for static assets
   - Redis/Memcached for API

2. **Optimize Assets**
   - Minify JavaScript/CSS
   - Compress images
   - Use WebP format

3. **Load Testing**
   - Test with expected traffic
   - Identify bottlenecks
   - Scale accordingly

---

## Rollback Procedures

### Emergency Rollback

If critical issues are discovered:

#### Google Play Store

1. **Halt Rollout**
   - Play Console > Release > Production
   - Click "Halt rollout"

2. **Revert to Previous Version**
   - Not directly possible
   - Must upload previous AAB as new version
   - Increment version code

3. **Expedited Review**
   - Submit critical update
   - Explain urgency in review notes

#### Web Deployment

1. **Quick Rollback**
   ```bash
   # Restore from backup
   ssh user@server 'cd /var/www && mv gamebet gamebet-broken && mv gamebet-backup gamebet'
   
   # Or use Git
   ssh user@server 'cd /var/www/gamebet && git reset --hard <previous-commit>'
   ```

2. **Verify Rollback**
   ```bash
   curl -I https://yourdomain.com
   ```

#### Firebase Hosting

```bash
# List previous releases
firebase hosting:channel:list

# Rollback to previous version
firebase hosting:rollback

# Or deploy specific version
firebase deploy --only hosting -m "Rollback to v1.0.0"
```

### Post-Rollback Actions

1. **Investigate Issue**
   - Check logs
   - Reproduce bug
   - Create fix

2. **Notify Users**
   - Post update on social media
   - In-app notification
   - Email if necessary

3. **Test Fix**
   - Test thoroughly in staging
   - QA verification
   - Code review

4. **Redeploy**
   - Follow normal deployment process
   - Monitor closely
   - Staged rollout if possible

---

## Deployment Checklist

Use this checklist for each deployment:

### Pre-Deployment
- [ ] Code tested and reviewed
- [ ] Version number updated
- [ ] CHANGELOG updated
- [ ] Release notes prepared
- [ ] Environment variables configured
- [ ] Database migrations ready (if needed)
- [ ] Backup of current production

### Deployment
- [ ] Build successful
- [ ] All tests pass
- [ ] Artifacts uploaded
- [ ] Deployment scripts executed
- [ ] Verification tests run

### Post-Deployment
- [ ] Application accessible
- [ ] Key features tested
- [ ] No critical errors in logs
- [ ] Analytics tracking
- [ ] Monitoring alerts configured
- [ ] Team notified
- [ ] Documentation updated

---

## Getting Help

For deployment issues:

1. Check server logs: `/var/log/apache2/error.log` or `/var/log/nginx/error.log`
2. Check application logs
3. Review [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
4. Test in staging environment first
5. Contact support with specific error messages

---

## Additional Resources

- [Google Play Console Help](https://support.google.com/googleplay/android-developer)
- [Firebase Hosting Documentation](https://firebase.google.com/docs/hosting)
- [Apache Documentation](https://httpd.apache.org/docs/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt](https://letsencrypt.org/getting-started/)

---

*Last Updated: 2025-10-11*  
*Version: 1.0.0*
