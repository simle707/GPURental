import { Providers } from '@/components/Providers';
import { Navbar } from '@/components/Navbar';
import { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Featurize',
    template: '%s | Featurize', 
  },
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh" suppressHydrationWarning>
      <body>
        <Providers>
          <div className="min-h-screen flex flex-col bg-base-100 text-base-content">
            <Navbar />
            <main className="flex-1 container mx-auto px-4 py-8">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}