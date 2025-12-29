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
]as const;


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

export const calculateCompletion = (formData:ProfileFormData) => {
  const fields = [
    formData.fullName,
    formData.profilePhoto,
    formData.specialization!==null,
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
function ProfileHeader({ completionPercentage }:ProfileHeaderProps) {
  return (
    <div className="text-center mb-8 animate-slide-in">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">Complete Your Profile</h1>
      <p className="text-gray-600">Help others know more about you and find the perfect collaborators</p>
      
      <div className="mt-6 bg-gray-200 rounded-full h-3 overflow-hidden">
        <div 
          className="progress-bar bg-linear-to-r from-purple-600 to-blue-600 h-full rounded-full transition-all duration-500"
          style={{ width: `${completionPercentage}%` }}
        ></div>
      </div>
      <p className="text-sm text-gray-600 mt-2">{completionPercentage}% Complete</p>
    </div>
  );
}
export default ProfileHeader;