import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Moodify – Your Emotional Companion',
  description: 'Music, diary, relax and mood tracking all in one place',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="page-wrapper">
          {children}
        </div>
      </body>
    </html>
  );
}
