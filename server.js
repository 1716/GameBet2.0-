
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { readDb, writeDb } = require('./database');

// Import new modules
const licenseManager = require('./modules/api/licenseManager');
const connectionManager = require('./modules/api/connectionManager');
const pluginManager = require('./modules/plugins/pluginManager');
const userProfileManager = require('./modules/profiles/userProfileManager');
const gameAI = require('./modules/ai/gameAI');
const paymentManager = require('./modules/payments/paymentManager');

const app = express();
const port = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // In a real app, use a more secure secret from environment variables

app.use(cors());
app.use(express.json());
app.use(express.static('src'));

// Initialize system on startup
async function initializeSystem() {
    console.log('🚀 Initializing GameBet 2.0 Enhanced System...');
    
    try {
        // Auto-install required plugins
        await pluginManager.autoInstallPlugins();
        
        // Setup connections to external services
        await setupConnections();
        
        console.log('✅ System initialized successfully');
    } catch (error) {
        console.error('❌ System initialization failed:', error.message);
    }
}

async function setupConnections() {
    // Setup PayPal connection
    await connectionManager.createConnection('paypal', {
        baseURL: 'https://api.sandbox.paypal.com',
        auth: { token: process.env.PAYPAL_ACCESS_TOKEN }
    });
    
    // Setup Stripe connection
    await connectionManager.createConnection('stripe', {
        baseURL: 'https://api.stripe.com',
        headers: { 'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}` }
    });
}

const games = [
    {
        id: 1,
        title: 'Space Adventure',
        description: 'Embark on an epic journey through the cosmos.',
        image: 'https://via.placeholder.com/250x150.png?text=Space+Adventure',
        odds: 1.5
    },
    {
        id: 2,
        title: 'Ocean Quest',
        description: 'Explore the depths of the ocean and uncover ancient secrets.',
        image: 'https://via.placeholder.com/250x150.png?text=Ocean+Quest',
        odds: 2.0
    },
    {
        id: 3,
        title: 'Jungle Run',
        description: 'Navigate a treacherous jungle and outsmart your opponents.',
        image: 'https://via.placeholder.com/250x150.png?text=Jungle+Run',
        odds: 1.8
    }
];

// Middleware to protect routes
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401); // if there isn't any token

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Middleware to validate API licenses
const validateLicense = (service) => {
    return (req, res, next) => {
        const apiKey = req.headers['x-api-key'];
        
        if (!apiKey) {
            return res.status(401).json({ error: 'API key required' });
        }
        
        const validation = licenseManager.validateLicense(apiKey, service);
        
        if (!validation.valid) {
            return res.status(403).json({ error: validation.reason });
        }
        
        licenseManager.incrementUsage(apiKey);
        req.license = validation.license;
        next();
    };
};

app.get('/api/balance', (req, res) => {
    const db = readDb();
    res.json({ balance: db.balance });
});

// Enhanced withdrawal endpoint with real payment integration
app.post('/api/withdraw', authenticateToken, async (req, res) => {
    try {
        const { amount, method, details } = req.body;
        const userId = req.user.id;
        
        // Process withdrawal through payment manager
        const result = await paymentManager.processWithdrawal(userId, amount, method, details);
        
        if (result.success) {
            res.json({
                message: 'Withdrawal processed successfully!',
                transactionId: result.transactionId,
                status: result.status,
                estimatedCompletion: result.estimatedCompletion || null
            });
        } else {
            res.status(400).json({ message: 'Withdrawal failed', error: result.error });
        }
    } catch (error) {
        console.error('Withdrawal error:', error);
        res.status(500).json({ message: 'Withdrawal processing failed', error: error.message });
    }
});

app.get('/api/games', (req, res) => {
    res.json(games);
});

app.post('/api/register', async (req, res) => {
    try {
        const { username, password, profileData } = req.body;
        const hashedPassword = bcrypt.hashSync(password, 8);
        const db = readDb();
        
        if (!db.users) {
            db.users = [];
        }
        
        // Check if user exists
        const existingUser = db.users.find(u => u.username === username);
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }
        
        const userId = Date.now();
        db.users.push({ id: userId, username, password: hashedPassword });
        writeDb(db);
        
        // Create user profile
        await userProfileManager.createProfile(userId, profileData || {});
        
        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Registration failed', error: error.message });
    }
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const db = readDb();
    const user = db.users && db.users.find(u => u.username === username);

    if (!user) {
        return res.status(404).json({ message: 'User not found!' });
    }

    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) {
        return res.status(401).json({ auth: false, token: null, message: 'Invalid password!' });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, {
        expiresIn: 86400 // 24 hours
    });

    res.status(200).json({ auth: true, token });
});

