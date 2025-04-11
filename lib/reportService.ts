import { db } from './firebase';
import { collection, addDoc, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { getIPFSUrl } from './utils';

interface Report {
  id: string;
  userId: string;
  reportName: string;
  timestamp: Date;
  ipfsCID: string;
}

export class ReportService {
  private readonly PINATA_JWT = process.env.NEXT_PUBLIC_PINATA_JWT;
  private readonly PINATA_API_URL = 'https://api.pinata.cloud/pinning/pinFileToIPFS';

  async uploadToIPFS(file: File): Promise<string> {
    if (!this.PINATA_JWT) {
      throw new Error('Pinata JWT not configured');
    }

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(this.PINATA_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.PINATA_JWT}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload to IPFS');
    }

    const result = await response.json();
    return result.IpfsHash;
  }

  async storeReport(userId: string, file: File, reportName: string): Promise<Report> {
    try {
      // Upload to IPFS
      const ipfsCID = await this.uploadToIPFS(file);

      // Store in Firebase
      const reportData = {
        userId,
        reportName,
        timestamp: Timestamp.now(),
        ipfsCID,
      };

      const docRef = await addDoc(collection(db, 'reports'), reportData);

      return {
        id: docRef.id,
        userId,
        reportName,
        timestamp: reportData.timestamp.toDate(),
        ipfsCID,
      };
    } catch (error) {
      console.error('Error storing report:', error);
      throw error;
    }
  }

  async getUserReports(userId: string): Promise<Report[]> {
    try {
      const reportsRef = collection(db, 'reports');
      const q = query(reportsRef, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        userId: doc.data().userId,
        reportName: doc.data().reportName,
        timestamp: doc.data().timestamp.toDate(),
        ipfsCID: doc.data().ipfsCID,
      }));
    } catch (error) {
      console.error('Error getting user reports:', error);
      throw error;
    }
  }

  getIPFSUrl(ipfsCID: string): string {
    return getIPFSUrl(ipfsCID);
  }
} 