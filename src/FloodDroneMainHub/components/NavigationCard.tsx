import React from 'react';
import { Link } from 'react-router-dom';
import { NavigationCardData, theme, UserRole } from '../data/mockData';
import { Users, Clock } from 'lucide-react';

interface NavigationCardProps {
  card: NavigationCardData;
}

const UserRolePill: React.FC<{ role: UserRole }> = ({ role }) => {
  const roleStyles: { [key in UserRole]: string } = {
    Operator: 'bg-blue-500/20 text-blue-300',
    Commander: 'bg-red-500/20 text-red-300',
    Analyst: 'bg-purple-500/20 text-purple-300',
    Planner: 'bg-amber-500/20 text-amber-300',
    Admin: 'bg-green-500/20 text-green-300',
  };
  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${roleStyles[role]}`}>
      {role}
    </span>
  );
};

const NavigationCard: React.FC<NavigationCardProps> = ({ card }) => {
  const accentColor = theme.colors.accent[card.color];

  return (
    <Link to={card.path} className="block group">
      <div
        className="bg-primary-800 rounded-xl p-6 flex flex-col justify-between h-full
                   border border-primary-700 group-hover:border-accent-cyan/50 transition-all duration-300
                   shadow-lg group-hover:shadow-2xl group-hover:shadow-accent-cyan/10"
      >
        <div>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${accentColor}20` }}
              >
                <card.icon className="w-6 h-6" style={{ color: accentColor }} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">{card.title}</h2>
                <p className="text-sm text-gray-400">{card.description}</p>
              </div>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            {card.liveData.map((data, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-gray-300">
                  <data.icon className="w-4 h-4" />
                  <span>{data.label}</span>
                </div>
                <span className="font-mono font-bold text-white">{data.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-primary-700 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-400" />
              <div className="flex items-center gap-1.5">
                {card.userRoles.map((role) => (
                  <UserRolePill key={role} role={role} />
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Clock className="w-4 h-4" />
              <span>{card.lastUpdate}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default NavigationCard;
