import React, { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Area, AreaChart, BarChart, Bar, Cell, Tooltip, CartesianGrid } from 'recharts';
import { 
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Cloud,
  CloudRain,
  Sun,
  Eye,
  Shield,
  Clock,
  Target,
  Activity,
  Users,
  Phone,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Navigation,
  Settings,
  Brain,
  Database,
  Waves
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
    risk: {
      very_low: '#10B981',
      low: '#22C55E',
      moderate: '#F59E0B',
      high: '#F97316',
      very_high: '#EF4444',
      extreme: '#B91C1C'
    },
    weather: {
      clear: '#F59E0B',
      cloudy: '#6B7280',
      rain: '#3B82F6',
      storm: '#7C3AED',
      snow: '#E5E7EB'
    }
  }
};

// Data Types
type DroneStation = {
  id: string;
  name: string;
  location: { lat: number; lon: number };
  district: string;
  status: 'active' | 'warning' | 'critical' | 'offline';
  last_update: string;
  sensors: {
    water_level_cm: number;
    flow_rate_m3s: number;
    turbidity_ntu: number;
    temperature_c: number;
    ph_level: number;
  };
  risk_factors: {
    flood_probability: number;
    population_at_risk: number;
    infrastructure_risk: 'low' | 'moderate' | 'high' | 'critical';
    evacuation_time_min: number;
  };
  historical_max_level: number;
  elevation_m: number;
};

type WeatherData = {
  timestamp: string;
  temperature_c: number;
  humidity_pct: number;
  precipitation_mm: number;
  wind_speed_kmh: number;
  condition: 'clear' | 'cloudy' | 'rain' | 'storm' | 'snow';
};

// Mock Data
const jeonbukDistricts = [
  '전주시', '군산시', '익산시', '정읍시', '남원시', '김제시',
  '완주군', '진안군', '무주군', '장수군', '임실군', '순창군', '고창군', '부안군'
];

const generateDroneStations = (): DroneStation[] => {
  const stations: DroneStation[] = [];
  
  const locations = [
    { name: '만경강_전주', lat: 35.8242, lon: 127.1480, district: '전주시' },
    { name: '동진강_정읍', lat: 35.5697, lon: 126.8560, district: '정읍시' },
    { name: '섬진강_남원', lat: 35.4164, lon: 127.3903, district: '남원시' },
    { name: '금강_무주', lat: 36.0071, lon: 127.6605, district: '무주군' },
    { name: '만경강_김제', lat: 35.8033, lon: 126.8806, district: '김제시' },
    { name: '고창천_고창', lat: 35.4350, lon: 126.7011, district: '고창군' },
    { name: '임진강_완주', lat: 35.9008, lon: 127.1667, district: '완주군' },
    { name: '요천_임실', lat: 35.6176, lon: 127.2896, district: '임실군' },
    { name: '금강_진안', lat: 35.7916, lon: 127.4250, district: '진안군' },
    { name: '뱀사골_장수', lat: 35.6478, lon: 127.5206, district: '장수군' },
    { name: '동진강_부안', lat: 35.7317, lon: 126.7336, district: '부안군' },
    { name: '만경강_익산', lat: 35.9483, lon: 126.9578, district: '익산시' },
    { name: '금강_군산', lat: 35.9677, lon: 126.7370, district: '군산시' },
    { name: '순창천_순창', lat: 35.3739, lon: 127.1376, district: '순창군' },
    { name: '덕천강_정읍', lat: 35.5447, lon: 126.8661, district: '정읍시' },
    { name: '고부천_정읍', lat: 35.5856, lon: 126.8358, district: '정읍시' },
    { name: '전주천_전주', lat: 35.8456, lon: 127.1286, district: '전주시' },
    { name: '소양천_완주', lat: 35.8858, lon: 127.2097, district: '완주군' },
    { name: '주진천_무주', lat: 36.0203, lon: 127.6886, district: '무주군' },
    { name: '오수천_임실', lat: 35.5025, lon: 127.3058, district: '임실군' }
  ];

  locations.forEach((loc, idx) => {
    const waterLevel = 50 + Math.random() * 150;
    const isHighRisk = Math.random() < 0.2;
    const isOffline = Math.random() < 0.05;
    
    stations.push({
      id: `STATION_${String(idx + 1).padStart(3, '0')}`,
      name: loc.name,
      location: { lat: loc.lat, lon: loc.lon },
      district: loc.district,
      status: isOffline ? 'offline' : 
              isHighRisk ? 'critical' : 
              waterLevel > 150 ? 'warning' : 'active',
      last_update: new Date(Date.now() - Math.random() * 300000).toISOString(),
      sensors: {
        water_level_cm: waterLevel,
        flow_rate_m3s: 2.5 + Math.random() * 15,
        turbidity_ntu: 10 + Math.random() * 50,
        temperature_c: 12 + Math.random() * 8,
        ph_level: 6.8 + Math.random() * 0.6
      },
      risk_factors: {
        flood_probability: isHighRisk ? 0.7 + Math.random() * 0.3 : Math.random() * 0.4,
        population_at_risk: Math.floor(Math.random() * 5000) + 500,
        infrastructure_risk: isHighRisk ? 'critical' : 
                           waterLevel > 150 ? 'high' : 
                           waterLevel > 100 ? 'moderate' : 'low',
        evacuation_time_min: 15 + Math.random() * 45
      },
      historical_max_level: waterLevel + 50 + Math.random() * 100,
      elevation_m: Math.random() * 300 + 20
    });
  });
  
  return stations;
};

