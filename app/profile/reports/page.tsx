"use client"

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { getUserReports } from '@/lib/reportService';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Download, Eye } from 'lucide-react';
import { Layout } from '@/components/layout';
import { ProtectedRoute } from '@/components/protected-route';
import { API_ENDPOINTS } from '@/lib/config';

interface Report {
  id: string;
  userId: string;
  reportPath: string;
  plotPath?: string;
  class: string;
  riskLevel?: string;
  prediction: string;
  createdAt?: string;
}

export default function UserReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const loadReports = async () => {
      try {
        if (!user) {
          throw new Error('User not authenticated');
        }

        const userReports = await getUserReports(user.id);
        setReports(userReports);
      } catch (error) {
        console.error('Error loading reports:', error);
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, [user]);

  const handleDownload = (reportPath: string) => {
    const url = `${API_ENDPOINTS.REPORTS}/${reportPath}?download=true`;
    window.open(url, '_blank');
  };

  const handleViewReport = (reportPath: string) => {
    const url = `${API_ENDPOINTS.REPORTS}/${reportPath}`;
    window.open(url, '_blank');
  };

  return (
    <Layout>
      <ProtectedRoute>
        <div className="container max-w-4xl mx-auto py-8">
          <h1 className="text-3xl font-bold mb-8">My Reports</h1>

          {loading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center py-12 bg-muted/10 rounded-lg">
              <p className="text-lg text-muted-foreground">
                No reports found. Generate your first voice analysis report to get started.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {reports.map((report) => (
                <Card key={report.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <h3 className="font-semibold text-lg">{report.class} - {report.riskLevel || 'Unknown'} Risk</h3>
                        <p className="text-sm text-muted-foreground">
                          {report.createdAt ? format(new Date(report.createdAt), 'PPP') : 'Date unknown'}
                        </p>
                        <p className="text-sm">{report.prediction}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewReport(report.reportPath)}
                          className="flex items-center gap-2"
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(report.reportPath)}
                          className="flex items-center gap-2"
                        >
                          <Download className="h-4 w-4" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </ProtectedRoute>
    </Layout>
  );
} 