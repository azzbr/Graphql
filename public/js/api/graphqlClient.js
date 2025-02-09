const GRAPHQL_ENDPOINT = 'https://learn.reboot01.com/api/graphql-engine/v1/graphql';

async function fetchGQLData(query, token, variables = {}) {
    try {
        const response = await fetch(GRAPHQL_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                query: query,
                variables: variables
            })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        if (data.errors) {
            throw new Error(data.errors[0].message);
        }

        return data;
    } catch (error) {
        console.error('Error fetching GraphQL data:', error);
        throw error;
    }
}

export { fetchGQLData };
