// AI-powered game logic and decision making
class GameAI {
    constructor() {
        this.gamePatterns = new Map();
        this.userBehavior = new Map();
        this.fairnessMetrics = {
            totalGames: 0,
            playerWins: 0,
            houseEdge: 0.05 // 5% house edge
        };
    }

    // Analyze player betting patterns for responsible gaming
    analyzePlayerBehavior(userId, betData) {
        if (!this.userBehavior.has(userId)) {
            this.userBehavior.set(userId, {
                totalBets: 0,
                totalAmount: 0,
                averageBetSize: 0,
                biggestLoss: 0,
                biggestWin: 0,
                sessionData: [],
                riskLevel: 'low'
            });
        }

        const behavior = this.userBehavior.get(userId);
        behavior.totalBets++;
        behavior.totalAmount += betData.amount;
        behavior.averageBetSize = behavior.totalAmount / behavior.totalBets;

        // Track session data
        const currentSession = behavior.sessionData[behavior.sessionData.length - 1];
        if (!currentSession || this.isNewSession(currentSession.timestamp)) {
            behavior.sessionData.push({
                timestamp: new Date(),
                bets: [],
                profit: 0
            });
        }

        const session = behavior.sessionData[behavior.sessionData.length - 1];
        session.bets.push(betData);

        // Calculate risk level
        this.updateRiskLevel(userId, behavior);

        return {
            riskLevel: behavior.riskLevel,
            recommendations: this.getRecommendations(behavior),
            shouldAlert: behavior.riskLevel === 'high'
        };
    }

    // AI-powered game outcome generation with fairness controls
    generateGameOutcome(gameId, playerBet, playerHistory = {}) {
        const game = this.getGameConfig(gameId);
        if (!game) {
            throw new Error(`Game ${gameId} not found`);
        }

        // Apply house edge and fairness algorithms
        const baseWinProbability = this.calculateBaseWinProbability(game);
        const adjustedProbability = this.adjustForFairness(baseWinProbability, playerHistory);
        
        const random = Math.random();
        const playerWins = random < adjustedProbability;

        // Update fairness metrics
        this.updateFairnessMetrics(playerWins);

        const outcome = {
            gameId,
            playerWins,
            playerBet,
            payout: playerWins ? playerBet * game.multiplier : 0,
            probability: adjustedProbability,
            timestamp: new Date(),
            fairnessData: {
                randomValue: random,
                adjustedProbability,
                houseEdge: this.fairnessMetrics.houseEdge
            }
        };

        // Store pattern for future analysis
        this.storeGamePattern(gameId, outcome);

        return outcome;
    }

    // Calculate optimal odds based on AI analysis
    calculateOptimalOdds(gameId, marketConditions = {}) {
        const patterns = this.gamePatterns.get(gameId) || [];
        const recentOutcomes = patterns.slice(-100); // Last 100 games
        
        if (recentOutcomes.length === 0) {
            return this.getDefaultOdds(gameId);
        }

        const winRate = recentOutcomes.filter(p => p.playerWins).length / recentOutcomes.length;
        const averageBet = recentOutcomes.reduce((sum, p) => sum + p.playerBet, 0) / recentOutcomes.length;
        
        // AI adjustment factors
        const volumeAdjustment = this.calculateVolumeAdjustment(averageBet, marketConditions.volume);
        const trendAdjustment = this.calculateTrendAdjustment(recentOutcomes);
        
        let baseOdds = 1 / (winRate + this.fairnessMetrics.houseEdge);
        baseOdds *= (1 + volumeAdjustment + trendAdjustment);
        
        return Math.max(1.1, Math.min(10.0, baseOdds)); // Clamp between 1.1 and 10.0
    }

    // AI-powered fraud detection
    detectSuspiciousActivity(userId, betData, userProfile) {
        const suspiciousIndicators = [];
        
        // Rapid betting pattern
        if (this.isRapidBetting(userId, betData)) {
            suspiciousIndicators.push('rapid_betting');
        }

        // Unusual bet size
        if (this.isUnusualBetSize(userId, betData, userProfile)) {
            suspiciousIndicators.push('unusual_bet_size');
        }

        // Pattern matching against known fraud patterns
        if (this.matchesFraudPattern(userId, betData)) {
            suspiciousIndicators.push('fraud_pattern_match');
        }

        // Device/IP analysis
        if (this.isSuspiciousDevice(betData.metadata)) {
            suspiciousIndicators.push('suspicious_device');
        }

        const riskScore = this.calculateRiskScore(suspiciousIndicators);
        
        return {
            isSuspicious: riskScore > 0.7,
            riskScore,
            indicators: suspiciousIndicators,
            recommendedAction: this.getRecommendedAction(riskScore)
        };
    }

    // Dynamic game difficulty adjustment
    adjustGameDifficulty(gameId, playerSkillLevel, recentPerformance) {
        const baseConfig = this.getGameConfig(gameId);
        const adjustmentFactor = this.calculateDifficultyAdjustment(playerSkillLevel, recentPerformance);
        
        return {
            ...baseConfig,
            difficulty: Math.max(0.1, Math.min(1.0, baseConfig.difficulty * adjustmentFactor)),
            multiplier: baseConfig.multiplier * (1 + (adjustmentFactor - 1) * 0.1) // Slight multiplier adjustment
        };
    }

    // Helper methods
    isNewSession(lastTimestamp) {
        const timeDiff = new Date() - new Date(lastTimestamp);
        return timeDiff > 30 * 60 * 1000; // 30 minutes
    }

