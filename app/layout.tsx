import type { Metadata } from "next";
import { Roboto, Public_Sans } from "next/font/google";

const roboto = Roboto({
  subsets: ['latin'],
  display: 'swap',
  weight: ['100', '300', '400', '500', '700', '900'],
  variable: '--font-roboto',
});

const public_sans = Public_Sans({
  subsets: ['latin'],
  display: 'swap',
  weight: ['100', '300', '400', '500', '700', '900'],
  variable: '--font-public-sans',
});

export const metadata: Metadata = {
  title: "SAT Availability | Uzbekistan",
  description: "Created by Shokirov Muhammadiyor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${public_sans.variable} ${roboto.variable}`}>
      {children}
    </html>
  );
}
