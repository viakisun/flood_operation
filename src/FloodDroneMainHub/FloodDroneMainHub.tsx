import React from 'react';
import Header from './components/Header';
import NavigationCard from './components/NavigationCard';
import SystemOverview from './components/SystemOverview';
import QuickActions from './components/QuickActions';
import { navigationCards } from './data/mockData';

const FloodDroneMainHub: React.FC = () => {
  return (
    <div className="bg-primary-950 min-h-screen text-gray-300 font-sans">
      <Header />
      <main className="p-8 space-y-8">
        {/* Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {navigationCards.map(card => (
            <NavigationCard key={card.id} card={card} />
          ))}
        </div>

        {/* Dashboard Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <SystemOverview />
          </div>
          <div className="lg:col-span-1">
            <QuickActions />
          </div>
        </div>
      </main>
    </div>
  );
};

export default FloodDroneMainHub;
