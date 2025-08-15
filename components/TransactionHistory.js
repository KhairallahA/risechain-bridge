'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAccount, usePublicClient } from 'wagmi'
import { BRIDGE_CONTRACT, ethereumSepolia } from '../lib/networks'
import { formatEther } from 'viem'

export function TransactionHistory() {
  const { address, isConnected } = useAccount()
  const [transactions, setTransactions] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  
  const publicClient = usePublicClient({ chainId: ethereumSepolia.id })

  // Fetch transactions from EthDeposited events
  const fetchTransactions = useCallback(async () => {
    if (!address || !publicClient || !isConnected) return

    setIsLoading(true)
    setError(null)

    try {
      // Get the latest block number
      const latestBlock = await publicClient.getBlockNumber()
      
      // Alchemy has a 500 block limit for eth_getLogs, so we'll batch requests
      // Look back 2000 blocks total (approximately 8 hours on Ethereum)
      const totalBlocksToSearch = 2000n
      const batchSize = 450n // Use 450 to stay safely under the 500 limit
      const startBlock = latestBlock - totalBlocksToSearch > 0n ? latestBlock - totalBlocksToSearch : 0n
      
      const allLogs = []
      
      // Batch the requests to stay within Alchemy's limits
      for (let fromBlock = startBlock; fromBlock < latestBlock; fromBlock += batchSize) {
        const toBlock = fromBlock + batchSize - 1n > latestBlock ? latestBlock : fromBlock + batchSize - 1n
        
        try {
          const logs = await publicClient.getLogs({
            address: BRIDGE_CONTRACT.address,
            event: {
              type: 'event',
              name: 'EthDeposited',
              inputs: [
                { name: 'from', type: 'address', indexed: true },
                { name: 'to', type: 'address', indexed: true },
                { name: 'amount', type: 'uint256', indexed: false }
              ]
            },
            args: {
              from: address, // Filter by the connected address as sender
            },
            fromBlock,
            toBlock
          })
          
          allLogs.push(...logs)
        } catch (batchError) {
          console.warn(`Failed to fetch logs for blocks ${fromBlock}-${toBlock}:`, batchError)
          // Continue with other batches even if one fails
        }
      }

      // Process the logs into transaction objects
      const processedTxs = await Promise.all(
        allLogs.map(async (log) => {
          try {
            // Get transaction details
            const tx = await publicClient.getTransaction({ hash: log.transactionHash })
            const block = await publicClient.getBlock({ blockHash: log.blockHash })
            
            return {
              hash: log.transactionHash,
              from: log.args.from,
              to: log.args.to,
              amount: formatEther(log.args.amount),
              blockNumber: log.blockNumber,
              timestamp: Number(block.timestamp) * 1000, // Convert to milliseconds
              status: 'confirmed'
            }
          } catch (err) {
            console.error('Error processing transaction:', err)
            return null
          }
        })
      )

      // Filter out null transactions and sort by block number (newest first)
      const validTxs = processedTxs
        .filter(tx => tx !== null)
        .sort((a, b) => Number(b.blockNumber) - Number(a.blockNumber))
        .slice(0, 20) // Keep last 20 transactions

      setTransactions(validTxs)
    } catch (err) {
      console.error('Error fetching transaction history:', err)
      setError(`Failed to load transaction history: ${err.message || 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }, [address, publicClient, isConnected])

  // Fetch transactions when component mounts or address changes
  useEffect(() => {
    if (isConnected && address && publicClient) {
      fetchTransactions()
    } else {
      setTransactions([])
    }
  }, [isConnected, address, publicClient, fetchTransactions])

  // Expose refresh function globally so other components can trigger updates
  useEffect(() => {
    window.refreshTransactionHistory = fetchTransactions
    return () => {
      delete window.refreshTransactionHistory
    }
  }, [fetchTransactions])

  if (!isConnected) {
    return (
      <div className="bg-gray-100 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
        <p className="text-gray-500">Connect your wallet to view transaction history</p>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold">Transaction History</h2>
        <button
          onClick={fetchTransactions}
          disabled={isLoading}
          className="px-3 py-1 cursor-pointer text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Loading...' : 'Refresh'}
        </button>
      </div>
      <p className="text-xs text-gray-500 mb-4">
        Showing transactions from the last ~2000 blocks (~8 hours)
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 p-3 rounded-lg mb-4">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {isLoading && transactions.length === 0 ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-500">Loading transactions...</span>
        </div>
      ) : transactions.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          No bridge transactions found for this address
        </p>
      ) : (
        <div className="space-y-3">
          {transactions.map((tx, index) => (
            <div key={tx.hash || index} className="border border-gray-200 p-4 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${
                    tx.status === 'confirmed' ? 'bg-green-500' : 
                    tx.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                  <span className="font-medium">ETH Bridge</span>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(tx.timestamp).toLocaleDateString()} {new Date(tx.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <div className="font-semibold">Amount: {parseFloat(tx.amount).toFixed(4)} ETH</div>
                <div>From: {tx.from?.slice(0, 6)}...{tx.from?.slice(-4)}</div>
                {tx.to && tx.to !== tx.from && (
                  <div>To: {tx.to.slice(0, 6)}...{tx.to.slice(-4)}</div>
                )}
              </div>
              <div>
                <a
                  href={`https://sepolia.etherscan.io/tx/${tx.hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700 text-xs underline"
                >
                  View on Etherscan →
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
