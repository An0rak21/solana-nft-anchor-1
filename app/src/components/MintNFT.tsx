'use client'

import React, { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters'
import { 
  createNft,
  mplTokenMetadata,
} from '@metaplex-foundation/mpl-token-metadata'
import { 
  Box, 
  Button, 
  FormControl, 
  FormLabel, 
  Input, 
  VStack,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react'
import { generateSigner, percentAmount } from '@metaplex-foundation/umi'
import NFTViewer from './NFTViewer'

const MintNFT: React.FC = () => {
  const [name, setName] = useState('')
  const [symbol, setSymbol] = useState('')
  const [uri, setUri] = useState('')
  const [mintAddress, setMintAddress] = useState('')
  const wallet = useWallet()
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const mintNFT = async () => {
    if (!wallet.publicKey) {
      toast({
        title: 'Wallet not connected',
        description: 'Please connect your wallet to mint an NFT',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    try {
      const umi = createUmi('https://api.devnet.solana.com')
        .use(mplTokenMetadata())
        .use(walletAdapterIdentity(wallet))

      const mint = generateSigner(umi)

      const { signature } = await createNft(umi, {
        mint,
        name,
        symbol,
        uri,
        sellerFeeBasisPoints: percentAmount(5.5, 2),
      }).sendAndConfirm(umi)

      setMintAddress(mint.publicKey.toString())

      toast({
        title: 'NFT Minted!',
        description: `Your NFT "${name}" has been successfully minted.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      })

      onOpen() // Open the modal

    } catch (error) {
      console.error('Error minting NFT:', error)
      toast({
        title: 'Error minting NFT',
        description: (error as Error).message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  return (
    <Box maxWidth="400px" margin="auto" mt={8}>
      <VStack spacing={4}>
        <FormControl>
          <FormLabel>NFT Name</FormLabel>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </FormControl>
        <FormControl>
          <FormLabel>NFT Symbol</FormLabel>
          <Input value={symbol} onChange={(e) => setSymbol(e.target.value)} />
        </FormControl>
        <FormControl>
          <FormLabel>Metadata URI</FormLabel>
          <Input value={uri} onChange={(e) => setUri(e.target.value)} />
        </FormControl>
        <Button onClick={mintNFT} colorScheme="blue" width="full">
          Mint NFT
        </Button>
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Your Minted NFT</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {mintAddress && <NFTViewer mintAddress={mintAddress} />}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default MintNFT