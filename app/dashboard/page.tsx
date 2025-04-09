"use client"

import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout';
import { ProtectedRoute } from '@/components/protected-route';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Download, 
  Eye, 
  Mic, 
  BarChart, 
  Clock, 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  Activity,
  Dumbbell,
  CheckCircle,
  Award
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useExercises } from '@/lib/exercises-context';
import { API_ENDPOINTS } from '@/lib/config';
import { DashboardSidebar } from './dashboard-sidebar';

// Add TypeScript interface for the window object at the top of the file
declare global {
  interface Window {
    voiceflow?: {
      chat?: {
        load: (config: any) => void;
      };
    };
  }
}

interface AnalysisResult {
  id: string;
  date: string;
  prediction: string;
  riskLevel: string;
  reportPath: string;
  plotPath: string;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { 
    completedExercises,
    streak,
    todaysExercises,
    totalCompletedExercises,
    hasCompletedExerciseToday,
    completedExercisesPercentage 
  } = useExercises();
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisResult[]>([]);

  useEffect(() => {
    // Load analysis history from localStorage
    if (user) {
      const storedHistory = localStorage.getItem(`analysis_history_${user.uid}`);
      if (storedHistory) {
        setAnalysisHistory(JSON.parse(storedHistory));
      }
    }
  }, [user]);

  const viewReport = (reportPath: string) => {
    window.open(API_ENDPOINTS.REPORT(reportPath), '_blank');
  };

  const downloadReport = (reportPath: string) => {
    window.open(API_ENDPOINTS.REPORT_DOWNLOAD(reportPath), '_blank');
  };

  // Calculate statistics
  const totalAnalyses = analysisHistory.length;
  const healthyCount = analysisHistory.filter(item => item.prediction.includes('Healthy')).length;
  const issuesCount = totalAnalyses - healthyCount;
  const healthyPercentage = totalAnalyses > 0 ? Math.round((healthyCount / totalAnalyses) * 100) : 0;
  const issuesPercentage = totalAnalyses > 0 ? Math.round((issuesCount / totalAnalyses) * 100) : 0;
  
