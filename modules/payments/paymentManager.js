const paypal = require('paypal-rest-sdk');
const axios = require('axios');
const { readDb, writeDb } = require('../../database');

class PaymentManager {
    constructor() {
        this.initializePayPal();
        this.withdrawalLogs = [];
        this.loadWithdrawalLogs();
    }

    initializePayPal() {
        paypal.configure({
            mode: process.env.PAYPAL_MODE || 'sandbox',
            client_id: process.env.PAYPAL_CLIENT_ID || 'demo-client-id',
            client_secret: process.env.PAYPAL_CLIENT_SECRET || 'demo-client-secret'
        });
    }

    loadWithdrawalLogs() {
        const db = readDb();
        this.withdrawalLogs = db.withdrawalLogs || [];
    }

    saveWithdrawalLogs() {
        const db = readDb();
        db.withdrawalLogs = this.withdrawalLogs;
        writeDb(db);
    }

    // PayPal Integration
    async withdrawToPayPal(userId, amount, paypalEmail) {
        try {
            const withdrawalId = this.generateWithdrawalId();
            
            // Create PayPal payout
            const payoutData = {
                sender_batch_header: {
                    sender_batch_id: withdrawalId,
                    email_subject: 'GameBet2.0 Withdrawal',
                    email_message: 'You have received a payout from GameBet2.0!'
                },
                items: [{
                    recipient_type: 'EMAIL',
                    amount: {
                        value: amount.toString(),
                        currency: 'USD'
                    },
                    receiver: paypalEmail,
                    note: 'GameBet2.0 withdrawal',
                    sender_item_id: withdrawalId
                }]
            };

            return new Promise((resolve, reject) => {
                paypal.payout.create(payoutData, false, (error, payout) => {
                    if (error) {
                        this.logWithdrawal(userId, 'paypal', amount, 'failed', error.response);
                        reject(error);
                    } else {
                        this.logWithdrawal(userId, 'paypal', amount, 'success', {
                            payoutId: payout.batch_header.payout_batch_id,
                            status: payout.batch_header.batch_status
                        });
                        resolve({
                            success: true,
                            transactionId: payout.batch_header.payout_batch_id,
                            status: payout.batch_header.batch_status
                        });
                    }
                });
            });
        } catch (error) {
            this.logWithdrawal(userId, 'paypal', amount, 'error', error.message);
            throw error;
        }
    }

    // CashApp Integration (Mock implementation - no official API)
    async withdrawToCashApp(userId, amount, cashAppTag) {
        try {
            const withdrawalId = this.generateWithdrawalId();
            
            // Mock CashApp API call
            const mockResponse = await this.mockCashAppAPI(withdrawalId, amount, cashAppTag);
            
            if (mockResponse.success) {
                this.logWithdrawal(userId, 'cashapp', amount, 'success', mockResponse);
                return {
                    success: true,
                    transactionId: mockResponse.transactionId,
                    status: 'completed'
                };
            } else {
                this.logWithdrawal(userId, 'cashapp', amount, 'failed', mockResponse);
                throw new Error('CashApp withdrawal failed');
            }
        } catch (error) {
            this.logWithdrawal(userId, 'cashapp', amount, 'error', error.message);
            throw error;
        }
    }

    // Bank Account Integration (Mock implementation)
    async withdrawToBankAccount(userId, amount, bankDetails) {
        try {
            const withdrawalId = this.generateWithdrawalId();
            
            // Validate bank details
            if (!this.validateBankDetails(bankDetails)) {
                throw new Error('Invalid bank account details');
            }

            // Mock bank transfer API
            const mockResponse = await this.mockBankTransferAPI(withdrawalId, amount, bankDetails);
            
            if (mockResponse.success) {
                this.logWithdrawal(userId, 'bank', amount, 'success', mockResponse);
                return {
                    success: true,
                    transactionId: mockResponse.transactionId,
                    status: 'pending', // Bank transfers typically take time
                    estimatedCompletion: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days
                };
            } else {
                this.logWithdrawal(userId, 'bank', amount, 'failed', mockResponse);
                throw new Error('Bank withdrawal failed');
            }
        } catch (error) {
            this.logWithdrawal(userId, 'bank', amount, 'error', error.message);
            throw error;
        }
    }

    // Stripe Integration for card payments
    async withdrawToCard(userId, amount, cardToken) {
        try {
            // Note: Stripe doesn't support direct payouts to cards for most regions
            // This is a mock implementation
            const withdrawalId = this.generateWithdrawalId();
            
            const mockResponse = await this.mockStripeTransfer(withdrawalId, amount, cardToken);
            
            if (mockResponse.success) {
                this.logWithdrawal(userId, 'stripe', amount, 'success', mockResponse);
                return {
                    success: true,
                    transactionId: mockResponse.transactionId,
                    status: 'completed'
                };
            } else {
                this.logWithdrawal(userId, 'stripe', amount, 'failed', mockResponse);
                throw new Error('Card withdrawal failed');
            }
        } catch (error) {
            this.logWithdrawal(userId, 'stripe', amount, 'error', error.message);
            throw error;
        }
    }

