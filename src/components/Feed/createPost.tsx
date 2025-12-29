import { useState, useEffect } from "react";
import { usePost } from "../../hooks/usePost";
import { Lightbulb, X, Plus, Sparkles, Users, FileText, Tag, Layers, CheckCircle } from 'lucide-react';
import { useUser } from "@clerk/clerk-react";
import api from "../../api/axios";

export default function CreatePost() {
  const { createPost } = usePost();
  const [authorId, setAuthorId] = useState<number | null>(null);

  const { user } = useUser();

  useEffect(() => {
    if (!user?.id) return;

    const fetchAuthor = async () => {
      try {
        const res = await api.get(
          `/api/authors?filters[user][clerkUserId][$eq]=${user.id}`
        );

        const data = res.data?.data;

        if (data && data.length > 0) {
          setAuthorId(data[0].id);
        }
      } catch (err) {
        console.error("Failed to fetch author", err);
      }
    };

    fetchAuthor();
  }, [user]);

  const [formData, setFormData] = useState({
    name: '',
    title: '',
    description: '',
    tags: [] as string[],
    seekingRoles: [] as string[],
    statuss: '',
    category: ''
  });

  const [currentTag, setCurrentTag] = useState('');
  const [currentRole, setCurrentRole] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const statusOption = [
  { value: 'seeking-collaborators', label: 'Seeking Collaborators', color: 'bg-green-500' }, // Fixed: 'seeking' not 'seeling'
  { value: 'in-progress', label: 'In Progress', color: 'bg-blue-500' },
  { value: 'launched', label: 'Launched', color: 'bg-purple-500' }
];

  const popularTags = [
    'React', 'Node.js', 'Python', 'AI/ML', 'Mobile', 'Web3',
    'TypeScript', 'Vue.js', 'Django', 'Flutter'
  ];

  const popularRoles = [
    'Frontend Developer', 'Backend Developer', 'UI/UX Designer',
    'Mobile Developer', 'Data Scientist', 'DevOps Engineer'
  ];

  const handleAddTag = (tag: string) => {
    if (tag.trim() && !formData.tags.includes(tag.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tag.trim()] });
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(tag => tag !== tagToRemove) });
  };

  const handleAddRole = (role: string) => {
    if (role.trim() && !formData.seekingRoles.includes(role.trim())) {
      setFormData({ ...formData, seekingRoles: [...formData.seekingRoles, role.trim()] });
      setCurrentRole('');
    }
  };

  const handleRemoveRole = (roleToRemove: string) => {
    setFormData({ ...formData, seekingRoles: formData.seekingRoles.filter(role => role !== roleToRemove) });
  };

  // ✅ Load authorId from localStorage

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!authorId) {
      alert("Author not found. Please complete your profile first.");
      return;
    }
    if (!formData.title || !formData.description) {
      alert("Title and description are required");
      return;
    }

    const payload = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      statuss: formData.statuss,
      author: authorId,        // ✅ relation
      tags: formData.tags,     // ✅ already array
      seeking: formData.seekingRoles
    };

    const success = await createPost(payload);

    if (success) {
      alert("Post created successfully!");

      setTimeout(() => {
        setShowSuccess(false);
        setFormData({
          name: '',
          title: '',
          description: '',
          tags: [],
          seekingRoles: [],
          statuss: '',
          category: ''
        });
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-white to-blue-50 py-6 sm:py-12 px-3 sm:px-4 lg:px-8">
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @keyframes successPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        .animate-slide-up {
          animation: slideUp 0.6s ease-out;
        }

        .float-animation {
          animation: float 3s ease-in-out infinite;
        }

        .success-animation {
          animation: successPulse 0.5s ease-out;
        }

        .tag-item {
          transition: all 0.2s ease;
        }

        .tag-item:hover {
          transform: translateY(-2px);
        }
      `}</style>

      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed top-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-auto z-50 bg-white rounded-xl shadow-2xl p-4 sm:p-6 flex items-center gap-3 success-animation border-2 border-green-500">
          <div className="bg-green-500 rounded-full p-2">
            <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm sm:text-base">Success!</p>
            <p className="text-xs sm:text-sm text-gray-600">Your project has been posted</p>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 animate-slide-up">
          <div className="flex justify-center mb-3 sm:mb-4">
            <div className="bg-linear-to-r from-purple-600 to-blue-600 p-3 sm:p-4 rounded-2xl shadow-xl float-animation">
              <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 sm:mb-3 px-2">
            Share Your <span className="bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Project Idea</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-600 px-4">Fill in the details and find the perfect collaborators</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-10 animate-slide-up border border-gray-100" style={{ animationDelay: '0.1s' }}>
          <div className="space-y-6 sm:space-y-8">
            {/* Name Field */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-2 sm:mb-3">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                Your Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., John Doe"
                required
                className="w-full px-3 sm:px-4 py-3 sm:py-4 rounded-lg sm:rounded-xl border-2 border-gray-200 focus:border-purple-600 focus:outline-none transition text-base sm:text-lg"
              />
            </div>

            {/* Project Title Field */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-2 sm:mb-3">
                <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                Project Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., AI-Powered Task Manager"
                required
                className="w-full px-3 sm:px-4 py-3 sm:py-4 rounded-lg sm:rounded-xl border-2 border-gray-200 focus:border-purple-600 focus:outline-none transition text-base sm:text-lg"
              />
            </div>

            {/* Description Field */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-2 sm:mb-3">
                <Layers className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                Project Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your project idea, its goals, and what makes it unique..."
                required
                rows={5}
                className="w-full px-3 sm:px-4 py-3 sm:py-4 rounded-lg sm:rounded-xl border-2 border-gray-200 focus:border-purple-600 focus:outline-none transition text-base sm:text-lg resize-none"
              />
              <p className="text-xs sm:text-sm text-gray-500 mt-2">{formData.description.length} / 500 characters</p>
            </div>

            {/* Tags Field */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-2 sm:mb-3">
                <Tag className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                Technology Tags *
              </label>

              {/* Tag Input */}
              <div className="flex flex-col sm:flex-row gap-2 mb-3 sm:mb-4">
                <input
                  type="text"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag(currentTag))}
                  placeholder="Add a technology tag..."
                  className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border-2 border-gray-200 focus:border-purple-600 focus:outline-none transition text-sm sm:text-base"
                />
                <button
                  type="button"
                  onClick={() => handleAddTag(currentTag)}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-linear-to-r from-purple-600 to-blue-600 text-white rounded-lg sm:rounded-xl font-semibold hover:shadow-lg transition flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                  Add
                </button>
              </div>

              {/* Popular Tags */}
              <div className="mb-3 sm:mb-4">
                <p className="text-xs sm:text-sm text-gray-600 mb-2">Popular tags:</p>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {popularTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleAddTag(tag)}
                      disabled={formData.tags.includes(tag)}
                      className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium transition ${formData.tags.includes(tag)
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-purple-50 text-purple-700 hover:bg-purple-100 active:scale-95'
                        }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected Tags */}
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 sm:gap-2 p-3 sm:p-4 bg-linear-to-r from-purple-50 to-blue-50 rounded-lg sm:rounded-xl">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="tag-item px-3 sm:px-4 py-1.5 sm:py-2 bg-white rounded-full text-xs sm:text-sm font-medium text-purple-700 shadow-sm flex items-center gap-1.5 sm:gap-2 border border-purple-200"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:bg-purple-100 rounded-full p-0.5 transition active:scale-90"
                      >
                        <X className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Seeking Roles Field */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-2 sm:mb-3">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                Seeking Collaborators
              </label>

              {/* Role Input */}
              <div className="flex flex-col sm:flex-row gap-2 mb-3 sm:mb-4">
                <input
                  type="text"
                  value={currentRole}
                  onChange={(e) => setCurrentRole(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddRole(currentRole))}
                  placeholder="e.g., Frontend Developer"
                  className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border-2 border-gray-200 focus:border-purple-600 focus:outline-none transition text-sm sm:text-base"
                />
                <button
                  type="button"
                  onClick={() => handleAddRole(currentRole)}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-linear-to-r from-purple-600 to-blue-600 text-white rounded-lg sm:rounded-xl font-semibold hover:shadow-lg transition flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                  Add
                </button>
              </div>

              {/* Popular Roles */}
              <div className="mb-3 sm:mb-4">
                <p className="text-xs sm:text-sm text-gray-600 mb-2">Common roles:</p>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {popularRoles.map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => handleAddRole(role)}
                      disabled={formData.seekingRoles.includes(role)}
                      className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium transition ${formData.seekingRoles.includes(role)
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-blue-50 text-blue-700 hover:bg-blue-100 active:scale-95'
                        }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected Roles */}
              {formData.seekingRoles.length > 0 && (
                <div className="flex flex-wrap gap-1.5 sm:gap-2 p-3 sm:p-4 bg-linear-to-r from-blue-50 to-purple-50 rounded-lg sm:rounded-xl">
                  {formData.seekingRoles.map((role) => (
                    <span
                      key={role}
                      className="tag-item px-3 sm:px-4 py-1.5 sm:py-2 bg-white rounded-full text-xs sm:text-sm font-medium text-blue-700 shadow-sm flex items-center gap-1.5 sm:gap-2 border border-blue-200"
                    >
                      {role}
                      <button
                        type="button"
                        onClick={() => handleRemoveRole(role)}
                        className="hover:bg-blue-100 rounded-full p-0.5 transition active:scale-90"
                      >
                        <X className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Status Dropdown */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-2 sm:mb-3">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                Project Status *
              </label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
                {statusOption.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, statuss: option.value })}
                    className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all active:scale-95 ${formData.statuss === option.value
                        ? 'border-purple-600 bg-purple-50 shadow-lg'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                      }`}
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full ${option.color}`}></div>
                      <span className="font-semibold text-gray-900 text-sm sm:text-base">{option.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6 border-t-2 border-gray-100">
              <button
                type="button"
                className="w-full sm:flex-1 px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl border-2 border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition text-base sm:text-lg active:scale-95"
              >
                Save as Draft
              </button>
              <button
                onClick={handleSubmit}
                disabled={!formData.name || !formData.title || !formData.description || !formData.statuss || formData.tags.length === 0}
                className="w-full sm:flex-1 px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl bg-linear-to-r from-purple-600 to-blue-600 text-white font-bold hover:shadow-2xl transition disabled:opacity-50 disabled:cursor-not-allowed text-base sm:text-lg active:scale-95"
              >
                Post Project
              </button>
            </div>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-gray-500 animate-slide-up px-4" style={{ animationDelay: '0.2s' }}>
          <p>Your project will be visible to all BuildNet members</p>
        </div>
      </div>
    </div>
  );
}