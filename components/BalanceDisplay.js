'use client'

import { useAccount, useBalance } from 'wagmi'
import { ethereumSepolia, riseSepolia } from '../lib/networks'
import { formatEther } from 'viem'
import { useEffect } from 'react'

export function BalanceDisplay() {
  const { address, isConnected } = useAccount()

  const { data: ethBalance, isLoading: ethLoading, error: ethError, refetch: refetchEthBalance } = useBalance({
    address,
    chainId: ethereumSepolia.id,
    query: {
      refetchInterval: 10000, // Refetch every 10 seconds
      enabled: !!address && isConnected,
    }
  })

  const { data: riseBalance, isLoading: riseLoading, error: riseError, refetch: refetchRiseBalance } = useBalance({
    address,
    chainId: riseSepolia.id,
    query: {
      refetchInterval: 10000, // Refetch every 10 seconds
      enabled: !!address && isConnected,
    }
  })

  // Expose refetch functions globally so other components can trigger balance updates
  useEffect(() => {
    window.refreshBalances = () => {
      refetchEthBalance()
      refetchRiseBalance()
    }
    return () => {
      delete window.refreshBalances
    }
  }, [refetchEthBalance, refetchRiseBalance])

  if (!isConnected) {
    return (
      <div className="bg-gray-100 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Your Balances</h2>
        <p className="text-gray-500">Connect your wallet to view balances</p>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Your Balances</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Ethereum Sepolia Balance */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <h3 className="font-medium text-gray-800">Ethereum Sepolia</h3>
          </div>
          {ethLoading ? (
            <div className="text-gray-500">Loading...</div>
          ) : ethError ? (
            <div className="text-red-500 text-sm">Error loading balance</div>
          ) : (
            <div className="text-2xl font-bold text-gray-900">
              {ethBalance ? parseFloat(formatEther(ethBalance.value)).toFixed(4) : '0.0000'} ETH
            </div>
          )}
        </div>

        {/* RISE Sepolia Balance */}
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <h3 className="font-medium text-gray-800">RISE Sepolia</h3>
          </div>
          {riseLoading ? (
            <div className="text-gray-500">Loading...</div>
          ) : riseError ? (
            <div className="text-red-500 text-sm">Error loading balance</div>
          ) : (
            <div className="text-2xl font-bold text-gray-900">
              {riseBalance ? parseFloat(formatEther(riseBalance.value)).toFixed(4) : '0.0000'} ETH
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