// Enhanced betting endpoint with AI-powered game logic
app.post('/api/bets', authenticateToken, async (req, res) => {
    try {
        const { gameId, amount } = req.body;
        const userId = req.user.id;
        const db = readDb();
        
        // Check balance
        if (amount > db.balance) {
            return res.status(400).json({ message: 'Insufficient balance' });
        }
        
        // Get user profile for AI analysis
        const userProfile = await userProfileManager.getProfile(userId);
        
        // AI-powered fraud detection
        const fraudCheck = gameAI.detectSuspiciousActivity(userId, { amount, gameId }, userProfile);
        if (fraudCheck.isSuspicious) {
            return res.status(403).json({ 
                message: 'Bet flagged for review', 
                riskScore: fraudCheck.riskScore,
                action: fraudCheck.recommendedAction
            });
        }
        
        // AI behavior analysis
        const behaviorAnalysis = gameAI.analyzePlayerBehavior(userId, { amount, gameId, won: false });
        
        // Generate AI-powered game outcome
        const playerHistory = {
            recentLossStreak: userProfile?.gameStats?.totalLosses || 0,
            recentWinStreak: userProfile?.gameStats?.totalWins || 0
        };
        
        const outcome = gameAI.generateGameOutcome(gameId, amount, playerHistory);
        
        // Process the bet
        if (!db.bets) {
            db.bets = [];
        }
        
        const bet = {
            id: Date.now(),
            userId,
            gameId,
            amount,
            outcome: outcome.playerWins,
            payout: outcome.payout,
            timestamp: new Date(),
            aiData: {
                adjustedProbability: outcome.probability,
                fairnessData: outcome.fairnessData
            }
        };
        
        db.bets.push(bet);
        
        // Update user balance
        if (outcome.playerWins) {
            db.balance += outcome.payout - amount; // Net win
        } else {
            db.balance -= amount;
        }
        
        writeDb(db);
        
        // Update user profile game stats
        if (userProfile) {
            await userProfileManager.updateGameStats(userId, {
                gameId,
                gameName: games.find(g => g.id == gameId)?.title,
                won: outcome.playerWins,
                amount: outcome.playerWins ? outcome.payout : amount
            });
        }
        
        res.json({
            message: 'Bet processed successfully!',
            outcome: outcome.playerWins ? 'win' : 'lose',
            payout: outcome.payout,
            balance: db.balance,
            aiRecommendations: behaviorAnalysis.recommendations
        });
        
    } catch (error) {
        console.error('Betting error:', error);
        res.status(500).json({ message: 'Bet processing failed', error: error.message });
    }
});

app.listen(port, async () => {
    console.log(`Server listening at http://localhost:${port}`);
    await initializeSystem();
});

// === NEW API ENDPOINTS ===

// User Profile Management API
app.get('/api/profile', authenticateToken, async (req, res) => {
    try {
        const profile = await userProfileManager.getProfile(req.user.id);
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        res.json(profile);
    } catch (error) {
        res.status(500).json({ message: 'Failed to get profile', error: error.message });
    }
});

app.put('/api/profile', authenticateToken, async (req, res) => {
    try {
        const updatedProfile = await userProfileManager.updateProfile(req.user.id, req.body);
        res.json(updatedProfile);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update profile', error: error.message });
    }
});

app.delete('/api/profile', authenticateToken, async (req, res) => {
    try {
        await userProfileManager.deleteProfile(req.user.id);
        res.json({ message: 'Profile deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete profile', error: error.message });
    }
});

// Payment Method Management
app.post('/api/profile/payment-methods', authenticateToken, async (req, res) => {
    try {
        const { method, details } = req.body;
        const result = await userProfileManager.addPaymentMethod(req.user.id, method, details);
        res.json({ message: 'Payment method added successfully', method: result });
    } catch (error) {
        res.status(500).json({ message: 'Failed to add payment method', error: error.message });
    }
});

