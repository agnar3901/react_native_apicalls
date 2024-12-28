import React from 'react';
import { StatusBar } from 'react-native';
import Navigation from './Navigation';
import { QueryClient, QueryClientProvider } from 'react-query'; // Import QueryClient and QueryClientProvider

// Create a new instance of QueryClient
const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}> {/* Wrap your app with QueryClientProvider */}
      <>
        <StatusBar barStyle="dark-content" />
        <Navigation />
      </>
    </QueryClientProvider>
  );
}
