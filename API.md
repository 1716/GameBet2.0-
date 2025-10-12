# GameBet 2.0 - API Documentation

Complete API reference for GameBet 2.0 backend server.

## Table of Contents

- [Overview](#overview)
- [Authentication](#authentication)
- [API Endpoints](#api-endpoints)
  - [Authentication Endpoints](#authentication-endpoints)
  - [Game Endpoints](#game-endpoints)
  - [Betting Endpoints](#betting-endpoints)
  - [Account Endpoints](#account-endpoints)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [Examples](#examples)

---

## Overview

### Base URL

```
Development: http://localhost:3000
Production: https://yourdomain.com
```

### API Version

Current version: `v1` (implicit - all endpoints under `/api/`)

### Content Type

All requests and responses use JSON:
```
Content-Type: application/json
```

### Authentication

Most endpoints require JWT bearer token authentication. See [Authentication](#authentication) section for details.

---

## Authentication

GameBet uses JWT (JSON Web Tokens) for authentication.

### Token Format

```
Authorization: Bearer <JWT_TOKEN>
```

### Token Lifecycle

- **Expiration**: 24 hours (86400 seconds)
- **Algorithm**: HS256
- **Secret**: Configured via `JWT_SECRET` environment variable

### Getting a Token

1. Register a new account via `/api/register`
2. Login via `/api/login` to receive a token
3. Include token in `Authorization` header for protected routes

---

## API Endpoints

### Authentication Endpoints

#### Register New User

Create a new user account.

```http
POST /api/register
```

**Request Body:**
```json
{
  "username": "string (required)",
  "password": "string (required, min 6 characters)"
}
```

**Response:** `201 Created`
```json
{
  "message": "User registered successfully!"
}
```

**Error Responses:**

- `400 Bad Request`: Missing or invalid parameters
  ```json
  {
    "message": "Username and password are required"
  }
  ```

- `409 Conflict`: Username already exists
  ```json
  {
    "message": "Username already exists"
  }
  ```

**Example:**
```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "player1",
    "password": "securepassword123"
  }'
```

---

#### Login

Authenticate and receive JWT token.

```http
POST /api/login
```

**Request Body:**
```json
{
  "username": "string (required)",
  "password": "string (required)"
}
```

**Response:** `200 OK`
```json
{
  "auth": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**

- `404 Not Found`: User doesn't exist
  ```json
  {
    "message": "User not found!"
  }
  ```

- `401 Unauthorized`: Invalid password
  ```json
  {
    "auth": false,
    "token": null,
    "message": "Invalid password!"
  }
  ```

**Example:**
```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "player1",
    "password": "securepassword123"
  }'
```

**JavaScript Example:**
```javascript
const response = await fetch('/api/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    username: 'player1',
    password: 'securepassword123'
  })
});

const data = await response.json();
if (data.auth) {
  // Store token for future requests
  localStorage.setItem('token', data.token);
}
```

---

### Game Endpoints

#### Get All Games

Retrieve list of available games.

```http
GET /api/games
```

**Authentication:** Not required

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "title": "Space Adventure",
    "description": "Embark on an epic journey through the cosmos.",
    "image": "https://via.placeholder.com/250x150.png?text=Space+Adventure",
    "odds": 1.5
  },
  {
    "id": 2,
    "title": "Ocean Quest",
    "description": "Explore the depths of the ocean and uncover ancient secrets.",
    "image": "https://via.placeholder.com/250x150.png?text=Ocean+Quest",
    "odds": 2.0
  },
  {
    "id": 3,
    "title": "Jungle Run",
    "description": "Navigate a treacherous jungle and outsmart your opponents.",
    "image": "https://via.placeholder.com/250x150.png?text=Jungle+Run",
    "odds": 1.8
  }
]
```

**Game Object Properties:**

| Property | Type | Description |
|----------|------|-------------|
| id | integer | Unique game identifier |
| title | string | Game name |
| description | string | Game description |
| image | string | Game image URL |
| odds | number | Betting odds (decimal format) |

**Example:**
```bash
curl http://localhost:3000/api/games
```

**JavaScript Example:**
```javascript
const response = await fetch('/api/games');
const games = await response.json();

games.forEach(game => {
  console.log(`${game.title} - Odds: ${game.odds}`);
});
```

---

### Betting Endpoints

#### Place Bet

Place a bet on a game.

```http
POST /api/bets
```

**Authentication:** Required (JWT Token)

**Request Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Request Body:**
```json
{
  "gameId": 1,
  "amount": 100
}
```

**Request Body Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| gameId | integer | Yes | ID of the game to bet on |
| amount | number | Yes | Bet amount (must be positive) |

**Response:** `200 OK`
```json
{
  "message": "Bet placed successfully!"
}
```

**Error Responses:**

- `401 Unauthorized`: Missing or invalid token
  ```json
  Status: 401 Unauthorized
  ```

- `403 Forbidden`: Invalid token
  ```json
  Status: 403 Forbidden
  ```

- `400 Bad Request`: Invalid parameters
  ```json
  {
    "message": "Invalid bet amount or game ID"
  }
  ```

**Example:**
```bash
curl -X POST http://localhost:3000/api/bets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "gameId": 1,
    "amount": 100
  }'
```

**JavaScript Example:**
```javascript
const token = localStorage.getItem('token');

const response = await fetch('/api/bets', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    gameId: 1,
    amount: 100
  })
});

const result = await response.json();
console.log(result.message);
```

---

### Account Endpoints

#### Get Balance

Retrieve current account balance.

```http
GET /api/balance
```

**Authentication:** Not required (but should be in production)

**Response:** `200 OK`
```json
{
  "balance": 1000
}
```

**Example:**
```bash
curl http://localhost:3000/api/balance
```

**JavaScript Example:**
```javascript
const response = await fetch('/api/balance');
const data = await response.json();
console.log(`Current balance: $${data.balance}`);
```

---

#### Withdraw Funds

Withdraw funds from account.

```http
POST /api/withdraw
```

**Authentication:** Not required (but should be in production)

**Request Body:**
```json
{
  "amount": 100,
  "method": "bank_transfer"
}
```

**Request Body Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| amount | number | Yes | Amount to withdraw (must be positive) |
| method | string | Yes | Withdrawal method (e.g., "bank_transfer", "paypal") |

**Response:** `200 OK`
```json
{
  "message": "Withdrawal successful!"
}
```

**Error Responses:**

- `400 Bad Request`: Insufficient balance
  ```json
  {
    "message": "Insufficient balance"
  }
  ```

**Example:**
```bash
curl -X POST http://localhost:3000/api/withdraw \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 100,
    "method": "bank_transfer"
  }'
```

---

## Error Handling

### HTTP Status Codes

| Status Code | Meaning |
|-------------|---------|
| 200 | Success - Request completed successfully |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid parameters or request |
| 401 | Unauthorized - Missing or invalid authentication |
| 403 | Forbidden - Valid auth but insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Resource already exists |
| 500 | Internal Server Error - Server-side error |

### Error Response Format

All errors return JSON with descriptive message:

```json
{
  "message": "Description of the error"
}
```

### Common Errors

#### Authentication Errors

**Missing Token:**
```
Status: 401 Unauthorized
```

**Invalid Token:**
```
Status: 403 Forbidden
```

**Expired Token:**
```
Status: 403 Forbidden
```

#### Validation Errors

**Missing Required Fields:**
```json
{
  "message": "Username and password are required"
}
```

**Invalid Data Type:**
```json
{
  "message": "Amount must be a number"
}
```

---

## Rate Limiting

### Current Implementation

No rate limiting currently implemented in development version.

### Production Recommendations

Implement rate limiting for production:

```javascript
const rateLimit = require('express-rate-limit');

// General API limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', apiLimiter);

// Stricter limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true
});

app.use('/api/register', authLimiter);
app.use('/api/login', authLimiter);
```

---

## Examples

### Complete Authentication Flow

```javascript
// 1. Register new user
async function register(username, password) {
  const response = await fetch('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  return await response.json();
}

// 2. Login and get token
async function login(username, password) {
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  const data = await response.json();
  
  if (data.auth) {
    localStorage.setItem('token', data.token);
  }
  
  return data;
}

// 3. Use token for authenticated requests
async function placeBet(gameId, amount) {
  const token = localStorage.getItem('token');
  
  const response = await fetch('/api/bets', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ gameId, amount })
  });
  
  return await response.json();
}

// Usage
async function main() {
  // Register
  await register('player1', 'password123');
  
  // Login
  const loginResult = await login('player1', 'password123');
  console.log('Logged in:', loginResult.auth);
  
  // Place bet
  const betResult = await placeBet(1, 100);
  console.log('Bet result:', betResult.message);
}
```

### Error Handling Example

```javascript
async function safeApiCall(url, options) {
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      // Handle HTTP errors
      const error = await response.json();
      throw new Error(error.message || 'API request failed');
    }
    
    return await response.json();
  } catch (error) {
    // Handle network errors or parsing errors
    console.error('API Error:', error.message);
    throw error;
  }
}

// Usage
try {
  const result = await safeApiCall('/api/bets', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ gameId: 1, amount: 100 })
  });
  console.log('Success:', result);
} catch (error) {
  console.error('Failed to place bet:', error.message);
}
```

### Token Refresh Example

```javascript
// Check if token is expired
function isTokenExpired(token) {
  try {
    const decoded = JSON.parse(atob(token.split('.')[1]));
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

// Auto-refresh token before requests
async function authenticatedFetch(url, options = {}) {
  let token = localStorage.getItem('token');
  
  // Check if token is expired
  if (isTokenExpired(token)) {
    // Re-login to get new token
    const username = localStorage.getItem('username');
    const password = localStorage.getItem('password'); // Don't actually store passwords!
    const loginResult = await login(username, password);
    token = loginResult.token;
  }
  
  // Add token to request
  options.headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`
  };
  
  return fetch(url, options);
}
```

---

## WebSocket Support (Future)

WebSocket support planned for real-time features:

- Live game updates
- Real-time odds changes
- Instant bet confirmations
- Live chat support

---

## Versioning

API versioning strategy for future releases:

- **Current**: Implicit v1 (no version in URL)
- **Future**: Explicit versioning via URL path
  - `/api/v1/games`
  - `/api/v2/games`

---

## Security Considerations

### Production Requirements

1. **HTTPS Only**: Never use HTTP in production
2. **Secure JWT Secret**: Use strong, random secret (32+ characters)
3. **Token Expiration**: Consider shorter expiration (1 hour instead of 24)
4. **Rate Limiting**: Implement rate limiting
5. **Input Validation**: Validate all user inputs
6. **CORS Configuration**: Restrict to specific origins
7. **SQL Injection**: Use parameterized queries (if switching to SQL)
8. **XSS Prevention**: Sanitize outputs

See [SECURITY.md](SECURITY.md) for complete security guidelines.

---

## Testing

### Using curl

```bash
# Get games
curl http://localhost:3000/api/games

# Register user
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test123"}'

# Login
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test123"}'

# Place bet (replace TOKEN)
curl -X POST http://localhost:3000/api/bets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"gameId":1,"amount":100}'
```

### Using Postman

1. Import collection from `/postman/GameBet-API.json` (if available)
2. Set environment variable `baseUrl` to `http://localhost:3000`
3. Set environment variable `token` after login
4. Test all endpoints

---

## Support

For API issues:
- Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- Open an issue on GitHub
- Review server logs for errors

---

*Last Updated: 2025-10-11*  
*Version: 1.0.0*
