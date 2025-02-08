const config = {
    auth: {
        apiUrl: 'https://zone01normandie.org/api/auth/signin',
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