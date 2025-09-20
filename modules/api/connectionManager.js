const axios = require('axios');
const EventEmitter = require('events');

class ConnectionManager extends EventEmitter {
    constructor() {
        super();
        this.connections = new Map();
        this.retryAttempts = 3;
        this.timeout = 10000; // 10 seconds
    }

    async createConnection(name, config) {
        try {
            const connection = {
                name,
                config,
                status: 'connecting',
                lastConnected: null,
                retries: 0,
                client: null
            };

            this.connections.set(name, connection);

            // Create axios instance with timeout and retry logic
            const client = axios.create({
                baseURL: config.baseURL,
                timeout: this.timeout,
                headers: {
                    'Content-Type': 'application/json',
                    ...config.headers
                }
            });

            // Add request interceptor for authentication
            client.interceptors.request.use(
                (config) => {
                    if (connection.config.auth) {
                        config.headers.Authorization = `Bearer ${connection.config.auth.token}`;
                    }
                    return config;
                },
                (error) => Promise.reject(error)
            );

            // Add response interceptor for error handling
            client.interceptors.response.use(
                (response) => {
                    connection.status = 'connected';
                    connection.lastConnected = new Date();
                    connection.retries = 0;
                    this.emit('connected', name);
                    return response;
                },
                async (error) => {
                    connection.status = 'error';
                    this.emit('error', name, error);
                    
                    if (connection.retries < this.retryAttempts) {
                        connection.retries++;
                        await this.wait(1000 * connection.retries); // Exponential backoff
                        return client.request(error.config);
                    }
                    
                    return Promise.reject(error);
                }
            );

            connection.client = client;
            connection.status = 'ready';
            
            this.emit('ready', name);
            return connection;

        } catch (error) {
            this.emit('error', name, error);
            throw error;
        }
    }

    getConnection(name) {
        return this.connections.get(name);
    }

    async testConnection(name) {
        const connection = this.connections.get(name);
        if (!connection) {
            throw new Error(`Connection ${name} not found`);
        }

        try {
            const response = await connection.client.get('/health');
            return { success: true, status: response.status };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    disconnectAll() {
        this.connections.clear();
        this.emit('disconnected', 'all');
    }

    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    getConnectionStatus() {
        const status = {};
        this.connections.forEach((connection, name) => {
            status[name] = {
                status: connection.status,
                lastConnected: connection.lastConnected,
                retries: connection.retries
            };
        });
        return status;
    }
}

module.exports = new ConnectionManager();