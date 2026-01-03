import useAppUser from "../../hooks/useAppUser";
import useFetch from "../../hooks/useFetch";
import Footer from "../Footer";
import { PostCard } from "./PostCard";

export default function MyProjects() {
  const { appUserId, isLoaded } = useAppUser();

  const { posts, loading, handleVote, handleBookmark } = useFetch(
    isLoaded && appUserId
      ? `/api/posts?filters[app_user][id][$eq]=${appUserId}&populate=*`
      : null
  );

  console.log(appUserId);

  if (!isLoaded) {
    return <div className="animate-pulse">Loading user...</div>;
  }

  if (loading) {
    return <div className="animate-pulse">Loading projects...</div>;
  }

  if (!posts.length) {
    return (
      <div className="text-center text-gray-500 mt-10">
        You haven't created any projects yet.
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-linear-to-br from-purple-50 via-blue-50 to-indigo-50">
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

          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          @keyframes scaleIn {
            from {
              opacity: 0;
              transform: scale(0.9);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          @keyframes shimmer {
            0% { background-position: -1000px 0; }
            100% { background-position: 1000px 0; }
          }

          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }

          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
          }

          .animate-slide-up {
            animation: slideUp 0.6s ease-out forwards;
          }

          .animate-fade-in {
            animation: fadeIn 0.5s ease-out;
          }

          .animate-scale-in {
            animation: scaleIn 0.4s ease-out;
          }

          .shimmer {
            background: linear-gradient(
              90deg,
              rgba(255, 255, 255, 0) 0%,
              rgba(255, 255, 255, 0.4) 50%,
              rgba(255, 255, 255, 0) 100%
            );
            background-size: 1000px 100%;
            animation: shimmer 2s infinite;
          }

          .hover-lift {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .hover-lift:hover {
            transform: translateY(-4px);
            box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.15);
          }

          .glass-effect {
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.3);
          }

          .gradient-text {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
        `}</style>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-0 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="animate-slide-up">
                {posts.map((post, index) => (
                  <div key={post.id} style={{ animationDelay: `${index * 0.1}s` }}>
                    <PostCard
                      post={post}
                      onVote={handleVote}
                      onBookmark={handleBookmark}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}