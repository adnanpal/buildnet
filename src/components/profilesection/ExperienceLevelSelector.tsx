import { Star } from "lucide-react";

interface ExperienceLevelSelectorProps {
  selectedLevel: string;
  onSelect: (level: string) => void;
}
function ExperienceLevelSelector({ selectedLevel, onSelect }:ExperienceLevelSelectorProps) {
  const levels = ['Beginner', 'Intermediate', 'Advanced'];

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-3">Experience Level *</label>
      <div className="grid grid-cols-3 gap-4">
        {levels.map(level => (
          <button
            key={level}
            type="button"
            onClick={() => onSelect(level)}
            className={`p-4 rounded-xl border-2 font-medium transition ${
              selectedLevel === level
                ? 'border-purple-600 bg-purple-50 text-purple-600'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Star className={`w-6 h-6 mx-auto mb-2 ${
              selectedLevel === level ? 'text-purple-600' : 'text-gray-400'
            }`} />
            {level}
          </button>
        ))}
      </div>
    </div>
  );
}
export default ExperienceLevelSelector;