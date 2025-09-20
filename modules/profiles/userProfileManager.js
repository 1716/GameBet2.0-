const { readDb, writeDb } = require('../../database');
const crypto = require('crypto');

class UserProfileManager {
    constructor() {
        this.initializeDatabase();
    }

    initializeDatabase() {
        const db = readDb();
        if (!db.userProfiles) {
            db.userProfiles = {};
            writeDb(db);
        }
    }

    // Create user profile
    async createProfile(userId, profileData) {
        const db = readDb();
        
        const profile = {
            userId,
            personalInfo: {
                firstName: profileData.firstName || '',
                lastName: profileData.lastName || '',
                email: profileData.email || '',
                phone: profileData.phone || '',
                dateOfBirth: profileData.dateOfBirth || '',
                address: profileData.address || {}
            },
            gameStats: {
                totalGamesPlayed: 0,
                totalWins: 0,
                totalLosses: 0,
                totalAmountWon: 0,
                totalAmountLost: 0,
                favoriteGames: [],
                winRate: 0,
                lastPlayedDate: null
            },
            paymentMethods: {
                paypal: null,
                cashapp: null,
                bankAccount: null,
                defaultMethod: null
            },
            preferences: {
                notifications: true,
                currency: 'USD',
                language: 'en',
                theme: 'light'
            },
            security: {
                twoFactorEnabled: false,
                lastPasswordChange: new Date(),
                loginHistory: []
            },
            createdAt: new Date(),
            updatedAt: new Date()
        };

        db.userProfiles[userId] = profile;
        writeDb(db);
        
        return profile;
    }

    // Read user profile
    async getProfile(userId) {
        const db = readDb();
        return db.userProfiles[userId] || null;
    }

    // Update user profile
    async updateProfile(userId, updateData) {
        const db = readDb();
        const profile = db.userProfiles[userId];
        
        if (!profile) {
            throw new Error('Profile not found');
        }

        // Deep merge update data
        if (updateData.personalInfo) {
            profile.personalInfo = { ...profile.personalInfo, ...updateData.personalInfo };
        }
        
        if (updateData.preferences) {
            profile.preferences = { ...profile.preferences, ...updateData.preferences };
        }

        profile.updatedAt = new Date();
        writeDb(db);
        
        return profile;
    }

    // Delete user profile
    async deleteProfile(userId) {
        const db = readDb();
        if (db.userProfiles[userId]) {
            delete db.userProfiles[userId];
            writeDb(db);
            return true;
        }
        return false;
    }

    // Payment method management
    async addPaymentMethod(userId, method, details) {
        const db = readDb();
        const profile = db.userProfiles[userId];
        
        if (!profile) {
            throw new Error('Profile not found');
        }

        // Simple encryption for demo (use proper encryption in production)
        const encryptedDetails = {
            encrypted: Buffer.from(JSON.stringify(details)).toString('base64'),
            addedAt: new Date(),
            verified: false
        };
        
        profile.paymentMethods[method] = encryptedDetails;

        if (!profile.paymentMethods.defaultMethod) {
            profile.paymentMethods.defaultMethod = method;
        }

        profile.updatedAt = new Date();
        writeDb(db);
        
        return profile.paymentMethods[method];
    }

    async removePaymentMethod(userId, method) {
        const db = readDb();
        const profile = db.userProfiles[userId];
        
        if (!profile) {
            throw new Error('Profile not found');
        }

        if (profile.paymentMethods[method]) {
            delete profile.paymentMethods[method];
            
            // If this was the default method, clear it
            if (profile.paymentMethods.defaultMethod === method) {
                profile.paymentMethods.defaultMethod = null;
            }
            
            profile.updatedAt = new Date();
            writeDb(db);
            return true;
        }
        
        return false;
    }

    // Game statistics updates
    async updateGameStats(userId, gameResult) {
        const db = readDb();
        const profile = db.userProfiles[userId];
        
        if (!profile) {
            throw new Error('Profile not found');
        }

        const stats = profile.gameStats;
        stats.totalGamesPlayed++;
        
        if (gameResult.won) {
            stats.totalWins++;
            stats.totalAmountWon += gameResult.amount || 0;
        } else {
            stats.totalLosses++;
            stats.totalAmountLost += gameResult.amount || 0;
        }

        stats.winRate = (stats.totalWins / stats.totalGamesPlayed) * 100;
        stats.lastPlayedDate = new Date();

        // Update favorite games
        if (gameResult.gameId) {
            const gameIndex = stats.favoriteGames.findIndex(g => g.id === gameResult.gameId);
            if (gameIndex >= 0) {
                stats.favoriteGames[gameIndex].playCount++;
            } else {
                stats.favoriteGames.push({
                    id: gameResult.gameId,
                    name: gameResult.gameName,
                    playCount: 1
                });
            }
        }

        profile.updatedAt = new Date();
        writeDb(db);
        
        return stats;
    }

    // Get all profiles (admin only)
    async getAllProfiles() {
        const db = readDb();
        return db.userProfiles || {};
    }

    // Search profiles
    async searchProfiles(query) {
        const db = readDb();
        const profiles = db.userProfiles || {};
        const results = [];

        Object.values(profiles).forEach(profile => {
            const searchText = `${profile.personalInfo.firstName} ${profile.personalInfo.lastName} ${profile.personalInfo.email}`.toLowerCase();
            if (searchText.includes(query.toLowerCase())) {
                // Return sanitized profile (no sensitive data)
                results.push({
                    userId: profile.userId,
                    name: `${profile.personalInfo.firstName} ${profile.personalInfo.lastName}`,
                    email: profile.personalInfo.email,
                    gameStats: profile.gameStats,
                    createdAt: profile.createdAt
                });
            }
        });

        return results;
    }
}

module.exports = new UserProfileManager();