import { defineChain } from 'viem'

export const ethereumSepolia = defineChain({
  id: 11155111,
  name: 'Ethereum Sepolia',
  network: 'sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'Sepolia Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: [process.env.SEPOLIA_RPC_URL],
    },
  },
  blockExplorers: {
    default: { 
      name: 'Etherscan', 
      url: 'https://sepolia.etherscan.io' 
    },
  },
  testnet: true,
})

export const riseSepolia = defineChain({
  id: 11155931,
  name: 'RISE Sepolia',
  network: 'rise-sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'RISE Sepolia Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://testnet.riselabs.xyz'],
    },
  },
  blockExplorers: {
    default: { 
      name: 'RISE Explorer', 
      url: 'https://explorer.riselabs.xyz' 
    },
  },
  testnet: true,
})

// Bridge contract configuration
export const BRIDGE_CONTRACT = {
  address: '0xE3B8f495De4e43C7C911343A53bb19Fc3e3B2783',
  abi: [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "l1Token",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "l2Token",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "uint32",
          "name": "minGasLimit",
          "type": "uint32"
        }
      ],
      "name": "depositERC20",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint32",
          "name": "minGasLimit",
          "type": "uint32"
        }
      ],
      "name": "depositETH",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint32",
          "name": "minGasLimit",
          "type": "uint32"
        }
      ],
      "name": "depositETHTo",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "l1Token",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "l2Token",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "ERC20Deposited",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "EthDeposited",
      "type": "event"
    }
  ]
}
