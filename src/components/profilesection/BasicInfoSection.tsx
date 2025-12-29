import SectionHeader from "./SectionHeader";
import { User, Upload } from 'lucide-react';

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
    <div className="mb-10">
      <SectionHeader
        icon={<User className="w-6 h-6 text-purple-600" />}
        title="Basic Information"
        bgColor="bg-purple-100"
      />

      <div className="space-y-6">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-linear-to-r from-purple-100 to-blue-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
              {previewImage ? (
                <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-12 h-12 text-gray-400" />
              )}
            </div>
            <label className="absolute bottom-0 right-0 bg-purple-600 text-white p-2 rounded-full cursor-pointer hover:bg-purple-700 transition shadow-lg">
              <Upload className="w-4 h-4" />
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Profile Photo</h3>
            <p className="text-sm text-gray-500">Upload a professional photo</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => {
              onInputChange("fullName", e.target.value);
              localStorage.setItem("authorFullName", e.target.value);
            }}
            placeholder="Enter your full name"
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-600 focus:outline-none transition"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
          <input
            type="text"
            value={formData.username}
            readOnly
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={formData.email}
            readOnly
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
          />
        </div>
      </div>
    </div>
  );
}
export default BasicInfoSection;
