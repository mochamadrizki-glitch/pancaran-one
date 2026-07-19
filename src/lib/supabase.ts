import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sxkoalcbrkfzedgeexkh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4a29hbGNicmtmemVkZ2VleGtoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyMTczOTEsImV4cCI6MjA5Mzc5MzM5MX0.Ii-J97SKEUQpHE5ewaOnkBBelmQlpZmmpzb5-5_Sods';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type UserRole = 'admin' | 'hmt_manager' | 'ops' | 'finance';

export interface PortalUser {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  division?: string;
  is_active: boolean;
}