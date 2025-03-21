import type { Metadata } from "next";
import localFont from "next/font/local";


export const metadata: Metadata = {
  title: "Salus | AI Acne Solution",
  description: "Salus is an AI-powered acne solution that uses advanced image analysis and machine learning to provide personalized treatment recommendations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
      >
        {children}
      </body>
    </html>
  );
}
