'use client'

import { useState } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { BRIDGE_CONTRACT } from '../lib/networks'
import { ethereumSepolia } from '../lib/networks'

export function BridgeForm() {
  const { address, isConnected, chain } = useAccount()
  const [amount, setAmount] = useState('')
  const [recipient, setRecipient] = useState('')
  const [minGasLimit, setMinGasLimit] = useState('20000')
  const [hideSuccess, setHideSuccess] = useState(false)

  const { 
    data: hash, 
    error, 
    isPending, 
    writeContract 
  } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ 
      hash,
      onSuccess: () => {
        // Refresh balances and transaction history after successful transaction
        if (window.refreshBalances) {
          setTimeout(() => window.refreshBalances(), 2000) // Wait 2 seconds for blockchain to update
        }
        if (window.refreshTransactionHistory) {
          setTimeout(() => window.refreshTransactionHistory(), 3000) // Wait 3 seconds for event indexing
        }
      }
    })

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount')
      return
    }

    if (chain?.id !== ethereumSepolia.id) {
      alert('Please switch to Ethereum Sepolia network')
      return
    }

    try {
      // Reset hide success state when starting a new transaction
      setHideSuccess(false)
      
      const amountWei = parseEther(amount)
      const gasLimit = parseInt(minGasLimit)

      if (recipient && recipient !== address) {
        // Use depositETHTo if recipient is different
        writeContract({
          address: BRIDGE_CONTRACT.address,
          abi: BRIDGE_CONTRACT.abi,
          functionName: 'depositETHTo',
          args: [recipient, gasLimit],
          value: amountWei,
        })
      } else {
        // Use depositETH for self
        writeContract({
          address: BRIDGE_CONTRACT.address,
          abi: BRIDGE_CONTRACT.abi,
          functionName: 'depositETH',
          args: [gasLimit],
          value: amountWei,
        })
      }
    } catch (err) {
      console.error('Bridge transaction error:', err)
    }
  }

  const resetForm = () => {
    setAmount('')
    setRecipient('')
    setMinGasLimit('20000')
    setHideSuccess(true)
  }

  if (!isConnected) {
    return (
      <div className="bg-gray-100 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Bridge ETH to RISE</h2>
        <p className="text-gray-500">Connect your wallet to use the bridge</p>
      </div>
    )
  }

  if (isConfirmed && !hideSuccess) {
    return (
      <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-green-800">Bridge Successful!</h2>
        <p className="text-green-700 mb-4">
          Your transaction has been confirmed. ETH has been bridged to RISE Sepolia.
        </p>
        <div className="text-sm text-green-600 mb-4">
          Transaction Hash: {hash}
        </div>
        <button
          onClick={resetForm}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors cursor-pointer"
        >
          Bridge More
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Bridge ETH to RISE</h2>
      
      {chain?.id !== ethereumSepolia.id && (
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-4">
          <p className="text-yellow-800">
            Please switch to Ethereum Sepolia network to use the bridge
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
            Amount (ETH)
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.0"
            step="0.0001"
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label htmlFor="recipient" className="block text-sm font-medium text-gray-700 mb-1">
            Recipient Address (optional)
          </label>
          <input
            type="text"
            id="recipient"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder={address || "0x..."}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            Leave empty to bridge to your own address
          </p>
        </div>

        <button
          type="submit"
          disabled={isPending || isConfirming || chain?.id !== ethereumSepolia.id}
          className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium cursor-pointer"
        >
          {isPending ? 'Confirming...' : isConfirming ? 'Processing...' : 'Bridge ETH'}
        </button>

        {error && (
          <div className="text-red-500 text-sm p-3 bg-red-50 rounded-lg">
            Error: {error.shortMessage || error.message}
          </div>
        )}
      </form>
    </div>
  )
}
