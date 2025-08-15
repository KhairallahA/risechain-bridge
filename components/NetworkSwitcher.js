'use client'

import { useAccount, useSwitchChain } from 'wagmi'
import { ethereumSepolia, riseSepolia } from '../lib/networks'

export function NetworkSwitcher() {
  const { chain } = useAccount()
  const { switchChain, isPending } = useSwitchChain()

  const networks = [
    { ...ethereumSepolia, displayName: 'Ethereum Sepolia' },
    { ...riseSepolia, displayName: 'RISE Sepolia' }
  ]

  return (
    <div className="flex flex-col gap-4">
      <div className="text-sm text-gray-600">
        Current Network: {chain?.name || 'Not Connected'}
      </div>
      <div className="flex flex-wrap gap-2">
        {networks.map((network) => (
          <button
            key={network.id}
            onClick={() => switchChain({ chainId: network.id })}
            disabled={isPending || chain?.id === network.id}
            className={`px-4 py-2 rounded-lg transition-colors cursor-pointer ${
              chain?.id === network.id
                ? 'bg-green-500 text-white cursor-default'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isPending ? 'Switching...' : network.displayName}
          </button>
        ))}
      </div>
    </div>
  )
}
