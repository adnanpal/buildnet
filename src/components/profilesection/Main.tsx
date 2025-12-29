import ProfileHeader from "./profileHeader";
import BasicInfoSection from "./BasicInfoSection";
import ProfessionalDetailsSection from "./ProfessionalDetailSection";
import ProfileActions from "./ProfileActions";
import TechnicalSkillsSection from "./TechnicalSkillsSection";
import { useProfile } from "../../hooks/useProfile";

export default function ProfileCompletion() {
  // Fix: Handle NaN case
  const appUserIdStr = localStorage.getItem("appUserId");
  const appUserId = appUserIdStr ? Number(appUserIdStr) : null;

  const {
    formData,
    completionPercentage,
    isEditMode,
    loading,
    isHydrated,
    previewImage,
    updateFormData,
    handleMultiSelect,
    handleImageUpload,
    handleSubmit,
  } = useProfile(appUserId);

  const handleSaveDraft = () => {
    console.log('Draft saved:', formData);
    alert('Draft saved successfully!');
  };

  if (loading || !isHydrated) {
    return (
      <div className="min-h-screen bg-linear-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes progressFill {
          from { width: 0%; }
        }
        
        .animate-slide-in {
          animation: slideIn 0.5s ease-out;
        }
        
        .progress-bar {
          animation: progressFill 1s ease-out;
        }
        
        .tag-item {
          transition: all 0.2s ease;
        }
        
        .tag-item:hover {
          transform: translateY(-2px);
        }
      `}</style>

      <div className="max-w-4xl mx-auto">
        <ProfileHeader completionPercentage={completionPercentage} />

        <div className="bg-white rounded-2xl shadow-xl p-8 animate-slide-in" style={{ animationDelay: '0.1s' }}>
          <BasicInfoSection
            formData={formData}
            previewImage={previewImage}
            onImageUpload={handleImageUpload}
            onInputChange={updateFormData}
          />

          <ProfessionalDetailsSection
          previewImage={previewImage}
           onImageUpload={handleImageUpload}
            formData={formData}
            onInputChange={updateFormData}
          />

          <TechnicalSkillsSection
            formData={formData}
            onInputChange={updateFormData}
            onMultiSelect={handleMultiSelect}
          />

          <ProfileActions
            onSaveDraft={handleSaveDraft}
            onSubmit={handleSubmit}
            isEditMode={isEditMode}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}