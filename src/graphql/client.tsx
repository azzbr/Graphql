import { ApolloClient, DocumentNode, InMemoryCache } from '@apollo/client';

const uri = 'https://learn.reboot01.com/api/graphql-engine/v1/graphql';

const client = new ApolloClient({
  uri,
  cache: new InMemoryCache(),
  defaultOptions: {
    query: {
      fetchPolicy: 'network-only',
    },
  },
});

export const fetchGQLData = async (
  myquery: DocumentNode,
  token: string,
  variables?: Record<string, unknown>,
) => {
  try {
    const response = await client.query({
      query: myquery,
      variables,
      context: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });
    return response;
  } catch (error) {
    console.error('GraphQL Error:', error);
    throw error;
  }
};

export default client;
