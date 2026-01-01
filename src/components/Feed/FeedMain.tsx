import FeedNavbar from './FeedNavbar';
import { SearchBar } from './SearchBar';
import { PostCard } from './PostCard';
import { FeedSidebar } from './FeedSidebar';
import Footer from '../Footer';
import useFetch from "../../hooks/useFetch";
import { useSearch } from '../../hooks/useSearch';
import { useEffect } from 'react';

export default function FeedMain() {
  const {
    posts,
    handleVote,
    setPosts,
    handleBookmark,
    allPosts,
  } = useFetch("/api/posts?populate=author");

  const { data, search, reset } = useSearch(
    "/api/posts?populate[author][populate]=*&filters[title][$containsi]="
  );

 useEffect(() => {
  if (!data?.data) return;

  const formatted = data.data.map((item: any) => {
    const attr = item.attributes ?? item;
    
    
    const authorData = attr.author?.data ?? attr.author ?? null;
    const authorAttr = authorData?.attributes ?? authorData ?? null;
    
   
    const authorId = 
      authorData?.id ?? 
      attr.author?.data?.id ?? 
      attr.author?.id ?? 
      null;

    console.log("🔍 Debugging author:", {
      authorData,
      authorId,
      fullAuthorObject: attr.author
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
        avatar: authorAttr?.avatar ?? "?",
        verified: authorAttr?.verified ?? false,
      },
    };
  });

  console.log("✅ Final formatted posts:", formatted);
  setPosts(formatted);
}, [data, setPosts]);

function handleFilterChange(value:string){

  if(value==="all"){
    setPosts(allPosts);
    return;
  }
  if(value==="seeking"){
    setPosts(allPosts.filter(post=>post.status==="seeking-collaborators"||post.seeking.length>0));
    return;
  }

  setPosts(
    allPosts.filter(post => post.status === value)
  );
}

  const handleSearch = (value: string) => {
    if (!value.trim()) {
      reset();
      setPosts(allPosts);
      return; 
    }
    search(value);
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-0 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Feed */}
            <div className="lg:col-span-2">
              <SearchBar onFilterChange={handleFilterChange} onSearch={handleSearch} />

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