// /app/layout.tsx
import type { Metadata } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import Head from 'next/head';

// Load custom fonts
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Metadata for the page
export const metadata: Metadata = {
  title: "Vester",
  description: "AI-driven crypto insights",
};

// Single RootLayout function
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Ensure title is a string */}
        <title>{typeof metadata.title === 'string' ? metadata.title : 'Default Title'}</title>
        {/* Ensure description is a string */}
        <meta
          name="description"
          content={typeof metadata.description === 'string' ? metadata.description : 'Default description'}
        />
      </Head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`} // Corrected syntax
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
