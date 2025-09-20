# GameBet 2.0 - Enhanced AI Gaming Platform

## Overview

GameBet 2.0 is now a comprehensive AI-powered gaming and betting platform with advanced features including:

- 🤖 **AI-Powered Game Logic**: Intelligent odds calculation, fraud detection, and dynamic difficulty adjustment
- 💳 **Multi-Payment Integration**: PayPal, CashApp, Bank Transfer, and Stripe support  
- 🔌 **Plugin System**: Extensible architecture with automated plugin installation
- 👤 **Enhanced User Profiles**: Comprehensive CRUD operations with payment method management
- 🔐 **API License Management**: Secure API access with usage tracking and validation
- 🔗 **Connection Management**: Robust API connections with retry logic and monitoring

## Quick Start

### 1. Installation

```bash
# Clone the repository
git clone https://github.com/1716/GameBet2.0-.git
cd GameBet2.0-

# Install dependencies
npm install

# Install Python dependencies (optional, for advanced AI features)
pip3 install -r requirements.txt
```

### 2. Configuration

Copy the environment template:
```bash
cp .env.example .env
```

Edit `.env` with your API credentials:
- PayPal Client ID and Secret
- Stripe API keys
- Database credentials
- JWT secrets

### 3. Start the Server

```bash
npm start
```

The server will automatically:
- ✅ Install required plugins (payment-integration, ai-analytics)
- ✅ Initialize AI systems
- ✅ Setup API connections
- ✅ Load license configurations

## API Documentation

### Authentication

Most endpoints require either JWT tokens or API license keys:

```bash
# JWT Authentication (for user endpoints)
Authorization: Bearer <jwt_token>

# API License Authentication (for admin/system endpoints)  
x-api-key: <license_key>
```

### Available License Keys

- `demo-paypal-key-123456789abcdef` - Service: `api` (General API access)
- `demo-stripe-key-987654321fedcba` - Service: `admin` (Admin operations)
- `demo-ai-service-key-abcdef123456789` - Service: `ai` (AI analytics)

### Public Endpoints

#### Get Games (Enhanced with AI)
```bash
GET /api/games
```
Returns games with AI-calculated optimal odds and analytics.

#### User Registration  
```bash
POST /api/register
Content-Type: application/json

{
  "username": "player1",
  "password": "securepass",
  "profileData": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com"
  }
}
```

#### User Login
```bash
POST /api/login  
Content-Type: application/json

{
  "username": "player1",
  "password": "securepass"
}
```

### Protected User Endpoints (JWT Required)

#### Get User Profile
```bash
GET /api/profile
Authorization: Bearer <jwt_token>
```

#### Update User Profile
```bash
PUT /api/profile
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "personalInfo": {
    "firstName": "John",
    "lastName": "Smith"
  },
  "preferences": {
    "currency": "USD",
    "notifications": true
  }
}
```

#### Add Payment Method
```bash
POST /api/profile/payment-methods
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "method": "paypal",
  "details": {
    "email": "john@paypal.com"
  }
}
```

#### Enhanced Betting (with AI)
```bash
POST /api/bets
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "gameId": 1,
  "amount": 50
}
```
Response includes AI analysis, fraud detection, and behavioral recommendations.

#### Enhanced Withdrawal System
```bash
POST /api/withdraw
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "amount": 100,
  "method": "paypal",
  "details": {
    "email": "john@paypal.com"
  }
}
```

#### Get Withdrawal History
```bash
GET /api/withdrawals
Authorization: Bearer <jwt_token>
```

### API License Endpoints (License Key Required)

#### Plugin Management
```bash
# List installed plugins
GET /api/plugins
x-api-key: demo-paypal-key-123456789abcdef

# Install plugin
POST /api/plugins/payment-integration/install
x-api-key: demo-paypal-key-123456789abcdef

# Uninstall plugin  
POST /api/plugins/payment-integration/uninstall
x-api-key: demo-paypal-key-123456789abcdef
```

