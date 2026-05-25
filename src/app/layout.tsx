import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import localFont from 'next/font/local'
import { Toaster } from 'sonner'
import { Navbar } from '@/components/layout/Navbar'
import { CartDrawer } from '@/components/cart/CartDrawer'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const bebas = localFont({
  src: '../../public/fonts/BebasNeue-Regular.ttf',
  variable: '--font-bebas',
  display: 'swap',
})

export const metadata: Metadata = {
  title: { default: 'KONTACT — Boxing & Gym Gear', template: '%s | KONTACT' },
  description: 'Equipo de box y gym profesional. Una casa para la gente que entrena.',
  keywords: ['guantes de box', 'equipo de boxeo', 'gym gear', 'Saltillo', 'México'],
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'KONTACT',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${bebas.variable}`}>
      <body className="bg-brand-black text-brand-white antialiased">
        <Navbar />
        <CartDrawer />
        <main>{children}</main>
        <Toaster theme="dark" position="bottom-right" />
      </body>
    </html>
  )
}
