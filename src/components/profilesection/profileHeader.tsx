export const specializations = [
  { id: 1, label: 'Full-Stack Development' },
  { id: 2, label: 'Frontend Development' },
  { id: 3, label: 'Backend Development' },
  { id: 4, label: 'Mobile App Development' },
  { id: 5, label: 'Data Science' },
  { id: 6, label: 'AI/ML Engineer' },
  { id: 7, label: 'UI/UX Designer' },
];

export const degrees = [
  { key: 'BSC_CS', label: 'B.Sc Computer Science' },
  { key: 'BTECH_CSE', label: 'B.Tech CSE' },
  { key: 'BTECH_IT', label: 'B.Tech IT' },
  { key: 'BE_CS', label: 'B.E Computer Science' },
  { key: 'MSC_CS', label: 'M.Sc Computer Science' },
  { key: 'MTECH_CSE', label: 'M.Tech CSE' },
] as const;

export const yearsOfStudy = [
  { key: 'FIRST_YEAR', label: '1st Year' },
  { key: 'SECOND_YEAR', label: '2nd Year' },
  { key: 'THIRD_YEAR', label: '3rd Year' },
  { key: 'FOURTH_YEAR', label: '4th Year' },
  { key: 'GRADUATE', label: 'Graduate' },
  { key: 'POSTGRADUATE', label: 'Postgraduate' },
];

export const programmingLanguages = [
  'JavaScript', 'Python', 'Java', 'C++', 'C#', 'TypeScript',
  'Go', 'Rust', 'PHP', 'Ruby', 'Swift', 'Kotlin', 'R', 'SQL'
];

export const frameworks = [
  'React', 'Angular', 'Vue.js', 'Node.js', 'Express.js', 'Django',
  'Flask', 'Spring Boot', 'Laravel', 'Ruby on Rails', '.NET',
  'Next.js', 'Nest.js', 'FastAPI', 'TensorFlow', 'PyTorch'
];

export interface ProfileFormData {
  fullName: string;
  username: string;
  email: any;
  profilePhoto: File | null;
  specialization: number | null;
  currentDegree: string;
  collegeName: string;
  yearOfStudy: string;
  programmingLanguages: string[];
  frameworks: string[];
  experienceLevel: string;
}

export const calculateCompletion = (formData: ProfileFormData) => {
  const fields = [
    formData.fullName,
    formData.profilePhoto,
    formData.specialization !== null,
    formData.currentDegree,
    formData.collegeName,
    formData.yearOfStudy,
    formData.programmingLanguages.length > 0,
    formData.frameworks.length > 0,
    formData.experienceLevel,
  ];
  const filled = fields.filter(f => f).length;
  return Math.round((filled / fields.length) * 100);
};

interface ProfileHeaderProps {
  completionPercentage: number;
}

function ProfileHeader({ completionPercentage }: ProfileHeaderProps) {
  const getCompletionColor = () => {
    if (completionPercentage < 40) return 'from-red-400 to-orange-400';
    if (completionPercentage < 75) return 'from-amber-400 to-yellow-400';
    return 'from-purple-600 to-blue-600';
  };

  const getCompletionLabel = () => {
    if (completionPercentage < 40) return 'Just getting started';
    if (completionPercentage < 75) return 'Making progress';
    if (completionPercentage < 100) return 'Almost there!';
    return 'Profile complete 🎉';
  };

  return (
    <div className="mb-10 animate-slide-in">
      {/* Title block */}
      <div className="mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">
          Complete Your Profile
        </h1>
        <p className="text-gray-500 text-sm sm:text-base">
          Help others know more about you and find the perfect collaborators
        </p>
      </div>

      {/* Progress card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-gray-700">{getCompletionLabel()}</span>
          <span className="text-sm font-bold text-purple-600">{completionPercentage}%</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full bg-linear-to-r ${getCompletionColor()} transition-all duration-700 ease-out`}
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
        {/* Step indicators */}
        <div className="flex justify-between mt-3">
          {[25, 50, 75, 100].map((step) => (
            <span
              key={step}
              className={`text-xs font-medium ${
                completionPercentage >= step ? 'text-purple-600' : 'text-gray-300'
              }`}
            >
              {step}%
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;