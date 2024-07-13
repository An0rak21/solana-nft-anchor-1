import { ChakraProvider } from '@chakra-ui/react'
import dynamic from 'next/dynamic'

const ClientWalletProvider = dynamic(
  () => import('./ClientWalletProvider'),
  { ssr: false }
)

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ChakraProvider>
          <ClientWalletProvider>
            {children}
          </ClientWalletProvider>
        </ChakraProvider>
      </body>
    </html>
  )
}