#### Connection Status
```bash
GET /api/connections/status
x-api-key: demo-paypal-key-123456789abcdef
```

### AI Analytics Endpoints (AI License Required)

#### Game Analytics
```bash
GET /api/analytics/game/1
x-api-key: demo-ai-service-key-abcdef123456789
```

### Admin Endpoints (Admin License Required)

#### Withdrawal Statistics
```bash
GET /api/admin/withdrawal-stats
x-api-key: demo-stripe-key-987654321fedcba
```

#### User Profile Management
```bash
# Get all profiles
GET /api/admin/profiles
x-api-key: demo-stripe-key-987654321fedcba

# Search profiles
GET /api/admin/search-profiles?q=john
x-api-key: demo-stripe-key-987654321fedcba
```

#### Generate API License
```bash
POST /api/licenses/generate
x-api-key: demo-stripe-key-987654321fedcba
Content-Type: application/json

{
  "service": "api",
  "maxUsage": 1000,
  "expiresIn": "1y"
}
```

## AI Features

### Game Logic Enhancement
- **Dynamic Odds**: AI calculates optimal odds based on player behavior and market conditions
- **Fairness Control**: Maintains configurable house edge while ensuring fair gameplay
- **Fraud Detection**: Real-time analysis of betting patterns to detect suspicious activity
- **Behavioral Analysis**: Provides responsible gaming recommendations based on player patterns

### Payment Intelligence
- **Risk Assessment**: AI evaluates withdrawal requests for potential fraud
- **Pattern Recognition**: Detects unusual spending patterns
- **Method Verification**: Intelligent verification of payment methods

## Plugin System

### Available Plugins

1. **payment-integration**: Handles PayPal, CashApp, Stripe, and bank transfers
2. **ai-analytics**: Provides AI-powered game analytics and fraud detection

### Creating Custom Plugins

Plugins follow a simple interface:

```javascript
class MyPlugin {
    constructor() {
        this.name = 'my-plugin';
    }

    async install() {
        // Installation logic
    }

    async uninstall() {
        // Cleanup logic  
    }
}

module.exports = MyPlugin;
```

Add plugin to `config/auto-install.json` for automatic installation.

## Payment Integration

### Supported Methods

1. **PayPal**: Full API integration with sandbox/production modes
2. **CashApp**: Mock implementation (pending official API)
3. **Bank Transfer**: Secure bank account integration
4. **Stripe**: Card payment processing

### Security Features

- Encrypted payment data storage
- Secure transaction logging
- PCI DSS compliance considerations
- Fraud detection and prevention

## Development

### Testing the System

```bash
# Start server
npm start

# Test public API
curl http://localhost:3000/api/games

# Test AI analytics
curl -H "x-api-key: demo-ai-service-key-abcdef123456789" \
     http://localhost:3000/api/analytics/game/1

# Test admin features  
curl -H "x-api-key: demo-stripe-key-987654321fedcba" \
     http://localhost:3000/api/admin/withdrawal-stats
```

### Building and Deployment

```bash
# Build the application
npm run build

# Create deployment package
npm run package

# Deploy to staging/production
npm run deploy
```

## Security Considerations

### Production Setup

1. **Replace Demo Keys**: Generate new API license keys for production
2. **Environment Variables**: Use secure environment variable management
3. **Database Security**: Implement proper database encryption and access controls
4. **SSL/TLS**: Enable HTTPS for all communications
5. **Rate Limiting**: Configure API rate limiting and DDoS protection

### Data Protection

- User profile data is encrypted at rest
- Payment information uses industry-standard encryption
- Sensitive API keys are never logged or exposed
- Regular security audits and vulnerability assessments

## License

ISC License - See package.json for details

## Support

For technical support, feature requests, or bug reports, please open an issue in the GitHub repository.

---

**GameBet 2.0** - Powered by AI, Built for the Future 🚀