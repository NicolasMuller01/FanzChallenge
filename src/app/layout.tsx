import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: "SeatMapBuilder (Fanz)",
  description: "A visual seat map editor for creating and managing seating arrangements",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#4ade80',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  );
}