import useAppUser from "../../hooks/useAppUser";
import useFetch from "../../hooks/useFetch";
import Footer from "../Footer";
import { PostCard } from "./PostCard";
import "../../styles/myprojects.css";

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