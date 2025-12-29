interface ProfileActionsProps {
  isEditMode: boolean;
  onSubmit: () => Promise<void>;
  onSaveDraft?: () => void;
  loading:boolean;
}

function ProfileActions({ onSaveDraft, onSubmit }:ProfileActionsProps) {
  return (
    <div className="flex gap-4 pt-6 border-t">
      <button
        type="button"
        onClick={onSaveDraft}
        className="flex-1 px-8 py-4 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition"
      >
        Save as Draft
      </button>
      <button
        onClick={onSubmit}
        className="flex-1 px-8 py-4 rounded-lg bg-linear-to-r from-purple-600 to-blue-600 text-white font-semibold hover:shadow-xl transition"
      >
        Complete Profile
      </button>
    </div>
  );
}
export default ProfileActions;