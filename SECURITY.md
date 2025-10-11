# Security Policy

## Supported Versions

Currently supported versions of GameBet 2.0:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of GameBet 2.0 seriously. If you believe you have found a security vulnerability, please report it to us responsibly.

### How to Report

**Please do NOT report security vulnerabilities through public GitHub issues.**

Instead, please report them via:

1. **Email:** Send details to the repository maintainers (check package.json for contact)
2. **GitHub Security Advisory:** Use GitHub's private vulnerability reporting feature
   - Go to: https://github.com/1716/GameBet2.0-/security/advisories/new

### What to Include

Please include as much of the following information as possible:

- Type of vulnerability (e.g., XSS, SQL injection, authentication bypass)
- Full paths of affected source file(s)
- Location of the affected source code (tag/branch/commit/URL)
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit it

### Response Timeline

- **Initial Response:** Within 48 hours
- **Status Update:** Within 7 days
- **Fix Timeline:** Varies based on severity
  - Critical: 7 days
  - High: 14 days
  - Medium: 30 days
  - Low: 90 days

## Security Best Practices

### For Deployment

#### Production Signing Keys

**⚠️ CRITICAL: Never use demo keys in production!**

The repository includes demo signing keys for development only:
- `signing.keystore` - Demo keystore
- `signing-key-info.txt` - Demo credentials

**For production:**

```bash
# Generate new production keystore
keytool -genkey -v -keystore production.keystore \
  -alias gamebet-production \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000

# Store securely:
# 1. Use a password manager
# 2. Backup in secure location
# 3. NEVER commit to version control
```

#### Environment Variables

Never hardcode sensitive data:

```bash
# Create .env file (add to .gitignore)
cat > .env << 'EOF'
NODE_ENV=production
JWT_SECRET=your-random-secure-secret-here-min-32-chars
DATABASE_URL=your-database-connection-string
API_KEY=your-api-key
EOF

# Set permissions
chmod 600 .env
```

**Generate secure secrets:**
```bash
# Generate random JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or
openssl rand -hex 32
```

#### HTTPS Enforcement

Always use HTTPS in production:

**Apache (.htaccess):**
```apache
# Force HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}/$1 [R=301,L]
```

**Nginx:**
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

### Authentication & Authorization

#### JWT Security

```javascript
// Good - Secure JWT configuration
const jwt = require('jsonwebtoken');

const token = jwt.sign(
  { userId: user.id },
  process.env.JWT_SECRET,
  {
    expiresIn: '1h',        // Short expiration
    algorithm: 'HS256',     // Secure algorithm
    issuer: 'gamebet.com',  // Identify issuer
    audience: 'gamebet-api' // Identify audience
  }
);

// Verify with same options
jwt.verify(token, process.env.JWT_SECRET, {
  algorithms: ['HS256'],
  issuer: 'gamebet.com',
  audience: 'gamebet-api'
});
```

#### Password Security

```javascript
// Good - Secure password hashing
const bcrypt = require('bcryptjs');

// Hash password with sufficient rounds
const saltRounds = 10;
const hashedPassword = await bcrypt.hash(password, saltRounds);

// Compare passwords securely
const isValid = await bcrypt.compare(password, hashedPassword);
```

**Never:**
- Store passwords in plain text
- Use weak hashing algorithms (MD5, SHA1)
- Log passwords (even for debugging)

#### Input Validation

Always validate and sanitize user input:

```javascript
// Example - Validate bet amount
function validateBetAmount(amount) {
  // Check type
  if (typeof amount !== 'number') {
    throw new Error('Invalid amount type');
  }
  
  // Check range
  if (amount < 1 || amount > 10000) {
    throw new Error('Amount out of range');
  }
  
  // Check decimal places
  if (!Number.isInteger(amount * 100)) {
    throw new Error('Invalid decimal places');
  }
  
  return amount;
}
```

### API Security

#### Rate Limiting

Implement rate limiting to prevent abuse:

```javascript
const rateLimit = require('express-rate-limit');

// Create limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});

// Apply to all routes
app.use('/api/', limiter);

// Stricter for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true
});

app.use('/api/auth/login', authLimiter);
```

#### CORS Configuration

Configure CORS properly:

```javascript
// Good - Restrictive CORS for production
const cors = require('cors');

app.use(cors({
  origin: ['https://yourdomain.com'],
  methods: ['GET', 'POST'],
  credentials: true,
  maxAge: 86400
}));

// Bad - Permissive CORS (only for development)
app.use(cors({
  origin: '*' // Allows all origins - NEVER in production!
}));
```

#### Security Headers

Set security headers:

```javascript
const helmet = require('helmet');

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// Or manually
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});
```

### Database Security

#### SQL Injection Prevention

Even with JSON database, be cautious:

