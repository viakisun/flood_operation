import React, { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Area, AreaChart, BarChart, Bar, Cell, Tooltip, CartesianGrid, PieChart, Pie, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { 
  History,
  Search,
  Filter,
  Calendar,
  Clock,
  MapPin,
  Target,
  Activity,
  TrendingUp,
  TrendingDown,
  BarChart3,
  FileText,
  Download,
  Eye,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Pause,
  Play,
  Database,
  Layers,
  Zap,
  Users,
  Shield,
  Navigation,
  Gauge,
  Archive,
  BookOpen,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  RefreshCw,
  Settings,
  Award,
  AlertCircle
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
    }
  }
};

// Data Types
type MissionRecord = {
  id: string;
  mission_type: 'routine_patrol' | 'emergency_response' | 'flood_monitoring' | 'search_rescue' | 'damage_assessment';
  title: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  status: 'completed' | 'failed' | 'partial' | 'aborted';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assigned_drones: string[];
  coverage_area: {
    districts: string[];
    coordinates: { lat: number; lon: number }[];
    area_km2: number;
  };
  objectives: {
    primary: string;
    secondary: string[];
    completed_objectives: number;
    total_objectives: number;
  };
  weather_conditions: {
    temperature: number;
    wind_speed: number;
    precipitation: number;
    visibility: number;
    condition: string;
  };
  data_collected: {
    photos: number;
    videos: number;
    sensor_readings: number;
    water_level_points: number;
    anomalies_detected: number;
  };
  alerts_generated: {
    high_risk: number;
    medium_risk: number;
    low_risk: number;
  };
  performance_metrics: {
    success_rate: number;
    response_time_minutes: number;
    coverage_efficiency: number;
    data_quality_score: number;
    fuel_consumption: number;
  };
  incident_reports: {
    equipment_failures: number;
    weather_delays: number;
    emergency_landings: number;
    communication_issues: number;
  };
  commander_notes: string;
  lessons_learned: string[];
};

type PerformanceAnalytics = {
  period: string;
  total_missions: number;
  success_rate: number;
  avg_response_time: number;
  coverage_area_km2: number;
  data_points_collected: number;
  alerts_generated: number;
  operational_hours: number;
  cost_efficiency: number;
};

// Mock Data Generation
const generateMissionRecords = (): MissionRecord[] => {
  const missions: MissionRecord[] = [];
  const missionTypes = ['routine_patrol', 'emergency_response', 'flood_monitoring', 'search_rescue', 'damage_assessment'] as const;
  const districts = ['전주시', '군산시', '익산시', '정읍시', '남원시', '김제시', '완주군', '진안군', '무주군'];
  
  for (let i = 0; i < 150; i++) {
    const startDate = new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000); // Last 90 days
    const duration = Math.floor(Math.random() * 240 + 30); // 30-270 minutes
    const endDate = new Date(startDate.getTime() + duration * 60 * 1000);
    const missionType = missionTypes[Math.floor(Math.random() * missionTypes.length)];
    
    missions.push({
      id: `MISSION_${String(i + 1).padStart(4, '0')}`,
      mission_type: missionType,
      title: getMissionTitle(missionType, i),
      start_time: startDate.toISOString(),
      end_time: endDate.toISOString(),
      duration_minutes: duration,
      status: getRandomStatus(),
      priority: getRandomPriority(),
      assigned_drones: generateDroneList(),
      coverage_area: {
        districts: districts.slice(0, Math.floor(Math.random() * 3) + 1),
        coordinates: generateCoordinates(),
        area_km2: Math.random() * 50 + 10
      },
      objectives: {
        primary: getPrimaryObjective(missionType),
        secondary: getSecondaryObjectives(),
        completed_objectives: Math.floor(Math.random() * 8 + 2),
        total_objectives: Math.floor(Math.random() * 3 + 8)
      },
      weather_conditions: {
        temperature: Math.random() * 20 + 10,
        wind_speed: Math.random() * 25,
        precipitation: Math.random() * 10,
        visibility: Math.random() * 5 + 5,
        condition: getWeatherCondition()
      },
      data_collected: {
        photos: Math.floor(Math.random() * 200 + 50),
        videos: Math.floor(Math.random() * 20 + 5),
        sensor_readings: Math.floor(Math.random() * 1000 + 100),
        water_level_points: Math.floor(Math.random() * 50 + 10),
        anomalies_detected: Math.floor(Math.random() * 10)
      },
      alerts_generated: {
        high_risk: Math.floor(Math.random() * 5),
        medium_risk: Math.floor(Math.random() * 15 + 5),
        low_risk: Math.floor(Math.random() * 30 + 10)
      },
      performance_metrics: {
        success_rate: Math.random() * 20 + 80,
        response_time_minutes: Math.random() * 30 + 10,
        coverage_efficiency: Math.random() * 15 + 85,
        data_quality_score: Math.random() * 10 + 90,
        fuel_consumption: Math.random() * 50 + 20
      },
      incident_reports: {
        equipment_failures: Math.floor(Math.random() * 3),
        weather_delays: Math.floor(Math.random() * 2),
        emergency_landings: Math.floor(Math.random() * 2),
        communication_issues: Math.floor(Math.random() * 3)
      },
      commander_notes: generateCommanderNotes(missionType),
      lessons_learned: generateLessonsLearned()
    });
  }
  
  return missions.sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime());
};

