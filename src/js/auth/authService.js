import config from '../config/config.js';

class AuthService {
    constructor() {
        this.tokenKey = config.auth.tokenKey;
        this.apiUrl = config.auth.apiUrl;
    }

    validateCredentials(identifier, password) {
        if (!identifier || !password) {
            throw new Error('Username and password are required');
        }
        if (identifier.length < 3) {
            throw new Error('Username must be at least 3 characters long');
        }
        if (password.length < 6) {
            throw new Error('Password must be at least 6 characters long');
        }
    }

    async login(identifier, password) {
        try {
            // Validate inputs first
            this.validateCredentials(identifier, password);

            // Create request body first
            const requestBody = {
                identifier: identifier,
                password: password
            };

            // Create base64 encoded credentials
            const credentials = btoa(`${identifier}:${password}`);

            // Make the request with both body and auth header
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${credentials}`
                },
                body: JSON.stringify(requestBody)
            });

            // Handle different types of errors
            if (response.status === 401) {
                throw new Error(config.errors.auth.invalidCredentials);
            } else if (response.status === 429) {
                throw new Error(config.errors.auth.tooManyAttempts);
            } else if (!response.ok) {
                if (!navigator.onLine) {
                    throw new Error(config.errors.auth.networkError);
                }
                throw new Error(config.errors.auth.default);
            }

            const token = await response.json();
            
            // Validate token before storing
            if (!token || typeof token !== 'string') {
                throw new Error('Invalid token received from server');
            }

            this.setToken(token);
            return true;
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    }

    setToken(token) {
        try {
            localStorage.setItem(this.tokenKey, token);
        } catch (error) {
            console.error('Failed to store token:', error);
            throw new Error('Failed to complete login process');
        }
    }

    getToken() {
        try {
            return localStorage.getItem(this.tokenKey);
        } catch (error) {
            console.error('Failed to retrieve token:', error);
            return null;
        }
    }

    isAuthenticated() {
        const token = this.getToken();
        return !!token;
    }

    logout() {
        try {
            localStorage.removeItem(this.tokenKey);
            window.location.href = '/login.html';
        } catch (error) {
            console.error('Logout failed:', error);
            // Still redirect even if cleanup fails
            window.location.href = '/login.html';
        }
    }

    getAuthHeaders() {
        const token = this.getToken();
        if (!token) {
            throw new Error('No authentication token found');
        }
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    }
}

// Export as singleton
export const authService = new AuthService();
