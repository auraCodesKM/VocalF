import { ethers } from 'ethers';
import axios from 'axios';
import FormData from 'form-data';

const CONTRACT_ADDRESS = '0x7d115f7b72CccB0e741AB44919B376c1689e7f91';
const EDUCHAIN_TESTNET_ID = 656476;

// Pinata configuration from environment variables
const PINATA_JWT = process.env.NEXT_PUBLIC_PINATA_JWT;

// ABI for the report verification contract
const CONTRACT_ABI = [
  'function storeReport(string reportId, string ipfsCID, string reportHash) public',
  'function verifyReport(string reportId, string reportHash) public view returns (bool)'
] as const;

export class BlockchainService {
  private provider: ethers.BrowserProvider | null = null;
  private contract: ethers.Contract | null = null;
  private isWeb3Available: boolean = false;

  constructor() {
    this.initializeWeb3();
  }

  private initializeWeb3() {
    // Check if MetaMask is installed
    if (typeof window !== 'undefined' && window.ethereum) {
      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, this.provider);
      this.isWeb3Available = true;
    } else {
      console.log('Web3 provider not found. Some features will be disabled.');
      this.isWeb3Available = false;
    }
  }

  async connectWallet(): Promise<string> {
    if (!this.isWeb3Available) {
      throw new Error('Please install MetaMask to use blockchain features');
    }

    try {
      // Request account access
      const accounts = await this.provider!.send('eth_requestAccounts', []);
      
      // Check if connected to correct network
      const network = await this.provider!.getNetwork();
      if (network.chainId !== BigInt(EDUCHAIN_TESTNET_ID)) {
        throw new Error('Please connect to EduChain Testnet');
      }
      
      return accounts[0];
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    }
  }

  async storeReport(reportId: string, ipfsCID: string, reportHash: string): Promise<boolean> {
    if (!this.isWeb3Available) {
      console.log('Blockchain storage skipped - Web3 not available');
      return false;
    }

    try {
      const signer = await this.provider!.getSigner();
      const contractWithSigner = this.contract!.connect(signer);
      
      const tx = await contractWithSigner.storeReport(reportId, ipfsCID, reportHash);
      await tx.wait();
      return true;
    } catch (error) {
      console.error('Error storing report on blockchain:', error);
      return false;
    }
  }

  async verifyReport(reportId: string, reportHash: string): Promise<boolean> {
    if (!this.isWeb3Available) {
      throw new Error('Please install MetaMask to verify reports');
    }

    try {
      const isValid = await this.contract!.verifyReport(reportId, reportHash);
      return isValid;
    } catch (error) {
      console.error('Error verifying report:', error);
      return false;
    }
  }
}

// Utility function to compute SHA-256 hash
export async function computeReportHash(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

// Upload file to IPFS using Pinata
export async function uploadToIPFS(file: File): Promise<string> {
  if (!PINATA_JWT) {
    throw new Error('Pinata JWT not found in environment variables');
  }

  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
      headers: {
        'Authorization': `Bearer ${PINATA_JWT}`,
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data.IpfsHash;
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw new Error('Failed to upload file to IPFS');
  }
} 