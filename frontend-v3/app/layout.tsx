import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Suburban Culture Engine',
  description: 'Building community in places where community has collapsed',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