// Helper Functions
const getMissionTitle = (type: string, index: number): string => {
  const titles = {
    routine_patrol: `정기 순찰 임무 #${index + 1}`,
    emergency_response: `긴급 대응 작전 #${index + 1}`,
    flood_monitoring: `홍수 모니터링 임무 #${index + 1}`,
    search_rescue: `수색구조 작전 #${index + 1}`,
    damage_assessment: `피해 조사 임무 #${index + 1}`
  };
  return titles[type as keyof typeof titles] || `미션 #${index + 1}`;
};

const getRandomStatus = () => {
  const statuses = ['completed', 'failed', 'partial', 'aborted'];
  const weights = [0.75, 0.1, 0.1, 0.05]; // Most missions complete successfully
  const random = Math.random();
  let sum = 0;
  for (let i = 0; i < weights.length; i++) {
    sum += weights[i];
    if (random <= sum) return statuses[i] as any;
  }
  return 'completed' as any;
};

const getRandomPriority = () => {
  const priorities = ['low', 'medium', 'high', 'critical'];
  const weights = [0.3, 0.4, 0.25, 0.05];
  const random = Math.random();
  let sum = 0;
  for (let i = 0; i < weights.length; i++) {
    sum += weights[i];
    if (random <= sum) return priorities[i] as any;
  }
  return 'medium' as any;
};

const generateDroneList = (): string[] => {
  const drones = ['JB-01', 'JB-02', 'JB-03', 'JB-04', 'JB-05', 'JB-06', 'JB-07', 'JB-08'];
  const count = Math.floor(Math.random() * 3) + 1;
  return drones.slice(0, count);
};

const generateCoordinates = () => {
  return Array.from({length: 4}, () => ({
    lat: 35.5 + Math.random() * 0.8,
    lon: 126.8 + Math.random() * 0.8
  }));
};

const getPrimaryObjective = (type: string): string => {
  const objectives = {
    routine_patrol: '지정 구역 정기 모니터링 및 이상 상황 탐지',
    emergency_response: '긴급 상황 대응 및 피해 규모 확인',
    flood_monitoring: '수위 변화 모니터링 및 침수 위험 평가',
    search_rescue: '실종자 수색 및 구조 지점 확인',
    damage_assessment: '재해 피해 규모 조사 및 복구 우선순위 결정'
  };
  return objectives[type as keyof typeof objectives] || '임무 수행';
};

const getSecondaryObjectives = (): string[] => {
  const objectives = [
    '고화질 영상 촬영',
    '센서 데이터 수집',
    'GPS 좌표 기록',
    '기상 상황 관측',
    '인프라 상태 점검',
    '접근로 확인',
    '통신 상태 점검'
  ];
  return objectives.slice(0, Math.floor(Math.random() * 4) + 2);
};

const getWeatherCondition = (): string => {
  const conditions = ['맑음', '구름많음', '흐림', '비', '강풍', '안개'];
  return conditions[Math.floor(Math.random() * conditions.length)];
};

const generateCommanderNotes = (type: string): string => {
  const notes = {
    routine_patrol: '정상적인 순찰 임무 완료. 특이사항 없음.',
    emergency_response: '신속한 대응으로 상황 파악 완료. 추가 지원 필요.',
    flood_monitoring: '수위 상승 확인. 지속적인 모니터링 권장.',
    search_rescue: '수색 구역 확대 필요. 기상 조건 양호.',
    damage_assessment: '피해 규모 예상보다 심각. 복구팀 즉시 투입 권고.'
  };
  return notes[type as keyof typeof notes] || '임무 완료';
};

const generateLessonsLearned = (): string[] => {
  const lessons = [
    '배터리 관리 최적화 필요',
    '기상 조건 사전 확인 중요',
    '통신 백업 시스템 필수',
    '드론 간 협조 체계 개선',
    '데이터 백업 절차 강화',
    '긴급 착륙 지점 사전 확보',
    '야간 운용 장비 보강'
  ];
  return lessons.slice(0, Math.floor(Math.random() * 3) + 1);
};

