import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from './config';

export const getContract = async (signer: ethers.Signer) => {
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
};

export const getResources = async (signer: ethers.Signer) => {
  const contract = await getContract(signer);
  return await contract.getResources();
};

export const purchaseResource = async (signer: ethers.Signer, resourceId: string, price: string) => {
  const contract = await getContract(signer);
  const tx = await contract.purchaseResource(resourceId, { value: ethers.parseEther(price) });
  await tx.wait();
  return tx;
};

export const uploadResource = async (
  signer: ethers.Signer,
  title: string,
  description: string,
  category: string,
  price: string,
  fileUrl: string
) => {
  const contract = await getContract(signer);
  const tx = await contract.uploadResource(
    title,
    description,
    category,
    ethers.parseEther(price),
    fileUrl
  );
  await tx.wait();
  return tx;
};

export const checkResourceOwnership = async (signer: ethers.Signer, resourceId: string) => {
  const contract = await getContract(signer);
  return await contract.checkResourceOwnership(resourceId);
};

export const verifyContract = async (provider: ethers.Provider) => {
  try {
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
    
    // Check if contract exists
    const code = await provider.getCode(CONTRACT_ADDRESS);
    if (code === '0x') {
      return {
        exists: false,
        functionsExist: false,
        error: 'Contract does not exist at the specified address'
      };
    }
    
    // Check if required functions exist
    const requiredFunctions = ['getResources', 'purchaseResource', 'uploadResource', 'checkResourceOwnership'];
    const contractFunctions = Object.keys(contract.functions);
    
    const missingFunctions = requiredFunctions.filter(fn => !contractFunctions.includes(fn));
    if (missingFunctions.length > 0) {
      return {
        exists: true,
        functionsExist: false,
        error: `Contract is missing required functions: ${missingFunctions.join(', ')}`
      };
    }
    
    return {
      exists: true,
      functionsExist: true,
      error: null
    };
  } catch (error) {
    return {
      exists: false,
      functionsExist: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}; 