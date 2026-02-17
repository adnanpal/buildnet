import SectionHeader from "./SectionHeader";
import { GraduationCap, ChevronDown } from "lucide-react";
import { specializations, degrees, yearsOfStudy } from "./profileHeader";
import type { BasicInfoSectionProps } from "./BasicInfoSection";

function ProfessionalDetailsSection({ formData, onInputChange }: BasicInfoSectionProps) {
  return (
    <div className="mb-2 border-t border-gray-100 pt-8">
      <SectionHeader
        icon={<GraduationCap className="w-5 h-5 text-blue-600" />}
        title="Professional Details"
        subtitle="Your academic and professional background"
        bgColor="bg-blue-100"
      />

      <div className="space-y-5">
        {/* Specialization */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Specialization <span className="text-purple-600">*</span>
          </label>
          <div className="relative">
            <select
              value={formData.specialization ?? ""}
              onChange={(e) =>
                onInputChange('specialization', e.target.value === "" ? null : Number(e.target.value))
              }
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none appearance-none transition bg-white text-sm text-gray-900"
            >
              <option value="">Select your specialization</option>
              {specializations.map(spec => (
                <option key={spec.id} value={spec.id}>{spec.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Degree + College side by side on sm+ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Current Degree <span className="text-purple-600">*</span>
            </label>
            <div className="relative">
              <select
                value={formData.currentDegree}
                onChange={(e) => onInputChange('currentDegree', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none appearance-none transition bg-white text-sm text-gray-900"
              >
                <option value="">Select degree</option>
                {degrees.map(degree => (
                  <option key={degree.key} value={degree.label}>{degree.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              College / University <span className="text-purple-600">*</span>
            </label>
            <input
              type="text"
              value={formData.collegeName}
              onChange={(e) => onInputChange('collegeName', e.target.value)}
              placeholder="e.g. IIT Bombay"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition text-sm text-gray-900 placeholder:text-gray-400 bg-white"
            />
          </div>
        </div>

        {/* Year of Study */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Year of Study <span className="text-purple-600">*</span>
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {yearsOfStudy.map(year => (
              <button
                key={year.key}
                type="button"
                onClick={() => onInputChange('yearOfStudy', year.key)}
                className={`px-2 py-2.5 rounded-xl border-2 text-xs font-semibold transition text-center ${
                  formData.yearOfStudy === year.key
                    ? 'border-purple-500 bg-purple-50 text-purple-700 shadow-sm'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
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