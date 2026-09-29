import type { Metadata } from "next";

import { AppProviders } from "./providers";

import "./globals.css";
import { Header } from "@/components/Header"
import { Toaster } from "@/components/ui/sonner"
import { Footer } from "@/components/Footer"

export const metadata: Metadata = {
  title: {
    default: "Maua.ke",
    template: "%s | Maua.ke",
  },
  description:
    "Flowers, gifts and care packages delivered across Kenya.",
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
    <body>
    <AppProviders>
      <div className="flex min-h-screen flex-col">
        <Header />
      {children}
        <Footer/>
      </div>
      <Toaster position="top-center" richColors />
    </AppProviders>
    </body>
    </html>
  );
}