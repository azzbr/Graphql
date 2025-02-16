import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { ApolloProvider } from '@apollo/client';
import client from '@/graphql/client';
import Layout from '@/components/Layout';

export default function App({ Component, pageProps }: AppProps) {
  const isLoginPage = Component.name === 'Login';

  return (
    <ApolloProvider client={client}>
      {isLoginPage ? (
        <Component {...pageProps} />
      ) : (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      )}
    </ApolloProvider>
  );
}
