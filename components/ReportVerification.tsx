"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BlockchainService, computeReportHash, uploadToIPFS } from '@/lib/blockchain';
import { v4 as uuidv4 } from 'uuid';

export function ReportVerification() {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const blockchainService = new BlockchainService();

  const connectWallet = async () => {
    try {
      await blockchainService.connectWallet();
      setIsConnected(true);
    } catch (error) {
      setResult({
        success: false,
        message: 'Failed to connect wallet. Please make sure you have MetaMask installed and are connected to EduChain Testnet.'
      });
    }
  };

  const handleStoreReport = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setResult(null);

    try {
      const formData = new FormData(event.currentTarget);
      const file = formData.get('report') as File;
      
      if (!file) {
        throw new Error('Please select a file');
      }

      // Generate report ID
      const reportId = uuidv4();
      
      // Compute hash
      const reportHash = await computeReportHash(file);
      
      // Upload to IPFS
      const ipfsCID = await uploadToIPFS(file);
      
      // Store on blockchain
      const success = await blockchainService.storeReport(reportId, ipfsCID, reportHash);
      
      if (success) {
        setResult({
          success: true,
          message: `Report stored successfully! Report ID: ${reportId}`
        });
      } else {
        throw new Error('Failed to store report on blockchain');
      }
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'An unknown error occurred'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyReport = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setResult(null);

    try {
      const formData = new FormData(event.currentTarget);
      const file = formData.get('report') as File;
      const reportId = formData.get('reportId') as string;
      
      if (!file || !reportId) {
        throw new Error('Please provide both report file and ID');
      }

      // Compute hash
      const reportHash = await computeReportHash(file);
      
      // Verify on blockchain
      const isValid = await blockchainService.verifyReport(reportId, reportHash);
      
      setResult({
        success: isValid,
        message: isValid 
          ? 'Report verification successful! The report is authentic.'
          : 'Report verification failed! The report may have been tampered with.'
      });
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'An unknown error occurred'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 p-4">
      {!isConnected && (
        <Button onClick={connectWallet} variant="outline">
          Connect Wallet
        </Button>
      )}

      {isConnected && (
        <>
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Store New Report</h2>
            <form onSubmit={handleStoreReport} className="space-y-4">
              <div>
                <Label htmlFor="store-report">Select Report File</Label>
                <Input
                  id="store-report"
                  name="report"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  disabled={isLoading}
                  required
                />
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Processing...' : 'Store Report'}
              </Button>
            </form>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Verify Existing Report</h2>
            <form onSubmit={handleVerifyReport} className="space-y-4">
              <div>
                <Label htmlFor="verify-report-id">Report ID</Label>
                <Input
                  id="verify-report-id"
                  name="reportId"
                  type="text"
                  placeholder="Enter the report ID"
                  disabled={isLoading}
                  required
                />
              </div>
              <div>
                <Label htmlFor="verify-report">Select Report File</Label>
                <Input
                  id="verify-report"
                  name="report"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  disabled={isLoading}
                  required
                />
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Verifying...' : 'Verify Report'}
              </Button>
            </form>
          </div>
        </>
      )}

      {result && (
        <Alert variant={result.success ? "default" : "destructive"}>
          <AlertTitle>{result.success ? 'Success' : 'Error'}</AlertTitle>
          <AlertDescription>{result.message}</AlertDescription>
        </Alert>
      )}
    </div>
  );
} 