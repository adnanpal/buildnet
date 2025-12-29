import { useUser } from "@clerk/clerk-react";
import { useState } from "react";

export default function ProfileCompletion() {
  const { user } = useUser();

  // Pre-filled fields from Clerk
  const fullName = user?.fullName || "";
  const email = user?.primaryEmailAddress?.emailAddress || "";
  const username = user?.username || "";

  const [form, setForm] = useState({
    speciality: "",
    degree: "",
    college: "",
    experience: "",
    portfolio: "",
    description: "",
    linkedin: "",
    github: "",
  });

  function handleChange(e: { target: { name: any; value: any; }; }) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: { preventDefault: () => void; }) {
    e.preventDefault();
    console.log("Profile Data Submitted:", { ...form, fullName, email, username });
    alert("Profile completed!");
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Complete Your Profile
        </h2>

        <form className="space-y-5" onSubmit={handleSubmit}>

          {/* Auto-filled Clerk Info */}
          <div>
            <label className="text-sm text-gray-500">Full Name</label>
            <input
              value={fullName}
              disabled
              className="w-full mt-1 px-4 py-2 rounded-lg border bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="text-sm text-gray-500">Email</label>
            <input
              value={email}
              disabled
              className="w-full mt-1 px-4 py-2 rounded-lg border bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="text-sm text-gray-500">Username</label>
            <input
              value={username}
              disabled
              className="w-full mt-1 px-4 py-2 rounded-lg border bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* User Input Fields */}
          <div>
            <label className="text-sm font-medium">Speciality</label>
            <input
              name="speciality"
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 rounded-lg border"
              placeholder="e.g., Full Stack Developer"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Degree</label>
            <input
              name="degree"
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 rounded-lg border"
              placeholder="e.g., B.Sc Computer Science"
            />
          </div>

          <div>
            <label className="text-sm font-medium">College / University</label>
            <input
              name="college"
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 rounded-lg border"
              placeholder="e.g., Pillai College"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Experience (in years)</label>
            <input
              name="experience"
              type="number"
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 rounded-lg border"
              placeholder="e.g., 2"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Portfolio Link</label>
            <input
              name="portfolio"
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 rounded-lg border"
              placeholder="https://yourportfolio.com"
            />
          </div>

          <div>
            <label className="text-sm font-medium">LinkedIn</label>
            <input
              name="linkedin"
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 rounded-lg border"
              placeholder="https://linkedin.com/in/username"
            />
          </div>

          <div>
            <label className="text-sm font-medium">GitHub</label>
            <input
              name="github"
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 rounded-lg border"
              placeholder="https://github.com/username"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Short Description</label>
            <textarea
              name="description"
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 rounded-lg border"
              placeholder="Tell something about yourself..."
              rows={4}
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
}
