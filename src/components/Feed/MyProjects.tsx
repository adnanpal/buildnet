import useFetch from "../../hooks/useFetch";
import { PostCard } from "./PostCard";
import { useUser } from "@clerk/clerk-react";

export default function MyProjects() {
  const { user, isLoaded } = useUser();
  const appUserId = localStorage.getItem("appUserId");

  const {
    posts,
    loading,
    handleVote,
    handleBookmark,
  } = useFetch(
    isLoaded && appUserId
      ? `/api/posts?filters[author][id][$eq]=${appUserId}&populate=author`
      : null
  );

  // ⏳ Wait for Clerk to load first
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
        You haven’t created any projects yet.
      </div>
    );
  }

  return (
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
  );
}
