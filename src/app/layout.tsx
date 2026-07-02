import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'RIYA AI v2',
  description: 'Unlimited Autonomous Software Engineer',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
