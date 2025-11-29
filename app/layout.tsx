import type { Metadata } from 'next'
import './globals.css'
import 'leaflet/dist/leaflet.css'
import { AuthProvider } from '@/lib/auth-context'
import { ExercisesProvider } from '@/lib/exercises-context'
import { ThemeProvider } from '@/components/theme-provider'

export const metadata: Metadata = {
  title: 'VocalWell.ai - Voice Analysis',
  description: 'AI-powered voice analysis for early detection of voice disorders',
  generator: 'v0.dev',
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ExercisesProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
          </ExercisesProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