    updateRiskLevel(userId, behavior) {
        const avgBet = behavior.averageBetSize;
        const recentSession = behavior.sessionData[behavior.sessionData.length - 1];
        const sessionLoss = recentSession ? recentSession.bets.reduce((sum, bet) => sum + (bet.won ? 0 : bet.amount), 0) : 0;
        
        if (avgBet > 1000 || sessionLoss > 5000) {
            behavior.riskLevel = 'high';
        } else if (avgBet > 500 || sessionLoss > 2000) {
            behavior.riskLevel = 'medium';
        } else {
            behavior.riskLevel = 'low';
        }
    }

    getRecommendations(behavior) {
        const recommendations = [];
        
        if (behavior.riskLevel === 'high') {
            recommendations.push('Consider taking a break');
            recommendations.push('Set daily betting limits');
            recommendations.push('Review your betting strategy');
        } else if (behavior.riskLevel === 'medium') {
            recommendations.push('Monitor your spending');
            recommendations.push('Consider smaller bet sizes');
        }
        
        return recommendations;
    }

    calculateBaseWinProbability(game) {
        // Default probability based on game type
        const probabilities = {
            1: 0.45, // Space Adventure
            2: 0.40, // Ocean Quest  
            3: 0.50  // Jungle Run
        };
        
        return probabilities[game.id] || 0.45;
    }

    adjustForFairness(baseProbability, playerHistory) {
        // Implement rubber band AI - adjust slightly based on recent losses
        if (playerHistory.recentLossStreak > 5) {
            return Math.min(0.55, baseProbability + 0.05);
        } else if (playerHistory.recentWinStreak > 3) {
            return Math.max(0.35, baseProbability - 0.03);
        }
        
        return baseProbability;
    }

    updateFairnessMetrics(playerWins) {
        this.fairnessMetrics.totalGames++;
        if (playerWins) {
            this.fairnessMetrics.playerWins++;
        }
        
        // Maintain house edge around target
        const currentPlayerWinRate = this.fairnessMetrics.playerWins / this.fairnessMetrics.totalGames;
        const targetWinRate = 1 - this.fairnessMetrics.houseEdge;
        
        if (Math.abs(currentPlayerWinRate - targetWinRate) > 0.02) {
            // Slight adjustment to maintain fairness
            console.log(`Adjusting fairness: current win rate ${currentPlayerWinRate.toFixed(3)}, target ${targetWinRate.toFixed(3)}`);
        }
    }

    storeGamePattern(gameId, outcome) {
        if (!this.gamePatterns.has(gameId)) {
            this.gamePatterns.set(gameId, []);
        }
        
        const patterns = this.gamePatterns.get(gameId);
        patterns.push(outcome);
        
        // Keep only last 1000 outcomes per game
        if (patterns.length > 1000) {
            patterns.shift();
        }
    }

    getGameConfig(gameId) {
        const configs = {
            1: { id: 1, difficulty: 0.6, multiplier: 1.5, type: 'adventure' },
            2: { id: 2, difficulty: 0.7, multiplier: 2.0, type: 'exploration' },
            3: { id: 3, difficulty: 0.5, multiplier: 1.8, type: 'action' }
        };
        
        return configs[gameId];
    }

    getDefaultOdds(gameId) {
        const defaults = { 1: 1.5, 2: 2.0, 3: 1.8 };
        return defaults[gameId] || 1.5;
    }

    calculateVolumeAdjustment(averageBet, volume) {
        // Adjust odds based on betting volume
        if (volume > 10000) return -0.05; // Lower odds for high volume
        if (volume < 1000) return 0.03;   // Higher odds for low volume
        return 0;
    }

    calculateTrendAdjustment(recentOutcomes) {
        const recentWins = recentOutcomes.slice(-10).filter(o => o.playerWins).length;
        if (recentWins > 7) return -0.02; // Slight decrease if players winning too much
        if (recentWins < 3) return 0.02;  // Slight increase if players losing too much
        return 0;
    }

    isRapidBetting(userId, betData) {
        // Implementation for rapid betting detection
        return false; // Placeholder
    }

    isUnusualBetSize(userId, betData, userProfile) {
        // Implementation for unusual bet size detection
        return betData.amount > userProfile.averageBetSize * 10;
    }

    matchesFraudPattern(userId, betData) {
        // Implementation for fraud pattern matching
        return false; // Placeholder
    }

    isSuspiciousDevice(metadata) {
        // Implementation for device analysis
        return false; // Placeholder
    }

    calculateRiskScore(indicators) {
        return indicators.length * 0.2; // Simple scoring
    }

    getRecommendedAction(riskScore) {
        if (riskScore > 0.8) return 'suspend';
        if (riskScore > 0.6) return 'monitor';
        return 'allow';
    }

    calculateDifficultyAdjustment(skillLevel, performance) {
        // Adjust difficulty based on player skill and recent performance
        return 1.0 + (skillLevel - 0.5) * 0.2;
    }

    // Public API methods
    getGameAnalytics(gameId) {
        const patterns = this.gamePatterns.get(gameId) || [];
        const totalGames = patterns.length;
        const playerWins = patterns.filter(p => p.playerWins).length;
        
        return {
            gameId,
            totalGames,
            playerWinRate: totalGames > 0 ? playerWins / totalGames : 0,
            averageBet: totalGames > 0 ? patterns.reduce((sum, p) => sum + p.playerBet, 0) / totalGames : 0,
            totalPayout: patterns.reduce((sum, p) => sum + p.payout, 0),
            fairnessMetrics: this.fairnessMetrics
        };
    }
}

module.exports = new GameAI();