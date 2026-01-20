
import React, { useState } from 'react';
import { Menu, MapPin, Plus, Github, Linkedin, Globe, Code, Award, Spade, Lightbulb } from 'lucide-react';
import FeedNavbar from '../Feed/FeedNavbar';

export default function BuildNetProfile() {
  const [activeTab, setActiveTab] = useState('projects');

  const profileData = {
    name: "Adnan Pal",
    college: "MIT College of Engineering",
    year: "3rd Year",
    branch: "Computer Science",
    location: "Navi Mumbai",
    bio: "Building the future, one project at a time 🚀",
    avatar: "AP",
    stats: {
      projects: 5,
      collaborators: 12,
      contributions: 48
    },
    skills: [
      "React", "Node.js", "Python", "MongoDB", 
      "Machine Learning", "UI/UX Design", "Git"
    ],
    languages: [
      { name: "JavaScript", level: 85 },
      { name: "Python", level: 78 },
      { name: "Java", level: 65 },
      { name: "C++", level: 60 }
    ],
    recentProjects: [
      {
        id: 1,
        title: "Campus Connect",
        description: "A social platform for college students to collaborate on projects",
        tech: ["React", "Node.js", "MongoDB"],
        stars: 24,
        status: "Active"
      },
      {
        id: 2,
        title: "AI Study Assistant",
        description: "ML-powered study companion for personalized learning",
        tech: ["Python", "TensorFlow", "Flask"],
        stars: 18,
        status: "In Progress"
      },
      {
        id: 3,
        title: "Event Manager Pro",
        description: "Complete event management system for college fests",
        tech: ["React Native", "Firebase"],
        stars: 15,
        status: "Completed"
      }
    ],
    achievements: [
      "🏆 Winner - Smart India Hackathon 2024",
      "🥇 1st Place - College Tech Fest",
      "⭐ Top Contributor - Open Source Program"
    ]
  };

  return (
     <div className="min-h-screen bg-linear-to-br from-purple-50 via-blue-50 to-indigo-50">
        <FeedNavbar/>
      {/* Header */}
    

      {/* Profile Header */}
      <div className="bg-linear-to-br from-purple-600 via-purple-500 to-pink-500 h-32"></div>
      
      <div className="max-w-6xl mx-auto px-4 -mt-16">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          {/* Avatar and Basic Info */}
          <div className="flex flex-col items-center -mt-20 mb-4">
            <div className="w-32 h-32 rounded-3xl bg-linear-to-br from-purple-600 to-pink-500 flex items-center justify-center text-white text-4xl font-bold shadow-xl border-4 border-white">
              {profileData.avatar}
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mt-4">{profileData.name}</h1>
            <p className="text-purple-600 font-semibold text-lg">{profileData.college}</p>
            <p className="text-gray-600">{profileData.year} • {profileData.branch}</p>
            
            <div className="flex items-center gap-1 text-gray-600 mt-2">
              <MapPin className="w-4 h-4" />
              <span>{profileData.location}</span>
            </div>

            <p className="text-gray-700 italic mt-3 text-center max-w-md">{profileData.bio}</p>

            {/* Social Links */}
            <div className="flex gap-3 mt-4">
              <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition">
                <Github className="w-5 h-5 text-gray-700" />
              </button>
              <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition">
                <Linkedin className="w-5 h-5 text-gray-700" />
              </button>
              <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition">
                <Globe className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            <button className="mt-4 px-8 py-2.5 bg-white border-2 border-purple-600 text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition">
              Update Profile
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{profileData.stats.projects}</div>
              <div className="text-gray-600 text-sm mt-1">Projects</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{profileData.stats.collaborators}</div>
              <div className="text-gray-600 text-sm mt-1">Collaborators</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{profileData.stats.contributions}</div>
              <div className="text-gray-600 text-sm mt-1">Contributions</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('projects')}
              className={`flex-1 py-3 px-4 font-semibold transition ${
                activeTab === 'projects'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Recent Projects
            </button>
            <button
              onClick={() => setActiveTab('skills')}
              className={`flex-1 py-3 px-4 font-semibold transition ${
                activeTab === 'skills'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Skills & Languages
            </button>
            <button
              onClick={() => setActiveTab('achievements')}
              className={`flex-1 py-3 px-4 font-semibold transition ${
                activeTab === 'achievements'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Achievements
            </button>
          </div>

          <div className="p-6">
            {/* Projects Tab */}
            {activeTab === 'projects' && (
              <div className="space-y-4">
                {profileData.recentProjects.map(project => (
                  <div key={project.id} className="border rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{project.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        project.status === 'Active' ? 'bg-green-100 text-green-700' :
                        project.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {project.tech.map(tech => (
                        <span key={tech} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <span className="mr-1">⭐</span>
                      <span>{project.stars} stars</span>
                    </div>
                  </div>
                ))}
                <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-purple-600 font-semibold hover:bg-purple-50 transition flex items-center justify-center gap-2">
                  <Plus className="w-5 h-5" />
                  Add New Project
                </button>
              </div>
            )}

            {/* Skills & Languages Tab */}
            {activeTab === 'skills' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Technical Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {profileData.skills.map(skill => (
                      <span key={skill} className="px-4 py-2 bg-linear-to-r from-purple-100 to-pink-100 text-purple-700 rounded-lg font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Programming Languages</h3>
                  <div className="space-y-4">
                    {profileData.languages.map(lang => (
                      <div key={lang.name}>
                        <div className="flex justify-between mb-1">
                          <span className="font-medium text-gray-700">{lang.name}</span>
                          <span className="text-purple-600 font-semibold">{lang.level}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-linear-to-r from-purple-600 to-pink-500 h-2.5 rounded-full transition-all"
                            style={{ width: `${lang.level}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Achievements Tab */}
            {activeTab === 'achievements' && (
              <div className="space-y-3">
                {profileData.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center gap-3 p-4 bg-linear-to-r from-purple-50 to-pink-50 rounded-lg">
                    <Award className="w-6 h-6 text-purple-600 shrink-0" />
                    <span className="text-gray-800 font-medium">{achievement}</span>
                  </div>
                ))}
                <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-purple-600 font-semibold hover:bg-purple-50 transition flex items-center justify-center gap-2 mt-4">
                  <Plus className="w-5 h-5" />
                  Add Achievement
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
  )
}
