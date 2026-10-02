import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { SchoolData, StudentApplication, EmailLog, FeeItem, SchoolTimings, GradeLevel } from '../types.ts';
import { INITIAL_SCHOOL_DATA, INITIAL_APPLICATIONS, INITIAL_EMAIL_LOGS } from '../data/initialData.ts';
import { apiClient } from '../services/apiClient.ts';

interface AdminUser {
  email: string;
  role: string;
  name: string;
}

interface SchoolContextType {
  schoolData: SchoolData;
  applications: StudentApplication[];
  emailLogs: EmailLog[];
  isLoading: boolean;
  adminUser: AdminUser | null;
  isAuthenticated: boolean;
  selectedGradeForApply: GradeLevel | null;
  setSelectedGradeForApply: (grade: GradeLevel | null) => void;
  registerStudent: (data: Omit<StudentApplication, 'id' | 'applicationNumber' | 'status' | 'submittedAt' | 'updatedAt'>) => Promise<{ success: boolean; application: StudentApplication; message: string }>;
  updateApplicationStatus: (id: string, status: StudentApplication['status'], reason?: string, interviewDate?: string) => Promise<boolean>;
  removeApplication: (id: string) => Promise<boolean>;
  updateFees: (fees: FeeItem[]) => Promise<boolean>;
  updateTimings: (timings: SchoolTimings) => Promise<boolean>;
  requestOtp: (email: string) => Promise<{ success: boolean; message: string; demoOtp?: string }>;
  loginWithOtp: (email: string, otp: string) => Promise<{ success: boolean; error?: string }>;
  loginWithPassword: (password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  refreshData: () => Promise<void>;
  resetToDemo: () => Promise<void>;
}

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

export const SchoolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [schoolData, setSchoolData] = useState<SchoolData>(INITIAL_SCHOOL_DATA);
  const [applications, setApplications] = useState<StudentApplication[]>(INITIAL_APPLICATIONS);
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>(INITIAL_EMAIL_LOGS);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    try {
      const stored = localStorage.getItem('oga_admin_session_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [selectedGradeForApply, setSelectedGradeForApply] = useState<GradeLevel | null>(null);

  const refreshData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [fetchedSchool, fetchedApps, fetchedLogs] = await Promise.all([
        apiClient.getSchoolData(),
        apiClient.getApplications(),
        apiClient.getOutboxLogs(),
      ]);

      if (fetchedSchool) setSchoolData(fetchedSchool);
      if (fetchedApps) setApplications(fetchedApps);
      if (fetchedLogs) setEmailLogs(fetchedLogs);
    } catch (e) {
      console.warn('Context refresh encountered an error:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Register student
  const registerStudent = async (data: Omit<StudentApplication, 'id' | 'applicationNumber' | 'status' | 'submittedAt' | 'updatedAt'>) => {
    const res = await apiClient.registerStudent(data);
    if (res.success && res.application) {
      setApplications((prev) => [res.application, ...prev.filter((a) => a.id !== res.application.id)]);
      // Refresh outbox logs in background
      apiClient.getOutboxLogs().then((logs) => {
        if (logs) setEmailLogs(logs);
      });
    }
    return res;
  };

  // Update application status (Approve, Cancel/Reject, Interview)
  const updateApplicationStatus = async (
    id: string,
    status: StudentApplication['status'],
    reason?: string,
    interviewDate?: string
  ): Promise<boolean> => {
    try {
      // Optimistic update
      setApplications((prev) =>
        prev.map((app) =>
          app.id === id || app.applicationNumber === id
            ? {
                ...app,
                status,
                rejectionReason: reason || app.rejectionReason,
                interviewDate: interviewDate || app.interviewDate,
                updatedAt: new Date().toISOString(),
              }
            : app
        )
      );

      const res = await apiClient.updateApplicationStatus(id, status, reason, interviewDate);
      if (res.success) {
        // Refresh logs
        const logs = await apiClient.getOutboxLogs();
        if (logs) setEmailLogs(logs);
        return true;
      }
      return false;
    } catch (e) {
      console.error('Failed to update status:', e);
      return false;
    }
  };

  // Remove application record
  const removeApplication = async (id: string): Promise<boolean> => {
    try {
      setApplications((prev) => prev.filter((a) => a.id !== id && a.applicationNumber !== id));
      await apiClient.removeApplication(id);
      return true;
    } catch (e) {
      console.error('Failed to remove application:', e);
      return false;
    }
  };

  // Update Fees
  const updateFees = async (fees: FeeItem[]): Promise<boolean> => {
    try {
      setSchoolData((prev) => ({ ...prev, fees }));
      const updated = await apiClient.updateFees(fees);
      if (updated) {
        setSchoolData((prev) => ({ ...prev, fees: updated }));
        return true;
      }
      return false;
    } catch (e) {
      console.error('Failed to update fees:', e);
      return false;
    }
  };

  // Update Timings
  const updateTimings = async (timings: SchoolTimings): Promise<boolean> => {
    try {
      setSchoolData((prev) => ({ ...prev, timings }));
      const updated = await apiClient.updateTimings(timings);
      if (updated) {
        setSchoolData((prev) => ({ ...prev, timings: updated }));
        return true;
      }
      return false;
    } catch (e) {
      console.error('Failed to update timings:', e);
      return false;
    }
  };

  // Admin Auth: Request OTP
  const requestOtp = async (email: string) => {
    return await apiClient.requestOtp(email);
  };

  // Admin Auth: Verify OTP
  const loginWithOtp = async (email: string, otp: string) => {
    try {
      const res = await apiClient.verifyOtp(email, otp);
      if (res.success && res.admin) {
        setAdminUser(res.admin);
        localStorage.setItem('oga_admin_session_user', JSON.stringify(res.admin));
        return { success: true };
      }
      return { success: false, error: 'Verification failed' };
    } catch (e: any) {
      return { success: false, error: e.message || 'Invalid OTP code' };
    }
  };

  // Admin Auth: Direct Password Verification
  const loginWithPassword = async (password: string) => {
    try {
      const res = await apiClient.verifyPassword(password);
      if (res.success && res.admin) {
        setAdminUser(res.admin);
        localStorage.setItem('nsic_admin_session_user', JSON.stringify(res.admin));
        return { success: true };
      }
      return { success: false, error: 'Verification failed' };
    } catch (e: any) {
      return { success: false, error: e.message || 'Incorrect Admin Security Password' };
    }
  };

  const logout = () => {
    setAdminUser(null);
    localStorage.removeItem('nsic_admin_session_user');
    localStorage.removeItem('oga_admin_session_user');
    localStorage.removeItem('oga_admin_token_v1');
    localStorage.removeItem('nsic_admin_token_v1');
  };

  const resetToDemo = async () => {
    await apiClient.resetDemo();
    await refreshData();
  };

  return (
    <SchoolContext.Provider
      value={{
        schoolData,
        applications,
        emailLogs,
        isLoading,
        adminUser,
        isAuthenticated: !!adminUser,
        selectedGradeForApply,
        setSelectedGradeForApply,
        registerStudent,
        updateApplicationStatus,
        removeApplication,
        updateFees,
        updateTimings,
        requestOtp,
        loginWithOtp,
        loginWithPassword,
        logout,
        refreshData,
        resetToDemo,
      }}
    >
      {children}
    </SchoolContext.Provider>
  );
};

export const useSchool = () => {
  const context = useContext(SchoolContext);
  if (!context) {
    throw new Error('useSchool must be used within a SchoolProvider');
  }
  return context;
};
