import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Map,
  Route,
  Clock,
  Plus,
  Settings,
  Zap,
  Upload,
  Download,
  Save,
  Play,
  Pause,
  RotateCcw,
  Target,
  Navigation,
  MapPin,
  Plane,
  Battery,
  Fuel,
  Timer,
  Users,
  Calendar,
  FileText,
  Layers,
  Grid3X3,
  Crosshair,
  AlertTriangle,
  CheckCircle2,
  Command,
  Brain,
  Shuffle,
  Copy,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  MoreHorizontal,
  ChevronDown,
  ChevronRight,
  X,
  Menu,
  BarChart3
} from 'lucide-react';

// Design System
const theme = {
  colors: {
    primary: {
      950: '#020617',
      900: '#0F172A', 
      800: '#1E293B',
      700: '#334155',
      600: '#475569'
    },
    accent: {
      teal: '#06B6D4',
      orange: '#F97316',
      red: '#DC2626',
      amber: '#D97706',
      green: '#059669',
      purple: '#7C3AED',
      blue: '#2563EB'
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
type Waypoint = {
  id: string;
  lat: number;
  lon: number;
  alt_m: number;
  action: 'transit' | 'hover' | 'sample' | 'survey' | 'loiter';
  duration_s: number;
  speed_mps: number;
  parameters?: {
    sample_depth?: boolean;
    capture_photos?: boolean;
    video_duration_s?: number;
    sensor_reading?: boolean;
  };
};

type Mission = {
  id: string;
  name: string;
  description: string;
  drone_id: string;
  waypoints: Waypoint[];
  estimated_duration_min: number;
  estimated_battery_usage_pct: number;
  priority: 'low' | 'normal' | 'high' | 'critical';
  status: 'draft' | 'planned' | 'approved' | 'active' | 'completed';
  created_at: string;
  scheduled_start?: string;
  template_id?: string;
};

type MissionTemplate = {
  id: string;
  name: string;
  description: string;
  category: 'survey' | 'patrol' | 'emergency' | 'monitoring';
  waypoints_template: Omit<Waypoint, 'id' | 'lat' | 'lon'>[];
  estimated_area_km2?: number;
  recommended_altitude_m: number;
  icon: string;
};

type Drone = {
  id: string;
  name: string;
  status: 'available' | 'busy' | 'maintenance' | 'offline';
  battery_pct: number;
  max_flight_time_min: number;
  current_location?: { lat: number; lon: number };
  capabilities: string[];
};

type AIOptimization = {
  is_running: boolean;
  progress: number;
  suggestions: {
    id: string;
    type: 'route_optimization' | 'battery_optimization' | 'time_optimization' | 'coverage_optimization';
    description: string;
    estimated_improvement: string;
    confidence: number;
  }[];
};

// Mock Data
const mockDrones: Drone[] = [
  { id: 'UAV_ALPHA', name: 'Alpha Scout', status: 'available', battery_pct: 85, max_flight_time_min: 45, capabilities: ['camera', 'lidar', 'water_sensor'] },
  { id: 'UAV_BRAVO', name: 'Bravo Survey', status: 'available', battery_pct: 92, max_flight_time_min: 60, capabilities: ['camera', 'thermal', 'gps'] },
  { id: 'UAV_CHARLIE', name: 'Charlie Patrol', status: 'busy', battery_pct: 45, max_flight_time_min: 40, capabilities: ['camera', 'night_vision'] },
  { id: 'UAV_DELTA', name: 'Delta Monitor', status: 'available', battery_pct: 78, max_flight_time_min: 55, capabilities: ['camera', 'water_sensor', 'weather'] },
  { id: 'UAV_ECHO', name: 'Echo Rescue', status: 'maintenance', battery_pct: 0, max_flight_time_min: 50, capabilities: ['camera', 'thermal', 'speaker'] }
];

const missionTemplates: MissionTemplate[] = [
  {
    id: 'template_flood_survey',
    name: 'Flood Area Survey',
    description: 'Comprehensive flood zone assessment with water level sampling',
    category: 'survey',
    waypoints_template: [
      { action: 'transit', duration_s: 0, speed_mps: 12, alt_m: 50 },
      { action: 'survey', duration_s: 120, speed_mps: 6, alt_m: 30, parameters: { capture_photos: true, sample_depth: true } },
      { action: 'sample', duration_s: 30, speed_mps: 0, alt_m: 15, parameters: { sensor_reading: true } },
      { action: 'transit', duration_s: 0, speed_mps: 12, alt_m: 50 }
    ],
    estimated_area_km2: 2.5,
    recommended_altitude_m: 30,
    icon: '🌊'
  },
  {
    id: 'template_perimeter_patrol',
    name: 'Perimeter Patrol',
    description: 'Systematic boundary patrol with anomaly detection',
    category: 'patrol',
    waypoints_template: [
      { action: 'transit', duration_s: 0, speed_mps: 10, alt_m: 40 },
      { action: 'loiter', duration_s: 60, speed_mps: 8, alt_m: 35, parameters: { capture_photos: true } },
      { action: 'transit', duration_s: 0, speed_mps: 10, alt_m: 40 }
    ],
    recommended_altitude_m: 35,
    icon: '🛡️'
  },
  {
    id: 'template_emergency_response',
    name: 'Emergency Response',
    description: 'Rapid deployment for emergency situations',
    category: 'emergency',
    waypoints_template: [
      { action: 'transit', duration_s: 0, speed_mps: 15, alt_m: 60 },
      { action: 'hover', duration_s: 180, speed_mps: 0, alt_m: 25, parameters: { capture_photos: true, video_duration_s: 180 } },
      { action: 'sample', duration_s: 45, speed_mps: 0, alt_m: 20, parameters: { sensor_reading: true } }
    ],
    recommended_altitude_m: 25,
    icon: '🚨'
  },
  {
    id: 'template_continuous_monitor',
    name: 'Continuous Monitoring',
    description: 'Long-term area monitoring with regular data collection',
    category: 'monitoring',
    waypoints_template: [
      { action: 'transit', duration_s: 0, speed_mps: 8, alt_m: 45 },
      { action: 'loiter', duration_s: 300, speed_mps: 5, alt_m: 40, parameters: { capture_photos: true, sensor_reading: true } },
      { action: 'sample', duration_s: 60, speed_mps: 0, alt_m: 25, parameters: { sample_depth: true } }
    ],
    recommended_altitude_m: 40,
    icon: '📊'
  }
];

// Utility Functions
const generateWaypoint = (lat?: number, lon?: number): Waypoint => ({
  id: `wp_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
  lat: lat || 37.5665 + (Math.random() - 0.5) * 0.02,
  lon: lon || 126.9780 + (Math.random() - 0.5) * 0.02,
  alt_m: 30 + Math.random() * 40,
  action: 'transit',
  duration_s: 0,
  speed_mps: 10
});

const calculateMissionStats = (waypoints: Waypoint[]) => {
  let totalDistance = 0;
  let totalTime = 0;
  
  for (let i = 0; i < waypoints.length - 1; i++) {
    const current = waypoints[i];
    const next = waypoints[i + 1];
    
    // Simplified distance calculation
    const distance = Math.sqrt(
      Math.pow((next.lat - current.lat) * 111000, 2) + 
      Math.pow((next.lon - current.lon) * 85000, 2)
    );
    
    totalDistance += distance;
    totalTime += (distance / current.speed_mps) + current.duration_s;
  }
  
  const estimatedBattery = Math.min(100, (totalTime / 60) * 2.5); // Rough estimation
  
  return {
    distance_m: totalDistance,
    duration_min: totalTime / 60,
    estimated_battery_pct: estimatedBattery
  };
};

const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = Math.floor(minutes % 60);
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m`;
};

// Main Component
const MissionPlanningSystem: React.FC = () => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [selectedMissionId, setSelectedMissionId] = useState<string | null>(null);
  const [currentMission, setCurrentMission] = useState<Mission | null>(null);
  
  // UI States
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [showTemplates, setShowTemplates] = useState(false);
  const [planningMode, setPlanningMode] = useState<'manual' | 'ai' | 'import'>('manual');
  
  // AI Optimization
  const [aiOptimization, setAIOptimization] = useState<AIOptimization>({
    is_running: false,
    progress: 0,
    suggestions: []
  });
  
  // Map interaction
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [selectedWaypointId, setSelectedWaypointId] = useState<string | null>(null);
  
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Create new mission
  const createNewMission = useCallback((templateId?: string) => {
    const template = templateId ? missionTemplates.find(t => t.id === templateId) : null;
    const baseWaypoints = template ? 
      template.waypoints_template.map((wpt, idx) => ({
        ...generateWaypoint(37.5665 + idx * 0.01, 126.9780 + idx * 0.008),
        ...wpt,
        id: `wp_${Date.now()}_${idx}`
      })) : 
      [
        generateWaypoint(37.5665, 126.9780),
        generateWaypoint(37.5675, 126.9790), 
        generateWaypoint(37.5685, 126.9800)
      ];

    const stats = calculateMissionStats(baseWaypoints);
    
    const newMission: Mission = {
      id: `mission_${Date.now()}`,
      name: template ? `${template.name} - ${new Date().toLocaleDateString()}` : `New Mission - ${new Date().toLocaleTimeString()}`,
      description: template?.description || 'Custom mission plan - click to edit details',
      drone_id: mockDrones.find(d => d.status === 'available')?.id || 'UAV_ALPHA',
      waypoints: baseWaypoints,
      estimated_duration_min: stats.duration_min,
      estimated_battery_usage_pct: stats.estimated_battery_pct,
      priority: 'normal',
      status: 'draft',
      created_at: new Date().toISOString(),
      template_id: templateId
    };
    
    setMissions(prev => [newMission, ...prev]); // Add to front for visibility
    setSelectedMissionId(newMission.id);
    setCurrentMission(newMission);
    setShowTemplates(false);
    
    // Auto-select first waypoint for immediate editing
    setTimeout(() => {
      setSelectedWaypointId(baseWaypoints[0].id);
    }, 100);
  }, []);

  // Update mission
  const updateMission = useCallback((missionId: string, updates: Partial<Mission>) => {
    setMissions(prev => prev.map(m => 
      m.id === missionId ? { ...m, ...updates } : m
    ));
    
    if (currentMission?.id === missionId) {
      setCurrentMission(prev => prev ? { ...prev, ...updates } : null);
    }
  }, [currentMission?.id]);

  // Add waypoint
  const addWaypoint = useCallback((afterIndex?: number) => {
    if (!currentMission) return;
    
    const newWaypoint = generateWaypoint();
    const waypoints = [...currentMission.waypoints];
    const insertIndex = afterIndex !== undefined ? afterIndex + 1 : waypoints.length;
    waypoints.splice(insertIndex, 0, newWaypoint);
    
    const stats = calculateMissionStats(waypoints);
    updateMission(currentMission.id, {
      waypoints,
      estimated_duration_min: stats.duration_min,
      estimated_battery_usage_pct: stats.estimated_battery_pct
    });
  }, [currentMission, updateMission]);

  // Remove waypoint
  const removeWaypoint = useCallback((waypointId: string) => {
    if (!currentMission) return;
    
    const waypoints = currentMission.waypoints.filter(wp => wp.id !== waypointId);
    const stats = calculateMissionStats(waypoints);
    
    updateMission(currentMission.id, {
      waypoints,
      estimated_duration_min: stats.duration_min,
      estimated_battery_usage_pct: stats.estimated_battery_pct
    });
  }, [currentMission, updateMission]);

  // AI Optimization
  const runAIOptimization = useCallback(() => {
    if (!currentMission) return;
    
    setAIOptimization(prev => ({ ...prev, is_running: true, progress: 0 }));
    
    // Simulate AI optimization process
    const interval = setInterval(() => {
      setAIOptimization(prev => {
        const newProgress = prev.progress + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          
          // Generate mock suggestions
          const suggestions = [
            {
              id: 'opt_1',
              type: 'route_optimization' as const,
              description: 'Reorder waypoints to reduce total flight distance by 23%',
              estimated_improvement: '-8.2km, -12min',
              confidence: 0.89
            },
            {
              id: 'opt_2', 
              type: 'battery_optimization' as const,
              description: 'Adjust altitude profile to optimize battery consumption',
              estimated_improvement: '-15% battery usage',
              confidence: 0.76
            },
            {
              id: 'opt_3',
              type: 'time_optimization' as const,
              description: 'Optimize speed profile for critical waypoints',
              estimated_improvement: '-7min total time',
              confidence: 0.82
            }
          ];
          
          return { is_running: false, progress: 100, suggestions };
        }
        return { ...prev, progress: newProgress };
      });
    }, 200);
  }, [currentMission]);

  const selectedMission = selectedMissionId ? missions.find(m => m.id === selectedMissionId) || currentMission : currentMission;

  return (
    <div className="h-screen flex flex-col font-sans text-sm" 
         style={{ 
           backgroundColor: theme.colors.primary[950], 
           color: theme.colors.neutral[100]
         }}>
      
      {/* Header */}
      <header className="h-16 flex items-center justify-between px-6 border-b" 
              style={{ 
                borderColor: theme.colors.primary[700], 
                backgroundColor: theme.colors.primary[900] 
              }}>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center rounded" 
                 style={{ backgroundColor: theme.colors.accent.blue }}>
              <Route className="w-5 h-5" style={{ color: theme.colors.primary[950] }} />
            </div>
            <div>
              <div className="text-xs font-bold tracking-wider text-white">MISSION PLANNING CENTER</div>
              <div className="text-xs" style={{ color: theme.colors.neutral[400] }}>
                AI-POWERED ROUTE OPTIMIZATION
              </div>
            </div>
          </div>
          
          {/* Planning Mode Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">MODE:</span>
            <div className="flex bg-black bg-opacity-30 rounded overflow-hidden">
              {(['manual', 'ai', 'import'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => setPlanningMode(mode)}
                  className={`px-3 py-2 text-xs font-bold transition-colors ${
                    planningMode === mode ? 'text-black' : 'text-white hover:bg-white hover:bg-opacity-10'
                  }`}
                  style={{ 
                    backgroundColor: planningMode === mode ? 
                      (mode === 'manual' ? theme.colors.accent.green :
                       mode === 'ai' ? theme.colors.accent.purple :
                       theme.colors.accent.amber) : 'transparent' 
                  }}
                >
                  {mode === 'manual' && <Edit3 className="w-3 h-3 mr-1" />}
                  {mode === 'ai' && <Brain className="w-3 h-3 mr-1" />}
                  {mode === 'import' && <Upload className="w-3 h-3 mr-1" />}
                  {mode.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
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
                 style={{ backgroundColor: theme.colors.accent.blue }}></div>
            <span className="text-xs font-bold text-white">PLANNING</span>
          </div>
        </div>
      </header>

      {/* Control Bar */}
      <div className="h-14 px-6 py-2 border-b flex items-center justify-between" 
           style={{ 
             borderColor: theme.colors.primary[700], 
             backgroundColor: theme.colors.primary[900] 
           }}>
        
        <div className="flex items-center gap-4">
          {/* New Mission */}
          <button
            onClick={() => setShowTemplates(true)}
            className="flex items-center gap-2 px-4 py-2 rounded text-xs font-bold transition-colors text-white hover:bg-white hover:bg-opacity-10"
            style={{ backgroundColor: theme.colors.accent.green }}
          >
            <Plus className="w-3 h-3" />
            NEW MISSION
          </button>

          {/* Templates */}
          <button
            onClick={() => setShowTemplates(!showTemplates)}
            className={`flex items-center gap-2 px-4 py-2 rounded text-xs font-bold transition-colors ${
              showTemplates ? 'text-black' : 'text-white'
            }`}
            style={{ 
              backgroundColor: showTemplates ? theme.colors.accent.amber : theme.colors.primary[800] 
            }}
          >
            <FileText className="w-3 h-3" />
            TEMPLATES
          </button>

          {/* AI Optimization */}
          {selectedMission && (
            <button
              onClick={runAIOptimization}
              disabled={aiOptimization.is_running}
              className={`flex items-center gap-2 px-4 py-2 rounded text-xs font-bold transition-colors ${
                aiOptimization.is_running ? 'text-gray-400' : 'text-black'
              }`}
              style={{ 
                backgroundColor: aiOptimization.is_running ? theme.colors.neutral[500] : theme.colors.accent.purple
              }}
            >
              <Brain className="w-3 h-3" />
              {aiOptimization.is_running ? `AI OPTIMIZING... ${aiOptimization.progress}%` : 'AI OPTIMIZE'}
            </button>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* Drawing Mode */}
          {selectedMission && (
            <button
              onClick={() => setIsDrawingMode(!isDrawingMode)}
              className={`flex items-center gap-2 px-3 py-2 rounded text-xs font-bold transition-colors ${
                isDrawingMode ? 'text-black' : 'text-white'
              }`}
              style={{ 
                backgroundColor: isDrawingMode ? theme.colors.accent.orange : theme.colors.primary[800] 
              }}
            >
              <Crosshair className="w-3 h-3" />
              {isDrawingMode ? 'DRAWING ON' : 'DRAW MODE'}
            </button>
          )}

          {/* Save Mission */}
          {selectedMission && selectedMission.status === 'draft' && (
            <button
              onClick={() => updateMission(selectedMission.id, { status: 'planned' })}
              className="flex items-center gap-2 px-3 py-2 rounded text-xs font-bold transition-colors text-black"
              style={{ backgroundColor: theme.colors.accent.teal }}
            >
              <Save className="w-3 h-3" />
              SAVE PLAN
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Left Panel - Mission List & Templates */}
        <div className={`transition-all duration-300 border-r ${leftPanelOpen ? 'w-80' : 'w-0'} overflow-hidden`} 
             style={{ 
               borderColor: theme.colors.primary[700], 
               backgroundColor: theme.colors.primary[900] 
             }}>
          <div className="h-full flex flex-col">
            
            {/* Panel Header */}
            <div className="h-12 flex items-center justify-between px-4 border-b" 
                 style={{ borderColor: theme.colors.primary[700] }}>
              <div className="flex items-center gap-2">
                {showTemplates ? (
                  <>
                    <FileText className="w-4 h-4" style={{ color: theme.colors.accent.amber }} />
                    <span className="font-bold tracking-wide text-white">MISSION TEMPLATES</span>
                  </>
                ) : (
                  <>
                    <Calendar className="w-4 h-4" style={{ color: theme.colors.accent.blue }} />
                    <span className="font-bold tracking-wide text-white">MISSION LIST</span>
                  </>
                )}
              </div>
              <button
                onClick={() => setLeftPanelOpen(false)}
                className="lg:hidden p-1 hover:bg-white hover:bg-opacity-10 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Templates View */}
            {showTemplates ? (
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {missionTemplates.map(template => (
                  <div
                    key={template.id}
                    onClick={() => createNewMission(template.id)}
                    className="p-4 rounded-lg cursor-pointer transition-all hover:bg-white hover:bg-opacity-5 border border-transparent hover:border-white hover:border-opacity-20"
                    style={{ backgroundColor: theme.colors.primary[800] }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 flex items-center justify-center rounded-lg text-lg"
                           style={{ backgroundColor: theme.colors.primary[700] }}>
                        {template.icon}
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-white text-sm">{template.name}</div>
                        <div className="text-xs text-gray-400 capitalize">{template.category}</div>
                      </div>
                    </div>
                    
                    <p className="text-xs text-gray-300 mb-3">{template.description}</p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>{template.waypoints_template.length} waypoints</span>
                      <span>Alt: {template.recommended_altitude_m}m</span>
                      {template.estimated_area_km2 && (
                        <span>Area: {template.estimated_area_km2}km²</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Mission List View */
              <div className="flex-1 overflow-y-auto">
                {missions.length === 0 ? (
                  <div className="p-8 text-center">
                    <Route className="w-12 h-12 mx-auto mb-4 text-gray-500" />
                    <div className="text-gray-400 text-sm">No missions created yet</div>
                    <div className="text-gray-500 text-xs">Create a new mission to get started</div>
                  </div>
                ) : (
                  missions.map(mission => (
                    <div
                      key={mission.id}
                      onClick={() => {
                        setSelectedMissionId(mission.id);
                        setCurrentMission(mission);
                      }}
                      className={`p-4 border-b cursor-pointer transition-all hover:bg-white hover:bg-opacity-5 ${
                        selectedMissionId === mission.id ? 'border-l-2' : ''
                      }`}
                      style={{ 
                        borderColor: theme.colors.primary[700],
                        borderLeftColor: selectedMissionId === mission.id ? theme.colors.accent.blue : 'transparent',
                        backgroundColor: selectedMissionId === mission.id ? `${theme.colors.accent.blue}10` : 'transparent'
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 flex items-center justify-center rounded text-xs font-bold`} 
                               style={{ 
                                 backgroundColor: mission.status === 'draft' ? theme.colors.accent.amber :
                                                mission.status === 'planned' ? theme.colors.accent.blue :
                                                mission.status === 'approved' ? theme.colors.accent.green :
                                                mission.status === 'active' ? theme.colors.accent.teal :
                                                theme.colors.neutral[500],
                                 color: theme.colors.primary[950]
                               }}>
                            {mission.status === 'draft' ? <Edit3 className="w-3 h-3" /> : 
                             mission.status === 'planned' ? <Clock className="w-3 h-3" /> : 
                             mission.status === 'approved' ? <CheckCircle2 className="w-3 h-3" /> :
                             mission.status === 'active' ? <Play className="w-3 h-3" /> :
                             <CheckCircle2 className="w-3 h-3" />}
                          </div>
                          <div>
                            <div className="font-bold text-white text-sm">{mission.name}</div>
                            <div className="text-xs text-gray-400">{mission.drone_id}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-mono text-white">
                            {formatDuration(mission.estimated_duration_min)}
                          </div>
                          <div className="text-xs text-gray-400">
                            {mission.estimated_battery_usage_pct.toFixed(0)}% battery
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-400">Priority</span>
                          <span className={`font-mono uppercase ${
                            mission.priority === 'critical' ? 'text-red-400' :
                            mission.priority === 'high' ? 'text-orange-400' :
                            mission.priority === 'normal' ? 'text-blue-400' : 'text-gray-400'
                          }`}>
                            {mission.priority}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-400">Waypoints</span>
                          <span className="font-mono text-white">{mission.waypoints.length}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-400">Status</span>
                          <span className="font-mono text-white capitalize">
                            {mission.status.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Center - Map Planning Interface */}
        <div className="flex-1 relative" style={{ backgroundColor: theme.colors.primary[950] }}>
          
          {/* New Mission Creation Guide */}
          <div className="absolute top-16 right-4 z-10">
            {selectedMission && selectedMission.status === 'draft' && missions[0]?.id === selectedMission.id && (
              <div className="bg-green-500 text-black p-4 rounded-lg shadow-xl max-w-xs animate-bounce">
                <div className="font-bold text-sm mb-2">🎯 Mission Created Successfully!</div>
                <div className="text-xs mb-3">
                  Your new mission "{selectedMission.name}" is ready for configuration.
                </div>
                <div className="space-y-1 text-xs">
                  <div>✅ {selectedMission.waypoints.length} waypoints added</div>
                  <div>✅ {selectedMission.drone_id} assigned</div>
                  <div>⏱️ Est. {formatDuration(selectedMission.estimated_duration_min)}</div>
                  <div>🔋 {selectedMission.estimated_battery_usage_pct.toFixed(0)}% battery needed</div>
                </div>
                <div className="mt-3 pt-2 border-t border-black border-opacity-20">
                  <div className="text-xs font-bold">Next Steps:</div>
                  <div className="text-xs">1. Click waypoints on map to edit</div>
                  <div className="text-xs">2. Configure settings in right panel</div>
                  <div className="text-xs">3. Save plan when ready</div>
                </div>
              </div>
            )}
          </div>
          {/* Map Controls */}
          <div className="absolute top-4 left-4 z-20 flex gap-2">
            <button
              onClick={() => setLeftPanelOpen(!leftPanelOpen)}
              className="p-2 rounded transition-colors hover:bg-white hover:bg-opacity-10"
              style={{ backgroundColor: theme.colors.primary[800] }}
            >
              <Menu className="w-4 h-4 text-white" />
            </button>
            
            {selectedMission && (
              <div className="flex bg-black bg-opacity-30 rounded overflow-hidden">
                <button
                  onClick={() => addWaypoint()}
                  className="px-3 py-2 text-xs font-bold text-white hover:bg-white hover:bg-opacity-10"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  WAYPOINT
                </button>
                <button
                  className="px-3 py-2 text-xs font-bold text-white hover:bg-white hover:bg-opacity-10"
                >
                  <Grid3X3 className="w-3 h-3 mr-1" />
                  GRID
                </button>
                <button
                  className="px-3 py-2 text-xs font-bold text-white hover:bg-white hover:bg-opacity-10"
                >
                  <Layers className="w-3 h-3 mr-1" />
                  LAYERS
                </button>
              </div>
            )}
          </div>

          {/* Mission Planning Area */}
          <div className="absolute inset-0 flex items-center justify-center">
            {selectedMission ? (
              <div className="w-full h-full relative bg-gradient-to-br from-blue-900 via-slate-800 to-indigo-900">
                {/* Grid Background */}
                <div className="absolute inset-0 opacity-10">
                  <div className="w-full h-full" 
                       style={{
                         backgroundImage: `
                           linear-gradient(${theme.colors.accent.teal}40 1px, transparent 1px),
                           linear-gradient(90deg, ${theme.colors.accent.teal}40 1px, transparent 1px)
                         `,
                         backgroundSize: '50px 50px'
                       }}>
                  </div>
                </div>

                {/* Map Center Indicator */}
                <div className="absolute inset-0 flex items-center justify-center opacity-20">
                  <div className="text-center">
                    <Navigation className="w-16 h-16 mx-auto mb-4 text-white" />
                    <div className="text-white font-mono text-lg">PLANNING MAP</div>
                    <div className="text-gray-400 font-mono text-sm">Click to add waypoints</div>
                  </div>
                </div>

                {/* Waypoints and Route */}
                <svg className="absolute inset-0 w-full h-full">
                  {/* Route Lines */}
                  {selectedMission.waypoints.map((waypoint, index) => {
                    if (index === selectedMission.waypoints.length - 1) return null;
                    const next = selectedMission.waypoints[index + 1];
                    
                    return (
                      <line
                        key={`route-${waypoint.id}-${next.id}`}
                        x1={`${20 + index * 15}%`}
                        y1={`${30 + index * 8}%`}
                        x2={`${20 + (index + 1) * 15}%`}
                        y2={`${30 + (index + 1) * 8}%`}
                        stroke={theme.colors.accent.teal}
                        strokeWidth="2"
                        strokeDasharray={waypoint.action === 'transit' ? '0' : '5,5'}
                        opacity="0.8"
                      />
                    );
                  })}
                </svg>

                {/* Enhanced Waypoint Markers for New Mission */}
                {selectedMission.waypoints.map((waypoint, index) => {
                  const isNewMission = selectedMission.status === 'draft' && missions[0]?.id === selectedMission.id;
                  const isSelected = selectedWaypointId === waypoint.id;
                  
                  return (
                    <div
                      key={waypoint.id}
                      onClick={() => setSelectedWaypointId(waypoint.id)}
                      className={`absolute cursor-pointer transition-all hover:scale-110 ${
                        isSelected ? 'animate-pulse z-30' : 'z-20'
                      } ${isNewMission && !isSelected ? 'animate-bounce' : ''}`}
                      style={{
                        left: `${20 + index * 15}%`,
                        top: `${30 + index * 8}%`,
                        transform: 'translate(-50%, -50%)',
                        animationDelay: `${index * 0.2}s`
                      }}
                    >
                      <div className={`relative p-3 rounded-full border-2 transition-all ${
                        waypoint.action === 'transit' ? 'bg-blue-500' :
                        waypoint.action === 'sample' ? 'bg-orange-500' :
                        waypoint.action === 'hover' ? 'bg-purple-500' :
                        waypoint.action === 'survey' ? 'bg-green-500' : 'bg-amber-500'
                      } ${isSelected ? 'ring-4 ring-white scale-110' : isNewMission ? 'ring-2 ring-green-400' : ''}`}
                           style={{ 
                             borderColor: isSelected ? 'white' : isNewMission ? theme.colors.accent.green : 'white',
                             boxShadow: `0 0 ${isSelected ? '30' : isNewMission ? '20' : '10'}px ${
                               waypoint.action === 'transit' ? theme.colors.accent.blue :
                               waypoint.action === 'sample' ? theme.colors.accent.orange :
                               waypoint.action === 'hover' ? theme.colors.accent.purple :
                               waypoint.action === 'survey' ? theme.colors.accent.green : 
                               theme.colors.accent.amber
                             }${isSelected ? '80' : isNewMission ? '60' : '40'}`
                           }}>
                        <div className="w-4 h-4 text-white">
                          {waypoint.action === 'transit' && <Navigation className="w-full h-full" />}
                          {waypoint.action === 'sample' && <Target className="w-full h-full" />}
                          {waypoint.action === 'hover' && <Timer className="w-full h-full" />}
                          {waypoint.action === 'survey' && <Eye className="w-full h-full" />}
                          {waypoint.action === 'loiter' && <RotateCcw className="w-full h-full" />}
                        </div>
                        
                        {/* Waypoint Label */}
                        <div className={`absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded text-xs font-mono font-bold text-white whitespace-nowrap ${
                          isNewMission ? 'animate-pulse' : ''
                        }`}
                             style={{ backgroundColor: theme.colors.primary[800] }}>
                          WP{index + 1} - {waypoint.action.toUpperCase()}
                          {isNewMission && index === 0 && (
                            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-green-400">
                              ← CLICK TO EDIT
                            </div>
                          )}
                        </div>

                        {/* Action Duration Indicator */}
                        {waypoint.duration_s > 0 && (
                          <div className={`absolute -top-2 -right-2 w-4 h-4 rounded-full bg-white text-black text-xs flex items-center justify-center font-bold ${
                            isNewMission ? 'animate-ping' : ''
                          }`}>
                            {Math.round(waypoint.duration_s / 10)}
                          </div>
                        )}

                        {/* New Mission Indicator */}
                        {isNewMission && index === 0 && (
                          <div className="absolute -top-3 -left-3 w-6 h-6 rounded-full bg-green-500 text-black text-xs flex items-center justify-center font-bold animate-pulse">
                            NEW
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Drone Position (if available) */}
                {selectedMission.drone_id && (
                  <div
                    className="absolute animate-pulse"
                    style={{
                      left: `${10 + Math.random() * 5}%`,
                      top: `${20 + Math.random() * 5}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    <div className="relative p-2 rounded bg-green-500 border-2 border-white">
                      <Plane className="w-5 h-5 text-white" />
                      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded text-xs font-mono font-bold text-white"
                           style={{ backgroundColor: theme.colors.primary[800] }}>
                        {selectedMission.drone_id}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* No Mission Selected */
              <div className="text-center p-8">
                <Route className="w-16 h-16 mx-auto mb-4 text-gray-500" />
                <div className="text-gray-400 text-lg font-bold mb-2">No Mission Selected</div>
                <div className="text-gray-500 text-sm mb-4">
                  Create a new mission or select an existing one to start planning
                </div>
                <button
                  onClick={() => setShowTemplates(true)}
                  className="px-6 py-3 rounded text-sm font-bold transition-colors text-white"
                  style={{ backgroundColor: theme.colors.accent.green }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  CREATE MISSION
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Mission Details & Settings */}
        <div className={`transition-all duration-300 border-l ${rightPanelOpen ? 'w-96' : 'w-0'} overflow-hidden`}
             style={{ 
               borderColor: theme.colors.primary[700], 
               backgroundColor: theme.colors.primary[900] 
             }}>
          <div className="h-full flex flex-col">
            
            <div className="h-12 flex items-center justify-between px-4 border-b" 
                 style={{ borderColor: theme.colors.primary[700] }}>
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4" style={{ color: theme.colors.accent.purple }} />
                <span className="font-bold tracking-wide text-white">MISSION CONFIG</span>
              </div>
              <button
                onClick={() => setRightPanelOpen(false)}
                className="lg:hidden p-1 hover:bg-white hover:bg-opacity-10 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {selectedMission ? (
              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                
                {/* Mission Info */}
                <div className="p-4 rounded-lg" style={{ backgroundColor: theme.colors.primary[800] }}>
                  <div className="flex items-center gap-2 mb-3">
                    <Command className="w-4 h-4" style={{ color: theme.colors.accent.blue }} />
                    <span className="font-bold text-white text-sm">MISSION INFO</span>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Mission Name</label>
                      <input
                        type="text"
                        value={selectedMission.name}
                        onChange={(e) => updateMission(selectedMission.id, { name: e.target.value })}
                        className="w-full p-2 rounded text-sm bg-black bg-opacity-30 text-white border border-gray-600 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Description</label>
                      <textarea
                        value={selectedMission.description}
                        onChange={(e) => updateMission(selectedMission.id, { description: e.target.value })}
                        rows={2}
                        className="w-full p-2 rounded text-sm bg-black bg-opacity-30 text-white border border-gray-600 focus:border-blue-500 resize-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Priority</label>
                        <select
                          value={selectedMission.priority}
                          onChange={(e) => updateMission(selectedMission.id, { priority: e.target.value as any })}
                          className="w-full p-2 rounded text-sm bg-black bg-opacity-30 text-white border border-gray-600 focus:border-blue-500"
                        >
                          <option value="low">Low</option>
                          <option value="normal">Normal</option>
                          <option value="high">High</option>
                          <option value="critical">Critical</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Drone</label>
                        <select
                          value={selectedMission.drone_id}
                          onChange={(e) => updateMission(selectedMission.id, { drone_id: e.target.value })}
                          className="w-full p-2 rounded text-sm bg-black bg-opacity-30 text-white border border-gray-600 focus:border-blue-500"
                        >
                          {mockDrones.filter(d => d.status === 'available').map(drone => (
                            <option key={drone.id} value={drone.id}>{drone.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mission Stats */}
                <div className="p-4 rounded-lg" style={{ backgroundColor: theme.colors.primary[800] }}>
                  <div className="flex items-center gap-2 mb-3">
                    <BarChart3 className="w-4 h-4" style={{ color: theme.colors.accent.green }} />
                    <span className="font-bold text-white text-sm">MISSION STATS</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 rounded" style={{ backgroundColor: theme.colors.primary[700] }}>
                      <div className="text-lg font-bold text-white">
                        {formatDuration(selectedMission.estimated_duration_min)}
                      </div>
                      <div className="text-xs text-gray-400">Duration</div>
                    </div>
                    <div className="text-center p-3 rounded" style={{ backgroundColor: theme.colors.primary[700] }}>
                      <div className="text-lg font-bold text-white">
                        {selectedMission.estimated_battery_usage_pct.toFixed(0)}%
                      </div>
                      <div className="text-xs text-gray-400">Battery</div>
                    </div>
                    <div className="text-center p-3 rounded" style={{ backgroundColor: theme.colors.primary[700] }}>
                      <div className="text-lg font-bold text-white">
                        {selectedMission.waypoints.length}
                      </div>
                      <div className="text-xs text-gray-400">Waypoints</div>
                    </div>
                    <div className="text-center p-3 rounded" style={{ backgroundColor: theme.colors.primary[700] }}>
                      <div className="text-lg font-bold text-white">
                        {selectedMission.waypoints.filter(w => w.action === 'sample').length}
                      </div>
                      <div className="text-xs text-gray-400">Samples</div>
                    </div>
                  </div>
                </div>

                {/* Waypoint Details */}
                {selectedWaypointId && selectedMission.waypoints.find(w => w.id === selectedWaypointId) && (
                  <div className="p-4 rounded-lg" style={{ backgroundColor: theme.colors.primary[800] }}>
                    <div className="flex items-center gap-2 mb-3">
                      <Target className="w-4 h-4" style={{ color: theme.colors.accent.orange }} />
                      <span className="font-bold text-white text-sm">WAYPOINT CONFIG</span>
                    </div>
                    
                    {(() => {
                      const waypoint = selectedMission.waypoints.find(w => w.id === selectedWaypointId)!;
                      return (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">Action Type</label>
                            <select
                              value={waypoint.action}
                              onChange={(e) => {
                                const updatedWaypoints = selectedMission.waypoints.map(w => 
                                  w.id === selectedWaypointId ? { ...w, action: e.target.value as any } : w
                                );
                                const stats = calculateMissionStats(updatedWaypoints);
                                updateMission(selectedMission.id, {
                                  waypoints: updatedWaypoints,
                                  estimated_duration_min: stats.duration_min,
                                  estimated_battery_usage_pct: stats.estimated_battery_pct
                                });
                              }}
                              className="w-full p-2 rounded text-sm bg-black bg-opacity-30 text-white border border-gray-600 focus:border-blue-500"
                            >
                              <option value="transit">Transit</option>
                              <option value="hover">Hover</option>
                              <option value="sample">Sample</option>
                              <option value="survey">Survey</option>
                              <option value="loiter">Loiter</option>
                            </select>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs text-gray-400 mb-1">Altitude (m)</label>
                              <input
                                type="number"
                                value={waypoint.alt_m}
                                onChange={(e) => {
                                  const updatedWaypoints = selectedMission.waypoints.map(w => 
                                    w.id === selectedWaypointId ? { ...w, alt_m: Number(e.target.value) } : w
                                  );
                                  updateMission(selectedMission.id, { waypoints: updatedWaypoints });
                                }}
                                className="w-full p-2 rounded text-sm bg-black bg-opacity-30 text-white border border-gray-600 focus:border-blue-500"
                                min="5"
                                max="120"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-400 mb-1">Speed (m/s)</label>
                              <input
                                type="number"
                                value={waypoint.speed_mps}
                                onChange={(e) => {
                                  const updatedWaypoints = selectedMission.waypoints.map(w => 
                                    w.id === selectedWaypointId ? { ...w, speed_mps: Number(e.target.value) } : w
                                  );
                                  const stats = calculateMissionStats(updatedWaypoints);
                                  updateMission(selectedMission.id, {
                                    waypoints: updatedWaypoints,
                                    estimated_duration_min: stats.duration_min,
                                    estimated_battery_usage_pct: stats.estimated_battery_pct
                                  });
                                }}
                                className="w-full p-2 rounded text-sm bg-black bg-opacity-30 text-white border border-gray-600 focus:border-blue-500"
                                min="1"
                                max="20"
                              />
                            </div>
                          </div>
                          
                          {waypoint.action !== 'transit' && (
                            <div>
                              <label className="block text-xs text-gray-400 mb-1">Duration (seconds)</label>
                              <input
                                type="number"
                                value={waypoint.duration_s}
                                onChange={(e) => {
                                  const updatedWaypoints = selectedMission.waypoints.map(w => 
                                    w.id === selectedWaypointId ? { ...w, duration_s: Number(e.target.value) } : w
                                  );
                                  const stats = calculateMissionStats(updatedWaypoints);
                                  updateMission(selectedMission.id, {
                                    waypoints: updatedWaypoints,
                                    estimated_duration_min: stats.duration_min,
                                    estimated_battery_usage_pct: stats.estimated_battery_pct
                                  });
                                }}
                                className="w-full p-2 rounded text-sm bg-black bg-opacity-30 text-white border border-gray-600 focus:border-blue-500"
                                min="0"
                                max="600"
                              />
                            </div>
                          )}

                          <div className="flex gap-2 pt-2">
                            <button
                              onClick={() => {
                                const waypointIndex = selectedMission.waypoints.findIndex(w => w.id === selectedWaypointId);
                                addWaypoint(waypointIndex);
                              }}
                              className="flex-1 px-3 py-2 rounded text-xs font-bold text-white transition-colors"
                              style={{ backgroundColor: theme.colors.accent.green }}
                            >
                              <Plus className="w-3 h-3 mr-1" />
                              ADD AFTER
                            </button>
                            <button
                              onClick={() => {
                                removeWaypoint(selectedWaypointId);
                                setSelectedWaypointId(null);
                              }}
                              className="px-3 py-2 rounded text-xs font-bold text-white transition-colors"
                              style={{ backgroundColor: theme.colors.accent.red }}
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* AI Optimization Results */}
                {aiOptimization.suggestions.length > 0 && (
                  <div className="p-4 rounded-lg" style={{ backgroundColor: theme.colors.primary[800] }}>
                    <div className="flex items-center gap-2 mb-3">
                      <Brain className="w-4 h-4" style={{ color: theme.colors.accent.purple }} />
                      <span className="font-bold text-white text-sm">AI SUGGESTIONS</span>
                    </div>
                    
                    <div className="space-y-2">
                      {aiOptimization.suggestions.map(suggestion => (
                        <div key={suggestion.id} className="p-3 rounded border border-white border-opacity-10">
                          <div className="flex items-center justify-between mb-2">
                            <div className="text-xs font-bold text-white capitalize">
                              {suggestion.type.replace('_', ' ')}
                            </div>
                            <div className="text-xs text-gray-400">
                              {Math.round(suggestion.confidence * 100)}% confidence
                            </div>
                          </div>
                          <div className="text-xs text-gray-300 mb-2">{suggestion.description}</div>
                          <div className="flex items-center justify-between">
                            <div className="text-xs font-mono" style={{ color: theme.colors.accent.green }}>
                              {suggestion.estimated_improvement}
                            </div>
                            <button
                              className="px-2 py-1 rounded text-xs font-bold text-white transition-colors"
                              style={{ backgroundColor: theme.colors.accent.teal }}
                            >
                              APPLY
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Drone Status */}
                {(() => {
                  const assignedDrone = mockDrones.find(d => d.id === selectedMission.drone_id);
                  return assignedDrone ? (
                    <div className="p-4 rounded-lg" style={{ backgroundColor: theme.colors.primary[800] }}>
                      <div className="flex items-center gap-2 mb-3">
                        <Plane className="w-4 h-4" style={{ color: theme.colors.accent.teal }} />
                        <span className="font-bold text-white text-sm">ASSIGNED DRONE</span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-400">Name</span>
                          <span className="text-xs font-mono text-white">{assignedDrone.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-400">Status</span>
                          <span className={`text-xs font-mono uppercase ${
                            assignedDrone.status === 'available' ? 'text-green-400' :
                            assignedDrone.status === 'busy' ? 'text-orange-400' :
                            assignedDrone.status === 'maintenance' ? 'text-red-400' : 'text-gray-400'
                          }`}>
                            {assignedDrone.status}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-400">Battery</span>
                          <span className="text-xs font-mono text-white">{assignedDrone.battery_pct}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-400">Max Flight Time</span>
                          <span className="text-xs font-mono text-white">{assignedDrone.max_flight_time_min}min</span>
                        </div>
                        <div className="mt-2">
                          <div className="text-xs text-gray-400 mb-1">Capabilities</div>
                          <div className="flex flex-wrap gap-1">
                            {assignedDrone.capabilities.map(cap => (
                              <span key={cap} className="px-2 py-1 rounded text-xs bg-white bg-opacity-10 text-white">
                                {cap.replace('_', ' ')}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Battery vs Mission Requirement */}
                      <div className="mt-3 p-2 rounded" 
                           style={{ backgroundColor: theme.colors.primary[700] }}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-gray-400">Mission vs Battery</span>
                          <span className={`text-xs font-bold ${
                            selectedMission.estimated_battery_usage_pct > assignedDrone.battery_pct ? 'text-red-400' :
                            selectedMission.estimated_battery_usage_pct > assignedDrone.battery_pct * 0.8 ? 'text-amber-400' :
                            'text-green-400'
                          }`}>
                            {selectedMission.estimated_battery_usage_pct > assignedDrone.battery_pct ? 'INSUFFICIENT' :
                             selectedMission.estimated_battery_usage_pct > assignedDrone.battery_pct * 0.8 ? 'TIGHT' :
                             'SAFE'}
                          </span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2 relative">
                          <div 
                            className="h-2 rounded-full bg-gray-500"
                            style={{ width: `${assignedDrone.battery_pct}%` }}
                          ></div>
                          <div 
                            className={`absolute top-0 h-2 rounded-full ${
                              selectedMission.estimated_battery_usage_pct > assignedDrone.battery_pct ? 'bg-red-500' : 'bg-blue-500'
                            }`}
                            style={{ width: `${Math.min(100, selectedMission.estimated_battery_usage_pct)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ) : null;
                })()}
              </div>
            ) : (
              /* No Mission Selected */
              <div className="flex-1 flex items-center justify-center p-8">
                <div className="text-center">
                  <Settings className="w-16 h-16 mx-auto mb-4 text-gray-500" />
                  <div className="text-gray-400 text-lg">No Mission Selected</div>
                  <div className="text-gray-500 text-sm">Select a mission to configure settings</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Panel Toggle Button */}
        <button
          onClick={() => setRightPanelOpen(!rightPanelOpen)}
          className="lg:hidden absolute top-4 right-4 z-20 p-2 rounded transition-colors hover:bg-white hover:bg-opacity-10"
          style={{ backgroundColor: theme.colors.primary[800] }}
        >
          <Settings className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
};

export default MissionPlanningSystem;