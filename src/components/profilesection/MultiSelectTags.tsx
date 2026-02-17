import { Check } from "lucide-react";

interface MultiSelectTagsProps {
  label: string;
  items: string[];
  selectedItems: string[];
  onToggle: (item: string) => void;
  colorClass: string;
}

function MultiSelectTags({ label, items, selectedItems, onToggle, colorClass }: MultiSelectTagsProps) {
  return (
    <div>
      <div className="flex items-baseline gap-2 mb-3">
        <label className="text-sm font-semibold text-gray-700">{label} <span className="text-purple-600">*</span></label>
        <span className="text-xs text-gray-400">Select all that apply</span>
      </div>

      {/* Selected count badge */}
      {selectedItems.length > 0 && (
        <div className="mb-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-50 text-purple-700 text-xs font-semibold rounded-lg border border-purple-100">
            <Check className="w-3 h-3" />
            {selectedItems.length} selected
          </span>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {items.map(item => {
          const isSelected = selectedItems.includes(item);
          return (
            <button
              key={item}
              type="button"
              onClick={() => onToggle(item)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border-2 transition-all ${
                isSelected
                  ? `${colorClass} text-white border-transparent shadow-sm scale-105`
                  : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              {isSelected && <Check className="w-3 h-3 shrink-0" />}
              {item}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default MultiSelectTags;