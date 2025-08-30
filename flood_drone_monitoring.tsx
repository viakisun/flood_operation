import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, ReferenceLine, Area, AreaChart } from 'recharts';
import { 
  Plane, 
  Battery, 
  Signal, 
  AlertTriangle, 
  MapPin, 
  Activity, 
  Wifi, 
  Menu,
  X,
  Filter,
  Eye,
  Zap,
  Shield,
  Waves,
  Clock,
  Target,
  Navigation,
  Command,
  AlertCircle,
  CheckCircle2,
  Settings,
  Bell,
  User,
  Car,
  Package,
  Route,
  Timer,
  Crosshair,
  Radio,
  TrendingUp,
  Play,
  Pause
} from 'lucide-react';

// Design System
const theme = {
  colors: {
    primary: {
      950: '#030712',
      900: '#0F172A',
      800: '#1E293B',
      700: '#334155',
      600: '#475569',
      500: '#64748B'
    },
    accent: {
      teal: '#14F8F8',
      orange: '#FF6B00',
      red: '#FF3366',
      amber: '#F59E0B',
      green: '#10B981',
      purple: '#8B5CF6'
    },
    risk: {
      1: '#10B981',
      2: '#22C55E',
      3: '#F59E0B',
      4: '#F97316',
      5: '#EF4444'
    },
    neutral: {
      50: '#F8FAFC',
      100: '#F1F5F9',
      200: '#E2E8F0',
      300: '#CBD5E1',
      400: '#94A3B8',
      500: '#64748B'
    }
  }
};

// Data Types
type VideoAnalysis = {
  frame_id: string;
  timestamp: string;
  drone_id: string;
  detections: Array<{
    id: string;
    class_name: string;
    confidence: number;
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
  }>;
  segmentations: Array<{
    id: string;
    class_name: string;
    confidence: number;
    color: string;
  }>;
  metadata: {
    processing_time_ms: number;
    model_version: string;
    frame_quality: 'excellent' | 'good' | 'poor' | 'degraded';
  };
};

type FlightSchedule = {
  drone_id: string;
  mission_id: string;
  start_time: string;
  status: 'scheduled' | 'in_flight' | 'completed' | 'aborted';
  waypoints_completed: number;
  total_waypoints: number;
};

type FloodArea = {
  id: string;
  name: string;
  current_risk_level: 1 | 2 | 3 | 4 | 5;
  is_escalated: boolean;
  water_threshold_cm: number;
  last_depth_cm: number;
};

type Notification = {
  id: string;
  ts_utc: string;
  severity: 'info' | 'warning' | 'critical';
  category: 'SYSTEM' | 'DETECTION' | 'RISK_ESCALATION' | 'MISSION';
  title: string;
  description: string;
  acknowledged: boolean;
};

// Mock Data Generators
const generateVideoAnalysis = (droneId: string): VideoAnalysis => {
  const classes = ['person', 'vehicle', 'water', 'debris', 'building'];
  const colors = [theme.colors.accent.red, theme.colors.accent.orange, theme.colors.accent.teal, 
                  theme.colors.accent.amber, theme.colors.accent.green];

  const detections = [];
  const segmentations = [];

  for (let i = 0; i < Math.floor(Math.random() * 4) + 1; i++) {
    const className = classes[Math.floor(Math.random() * classes.length)];
    detections.push({
      id: `det_${i}`,
      class_name: className,
      confidence: 0.6 + Math.random() * 0.4,
      x: Math.random() * 400,
      y: Math.random() * 300,
      width: 40 + Math.random() * 80,
      height: 40 + Math.random() * 80,
      color: colors[i % colors.length]
    });
  }

  for (let i = 0; i < Math.floor(Math.random() * 3) + 1; i++) {
    segmentations.push({
      id: `seg_${i}`,
      class_name: ['water', 'flood_area', 'vegetation'][i % 3],
      confidence: 0.7 + Math.random() * 0.3,
      color: colors[i % colors.length]
    });
  }

  return {
    frame_id: `frame_${Date.now()}`,
    timestamp: new Date().toISOString(),
    drone_id: droneId,
    detections,
    segmentations,
    metadata: {
      processing_time_ms: 50 + Math.random() * 100,
      model_version: 'FloodNet-v2.4.1',
      frame_quality: ['excellent', 'good', 'poor', 'degraded'][Math.floor(Math.random() * 4)] as any
    }
  };
};

