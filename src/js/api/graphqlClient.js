import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { authService } from '../auth/authService.js';

class GraphQLClient {
    constructor() {
        this.endpoint = 'https://learn.reboot01.com/api/graphql-engine/v1/graphql';
        this.client = null;
        this.initClient();
    }

    initClient() {
        try {
            this.client = new ApolloClient({
                uri: this.endpoint,
                cache: new InMemoryCache(),
                defaultOptions: {
                    watchQuery: {
                        fetchPolicy: 'network-only',
                        errorPolicy: 'all',
                    },
                    query: {
                        fetchPolicy: 'network-only',
                        errorPolicy: 'all',
                    },
                },
                headers: authService.getAuthHeaders(),
            });
        } catch (error) {
            console.error('Failed to initialize GraphQL client:', error);
            this.client = null;
        }
    }

    ensureClient() {
        if (!this.client) {
            this.initClient();
        }
        if (!this.client) {
            throw new Error('Failed to initialize GraphQL client');
        }
    }

    cleanup() {
        if (this.client) {
            // Clear Apollo Client's cache
            this.client.clearStore();
            // Reset the client
            this.client = null;
        }
    }

    async query(queryString, variables = {}) {
        try {
            this.ensureClient();
            // Convert string query to gql
            const gqlQuery = gql`${queryString}`;
            
            const { data, errors } = await this.client.query({
                query: gqlQuery,
                variables,
                context: {
                    headers: authService.getAuthHeaders()
                }
            });

            if (errors) {
                throw new Error(errors[0].message);
            }

            return data;
        } catch (error) {
            console.error('GraphQL query error:', error);
            // If authentication error, try reinitializing client
            if (error.message.includes('authentication')) {
                this.client = null;
                throw new Error('Authentication failed. Please log in again.');
            }
            throw error;
        }
    }

    // Predefined queries using gql tag
    async getUserProfile() {
        const queryStr = `
            query {
                user {
                    id
                    login
                    email
                    firstName
                    lastName
                    attrs
                    totalUp
                    totalDown
                }
            }
        `;
        return this.query(queryStr);
    }

    async getUserXP() {
        const queryStr = `
            query {
                transaction_aggregate(where: {type: {_eq: "xp"}, eventId: {_eq: 32}}) {
                    aggregate {
                        sum {
                            amount
                        }
                    }
                }
            }
        `;
        return this.query(queryStr);
    }

    async getUserSkills() {
        const queryStr = `
            query {
                user {
                    transactions(where: {
                        type: {_ilike: "%skill%"}
                    }) {
                        type
                        amount
                    }
                }
            }
        `;
        return this.query(queryStr);
    }

    async getXPProgression() {
        const queryStr = `
            query {
                user {
                    transactions(
                        where: {
                            _and: [
                                { object: { progresses: { isDone: { _eq: true } } } }
                                {
                                    _and: [
                                        { path: { _ilike: "%div-01%" } }
                                        { path: { _nilike: "%div-01/piscine-js/%" } }
                                        { path: { _nilike: "%div-01/piscine-rust/%" } }
                                    ]
                                }
                                { type: { _eq: "xp" } }
                            ]
                        }
                        order_by: { createdAt: asc }
                    ) {
                        path
                        amount
                        createdAt
                        object {
                            name
                            type
                        }
                    }
                }
            }
        `;
        return this.query(queryStr);
    }
}

// Export as singleton
export const graphqlClient = new GraphQLClient();
