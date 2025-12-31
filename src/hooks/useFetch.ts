import { useEffect, useState } from "react";
import type { Post } from "../components/Feed/PostCard";
import api from "../api/axios";

export default function useFetch() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [allPosts, setAllPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await api.get("/api/posts?populate=author");

        const formattedPosts: Post[] = res.data.data.map((item: any) => {
          const attr = item.attributes ?? item;
         
          const authorData = attr.author;
          const authorId = authorData?.id ?? null;

          console.log("🔍 useFetch - Author debug:", {
            authorData,
            authorId,
          });

          return {
            id: item.id,
            title: attr.title,
            description: attr.description,
            category: attr.category,
            tags: attr.tags || [],
            votes: attr.votes ?? 0,
            comments: attr.comments ?? 0,
            views: attr.views ?? 0,
            seeking: attr.seeking || [],
            status: attr.statuss,
            timestamp: new Date(attr.createdAt).toDateString(),
            voted: false,
            bookmarked: false,
            author: {
              id: authorId, // ✅ This should now work
              name: authorData?.name ?? "Anonymous",
              title: authorData?.title ?? "",
              avatar:
                authorData?.avatar ??
                authorData?.name?.charAt(0)?.toUpperCase() ??
                "?",
              verified: authorData?.verified ?? false,
            },
          };
        });

        console.log("✅ useFetch - Formatted posts with IDs:", 
          formattedPosts.map(p => ({ postId: p.id, authorId: p.author.id }))
        );
        
        setPosts(formattedPosts);
        setAllPosts(formattedPosts);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleVote = (postId: number) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              voted: !post.voted,
              votes: post.voted ? post.votes - 1 : post.votes + 1,
            }
          : post
      )
    );
  };

  const handleBookmark = (postId: number) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? { ...post, bookmarked: !post.bookmarked }
          : post
      )
    );
  };

  return {
    posts,
    loading,
    allPosts,
    setPosts,
    handleVote,
    handleBookmark,
  };
}