```javascript
// Good - Validate and sanitize
const userId = parseInt(req.params.id, 10);
if (isNaN(userId)) {
  return res.status(400).json({ error: 'Invalid user ID' });
}

const user = db.get('users').find({ id: userId }).value();

// Bad - Direct use of user input
const user = db.get('users').find({ id: req.params.id }).value();
```

#### Sensitive Data

Never log or expose sensitive data:

```javascript
// Good - Sanitize before logging
const safeUser = {
  id: user.id,
  email: user.email,
  // Don't include password, token, etc.
};
console.log('User logged in:', safeUser);

// Bad - Logging sensitive data
console.log('User:', user); // Might include password hash
```

### File Upload Security

If implementing file uploads:

```javascript
const multer = require('multer');
const path = require('path');

// Configure multer with restrictions
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
  fileFilter: (req, file, cb) => {
    // Allow only specific file types
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Invalid file type'));
  }
});
```

### Android App Security

#### App Signing

- Use separate keys for development and production
- Store production keys securely (password manager, secure vault)
- Backup keys in multiple secure locations
- Never commit keys to version control

#### ProGuard/R8

Enable code obfuscation:

```gradle
buildTypes {
    release {
        minifyEnabled true
        shrinkResources true
        proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
    }
}
```

#### SSL Pinning

For production, consider SSL certificate pinning:

```javascript
// In Android WebView configuration
// Pin to specific certificate
```

### CI/CD Security

#### GitHub Actions Secrets

- Use GitHub Secrets for sensitive data
- Never echo secrets in logs
- Use environment-specific secrets

```yaml
# Good
- name: Deploy
  env:
    API_KEY: ${{ secrets.PRODUCTION_API_KEY }}
  run: |
    # Use API_KEY without exposing it

# Bad - Never do this!
- name: Debug
  run: echo ${{ secrets.API_KEY }}
```

#### Dependency Security

```bash
# Check for vulnerabilities
npm audit

# Fix automatically when possible
npm audit fix

# Review and update dependencies regularly
npm outdated
```

### Security Checklist

Before deploying to production:

#### Configuration
- [ ] Environment variables configured (not hardcoded)
- [ ] Production signing keys generated (not demo keys)
- [ ] JWT_SECRET is random and secure (32+ characters)
- [ ] Database credentials secured
- [ ] API keys secured

#### Network
- [ ] HTTPS enabled and enforced
- [ ] SSL certificate valid and not expired
- [ ] Security headers configured (CSP, HSTS, etc.)
- [ ] CORS properly configured (not '*')
- [ ] Rate limiting enabled

#### Authentication
- [ ] Passwords hashed with bcrypt (10+ rounds)
- [ ] JWT tokens expire (1 hour or less)
- [ ] JWT secret is secure and not default
- [ ] Failed login attempts limited
- [ ] Session management implemented

#### Data Protection
- [ ] Input validation on all user input
- [ ] Output encoding to prevent XSS
- [ ] SQL/NoSQL injection prevented
- [ ] Sensitive data not logged
- [ ] Error messages don't reveal system details

#### Android App
- [ ] Production signing key used
- [ ] Code obfuscation enabled
- [ ] Debug logging disabled
- [ ] App Links properly configured
- [ ] Permissions minimized

#### Monitoring
- [ ] Logging configured
- [ ] Error tracking enabled (Sentry, etc.)
- [ ] Uptime monitoring active
- [ ] Security alerts configured
- [ ] Backup system in place

## Vulnerability Disclosure Policy

We follow coordinated disclosure:

1. **Private Disclosure:** Report sent to maintainers privately
2. **Acknowledgment:** We confirm receipt within 48 hours
3. **Investigation:** We investigate and develop a fix
4. **Fix Released:** We release a patched version
5. **Public Disclosure:** 
   - Security advisory published
   - CVE requested if applicable
   - Credit given to reporter (if desired)

### Timeline

- **Day 0:** Vulnerability reported
- **Day 2:** Acknowledgment sent
- **Day 7-90:** Fix developed (based on severity)
- **Day X:** Patch released
- **Day X+7:** Public disclosure (after users have time to update)

## Security Resources

### Tools

- **npm audit:** Check for known vulnerabilities
- **Snyk:** Continuous security monitoring
- **OWASP ZAP:** Web application security scanner
- **nmap:** Network security scanner

### Learning Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [Android Security Best Practices](https://developer.android.com/topic/security/best-practices)

## Contact

For security concerns, contact:
- **Email:** [Security contact from package.json]
- **Security Advisory:** https://github.com/1716/GameBet2.0-/security/advisories/new

## Hall of Fame

We recognize and thank security researchers who help improve GameBet security:

*No vulnerabilities reported yet*

---

*This security policy is subject to change. Last updated: 2025-10-11*
