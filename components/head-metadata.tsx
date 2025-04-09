"use client"

import Head from 'next/head';

export function HeadMetadata() {
  return (
    <Head>
      {/* Preload key assets */}
      <link rel="preload" href="/placeholder.jpg" as="image" />
      <link rel="preload" href="/hero12-lowres.mp4" as="video" type="video/mp4" />
      
      {/* DNS prefetch for external resources */}
      <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
    </Head>
  );
} 