const generateWeatherData = (): WeatherData[] => {
  const data: WeatherData[] = [];
  const now = new Date();
  
  for (let i = 47; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 3600000);
    const isStorm = Math.random() < 0.15;
    const isRain = isStorm || Math.random() < 0.3;
    
    data.push({
      timestamp: timestamp.toISOString(),
      temperature_c: 15 + Math.random() * 15,
      humidity_pct: 40 + Math.random() * 50,
      precipitation_mm: isRain ? Math.random() * (isStorm ? 30 : 10) : 0,
      wind_speed_kmh: isStorm ? 20 + Math.random() * 40 : Math.random() * 25,
      condition: isStorm ? 'storm' : isRain ? 'rain' : 
                 Math.random() < 0.3 ? 'cloudy' : 'clear'
    });
  }
  
  return data;
};

// Utility Functions
const getRiskColor = (level: string) => {
  return theme.colors.risk[level as keyof typeof theme.colors.risk] || '#6B7280';
};

const getWeatherIcon = (condition: string) => {
  switch (condition) {
    case 'clear': return Sun;
    case 'cloudy': return Cloud;
    case 'rain': return CloudRain;
    case 'storm': return CloudRain;
    default: return Cloud;
  }
};

const formatTimestamp = (isoString: string, format: 'time' | 'date' | 'datetime' = 'datetime'): string => {
  const date = new Date(isoString);
  
  if (format === 'time') {
    return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
  } else if (format === 'date') {
    return date.toLocaleDateString('ko-KR', { month: 'short', day: '2-digit' });
  } else {
    return date.toLocaleString('ko-KR', { 
      month: 'short', 
      day: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }
};

const calculateDistrictRisk = (stations: DroneStation[]): Array<{district: string, risk: number, stations: number}> => {
  const districtMap = new Map<string, {totalRisk: number, count: number}>();
  
  stations.forEach(station => {
    const current = districtMap.get(station.district) || {totalRisk: 0, count: 0};
    districtMap.set(station.district, {
      totalRisk: current.totalRisk + station.risk_factors.flood_probability,
      count: current.count + 1
    });
  });
  
  return Array.from(districtMap.entries()).map(([district, data]) => ({
    district,
    risk: data.totalRisk / data.count,
    stations: data.count
  })).sort((a, b) => b.risk - a.risk);
};

// Main Component
const DisasterAnalysisSystem: React.FC = () => {
  const [droneStations] = useState<DroneStation[]>(generateDroneStations());
  const [weatherData] = useState<WeatherData[]>(generateWeatherData());
  const [selectedTimeRange, setSelectedTimeRange] = useState<'6h' | '12h' | '24h' | '48h'>('24h');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [selectedStation, setSelectedStation] = useState<string | null>(null);
  const [analysisMode, setAnalysisMode] = useState<'overview' | 'detailed' | 'prediction' | 'response'>('overview');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Calculate aggregate metrics
  const aggregateMetrics = useMemo(() => {
    const activeStations = droneStations.filter(s => s.status !== 'offline').length;
    const criticalStations = droneStations.filter(s => s.status === 'critical').length;
    const avgWaterLevel = droneStations.reduce((sum, s) => sum + s.sensors.water_level_cm, 0) / droneStations.length;
    const totalPopulationAtRisk = droneStations.reduce((sum, s) => sum + s.risk_factors.population_at_risk, 0);
    const avgFloodProbability = droneStations.reduce((sum, s) => sum + s.risk_factors.flood_probability, 0) / droneStations.length;
    
    const latestWeather = weatherData[weatherData.length - 1];
    const totalRainfall24h = weatherData.slice(-24).reduce((sum, w) => sum + w.precipitation_mm, 0);
    
    return {
      activeStations,
      criticalStations,
      avgWaterLevel,
      totalPopulationAtRisk,
      avgFloodProbability,
      currentWeather: latestWeather,
      totalRainfall24h
    };
  }, [droneStations, weatherData]);

  const districtRiskAnalysis = useMemo(() => calculateDistrictRisk(droneStations), [droneStations]);
  const selectedStationData = selectedStation ? droneStations.find(s => s.id === selectedStation) : null;

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
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-xs font-bold tracking-wider text-white">전북 재난분석센터</div>
              <div className="text-xs" style={{ color: '#CBD5E1' }}>
                JEONBUK DISASTER ANALYSIS CENTER
              </div>
            </div>
          </div>
          
          {/* Analysis Mode Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">분석모드:</span>
            <div className="flex bg-black bg-opacity-30 rounded overflow-hidden">
              {([
                {key: 'overview', label: '종합현황', icon: Eye},
                {key: 'detailed', label: '상세분석', icon: Target}, 
                {key: 'prediction', label: 'AI예측', icon: Brain},
                {key: 'response', label: '대응계획', icon: Shield}
              ] as const).map(mode => (
                <button
                  key={mode.key}
                  onClick={() => setAnalysisMode(mode.key)}
                  className={`flex items-center gap-2 px-3 py-2 text-xs font-bold transition-colors ${
                    analysisMode === mode.key ? 'text-black' : 'text-white hover:bg-white hover:bg-opacity-10'
                  }`}
                  style={{ 
                    backgroundColor: analysisMode === mode.key ? theme.colors.accent.purple : 'transparent' 
                  }}
                >
                  <mode.icon className="w-3 h-3" />
                  {mode.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* Current Weather */}
          <div className="flex items-center gap-3">
            {(() => {
              const WeatherIcon = getWeatherIcon(aggregateMetrics.currentWeather?.condition || 'clear');
              return (
                <>
                  <WeatherIcon className="w-5 h-5" style={{ color: theme.colors.weather[aggregateMetrics.currentWeather?.condition || 'clear'] }} />
                  <div className="text-right">
                    <div className="text-sm font-bold text-white">
                      {aggregateMetrics.currentWeather?.temperature_c.toFixed(1)}°C
                    </div>
                    <div className="text-xs text-gray-400">
                      {aggregateMetrics.currentWeather?.precipitation_mm.toFixed(1)}mm/h
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
          
          <div className="text-right font-mono">
            <div className="text-xs font-bold text-white">
              {currentTime.toLocaleString('ko-KR', { 
                month: 'short', 
                day: '2-digit', 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </div>
            <div className="text-xs text-gray-400">업데이트: {formatTimestamp(droneStations[0]?.last_update || '', 'time')}</div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full animate-pulse" 
                 style={{ backgroundColor: theme.colors.accent.green }}></div>
            <span className="text-xs font-bold text-white">실시간 분석</span>
          </div>
        </div>
      </header>

      {/* KPI Dashboard */}
      <div className="h-24 px-6 py-4 border-b flex-shrink-0" 
           style={{ 
             borderColor: theme.colors.primary[700], 
             backgroundColor: theme.colors.primary[900] 
           }}>
        <div className="grid grid-cols-6 gap-6 h-full">
          
          {/* Station Status */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 flex items-center justify-center rounded-lg" 
                 style={{ backgroundColor: `${theme.colors.accent.teal}20` }}>
              <Database className="w-6 h-6" style={{ color: theme.colors.accent.teal }} />
            </div>
            <div>
              <div className="text-xs font-bold tracking-wide text-gray-300">모니터링 지점</div>
              <div className="text-xl font-bold text-white font-mono">
                {aggregateMetrics.activeStations}/{droneStations.length}
              </div>
              <div className="text-xs text-gray-400">
                위험 {aggregateMetrics.criticalStations}개소
              </div>
            </div>
          </div>

          {/* Water Level */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 flex items-center justify-center rounded-lg" 
                 style={{ backgroundColor: `${theme.colors.accent.blue}20` }}>
              <Waves className="w-6 h-6" style={{ color: theme.colors.accent.blue }} />
            </div>
            <div>
              <div className="text-xs font-bold tracking-wide text-gray-300">평균 수위</div>
              <div className="text-xl font-bold text-white font-mono">
                {aggregateMetrics.avgWaterLevel.toFixed(0)}cm
              </div>
              <div className="text-xs text-gray-400">
                전일대비 {Math.random() > 0.5 ? '+' : '-'}{(Math.random() * 20).toFixed(0)}cm
              </div>
            </div>
          </div>

          {/* Rainfall */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 flex items-center justify-center rounded-lg" 
                 style={{ backgroundColor: `${theme.colors.accent.purple}20` }}>
              <CloudRain className="w-6 h-6" style={{ color: theme.colors.accent.purple }} />
            </div>
            <div>
              <div className="text-xs font-bold tracking-wide text-gray-300">24시간 강수량</div>
              <div className="text-xl font-bold text-white font-mono">
                {aggregateMetrics.totalRainfall24h.toFixed(1)}mm
              </div>
              <div className="text-xs text-gray-400">
                예보: {(Math.random() * 50).toFixed(0)}mm/24h
              </div>
            </div>
          </div>

          {/* Flood Risk */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 flex items-center justify-center rounded-lg" 
                 style={{ backgroundColor: `${theme.colors.accent.orange}20` }}>
              <AlertTriangle className="w-6 h-6" style={{ color: theme.colors.accent.orange }} />
            </div>
            <div>
              <div className="text-xs font-bold tracking-wide text-gray-300">홍수 위험도</div>
              <div className="text-xl font-bold text-white font-mono">
                {(aggregateMetrics.avgFloodProbability * 100).toFixed(0)}%
              </div>
              <div className="text-xs" style={{ 
                color: aggregateMetrics.avgFloodProbability > 0.6 ? theme.colors.accent.red : 
                       aggregateMetrics.avgFloodProbability > 0.3 ? theme.colors.accent.orange : 
                       theme.colors.accent.green
              }}>
                {aggregateMetrics.avgFloodProbability > 0.6 ? '높음' : 
                 aggregateMetrics.avgFloodProbability > 0.3 ? '보통' : '낮음'}
              </div>
            </div>
          </div>

          {/* Population at Risk */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 flex items-center justify-center rounded-lg" 
                 style={{ backgroundColor: `${theme.colors.accent.red}20` }}>
              <Users className="w-6 h-6" style={{ color: theme.colors.accent.red }} />
            </div>
            <div>
              <div className="text-xs font-bold tracking-wide text-gray-300">위험인구</div>
              <div className="text-xl font-bold text-white font-mono">
                {Math.floor(aggregateMetrics.totalPopulationAtRisk / 1000)}k
              </div>
              <div className="text-xs text-gray-400">
                대피필요 시간: {Math.floor(Math.random() * 60 + 15)}분
              </div>
            </div>
          </div>

          {/* Emergency Resources */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 flex items-center justify-center rounded-lg" 
                 style={{ backgroundColor: `${theme.colors.accent.green}20` }}>
              <Shield className="w-6 h-6" style={{ color: theme.colors.accent.green }} />
            </div>
            <div>
              <div className="text-xs font-bold tracking-wide text-gray-300">비상자원</div>
              <div className="text-xl font-bold text-white font-mono">
                {Math.floor(Math.random() * 20 + 30)}
              </div>
              <div className="text-xs text-gray-400">
                가용 대피소 {Math.floor(Math.random() * 10 + 5)}개소
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex min-h-0">
        
        {/* Left Panel */}
        <div className="w-80 border-r flex flex-col flex-shrink-0" 
             style={{ 
               borderColor: theme.colors.primary[700], 
               backgroundColor: theme.colors.primary[900] 
             }}>
          
          {/* Panel Header */}
          <div className="h-12 flex items-center justify-between px-4 border-b flex-shrink-0" 
               style={{ borderColor: theme.colors.primary[700] }}>
            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4" style={{ color: theme.colors.accent.teal }} />
              <span className="font-bold tracking-wide text-white">모니터링 지점</span>
            </div>
            <div className="text-xs text-gray-400">{droneStations.length}개소</div>
          </div>

          {/* Filters */}
          <div className="p-4 border-b space-y-3 flex-shrink-0" style={{ borderColor: theme.colors.primary[700] }}>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2">지역 필터</label>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full p-2 rounded text-sm bg-black bg-opacity-30 text-white border border-gray-600 focus:border-purple-500"
              >
                <option value="all">전체 지역</option>
                {jeonbukDistricts.map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2">시간 범위</label>
              <div className="flex gap-1">
                {(['6h', '12h', '24h', '48h'] as const).map(range => (
                  <button
                    key={range}
                    onClick={() => setSelectedTimeRange(range)}
                    className={`flex-1 py-1 px-2 text-xs font-bold rounded transition-colors ${
                      selectedTimeRange === range ? 'text-black' : 'text-white hover:bg-white hover:bg-opacity-10'
                    }`}
                    style={{ 
                      backgroundColor: selectedTimeRange === range ? theme.colors.accent.purple : theme.colors.primary[800]
                    }}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Station List */}
          <div className="flex-1 overflow-y-auto">
            {droneStations
              .filter(station => selectedDistrict === 'all' || station.district === selectedDistrict)
              .sort((a, b) => b.risk_factors.flood_probability - a.risk_factors.flood_probability)
              .map(station => (
                <div
                  key={station.id}
                  onClick={() => setSelectedStation(station.id)}
                  className={`p-3 border-b cursor-pointer transition-all hover:bg-white hover:bg-opacity-5 ${
                    selectedStation === station.id ? 'border-l-4' : ''
                  }`}
                  style={{ 
                    borderColor: theme.colors.primary[700],
                    borderLeftColor: selectedStation === station.id ? theme.colors.accent.purple : 'transparent',
                    backgroundColor: selectedStation === station.id ? `${theme.colors.accent.purple}15` : 'transparent'
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-5 h-5 flex items-center justify-center rounded-full text-xs font-bold ${
                        station.status === 'offline' ? 'animate-pulse' : ''
                      }`} 
                           style={{ 
                             backgroundColor: station.status === 'critical' ? theme.colors.accent.red :
                                            station.status === 'warning' ? theme.colors.accent.orange :
                                            station.status === 'active' ? theme.colors.accent.green :
                                            '#6B7280',
                             color: 'white'
                           }}>
                        {station.status === 'critical' ? <AlertTriangle className="w-2 h-2" /> :
                         station.status === 'warning' ? <AlertCircle className="w-2 h-2" /> :
                         station.status === 'active' ? <CheckCircle2 className="w-2 h-2" /> :
                         <XCircle className="w-2 h-2" />}
                      </div>
                      <div>
                        <div className="font-bold text-white text-xs">{station.name}</div>
                        <div className="text-xs text-gray-400">{station.district}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-mono text-white">
                        {station.sensors.water_level_cm.toFixed(0)}cm
                      </div>
                      <div className="text-xs text-gray-400">
                        {(station.risk_factors.flood_probability * 100).toFixed(0)}%
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">유속</span>
                      <span className="font-mono text-white">
                        {station.sensors.flow_rate_m3s.toFixed(1)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">위험인구</span>
                      <span className="font-mono text-white">
                        {Math.floor(station.risk_factors.population_at_risk / 100) / 10}k
                      </span>
                    </div>
                  </div>

                  {/* Risk Level Bar */}
                  <div className="w-full bg-gray-700 rounded-full h-1.5">
                    <div 
                      className="h-1.5 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${station.risk_factors.flood_probability * 100}%`,
                        backgroundColor: station.risk_factors.flood_probability > 0.7 ? theme.colors.accent.red :
                                       station.risk_factors.flood_probability > 0.4 ? theme.colors.accent.orange :
                                       theme.colors.accent.green
                      }}
                    ></div>
                  </div>
                </div>
              ))
            }
          </div>
        </div>

        {/* Center - Analysis Dashboard */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* Overview Mode */}
          {analysisMode === 'overview' && (
            <div className="flex-1 p-4 overflow-hidden">
              <div className="grid grid-cols-12 gap-4 h-full">
                
                {/* Weather Chart */}
                <div className="col-span-8 bg-gray-900 bg-opacity-30 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${theme.colors.accent.blue}20` }}>
                        <Cloud className="w-4 h-4" style={{ color: theme.colors.accent.blue }} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">환경 모니터링</h3>
                        <p className="text-xs text-gray-400">실시간 기상·수문 분석</p>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">최근 48시간</div>
                  </div>

                  <ResponsiveContainer width="100%" height={240}>
                    <AreaChart data={weatherData} margin={{ top: 10, right: 20, left: 10, bottom: 30 }}>
                      <defs>
                        <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={theme.colors.accent.orange} stopOpacity={0.3}/>
                          <stop offset="95%" stopColor={theme.colors.accent.orange} stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="rainGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={theme.colors.accent.blue} stopOpacity={0.3}/>
                          <stop offset="95%" stopColor={theme.colors.accent.blue} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="2 4" stroke="#374151" strokeOpacity={0.5} />
                      <XAxis 
                        dataKey="timestamp" 
                        tickFormatter={(value) => formatTimestamp(value, 'time')}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#9CA3AF', fontSize: 10 }}
                      />
                      <YAxis 
                        yAxisId="temp"
                        orientation="left"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#9CA3AF', fontSize: 10 }}
                      />
                      <YAxis 
                        yAxisId="rain"
                        orientation="right"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#9CA3AF', fontSize: 10 }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: theme.colors.primary[800], 
                          border: `1px solid ${theme.colors.primary[600]}`,
                          color: 'white',
                          fontSize: '11px',
                          borderRadius: '6px'
                        }}
                      />
                      <Area 
                        yAxisId="temp"
                        type="monotone" 
                        dataKey="temperature_c" 
                        stroke={theme.colors.accent.orange}
                        strokeWidth={2} 
                        fill="url(#tempGrad)"
                        dot={false}
                      />
                      <Area 
                        yAxisId="rain"
                        type="monotone" 
                        dataKey="precipitation_mm" 
                        stroke={theme.colors.accent.blue}
                        strokeWidth={2} 
                        fill="url(#rainGrad)"
                        dot={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Risk Analysis */}
                <div className="col-span-4 bg-gray-900 bg-opacity-30 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${theme.colors.accent.red}20` }}>
                      <TrendingUp className="w-4 h-4" style={{ color: theme.colors.accent.red }} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">위험도 분석</h3>
                      <p className="text-xs text-gray-400">지역별 실시간 평가</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {districtRiskAnalysis.slice(0, 10).map((district, idx) => (
                      <div key={district.district} className="flex items-center justify-between p-2 rounded border transition-all duration-200" 
                           style={{ 
                             borderColor: district.risk > 0.7 ? theme.colors.accent.red + '40' : 
                                        district.risk > 0.4 ? theme.colors.accent.orange + '40' : 
                                        theme.colors.accent.green + '40',
                             backgroundColor: district.risk > 0.7 ? theme.colors.accent.red + '08' : 
                                            district.risk > 0.4 ? theme.colors.accent.orange + '08' : 
                                            theme.colors.accent.green + '08'
                           }}>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                               style={{ backgroundColor: getRiskColor(district.risk > 0.7 ? 'very_high' : district.risk > 0.4 ? 'moderate' : 'low') }}>
                            {idx + 1}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white">{district.district}</div>
                            <div className="text-xs text-gray-400">{district.stations}개소</div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-sm font-bold font-mono" style={{ 
                            color: district.risk > 0.7 ? theme.colors.accent.red : 
                                   district.risk > 0.4 ? theme.colors.accent.orange : 
                                   theme.colors.accent.green
                          }}>
                            {(district.risk * 100).toFixed(0)}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Water Level Chart */}
                <div className="col-span-12 bg-gray-900 bg-opacity-30 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${theme.colors.accent.teal}20` }}>
                        <Waves className="w-4 h-4" style={{ color: theme.colors.accent.teal }} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">수위 분석</h3>
                        <p className="text-xs text-gray-400">주요 모니터링 지점</p>
                      </div>
                    </div>
                  </div>
                  
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={droneStations.slice(0, 18)} margin={{ top: 10, right: 20, left: 30, bottom: 50 }}>
                      <CartesianGrid strokeDasharray="2 4" stroke="#374151" strokeOpacity={0.3} />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#9CA3AF', fontSize: 9 }}
                        angle={-45}
                        textAnchor="end"
                        height={50}
                      />
                      <YAxis 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#9CA3AF', fontSize: 10 }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: theme.colors.primary[900], 
                          border: `2px solid ${theme.colors.primary[600]}`,
                          color: 'white',
                          fontSize: '11px',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar 
                        dataKey="sensors.water_level_cm" 
                        fill={theme.colors.accent.teal}
                        radius={[3, 3, 0, 0]}
                      >
                        {droneStations.slice(0, 18).map((station, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={station.sensors.water_level_cm > station.historical_max_level * 0.9 ? 
                                  theme.colors.accent.red : 
                                  station.sensors.water_level_cm > station.historical_max_level * 0.7 ? 
                                  theme.colors.accent.orange : 
                                  theme.colors.accent.teal} 
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                  
                  {/* Status Cards */}
                  <div className="mt-3 pt-3 border-t border-gray-600">
                    <div className="grid grid-cols-6 gap-3">
                      <div className="text-center p-2 rounded border border-green-500 border-opacity-30" style={{ backgroundColor: `${theme.colors.accent.green}10` }}>
                        <div className="text-lg font-bold mb-1" style={{ color: theme.colors.accent.green }}>
                          {droneStations.filter(s => s.status === 'active').length}
                        </div>
                        <div className="text-xs text-gray-300">정상</div>
                      </div>
                      
                      <div className="text-center p-2 rounded border border-yellow-500 border-opacity-30" style={{ backgroundColor: `${theme.colors.accent.amber}10` }}>
                        <div className="text-lg font-bold mb-1" style={{ color: theme.colors.accent.amber }}>
                          {droneStations.filter(s => s.status === 'warning').length}
                        </div>
                        <div className="text-xs text-gray-300">주의</div>
                      </div>
                      
                      <div className="text-center p-2 rounded border border-red-500 border-opacity-30" style={{ backgroundColor: `${theme.colors.accent.red}10` }}>
                        <div className="text-lg font-bold mb-1" style={{ color: theme.colors.accent.red }}>
                          {droneStations.filter(s => s.status === 'critical').length}
                        </div>
                        <div className="text-xs text-gray-300">위험</div>
                      </div>
                      
                      <div className="text-center p-2 rounded border border-gray-500 border-opacity-30">
                        <div className="text-lg font-bold mb-1 text-gray-400">
                          {droneStations.filter(s => s.status === 'offline').length}
                        </div>
                        <div className="text-xs text-gray-300">오프라인</div>
                      </div>

                      <div className="text-center p-2 rounded border border-blue-500 border-opacity-30" style={{ backgroundColor: `${theme.colors.accent.blue}10` }}>
                        <div className="text-lg font-bold mb-1" style={{ color: theme.colors.accent.blue }}>
                          {Math.round(aggregateMetrics.avgWaterLevel)}
                        </div>
                        <div className="text-xs text-gray-300">평균 수위</div>
                      </div>

                      <div className="text-center p-2 rounded border border-purple-500 border-opacity-30" style={{ backgroundColor: `${theme.colors.accent.purple}10` }}>
                        <div className="text-lg font-bold mb-1" style={{ color: theme.colors.accent.purple }}>
                          {Math.floor(aggregateMetrics.totalPopulationAtRisk / 1000)}k
                        </div>
                        <div className="text-xs text-gray-300">위험 인구</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Detailed Mode */}
          {analysisMode === 'detailed' && selectedStationData && (
            <div className="flex-1 p-4 overflow-hidden">
              <div className="grid grid-cols-3 gap-4 h-full">
                
                <div className="bg-gray-900 bg-opacity-30 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center gap-2 mb-4">
                    <Target className="w-5 h-5" style={{ color: theme.colors.accent.purple }} />
                    <h3 className="text-lg font-bold text-white">상세 정보</h3>
                  </div>
                  
                  <div className="p-3 rounded border border-gray-600" style={{ backgroundColor: theme.colors.primary[800] }}>
                    <div className="text-sm font-bold text-white mb-2">{selectedStationData.name}</div>
                    <div className="text-xs text-gray-400 mb-3">{selectedStationData.district}</div>
                    
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <div className="text-gray-400">위도</div>
                        <div className="font-mono text-white">{selectedStationData.location.lat.toFixed(4)}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">경도</div>
                        <div className="font-mono text-white">{selectedStationData.location.lon.toFixed(4)}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-900 bg-opacity-30 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center gap-2 mb-4">
                    <Activity className="w-5 h-5" style={{ color: theme.colors.accent.blue }} />
                    <h3 className="text-lg font-bold text-white">센서 데이터</h3>
                  </div>
                  
                  <div className="text-center p-3 rounded border border-gray-600" style={{ backgroundColor: theme.colors.primary[800] }}>
                    <div className="text-2xl font-bold text-white mb-1">
                      {selectedStationData.sensors.water_level_cm.toFixed(0)}
                    </div>
                    <div className="text-xs text-gray-400">수위 (cm)</div>
                  </div>
                </div>

                <div className="bg-gray-900 bg-opacity-30 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center gap-2 mb-4">
                    <Shield className="w-5 h-5" style={{ color: theme.colors.accent.orange }} />
                    <h3 className="text-lg font-bold text-white">위험도 평가</h3>
                  </div>
                  
                  <div className="text-center p-4 rounded border border-gray-600" style={{ backgroundColor: theme.colors.primary[800] }}>
                    <div className="text-4xl font-bold mb-2" style={{ 
                      color: selectedStationData.risk_factors.flood_probability > 0.7 ? theme.colors.accent.red :
                             selectedStationData.risk_factors.flood_probability > 0.4 ? theme.colors.accent.orange :
                             theme.colors.accent.green
                    }}>
                      {(selectedStationData.risk_factors.flood_probability * 100).toFixed(0)}%
                    </div>
                    <div className="text-sm text-gray-400">홍수 발생 확률</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Other modes placeholder */}
          {(analysisMode === 'prediction' || analysisMode === 'response' || (analysisMode === 'detailed' && !selectedStationData)) && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                {analysisMode === 'prediction' ? <Brain className="w-16 h-16 mx-auto mb-4 text-gray-600" /> :
                 analysisMode === 'response' ? <Shield className="w-16 h-16 mx-auto mb-4 text-gray-600" /> :
                 <Target className="w-16 h-16 mx-auto mb-4 text-gray-600" />}
                <h3 className="text-lg font-bold text-white mb-2">
                  {analysisMode === 'prediction' ? 'AI 예측 모드' :
                   analysisMode === 'response' ? '대응 계획 모드' :
                   '상세 분석 모드'}
                </h3>
                <p className="text-gray-400">
                  {analysisMode === 'detailed' ? 
                   '왼쪽 목록에서 모니터링 지점을 선택하여 상세 정보를 확인하세요.' :
                   '시스템이 준비 중입니다.'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DisasterAnalysisSystem;