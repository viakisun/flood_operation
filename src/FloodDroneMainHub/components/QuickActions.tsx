import React from 'react';
import { quickActions } from '../data/mockData';
import { ShieldAlert } from 'lucide-react';

const QuickActions: React.FC = () => {
  // In a real app, this would come from user authentication context
  const isAdmin = true;

  return (
    <div className="bg-primary-800 rounded-xl p-6 border border-primary-700">
      <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-4">
        {quickActions.map(action => {
          const isDisabled = action.requiresAdmin && !isAdmin;
          return (
            <button
              key={action.id}
              disabled={isDisabled}
              className={`
                p-4 rounded-lg flex flex-col items-center justify-center text-center
                transition-all duration-200
                ${isDisabled
                  ? 'bg-primary-700/50 cursor-not-allowed text-gray-500'
                  : 'bg-primary-700 hover:bg-primary-600 text-gray-200 hover:text-white'
                }
              `}
            >
              <action.icon
                className={`w-8 h-8 mb-2
                ${action.id === 'emergency-stop' && !isDisabled ? 'text-accent-red' : ''}
                ${isDisabled ? 'text-gray-600' : ''}`}
              />
              <span className="text-sm font-semibold">{action.label}</span>
              {action.requiresAdmin && (
                 <div className="flex items-center text-xs mt-1 text-amber-400/60">
                    <ShieldAlert size={12} className="mr-1"/>
                    Admin
                 </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;
