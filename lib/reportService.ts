import { supabase } from './supabase';

export interface Report {
  id?: string;
  userId: string;
  reportPath: string;
  plotPath?: string;
  class: string;
  riskLevel?: string;
  prediction: string;
  createdAt?: string;
}

export const saveReport = async (report: Report) => {
  const { data, error } = await supabase
    .from('reports')
    .insert([{
      user_id: report.userId,
      report_path: report.reportPath,
      plot_path: report.plotPath,
      class: report.class,
      risk_level: report.riskLevel,
      prediction: report.prediction,
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getUserReports = async (userId: string) => {
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data.map(report => ({
    id: report.id,
    userId: report.user_id,
    reportPath: report.report_path,
    plotPath: report.plot_path,
    class: report.class,
    riskLevel: report.risk_level,
    prediction: report.prediction,
    createdAt: report.created_at,
  }));
};

export const deleteReport = async (reportId: string) => {
  const { error } = await supabase
    .from('reports')
    .delete()
    .eq('id', reportId);

  if (error) throw error;
};