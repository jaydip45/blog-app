import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";
import Navbar from "@/components/layout/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: {
    default: "DevBlog",
    template: "%s | DevBlog",
  },
  description:
    "Read latest blogs on development, cricket updates, and tech news.",
  metadataBase: new URL("https://blog-app-gamma-smoky.vercel.app"),
  keywords: ["blog", "cricket", "technology", "coding", "devblog", "nextjs"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className={`${inter.className} min-h-full flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-50`}>
        <Providers>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <footer className="py-8 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
            <div className="container mx-auto px-4 text-center text-slate-500">
              © {new Date().getFullYear()} DevBlog. All rights reserved.
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
