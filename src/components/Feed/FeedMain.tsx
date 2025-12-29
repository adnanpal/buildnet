import { useEffect, useState } from 'react';
import FeedNavbar from './FeedNavbar';
import { SearchBar } from './SearchBar';
import { PostCard } from './PostCard';
import { FeedSidebar } from './FeedSidebar';
import Footer from '../Footer';
import type { Post } from './PostCard';
import api from '../../api/axios';

export default function FeedMain() {

  const [posts, setPosts] = useState<Post[]>([]);
  const [, setLoading] = useState(true);

  const handleFilterChange = (value: string) => {
    console.log("Filter changed:", value);
  };


  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await api.get(
          "/api/posts?populate=author"
        );

        const formattedPosts: Post[] = res.data.data.map((item: any) => {
          const attr = item || {};

          const authorData = attr.author || null; // Changed: author is directly accessible

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
            status: attr.statuss, // Your Strapi field is "statuss" not "status"
            timestamp: new Date(attr.createdAt).toDateString(),
            voted: false,
            bookmarked: false,

            author: {
              name: authorData?.name ?? "Anonymous",
              title: authorData?.title ?? "",
              avatar: authorData?.avatar ?? authorData?.name?.charAt(0)?.toUpperCase() ?? "?",
              verified: authorData?.verified ?? false,
            },
          };
        });

        setPosts(formattedPosts);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleVote = (postId: number) => {
    setPosts(posts.map(post => {
      if (post.id == postId) {
        return {
          ...post,
          voted: !post.voted,
          votes: post.voted ? post.votes - 1 : post.votes + 1
        };
      }
      return post;
    }));
  };

  const handleBookmark = (postId: number) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return { ...post, bookmarked: !post.bookmarked };
      }
      return post;
    }));
  };

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
        <FeedNavbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Feed */}
            <div className="lg:col-span-2">
              <SearchBar onFilterChange={handleFilterChange} />

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

              {/* Load More Button */}
              <div className="text-center mt-8">
                <button className="px-8 py-3 border-2 border-purple-600 text-purple-600 rounded-lg font-semibold hover:bg-purple-600 hover:text-white transition">
                  Load More Projects
                </button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <FeedSidebar />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}