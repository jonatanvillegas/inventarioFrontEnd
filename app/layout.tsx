import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import LayoutClient from "@/components/LayoutClient";
import { Toaster } from "@/components/ui/sonner"
import { getNavegacionData } from "@/lib/actions";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "InventarioApp",
  description: "App inventario",
  manifest:"/manifest.json",
  icons:{
    apple:"/icon.png"
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const navegacionData = await getNavegacionData();
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
           <LayoutClient navegacionData={navegacionData}>{children}</LayoutClient>
           <Toaster />
          </ThemeProvider>
      </body>
    </html>
  );
}
