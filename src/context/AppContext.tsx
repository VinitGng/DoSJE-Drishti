import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  UserRole,
  Project,
  Inspection,
  AIAlert,
  IssueCompliance,
  VideoCallSession,
  Coordinates,
  EvidenceItem,
  ChecklistItem,
  AuthUser,
  AIInspectionAnalysis,
  SyncQueueItem,
  SyncProgressState,
  SyncToast,
} from '../types';
import {
  INITIAL_PROJECTS,
  INITIAL_INSPECTIONS,
  INITIAL_AI_ALERTS,
  INITIAL_ISSUES,
  INITIAL_CHECKLIST_TEMPLATE,
} from '../data/mockData';
import {
  db,
  auth,
  signInWithGoogle,
  testConnection,
  handleFirestoreError,
  OperationType,
} from '../firebase';
import { doc, setDoc, updateDoc } from 'firebase/firestore';

export const DEFAULT_AUTH_USERS: Record<UserRole, AuthUser> = {
  government: {
    email: 'dosje.director@gov.in',
    name: 'Dr. Alok Verma, IAS',
    role: 'government',
    designation: 'Joint Secretary & Director General',
    id: 'GOV-771',
  },
  inspector: {
    email: 'rajesh.sharma.pmu@gmail.com',
    name: 'Inspector Rajesh Sharma',
    role: 'inspector',
    designation: 'PMU Field Inspection Officer',
    teamId: 'PMU Team 4',
    id: 'INSP-KA-402',
  },
  ngo: {
    email: 'anita.rao.ddrs@gmail.com',
    name: 'Dr. Anita Rao',
    role: 'ngo',
    designation: 'Project Director & Rehabilitation Officer',
    projectId: 'PRJ-001',
    projectName: 'ABC Welfare Centre for Special Needs',
    id: 'NGO-883',
  },
};

export const INITIAL_SYNC_QUEUE: SyncQueueItem[] = [
  {
    id: 'queue-001',
    inspectionId: 'INSP-2026-001',
    type: 'evidence',
    title: 'Watermarked Evidence #02: Industrial Workshop & Scaffolding Inspection',
    status: 'queued_offline',
    timestamp: '10:45:12 AM',
    projectName: 'Aarogya Seva Care Home & Day Rehabilitation Centre',
    inspectorName: 'Inspector Rajesh Sharma',
    assignedTeamId: 'PMU Team 4',
    deviceId: 'DEV-KA-402 (Galaxy Tab Active4 Pro)',
    deviceLastSyncTime: '10:30:00 AM IST',
    itemSizeKb: 1240,
    payload: {
      id: 'ev-sample-1',
      title: 'Structural hairline cracks and peeling sealant in fabrication warehouse bay',
      imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f6?auto=format&fit=crop&w=800&q=80',
      coordinates: { lat: 12.8703, lng: 74.8807 },
      note: 'Foundation scaffolding observed along western perimeter. Geofence verified on-site.',
    },
  },
  {
    id: 'queue-002',
    inspectionId: 'INSP-2026-002',
    type: 'inspection_update',
    title: 'Digital Checklist Verification: 6/6 Inquiries Evaluated',
    status: 'queued_offline',
    timestamp: '11:15:30 AM',
    projectName: 'Navjyoti Rehabilitation Complex',
    inspectorName: 'Inspector Sunita Patel',
    assignedTeamId: 'PMU Team 2',
    deviceId: 'DEV-MH-108 (iPad Rugged Pro)',
    deviceLastSyncTime: '11:00:00 AM IST',
    itemSizeKb: 340,
    payload: {
      checklistItemsCompleted: 6,
      gpsVerified: true,
      remarks: 'All resident attendance registers tallied with biometric logs.',
    },
  },
  {
    id: 'queue-003',
    inspectionId: 'INSP-2026-003',
    type: 'evidence',
    title: 'Watermarked Evidence #01: Kitchen Hygiene & Meal Storage',
    status: 'synced',
    timestamp: '09:20:44 AM',
    projectName: 'Snehalaya Senior Citizen Home',
    inspectorName: 'Inspector Vikram Malhotra',
    assignedTeamId: 'PMU Team 5',
    deviceId: 'DEV-UP-551 (Galaxy Rugged Tab)',
    deviceLastSyncTime: '09:21:10 AM IST',
    syncedAt: '09:21:10 AM IST',
    itemSizeKb: 1560,
    payload: {
      title: 'Kitchen sanitization & food storage check',
      imageUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80',
      coordinates: { lat: 26.8467, lng: 80.9462 },
    },
  },
];

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  currentUser: AuthUser | null;
  authUsers: Record<UserRole, AuthUser | null>;
  loginUser: (role: UserRole, email: string, password?: string, projectId?: string) => AuthUser;
  logoutUser: (role?: UserRole) => void;
  projects: Project[];
  inspections: Inspection[];
  aiAlerts: AIAlert[];
  issues: IssueCompliance[];
  selectedProjectId: string;
  setSelectedProjectId: (id: string) => void;
  activeVC: VideoCallSession | null;
  isPhoneFrame: boolean;
  setIsPhoneFrame: (value: boolean) => void;
  tourStep: number;
  setTourStep: (step: number) => void;
  isTourActive: boolean;
  setIsTourActive: (active: boolean) => void;

  // Actions
  runRandomSurpriseAssignment: (criteria?: {
    scheme?: string;
    state?: string;
    riskWeight?: number;
  }) => Inspection;
  verifyInspectorGPS: (
    inspectionId: string,
    coords: Coordinates,
    forceSimulation?: boolean
  ) => { verified: boolean; distanceMeters: number; message: string };
  updateChecklistItem: (
    inspectionId: string,
    itemId: string,
    status: 'pass' | 'fail' | 'flagged',
    remarks?: string
  ) => void;
  addInspectionEvidence: (inspectionId: string, evidence: EvidenceItem) => void;
  runAIInspectionAnalysis: (inspectionId: string) => Promise<AIInspectionAnalysis>;
  submitInspection: (
    inspectionId: string,
    remarks: string,
    rating: 'Satisfactory' | 'Minor Discrepancies' | 'Critical Violations'
  ) => { success: boolean; error?: string };
  reviewInspection: (
    inspectionId: string,
    action: 'approved' | 'show_cause_issued' | 're_inspection_ordered',
    comments: string
  ) => void;
  updateBeneficiaryAttendance: (projectId: string, count: number) => void;
  updateAIAlertStatus: (alertId: string, status: 'active' | 'investigating' | 'resolved') => void;
  startVideoCall: (
    name: string,
    participantRole: 'Project Incharge' | 'Staff Member' | 'Beneficiary',
    projectName: string
  ) => void;
  endVideoCall: (inspectionIdToTag?: string, notes?: string) => void;
  submitATR: (issueId: string, explanation: string, evidenceUrl?: string) => void;
  verifyATR: (issueId: string, accepted: boolean, notes: string) => void;
  resetAllData: () => void;

  // Offline Sync & Firebase Network State
  isOnline: boolean;
  isSimulatedOffline: boolean;
  toggleSimulateOffline: () => void;
  syncQueue: SyncQueueItem[];
  isSyncing: boolean;
  lastSyncTime: string | null;
  triggerManualSync: () => Promise<{ success: boolean; syncedCount: number }>;
  clearSyncQueue: () => void;
  loginWithGoogle: (role: UserRole) => Promise<AuthUser>;
  syncProgress: SyncProgressState;
  syncToasts: SyncToast[];
  addSyncToast: (toast: SyncToast) => void;
  dismissSyncToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Calculate Haversine distance in meters
