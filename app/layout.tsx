import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bible in a Year",
  description: "Biblica 365-day Bible reading plan — track your daily OT, NT, and Psalm readings.",
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{props.children}</body>
    </html>
  );
}