app.delete('/api/profile/payment-methods/:method', authenticateToken, async (req, res) => {
    try {
        const { method } = req.params;
        await userProfileManager.removePaymentMethod(req.user.id, method);
        res.json({ message: 'Payment method removed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to remove payment method', error: error.message });
    }
});

app.post('/api/verify-payment-method', authenticateToken, async (req, res) => {
    try {
        const { method, details } = req.body;
        const result = await paymentManager.verifyPaymentMethod(req.user.id, method, details);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Verification failed', error: error.message });
    }
});

// Enhanced Games API with AI-powered odds
app.get('/api/games', (req, res) => {
    try {
        const enhancedGames = games.map(game => {
            const analytics = gameAI.getGameAnalytics(game.id);
            const optimalOdds = gameAI.calculateOptimalOdds(game.id);
            
            return {
                ...game,
                odds: optimalOdds,
                analytics: {
                    totalGames: analytics.totalGames,
                    playerWinRate: analytics.playerWinRate,
                    averageBet: analytics.averageBet
                }
            };
        });
        
        res.json(enhancedGames);
    } catch (error) {
        res.status(500).json({ message: 'Failed to get games', error: error.message });
    }
});

// Withdrawal History
app.get('/api/withdrawals', authenticateToken, async (req, res) => {
    try {
        const history = paymentManager.getWithdrawalHistory(req.user.id);
        res.json(history);
    } catch (error) {
        res.status(500).json({ message: 'Failed to get withdrawal history', error: error.message });
    }
});

// Plugin Management API
app.get('/api/plugins', validateLicense('api'), async (req, res) => {
    try {
        const plugins = pluginManager.listPlugins();
        res.json(plugins);
    } catch (error) {
        res.status(500).json({ message: 'Failed to list plugins', error: error.message });
    }
});

app.post('/api/plugins/:name/install', validateLicense('api'), async (req, res) => {
    try {
        const { name } = req.params;
        await pluginManager.installPlugin(name);
        res.json({ message: `Plugin ${name} installed successfully` });
    } catch (error) {
        res.status(500).json({ message: 'Plugin installation failed', error: error.message });
    }
});

app.post('/api/plugins/:name/uninstall', validateLicense('api'), async (req, res) => {
    try {
        const { name } = req.params;
        await pluginManager.uninstallPlugin(name);
        res.json({ message: `Plugin ${name} uninstalled successfully` });
    } catch (error) {
        res.status(500).json({ message: 'Plugin uninstallation failed', error: error.message });
    }
});

// License Management API
app.post('/api/licenses/generate', validateLicense('admin'), (req, res) => {
    try {
        const { service, maxUsage, expiresIn } = req.body;
        const license = licenseManager.generateApiKey(service, maxUsage, expiresIn);
        res.json(license);
    } catch (error) {
        res.status(500).json({ message: 'License generation failed', error: error.message });
    }
});

// Connection Status API
app.get('/api/connections/status', validateLicense('api'), (req, res) => {
    try {
        const status = connectionManager.getConnectionStatus();
        res.json(status);
    } catch (error) {
        res.status(500).json({ message: 'Failed to get connection status', error: error.message });
    }
});

// AI Analytics API
app.get('/api/analytics/game/:gameId', validateLicense('ai'), (req, res) => {
    try {
        const { gameId } = req.params;
        const analytics = gameAI.getGameAnalytics(parseInt(gameId));
        res.json(analytics);
    } catch (error) {
        res.status(500).json({ message: 'Failed to get game analytics', error: error.message });
    }
});

// Admin APIs
app.get('/api/admin/withdrawal-stats', validateLicense('admin'), (req, res) => {
    try {
        const stats = paymentManager.getWithdrawalStats();
        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: 'Failed to get withdrawal stats', error: error.message });
    }
});

app.get('/api/admin/profiles', validateLicense('admin'), async (req, res) => {
    try {
        const profiles = await userProfileManager.getAllProfiles();
        res.json(profiles);
    } catch (error) {
        res.status(500).json({ message: 'Failed to get profiles', error: error.message });
    }
});

app.get('/api/admin/search-profiles', validateLicense('admin'), async (req, res) => {
    try {
        const { q } = req.query;
        const results = await userProfileManager.searchProfiles(q);
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: 'Profile search failed', error: error.message });
    }
});
