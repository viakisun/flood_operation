import React from 'react';
import { Plane, Target, AlertTriangle, Clock } from 'lucide-react';
import { systemStatus, activeDronesCount, ongoingMissionsCount } from '../data/mockData';
import { SystemStatusIndicator } from './StatusIndicators';

const Header: React.FC = () => {
  const [time, setTime] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const highRiskAreasCount = 2; // Mock data, can be derived from highRiskAreas in mockData

  return (
    <header className="bg-primary-900 h-20 px-8 flex items-center justify-between border-b border-primary-700">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4">
          <img src="/logo.svg" alt="System Logo" className="h-10 w-10" /> {/* Placeholder for a logo */}
          <h1 className="text-xl font-bold text-white tracking-tight">
            홍수 대응 드론 통합 관제 시스템
          </h1>
        </div>
        <div className="border-l border-primary-700 h-10"></div>
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 text-sm">
            <Plane className="w-5 h-5 text-accent-cyan" />
            <div>
              <span className="text-gray-400">활성 드론</span>
              <p className="font-bold text-white">{activeDronesCount}기</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Target className="w-5 h-5 text-accent-blue" />
            <div>
              <span className="text-gray-400">진행 임무</span>
              <p className="font-bold text-white">{ongoingMissionsCount}건</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <AlertTriangle className="w-5 h-5 text-accent-orange" />
            <div>
              <span className="text-gray-400">고위험 지역</span>
              <p className="font-bold text-white">{highRiskAreasCount}곳</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="text-right">
          <p className="font-mono text-lg text-white">
            {time.toLocaleTimeString('ko-KR', { hour12: false })}
          </p>
          <p className="text-xs text-gray-400">
            {time.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="border-l border-primary-700 h-10"></div>
        <SystemStatusIndicator status={systemStatus} />
      </div>
    </header>
  );
};

export default Header;
