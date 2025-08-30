import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import FloodDroneMainHub from './FloodDroneMainHub/FloodDroneMainHub';

// Import the sample pages
import FloodDroneMonitoringSystem from './sample_pages/flood_drone_monitoring';
import VideoIntelligenceSystem from './sample_pages/video_intelligence_system';
import MissionPlanningSystem from './sample_pages/mission_planning_system';
import DisasterAnalysisPredictionSystem from './sample_pages/disaster-analysis-prediction-system';
import MissionHistorySystem from './sample_pages/mission-history-system';

// A simple wrapper to provide a "back to home" link on sample pages
const PageWrapper: React.FC<{ children: React.ReactNode, title: string }> = ({ children, title }) => (
  <div>
    <nav className="p-4 bg-primary-900 text-white flex items-center justify-between">
      <h1 className="text-lg font-bold">{title}</h1>
      <Link to="/" className="px-4 py-2 bg-accent-cyan text-primary-950 font-bold rounded-lg hover:bg-accent-cyan/80">
        &larr; Back to Hub
      </Link>
    </nav>
    {children}
  </div>
);


const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FloodDroneMainHub />} />
        <Route path="/monitoring" element={<PageWrapper title="Flood Drone Control Platform"><FloodDroneMonitoringSystem /></PageWrapper>} />
        <Route path="/video" element={<PageWrapper title="Drone Video Intelligence System"><VideoIntelligenceSystem /></PageWrapper>} />
        <Route path="/planning" element={<PageWrapper title="Drone Mission Planning System"><MissionPlanningSystem /></PageWrapper>} />
        <Route path="/analysis" element={<PageWrapper title="Disaster Analysis & Prediction System"><DisasterAnalysisPredictionSystem /></PageWrapper>} />
        <Route path="/history" element={<PageWrapper title="Mission History & Archive System"><MissionHistorySystem /></PageWrapper>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