    // Main withdrawal method
    async processWithdrawal(userId, amount, method, details) {
        // Validate user balance
        const db = readDb();
        if (amount > db.balance) {
            throw new Error('Insufficient balance');
        }

        // Minimum withdrawal validation
        if (amount < 10) {
            throw new Error('Minimum withdrawal amount is $10');
        }

        let result;
        
        switch (method) {
            case 'paypal':
                result = await this.withdrawToPayPal(userId, amount, details.email);
                break;
            case 'cashapp':
                result = await this.withdrawToCashApp(userId, amount, details.cashTag);
                break;
            case 'bank':
                result = await this.withdrawToBankAccount(userId, amount, details);
                break;
            case 'stripe':
                result = await this.withdrawToCard(userId, amount, details.token);
                break;
            default:
                throw new Error('Unsupported withdrawal method');
        }

        // Deduct from user balance if successful
        if (result.success) {
            db.balance -= amount;
            writeDb(db);
        }

        return result;
    }

    // Helper methods
    generateWithdrawalId() {
        return 'WD_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    logWithdrawal(userId, method, amount, status, details) {
        const log = {
            id: this.generateWithdrawalId(),
            userId,
            method,
            amount,
            status,
            details,
            timestamp: new Date(),
            processedAt: status === 'success' ? new Date() : null
        };

        this.withdrawalLogs.push(log);
        this.saveWithdrawalLogs();
        
        console.log(`Withdrawal logged: ${method} $${amount} for user ${userId} - ${status}`);
    }

    validateBankDetails(details) {
        return details.accountNumber && 
               details.routingNumber && 
               details.accountHolder &&
               details.bankName;
    }

    // Mock API implementations
    async mockCashAppAPI(withdrawalId, amount, cashTag) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock success (90% success rate)
        const success = Math.random() > 0.1;
        
        return {
            success,
            transactionId: success ? `CA_${withdrawalId}` : null,
            message: success ? 'Transfer completed' : 'CashApp transfer failed',
            fee: success ? amount * 0.01 : 0 // 1% fee
        };
    }

    async mockBankTransferAPI(withdrawalId, amount, bankDetails) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Mock success (95% success rate for valid details)
        const success = Math.random() > 0.05;
        
        return {
            success,
            transactionId: success ? `BNK_${withdrawalId}` : null,
            message: success ? 'Bank transfer initiated' : 'Bank transfer failed',
            fee: success ? 5 : 0, // $5 flat fee
            processingTime: '2-3 business days'
        };
    }

    async mockStripeTransfer(withdrawalId, amount, cardToken) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock success (85% success rate)
        const success = Math.random() > 0.15;
        
        return {
            success,
            transactionId: success ? `STR_${withdrawalId}` : null,
            message: success ? 'Card transfer completed' : 'Card transfer failed',
            fee: success ? amount * 0.029 + 0.30 : 0 // Stripe standard fee
        };
    }

    // Get withdrawal history
    getWithdrawalHistory(userId, limit = 50) {
        return this.withdrawalLogs
            .filter(log => log.userId === userId)
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, limit);
    }

    // Get all withdrawal logs (admin only)
    getAllWithdrawalLogs(limit = 100) {
        return this.withdrawalLogs
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, limit);
    }

    // Get withdrawal statistics
    getWithdrawalStats() {
        const total = this.withdrawalLogs.length;
        const successful = this.withdrawalLogs.filter(log => log.status === 'success').length;
        const totalAmount = this.withdrawalLogs
            .filter(log => log.status === 'success')
            .reduce((sum, log) => sum + log.amount, 0);

        const methodStats = {};
        this.withdrawalLogs.forEach(log => {
            if (!methodStats[log.method]) {
                methodStats[log.method] = { count: 0, amount: 0 };
            }
            methodStats[log.method].count++;
            if (log.status === 'success') {
                methodStats[log.method].amount += log.amount;
            }
        });

        return {
            total,
            successful,
            successRate: total > 0 ? (successful / total) * 100 : 0,
            totalAmount,
            methodStats
        };
    }

    // Verify payment method
    async verifyPaymentMethod(userId, method, details) {
        switch (method) {
            case 'paypal':
                return this.verifyPayPalAccount(details.email);
            case 'cashapp':
                return this.verifyCashAppTag(details.cashTag);
            case 'bank':
                return this.verifyBankAccount(details);
            default:
                return { verified: false, message: 'Unsupported method' };
        }
    }

    async verifyPayPalAccount(email) {
        // Mock verification
        await new Promise(resolve => setTimeout(resolve, 1000));
        return {
            verified: email.includes('@'),
            message: email.includes('@') ? 'PayPal email verified' : 'Invalid email format'
        };
    }

    async verifyCashAppTag(cashTag) {
        // Mock verification
        await new Promise(resolve => setTimeout(resolve, 500));
        return {
            verified: cashTag.startsWith('$'),
            message: cashTag.startsWith('$') ? 'CashApp tag verified' : 'Invalid CashApp tag format'
        };
    }

    async verifyBankAccount(details) {
        // Mock verification
        await new Promise(resolve => setTimeout(resolve, 1500));
        const isValid = this.validateBankDetails(details);
        return {
            verified: isValid,
            message: isValid ? 'Bank account verified' : 'Invalid bank account details'
        };
    }
}

module.exports = new PaymentManager();