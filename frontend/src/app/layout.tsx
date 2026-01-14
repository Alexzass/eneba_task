import "./globals.css";

import Header from "@/components/Header";
import { ClientContextProvider } from "@/components/ClientProvider";
import CreateGameModal from "@/components/CreateGameModal";

import type { Metadata } from 'next'
 
export const metadata: Metadata = {
  title: 'Eneba',
  description: 'Games, Gift Cards, Top-Ups & More | Best Deals',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Google+Sans:ital,opsz,wght@0,17..18,400..700;1,17..18,400..700&family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap" rel="stylesheet"></link>
      </head>
      <body>
        <ClientContextProvider>
          <CreateGameModal/>
          <Header/>
          {children}
        </ClientContextProvider>
      </body>
    </html>
  );
}