  // Generate mock data for charts
  const generateChartData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    
    return months.slice(currentMonth - 5, currentMonth + 1).map((month, index) => {
      const value = 70 + Math.floor(Math.random() * 20);
      return { month, value };
    });
  };
  
  const chartData = generateChartData();
  const maxChartValue = Math.max(...chartData.map(d => d.value));
  
  // Generate risk distribution data
  const riskDistribution = {
    low: Math.max(healthyCount, 1),
    medium: Math.floor(issuesCount * 0.7),
    high: Math.floor(issuesCount * 0.3)
  };
  const totalRisk = riskDistribution.low + riskDistribution.medium + riskDistribution.high;
  
  // Get recent completed exercises (last 5)
  const recentExercises = completedExercises
    .sort((a, b) => b.completedAt - a.completedAt)
    .slice(0, 5);
  
  // Format date for display
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <ProtectedRoute>
      <Layout>
        {/* Add gradient background and grid pattern */}
        <div className="relative min-h-screen bg-gradient-to-b from-white via-indigo-50/30 to-white dark:from-gray-950 dark:via-indigo-950/5 dark:to-gray-950">
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] mix-blend-soft-light"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          
          <div className="container py-12 relative z-10 flex flex-col md:flex-row gap-6">
            <DashboardSidebar />
            
            <div className="flex-1 space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                  <p className="text-gray-500 dark:text-gray-400">Monitor your vocal health progress</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button asChild className="bg-gradient-to-r from-indigo-600 to-indigo-800 hover:from-indigo-700 hover:to-indigo-900 text-white shadow-lg shadow-indigo-500/25">
                    <Link href="/analysis">New Analysis</Link>
                  </Button>
                  <Link 
                    href="/dashboard/exercises" 
                    className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-4 py-2 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors shadow-sm"
                  >
                    <Award className="h-5 w-5" />
                    <span className="font-medium">Streak: {streak.currentStreak} day{streak.currentStreak !== 1 ? 's' : ''}</span>
                  </Link>
                </div>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-indigo-100/50 dark:border-indigo-800/30 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Analyses</CardTitle>
                    <BarChart className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{totalAnalyses}</div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Lifetime voice analyses
                    </p>
                    <div className="mt-3 h-1 w-full bg-indigo-100 dark:bg-indigo-900/50 rounded-full overflow-hidden">
                      <div 
                        className="h-1 bg-gradient-to-r from-indigo-600 to-indigo-500" 
                        style={{ width: `${totalAnalyses ? 100 : 0}%` }}
                      />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-indigo-100/50 dark:border-indigo-800/30 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Exercise Progress</CardTitle>
                    <Dumbbell className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {totalCompletedExercises}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Total exercises completed
                    </p>
                    <div className="mt-3 h-1 w-full bg-indigo-100 dark:bg-indigo-900/50 rounded-full overflow-hidden">
                      <div 
                        className="h-1 bg-gradient-to-r from-indigo-600 to-indigo-500" 
                        style={{ width: `${completedExercisesPercentage}%` }}
                      />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-indigo-100/50 dark:border-indigo-800/30 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Daily Status</CardTitle>
                    <div className={`h-4 w-4 rounded-full ${hasCompletedExerciseToday ? 'bg-indigo-600 dark:bg-indigo-400' : 'bg-indigo-200 dark:bg-indigo-800'}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{todaysExercises.length}</div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Exercises completed today
                    </p>
                    <div className="mt-3 h-1 w-full bg-indigo-100 dark:bg-indigo-900/50 rounded-full overflow-hidden">
                      <div 
                        className="h-1 bg-gradient-to-r from-indigo-600 to-indigo-500" 
                        style={{ width: `${Math.min(100, (todaysExercises.length / 4) * 100)}%` }}
                      />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-indigo-100/50 dark:border-indigo-800/30 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Vocal Health Score</CardTitle>
                    <Activity className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">{healthyPercentage}</div>
                      <div className="ml-1 text-xs text-gray-500 dark:text-gray-400">/100</div>
                      {healthyPercentage > 50 ? (
                        <div className="ml-auto flex items-center text-indigo-600 dark:text-indigo-400 text-xs">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Good
                        </div>
                      ) : (
                        <div className="ml-auto flex items-center text-indigo-400 dark:text-indigo-500 text-xs">
                          <TrendingDown className="h-3 w-3 mr-1" />
                          Needs Attention
                        </div>
                      )}
                    </div>
                    <div className="mt-3 h-1 w-full bg-indigo-100 dark:bg-indigo-900/50 rounded-full overflow-hidden">
                      <div 
                        className={`h-1 bg-gradient-to-r from-indigo-600 to-indigo-500`}
                        style={{ width: `${healthyPercentage}%` }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-indigo-100/50 dark:border-indigo-800/30 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-gray-900 dark:text-white">Vocal Health Trend</CardTitle>
                    <CardDescription className="text-gray-500 dark:text-gray-400">Your vocal health score over the past 6 months</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px] flex items-end justify-between gap-2">
                      {chartData.map((data, i) => (
                        <div key={i} className="relative flex flex-col items-center">
                          <div className="absolute -top-6 text-xs font-medium text-gray-600 dark:text-gray-300">{data.value}</div>
                          <div 
                            className="w-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-t-md relative group hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
                            style={{ height: `${(data.value / maxChartValue) * 180}px` }}
                          >
                            <div 
                              className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-indigo-600 to-indigo-500 rounded-t-md transition-all"
                              style={{ height: `${(data.value / 100) * 100}%` }}
                            />
                          </div>
                          <div className="mt-2 text-xs font-medium text-gray-500 dark:text-gray-400">{data.month}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-indigo-100/50 dark:border-indigo-800/30 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-gray-900 dark:text-white">Recent Activity</CardTitle>
                    <CardDescription className="text-gray-500 dark:text-gray-400">Your latest completed exercises</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentExercises.map((exercise, i) => (
                        <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-900/20">
                          <div className="h-10 w-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                            <CheckCircle className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{exercise.title}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{formatDate(exercise.completedAt)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  )
} 