// Main Component
const MissionHistorySystem: React.FC = () => {
  const [missions] = useState<MissionRecord[]>(generateMissionRecords());
  const [currentTime] = useState(new Date());
  const [selectedMission, setSelectedMission] = useState<MissionRecord | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'analytics' | 'timeline' | 'archive'>('list');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const [expandedMission, setExpandedMission] = useState<string | null>(null);

  // Filtered missions
  const filteredMissions = useMemo(() => {
    return missions.filter(mission => {
      // Date range filter
      if (dateRange !== 'all') {
        const days = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90;
        const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
        if (new Date(mission.start_time) < cutoffDate) return false;
      }
      
      // Status filter
      if (filterStatus !== 'all' && mission.status !== filterStatus) return false;
      
      // Type filter
      if (filterType !== 'all' && mission.mission_type !== filterType) return false;
      
      // Priority filter
      if (filterPriority !== 'all' && mission.priority !== filterPriority) return false;
      
      // Search term
      if (searchTerm && !mission.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !mission.coverage_area.districts.some(d => d.toLowerCase().includes(searchTerm.toLowerCase()))) {
        return false;
      }
      
      return true;
    });
  }, [missions, filterStatus, filterType, filterPriority, searchTerm, dateRange]);

  // Analytics data
  const analyticsData = useMemo(() => {
    const totalMissions = filteredMissions.length;
    const completedMissions = filteredMissions.filter(m => m.status === 'completed').length;
    const avgDuration = filteredMissions.reduce((sum, m) => sum + m.duration_minutes, 0) / totalMissions || 0;
    const totalArea = filteredMissions.reduce((sum, m) => sum + m.coverage_area.area_km2, 0);
    const totalData = filteredMissions.reduce((sum, m) => 
      sum + m.data_collected.photos + m.data_collected.videos + m.data_collected.sensor_readings, 0);
    const avgSuccessRate = filteredMissions.reduce((sum, m) => sum + m.performance_metrics.success_rate, 0) / totalMissions || 0;

    return {
      totalMissions,
      completedMissions,
      successRate: (completedMissions / totalMissions * 100) || 0,
      avgDuration,
      totalArea,
      totalData,
      avgSuccessRate
    };
  }, [filteredMissions]);

  // Chart data
  const chartData = useMemo(() => {
    const last30Days = Array.from({length: 30}, (_, i) => {
      const date = new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000);
      const dayMissions = missions.filter(m => {
        const missionDate = new Date(m.start_time);
        return missionDate.toDateString() === date.toDateString();
      });
      
      return {
        date: date.toLocaleDateString('ko-KR', {month: 'short', day: 'numeric'}),
        missions: dayMissions.length,
        success_rate: dayMissions.length ? 
          dayMissions.filter(m => m.status === 'completed').length / dayMissions.length * 100 : 0,
        avg_duration: dayMissions.length ? 
          dayMissions.reduce((sum, m) => sum + m.duration_minutes, 0) / dayMissions.length : 0,
        alerts: dayMissions.reduce((sum, m) => sum + m.alerts_generated.high_risk + m.alerts_generated.medium_risk, 0)
      };
    });
    
    return last30Days;
  }, [missions]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return theme.colors.accent.green;
      case 'failed': return theme.colors.accent.red;
      case 'partial': return theme.colors.accent.orange;
      case 'aborted': return '#6B7280';
      default: return theme.colors.accent.blue;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return theme.colors.accent.red;
      case 'high': return theme.colors.accent.orange;
      case 'medium': return theme.colors.accent.amber;
      case 'low': return theme.colors.accent.green;
      default: return theme.colors.accent.blue;
    }
  };

  const getMissionTypeLabel = (type: string) => {
    const labels = {
      routine_patrol: '정기순찰',
      emergency_response: '긴급대응',
      flood_monitoring: '홍수모니터링',
      search_rescue: '수색구조',
      damage_assessment: '피해조사'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}시간 ${mins}분`;
    }
    return `${mins}분`;
  };

  return (
    <div className="h-screen w-screen flex flex-col font-sans text-sm overflow-hidden" 
         style={{ 
           backgroundColor: theme.colors.primary[950], 
           color: '#F8FAFC'
         }}>
      
      {/* Header */}
      <header className="h-16 flex items-center justify-between px-6 border-b flex-shrink-0" 
              style={{ 
                borderColor: theme.colors.primary[700], 
                backgroundColor: theme.colors.primary[900] 
              }}>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center rounded" 
                 style={{ backgroundColor: theme.colors.accent.purple }}>
              <History className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-xs font-bold tracking-wider text-white">임무 히스토리 & 아카이브</div>
              <div className="text-xs" style={{ color: '#CBD5E1' }}>
                MISSION HISTORY & ARCHIVE SYSTEM
              </div>
            </div>
          </div>
          
          {/* View Mode Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">뷰모드:</span>
            <div className="flex bg-black bg-opacity-30 rounded overflow-hidden">
              {([
                {key: 'list', label: '목록', icon: FileText},
                {key: 'analytics', label: '분석', icon: BarChart3},
                {key: 'timeline', label: '타임라인', icon: Clock},
                {key: 'archive', label: '아카이브', icon: Archive}
              ] as const).map(mode => (
                <button
                  key={mode.key}
                  onClick={() => setViewMode(mode.key)}
                  className={`flex items-center gap-2 px-3 py-2 text-xs font-bold transition-colors ${
                    viewMode === mode.key ? 'text-black' : 'text-white hover:bg-white hover:bg-opacity-10'
                  }`}
                  style={{ 
                    backgroundColor: viewMode === mode.key ? theme.colors.accent.purple : 'transparent' 
                  }}
                >
                  <mode.icon className="w-3 h-3" />
                  {mode.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right font-mono">
            <div className="text-xs font-bold text-white">
              {currentTime.toLocaleString('ko-KR', { 
                month: 'short', 
                day: '2-digit', 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </div>
            <div className="text-xs text-gray-400">총 {missions.length}개 임무 기록</div>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="p-2 rounded bg-slate-700 hover:bg-slate-600 transition-colors">
              <RefreshCw className="w-4 h-4" />
            </button>
            <button className="p-2 rounded bg-slate-700 hover:bg-slate-600 transition-colors">
              <Download className="w-4 h-4" />
            </button>
            <button className="p-2 rounded bg-slate-700 hover:bg-slate-600 transition-colors">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Summary Dashboard */}
      <div className="h-20 px-6 py-3 border-b flex-shrink-0" 
           style={{ 
             borderColor: theme.colors.primary[700], 
             backgroundColor: theme.colors.primary[900] 
           }}>
        <div className="grid grid-cols-7 gap-6 h-full">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center rounded-lg" 
                 style={{ backgroundColor: `${theme.colors.accent.blue}20` }}>
              <Target className="w-5 h-5" style={{ color: theme.colors.accent.blue }} />
            </div>
            <div>
              <div className="text-xs font-bold tracking-wide text-gray-300">총 임무</div>
              <div className="text-lg font-bold text-white font-mono">
                {analyticsData.totalMissions}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center rounded-lg" 
                 style={{ backgroundColor: `${theme.colors.accent.green}20` }}>
              <CheckCircle2 className="w-5 h-5" style={{ color: theme.colors.accent.green }} />
            </div>
            <div>
              <div className="text-xs font-bold tracking-wide text-gray-300">성공률</div>
              <div className="text-lg font-bold text-white font-mono">
                {analyticsData.successRate.toFixed(1)}%
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center rounded-lg" 
                 style={{ backgroundColor: `${theme.colors.accent.orange}20` }}>
              <Clock className="w-5 h-5" style={{ color: theme.colors.accent.orange }} />
            </div>
            <div>
              <div className="text-xs font-bold tracking-wide text-gray-300">평균 시간</div>
              <div className="text-lg font-bold text-white font-mono">
                {Math.round(analyticsData.avgDuration)}분
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center rounded-lg" 
                 style={{ backgroundColor: `${theme.colors.accent.teal}20` }}>
              <MapPin className="w-5 h-5" style={{ color: theme.colors.accent.teal }} />
            </div>
            <div>
              <div className="text-xs font-bold tracking-wide text-gray-300">커버리지</div>
              <div className="text-lg font-bold text-white font-mono">
                {analyticsData.totalArea.toFixed(0)}km²
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center rounded-lg" 
                 style={{ backgroundColor: `${theme.colors.accent.purple}20` }}>
              <Database className="w-5 h-5" style={{ color: theme.colors.accent.purple }} />
            </div>
            <div>
              <div className="text-xs font-bold tracking-wide text-gray-300">데이터 수집</div>
              <div className="text-lg font-bold text-white font-mono">
                {Math.floor(analyticsData.totalData / 1000)}k
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center rounded-lg" 
                 style={{ backgroundColor: `${theme.colors.accent.amber}20` }}>
              <Award className="w-5 h-5" style={{ color: theme.colors.accent.amber }} />
            </div>
            <div>
              <div className="text-xs font-bold tracking-wide text-gray-300">평균 성과</div>
              <div className="text-lg font-bold text-white font-mono">
                {analyticsData.avgSuccessRate.toFixed(1)}점
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center rounded-lg" 
                 style={{ backgroundColor: `${theme.colors.accent.red}20` }}>
              <AlertTriangle className="w-5 h-5" style={{ color: theme.colors.accent.red }} />
            </div>
            <div>
              <div className="text-xs font-bold tracking-wide text-gray-300">고위험 알림</div>
              <div className="text-lg font-bold text-white font-mono">
                {filteredMissions.reduce((sum, m) => sum + m.alerts_generated.high_risk, 0)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex min-h-0">
        
        {/* Left Panel - Filters & Search */}
        <div className="w-80 border-r flex flex-col flex-shrink-0" 
             style={{ 
               borderColor: theme.colors.primary[700], 
               backgroundColor: theme.colors.primary[900] 
             }}>
          
          <div className="h-12 flex items-center justify-between px-4 border-b flex-shrink-0" 
               style={{ borderColor: theme.colors.primary[700] }}>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4" style={{ color: theme.colors.accent.teal }} />
              <span className="font-bold tracking-wide text-white">필터 & 검색</span>
            </div>
            <div className="text-xs text-gray-400">{filteredMissions.length}건</div>
          </div>

          <div className="p-4 space-y-4 flex-shrink-0" style={{ borderColor: theme.colors.primary[700] }}>
            
            {/* Search */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2">검색</label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="임무명 또는 지역 검색..."
                  className="w-full pl-10 p-2 rounded text-sm bg-black bg-opacity-30 text-white border border-gray-600 focus:border-purple-500"
                />
              </div>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2">기간</label>
              <div className="grid grid-cols-2 gap-2">
                {(['7d', '30d', '90d', 'all'] as const).map(range => (
                  <button
                    key={range}
                    onClick={() => setDateRange(range)}
                    className={`py-2 px-3 text-xs font-bold rounded transition-colors ${
                      dateRange === range ? 'text-black' : 'text-white hover:bg-white hover:bg-opacity-10'
                    }`}
                    style={{ 
                      backgroundColor: dateRange === range ? theme.colors.accent.purple : theme.colors.primary[800]
                    }}
                  >
                    {range === 'all' ? '전체' : range}
                  </button>
                ))}
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2">상태</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full p-2 rounded text-sm bg-black bg-opacity-30 text-white border border-gray-600 focus:border-purple-500"
              >
                <option value="all">전체 상태</option>
                <option value="completed">완료</option>
                <option value="failed">실패</option>
                <option value="partial">부분완료</option>
                <option value="aborted">중단</option>
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2">임무 유형</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full p-2 rounded text-sm bg-black bg-opacity-30 text-white border border-gray-600 focus:border-purple-500"
              >
                <option value="all">전체 유형</option>
                <option value="routine_patrol">정기순찰</option>
                <option value="emergency_response">긴급대응</option>
                <option value="flood_monitoring">홍수모니터링</option>
                <option value="search_rescue">수색구조</option>
                <option value="damage_assessment">피해조사</option>
              </select>
            </div>

            {/* Priority Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2">우선순위</label>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="w-full p-2 rounded text-sm bg-black bg-opacity-30 text-white border border-gray-600 focus:border-purple-500"
              >
                <option value="all">전체 우선순위</option>
                <option value="critical">긴급</option>
                <option value="high">높음</option>
                <option value="medium">보통</option>
                <option value="low">낮음</option>
              </select>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex-1 px-4 pb-4">
            <div className="bg-gray-900 bg-opacity-30 rounded-lg p-4 border border-gray-700">
              <h4 className="text-sm font-bold text-white mb-3">빠른 통계</h4>
              <div className="space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">이번 주 임무</span>
                  <span className="font-mono text-white">
                    {missions.filter(m => {
                      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                      return new Date(m.start_time) > weekAgo;
                    }).length}건
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">평균 응답시간</span>
                  <span className="font-mono text-white">
                    {(missions.reduce((sum, m) => sum + m.performance_metrics.response_time_minutes, 0) / missions.length).toFixed(0)}분
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">데이터 품질</span>
                  <span className="font-mono text-white">
                    {(missions.reduce((sum, m) => sum + m.performance_metrics.data_quality_score, 0) / missions.length).toFixed(1)}점
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* List View */}
          {viewMode === 'list' && (
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-3">
                {filteredMissions.map(mission => (
                  <div key={mission.id} className="bg-gray-900 bg-opacity-30 rounded-lg border border-gray-700">
                    <div 
                      className="p-4 cursor-pointer hover:bg-white hover:bg-opacity-5 transition-colors"
                      onClick={() => setExpandedMission(expandedMission === mission.id ? null : mission.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 flex items-center justify-center rounded-lg"
                               style={{ backgroundColor: `${getStatusColor(mission.status)}20` }}>
                            {mission.status === 'completed' ? <CheckCircle2 className="w-5 h-5" style={{ color: getStatusColor(mission.status) }} /> :
                             mission.status === 'failed' ? <XCircle className="w-5 h-5" style={{ color: getStatusColor(mission.status) }} /> :
                             mission.status === 'partial' ? <AlertCircle className="w-5 h-5" style={{ color: getStatusColor(mission.status) }} /> :
                             <Pause className="w-5 h-5" style={{ color: getStatusColor(mission.status) }} />}
                          </div>
                          <div>
                            <div className="flex items-center gap-3">
                              <h3 className="text-sm font-bold text-white">{mission.title}</h3>
                              <span className="px-2 py-1 rounded text-xs font-medium border"
                                    style={{ 
                                      borderColor: getPriorityColor(mission.priority) + '40',
                                      backgroundColor: getPriorityColor(mission.priority) + '20',
                                      color: getPriorityColor(mission.priority)
                                    }}>
                                {mission.priority.toUpperCase()}
                              </span>
                              <span className="px-2 py-1 rounded text-xs font-medium"
                                    style={{ 
                                      backgroundColor: theme.colors.accent.blue + '20',
                                      color: theme.colors.accent.blue
                                    }}>
                                {getMissionTypeLabel(mission.mission_type)}
                              </span>
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              {new Date(mission.start_time).toLocaleString('ko-KR')} • 
                              {formatDuration(mission.duration_minutes)} • 
                              {mission.coverage_area.districts.join(', ')}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-sm font-bold text-white">
                              {mission.performance_metrics.success_rate.toFixed(0)}%
                            </div>
                            <div className="text-xs text-gray-400">성공률</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold text-white">
                              {mission.assigned_drones.length}대
                            </div>
                            <div className="text-xs text-gray-400">드론</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold text-white">
                              {mission.alerts_generated.high_risk + mission.alerts_generated.medium_risk}
                            </div>
                            <div className="text-xs text-gray-400">알림</div>
                          </div>
                          {expandedMission === mission.id ? 
                            <ChevronUp className="w-5 h-5 text-gray-400" /> : 
                            <ChevronDown className="w-5 h-5 text-gray-400" />}
                        </div>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {expandedMission === mission.id && (
                      <div className="px-4 pb-4 border-t border-gray-600">
                        <div className="grid grid-cols-3 gap-6 mt-4">
                          
                          {/* Mission Details */}
                          <div>
                            <h4 className="text-sm font-bold text-white mb-3">임무 상세</h4>
                            <div className="space-y-2 text-xs">
                              <div>
                                <span className="text-gray-400">주요 목표:</span>
                                <div className="text-white mt-1">{mission.objectives.primary}</div>
                              </div>
                              <div>
                                <span className="text-gray-400">완료도:</span>
                                <div className="text-white">
                                  {mission.objectives.completed_objectives}/{mission.objectives.total_objectives} 
                                  ({Math.round(mission.objectives.completed_objectives / mission.objectives.total_objectives * 100)}%)
                                </div>
                              </div>
                              <div>
                                <span className="text-gray-400">투입 드론:</span>
                                <div className="text-white">{mission.assigned_drones.join(', ')}</div>
                              </div>
                              <div>
                                <span className="text-gray-400">커버리지:</span>
                                <div className="text-white">{mission.coverage_area.area_km2.toFixed(1)} km²</div>
                              </div>
                            </div>
                          </div>

                          {/* Performance Metrics */}
                          <div>
                            <h4 className="text-sm font-bold text-white mb-3">성과 지표</h4>
                            <div className="space-y-3">
                              <div>
                                <div className="flex justify-between text-xs mb-1">
                                  <span className="text-gray-400">성공률</span>
                                  <span className="text-white">{mission.performance_metrics.success_rate.toFixed(0)}%</span>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-2">
                                  <div 
                                    className="h-2 rounded-full"
                                    style={{ 
                                      width: `${mission.performance_metrics.success_rate}%`,
                                      backgroundColor: theme.colors.accent.green
                                    }}
                                  />
                                </div>
                              </div>
                              <div>
                                <div className="flex justify-between text-xs mb-1">
                                  <span className="text-gray-400">효율성</span>
                                  <span className="text-white">{mission.performance_metrics.coverage_efficiency.toFixed(0)}%</span>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-2">
                                  <div 
                                    className="h-2 rounded-full"
                                    style={{ 
                                      width: `${mission.performance_metrics.coverage_efficiency}%`,
                                      backgroundColor: theme.colors.accent.blue
                                    }}
                                  />
                                </div>
                              </div>
                              <div>
                                <div className="flex justify-between text-xs mb-1">
                                  <span className="text-gray-400">데이터 품질</span>
                                  <span className="text-white">{mission.performance_metrics.data_quality_score.toFixed(0)}점</span>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-2">
                                  <div 
                                    className="h-2 rounded-full"
                                    style={{ 
                                      width: `${mission.performance_metrics.data_quality_score}%`,
                                      backgroundColor: theme.colors.accent.purple
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Data & Alerts */}
                          <div>
                            <h4 className="text-sm font-bold text-white mb-3">수집 데이터 & 알림</h4>
                            <div className="grid grid-cols-2 gap-3 text-xs">
                              <div className="text-center p-2 rounded" style={{ backgroundColor: theme.colors.primary[800] }}>
                                <div className="text-lg font-bold text-white">{mission.data_collected.photos}</div>
                                <div className="text-gray-400">사진</div>
                              </div>
                              <div className="text-center p-2 rounded" style={{ backgroundColor: theme.colors.primary[800] }}>
                                <div className="text-lg font-bold text-white">{mission.data_collected.videos}</div>
                                <div className="text-gray-400">영상</div>
                              </div>
                              <div className="text-center p-2 rounded" style={{ backgroundColor: theme.colors.primary[800] }}>
                                <div className="text-lg font-bold text-white">{mission.data_collected.sensor_readings}</div>
                                <div className="text-gray-400">센서</div>
                              </div>
                              <div className="text-center p-2 rounded" style={{ backgroundColor: theme.colors.primary[800] }}>
                                <div className="text-lg font-bold text-white">{mission.alerts_generated.high_risk}</div>
                                <div className="text-gray-400">고위험</div>
                              </div>
                            </div>
                            
                            {mission.commander_notes && (
                              <div className="mt-3 p-2 rounded" style={{ backgroundColor: theme.colors.primary[800] }}>
                                <div className="text-xs text-gray-400 mb-1">지휘관 노트</div>
                                <div className="text-xs text-white">{mission.commander_notes}</div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Analytics View */}
          {viewMode === 'analytics' && (
            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid grid-cols-2 gap-6 h-full">
                
                {/* Mission Trends */}
                <div className="bg-gray-900 bg-opacity-30 rounded-lg p-4 border border-gray-700">
                  <h3 className="text-lg font-bold text-white mb-4">30일 임무 동향</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="missionGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={theme.colors.accent.blue} stopOpacity={0.3}/>
                          <stop offset="95%" stopColor={theme.colors.accent.blue} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 10 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 10 }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: theme.colors.primary[800], 
                          border: `1px solid ${theme.colors.primary[600]}`,
                          color: 'white',
                          fontSize: '11px'
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="missions" 
                        stroke={theme.colors.accent.blue}
                        strokeWidth={2}
                        fill="url(#missionGrad)"
                        name="일일 임무 수"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Success Rate Trends */}
                <div className="bg-gray-900 bg-opacity-30 rounded-lg p-4 border border-gray-700">
                  <h3 className="text-lg font-bold text-white mb-4">성공률 추이</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 10 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 10 }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: theme.colors.primary[800], 
                          border: `1px solid ${theme.colors.primary[600]}`,
                          color: 'white',
                          fontSize: '11px'
                        }}
                        formatter={(value) => [`${value.toFixed(1)}%`, '성공률']}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="success_rate" 
                        stroke={theme.colors.accent.green}
                        strokeWidth={2}
                        dot={{ fill: theme.colors.accent.green, strokeWidth: 2, r: 3 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Mission Types Distribution */}
                <div className="bg-gray-900 bg-opacity-30 rounded-lg p-4 border border-gray-700">
                  <h3 className="text-lg font-bold text-white mb-4">임무 유형별 분포</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: '정기순찰', value: filteredMissions.filter(m => m.mission_type === 'routine_patrol').length, color: theme.colors.accent.blue },
                          { name: '긴급대응', value: filteredMissions.filter(m => m.mission_type === 'emergency_response').length, color: theme.colors.accent.red },
                          { name: '홍수모니터링', value: filteredMissions.filter(m => m.mission_type === 'flood_monitoring').length, color: theme.colors.accent.teal },
                          { name: '수색구조', value: filteredMissions.filter(m => m.mission_type === 'search_rescue').length, color: theme.colors.accent.orange },
                          { name: '피해조사', value: filteredMissions.filter(m => m.mission_type === 'damage_assessment').length, color: theme.colors.accent.purple }
                        ]}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                      >
                        {[
                          { color: theme.colors.accent.blue },
                          { color: theme.colors.accent.red },
                          { color: theme.colors.accent.teal },
                          { color: theme.colors.accent.orange },
                          { color: theme.colors.accent.purple }
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: theme.colors.primary[800], 
                          border: `1px solid ${theme.colors.primary[600]}`,
                          color: 'white',
                          fontSize: '11px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Performance Radar */}
                <div className="bg-gray-900 bg-opacity-30 rounded-lg p-4 border border-gray-700">
                  <h3 className="text-lg font-bold text-white mb-4">종합 성과 분석</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <RadarChart data={[
                      { metric: '성공률', value: analyticsData.avgSuccessRate },
                      { metric: '효율성', value: filteredMissions.reduce((sum, m) => sum + m.performance_metrics.coverage_efficiency, 0) / filteredMissions.length || 0 },
                      { metric: '데이터품질', value: filteredMissions.reduce((sum, m) => sum + m.performance_metrics.data_quality_score, 0) / filteredMissions.length || 0 },
                      { metric: '응답시간', value: 100 - (filteredMissions.reduce((sum, m) => sum + m.performance_metrics.response_time_minutes, 0) / filteredMissions.length || 0) },
                      { metric: '안전성', value: 95 - (filteredMissions.reduce((sum, m) => sum + m.incident_reports.equipment_failures + m.incident_reports.emergency_landings, 0) / filteredMissions.length * 10) }
                    ]}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="metric" tick={{ fill: '#9CA3AF', fontSize: 10 }} />
                      <PolarRadiusAxis tick={{ fill: '#9CA3AF', fontSize: 10 }} />
                      <Radar 
                        name="성과" 
                        dataKey="value" 
                        stroke={theme.colors.accent.purple} 
                        fill={theme.colors.accent.purple} 
                        fillOpacity={0.3}
                        strokeWidth={2}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: theme.colors.primary[800], 
                          border: `1px solid ${theme.colors.primary[600]}`,
                          color: 'white',
                          fontSize: '11px'
                        }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* Timeline View */}
          {viewMode === 'timeline' && (
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-6">
                {Array.from(new Set(filteredMissions.map(m => new Date(m.start_time).toDateString()))).slice(0, 10).map(dateStr => {
                  const date = new Date(dateStr);
                  const dayMissions = filteredMissions.filter(m => new Date(m.start_time).toDateString() === dateStr);
                  
                  return (
                    <div key={dateStr} className="relative">
                      {/* Date Header */}
                      <div className="flex items-center gap-4 mb-4">
                        <div className="bg-gray-900 bg-opacity-50 rounded-lg p-3 border border-gray-700">
                          <div className="text-lg font-bold text-white">
                            {date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
                          </div>
                          <div className="text-xs text-gray-400">
                            {date.toLocaleDateString('ko-KR', { weekday: 'long' })}
                          </div>
                        </div>
                        <div className="text-sm text-gray-400">
                          {dayMissions.length}개 임무
                        </div>
                        <div className="flex-1 h-px bg-gray-700"></div>
                      </div>

                      {/* Missions for this date */}
                      <div className="ml-8 space-y-3">
                        {dayMissions.map(mission => (
                          <div key={mission.id} className="flex items-start gap-4">
                            <div className="w-2 h-2 rounded-full mt-3 flex-shrink-0"
                                 style={{ backgroundColor: getStatusColor(mission.status) }}></div>
                            <div className="flex-1 bg-gray-900 bg-opacity-30 rounded-lg p-4 border border-gray-700">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                  <h4 className="text-sm font-bold text-white">{mission.title}</h4>
                                  <span className="px-2 py-1 rounded text-xs font-medium"
                                        style={{ 
                                          backgroundColor: theme.colors.accent.blue + '20',
                                          color: theme.colors.accent.blue
                                        }}>
                                    {getMissionTypeLabel(mission.mission_type)}
                                  </span>
                                </div>
                                <div className="text-xs text-gray-400">
                                  {new Date(mission.start_time).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })} - 
                                  {new Date(mission.end_time).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                                </div>
                              </div>
                              <div className="text-xs text-gray-400">
                                {mission.coverage_area.districts.join(', ')} • 
                                {formatDuration(mission.duration_minutes)} • 
                                성공률 {mission.performance_metrics.success_rate.toFixed(0)}%
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Archive View */}
          {viewMode === 'archive' && (
            <div className="flex-1 p-4">
              <div className="text-center h-full flex items-center justify-center">
                <div>
                  <Archive className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                  <h3 className="text-lg font-bold text-white mb-2">데이터 아카이브</h3>
                  <p className="text-gray-400 mb-4">
                    장기 보관된 임무 데이터를 조회하고 관리할 수 있습니다.
                  </p>
                  <div className="grid grid-cols-3 gap-4 max-w-md">
                    <button className="p-3 rounded bg-gray-800 hover:bg-gray-700 transition-colors">
                      <BookOpen className="w-6 h-6 mx-auto mb-2 text-blue-400" />
                      <div className="text-xs text-white">보고서</div>
                    </button>
                    <button className="p-3 rounded bg-gray-800 hover:bg-gray-700 transition-colors">
                      <Database className="w-6 h-6 mx-auto mb-2 text-green-400" />
                      <div className="text-xs text-white">데이터베이스</div>
                    </button>
                    <button className="p-3 rounded bg-gray-800 hover:bg-gray-700 transition-colors">
                      <Download className="w-6 h-6 mx-auto mb-2 text-purple-400" />
                      <div className="text-xs text-white">내보내기</div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MissionHistorySystem;