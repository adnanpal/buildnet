import SectionHeader from "./SectionHeader";
import { GraduationCap,ChevronDown } from "lucide-react";
import { specializations, degrees, yearsOfStudy } from "./profileHeader";
import type { BasicInfoSectionProps } from "./BasicInfoSection";

function ProfessionalDetailsSection({ formData, onInputChange }:BasicInfoSectionProps) {
  return (
    <div className="mb-10 border-t pt-10">
      <SectionHeader 
        icon={<GraduationCap className="w-6 h-6 text-blue-600" />}
        title="Professional Details"
        bgColor="bg-blue-100"
      />

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Specialization *</label>
          <div className="relative">
            <select
              value={formData.specialization ?? ""}
              onChange={(e) => onInputChange('specialization', e.target.value === "" ? null : Number(e.target.value))}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-600 focus:outline-none appearance-none transition bg-white"
            >
              <option value="">Select your specialization</option>
              {specializations.map(spec => (
                <option key={spec.id} value={spec.id}>{spec.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Current Degree *</label>
          <div className="relative">
            <select
              value={formData.currentDegree}
              onChange={(e) => onInputChange('currentDegree', e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-600 focus:outline-none appearance-none transition bg-white"
            >
              <option value="">Select your degree</option>
              {degrees.map(degree => (
                <option key={degree.key} value={degree.label}>{degree.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">College / University Name *</label>
          <input
            type="text"
            value={formData.collegeName}
            onChange={(e) => onInputChange('collegeName', e.target.value)}
            placeholder="Enter your college or university name"
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-600 focus:outline-none transition"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Year of Study *</label>
          <div className="grid grid-cols-3 gap-3">
            {yearsOfStudy.map(year => (
              <button
                key={year.key}
                type="button"
                onClick={() => onInputChange('yearOfStudy', year.key)}
                className={`px-4 py-3 rounded-lg border-2 font-medium transition ${
                  formData.yearOfStudy === year.key
                    ? 'border-purple-600 bg-purple-50 text-purple-600'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {year.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
export default ProfessionalDetailsSection;