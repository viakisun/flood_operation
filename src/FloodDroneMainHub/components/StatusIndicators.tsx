import React from 'react';
import { SystemStatus } from '../data/mockData';

interface SystemStatusIndicatorProps {
  status: SystemStatus;
}

export const SystemStatusIndicator: React.FC<SystemStatusIndicatorProps> = ({ status }) => {
  const statusConfig = {
    NORMAL: { text: 'All Systems Normal', color: 'bg-accent-green' },
    ALERT: { text: 'System Alert', color: 'bg-accent-amber' },
    EMERGENCY: { text: 'Emergency State', color: 'bg-accent-red' },
  };

  const { text, color } = statusConfig[status];

  return (
    <div className="flex items-center gap-3">
      <div className={`w-3 h-3 rounded-full ${color} animate-pulse`}></div>
      <span className="font-bold text-white uppercase tracking-wider">{text}</span>
    </div>
  );
};

interface RiskLevelDonutProps {
  level: 1 | 2 | 3 | 4 | 5;
  size?: number;
}

export const RiskLevelDonut: React.FC<RiskLevelDonutProps> = ({ level, size = 40 }) => {
  const riskConfig = {
    1: { color: 'text-accent-green', label: 'Low' },
    2: { color: 'text-accent-blue', label: 'Guarded' },
    3: { color: 'text-accent-amber', label: 'Elevated' },
    4: { color: 'text-accent-orange', label: 'High' },
    5: { color: 'text-accent-red', label: 'Severe' },
  };
  const { color, label } = riskConfig[level];
  const circumference = 2 * Math.PI * 15.9155; // 2 * pi * r (where r = 15.9155 for a 100-unit circumference)
  const strokeDashoffset = circumference - (level / 5) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="absolute" width={size} height={size} viewBox="0 0 36 36">
        <circle
          className="text-primary-700"
          strokeWidth="4"
          stroke="currentColor"
          fill="transparent"
          r="15.9155"
          cx="18"
          cy="18"
        />
        <circle
          className={color}
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r="15.9155"
          cx="18"
          cy="18"
          transform="rotate(-90 18 18)"
        />
      </svg>
      <span className={`font-bold text-sm ${color}`}>{level}</span>
    </div>
  );
};
