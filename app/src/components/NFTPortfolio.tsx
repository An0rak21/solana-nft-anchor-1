'use client'
import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';
import { Metaplex } from '@metaplex-foundation/js';
import { 
  Box, 
  Image, 
  Text, 
  VStack,
  SimpleGrid,
  Spinner,
  Button,
} from '@chakra-ui/react';

const NFTPortfolio: React.FC = () => {
  const { publicKey, connected } = useWallet();
  const [nfts, setNfts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (connected && publicKey) {
      fetchNFTs(publicKey.toString());
    }
  }, [connected, publicKey]);

  const fetchNFTs = async (walletAddress: string) => {
    setLoading(true);
    try {
      const connection = new Connection('https://api.devnet.solana.com');
      const metaplex = new Metaplex(connection);
      const ownerPublicKey = new PublicKey(walletAddress);

      const nfts = await metaplex.nfts().findAllByOwner({ owner: ownerPublicKey });

      const nftsWithMetadata = await Promise.all(nfts.map(async (nft) => {
        if (nft.uri) {
          const response = await fetch(nft.uri);
          const metadata = await response.json();
          return { ...nft, metadata };
        }
        return nft;
      }));

      setNfts(nftsWithMetadata);
    } catch (err) {
      console.error("Error fetching NFTs:", err);
      setError("Failed to fetch NFTs");
    } finally {
      setLoading(false);
    }
  };

  if (!connected) {
    return <Text>Please connect your wallet to view your NFT portfolio.</Text>;
  }

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <Text color="red.500">{error}</Text>;
  }

  if (nfts.length === 0) {
    return <Text>No NFTs found for this address</Text>;
  }

  return (
    <Box maxWidth="1200px" margin="auto" mt={8}>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>Your NFT Portfolio</Text>
      <SimpleGrid columns={[1, 2, 3, 4]} spacing={6}>
        {nfts.map((nft, index) => (
          <Box key={index} borderWidth={1} borderRadius="lg" overflow="hidden">
            <Image src={nft.metadata?.image} alt={nft.metadata?.name} />
            <Box p={4}>
              <Text fontWeight="bold">{nft.metadata?.name}</Text>
              <Text fontSize="sm" noOfLines={2}>{nft.metadata?.description}</Text>
              <Button mt={2} size="sm" onClick={() => window.open(nft.uri, '_blank')}>
                View Details
              </Button>
            </Box>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default NFTPortfolio;