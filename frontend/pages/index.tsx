import Head from 'next/head'
import { useConnect, useAccount } from 'wagmi'
import ConnectWallet from '../components/Wallet'

export default function Home() {
  return (
    <ConnectWallet />
  )
}
