import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import RealtimeSubscriber from "@/components/realtime-subscriber";

export const runtime = "edge";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Davinchii Lounge",
  description: "Premium gaming and internet lounge experience.",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-black text-neutral-100 selection:bg-cyan-500/30 selection:text-white">
        <RealtimeSubscriber />
        {children}
      </body>
    </html>
  );
}
