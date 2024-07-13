'use client'

import React from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import Link from 'next/link'
import { Box, Flex, HStack, Text, Button, useColorModeValue } from '@chakra-ui/react'
import dynamic from 'next/dynamic'

const WalletMultiButtonDynamic = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
)

const Header: React.FC = () => {
  const { connected } = useWallet()
  const bgColor = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('gray.600', 'white')

  return (
    <Box bg={bgColor} px={4}>
      <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
        <HStack spacing={8} alignItems={'center'}>
          <Box>
            <Text fontSize="xl" fontWeight="bold" color={textColor}>
              Solana NFT Minter
            </Text>
          </Box>
          <HStack as={'nav'} spacing={4} display={{ base: 'none', md: 'flex' }}>
            <Link href="/" passHref>
              <Button as="a" variant={'ghost'}>
                Home
              </Button>
            </Link>
            <Link href="/mint" passHref>
              <Button as="a" variant={'ghost'}>
                Mint NFT
              </Button>
            </Link>
            <Link href="/gallery" passHref>
              <Button as="a" variant={'ghost'}>
                My NFTs
              </Button>
            </Link>
          </HStack>
        </HStack>
        <Flex alignItems={'center'}>
          <WalletMultiButton />
          {connected && (
            <Text ml={4} color="green.500">
              Connected
            </Text>
          )}
        </Flex>
      </Flex>
    </Box>
  )
}

export default Header