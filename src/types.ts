export type UserRole = 'government' | 'inspector' | 'ngo';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface CCTVFeed {
  id: string;
  name: string;
  cameraModel: string;
  status: 'online' | 'offline' | 'glitch';
  resolution: string;
  fps: number;
  locationArea: string;
  streamType:
    | 'dining'
    | 'classroom'
    | 'dormitory'
    | 'entrance'
    | 'activity'
    | 'industrial'
    | 'construction'
    | 'fabrication'
    | 'warehouse'
    | 'scaffolding'
    | 'machinery';
  lastPing: string;
  uptimePercentage: number;
  imageUrl?: string;
}

export interface Project {
  id: string;
  name: string;
  scheme: string;
  ngoName: string;
  regNumber: string;
  state: string;
  district: string;
  address: string;
  coordinates: Coordinates;
  incharge: {
    name: string;
    designation: string;
    phone: string;
    email: string;
    avatarUrl?: string;
  };
  beneficiaryCount: number;
  staffCount: number;
  cctvCount: number;
  cctvFeeds: CCTVFeed[];
  status: 'normal' | 'flagged' | 'under_inspection' | 'action_pending';
  riskScore: number; // 0 to 100
  lastInspectedDate: string;
  attendanceAnomaly: boolean;
  latestAttendance: number;
  historicalAvgAttendance: number;
  weeklyAttendance: { date: string; present: number; total: number }[];
  grantAmountAnnual: string;
}

export interface ChecklistItem {
  id: string;
  category: string;
  question: string;
  status: 'pass' | 'fail' | 'flagged' | 'pending';
  remarks: string;
  requiredPhoto: boolean;
}

export interface EvidenceItem {
  id: string;
  inspectionId: string;
  title: string;
  category: 'infrastructure' | 'attendance_register' | 'beneficiaries' | 'kitchen_hygiene' | 'safety' | 'medical_records';
  imageUrl: string;
  timestamp: string;
  coordinates: Coordinates;
  locationName: string;
  inspectorId: string;
  inspectorName: string;
  note?: string;
  syncedOffline?: boolean;
}

export interface AIInspectionAnalysis {
  summary: string;
  riskLevel: 'High' | 'Medium' | 'Low';
  detectedViolations: string[];
  suggestions: string[];
  recommendedRating: 'Satisfactory' | 'Minor Discrepancies' | 'Critical Violations';
  timestamp: string;
}

export interface AuthUser {
  email: string;
  name: string;
  role: UserRole;
  designation?: string;
  projectId?: string; // For NGO role: bound to their specific project!
  projectName?: string;
  teamId?: string; // For Inspector role
  id?: string;
}

export interface Inspection {
  id: string;
  projectId: string;
  projectName: string;
  scheme: string;
  assignedTeamId: string;
  inspectorName: string;
  inspectorId: string;
  assignedDate: string;
  scheduledDate: string;
  completedDate?: string;
  type: 'Surprise Inspection' | 'Routine Audit' | 'Follow-up Verification';
  status: 'assigned' | 'in_progress' | 'submitted' | 'approved' | 'action_required';
  urgency: 'critical' | 'high' | 'routine';
  triggerReason: string;
  gpsVerification: {
    verified: boolean;
    inspectorCoords?: Coordinates;
    targetCoords: Coordinates;
    distanceMeters?: number;
    timestamp?: string;
    verifiedAddress?: string;
  };
  checklist: ChecklistItem[];
  evidences: EvidenceItem[];
  inspectorRemarks?: string;
  overallRating?: 'Satisfactory' | 'Minor Discrepancies' | 'Critical Violations';
  vcConducted?: boolean;
  vcNotes?: string;
  aiAnalysis?: AIInspectionAnalysis;
  supervisorReview?: {
    reviewerName: string;
    action: 'approved' | 'show_cause_issued' | 're_inspection_ordered';
    comments: string;
    date: string;
  };
}

export interface AIAlert {
  id: string;
  projectId: string;
  projectName: string;
  scheme: string;
  type: 'attendance_drop' | 'cctv_offline' | 'proxy_pattern' | 'inspection_delay' | 'geo_mismatch';
  severity: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  timestamp: string;
  dataMetrics: {
    baseline: number | string;
    current: number | string;
    anomalyScore: string;
  };
  status: 'active' | 'investigating' | 'resolved';
  recommendedAction: string;
}

export interface IssueCompliance {
  id: string;
  inspectionId: string;
  projectId: string;
  projectName: string;
  scheme: string;
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  stage: 'issue_found' | 'notice_issued' | 'action_required' | 'corrected' | 'verified' | 'resolved';
  issuedDate: string;
  deadlineDate: string;
  ngoResponse?: {
    date: string;
    explanation: string;
    evidenceImageUrl?: string;
  };
  pmuVerification?: {
    date: string;
    verifiedBy: string;
    status: 'accepted' | 'rejected';
    notes: string;
  };
}

export interface VideoCallSession {
  active: boolean;
  participantName: string;
  participantRole: 'Project Incharge' | 'Staff Member' | 'Beneficiary';
  projectName: string;
  connectedAt?: string;
  durationSeconds: number;
}

export interface SyncQueueItem {
  id: string;
  inspectionId: string;
  type: 'evidence' | 'inspection_update' | 'attendance_sync';
  title: string;
  status: 'queued_offline' | 'syncing' | 'synced' | 'failed';
  timestamp: string;
  payload: any;
  error?: string;
  projectName?: string;
  inspectorName?: string;
  assignedTeamId?: string;
  deviceId?: string;
  deviceLastSyncTime?: string;
  syncedAt?: string;
  itemSizeKb?: number;
}

export interface SyncProgressState {
  isSyncing: boolean;
  percent: number;
  currentStep: string;
  totalItems: number;
  syncedItems: number;
}

export interface SyncToast {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  timestamp: string;
  itemCount?: number;
}

