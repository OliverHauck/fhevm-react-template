import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FHEVM SDK - Next.js Demo',
  description: 'Privacy-preserving encryption demo using Universal FHEVM SDK',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
