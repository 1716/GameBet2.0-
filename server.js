
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { readDb, writeDb } = require('./database');

const app = express();
const port = 3000;
const JWT_SECRET = 'your_jwt_secret'; // In a real app, use a more secure secret from environment variables

app.use(cors());
app.use(express.json());
app.use(express.static('src'));

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

app.get('/api/balance', (req, res) => {
    const db = readDb();
    res.json({ balance: db.balance });
});

app.post('/api/withdraw', (req, res) => {
    const { amount, method } = req.body;
    const db = readDb();

    if (amount > db.balance) {
        return res.status(400).json({ message: 'Insufficient balance' });
    }

    db.balance -= amount;
    writeDb(db);

    // In a real application, you would integrate with a payment provider here.
    console.log(`Withdrawal of ${amount} to ${method} processed successfully.`);

    res.json({ message: 'Withdrawal successful!' });
});

app.get('/api/games', (req, res) => {
    res.json(games);
});

app.post('/api/register', (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);
    const db = readDb();
    if (!db.users) {
        db.users = [];
    }
    db.users.push({ id: Date.now(), username, password: hashedPassword });
    writeDb(db);

    res.status(201).json({ message: 'User registered successfully!' });
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

app.post('/api/bets', authenticateToken, (req, res) => {
    const { gameId, amount } = req.body;
    const db = readDb();
    if (!db.bets) {
        db.bets = [];
    }
    db.bets.push({ userId: req.user.id, gameId, amount, date: new Date() });
    writeDb(db);

    res.json({ message: 'Bet placed successfully!' });
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
