import { Check } from "lucide-react";

interface MultiSelectTagsProps {
  label: string;
  items: string[];
  selectedItems: string[];
  onToggle: (item: string) => void;
  colorClass: string;
}

function MultiSelectTags({ label, items, selectedItems, onToggle, colorClass }:MultiSelectTagsProps) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-3">
        {label} * 
        <span className="text-gray-500 font-normal ml-2">(Select all that apply)</span>
      </label>
      <div className="flex flex-wrap gap-2">
        {items.map(item => (
          <button
            key={item}
            type="button"
            onClick={() => onToggle(item)}
            className={`tag-item px-4 py-2 rounded-full text-sm font-medium transition ${
              selectedItems.includes(item)
                ? `${colorClass} text-white shadow-md`
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {selectedItems.includes(item) && (
              <Check className="w-4 h-4 inline mr-1" />
            )}
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}
export default MultiSelectTags;
