import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

import Providers from "./_providers";

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

export const metadata: Metadata = {
  title: "mini wallet",
  description: "mini wallet",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="cupcake" className="overflow-hidden">
      <body
        className={`bg-primary text-base-content ${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        <Providers>
          <div className="border border-gray-500 rounded-4xl h-screen max-w-md w-full mx-auto p-4 box bg-black">
            <div className="bg-base-100 rounded-4xl flex flex-col h-full">
              {children}
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