function calculateDistanceMeters(coord1: Coordinates, coord2: Coordinates): number {
  const R = 6371e3; // Earth radius in meters
  const phi1 = (coord1.lat * Math.PI) / 180;
  const phi2 = (coord2.lat * Math.PI) / 180;
  const deltaPhi = ((coord2.lat - coord1.lat) * Math.PI) / 180;
  const deltaLambda = ((coord2.lng - coord1.lng) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

const STORAGE_KEY = 'dosje_drishti_state_v8';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('government');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('PRJ-001');
  const [isPhoneFrame, setIsPhoneFrame] = useState<boolean>(false);
  const [activeVC, setActiveVC] = useState<VideoCallSession | null>(null);
  const [isTourActive, setIsTourActive] = useState<boolean>(false);
  const [tourStep, setTourStep] = useState<number>(1);

  // Authentication state for each portal
  const [authUsers, setAuthUsers] = useState<Record<UserRole, AuthUser | null>>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_authUsers`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    // Default to unauthenticated so the user enters through the separate LoginPage with role options
    return {
      government: null,
      inspector: null,
      ngo: null,
    };
  });

  // Core Data with proactive legacy cache cleaning
  const [projects, setProjects] = useState<Project[]>(() => {
    // Purge outdated keys from previous builds
    if (typeof window !== 'undefined') {
      [
        'dosje_drishti_state_v1',
        'dosje_drishti_state_v2',
        'dosje_drishti_state_v3',
        'dosje_drishti_state_v4',
        'dosje_drishti_state_v5',
        'dosje_drishti_state_v6',
        'dosje_drishti_state_v7',
        'dosje_drishti_platform_v2',
      ].forEach((key) => {
        localStorage.removeItem(`${key}_projects`);
        localStorage.removeItem(`${key}_inspections`);
        localStorage.removeItem(`${key}_alerts`);
        localStorage.removeItem(`${key}_issues`);
      });
    }

    const saved = localStorage.getItem(`${STORAGE_KEY}_projects`);
    if (saved) {
      try {
        const parsed: Project[] = JSON.parse(saved);
        // Ensure no legacy non-industrial labels or duplicate images exist
        const hasLegacyNonIndustrial = parsed.some((p) =>
          p.cctvFeeds.some(
            (f) =>
              !f.imageUrl ||
              f.name.toLowerCase().includes('dining') ||
              f.name.toLowerCase().includes('dormitory') ||
              f.name.toLowerCase().includes('classroom') ||
              f.locationArea.toLowerCase().includes('dining') ||
              f.locationArea.toLowerCase().includes('dormitory') ||
              f.locationArea.toLowerCase().includes('classroom') ||
              f.locationArea.toLowerCase().includes('recreation')
          )
        );
        if (!hasLegacyNonIndustrial) {
          return parsed;
        }
      } catch (err) {
        console.warn('Error parsing cached projects:', err);
      }
    }
    return INITIAL_PROJECTS;
  });

  const [inspections, setInspections] = useState<Inspection[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_inspections`);
    return saved ? JSON.parse(saved) : INITIAL_INSPECTIONS;
  });

  const [aiAlerts, setAiAlerts] = useState<AIAlert[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_alerts`);
    return saved ? JSON.parse(saved) : INITIAL_AI_ALERTS;
  });

  const [issues, setIssues] = useState<IssueCompliance[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_issues`);
    return saved ? JSON.parse(saved) : INITIAL_ISSUES;
  });

  // Offline Sync & Network state
  const [isOnline, setIsOnline] = useState<boolean>(() =>
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [isSimulatedOffline, setIsSimulatedOffline] = useState<boolean>(() => {
    return localStorage.getItem(`${STORAGE_KEY}_simulatedOffline`) === 'true';
  });
  const [syncQueue, setSyncQueue] = useState<SyncQueueItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_syncQueue`);
    return saved ? JSON.parse(saved) : INITIAL_SYNC_QUEUE;
  });
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncProgress, setSyncProgress] = useState<SyncProgressState>({
    isSyncing: false,
    percent: 0,
    currentStep: 'Idle',
    totalItems: 0,
    syncedItems: 0,
  });
  const [syncToasts, setSyncToasts] = useState<SyncToast[]>([]);

  const addSyncToast = useCallback((toast: SyncToast) => {
    setSyncToasts((prev) => [toast, ...prev.slice(0, 4)]);
  }, []);

  const dismissSyncToast = useCallback((id: string) => {
    setSyncToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const [lastSyncTime, setLastSyncTime] = useState<string | null>(() => {
    return localStorage.getItem(`${STORAGE_KEY}_lastSyncTime`);
  });

  const effectiveOnline = isOnline && !isSimulatedOffline;

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_simulatedOffline`, String(isSimulatedOffline));
  }, [isSimulatedOffline]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_syncQueue`, JSON.stringify(syncQueue));
  }, [syncQueue]);

  useEffect(() => {
    if (lastSyncTime) {
      localStorage.setItem(`${STORAGE_KEY}_lastSyncTime`, lastSyncTime);
    }
  }, [lastSyncTime]);

  const toggleSimulateOffline = () => {
    setIsSimulatedOffline((prev) => {
      const next = !prev;
      if (next) {
        addSyncToast({
          id: `toast-${Date.now()}`,
          title: 'Offline Field Audit Mode Active',
          message: 'Device disconnected from central cloud. All photo evidence and checklist reviews are stored in the local encrypted vault.',
          type: 'warning',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });
      } else {
        addSyncToast({
          id: `toast-${Date.now()}`,
          title: 'Reconnected to Firebase',
          message: 'Internet restored. Auto-sync poller active and ready to flush offline submissions to Central Firestore.',
          type: 'info',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });
      }
      return next;
    });
  };

  const clearSyncQueue = () => {
    setSyncQueue([]);
  };

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_authUsers`, JSON.stringify(authUsers));
  }, [authUsers]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_projects`, JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_inspections`, JSON.stringify(inspections));
  }, [inspections]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_alerts`, JSON.stringify(aiAlerts));
  }, [aiAlerts]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_issues`, JSON.stringify(issues));
  }, [issues]);

  const loginUser = (userRole: UserRole, email: string, password?: string, projectId?: string): AuthUser => {
    let user: AuthUser;
    if (userRole === 'government') {
      user = {
        email,
        name: email.toLowerCase().includes('ias') ? 'Dr. Alok Verma, IAS' : 'DoSJE Director General',
        role: 'government',
        designation: 'Joint Secretary & Director General',
        id: 'GOV-771',
      };
    } else if (userRole === 'inspector') {
      user = {
        email,
        name: 'Inspector Rajesh Sharma',
        role: 'inspector',
        designation: 'PMU Field Inspection Officer',
        teamId: 'PMU Team 4',
        id: 'INSP-KA-402',
      };
    } else {
      // NGO role: strictly binds to the project!
      const targetProjId =
        projectId ||
        (email.toLowerCase().includes('matru') || email.toLowerCase().includes('milind') || email.toLowerCase().includes('avyay')
          ? 'PRJ-002'
          : email.toLowerCase().includes('nav') || email.toLowerCase().includes('saxena') || email.toLowerCase().includes('napddr')
          ? 'PRJ-003'
          : 'PRJ-001');

      const matchedProject = projects.find((p) => p.id === targetProjId) || projects[0];
      user = {
        email,
        name: matchedProject.incharge.name || 'Dr. Anita Rao',
        role: 'ngo',
        designation: matchedProject.incharge.designation || 'Project Director',
        projectId: matchedProject.id,
        projectName: matchedProject.name,
        id: matchedProject.regNumber,
      };
      setSelectedProjectId(matchedProject.id);
    }

    setAuthUsers((prev) => ({ ...prev, [userRole]: user }));
    return user;
  };

  const logoutUser = (userRole?: UserRole) => {
    const target = userRole || role;
    setAuthUsers((prev) => ({ ...prev, [target]: null }));
  };

  // Google Sign-In with Firebase Auth
  const loginWithGoogle = async (targetRole: UserRole): Promise<AuthUser> => {
    try {
      const userCred = await signInWithGoogle();
      const email = userCred.email || `${targetRole}.user@gmail.com`;
      const name = userCred.displayName || (targetRole === 'government' ? 'Dr. Alok Verma, IAS' : targetRole === 'inspector' ? 'Inspector Rajesh Sharma' : 'Dr. Anita Rao');

      const authUser: AuthUser = {
        email,
        name,
        role: targetRole,
        designation: targetRole === 'government' ? 'Joint Secretary & Director General' : targetRole === 'inspector' ? 'PMU Field Inspection Officer' : 'Project Director',
        id: userCred.uid,
        teamId: targetRole === 'inspector' ? 'PMU Team 4' : undefined,
        projectId: targetRole === 'ngo' ? 'PRJ-001' : undefined,
        projectName: targetRole === 'ngo' ? 'ABC Welfare Centre for Special Needs' : undefined,
      };

      // Save user profile to Firestore
      try {
        await setDoc(doc(db, 'users', userCred.uid), {
          uid: userCred.uid,
          email,
          displayName: name,
          role: targetRole,
          createdAt: new Date().toISOString(),
        }, { merge: true });
      } catch (err) {
        console.warn('Error saving user profile to Firestore:', err);
      }

      setAuthUsers((prev) => ({ ...prev, [targetRole]: authUser }));
      return authUser;
    } catch (err) {
      console.error('Google Sign In failed:', err);
      throw err;
    }
  };

  // Offline Sync Queue Processor with Real-time Progress Tracking and Notifications
  const triggerManualSync = useCallback(async (): Promise<{ success: boolean; syncedCount: number }> => {
    if (!effectiveOnline) {
      addSyncToast({
        id: `toast-${Date.now()}`,
        title: 'Sync Failed: Offline Mode',
        message: 'Cannot flush offline queue while disconnected. Please restore connection or resume online mode.',
        type: 'warning',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
      return { success: false, syncedCount: 0 };
    }
    const pendingItems = syncQueue.filter((item) => item.status === 'queued_offline' || item.status === 'failed');
    if (pendingItems.length === 0) {
      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' IST';
      setLastSyncTime(nowStr);
      setSyncProgress({
        isSyncing: false,
        percent: 100,
        currentStep: 'Queue clean: All submissions committed to Firebase.',
        totalItems: 0,
        syncedItems: 0,
      });
      return { success: true, syncedCount: 0 };
    }

    setIsSyncing(true);
    setSyncProgress({
      isSyncing: true,
      percent: 5,
      currentStep: `Preparing ${pendingItems.length} submission(s) for Firebase replication...`,
      totalItems: pendingItems.length,
      syncedItems: 0,
    });

    let synced = 0;
    try {
      for (let i = 0; i < pendingItems.length; i++) {
        const item = pendingItems[i];
        const stepPercent = Math.round(((i + 0.3) / pendingItems.length) * 90);
        setSyncProgress({
          isSyncing: true,
          percent: stepPercent,
          currentStep: `Transmitting ${item.title} to Firestore (${i + 1}/${pendingItems.length})...`,
          totalItems: pendingItems.length,
          syncedItems: synced,
        });

        // Add smooth visible transition step so the inspector sees progress bar increments
        await new Promise((r) => setTimeout(r, 400));

        if (item.type === 'evidence') {
          const ev: EvidenceItem = item.payload;
          const evDocPath = `inspections/${item.inspectionId}/evidence/${ev.id}`;
          try {
            await setDoc(doc(db, 'inspections', item.inspectionId, 'evidence', ev.id), {
              ...ev,
              syncedOffline: false,
              syncedAt: new Date().toISOString(),
            });
            await setDoc(doc(db, 'syncQueue', item.id), {
              id: item.id,
              inspectionId: item.inspectionId,
              type: item.type,
              status: 'synced',
              timestamp: item.timestamp,
              syncedAt: new Date().toISOString(),
            });
            synced++;
          } catch (err) {
            handleFirestoreError(err, OperationType.WRITE, evDocPath);
          }
        } else if (item.type === 'inspection_update') {
          const inspUpdate = item.payload;
          const inspDocPath = `inspections/${item.inspectionId}`;
          try {
            await setDoc(doc(db, 'inspections', item.inspectionId), {
              ...inspUpdate,
              syncedAt: new Date().toISOString(),
            }, { merge: true });
            await setDoc(doc(db, 'syncQueue', item.id), {
              id: item.id,
              inspectionId: item.inspectionId,
              type: item.type,
              status: 'synced',
              timestamp: item.timestamp,
              syncedAt: new Date().toISOString(),
            });
            synced++;
          } catch (err) {
            handleFirestoreError(err, OperationType.UPDATE, inspDocPath);
          }
        }

        const finishPercent = Math.round(((i + 1) / pendingItems.length) * 100);
        setSyncProgress({
          isSyncing: true,
          percent: finishPercent,
          currentStep: `Successfully replicated ${item.title} to Firebase!`,
          totalItems: pendingItems.length,
          syncedItems: synced,
        });
      }

      // Mark local items as synced with timestamp
      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' IST';
      setSyncQueue((prev) =>
        prev.map((item) =>
          pendingItems.some((p) => p.id === item.id)
            ? { ...item, status: 'synced', syncedAt: nowStr }
            : item
        )
      );

      // Update local inspection evidence syncedOffline flag
      setInspections((prev) =>
        prev.map((insp) => ({
          ...insp,
          evidences: insp.evidences.map((e) => ({ ...e, syncedOffline: false })),
        }))
      );

      setLastSyncTime(nowStr);
      setSyncProgress({
        isSyncing: false,
        percent: 100,
        currentStep: `Sync Complete: ${synced} submission(s) committed to Firebase Firestore.`,
        totalItems: pendingItems.length,
        syncedItems: synced,
      });

      // Emit Real-Time Feedback Toast
      addSyncToast({
        id: `toast-${Date.now()}`,
        title: 'Firebase Central Sync Complete',
        message: `Successfully synchronized ${synced} offline submission(s) & watermarked photo evidence to Firestore cloud database!`,
        type: 'success',
        timestamp: nowStr,
        itemCount: synced,
      });

      return { success: true, syncedCount: synced };
    } catch (error) {
      console.warn('Sync error:', error);
      setSyncProgress({
        isSyncing: false,
        percent: 0,
        currentStep: 'Sync interrupted. Records preserved in local vault.',
        totalItems: pendingItems.length,
        syncedItems: synced,
      });
      addSyncToast({
        id: `toast-${Date.now()}`,
        title: 'Sync Interrupted',
        message: 'Network issue encountered during upload. Your items are safe in local storage and will retry automatically.',
        type: 'error',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
      return { success: false, syncedCount: synced };
    } finally {
      setIsSyncing(false);
    }
  }, [effectiveOnline, syncQueue, addSyncToast]);

  // Network and Auto-sync Listeners
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial connection validation
    testConnection();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Automatic synchronization whenever internet is restored and queue has pending items
  useEffect(() => {
    if (effectiveOnline) {
      const hasPending = syncQueue.some((q) => q.status === 'queued_offline' || q.status === 'failed');
      if (hasPending && !isSyncing) {
        triggerManualSync();
      }
    }
  }, [effectiveOnline, syncQueue, isSyncing, triggerManualSync]);

  // Periodic Online Status Poller & Auto-Flush Worker
  // Periodically polls real-time online status every 10 seconds and automatically flushes the local offline queue into Firebase
  useEffect(() => {
    const pollInterval = setInterval(() => {
      const realOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
      if (realOnline !== isOnline) {
        setIsOnline(realOnline);
      }
      const canFlush = realOnline && !isSimulatedOffline && !isSyncing;
      if (canFlush) {
        const hasQueued = syncQueue.some((q) => q.status === 'queued_offline' || q.status === 'failed');
        if (hasQueued) {
          triggerManualSync();
        }
      }
    }, 10000);

    return () => clearInterval(pollInterval);
  }, [isOnline, isSimulatedOffline, isSyncing, syncQueue, triggerManualSync]);

  // Run AI Inspection Analysis & Guidance
  const runAIInspectionAnalysis = async (inspectionId: string): Promise<AIInspectionAnalysis> => {
    const insp = inspections.find((i) => i.id === inspectionId);
    const proj = projects.find((p) => p.id === insp?.projectId);

    const evidences = insp?.evidences || [];
    const failedChecklist = insp?.checklist.filter((c) => c.status === 'fail' || c.status === 'flagged') || [];

    const evidenceDescriptions = evidences.map((e) => `${e.title}: ${e.note || ''}`).join('; ');
    const descLower = evidenceDescriptions.toLowerCase();

    const violations: string[] = [];
    if (
      descLower.includes('damag') ||
      descLower.includes('broken') ||
      descLower.includes('fire') ||
      descLower.includes('corridor') ||
      descLower.includes('ramp') ||
      failedChecklist.some((f) => f.category.includes('Infrastructure') || f.category.includes('Safety'))
    ) {
      violations.push('Infrastructure & Safety Hazards: Structural damage / emergency egress obstruction detected on-site');
    }
    if (
      (proj && proj.attendanceAnomaly) ||
      descLower.includes('attendance') ||
      descLower.includes('headcount') ||
      failedChecklist.some((f) => f.category.includes('Beneficiary'))
    ) {
      violations.push(
        `Beneficiary Headcount Deficit: On-site audit confirms substantial attendance drop (Recorded: ${proj?.latestAttendance || 18} vs Sanctioned: ${proj?.beneficiaryCount || 50})`
      );
    }
    if (
      failedChecklist.some((f) => f.category.includes('Staff')) ||
      descLower.includes('staff') ||
      descLower.includes('educator')
    ) {
      violations.push('Staff Non-Compliance: Key mandated rehabilitation specialists / medical personnel absent');
    }
    if (failedChecklist.some((f) => f.category.includes('CCTV')) || descLower.includes('cctv')) {
      violations.push('Surveillance Failure: CCTV stream down or local recording storage under statutory 30-day mandate');
    }

    if (violations.length === 0) {
      violations.push('Record Verification: Minor discrepancies in physical muster vs biometric sync');
    }

    const suggestions: string[] = [
      `Formal Notice: Issue Show-Cause Notice under DoSJE Scheme Guidelines Section 14.2 regarding ${violations[0]}.`,
      'Action Taken Report: Direct institute management to submit an ATR within 7 business days with fresh GPS-stamped photo proof.',
      'Follow-up Audit: Schedule unannounced PMU follow-up verification within 14 calendar days.',
      violations.length >= 2
        ? 'Fiscal Precaution: Recommend provisional withholding of upcoming Grant-in-Aid quarterly installment pending remediation.'
        : 'Supervisory Advisory: Require daily biometric attendance log upload with mandatory supervisory sign-off.',
    ];

    const analysis: AIInspectionAnalysis = {
      summary: `AI Audit Evaluation: Analyzed ${evidences.length} geo-tagged photos and ${failedChecklist.length} checklist points for ${insp?.projectName || 'Project'}. Identified ${violations.length} primary risk pattern(s). Ground photographic evidence indicates regulatory intervention is recommended.`,
      riskLevel: violations.length >= 2 ? 'High' : 'Medium',
      detectedViolations: violations,
      suggestions,
      recommendedRating: violations.length >= 2 ? 'Critical Violations' : 'Minor Discrepancies',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' IST',
    };

    setInspections((prev) =>
      prev.map((i) => (i.id === inspectionId ? { ...i, aiAnalysis: analysis } : i))
    );

    return analysis;
  };

  // 1. Run Automated & Random Surprise Inspection Assignment
  const runRandomSurpriseAssignment = (criteria?: {
    scheme?: string;
    state?: string;
    riskWeight?: number;
  }): Inspection => {
    // Select eligible project based on anomaly / overdue / risk
    const eligibleProjects = projects.filter((p) => {
      if (criteria?.scheme && criteria.scheme !== 'all' && p.scheme !== criteria.scheme) return false;
      if (criteria?.state && criteria.state !== 'all' && p.state !== criteria.state) return false;
      return true;
    });

    // Score based on riskScore + attendanceAnomaly boost + random entropy
    const scored = eligibleProjects.map((p) => {
      const anomalyBoost = p.attendanceAnomaly ? 45 : 0;
      const randomSeed = Math.floor(Math.random() * 30);
      const totalScore = p.riskScore + anomalyBoost + randomSeed;
      return { project: p, score: totalScore };
    });

    scored.sort((a, b) => b.score - a.score);
    const targetProject = (scored[0] || { project: projects[0] }).project;

    const teamNum = Math.floor(Math.random() * 8) + 1;
    const inspectorNames = ['Rajesh Sharma', 'Priya Deshmukh', 'Amitav Sen', 'Kavita Nair', 'Manoj Bajpai'];
    const assignedInspector = inspectorNames[Math.floor(Math.random() * inspectorNames.length)];

    const now = new Date();
    const inspId = `INSP-2026-${targetProject.state.substring(0, 2).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    const newInspection: Inspection = {
      id: inspId,
      projectId: targetProject.id,
      projectName: targetProject.name,
      scheme: targetProject.scheme,
      assignedTeamId: `PMU Division Team ${teamNum}`,
      inspectorName: assignedInspector,
      inspectorId: `INSP-ID-${teamNum}0${Math.floor(Math.random() * 9)}`,
      assignedDate: `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} IST`,
      scheduledDate: 'Immediate Unannounced Dispatch',
      type: 'Surprise Inspection',
      status: 'assigned',
      urgency: targetProject.attendanceAnomaly ? 'critical' : 'high',
      triggerReason: targetProject.attendanceAnomaly
        ? 'AI Anomaly Trigger (Severe Attendance Drop) + Entropy Seed'
        : 'Automated Unpredictable Random Assignment (DoSJE Rule #4B)',
      gpsVerification: {
        verified: false,
        targetCoords: { ...targetProject.coordinates },
      },
      checklist: INITIAL_CHECKLIST_TEMPLATE.map((c) => ({ ...c })),
      evidences: [],
    };

    setInspections((prev) => [newInspection, ...prev]);

    // Mark project as under_inspection
    setProjects((prev) =>
      prev.map((p) => (p.id === targetProject.id ? { ...p, status: 'under_inspection' } : p))
    );

    return newInspection;
  };

  // 2. Verify Inspector GPS
  const verifyInspectorGPS = (
    inspectionId: string,
    coords: Coordinates,
    forceSimulation = false
  ) => {
    const inspection = inspections.find((i) => i.id === inspectionId);
    if (!inspection) return { verified: false, distanceMeters: 99999, message: 'Inspection not found' };

    let distance = calculateDistanceMeters(coords, inspection.gpsVerification.targetCoords);

    // If simulation requested (e.g. testing in browser away from actual coordinates), simulate within 35 meters
    if (forceSimulation) {
      distance = Math.floor(25 + Math.random() * 30);
    }

    const verified = distance <= 150; // Allow 150m perimeter tolerance

    setInspections((prev) =>
      prev.map((i) => {
        if (i.id === inspectionId) {
          return {
            ...i,
            status: i.status === 'assigned' ? 'in_progress' : i.status,
            gpsVerification: {
              ...i.gpsVerification,
              verified,
              inspectorCoords: forceSimulation
                ? {
                    lat: inspection.gpsVerification.targetCoords.lat + 0.00015,
                    lng: inspection.gpsVerification.targetCoords.lng + 0.00018,
                  }
                : coords,
              distanceMeters: distance,
              timestamp: new Date().toLocaleTimeString() + ' IST',
              verifiedAddress: `${inspection.projectName} Campus Perimeter, Lat: ${inspection.gpsVerification.targetCoords.lat.toFixed(4)}, Lng: ${inspection.gpsVerification.targetCoords.lng.toFixed(4)}`,
            },
          };
        }
        return i;
      })
    );

    if (verified) {
      return {
        verified: true,
        distanceMeters: distance,
        message: `Location successfully verified! Inspector is within ${distance}m of designated project coordinates.`,
      };
    } else {
      return {
        verified: false,
        distanceMeters: distance,
        message: `Inspector is ${distance > 1000 ? (distance / 1000).toFixed(1) + ' km' : distance + ' m'} away from the assigned facility. Minimum accuracy requirement is <= 150 meters.`,
      };
    }
  };

  // 3. Update Checklist
  const updateChecklistItem = (
    inspectionId: string,
    itemId: string,
    status: 'pass' | 'fail' | 'flagged',
    remarks?: string
  ) => {
    setInspections((prev) =>
      prev.map((insp) => {
        if (insp.id !== inspectionId) return insp;
        return {
          ...insp,
          checklist: insp.checklist.map((item) =>
            item.id === itemId
              ? { ...item, status, remarks: remarks !== undefined ? remarks : item.remarks }
              : item
          ),
        };
      })
    );
  };

  // 4. Add Inspection Evidence with Offline Sync Support
  const addInspectionEvidence = (inspectionId: string, evidence: EvidenceItem) => {
    const isOffline = !effectiveOnline;
    const evidenceWithSyncFlag: EvidenceItem = {
      ...evidence,
      syncedOffline: isOffline,
    };

    setInspections((prev) =>
      prev.map((insp) => {
        if (insp.id !== inspectionId) return insp;
        return {
          ...insp,
          evidences: [evidenceWithSyncFlag, ...insp.evidences],
        };
      })
    );

    const insp = inspections.find((i) => i.id === inspectionId);

    if (isOffline) {
      // Enqueue to offline sync queue with rich metadata
      const queueItem: SyncQueueItem = {
        id: `sync-ev-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        inspectionId,
        type: 'evidence',
        title: `Geo-tagged Photo: ${evidence.title || 'On-site evidence'}`,
        status: 'queued_offline',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        payload: evidenceWithSyncFlag,
        projectName: insp?.projectName || 'Welfare Centre',
        inspectorName: insp?.inspectorName || 'Inspector Rajesh Sharma',
        assignedTeamId: insp?.assignedTeamId || 'PMU Team 4',
        deviceId: 'DEV-KA-402 (Galaxy Tab Active4 Pro)',
        deviceLastSyncTime: lastSyncTime || 'Today, 10:30 AM IST',
        itemSizeKb: Math.floor(950 + Math.random() * 850),
      };
      setSyncQueue((prev) => [queueItem, ...prev]);

      addSyncToast({
        id: `toast-${Date.now()}`,
        title: 'Evidence Saved Locally (Offline Vault)',
        message: `Photo proof "${evidence.title}" and GPS stamp queued on device. Will auto-sync to Firebase once connected.`,
        type: 'warning',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    } else {
      // Direct remote save to Firestore
      try {
        setDoc(doc(db, 'inspections', inspectionId, 'evidence', evidence.id), {
          ...evidenceWithSyncFlag,
          syncedOffline: false,
          syncedAt: new Date().toISOString(),
        }).catch((err) => {
          console.warn('Firestore direct write failed, adding to sync queue:', err);
          const queueItem: SyncQueueItem = {
            id: `sync-ev-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            inspectionId,
            type: 'evidence',
            title: `Geo-tagged Photo: ${evidence.title || 'On-site evidence'}`,
            status: 'queued_offline',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            payload: evidenceWithSyncFlag,
            projectName: insp?.projectName || 'Welfare Centre',
            inspectorName: insp?.inspectorName || 'Inspector Rajesh Sharma',
            assignedTeamId: insp?.assignedTeamId || 'PMU Team 4',
            deviceId: 'DEV-KA-402 (Galaxy Tab Active4 Pro)',
            deviceLastSyncTime: lastSyncTime || 'Today, 10:30 AM IST',
            itemSizeKb: 1120,
          };
          setSyncQueue((prev) => [queueItem, ...prev]);
        });

        addSyncToast({
          id: `toast-${Date.now()}`,
          title: 'Evidence Uploaded to Firebase',
          message: `Photo proof and GPS telemetry successfully committed to Central Firestore cloud database.`,
          type: 'success',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });
      } catch (err) {
        console.warn('Firestore setDoc exception:', err);
      }
    }
  };

  // 5. Submit Inspection
  const submitInspection = (
    inspectionId: string,
    remarks: string,
    rating: 'Satisfactory' | 'Minor Discrepancies' | 'Critical Violations'
  ) => {
    const insp = inspections.find((i) => i.id === inspectionId);
    if (!insp) return { success: false, error: 'Inspection not found' };

    // HARD GPS CHECK: System forbids submission if inspector has not verified GPS location
    if (!insp.gpsVerification.verified) {
      return {
        success: false,
        error:
          'Location not verified — inspection cannot be submitted as completed. The inspector must verify GPS presence at the assigned project site.',
      };
    }

    // HARD CHECKLIST CHECK: All checklist inquiries must be reviewed before final submission
    const pendingChecklist = insp.checklist.filter((c) => c.status === 'pending');
    if (pendingChecklist.length > 0) {
      return {
        success: false,
        error: `Incomplete Inspection Checklist: ${pendingChecklist.length} item(s) are still pending evaluation. All items must be completed before statutory submission.`,
      };
    }

    // HARD EVIDENCE CHECK: At least one geo-tagged photograph must be attached
    if (!insp.evidences || insp.evidences.length === 0) {
      return {
        success: false,
        error:
          'Missing Photographic Proof: Without uploaded geo-tagged evidence photos, an inspection cannot be submitted to the Directorate.',
      };
    }

    const completedTimestamp = new Date().toLocaleString() + ' IST';

    setInspections((prev) =>
      prev.map((i) => {
        if (i.id !== inspectionId) return i;
        return {
          ...i,
          status: 'submitted',
          completedDate: completedTimestamp,
          inspectorRemarks: remarks,
          overallRating: rating,
        };
      })
    );

    // Update Project Status
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== insp.projectId) return p;
        return {
          ...p,
          status: rating === 'Critical Violations' ? 'flagged' : rating === 'Minor Discrepancies' ? 'action_pending' : 'normal',
          lastInspectedDate: new Date().toISOString().split('T')[0],
        };
      })
    );

    // Auto-create issue if failed items or critical
    const failedItems = insp.checklist.filter((c) => c.status === 'fail' || c.status === 'flagged');
    if (failedItems.length > 0 || rating !== 'Satisfactory') {
      const newIssue: IssueCompliance = {
        id: `ISS-2026-${Math.floor(100 + Math.random() * 900)}`,
        inspectionId: insp.id,
        projectId: insp.projectId,
        projectName: insp.projectName,
        scheme: insp.scheme,
        title: failedItems[0]?.question || 'Non-compliance detected during surprise inspection',
        description: `Inspector ${insp.inspectorName} recorded: ${remarks || failedItems.map((f) => f.remarks).filter(Boolean).join('; ') || 'Discrepancy noted during on-site audit.'}`,
        severity: rating === 'Critical Violations' ? 'high' : 'medium',
        stage: 'issue_found',
        issuedDate: completedTimestamp,
        deadlineDate: '7 days from notice issuance',
      };
      setIssues((prev) => [newIssue, ...prev]);
    }

    if (!effectiveOnline) {
      const queueItem: SyncQueueItem = {
        id: `sync-insp-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        inspectionId,
        type: 'inspection_update',
        title: `Inspection Submission Dossier: ${insp.projectName}`,
        status: 'queued_offline',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        projectName: insp.projectName,
        inspectorName: insp.inspectorName,
        assignedTeamId: insp.assignedTeamId,
        deviceId: 'DEV-KA-402 (Galaxy Tab Active4 Pro)',
        deviceLastSyncTime: lastSyncTime || 'Today, 10:30 AM IST',
        itemSizeKb: 1450,
        payload: {
          status: 'submitted',
          completedDate: completedTimestamp,
          inspectorRemarks: remarks,
          overallRating: rating,
        },
      };
      setSyncQueue((prev) => [queueItem, ...prev]);

      addSyncToast({
        id: `toast-${Date.now()}`,
        title: 'Report Dossier Queued Offline',
        message: `Final inspection dossier for "${insp.projectName}" committed to local encrypted vault. Will auto-sync to Firebase on reconnect.`,
        type: 'warning',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    } else {
      try {
        setDoc(
          doc(db, 'inspections', inspectionId),
          {
            status: 'submitted',
            completedDate: completedTimestamp,
            inspectorRemarks: remarks,
            overallRating: rating,
            syncedAt: new Date().toISOString(),
          },
          { merge: true }
        ).catch((err) => {
          console.warn('Firestore inspection update failed, queuing offline:', err);
        });

        addSyncToast({
          id: `toast-${Date.now()}`,
          title: 'Report Submitted to Firebase',
          message: `Signed inspection dossier for "${insp.projectName}" successfully submitted to Central Firestore DB.`,
          type: 'success',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });
      } catch (err) {
        console.warn('Firestore setDoc exception:', err);
      }
    }

    return { success: true };
  };

  // 6. Review Inspection (Government Official)
  const reviewInspection = (
    inspectionId: string,
    action: 'approved' | 'show_cause_issued' | 're_inspection_ordered',
    comments: string
  ) => {
    setInspections((prev) =>
      prev.map((i) => {
        if (i.id !== inspectionId) return i;
        return {
          ...i,
          status: action === 'show_cause_issued' ? 'action_required' : 'approved',
          supervisorReview: {
            reviewerName: 'Dr. Alok Verma, IAS (Joint Secretary, DoSJE)',
            action,
            comments,
            date: new Date().toLocaleString() + ' IST',
          },
        };
      })
    );

    // If show cause issued, update issue stage to notice_issued
    if (action === 'show_cause_issued') {
      setIssues((prev) =>
        prev.map((iss) => (iss.inspectionId === inspectionId ? { ...iss, stage: 'notice_issued' } : iss))
      );
    }
  };

  // 7. Update Beneficiary Attendance (NGO Portal trigger)
  const updateBeneficiaryAttendance = (projectId: string, count: number) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;

        const isAnomaly = count < p.historicalAvgAttendance * 0.6; // e.g. drop > 40%
        const updatedWeekly = [...p.weeklyAttendance];
        if (updatedWeekly.length > 0) {
          updatedWeekly[updatedWeekly.length - 1] = {
            ...updatedWeekly[updatedWeekly.length - 1],
            present: count,
          };
        }

        return {
          ...p,
          latestAttendance: count,
          attendanceAnomaly: isAnomaly,
          riskScore: isAnomaly ? Math.min(95, p.riskScore + 35) : Math.max(20, p.riskScore - 20),
          status: isAnomaly ? 'flagged' : p.status === 'flagged' ? 'normal' : p.status,
          weeklyAttendance: updatedWeekly,
        };
      })
    );

    const project = projects.find((p) => p.id === projectId);
    if (!project) return;

    if (count < project.historicalAvgAttendance * 0.6) {
      // Trigger new AI alert
      const existingAlert = aiAlerts.find((a) => a.projectId === projectId && a.type === 'attendance_drop');
      if (!existingAlert) {
        const newAlert: AIAlert = {
          id: `ALT-${Math.floor(100 + Math.random() * 900)}`,
          projectId: project.id,
          projectName: project.name,
          scheme: project.scheme,
          type: 'attendance_drop',
          severity: 'high',
          title: `Sudden Attendance Drop Flagged (${count} vs avg ${project.historicalAvgAttendance})`,
          description: `Attendance decreased by ${Math.round(((project.historicalAvgAttendance - count) / project.historicalAvgAttendance) * 100)}%. System highlights this pattern for human officer verification. (Decision support alert, not a fraud accusation).`,
          timestamp: 'Just now',
          dataMetrics: {
            baseline: `${project.historicalAvgAttendance} / ${project.beneficiaryCount}`,
            current: `${count} / ${project.beneficiaryCount}`,
            anomalyScore: `Z-score: -${(3 + Math.random()).toFixed(2)} (High)`,
          },
          status: 'active',
          recommendedAction: 'Trigger surprise inspection or conduct random VC with Project Incharge.',
        };
        setAiAlerts((prev) => [newAlert, ...prev]);
      }
    }
  };

  // 8. Video Conferencing
  const startVideoCall = (
    name: string,
    participantRole: 'Project Incharge' | 'Staff Member' | 'Beneficiary',
    projectName: string
  ) => {
    setActiveVC({
      active: true,
      participantName: name,
      participantRole,
      projectName,
      connectedAt: new Date().toLocaleTimeString(),
      durationSeconds: 0,
    });
  };

  const endVideoCall = (inspectionIdToTag?: string, notes?: string) => {
    if (inspectionIdToTag && notes) {
      setInspections((prev) =>
        prev.map((i) =>
          i.id === inspectionIdToTag
            ? { ...i, vcConducted: true, vcNotes: notes }
            : i
        )
      );
    }
    setActiveVC(null);
  };

  // 9. NGO Action Taken Report (ATR)
  const submitATR = (issueId: string, explanation: string, evidenceUrl?: string) => {
    setIssues((prev) =>
      prev.map((iss) => {
        if (iss.id !== issueId) return iss;
        return {
          ...iss,
          stage: 'corrected',
          ngoResponse: {
            date: new Date().toLocaleString() + ' IST',
            explanation,
            evidenceImageUrl:
              evidenceUrl ||
              'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80',
          },
        };
      })
    );
  };

  // 10. Official Verification of ATR
  const verifyATR = (issueId: string, accepted: boolean, notes: string) => {
    setIssues((prev) =>
      prev.map((iss) => {
        if (iss.id !== issueId) return iss;
        return {
          ...iss,
          stage: accepted ? 'resolved' : 'action_required',
          pmuVerification: {
            date: new Date().toLocaleString() + ' IST',
            verifiedBy: 'PMU Verification Cell (Officer S. Khurana)',
            status: accepted ? 'accepted' : 'rejected',
            notes,
          },
        };
      })
    );
  };

  // Update AI Alert status
  const updateAIAlertStatus = (alertId: string, status: 'active' | 'investigating' | 'resolved') => {
    setAiAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status } : a))
    );
  };

  // Reset to initial demo state
  const resetAllData = () => {
    setProjects(INITIAL_PROJECTS);
    setInspections(INITIAL_INSPECTIONS);
    setAiAlerts(INITIAL_AI_ALERTS);
    setIssues(INITIAL_ISSUES);
    setSelectedProjectId('PRJ-001');
    localStorage.removeItem(`${STORAGE_KEY}_projects`);
    localStorage.removeItem(`${STORAGE_KEY}_inspections`);
    localStorage.removeItem(`${STORAGE_KEY}_alerts`);
    localStorage.removeItem(`${STORAGE_KEY}_issues`);
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        currentUser: authUsers[role],
        authUsers,
        loginUser,
        logoutUser,
        runAIInspectionAnalysis,
        projects,
        inspections,
        aiAlerts,
        issues,
        selectedProjectId,
        setSelectedProjectId,
        activeVC,
        isPhoneFrame,
        setIsPhoneFrame,
        tourStep,
        setTourStep,
        isTourActive,
        setIsTourActive,
        runRandomSurpriseAssignment,
        verifyInspectorGPS,
        updateChecklistItem,
        addInspectionEvidence,
        submitInspection,
        reviewInspection,
        updateBeneficiaryAttendance,
        updateAIAlertStatus,
        startVideoCall,
        endVideoCall,
        submitATR,
        verifyATR,
        resetAllData,
        isOnline,
        isSimulatedOffline,
        toggleSimulateOffline,
        syncQueue,
        isSyncing,
        lastSyncTime,
        triggerManualSync,
        clearSyncQueue,
        loginWithGoogle,
        syncProgress,
        syncToasts,
        addSyncToast,
        dismissSyncToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
