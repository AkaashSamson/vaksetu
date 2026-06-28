import type { Metadata } from "next";
import { Fredoka } from "next/font/google";
import "./globals.css";

const fredoka = Fredoka({
    variable: "--font-fredoka",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Vāksetu",
    description: "Sign with your hands. Speak in your language.",
    icons: {
        icon: "/hand.png",
    },
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body
            className={`${fredoka.variable} antialiased`}
            style={{ fontFamily: "var(--font-fredoka), sans-serif" }}
            suppressHydrationWarning
        >
        {children}
        </body>
        </html>
    );
}