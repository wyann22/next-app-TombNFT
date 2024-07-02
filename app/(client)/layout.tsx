"use client";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();
const client = new ApolloClient({
  uri: "https://api.studio.thegraph.com/query/79547/tombstone/version/latest",
  cache: new InMemoryCache(),
});

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryClientProvider client={queryClient}>
      <ApolloProvider client={client}>{children}</ApolloProvider>
    </QueryClientProvider>
  );
}
