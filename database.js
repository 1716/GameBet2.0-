
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'db.json');

function readDb() {
    if (!fs.existsSync(dbPath)) {
        return { balance: 1000 }; // Default balance
    }
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
}

function writeDb(data) {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

module.exports = { readDb, writeDb };
