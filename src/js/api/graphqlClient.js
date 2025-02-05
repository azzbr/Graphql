import { authService } from '../auth/authService.js';

class GraphQLClient {
    constructor() {
        this.endpoint = 'https://learn.reboot01.com/api/graphql-engine/v1/graphql';
    }

    async query(queryString, variables = {}) {
        try {
            const response = await fetch(this.endpoint, {
                method: 'POST',
                headers: authService.getAuthHeaders(),
                body: JSON.stringify({
                    query: queryString,
                    variables
                })
            });

            if (!response.ok) {
                throw new Error('GraphQL query failed');
            }

            const data = await response.json();
            
            if (data.errors) {
                throw new Error(data.errors[0].message);
            }

            return data.data;
        } catch (error) {
            console.error('GraphQL query error:', error);
            throw error;
        }
    }

    // Predefined queries for common operations
    async getUserProfile() {
        const query = `
            query {
                user {
                    id
                    login
                    email
                    firstName
                    lastName
                    attrs
                }
            }
        `;
        return this.query(query);
    }

    async getUserXP() {
        const query = `
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
        return this.query(query);
    }

    async getUserSkills() {
        const query = `
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
        return this.query(query);
    }

    async getXPProgression() {
        const query = `
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
        return this.query(query);
    }
}

// Export as singleton
export const graphqlClient = new GraphQLClient();
