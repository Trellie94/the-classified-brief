import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DEFINITELY NOT A GOVERNMENT WEBSITE",
  description: "They don't want you to present this.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="grain-overlay scanlines">
        {children}
      </body>
    </html>
  );
}