const generateFlightSchedules = (): FlightSchedule[] => {
  const droneIds = ['UAV_ALPHA', 'UAV_BRAVO', 'UAV_CHARLIE', 'UAV_DELTA', 'UAV_ECHO'];
  const missions = ['PATROL_001', 'SURVEY_002', 'MONITOR_003', 'RECON_004', 'SWEEP_005'];
  
  return droneIds.map((id, idx) => {
    const now = new Date();
    const startTime = new Date(now.getTime() + (idx - 2) * 30 * 60 * 1000);
    const status = idx < 3 ? 'in_flight' : 'scheduled';

    return {
      drone_id: id,
      mission_id: missions[idx],
      start_time: startTime.toISOString(),
      status: status as any,
      waypoints_completed: status === 'in_flight' ? Math.floor(Math.random() * 5) : 0,
      total_waypoints: 8
    };
  });
};

const generateFloodAreas = (): FloodArea[] => {
  return [
    { id: 'AREA_001', name: 'RIVERSIDE_SECTOR_A', current_risk_level: 3, is_escalated: false, water_threshold_cm: 150, last_depth_cm: 120 },
    { id: 'AREA_002', name: 'INDUSTRIAL_ZONE_B', current_risk_level: 2, is_escalated: false, water_threshold_cm: 120, last_depth_cm: 80 },
    { id: 'AREA_003', name: 'RESIDENTIAL_NORTH', current_risk_level: 4, is_escalated: true, water_threshold_cm: 80, last_depth_cm: 160 },
    { id: 'AREA_004', name: 'DOWNTOWN_CORE', current_risk_level: 5, is_escalated: true, water_threshold_cm: 60, last_depth_cm: 200 }
  ] as FloodArea[];
};

const generateNotifications = (): Notification[] => {
  const notifications = [];
  const now = new Date();

  for (let i = 0; i < 6; i++) {
    const timestamp = new Date(now.getTime() - i * 300000);
    const severity = Math.random() < 0.2 ? 'critical' : Math.random() < 0.5 ? 'warning' : 'info';
    
    notifications.push({
      id: `NOTIF_${String(i + 1).padStart(3, '0')}`,
      ts_utc: timestamp.toISOString(),
      severity: severity as any,
      category: ['SYSTEM', 'DETECTION', 'RISK_ESCALATION', 'MISSION'][Math.floor(Math.random() * 4)] as any,
      title: severity === 'critical' ? 'CRITICAL: EVACUATION REQUIRED' :
             severity === 'warning' ? 'WARNING: THRESHOLD EXCEEDED' : 'INFO: MISSION COMPLETED',
      description: `Area ${Math.floor(Math.random() * 4) + 1} - Risk escalated`,
      acknowledged: Math.random() < 0.3
    });
  }

  return notifications.sort((a, b) => new Date(b.ts_utc).getTime() - new Date(a.ts_utc).getTime());
};

// Utility Functions
const formatTimestamp = (isoString: string): string => {
  return new Date(isoString).toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit',
    hour12: false 
  });
};

const getRiskColorScheme = (level: number) => {
  const riskColor = theme.colors.risk[level as keyof typeof theme.colors.risk];
  return {
    color: riskColor,
    bg: `${riskColor}20`,
    border: `${riskColor}40`
  };
};

const getDetectionIcon = (detClass: string) => {
  switch (detClass) {
    case 'person': return User;
    case 'vehicle': return Car;
    case 'debris': return Package;
    default: return Target;
  }
};

