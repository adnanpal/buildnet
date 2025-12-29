import { Sparkles, Award, Flame, Star } from "lucide-react";

export function FeedSidebar() {


  return (

    /*<div className="space-y-6">*/

    /*< className="bg-white rounded-xl shadow-sm p-6">*/
    <>
      <div className="lg:col-span-1">
        <div className="sticky top-24 space-y-6">
          {/* Trending Now */}
          <div className="glass-effect rounded-2xl p-6 animate-fade-in">
            <div className="flex items-center gap-2 mb-4">
              <Flame className="w-5 h-5 text-orange-500" />
              <h3 className="font-bold text-gray-900">Trending Now</h3>
            </div>
            <div className="space-y-3">
              {['#AI', '#Web3', '#React', '#Mobile', '#IoT'].map((tag, i) => (
                <div key={i} className="flex items-center justify-between p-3 hover:bg-white/50 rounded-xl cursor-pointer transition">
                  <span className="font-semibold text-purple-600">{tag}</span>
                  <span className="text-sm text-gray-500">{234 - i * 20} projects</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Contributors */}
          <div className="glass-effect rounded-2xl p-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-yellow-500" />
              <h3 className="font-bold text-gray-900">Top Contributors</h3>
            </div>
            <div className="space-y-4">
              {[
                { name: 'Emily Davis', projects: 12, avatar: 'ED' },
                { name: 'Ryan Park', projects: 10, avatar: 'RP' },
                { name: 'Lisa Wong', projects: 9, avatar: 'LW' }
              ].map((user, i) => (
                <div key={i} className="flex items-center gap-3 p-2 hover:bg-white/50 rounded-xl cursor-pointer transition">
                  <div className="w-10 h-10 rounded-xl bg-linear-to-br from-purple-400 to-blue-400 flex items-center justify-center text-white font-bold text-sm">
                    {user.avatar}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 text-sm">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.projects} projects</p>
                  </div>
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                </div>
              ))}
            </div>
          </div>

          {/* Community Stats */}
          <div className="bg-linear-to-br from-purple-600 to-blue-600 rounded-2xl p-6 text-white shadow-2xl animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Community Stats
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-purple-100">Active Projects</span>
                <span className="font-bold text-xl">1,234</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-purple-100">Total Members</span>
                <span className="font-bold text-xl">10,567</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-purple-100">Collaborations</span>
                <span className="font-bold text-xl">3,892</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>

  );
}