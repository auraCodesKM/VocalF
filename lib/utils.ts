import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getIPFSUrl(ipfsCID: string): string {
  return `https://gateway.pinata.cloud/ipfs/${ipfsCID}`;
}
