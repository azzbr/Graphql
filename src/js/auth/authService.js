class AuthService {
    constructor() {
        this.tokenKey = 'auth_token';
        this.apiUrl = 'https://learn.reboot01.com/api/auth/signin';
    }

    async login(identifier, password) {
        try {
            const credentials = btoa(`${identifier}:${password}`);
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${credentials}`
                },
                body: JSON.stringify({ identifier, password })
            });

            if (!response.ok) {
                throw new Error('Invalid credentials');
            }

            const token = await response.json();
            this.setToken(token);
            return true;
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    }

    setToken(token) {
        localStorage.setItem(this.tokenKey, token);
    }

    getToken() {
        return localStorage.getItem(this.tokenKey);
    }

    isAuthenticated() {
        return !!this.getToken();
    }

    logout() {
        localStorage.removeItem(this.tokenKey);
        window.location.href = '/src/pages/login.html';
    }

    getAuthHeaders() {
        const token = this.getToken();
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    }
}

// Export as singleton
export const authService = new AuthService();
