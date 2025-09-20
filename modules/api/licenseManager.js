const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

class LicenseManager {
    constructor() {
        this.licenses = new Map();
        this.loadLicenses();
    }

    loadLicenses() {
        const licensePath = path.join(__dirname, '../../config/licenses.json');
        if (fs.existsSync(licensePath)) {
            const data = JSON.parse(fs.readFileSync(licensePath, 'utf8'));
            this.licenses.clear(); // Clear existing licenses first
            data.forEach(license => {
                this.licenses.set(license.apiKey, license);
            });
        }
    }

    validateLicense(apiKey, service) {
        const license = this.licenses.get(apiKey);
        
        if (!license) {
            return { valid: false, reason: 'Invalid API key' };
        }

        if (license.service !== service) {
            return { valid: false, reason: 'Service mismatch' };
        }

        if (license.expiresAt && new Date(license.expiresAt) < new Date()) {
            return { valid: false, reason: 'License expired' };
        }

        if (license.usageCount >= license.maxUsage) {
            return { valid: false, reason: 'Usage limit exceeded' };
        }

        return { valid: true, license };
    }

    incrementUsage(apiKey) {
        const license = this.licenses.get(apiKey);
        if (license) {
            license.usageCount = (license.usageCount || 0) + 1;
            this.saveLicenses();
        }
    }

    saveLicenses() {
        const licensePath = path.join(__dirname, '../../config/licenses.json');
        const data = Array.from(this.licenses.values());
        fs.writeFileSync(licensePath, JSON.stringify(data, null, 2));
    }

    generateApiKey(service, maxUsage = 1000, expiresIn = '1y') {
        const apiKey = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date();
        if (expiresIn === '1y') {
            expiresAt.setFullYear(expiresAt.getFullYear() + 1);
        }

        const license = {
            apiKey,
            service,
            maxUsage,
            usageCount: 0,
            expiresAt: expiresAt.toISOString(),
            createdAt: new Date().toISOString()
        };

        this.licenses.set(apiKey, license);
        this.saveLicenses();
        return license;
    }
}

module.exports = new LicenseManager();