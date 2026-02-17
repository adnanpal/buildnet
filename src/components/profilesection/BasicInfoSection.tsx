import SectionHeader from "./SectionHeader";
import { User, Upload, Camera } from 'lucide-react';

export interface BasicInfoSectionProps {
  formData: {
    fullName: string;
    username: string;
    email: any;
    profilePhoto: any;
    specialization: number | null;
    currentDegree: string;
    collegeName: string;
    yearOfStudy: string;
    programmingLanguages: string[];
    frameworks: string[];
    experienceLevel: string;
  };
  previewImage: string | null;
  onImageUpload: (file: File, preview: string | ArrayBuffer | null) => void;
  onInputChange: (field: string, value: any) => void;
}

function BasicInfoSection({ formData, previewImage, onImageUpload, onInputChange }: BasicInfoSectionProps) {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageUpload(file, reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="mb-2">
      <SectionHeader
        icon={<User className="w-5 h-5 text-purple-600" />}
        title="Basic Information"
        subtitle="Your public identity on BuildNet"
        bgColor="bg-purple-100"
      />

      <div className="space-y-5">
        {/* Profile Photo */}
        <div className="flex items-center gap-5 p-4 bg-gray-50 rounded-2xl border border-gray-100">
          <div className="relative shrink-0">
            <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-purple-100 to-blue-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-md">
              {previewImage ? (
                <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-9 h-9 text-gray-400" />
              )}
            </div>
            <label className="absolute -bottom-1.5 -right-1.5 bg-purple-600 text-white p-1.5 rounded-xl cursor-pointer hover:bg-purple-700 transition shadow-md">
              <Camera className="w-3.5 h-3.5" />
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-sm mb-0.5">Profile Photo</h3>
            <p className="text-xs text-gray-500 mb-3">Upload a clear, professional photo</p>
            <label className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 text-gray-700 text-xs font-medium rounded-lg cursor-pointer hover:border-purple-300 hover:text-purple-600 transition">
              <Upload className="w-3.5 h-3.5" />
              Choose Photo
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
          </div>
        </div>

        {/* Full Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Full Name <span className="text-purple-600">*</span>
          </label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => {
              onInputChange("fullName", e.target.value);
              localStorage.setItem("authorFullName", e.target.value);
            }}
            placeholder="e.g. Neha Sharma"
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition text-sm text-gray-900 placeholder:text-gray-400 bg-white"
          />
        </div>

        {/* Username + Email side by side on sm+ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
            <input
              type="text"
              value={formData.username}
              readOnly
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 bg-gray-50 text-gray-400 text-sm cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              readOnly
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 bg-gray-50 text-gray-400 text-sm cursor-not-allowed"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default BasicInfoSection;