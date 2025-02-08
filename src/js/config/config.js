const config = {
    auth: {
        apiUrl: 'https://learn.reboot01.com/api/auth/signin',
        tokenKey: 'jwt',
    },
    errors: {
        auth: {
            invalidCredentials: 'Invalid username or password',
            tooManyAttempts: 'Too many attempts. Please try again later',
            networkError: 'Network error. Please check your connection and try again',
            default: 'An unexpected error occurred. Please try again'
        }
    }
};

export default config;
