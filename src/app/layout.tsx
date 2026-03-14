import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Loca Livros",
  description: "Sistema de aluguel de livros",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
