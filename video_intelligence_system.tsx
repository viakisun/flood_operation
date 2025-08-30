import React, { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, ReferenceLine, Area, AreaChart } from 'recharts';
import { 
  Play, 
  Pause, 
  Activity, 
  Eye,
  Zap,
  Target,
  Settings,
  Crosshair,
  User,
  Car,
  Package,
  Shield,
  Waves,
  Camera,
  Video,
  Cpu,
  Clock,
  Gauge,
  BarChart3,
  Grid3X3,
  Layers,
  Download,
  Share2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Maximize2,
  Minimize2
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
type Detection = {
  id: string;
  class_name: string;
  confidence: number;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  tracking_id?: string;
};

type Segmentation = {
  id: string;
  class_name: string;
  confidence: number;
  area_pixels: number;
  color: string;
  opacity: number;
  polygon_points: Array<{x: number, y: number}>;
};

type VideoAnalysis = {
  frame_id: string;
  timestamp: string;
  drone_id: string;
  detections: Detection[];
  segmentations: Segmentation[];
  metadata: {
    processing_time_ms: number;
    inference_time_ms: number;
    preprocessing_time_ms: number;
    postprocessing_time_ms: number;
    model_version: string;
    frame_quality: 'excellent' | 'good' | 'fair' | 'poor';
    resolution: { width: number; height: number };
    fps: number;
    bitrate_mbps: number;
  };
};

type VideoStream = {
  drone_id: string;
  stream_url: string;
  is_active: boolean;
  connection_quality: 'excellent' | 'good' | 'fair' | 'poor';
  latency_ms: number;
  packet_loss_pct: number;
};

type AnalysisHistory = {
  timestamp: string;
  total_detections: number;
  avg_confidence: number;
  processing_time: number;
  quality_score: number;
};

// Mock Data Generators
const generateDetections = (): Detection[] => {
  const classes = ['person', 'vehicle', 'boat', 'debris', 'building', 'animal', 'structure'];
  const colors = [
    theme.colors.accent.red, 
    theme.colors.accent.orange, 
    theme.colors.accent.teal, 
    theme.colors.accent.amber, 
    theme.colors.accent.green, 
    theme.colors.accent.purple,
    theme.colors.accent.blue
  ];

  const detections: Detection[] = [];
  const numDetections = Math.floor(Math.random() * 8) + 2;

  for (let i = 0; i < numDetections; i++) {
    const className = classes[Math.floor(Math.random() * classes.length)];
    const confidence = 0.55 + Math.random() * 0.45;
    
    detections.push({
      id: `det_${i}_${Date.now()}`,
      class_name: className,
      confidence,
      x: Math.random() * 500 + 50,
      y: Math.random() * 300 + 50,
      width: 40 + Math.random() * 120,
      height: 40 + Math.random() * 120,
      color: colors[i % colors.length],
      tracking_id: confidence > 0.8 ? `track_${Math.floor(Math.random() * 100)}` : undefined
    });
  }

  return detections;
};

const generateSegmentations = (): Segmentation[] => {
  const classes = ['water', 'flood_zone', 'vegetation', 'urban_area', 'road', 'building_roof'];
  const colors = [
    theme.colors.accent.teal,
    theme.colors.accent.red,
    theme.colors.accent.green,
    theme.colors.accent.amber,
    theme.colors.neutral[400],
    theme.colors.accent.purple
  ];

  const segmentations: Segmentation[] = [];
  const numSegments = Math.floor(Math.random() * 4) + 2;

  for (let i = 0; i < numSegments; i++) {
    const className = classes[i % classes.length];
    const confidence = 0.65 + Math.random() * 0.35;
    
    // Generate random polygon points
    const numPoints = 5 + Math.floor(Math.random() * 5);
    const polygon_points = [];
    for (let p = 0; p < numPoints; p++) {
      polygon_points.push({
        x: Math.random() * 600,
        y: Math.random() * 400
      });
    }

    segmentations.push({
      id: `seg_${i}_${Date.now()}`,
      class_name: className,
      confidence,
      area_pixels: Math.floor(Math.random() * 50000) + 5000,
      color: colors[i % colors.length],
      opacity: 0.25 + Math.random() * 0.25,
      polygon_points
    });
  }

  return segmentations;
};

const generateVideoAnalysis = (droneId: string): VideoAnalysis => {
  const processing_time = 45 + Math.random() * 80;
  const inference_time = processing_time * 0.6;
  const preprocessing_time = processing_time * 0.2;
  const postprocessing_time = processing_time * 0.2;

  return {
    frame_id: `frame_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
    timestamp: new Date().toISOString(),
    drone_id: droneId,
    detections: generateDetections(),
    segmentations: generateSegmentations(),
    metadata: {
      processing_time_ms: processing_time,
      inference_time_ms: inference_time,
      preprocessing_time_ms: preprocessing_time,
      postprocessing_time_ms: postprocessing_time,
      model_version: 'FloodVision-Pro-v3.2.1',
      frame_quality: ['excellent', 'good', 'fair', 'poor'][Math.floor(Math.random() * 4)] as any,
      resolution: { width: 1920, height: 1080 },
      fps: 25 + Math.floor(Math.random() * 10),
      bitrate_mbps: 8 + Math.random() * 7
    }
  };
};

const generateAnalysisHistory = (): AnalysisHistory[] => {
  const history: AnalysisHistory[] = [];
  const now = new Date();
  
  for (let i = 59; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 5000);
    history.push({
      timestamp: timestamp.toISOString(),
      total_detections: Math.floor(Math.random() * 12) + 1,
      avg_confidence: 0.6 + Math.random() * 0.4,
      processing_time: 40 + Math.random() * 60,
      quality_score: 0.7 + Math.random() * 0.3
    });
  }
  
  return history;
};

// Utility Functions
const getDetectionIcon = (className: string) => {
  switch (className) {
    case 'person': return User;
    case 'vehicle': return Car;
    case 'boat': return Waves;
    case 'debris': return Package;
    case 'building': case 'structure': return Shield;
    default: return Target;
  }
};

const getQualityColor = (quality: string) => {
  switch (quality) {
    case 'excellent': return theme.colors.accent.green;
    case 'good': return theme.colors.accent.blue;
    case 'fair': return theme.colors.accent.amber;
    case 'poor': return theme.colors.accent.red;
    default: return theme.colors.neutral[400];
  }
};

const formatTimestamp = (isoString: string): string => {
  return new Date(isoString).toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit',
    hour12: false 
  });
};

// Main Component
const DroneVideoIntelligenceSystem: React.FC = () => {
  const [selectedDrone, setSelectedDrone] = useState<string>('UAV_RECON_01');
  const [videoAnalysis, setVideoAnalysis] = useState<VideoAnalysis | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisHistory[]>(generateAnalysisHistory());
  
  // Video Controls
  const [isStreamActive, setIsStreamActive] = useState(true);
  const [isAnalysisActive, setIsAnalysisActive] = useState(true);
  const [viewMode, setViewMode] = useState<'detections' | 'segmentation' | 'both' | 'raw'>('both');
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Display Settings
  const [showConfidenceThreshold, setShowConfidenceThreshold] = useState(0.6);
  const [showTrackingIds, setShowTrackingIds] = useState(true);
  const [overlayOpacity, setOverlayOpacity] = useState(0.7);
  
  const [currentTime, setCurrentTime] = useState(new Date());

  // Available drones
  const availableDrones = ['UAV_RECON_01', 'UAV_SURVEY_02', 'UAV_PATROL_03', 'UAV_MONITOR_04'];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
      
      if (isStreamActive && isAnalysisActive) {
        const newAnalysis = generateVideoAnalysis(selectedDrone);
        setVideoAnalysis(newAnalysis);
        
        // Update history
        setAnalysisHistory(prev => {
          const newHistory = [...prev.slice(1), {
            timestamp: new Date().toISOString(),
            total_detections: newAnalysis.detections.length,
            avg_confidence: newAnalysis.detections.length > 0 ? 
              newAnalysis.detections.reduce((sum, d) => sum + d.confidence, 0) / newAnalysis.detections.length : 0,
            processing_time: newAnalysis.metadata.processing_time_ms,
            quality_score: Math.random() * 0.3 + 0.7
          }];
          return newHistory;
        });
      }
    }, 1500);
    
    return () => clearInterval(interval);
  }, [selectedDrone, isStreamActive, isAnalysisActive]);

  // Filter detections by confidence threshold
  const filteredDetections = useMemo(() => {
    return videoAnalysis?.detections.filter(d => d.confidence >= showConfidenceThreshold) || [];
  }, [videoAnalysis?.detections, showConfidenceThreshold]);

  return (
    <div className="h-screen flex flex-col font-mono text-sm" 
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
                 style={{ backgroundColor: theme.colors.accent.teal }}>
              <Video className="w-5 h-5" style={{ color: theme.colors.primary[950] }} />
            </div>
            <div>
              <div className="text-xs font-bold tracking-wider text-white">VIDEO INTELLIGENCE CENTER</div>
              <div className="text-xs" style={{ color: theme.colors.neutral[400] }}>
                REAL-TIME AI ANALYSIS SYSTEM
              </div>
            </div>
          </div>
          
          {/* Drone Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">DRONE:</span>
            <select
              value={selectedDrone}
              onChange={(e) => setSelectedDrone(e.target.value)}
              className="bg-black bg-opacity-50 text-white text-xs font-mono px-3 py-2 rounded border border-gray-600"
            >
              {availableDrones.map(drone => (
                <option key={drone} value={drone}>{drone}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right font-mono">
            <div className="text-xs font-bold text-white">
              {currentTime.toLocaleTimeString('en-US', { hour12: false })}
            </div>
            <div className="text-xs" style={{ color: theme.colors.neutral[400] }}>
              SYSTEM TIME
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full animate-pulse" 
                 style={{ backgroundColor: isStreamActive ? theme.colors.accent.green : theme.colors.accent.red }}></div>
            <span className="text-xs font-bold text-white">
              {isStreamActive ? 'STREAMING' : 'OFFLINE'}
            </span>
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
          {/* Stream Control */}
          <button
            onClick={() => setIsStreamActive(!isStreamActive)}
            className={`flex items-center gap-2 px-4 py-2 rounded text-xs font-bold transition-colors ${
              isStreamActive ? 'text-black' : 'text-white'
            }`}
            style={{ 
              backgroundColor: isStreamActive ? theme.colors.accent.green : theme.colors.primary[800] 
            }}
          >
            {isStreamActive ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            {isStreamActive ? 'STREAMING' : 'STREAM OFF'}
          </button>

          {/* Analysis Toggle */}
          <button
            onClick={() => setIsAnalysisActive(!isAnalysisActive)}
            className={`flex items-center gap-2 px-4 py-2 rounded text-xs font-bold transition-colors ${
              isAnalysisActive ? 'text-black' : 'text-white'
            }`}
            style={{ 
              backgroundColor: isAnalysisActive ? theme.colors.accent.teal : theme.colors.primary[800] 
            }}
          >
            <Cpu className="w-3 h-3" />
            {isAnalysisActive ? 'AI ACTIVE' : 'AI OFF'}
          </button>

          {/* View Mode Controls */}
          <div className="flex bg-black bg-opacity-30 rounded overflow-hidden">
            {(['raw', 'detections', 'segmentation', 'both'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-2 text-xs font-bold transition-colors ${
                  viewMode === mode ? 'text-black' : 'text-white hover:bg-white hover:bg-opacity-10'
                }`}
                style={{ 
                  backgroundColor: viewMode === mode ? 
                    (mode === 'raw' ? theme.colors.neutral[500] :
                     mode === 'detections' ? theme.colors.accent.red :
                     mode === 'segmentation' ? theme.colors.accent.blue :
                     theme.colors.accent.orange) : 'transparent' 
                }}
              >
                {mode.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Settings */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-400">CONF:</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={showConfidenceThreshold}
              onChange={(e) => setShowConfidenceThreshold(Number(e.target.value))}
              className="w-16"
            />
            <span className="text-white font-mono w-8">
              {Math.round(showConfidenceThreshold * 100)}%
            </span>
          </div>

          {/* Fullscreen */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded hover:bg-white hover:bg-opacity-10 transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Main Video Display */}
        <div className="flex-1 relative" style={{ backgroundColor: theme.colors.primary[950] }}>
          
          {/* Video Feed */}
          <div className="absolute inset-4">
            <div className="w-full h-full bg-black rounded-lg overflow-hidden relative">
              
              {/* Mock Video Background */}
              {isStreamActive ? (
                <div className="w-full h-full bg-gradient-to-br from-blue-900 via-slate-800 to-indigo-900 relative">
                  {/* Simulated video noise */}
                  <div className="absolute inset-0 opacity-5 animate-pulse">
                    <div className="w-full h-full bg-gradient-to-r from-transparent via-white to-transparent"></div>
                  </div>
                  
                  {/* Center indicator */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center opacity-20">
                      <Camera className="w-16 h-16 mx-auto mb-4 text-white" />
                      <div className="text-white font-mono text-sm">LIVE FEED</div>
                      <div className="text-gray-400 font-mono text-xs">{selectedDrone}</div>
                    </div>
                  </div>

                  {/* AI Analysis Overlays */}
                  {videoAnalysis && isAnalysisActive && viewMode !== 'raw' && (
                    <div className="absolute inset-0" style={{ opacity: overlayOpacity }}>
                      
                      {/* Segmentation Overlays */}
                      {(viewMode === 'segmentation' || viewMode === 'both') && 
                        videoAnalysis.segmentations.map(seg => {
                          const points = seg.polygon_points.slice(0, 6); // Limit points for performance
                          const pathData = points.map((p, i) => 
                            `${i === 0 ? 'M' : 'L'} ${p.x * 0.8} ${p.y * 0.6}`
                          ).join(' ') + ' Z';
                          
                          return (
                            <div key={seg.id} className="absolute inset-0">
                              <svg className="w-full h-full">
                                <path
                                  d={pathData}
                                  fill={`${seg.color}40`}
                                  stroke={seg.color}
                                  strokeWidth="2"
                                  strokeDasharray="5,5"
                                  className="animate-pulse"
                                />
                              </svg>
                              <div 
                                className="absolute text-xs font-mono font-bold px-2 py-1 rounded text-white"
                                style={{ 
                                  backgroundColor: seg.color,
                                  left: `${points[0]?.x * 0.8}px`,
                                  top: `${(points[0]?.y * 0.6) - 25}px`
                                }}
                              >
                                {seg.class_name.toUpperCase()} {Math.round(seg.confidence * 100)}%
                              </div>
                            </div>
                          );
                        })
                      }

                      {/* Detection Bounding Boxes */}
                      {(viewMode === 'detections' || viewMode === 'both') && 
                        filteredDetections.map(det => (
                          <div
                            key={det.id}
                            className="absolute border-2 transition-all"
                            style={{
                              left: `${det.x * 0.8}px`,
                              top: `${det.y * 0.6}px`,
                              width: `${det.width * 0.8}px`,
                              height: `${det.height * 0.6}px`,
                              borderColor: det.color,
                              boxShadow: det.confidence > 0.8 ? `0 0 10px ${det.color}50` : 'none'
                            }}
                          >
                            {/* Label */}
                            <div className="absolute -top-7 left-0 text-xs font-mono font-bold px-2 py-1 text-white whitespace-nowrap"
                                 style={{ backgroundColor: det.color }}>
                              {det.class_name.toUpperCase()} {Math.round(det.confidence * 100)}%
                              {showTrackingIds && det.tracking_id && (
                                <span className="ml-2 opacity-75">#{det.tracking_id}</span>
                              )}
                            </div>
                            
                            {/* High-confidence crosshair */}
                            {det.confidence > 0.9 && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Crosshair className="w-6 h-6 animate-pulse" style={{ color: det.color }} />
                              </div>
                            )}
                          </div>
                        ))
                      }
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                  <div className="text-center">
                    <XCircle className="w-16 h-16 mx-auto mb-4 text-gray-500" />
                    <div className="text-gray-400 font-mono text-lg">STREAM OFFLINE</div>
                    <div className="text-gray-500 font-mono text-sm">Press STREAM to activate</div>
                  </div>
                </div>
              )}

              {/* Video Status Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                <div className="flex items-center justify-between text-xs font-mono text-white">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                      <span>REC</span>
                    </div>
                    <span>FRAME #{Math.floor(Math.random() * 99999)}</span>
                    <span>{currentTime.toLocaleTimeString('en-US', { hour12: false })}</span>
                    {videoAnalysis && (
                      <>
                        <span>1920×1080</span>
                        <span>{videoAnalysis.metadata.fps} FPS</span>
                        <span>{videoAnalysis.metadata.bitrate_mbps.toFixed(1)} Mbps</span>
                      </>
                    )}
                  </div>
                  
                  {videoAnalysis && (
                    <div className="flex items-center gap-6">
                      <span>OBJECTS: {filteredDetections.length}</span>
                      <span>SEGMENTS: {videoAnalysis.segmentations.length}</span>
                      <span>PROC: {videoAnalysis.metadata.processing_time_ms.toFixed(0)}ms</span>
                      <span className={`px-2 py-1 rounded ${
                        videoAnalysis.metadata.frame_quality === 'excellent' ? 'bg-green-600' :
                        videoAnalysis.metadata.frame_quality === 'good' ? 'bg-blue-600' :
                        videoAnalysis.metadata.frame_quality === 'fair' ? 'bg-orange-600' : 'bg-red-600'
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

        {/* Right Sidebar - Analysis Dashboard */}
        <div className="w-96 border-l" style={{ 
          borderColor: theme.colors.primary[700], 
          backgroundColor: theme.colors.primary[900] 
        }}>
          <div className="h-full flex flex-col">
            
            {/* Sidebar Header */}
            <div className="h-12 flex items-center px-4 border-b" 
                 style={{ borderColor: theme.colors.primary[700] }}>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" style={{ color: theme.colors.accent.purple }} />
                <span className="font-bold tracking-wide text-white">ANALYSIS DASHBOARD</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              
              {/* Real-time Stats */}
              {videoAnalysis && (
                <div className="space-y-4">
                  
                  {/* Processing Performance */}
                  <div className="p-4 rounded-lg" style={{ backgroundColor: theme.colors.primary[800] }}>
                    <div className="flex items-center gap-2 mb-3">
                      <Cpu className="w-4 h-4" style={{ color: theme.colors.accent.teal }} />
                      <span className="font-bold text-white text-sm">PROCESSING METRICS</span>
                    </div>
                    
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Time</span>
                        <span className="font-mono text-white">
                          {videoAnalysis.metadata.processing_time_ms.toFixed(1)}ms
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Inference</span>
                        <span className="font-mono text-white">
                          {videoAnalysis.metadata.inference_time_ms.toFixed(1)}ms
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Pre/Post</span>
                        <span className="font-mono text-white">
                          {(videoAnalysis.metadata.preprocessing_time_ms + videoAnalysis.metadata.postprocessing_time_ms).toFixed(1)}ms
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Model</span>
                        <span className="font-mono text-white text-xs">
                          {videoAnalysis.metadata.model_version}
                        </span>
                      </div>
                    </div>

                    {/* Processing time bar */}
                    <div className="mt-3 w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${Math.min(100, (videoAnalysis.metadata.processing_time_ms / 200) * 100)}%`,
                          backgroundColor: videoAnalysis.metadata.processing_time_ms > 100 ? 
                            theme.colors.accent.red : 
                            videoAnalysis.metadata.processing_time_ms > 70 ? 
                            theme.colors.accent.amber : 
                            theme.colors.accent.green
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Detection Results */}
                  <div className="p-4 rounded-lg" style={{ backgroundColor: theme.colors.primary[800] }}>
                    <div className="flex items-center gap-2 mb-3">
                      <Target className="w-4 h-4" style={{ color: theme.colors.accent.red }} />
                      <span className="font-bold text-white text-sm">
                        DETECTIONS ({filteredDetections.length})
                      </span>
                    </div>
                    
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {filteredDetections.map(det => {
                        const IconComponent = getDetectionIcon(det.class_name);
                        return (
                          <div key={det.id} className="flex items-center justify-between py-1">
                            <div className="flex items-center gap-2">
                              <IconComponent className="w-3 h-3" style={{ color: det.color }} />
                              <span className="text-xs text-white uppercase font-mono">
                                {det.class_name}
                              </span>
                              {det.tracking_id && (
                                <span className="text-xs text-gray-400">#{det.tracking_id}</span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono" style={{ color: det.color }}>
                                {Math.round(det.confidence * 100)}%
                              </span>
                              {det.confidence > 0.9 && (
                                <CheckCircle2 className="w-3 h-3 text-green-400" />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Segmentation Results */}
                  <div className="p-4 rounded-lg" style={{ backgroundColor: theme.colors.primary[800] }}>
                    <div className="flex items-center gap-2 mb-3">
                      <Layers className="w-4 h-4" style={{ color: theme.colors.accent.blue }} />
                      <span className="font-bold text-white text-sm">
                        SEGMENTATION ({videoAnalysis.segmentations.length})
                      </span>
                    </div>
                    
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {videoAnalysis.segmentations.map(seg => (
                        <div key={seg.id} className="flex items-center justify-between py-1">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded border-2 border-dashed" 
                                 style={{ borderColor: seg.color, backgroundColor: `${seg.color}30` }}></div>
                            <span className="text-xs text-white uppercase font-mono">
                              {seg.class_name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono" style={{ color: seg.color }}>
                              {Math.round(seg.confidence * 100)}%
                            </span>
                            <span className="text-xs text-gray-400">
                              {Math.round(seg.area_pixels / 1000)}k px
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Historical Trends */}
              <div className="p-4 rounded-lg" style={{ backgroundColor: theme.colors.primary[800] }}>
                <div className="flex items-center gap-2 mb-3">
                  <Activity className="w-4 h-4" style={{ color: theme.colors.accent.green }} />
                  <span className="font-bold text-white text-sm">PERFORMANCE TRENDS</span>
                </div>

                {/* Detection Count Trend */}
                <div className="mb-4">
                  <div className="text-xs text-gray-400 mb-2">Object Count (Last 60 frames)</div>
                  <ResponsiveContainer width="100%" height={60}>
                    <AreaChart data={analysisHistory}>
                      <defs>
                        <linearGradient id="detectionGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={theme.colors.accent.red} stopOpacity={0.3}/>
                          <stop offset="100%" stopColor={theme.colors.accent.red} stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="timestamp" hide />
                      <YAxis hide domain={[0, 'dataMax']} />
                      <Area 
                        type="monotone" 
                        dataKey="total_detections" 
                        stroke={theme.colors.accent.red}
                        strokeWidth={1}
                        fill="url(#detectionGrad)"
                        dot={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Processing Time Trend */}
                <div className="mb-4">
                  <div className="text-xs text-gray-400 mb-2">Processing Time (ms)</div>
                  <ResponsiveContainer width="100%" height={60}>
                    <AreaChart data={analysisHistory}>
                      <defs>
                        <linearGradient id="timeGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={theme.colors.accent.orange} stopOpacity={0.3}/>
                          <stop offset="100%" stopColor={theme.colors.accent.orange} stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="timestamp" hide />
                      <YAxis hide domain={[0, 'dataMax']} />
                      <ReferenceLine y={100} stroke={theme.colors.accent.amber} strokeDasharray="2 2" strokeWidth={1} opacity={0.6} />
                      <Area 
                        type="monotone" 
                        dataKey="processing_time" 
                        stroke={theme.colors.accent.orange}
                        strokeWidth={1}
                        fill="url(#timeGrad)"
                        dot={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Average Confidence */}
                <div>
                  <div className="text-xs text-gray-400 mb-2">Average Confidence</div>
                  <ResponsiveContainer width="100%" height={60}>
                    <AreaChart data={analysisHistory}>
                      <defs>
                        <linearGradient id="confGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={theme.colors.accent.green} stopOpacity={0.3}/>
                          <stop offset="100%" stopColor={theme.colors.accent.green} stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="timestamp" hide />
                      <YAxis hide domain={[0, 1]} />
                      <ReferenceLine y={0.8} stroke={theme.colors.accent.green} strokeDasharray="2 2" strokeWidth={1} opacity={0.6} />
                      <Area 
                        type="monotone" 
                        dataKey="avg_confidence" 
                        stroke={theme.colors.accent.green}
                        strokeWidth={1}
                        fill="url(#confGrad)"
                        dot={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* System Status */}
              <div className="p-4 rounded-lg" style={{ backgroundColor: theme.colors.primary[800] }}>
                <div className="flex items-center gap-2 mb-3">
                  <Gauge className="w-4 h-4" style={{ color: theme.colors.accent.amber }} />
                  <span className="font-bold text-white text-sm">SYSTEM STATUS</span>
                </div>
                
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Stream Quality</span>
                    <span className="font-mono text-green-400">EXCELLENT</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Latency</span>
                    <span className="font-mono text-white">{15 + Math.floor(Math.random() * 25)}ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Packet Loss</span>
                    <span className="font-mono text-white">{(Math.random() * 0.5).toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">GPU Utilization</span>
                    <span className="font-mono text-white">{65 + Math.floor(Math.random() * 25)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Memory Usage</span>
                                            <span className="font-mono text-white">{(4.2 + Math.random() * 1.8).toFixed(1)} GB</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DroneVideoIntelligenceSystem;