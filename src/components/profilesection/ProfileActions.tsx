import { Save, CheckCircle, Loader2 } from "lucide-react";

interface ProfileActionsProps {
  isEditMode: boolean;
  onSubmit: () => Promise<void>;
  onSaveDraft?: () => void;
  loading: boolean;
}

function ProfileActions({ onSaveDraft, onSubmit, loading, isEditMode }: ProfileActionsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-100">
      {/* Draft button */}
      <button
        type="button"
        onClick={onSaveDraft}
        disabled={loading}
        className="flex-1 sm:flex-none sm:w-44 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 hover:border-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Save className="w-4 h-4" />
        Save as Draft
      </button>

      {/* Submit button */}
      <button
        type="button"
        onClick={onSubmit}
        disabled={loading}
        className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-linear-to-r from-purple-600 to-blue-600 text-white text-sm font-semibold hover:from-purple-700 hover:to-blue-700 transition shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <CheckCircle className="w-4 h-4" />
            {isEditMode ? 'Save Changes' : 'Complete Profile'}
          </>
        )}
      </button>
    </div>
  );
}

export default ProfileActions;