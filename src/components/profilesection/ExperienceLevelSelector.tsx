import { Zap, TrendingUp, Award } from "lucide-react";

interface ExperienceLevelSelectorProps {
  selectedLevel: string;
  onSelect: (level: string) => void;
}

const levelConfig = [
  {
    key: 'Beginner',
    icon: Zap,
    description: 'Just getting started',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-500',
    selectedBg: 'bg-emerald-50',
  },
  {
    key: 'Intermediate',
    icon: TrendingUp,
    description: 'Some solid experience',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-500',
    selectedBg: 'bg-blue-50',
  },
  {
    key: 'Advanced',
    icon: Award,
    description: 'Deep expertise',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-500',
    selectedBg: 'bg-purple-50',
  },
];

function ExperienceLevelSelector({ selectedLevel, onSelect }: ExperienceLevelSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-3">
        Experience Level <span className="text-purple-600">*</span>
      </label>
      <div className="grid grid-cols-3 gap-3">
        {levelConfig.map(({ key, icon: Icon, description, color, bg, border, selectedBg }) => {
          const isSelected = selectedLevel === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onSelect(key)}
              className={`p-4 rounded-2xl border-2 text-center transition-all ${
                isSelected
                  ? `${border} ${selectedBg} shadow-sm`
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className={`w-10 h-10 ${isSelected ? bg : 'bg-gray-100'} rounded-xl flex items-center justify-center mx-auto mb-2.5 transition-colors`}>
                <Icon className={`w-5 h-5 ${isSelected ? color : 'text-gray-400'}`} />
              </div>
              <p className={`text-sm font-bold ${isSelected ? color : 'text-gray-700'}`}>{key}</p>
              <p className={`text-xs mt-0.5 ${isSelected ? color : 'text-gray-400'} opacity-80`}>{description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default ExperienceLevelSelector;