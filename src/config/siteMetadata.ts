import type { Metadata } from 'next'

export const siteMetadata: Metadata = {
  metadataBase: new URL('https://electropool.online'),

  manifest: '/manifest.webmanifest',

  title: {
    default: 'Arpan Kar — ElectroPool',
    template: '%s | ElectroPool',
  },

  description:
    'The personal portfolio of Arpan Kar — Electronics & Telecommunication Engineer focused on systems, automation, embedded electronics, and practical engineering projects.',

  applicationName: 'ElectroPool',

  authors: [
    {
      name: 'Arpan Kar',
      url: 'https://electropool.online',
    },
  ],

  creator: 'Arpan Kar',
  publisher: 'ElectroPool',

  keywords: [
    'Arpan Kar',
    'ElectroPool',
    'portfolio',
    'electronics',
    'telecommunication',
    'engineering',
    'embedded systems',
    'automation',
    'IoT',
  ],

  openGraph: {
    type: 'website',
    url: 'https://electropool.online',
    siteName: 'ElectroPool',
    title: 'Arpan Kar — ElectroPool',
    description:
      'Personal portfolio of Arpan Kar — Electronics & Telecommunication Engineer focused on systems, automation, embedded electronics, and practical engineering projects.',

    images: [
      {
        url: '/assets/images/site/og-banner.jpg',
        width: 1200,
        height: 630,
        alt: 'Arpan Kar — ElectroPool Portfolio',
      },
    ],

    locale: 'en_US',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Arpan Kar — ElectroPool',
    description:
      'Personal portfolio of Arpan Kar — Electronics & Telecommunication Engineer.',
    images: ['/assets/images/site/og-banner.jpg'],
  },

  icons: {
    icon: [
      {
        url: '/assets/images/site/favicon.png',
        type: 'image/png',
      },
    ],

    apple: [
      {
        url: '/assets/images/site/favicon.png',
        type: 'image/png',
      },
    ],
  },

  robots: {
    index: true,
    follow: true,
  },

  themeColor: '#080808',
}
