import {
  ShieldCheck,
  Video,
  Target,
  BarChart3,
  Archive,
  Users,
  AlertTriangle,
  Clock,
  Zap,
  Thermometer,
  CloudRain,
  Wind,
  BatteryFull,
  Signal,
  MapPin,
  Plane,
  PowerOff,
  PlayCircle,
  FileText,
  Bot,
} from 'lucide-react';

// =================================================================
// TYPE DEFINITIONS
// =================================================================

export type SystemStatus = 'NORMAL' | 'ALERT' | 'EMERGENCY';

export type UserRole = 'Operator' | 'Commander' | 'Analyst' | 'Planner' | 'Admin';

export interface SystemHealth {
  cpuUsage: number;
  memoryUsage: number;
  networkLatency: number;
}

export interface Drone {
  id: string;
  model: string;
  status: 'Idle' | 'In Mission' | 'Charging' | 'Maintenance';
  battery: number;
  location: { lat: number; lon: number };
  signalStrength: number; // in percentage
}

export interface Mission {
  id: string;
  name: string;
  status: 'Planned' | 'In Progress' | 'Completed' | 'Aborted';
  assignedDrone: string | null;
  progress: number; // in percentage
}

export interface HighRiskArea {
  id: string;
  name: string;
  riskLevel: 1 | 2 | 3 | 4 | 5;
  waterLevel: number; // in meters
  trend: 'rising' | 'falling' | 'stable';
}

export interface NavigationCardData {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  path: string;
  userRoles: UserRole[];
  liveData: {
    label: string;
    value: string | number;
    icon: React.ElementType;
  }[];
  lastUpdate: string;
  color: keyof typeof theme.colors.accent;
}

export interface RecentActivity {
  id: string;
  timestamp: string;
  activity: string;
  type: 'info' | 'warning' | 'critical';
}

// =================================================================
// MOCK DATA
// =================================================================

export const theme = {
  colors: {
    accent: {
      cyan: '#06B6D4',
      orange: '#F97316',
      red: '#DC2626',
      amber: '#D97706',
      green: '#059669',
      purple: '#7C3AED',
      blue: '#2563EB',
    },
  },
};

// --- Header Data ---
export const systemStatus: SystemStatus = 'ALERT';
export const activeDronesCount: number = 4;
export const ongoingMissionsCount: number = 3;

// --- Drones & Missions ---
export const drones: Drone[] = [
  { id: 'FDS-001', model: 'DJI Matrice 300', status: 'In Mission', battery: 78, location: { lat: 34.0522, lon: -118.2437 }, signalStrength: 92 },
  { id: 'FDS-002', model: 'Parrot Anafi USA', status: 'In Mission', battery: 65, location: { lat: 34.0550, lon: -118.2450 }, signalStrength: 88 },
  { id: 'FDS-003', model: 'DJI Matrice 300', status: 'In Mission', battery: 85, location: { lat: 34.0500, lon: -118.2480 }, signalStrength: 95 },
  { id: 'FDS-004', model: 'Skydio X2', status: 'Idle', battery: 100, location: { lat: 34.0510, lon: -118.2410 }, signalStrength: 100 },
  { id: 'FDS-005', model: 'Parrot Anafi USA', status: 'Charging', battery: 45, location: { lat: 34.0515, lon: -118.2415 }, signalStrength: 0 },
];

export const missions: Mission[] = [
  { id: 'M01-RiverA', name: 'River A Patrol', status: 'In Progress', assignedDrone: 'FDS-001', progress: 60 },
  { id: 'M02-DamScan', name: 'Dam Integrity Scan', status: 'In Progress', assignedDrone: 'FDS-002', progress: 45 },
  { id: 'M03-ResiWatch', name: 'Residential Watch', status: 'In Progress', assignedDrone: 'FDS-003', progress: 80 },
  { id: 'M04-UrbanSurvey', name: 'Urban Area Survey', status: 'Planned', assignedDrone: null, progress: 0 },
];

