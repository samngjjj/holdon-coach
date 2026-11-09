import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HoldOn Coach — 30日科學肌肥大隨身教練",
  description: "結合 Jeff Nippard 運動科學與「教練先別加」雙重漸進關節防護的專業健身 App",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🏋️</text></svg>",
  },
};

export const viewport: Viewport = {
  themeColor: "#0B132B",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body className="antialiased font-sans bg-[#F1F5F9] text-slate-900 selection:bg-[#00D09C]/30">
        {children}
      </body>
    </html>
  );
}
