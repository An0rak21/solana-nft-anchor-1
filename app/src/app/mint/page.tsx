'use client'

import Header from "@/components/Header"
import MintNFT from "@/components/MintNFT"

export default function MintPage() {
  return (
    <main>
      <Header />
      <h1>Mint your NFT</h1>
      <MintNFT />
      {/* Ajoutez le composant de minting ici */}
    </main>
  )
}