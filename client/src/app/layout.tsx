import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "ECONEXUS — AI-Driven Industrial Resource Optimization",
  description: "Transform idle industrial capacity into measurable economic value. Share machinery, labor, warehouse space, and trade scrap with AI-powered matching.",
  keywords: ["industrial", "resource sharing", "MSME", "circular economy", "AI", "scrap marketplace"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="noise-overlay">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

