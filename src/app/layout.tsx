import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StrideX - Premium Events. Seamless Flow.",
  description: "Official Registration Platform for the world's most demanding endurance races.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
