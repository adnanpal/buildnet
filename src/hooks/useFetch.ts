import { useEffect, useState } from "react";
import type { Post } from "../components/Feed/PostCard";
import api from "../api/axios";

export default function useFetch(url: string | null) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [allPosts, setAllPosts] = useState<Post[]>([]);

  useEffect(() => {
    if (!url) {
      setLoading(false);
      return;
    }
    const fetchPosts = async () => {
      try {
        const res = await api.get(url);

        const formattedPosts: Post[] = res.data.data.map((item: any) => {
          const attr = item.attributes ?? item;
          
          // Extract app_user data
          const appUserData = attr.app_user?.data ?? attr.app_user ?? null;
          const appUserAttr = appUserData?.attributes ?? appUserData ?? null;

          // Extract author data
          const authorData = attr.author?.data ?? attr.author ?? null;
          const authorAttr = authorData?.attributes ?? authorData ?? null;
          const authorId = authorData?.id ?? attr.author?.data?.id ?? attr.author?.id ?? null;

          console.log("🔍 useFetch - Full debug:", {
            authorData,
            authorId,
            appUserData,
            appUserClerkId: appUserAttr?.clerkUserId
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
              id: authorId,
              name: authorAttr?.name ?? "Anonymous",
              title: authorAttr?.title ?? "",
              avatar: authorAttr?.avatar ?? authorAttr?.name?.charAt(0)?.toUpperCase() ?? "?",
              verified: authorAttr?.verified ?? false,
              clerkUserId: authorAttr?.clerkUserId ?? "",
            },
            app_user: {
              clerkUserId: appUserAttr?.clerkUserId ?? "",
            },
          };
        });

        console.log("✅ useFetch - Formatted posts with app_user:",
          formattedPosts.map(p => ({ 
            postId: p.id, 
            authorId: p.author.id,
            appUserClerkId: p.app_user?.clerkUserId 
          }))
        );

        setPosts(formattedPosts);
        setAllPosts(formattedPosts);
      } catch (err: any) {
        console.error("Failed to fetch posts:", err);
        console.error("Error details:", err.response?.data);
        console.error("Requested URL:", url);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [url]);

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