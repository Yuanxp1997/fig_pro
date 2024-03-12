import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Room } from "./Room";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FigPro",
  description:
    "An online design tool that allows you to create and share designs and collaborate with others in real-time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-primary-grey-200 overflow-hidden`}
      >
        <Room>{children}</Room>
      </body>
    </html>
  );
}
