"use client";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
const client = new ApolloClient({
  uri: "https://api.studio.thegraph.com/query/79547/tombstone/version/latest",
  cache: new InMemoryCache(),
});

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