// --- Navigation Cards ---
export const navigationCards: NavigationCardData[] = [
  {
    id: 'control-platform',
    title: 'Control & Monitoring',
    description: 'Real-time drone control, AI risk analysis, and emergency dashboard.',
    icon: ShieldCheck,
    path: '/monitoring',
    userRoles: ['Operator', 'Commander', 'Admin'],
    liveData: [
      { label: 'Active Drones', value: `${activeDronesCount}/${drones.length}`, icon: Plane },
      { label: 'Risk Alerts', value: 3, icon: AlertTriangle },
    ],
    lastUpdate: 'Just now',
    color: 'cyan',
  },
  {
    id: 'video-intelligence',
    title: 'Video Intelligence',
    description: 'Live AI drone video analysis, object detection, and segmentation.',
    icon: Video,
    path: '/video',
    userRoles: ['Analyst', 'Operator'],
    liveData: [
      { label: 'Live Streams', value: 3, icon: Zap },
      { label: 'Objects Detected', value: 128, icon: Users },
    ],
    lastUpdate: 'Just now',
    color: 'purple',
  },
  {
    id: 'mission-planning',
    title: 'Mission Planning',
    description: 'Create and manage drone missions, routes, and resource allocation.',
    icon: Target,
    path: '/planning',
    userRoles: ['Planner', 'Commander'],
    liveData: [
      { label: 'Active Missions', value: ongoingMissionsCount, icon: PlayCircle },
      { label: 'Planned', value: 1, icon: Clock },
    ],
    lastUpdate: '5m ago',
    color: 'blue',
  },
  {
    id: 'disaster-analysis',
    title: 'Disaster Analysis',
    description: 'AI-based disaster prediction, flood risk analysis, and weather tracking.',
    icon: BarChart3,
    path: '/analysis',
    userRoles: ['Analyst', 'Commander'],
    liveData: [
      { label: 'High-Risk Zones', value: 2, icon: AlertTriangle },
      { label: 'Rainfall Forecast', value: '25mm/h', icon: CloudRain },
    ],
    lastUpdate: '15m ago',
    color: 'orange',
  },
  {
    id: 'mission-history',
    title: 'Mission History',
    description: 'Access mission logs, performance analytics, and data archives.',
    icon: Archive,
    path: '/history',
    userRoles: ['Admin', 'Analyst'],
    liveData: [
      { label: 'Missions Logged', value: 234, icon: FileText },
      { label: 'Data Archived', value: '1.2 TB', icon: Archive },
    ],
    lastUpdate: '1h ago',
    color: 'green',
  },
];

// --- System Overview ---
export const systemHealth: SystemHealth = {
  cpuUsage: 68,
  memoryUsage: 54,
  networkLatency: 45, // in ms
};

export const highRiskAreas: HighRiskArea[] = [
  { id: 'zone-a', name: 'Riverside District', riskLevel: 5, waterLevel: 3.2, trend: 'rising' },
  { id: 'zone-b', name: 'Industrial Park', riskLevel: 4, waterLevel: 1.8, trend: 'rising' },
  { id: 'zone-c', name: 'Downtown Area', riskLevel: 3, waterLevel: 0.9, trend: 'stable' },
];

export const activityLog: RecentActivity[] = [
    { id: 'a1', timestamp: '2023-10-27T10:00:00Z', activity: 'High water level detected in Zone A', type: 'critical' },
    { id: 'a2', timestamp: '2023-10-27T09:58:00Z', activity: 'Mission M03-ResiWatch started', type: 'info' },
    { id: 'a3', timestamp: '2023-10-27T09:55:00Z', activity: 'Drone FDS-002 signal strength low', type: 'warning' },
    { id: 'a4', timestamp: '2023-10-27T09:50:00Z', activity: 'Weather alert: Heavy rain expected', type: 'warning' },
    { id: 'a5', timestamp: '2023-10-27T09:45:00Z', activity: 'Mission M01-RiverA reached waypoint 4', type: 'info' },
];

export const activityChartData = [
  { time: '10:00', alerts: 5, missions: 2 },
  { time: '11:00', alerts: 7, missions: 3 },
  { time: '12:00', alerts: 6, missions: 3 },
  { time: '13:00', alerts: 9, missions: 4 },
  { time: '14:00', alerts: 12, missions: 4 },
  { time: '15:00', alerts: 8, missions: 3 },
  { time: '16:00', alerts: 10, missions: 3 },
];

// --- Quick Actions ---
export const quickActions = [
  { id: 'emergency-stop', label: 'Emergency Stop All', icon: PowerOff, requiresAdmin: true },
  { id: 'start-patrol', label: 'Initiate Standard Patrol', icon: PlayCircle, requiresAdmin: false },
  { id:_code: 'run-diagnostics', label: 'Run System Diagnostics', icon: Bot, requiresAdmin: true },
  { id: 'generate-report', label: 'Generate Daily Report', icon: FileText, requiresAdmin: false },
];
