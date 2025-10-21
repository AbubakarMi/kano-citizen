import type { Metadata } from "next";
import { Poppins, PT_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import "./globals.css";
import { FirebaseProvider } from "@/firebase/provider";
import { FirebaseErrorListener } from "@/components/FirebaseErrorListener";

export const metadata: Metadata = {
  title: "Kano Citizens' Voice",
  description: "Speak. Decide. Build Together.",
};

const fontPoppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-poppins",
});

const fontPtSans = PT_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-pt-sans",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-body antialiased",
          fontPoppins.variable,
          fontPtSans.variable
        )}
      >
        <FirebaseProvider>
          {children}
          <Toaster />
          <FirebaseErrorListener />
        </FirebaseProvider>
      </body>
    </html>
  );
}
