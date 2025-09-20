const fs = require('fs');
const path = require('path');
const EventEmitter = require('events');

class PluginManager extends EventEmitter {
    constructor() {
        super();
        this.plugins = new Map();
        this.pluginPath = path.join(__dirname, '../../plugins');
        this.ensurePluginDirectory();
    }

    ensurePluginDirectory() {
        if (!fs.existsSync(this.pluginPath)) {
            fs.mkdirSync(this.pluginPath, { recursive: true });
        }
    }

    async loadPlugin(pluginName) {
        try {
            const pluginDir = path.join(this.pluginPath, pluginName);
            const manifestPath = path.join(pluginDir, 'manifest.json');
            
            if (!fs.existsSync(manifestPath)) {
                throw new Error(`Plugin manifest not found: ${manifestPath}`);
            }

            const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
            const mainFile = path.join(pluginDir, manifest.main || 'index.js');
            
            if (!fs.existsSync(mainFile)) {
                throw new Error(`Plugin main file not found: ${mainFile}`);
            }

            // Load the plugin module
            const PluginClass = require(mainFile);
            const pluginInstance = new PluginClass();

            // Validate plugin interface
            if (!pluginInstance.install || !pluginInstance.uninstall) {
                throw new Error(`Plugin ${pluginName} must implement install and uninstall methods`);
            }

            const plugin = {
                name: pluginName,
                manifest,
                instance: pluginInstance,
                status: 'loaded',
                loadedAt: new Date()
            };

            this.plugins.set(pluginName, plugin);
            this.emit('loaded', pluginName);
            
            return plugin;
        } catch (error) {
            this.emit('error', pluginName, error);
            throw error;
        }
    }

    async installPlugin(pluginName) {
        const plugin = this.plugins.get(pluginName);
        if (!plugin) {
            await this.loadPlugin(pluginName);
            return this.installPlugin(pluginName);
        }

        try {
            await plugin.instance.install();
            plugin.status = 'installed';
            plugin.installedAt = new Date();
            this.emit('installed', pluginName);
            return true;
        } catch (error) {
            plugin.status = 'error';
            this.emit('error', pluginName, error);
            throw error;
        }
    }

    async uninstallPlugin(pluginName) {
        const plugin = this.plugins.get(pluginName);
        if (!plugin) {
            throw new Error(`Plugin ${pluginName} not found`);
        }

        try {
            await plugin.instance.uninstall();
            plugin.status = 'uninstalled';
            this.emit('uninstalled', pluginName);
            return true;
        } catch (error) {
            this.emit('error', pluginName, error);
            throw error;
        }
    }

    getPlugin(pluginName) {
        return this.plugins.get(pluginName);
    }

    listPlugins() {
        return Array.from(this.plugins.entries()).map(([name, plugin]) => ({
            name,
            version: plugin.manifest.version,
            status: plugin.status,
            description: plugin.manifest.description
        }));
    }

    async autoInstallPlugins() {
        const configPath = path.join(__dirname, '../../config/auto-install.json');
        if (!fs.existsSync(configPath)) {
            return;
        }

        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        const requiredPlugins = config.plugins || [];

        for (const pluginName of requiredPlugins) {
            try {
                await this.installPlugin(pluginName);
                console.log(`✅ Auto-installed plugin: ${pluginName}`);
            } catch (error) {
                console.error(`❌ Failed to auto-install plugin ${pluginName}:`, error.message);
            }
        }
    }

    createPluginTemplate(pluginName) {
        const pluginDir = path.join(this.pluginPath, pluginName);
        fs.mkdirSync(pluginDir, { recursive: true });

        const manifest = {
            name: pluginName,
            version: "1.0.0",
            description: `Plugin: ${pluginName}`,
            main: "index.js",
            author: "GameBet2.0",
            dependencies: {}
        };

        const template = `
class ${pluginName.charAt(0).toUpperCase() + pluginName.slice(1)}Plugin {
    constructor() {
        this.name = '${pluginName}';
    }

    async install() {
        console.log(\`Installing \${this.name} plugin...\`);
        // Add installation logic here
    }

    async uninstall() {
        console.log(\`Uninstalling \${this.name} plugin...\`);
        // Add uninstallation logic here
    }

    // Add your plugin methods here
}

module.exports = ${pluginName.charAt(0).toUpperCase() + pluginName.slice(1)}Plugin;
`;

        fs.writeFileSync(path.join(pluginDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
        fs.writeFileSync(path.join(pluginDir, 'index.js'), template.trim());

        return pluginDir;
    }
}

module.exports = new PluginManager();