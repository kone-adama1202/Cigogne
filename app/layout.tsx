import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import SiteShell from "./components/SiteShell";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cigogne du Mandé | Impression, informatique et communication",
  description:
    "Reprographie, vente de matériel informatique, impression, personnalisation et formation bureautique à Bamako et Sikasso.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <SiteShell header={<Header />} footer={<Footer />}>
          {children}
        </SiteShell>
      </body>
    </html>
  );
}