// Main Component
const FloodDroneMonitoringSystem: React.FC = () => {
  const [floodAreas] = useState<FloodArea[]>(generateFloodAreas());
  const [flightSchedules] = useState<FlightSchedule[]>(generateFlightSchedules());
  const [notifications, setNotifications] = useState<Notification[]>(generateNotifications());
  
  const [selectedDrone, setSelectedDrone] = useState<string>('UAV_ALPHA');
  const [riskFilter, setRiskFilter] = useState<'all' | '>=3' | '>=4' | '>=5'>('all');
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Video Analysis State
  const [videoAnalysis, setVideoAnalysis] = useState<VideoAnalysis | null>(null);
  const [videoViewMode, setVideoViewMode] = useState<'detections' | 'segmentation' | 'both'>('both');
  const [isVideoActive, setIsVideoActive] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
      
      if (isVideoActive && selectedDrone) {
        setVideoAnalysis(generateVideoAnalysis(selectedDrone));
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [selectedDrone, isVideoActive]);

  // Calculate KPIs
  const kpis = useMemo(() => {
    const activeDrones = flightSchedules.filter(f => f.status === 'in_flight').length;
    const hotspotsToday = flightSchedules.reduce((sum, f) => sum + f.waypoints_completed, 0);
    const highRiskAreas = floodAreas.filter(a => a.current_risk_level >= 4).length;
    const openAlerts = notifications.filter(n => !n.acknowledged).length;

    return { activeDrones, hotspotsToday, highRiskAreas, openAlerts };
  }, [flightSchedules, floodAreas, notifications]);

  const filteredAreas = useMemo(() => {
    return floodAreas.filter(area => {
      if (riskFilter === 'all') return true;
      if (riskFilter === '>=3') return area.current_risk_level >= 3;
      if (riskFilter === '>=4') return area.current_risk_level >= 4;
      if (riskFilter === '>=5') return area.current_risk_level >= 5;
      return false;
    });
  }, [floodAreas, riskFilter]);

  const acknowledgeNotification = useCallback((notifId: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === notifId ? { ...n, acknowledged: true } : n
    ));
  }, []);

  return (
    <div className="h-screen flex flex-col text-sm font-sans" 
         style={{ 
           backgroundColor: theme.colors.primary[950], 
           color: theme.colors.neutral[100]
         }}>
      
      {/* Command Header */}
      <header className="h-16 flex items-center justify-between px-6 border-b" 
              style={{ 
                borderColor: theme.colors.primary[700], 
                backgroundColor: theme.colors.primary[900] 
              }}>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center" 
                 style={{ backgroundColor: theme.colors.accent.teal }}>
              <Command className="w-5 h-5" style={{ color: theme.colors.primary[950] }} />
            </div>
            <div>
              <div className="text-xs font-bold tracking-wider text-white">FLOOD OPERATIONS CENTER</div>
              <div className="text-xs" style={{ color: theme.colors.neutral[400] }}>
                VIDEO INTELLIGENCE SYSTEM
              </div>
            </div>
          </div>
          
          <nav className="flex gap-1">
            {['MONITOR', 'SCHEDULE', 'RESPOND', 'ANALYSIS', 'ADMIN'].map((tab, idx) => (
              <button 
                key={tab}
                className={`px-4 py-2 text-xs font-bold tracking-wider transition-colors ${
                  idx === 0 ? 'border-b-2 text-white' : 'text-gray-400 hover:text-white'
                }`}
                style={{ borderColor: idx === 0 ? theme.colors.accent.teal : 'transparent' }}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right font-mono">
            <div className="text-xs font-bold text-white">
              {currentTime.toLocaleTimeString('en-US', { hour12: false })}
            </div>
            <div className="text-xs" style={{ color: theme.colors.neutral[400] }}>
              {currentTime.toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full animate-pulse" 
                 style={{ backgroundColor: theme.colors.accent.green }}></div>
            <span className="text-xs font-bold text-white">OPERATIONAL</span>
          </div>
        </div>
      </header>

      {/* KPI Dashboard */}
      <div className="h-20 px-6 py-4 border-b grid grid-cols-4 gap-8" 
           style={{ 
             borderColor: theme.colors.primary[700], 
             backgroundColor: theme.colors.primary[900] 
           }}>
        
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 flex items-center justify-center rounded" 
               style={{ backgroundColor: `${theme.colors.accent.teal}20` }}>
            <Plane className="w-5 h-5" style={{ color: theme.colors.accent.teal }} />
          </div>
          <div>
            <div className="text-xs font-bold tracking-wide text-gray-300">DRONES ACTIVE</div>
            <div className="text-2xl font-bold text-white font-mono">{kpis.activeDrones}/5</div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-10 h-10 flex items-center justify-center rounded" 
               style={{ backgroundColor: `${theme.colors.accent.orange}20` }}>
            <Target className="w-5 h-5" style={{ color: theme.colors.accent.orange }} />
          </div>
          <div>
            <div className="text-xs font-bold tracking-wide text-gray-300">WAYPOINTS SAMPLED</div>
            <div className="text-2xl font-bold text-white font-mono">{kpis.hotspotsToday}</div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-10 h-10 flex items-center justify-center rounded" 
               style={{ backgroundColor: `${theme.colors.accent.red}20` }}>
            <AlertTriangle className="w-5 h-5" style={{ color: theme.colors.accent.red }} />
          </div>
          <div>
            <div className="text-xs font-bold tracking-wide text-gray-300">HIGH RISK AREAS</div>
            <div className="text-2xl font-bold text-white font-mono">{kpis.highRiskAreas}</div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-10 h-10 flex items-center justify-center rounded" 
               style={{ backgroundColor: `${theme.colors.accent.amber}20` }}>
            <Bell className="w-5 h-5" style={{ color: theme.colors.accent.amber }} />
          </div>
          <div>
            <div className="text-xs font-bold tracking-wide text-gray-300">OPEN ALERTS</div>
            <div className="text-2xl font-bold text-white font-mono">{kpis.openAlerts}</div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Left Panel - Flight Schedule */}
        <div className={`transition-all duration-300 border-r ${leftPanelOpen ? 'w-80' : 'w-0'} overflow-hidden`} 
             style={{ 
               borderColor: theme.colors.primary[700], 
               backgroundColor: theme.colors.primary[900] 
             }}>
          <div className="h-full flex flex-col">
            
            <div className="h-12 flex items-center justify-between px-4 border-b" 
                 style={{ borderColor: theme.colors.primary[700] }}>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" style={{ color: theme.colors.accent.teal }} />
                <span className="font-bold tracking-wide text-white">FLIGHT SCHEDULE</span>
              </div>
              <button
                onClick={() => setLeftPanelOpen(false)}
                className="lg:hidden p-1 hover:bg-white hover:bg-opacity-10 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {flightSchedules.map((flight) => (
                <div
                  key={flight.drone_id}
                  onClick={() => setSelectedDrone(flight.drone_id)}
                  className={`p-4 border-b cursor-pointer transition-all hover:bg-white hover:bg-opacity-5 ${
                    selectedDrone === flight.drone_id ? 'border-l-2' : ''
                  }`}
                  style={{ 
                    borderColor: theme.colors.primary[700],
                    borderLeftColor: selectedDrone === flight.drone_id ? theme.colors.accent.teal : 'transparent',
                    backgroundColor: selectedDrone === flight.drone_id ? `${theme.colors.accent.teal}10` : 'transparent'
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 flex items-center justify-center rounded text-xs font-bold ${
                        flight.status === 'in_flight' ? 'animate-pulse' : ''
                      }`} 
                           style={{ 
                             backgroundColor: flight.status === 'in_flight' ? theme.colors.accent.teal : 
                                            flight.status === 'completed' ? theme.colors.accent.green : 
                                            theme.colors.accent.amber,
                             color: theme.colors.primary[950]
                           }}>
                        {flight.status === 'in_flight' ? <Plane className="w-3 h-3" /> : 
                         flight.status === 'completed' ? <CheckCircle2 className="w-3 h-3" /> : 
                         <Clock className="w-3 h-3" />}
                      </div>
                      <div>
                        <div className="font-bold text-white">{flight.drone_id}</div>
                        <div className="text-xs text-gray-400">{flight.mission_id}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-mono text-white">
                        {formatTimestamp(flight.start_time)}
                      </div>
                      <div className="text-xs text-gray-400">
                        {flight.status.replace('_', ' ').toUpperCase()}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">WAYPOINTS</span>
                      <span className="font-mono text-white">
                        {flight.waypoints_completed}/{flight.total_waypoints}
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-1">
                      <div 
                        className="h-1 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${(flight.waypoints_completed / flight.total_waypoints) * 100}%`,
                          backgroundColor: theme.colors.accent.teal 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center - Video Analysis & Map */}
        <div className="flex-1 flex flex-col">
          
          {/* Video Feed Section */}
          <div className="h-80 border-b" style={{ borderColor: theme.colors.primary[700] }}>
            <div className="h-full flex">
              
              {/* Video Stream */}
              <div className="flex-1 relative" style={{ backgroundColor: theme.colors.primary[950] }}>
                
                {/* Video Controls */}
                <div className="absolute top-4 left-4 z-20 flex gap-2">
                  <button
                    onClick={() => setLeftPanelOpen(!leftPanelOpen)}
                    className="p-2 rounded transition-colors hover:bg-white hover:bg-opacity-10"
                    style={{ backgroundColor: theme.colors.primary[800] }}
                  >
                    <Menu className="w-4 h-4 text-white" />
                  </button>
                  
                  <div className="flex bg-black bg-opacity-50 rounded overflow-hidden">
                    <button
                      onClick={() => setVideoViewMode('detections')}
                      className={`px-3 py-2 text-xs font-bold transition-colors ${
                        videoViewMode === 'detections' ? 'text-black' : 'text-white hover:bg-white hover:bg-opacity-10'
                      }`}
                      style={{ 
                        backgroundColor: videoViewMode === 'detections' ? theme.colors.accent.red : 'transparent' 
                      }}
                    >
                      DETECTION
                    </button>
                    <button
                      onClick={() => setVideoViewMode('segmentation')}
                      className={`px-3 py-2 text-xs font-bold transition-colors ${
                        videoViewMode === 'segmentation' ? 'text-black' : 'text-white hover:bg-white hover:bg-opacity-10'
                      }`}
                      style={{ 
                        backgroundColor: videoViewMode === 'segmentation' ? theme.colors.accent.teal : 'transparent' 
                      }}
                    >
                      SEGMENT
                    </button>
                    <button
                      onClick={() => setVideoViewMode('both')}
                      className={`px-3 py-2 text-xs font-bold transition-colors ${
                        videoViewMode === 'both' ? 'text-black' : 'text-white hover:bg-white hover:bg-opacity-10'
                      }`}
                      style={{ 
                        backgroundColor: videoViewMode === 'both' ? theme.colors.accent.orange : 'transparent' 
                      }}
                    >
                      BOTH
                    </button>
                  </div>

                  <button
                    onClick={() => setIsVideoActive(!isVideoActive)}
                    className={`px-3 py-2 text-xs font-bold transition-colors flex items-center gap-2 ${
                      isVideoActive ? 'text-black' : 'text-white'
                    }`}
                    style={{ 
                      backgroundColor: isVideoActive ? theme.colors.accent.green : theme.colors.primary[800] 
                    }}
                  >
                    {isVideoActive ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                    {isVideoActive ? 'LIVE' : 'PAUSED'}
                  </button>
                </div>

                {/* Video Feed Display */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-full h-full max-w-2xl max-h-full bg-black rounded-lg overflow-hidden">
                    
                    {/* Mock Video Background */}
                    <div className="w-full h-full bg-gradient-to-br from-blue-900 to-slate-800 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 border-2 border-dashed rounded-full flex items-center justify-center animate-spin"
                             style={{ borderColor: theme.colors.accent.teal }}>
                          <Activity className="w-8 h-8" style={{ color: theme.colors.accent.teal }} />
                        </div>
                        <div className="text-sm font-mono text-white mb-2">
                          LIVE FEED - {selectedDrone}
                        </div>
                        <div className="text-xs font-mono text-gray-400">
                          1920x1080 • 30 FPS • {Math.round(Math.random() * 50 + 20)}ms LATENCY
                        </div>
                      </div>
                    </div>

                    {/* AI Analysis Overlays */}
                    {videoAnalysis && isVideoActive && (
                      <div className="absolute inset-0">
                        
                        {/* Segmentation Overlays */}
                        {(videoViewMode === 'segmentation' || videoViewMode === 'both') && 
                          videoAnalysis.segmentations.map(seg => (
                            <div
                              key={seg.id}
                              className="absolute border-2 border-dashed animate-pulse"
                              style={{
                                left: `${Math.random() * 60 + 10}%`,
                                top: `${Math.random() * 60 + 10}%`,
                                width: `${20 + Math.random() * 30}%`,
                                height: `${15 + Math.random() * 20}%`,
                                borderColor: seg.color,
                                backgroundColor: `${seg.color}30`
                              }}
                            >
                              <div className="absolute -top-6 left-0 text-xs font-mono font-bold px-2 py-1 rounded text-white"
                                   style={{ backgroundColor: seg.color }}>
                                {seg.class_name.toUpperCase()} {Math.round(seg.confidence * 100)}%
                              </div>
                            </div>
                          ))
                        }

                        {/* Detection Bounding Boxes */}
                        {(videoViewMode === 'detections' || videoViewMode === 'both') && 
                          videoAnalysis.detections.map(det => (
                            <div
                              key={det.id}
                              className="absolute border-2"
                              style={{
                                left: `${det.x / 8}%`,
                                top: `${det.y / 6}%`,
                                width: `${det.width / 8}%`,
                                height: `${det.height / 6}%`,
                                borderColor: det.color
                              }}
                            >
                              <div className="absolute -top-6 left-0 text-xs font-mono font-bold px-2 py-1 text-white"
                                   style={{ backgroundColor: det.color }}>
                                {det.class_name.toUpperCase()} {Math.round(det.confidence * 100)}%
                              </div>
                              
                              {det.confidence > 0.8 && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <Crosshair className="w-4 h-4" style={{ color: det.color }} />
                                </div>
                              )}
                            </div>
                          ))
                        }
                      </div>
                    )}

                    {/* Video Status Bar */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-black bg-opacity-80 text-white">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full animate-pulse bg-red-500"></div>
                            <span>REC</span>
                          </div>
                          <span>{currentTime.toLocaleTimeString('en-US', { hour12: false })}</span>
                          <span>FRAME #{Math.floor(Math.random() * 9999)}</span>
                        </div>
                        
                        {videoAnalysis && (
                          <div className="flex items-center gap-4">
                            <span>OBJECTS: {videoAnalysis.detections.length}</span>
                            <span>SEGMENTS: {videoAnalysis.segmentations.length}</span>
                            <span>PROC: {videoAnalysis.metadata.processing_time_ms.toFixed(0)}ms</span>
                            <span className={`px-2 py-1 rounded ${
                              videoAnalysis.metadata.frame_quality === 'excellent' ? 'bg-green-600' :
                              videoAnalysis.metadata.frame_quality === 'good' ? 'bg-blue-600' :
                              videoAnalysis.metadata.frame_quality === 'poor' ? 'bg-orange-600' : 'bg-red-600'
                            }`}>
                              {videoAnalysis.metadata.frame_quality.toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Video Analysis Stats */}
              <div className="w-80 border-l" style={{ 
                borderColor: theme.colors.primary[700], 
                backgroundColor: theme.colors.primary[900] 
              }}>
                <div className="p-4 h-full flex flex-col">
                  <div className="flex items-center gap-2 mb-4">
                    <Eye className="w-4 h-4" style={{ color: theme.colors.accent.purple }} />
                    <span className="font-bold tracking-wide text-white">VIDEO ANALYSIS</span>
                  </div>

                  {videoAnalysis && (
                    <div className="space-y-4 flex-1 overflow-y-auto">
                      
                      {/* Model Info */}
                      <div className="p-3 rounded" style={{ backgroundColor: theme.colors.primary[800] }}>
                        <div className="text-xs font-bold text-white mb-2">MODEL STATUS</div>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span className="text-gray-400">VERSION</span>
                            <span className="font-mono text-white">{videoAnalysis.metadata.model_version}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">PROCESSING</span>
                            <span className="font-mono text-white">{videoAnalysis.metadata.processing_time_ms.toFixed(0)}ms</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">QUALITY</span>
                            <span className={`font-mono ${
                              videoAnalysis.metadata.frame_quality === 'excellent' ? 'text-green-400' :
                              videoAnalysis.metadata.frame_quality === 'good' ? 'text-blue-400' :
                              videoAnalysis.metadata.frame_quality === 'poor' ? 'text-orange-400' : 'text-red-400'
                            }`}>
                              {videoAnalysis.metadata.frame_quality.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Detection Results */}
                      <div className="p-3 rounded" style={{ backgroundColor: theme.colors.primary[800] }}>
                        <div className="text-xs font-bold text-white mb-2">
                          DETECTIONS ({videoAnalysis.detections.length})
                        </div>
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                          {videoAnalysis.detections.map(det => (
                            <div key={det.id} className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded" style={{ backgroundColor: det.color }}></div>
                                <span className="text-xs font-mono text-white uppercase">
                                  {det.class_name}
                                </span>
                              </div>
                              <span className="text-xs font-mono" style={{ color: det.color }}>
                                {Math.round(det.confidence * 100)}%
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Segmentation Results */}
                      <div className="p-3 rounded" style={{ backgroundColor: theme.colors.primary[800] }}>
                        <div className="text-xs font-bold text-white mb-2">
                          SEGMENTATIONS ({videoAnalysis.segmentations.length})
                        </div>
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                          {videoAnalysis.segmentations.map(seg => (
                            <div key={seg.id} className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded border-2 border-dashed" 
                                     style={{ borderColor: seg.color, backgroundColor: `${seg.color}30` }}></div>
                                <span className="text-xs font-mono text-white uppercase">
                                  {seg.class_name}
                                </span>
                              </div>
                              <span className="text-xs font-mono" style={{ color: seg.color }}>
                                {Math.round(seg.confidence * 100)}%
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Tactical Map Section */}
          <div className="flex-1 relative" style={{ backgroundColor: theme.colors.primary[950] }}>
            
            {/* Map Controls */}
            <div className="absolute top-4 left-4 z-20 flex gap-2">
              <div className="flex bg-black bg-opacity-30 rounded overflow-hidden">
                {(['all', '>=3', '>=4', '>=5'] as const).map(filter => (
                  <button
                    key={filter}
                    onClick={() => setRiskFilter(filter)}
                    className={`px-3 py-2 text-xs font-bold transition-colors ${
                      riskFilter === filter ? 'text-black' : 'text-white hover:bg-white hover:bg-opacity-10'
                    }`}
                    style={{ 
                      backgroundColor: riskFilter === filter ? theme.colors.accent.teal : 'transparent' 
                    }}
                  >
                    RISK {filter.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Mock Map Elements */}
            {filteredAreas.slice(0, 4).map((area, idx) => {
              const riskScheme = getRiskColorScheme(area.current_risk_level);
              return (
                <div
                  key={area.id}
                  className={`absolute border-2 transition-all cursor-pointer hover:opacity-80 ${
                    area.is_escalated ? 'animate-pulse' : ''
                  }`}
                  style={{
                    left: `${15 + idx * 18}%`,
                    top: `${25 + idx * 12}%`,
                    width: '120px',
                    height: '80px',
                    borderColor: riskScheme.color,
                    backgroundColor: riskScheme.bg
                  }}
                >
                  <div className="absolute -top-6 left-0 text-xs font-mono font-bold px-2 py-1 rounded text-white"
                       style={{ backgroundColor: theme.colors.primary[800] }}>
                    {area.name.split('_')[0]}
                  </div>
                  <div className="absolute bottom-1 right-1 text-xs font-bold px-1 rounded"
                       style={{ 
                         backgroundColor: riskScheme.color, 
                         color: theme.colors.primary[950] 
                       }}>
                    L{area.current_risk_level}
                  </div>
                </div>
              );
            })}

            {/* Active Drones */}
            {flightSchedules.filter(f => f.status === 'in_flight').map((flight, idx) => (
              <div
                key={flight.drone_id}
                onClick={() => setSelectedDrone(flight.drone_id)}
                className={`absolute transition-all cursor-pointer hover:scale-110 ${
                  selectedDrone === flight.drone_id ? 'animate-pulse' : ''
                }`}
                style={{
                  left: `${30 + idx * 25}%`,
                  top: `${40 + idx * 8}%`
                }}
              >
                <div className="relative p-3 rounded border-2"
                     style={{ 
                       borderColor: selectedDrone === flight.drone_id ? theme.colors.accent.teal : theme.colors.accent.green,
                       backgroundColor: `${theme.colors.accent.teal}20`
                     }}>
                  <Plane className="w-6 h-6" style={{ color: theme.colors.accent.teal }} />
                  
                  <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full animate-pulse"
                       style={{ backgroundColor: theme.colors.accent.green }} />
                </div>
                
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded text-xs font-mono font-bold text-white"
                     style={{ backgroundColor: theme.colors.primary[800] }}>
                  {flight.drone_id.split('_')[1]}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel - Intelligence */}
        <div className={`transition-all duration-300 border-l ${rightPanelOpen ? 'w-80' : 'w-0'} overflow-hidden`}
             style={{ 
               borderColor: theme.colors.primary[700], 
               backgroundColor: theme.colors.primary[900] 
             }}>
          <div className="h-full flex flex-col">
            
            <div className="h-12 flex items-center justify-between px-4 border-b" 
                 style={{ borderColor: theme.colors.primary[700] }}>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" style={{ color: theme.colors.accent.purple }} />
                <span className="font-bold tracking-wide text-white">INTELLIGENCE</span>
              </div>
              <button
                onClick={() => setRightPanelOpen(false)}
                className="lg:hidden p-1 hover:bg-white hover:bg-opacity-10 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {/* Selected Drone Info */}
              <div className="p-3 mb-4 rounded" style={{ backgroundColor: theme.colors.primary[800] }}>
                <div className="flex items-center gap-2 mb-3">
                  <Plane className="w-4 h-4" style={{ color: theme.colors.accent.teal }} />
                  <span className="font-bold text-white">{selectedDrone}</span>
                </div>
                
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400">STATUS</span>
                    <span className="font-mono text-cyan-400">IN_FLIGHT</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">BATTERY</span>
                    <span className="font-mono text-white">{75 + Math.floor(Math.random() * 20)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">LINK QUALITY</span>
                    <span className="font-mono text-green-400">EXCELLENT</span>
                  </div>
                </div>
              </div>

              {/* Video Feed Info */}
              <div className="p-3 mb-4 rounded" style={{ backgroundColor: theme.colors.primary[800] }}>
                <div className="flex items-center gap-2 mb-3">
                  <Activity className="w-4 h-4" style={{ color: theme.colors.accent.orange }} />
                  <span className="font-bold text-white">VIDEO FEED</span>
                </div>
                
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400">RESOLUTION</span>
                    <span className="font-mono text-white">1920x1080</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">FRAMERATE</span>
                    <span className="font-mono text-white">30 FPS</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">LATENCY</span>
                    <span className="font-mono text-green-400">{Math.round(Math.random() * 30 + 15)}ms</span>
                  </div>
                </div>
              </div>

              {/* Analysis Summary */}
              {videoAnalysis && (
                <div className="p-3 rounded" style={{ backgroundColor: theme.colors.primary[800] }}>
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="w-4 h-4" style={{ color: theme.colors.accent.purple }} />
                    <span className="font-bold text-white">ANALYSIS SUMMARY</span>
                  </div>
                  
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-400">OBJECTS DETECTED</span>
                      <span className="font-mono text-white">{videoAnalysis.detections.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">AREAS SEGMENTED</span>
                      <span className="font-mono text-white">{videoAnalysis.segmentations.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">CONFIDENCE AVG</span>
                      <span className="font-mono text-green-400">
                        {Math.round(videoAnalysis.detections.reduce((sum, d) => sum + d.confidence, 0) / videoAnalysis.detections.length * 100) || 0}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">PROCESSING TIME</span>
                      <span className="font-mono text-white">{videoAnalysis.metadata.processing_time_ms.toFixed(0)}ms</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Panel Toggle Button */}
        <button
          onClick={() => setRightPanelOpen(!rightPanelOpen)}
          className="lg:hidden absolute top-4 right-4 z-20 p-2 rounded transition-colors hover:bg-white hover:bg-opacity-10"
          style={{ backgroundColor: theme.colors.primary[800] }}
        >
          <Eye className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Bottom Notifications Bar */}
      <div className="h-16 border-t px-6 flex items-center justify-between" 
           style={{ 
             borderColor: theme.colors.primary[700], 
             backgroundColor: theme.colors.primary[900] 
           }}>
        
        <div className="flex items-center gap-4 flex-1">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4" style={{ color: theme.colors.accent.amber }} />
            <span className="font-bold text-white">ALERTS</span>
          </div>
          
          <div className="flex gap-2 overflow-x-auto">
            {notifications.slice(0, 3).map(notification => (
              <button
                key={notification.id}
                onClick={() => acknowledgeNotification(notification.id)}
                className={`px-3 py-2 rounded text-xs font-mono whitespace-nowrap transition-all hover:opacity-80 ${
                  notification.acknowledged ? 'opacity-50' : ''
                }`}
                style={{ 
                  backgroundColor: notification.severity === 'critical' ? theme.colors.accent.red :
                                 notification.severity === 'warning' ? theme.colors.accent.orange :
                                 theme.colors.accent.teal,
                  color: theme.colors.primary[950]
                }}
              >
                <div className="flex items-center gap-2">
                  {notification.severity === 'critical' && <AlertCircle className="w-3 h-3" />}
                  {notification.severity === 'warning' && <AlertTriangle className="w-3 h-3" />}
                  {notification.severity === 'info' && <CheckCircle2 className="w-3 h-3" />}
                  <span>{notification.title}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-xs font-mono text-gray-400">
            {notifications.filter(n => !n.acknowledged).length} UNREAD
          </div>
          <div className="w-2 h-2 rounded-full animate-pulse" 
               style={{ backgroundColor: theme.colors.accent.teal }}></div>
        </div>
      </div>
    </div>
  );
};

export default FloodDroneMonitoringSystem;