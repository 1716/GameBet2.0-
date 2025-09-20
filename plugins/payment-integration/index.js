class PaymentIntegrationPlugin {
    constructor() {
        this.name = 'payment-integration';
        this.paymentManager = null;
    }

    async install() {
        console.log(`Installing ${this.name} plugin...`);
        
        try {
            // Load the payment manager
            const PaymentManager = require('../../modules/payments/paymentManager');
            this.paymentManager = PaymentManager;
            
            console.log('✅ Payment integration plugin installed successfully');
            console.log('📋 Supported payment methods: PayPal, CashApp, Bank Transfer, Stripe');
            
            return true;
        } catch (error) {
            console.error('❌ Failed to install payment integration plugin:', error.message);
            throw error;
        }
    }

    async uninstall() {
        console.log(`Uninstalling ${this.name} plugin...`);
        this.paymentManager = null;
        console.log('✅ Payment integration plugin uninstalled');
    }

    // Plugin API methods
    async processPayment(userId, amount, method, details) {
        if (!this.paymentManager) {
            throw new Error('Payment integration plugin not installed');
        }
        
        return await this.paymentManager.processWithdrawal(userId, amount, method, details);
    }

    async getPaymentHistory(userId) {
        if (!this.paymentManager) {
            throw new Error('Payment integration plugin not installed');
        }
        
        return this.paymentManager.getWithdrawalHistory(userId);
    }

    async verifyPaymentMethod(userId, method, details) {
        if (!this.paymentManager) {
            throw new Error('Payment integration plugin not installed');
        }
        
        return await this.paymentManager.verifyPaymentMethod(userId, method, details);
    }

    getPaymentStats() {
        if (!this.paymentManager) {
            throw new Error('Payment integration plugin not installed');
        }
        
        return this.paymentManager.getWithdrawalStats();
    }
}

module.exports = PaymentIntegrationPlugin;