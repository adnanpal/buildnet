import MultiSelectTags from "./MultiSelectTags";
import SectionHeader from "./SectionHeader";
import { Code } from "lucide-react";
import { programmingLanguages, frameworks } from "./profileHeader";
import ExperienceLevelSelector from "./ExperienceLevelSelector";

interface TechnicalSkillsSectionProps {
  formData: {
    programmingLanguages: string[];
    frameworks: string[];
    experienceLevel: string;
  };
  onInputChange: (field: string, value: any) => void;
  onMultiSelect: (field: "programmingLanguages" | "frameworks", value: string) => void;
}

function TechnicalSkillsSection({ formData, onInputChange, onMultiSelect }: TechnicalSkillsSectionProps) {
  return (
    <div className="mb-2 border-t border-gray-100 pt-8">
      <SectionHeader
        icon={<Code className="w-5 h-5 text-green-600" />}
        title="Technical Skills"
        subtitle="Languages, frameworks, and your experience level"
        bgColor="bg-green-100"
      />

      <div className="space-y-6">
        <MultiSelectTags
          label="Primary Programming Languages"
          items={programmingLanguages}
          selectedItems={formData.programmingLanguages}
          onToggle={(value) => onMultiSelect('programmingLanguages', value)}
          colorClass="bg-purple-600"
        />

        <MultiSelectTags
          label="Frameworks & Libraries"
          items={frameworks}
          selectedItems={formData.frameworks}
          onToggle={(value) => onMultiSelect('frameworks', value)}
          colorClass="bg-blue-600"
        />

        <ExperienceLevelSelector
          selectedLevel={formData.experienceLevel}
          onSelect={(level) => onInputChange('experienceLevel', level)}
        />
      </div>
    </div>
  );
}

export default TechnicalSkillsSection;