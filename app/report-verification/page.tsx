import { ReportVerification } from '@/components/ReportVerification';

export default function ReportVerificationPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Report Verification</h1>
      <p className="text-gray-600 mb-8">
        Store and verify your voice analysis reports using blockchain technology. 
        This ensures the authenticity and integrity of your reports.
      </p>
      <ReportVerification />
    </div>
  );
} 