import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TaskFlow AI – AI-Powered Project Management",
  description: "Manage projects smarter with AI. TaskFlow AI helps teams organize tasks, track progress, and collaborate efficiently with the power of artificial intelligence.",
  keywords: "project management, AI, task tracking, team collaboration, productivity",
  openGraph: {
    title: "TaskFlow AI – AI-Powered Project Management",
    description: "Manage projects smarter with AI.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
