import ProfileHeader from "./profileHeader";
import BasicInfoSection from "./BasicInfoSection";
import ProfessionalDetailsSection from "./ProfessionalDetailSection";
import ProfileActions from "./ProfileActions";
import TechnicalSkillsSection from "./TechnicalSkillsSection";
import { useProfile } from "../../hooks/useProfile";

export default function ProfileCompletion() {
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

  /* ── Loading / hydration state ── */
  if (loading || !isHydrated) {
    return (
      <div className="min-h-screen bg-linear-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-5">
            <div className="absolute inset-0 rounded-full border-4 border-purple-100" />
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-600 animate-spin" />
          </div>
          <p className="text-gray-700 font-semibold text-sm">Loading your profile…</p>
          <p className="text-gray-400 text-xs mt-1">Just a moment</p>
        </div>
      </div>
    );
  }

  /* ── Main page ── */
  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-white to-blue-50 py-10 px-4 sm:px-6 lg:px-8">
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes progressFill {
          from { width: 0%; }
        }
        .animate-slide-in {
          animation: slideIn 0.45s ease-out both;
        }
        .progress-bar {
          animation: progressFill 0.9s ease-out;
        }
        .tag-item {
          transition: all 0.15s ease;
        }
        .tag-item:hover {
          transform: translateY(-1px);
        }
      `}</style>

      <div className="max-w-2xl mx-auto">
        {/* Progress header */}
        <ProfileHeader completionPercentage={completionPercentage} />

        {/* Form card */}
        <div
          className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden animate-slide-in"
          style={{ animationDelay: '0.08s' }}
        >
          {/* Top accent stripe */}
          <div className="h-1 w-full bg-linear-to-r from-purple-500 via-blue-500 to-indigo-500" />

          <div className="p-6 sm:p-8 space-y-0">
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

        {/* Footer note */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Your information is only visible to collaborators you connect with.
        </p>
      </div>
    </div>
  );
}