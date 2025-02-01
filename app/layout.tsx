import "@/app/ui/global.css";
import React from "react";
import { Analytics } from '@vercel/analytics/next';

export default function RootLayout(
    {
        children,
    }: {
        children: React.ReactNode;
    }) {
    return (
        <html lang="en">
        <body>{children} <Analytics/>
        </body>
        </html>
    );
}
