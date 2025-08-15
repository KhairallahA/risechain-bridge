'use client'

import { WalletConnect } from '../components/WalletConnect'
import { NetworkSwitcher } from '../components/NetworkSwitcher'
import { BalanceDisplay } from '../components/BalanceDisplay'
import { BridgeForm } from '../components/BridgeForm'
import { TransactionHistory } from '../components/TransactionHistory'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Ethereum ↔ RISE Bridge
              </h1>
              <p className="text-sm text-gray-600">
                Bridge ETH from Ethereum Sepolia to RISE Sepolia
              </p>
            </div>
            <WalletConnect />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Network Switcher */}
            <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Network</h2>
              <NetworkSwitcher />
            </div>

            {/* Balance Display */}
            <BalanceDisplay />

            {/* Bridge Form */}
            <BridgeForm />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Transaction History */}
            <TransactionHistory />

            {/* Info Card */}
            <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                How it works
              </h3>
              <ul className="text-sm text-blue-800 space-y-2">
                <li>• Connect your wallet to get started</li>
                <li>• Make sure you&apos;re on Ethereum Sepolia network</li>
                <li>• Enter the amount of ETH you want to bridge</li>
                <li>• Confirm the transaction in your wallet</li>
                <li>• Your ETH will appear on RISE Sepolia after confirmation</li>
              </ul>
            </div>

            {/* Contract Info */}
            <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Contract Information
              </h3>
              <div className="text-sm text-gray-600 space-y-1">
                <div>
                  <span className="font-medium">Bridge Contract:</span>
                  <div className="font-mono text-xs break-all">
                    0xE3B8f495De4e43C7C911343A53bb19Fc3e3B2783
                  </div>
                </div>
                <div>
                  <span className="font-medium">Ethereum Sepolia:</span> Chain ID 11155111
                </div>
                <div>
                  <span className="font-medium">RISE Sepolia:</span> Chain ID 11155931
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            <p>Ethereum to RISE Bridge - Testnet Only</p>
            <p className="mt-1">
              Make sure you&apos;re using testnet tokens only. Never use mainnet funds.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}