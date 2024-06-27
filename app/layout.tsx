import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { ThirdwebProvider } from "thirdweb/react";
import Container from "./components/Container";
import Alert from "./components/Alert";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="lofi">
      <body className={inter.className}>
        <ThirdwebProvider>
          <Container>
            <Header />
            <Alert>
              {" "}
              <div>
                This project is still in test-stage and is only available on the{" "}
                <a
                  href="https://www.alchemy.com/overviews/sepolia-testnet"
                  className="link font-bold"
                >
                  Sepolia testnet
                </a>{" "}
              </div>
            </Alert>
            <div className="p-5">{children}</div>
            <Footer />
          </Container>
        </ThirdwebProvider>
      </body>
    </html>
  );
}
