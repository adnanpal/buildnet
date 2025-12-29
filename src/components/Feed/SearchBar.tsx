import { Filter, Search } from "lucide-react";
import { useState } from "react";

interface onFilterChangeProps {
  onFilterChange: (value: string) => void;
  onSearch: (value: string) => void;
}
export function SearchBar({onSearch}: onFilterChangeProps) {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);


  return (
    <div className="lg:col-span-2">
      {/* Search Bar */}
      <div className="glass-effect rounded-2xl p-4 mb-6 animate-fade-in">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              onChange={(e) => onSearch(e.target.value)} 
              type="text"              
              placeholder="Search projects, ideas, or collaborators..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-transparent focus:border-purple-400 focus:outline-none transition bg-white/50"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-3 bg-white/50 border-2 border-transparent hover:border-purple-400 rounded-xl transition"
          >
            <Filter className="w-5 h-5" />
            <span className="hidden sm:inline">Filters</span>
          </button>
        </div>

        {/* Filter Tags */}
        {showFilters && (
          <div className="mt-4 flex flex-wrap gap-2 animate-scale-in">
            {['all', 'seeking', 'in-progress', 'launched'].map(filter => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${selectedFilter === filter
                    ? 'bg-linear-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                    : 'bg-white/50 text-gray-700 hover:bg-white'
                  }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
      );
}