// API configuration
export const API_BASE_URL = "https://a0d2-2401-4900-8143-d5d-7161-66c2-58ce-c28.ngrok-free.app";

// API endpoints
export const API_ENDPOINTS = {
  AUDIO: `${API_BASE_URL}/audio`,
  REPORT: (reportPath: string) => `${API_BASE_URL}/report/${reportPath}`,
  REPORT_DOWNLOAD: (reportPath: string) => `${API_BASE_URL}/report/${reportPath}?download=true`,
  PLOT: (plotPath: string) => `${API_BASE_URL}/plot/${plotPath}`,
};

// Contract configuration
export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000";
export const CONTRACT_ABI = [
  "function getResources() view returns (tuple(string title, string description, string category, uint256 price, string fileUrl, address owner, bool isActive)[])",
  "function purchaseResource(string resourceId) payable",
  "function uploadResource(string title, string description, string category, uint256 price, string fileUrl)",
  "function checkResourceOwnership(string resourceId) view returns (bool)"
]; 