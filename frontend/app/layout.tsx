import type { Metadata } from 'next';
import './globals.css';
import I18nProvider from '../components/shared/I18nProvider';
import Navbar from '../components/layout/Navbar';
import DisclaimerBanner from '../components/layout/DisclaimerBanner';

export const metadata: Metadata = {
  title: 'NyayaSaathi — Free Legal Aid Platform',
  description: 'AI-powered bilingual legal aid platform for India. Know your rights, generate documents, and find pro bono lawyers.',
  keywords: 'legal aid India, free lawyer, RTI application, consumer complaint, FIR filing, bilingual',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Noto+Sans+Devanagari:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <I18nProvider>
          <Navbar />
          <main style={{ minHeight: 'calc(100vh - 61px)', display: 'flex', flexDirection: 'column' }}>
            {children}
          </main>
          <DisclaimerBanner />
        </I18nProvider>
      </body>
    </html>
  );
}
