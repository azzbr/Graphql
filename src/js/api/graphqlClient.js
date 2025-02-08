import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { authService } from '../auth/authService.js';

class GraphQLClient {
    constructor() {
        this.endpoint = 'https://learn.reboot01.com/api/graphql-engine/v1/graphql';
        this.client = null;
        this.initClient();
    }

    initClient() {
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
    }

    async query(queryString, variables = {}) {
        try {
            // Convert string query to gql
            const gqlQuery = gql`${queryString}`;
            
            const { data, errors } = await this.client.query({
                query: gqlQuery,
                variables,
            });

            if (errors) {
                throw new Error(errors[0].message);
            }

            return data;
        } catch (error) {
            console.error('GraphQL query error:', error);
            throw error;
        }
    }

    // Predefined queries using gql tag
    async getUserProfile() {
        const query = gql`
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
        const { data } = await this.client.query({ query });
        return data;
    }

    async getUserXP() {
        const query = gql`
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
        const { data } = await this.client.query({ query });
        return data;
    }

    async getUserSkills() {
        const query = gql`
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
        const { data } = await this.client.query({ query });
        return data;
    }

    async getXPProgression() {
        const query = gql`
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
        const { data } = await this.client.query({ query });
        return data;
    }
}

// Export as singleton
export const graphqlClient = new GraphQLClient();
