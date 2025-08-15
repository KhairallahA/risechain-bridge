import { http, createConfig } from 'wagmi'
import { ethereumSepolia, riseSepolia } from './networks'
import { injected, metaMask } from 'wagmi/connectors'

export const config = createConfig({
  chains: [ethereumSepolia, riseSepolia],
  connectors: [
    injected(),
    metaMask(),
  ],
  transports: {
    [ethereumSepolia.id]: http(),
    [riseSepolia.id]: http(),
  },
})
