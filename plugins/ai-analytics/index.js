class AiAnalyticsPlugin {
    constructor() {
        this.name = 'ai-analytics';
        this.gameAI = null;
    }

    async install() {
        console.log(`Installing ${this.name} plugin...`);
        
        try {
            // Load the AI module
            const GameAI = require('../../modules/ai/gameAI');
            this.gameAI = GameAI;
            
            console.log('✅ AI analytics plugin installed successfully');
            console.log('🤖 AI features: Game analytics, Fraud detection, Dynamic difficulty');
            
            return true;
        } catch (error) {
            console.error('❌ Failed to install AI analytics plugin:', error.message);
            throw error;
        }
    }

    async uninstall() {
        console.log(`Uninstalling ${this.name} plugin...`);
        this.gameAI = null;
        console.log('✅ AI analytics plugin uninstalled');
    }

    // Plugin API methods
    analyzePlayerBehavior(userId, betData) {
        if (!this.gameAI) {
            throw new Error('AI analytics plugin not installed');
        }
        
        return this.gameAI.analyzePlayerBehavior(userId, betData);
    }

    generateGameOutcome(gameId, playerBet, playerHistory) {
        if (!this.gameAI) {
            throw new Error('AI analytics plugin not installed');
        }
        
        return this.gameAI.generateGameOutcome(gameId, playerBet, playerHistory);
    }

    calculateOptimalOdds(gameId, marketConditions) {
        if (!this.gameAI) {
            throw new Error('AI analytics plugin not installed');
        }
        
        return this.gameAI.calculateOptimalOdds(gameId, marketConditions);
    }

    detectSuspiciousActivity(userId, betData, userProfile) {
        if (!this.gameAI) {
            throw new Error('AI analytics plugin not installed');
        }
        
        return this.gameAI.detectSuspiciousActivity(userId, betData, userProfile);
    }

    adjustGameDifficulty(gameId, playerSkillLevel, recentPerformance) {
        if (!this.gameAI) {
            throw new Error('AI analytics plugin not installed');
        }
        
        return this.gameAI.adjustGameDifficulty(gameId, playerSkillLevel, recentPerformance);
    }

    getGameAnalytics(gameId) {
        if (!this.gameAI) {
            throw new Error('AI analytics plugin not installed');
        }
        
        return this.gameAI.getGameAnalytics(gameId);
    }
}

module.exports = AiAnalyticsPlugin;