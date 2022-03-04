import Head from 'next/head'
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Provider, chain, defaultChains } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { WalletLinkConnector } from 'wagmi/connectors/walletLink'

const infuraId = 'a618bb907c2f4670a721be9cd51f388e'

// Chains for connectors to support
const chains = defaultChains

// Set up connectors
const connectors = ({ chainId }: any) => {
  const rpcUrl =
    chains.find((x) => x.id === chainId)?.rpcUrls?.[0] ??
    chain.mainnet.rpcUrls[0]
  return [
    new InjectedConnector({
      chains,
      options: { shimDisconnect: true },
    }),
    new WalletConnectConnector({
      options: {
        infuraId,
        qrcode: true,
      },
    }),
    new WalletLinkConnector({
      options: {
        appName: 'WagPay',
        jsonRpcUrl: `${rpcUrl}/${infuraId}`,
      },
    }),
  ]
}


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider autoConnect connectors={connectors}>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin='' />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;300;400;700;800&display=swap" rel="stylesheet" />
      </Head>
      <Component {...pageProps} />
    </Provider>
  )
}

export default MyApp
