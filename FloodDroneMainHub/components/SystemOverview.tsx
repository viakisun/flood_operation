import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import {
  activityChartData,
  systemHealth,
  highRiskAreas,
  activityLog,
  theme,
} from '../data/mockData';
import { RiskLevelDonut } from './StatusIndicators';
import { AlertTriangle, Bell, Cpu, MemoryStick, Network } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-primary-900/80 backdrop-blur-sm border border-primary-700 p-3 rounded-lg shadow-lg">
        <p className="label text-sm text-gray-300">{`Time : ${label}`}</p>
        <p className="intro text-accent-orange">{`Alerts : ${payload[0].value}`}</p>
        <p className="intro text-accent-cyan">{`Missions : ${payload[1].value}`}</p>
      </div>
    );
  }
  return null;
};

const SystemOverview: React.FC = () => {
  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Left Column: Activity Chart */}
      <div className="col-span-2 bg-primary-800 rounded-xl p-6 border border-primary-700">
        <h3 className="text-lg font-bold text-white mb-4">Recent 24h Activity</h3>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <AreaChart data={activityChartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <defs>
                <linearGradient id="colorAlerts" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={theme.colors.accent.orange} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={theme.colors.accent.orange} stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorMissions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={theme.colors.accent.cyan} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={theme.colors.accent.cyan} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.accent.cyan + '20'} />
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="alerts" stroke={theme.colors.accent.orange} fillOpacity={1} fill="url(#colorAlerts)" strokeWidth={2} />
              <Area type="monotone" dataKey="missions" stroke={theme.colors.accent.cyan} fillOpacity={1} fill="url(#colorMissions)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Right Column: Alerts & System Health */}
      <div className="col-span-1 space-y-6">
        {/* High-Risk Areas */}
        <div className="bg-primary-800 rounded-xl p-6 border border-primary-700">
          <h3 className="text-lg font-bold text-white mb-4">High-Risk Areas</h3>
          <div className="space-y-4">
            {highRiskAreas.map(area => (
              <div key={area.id} className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-white">{area.name}</p>
                  <p className="text-sm text-gray-400">
                    Water Level: {area.waterLevel}m ({area.trend})
                  </p>
                </div>
                <RiskLevelDonut level={area.riskLevel} />
              </div>
            ))}
          </div>
        </div>

        {/* System Health */}
        <div className="bg-primary-800 rounded-xl p-6 border border-primary-700">
          <h3 className="text-lg font-bold text-white mb-4">System Health</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-gray-300"><Cpu size={16} /> CPU Usage</div>
              <span className="font-mono text-white">{systemHealth.cpuUsage}%</span>
            </div>
             <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-gray-300"><MemoryStick size={16} /> Memory</div>
              <span className="font-mono text-white">{systemHealth.memoryUsage}%</span>
            </div>
             <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-gray-300"><Network size={16} /> Latency</div>
              <span className="font-mono text-white">{systemHealth.networkLatency}ms</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemOverview;
