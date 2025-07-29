import type { Metadata } from "next";
import "./globals.css";
import ApolloWrapper from "../graphql/client/apollo-wrapper";
import ServiceWorkerRegister from "./register-sw";
import "maplibre-gl/dist/maplibre-gl.css";

export const metadata: Metadata = {
  title: "Maps",
  description: "Offline map web app",
  themeColor: "#1c1c1d",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1c1c1d" />
        <link rel="icon" href="/logo/app.png" />
      </head>
      <body
        className={`antialiased bg-[#f0f1fa] text-[1.2rem] min-h-[100dvh] max-w-[100dvw] overflow-x-clip `}
      >
        <ApolloWrapper>
          {children}
          {/* <ServiceWorkerRegister /> */}
        </ApolloWrapper>
      </body>
    </html>
  );
}
