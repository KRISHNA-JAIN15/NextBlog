import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
import NextAuthProvider from "@/components/auth/AuthProvider";
import PageLoader from "@/components/ui/PageLoader";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NextBlog - A modern blogging platform",
  description: "Share your thoughts with the world",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextAuthProvider>
          <AuthProvider>
            <PageLoader duration={3000}>
              {children}
            </PageLoader>
          </AuthProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
