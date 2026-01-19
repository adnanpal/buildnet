import FeedNavbar from './FeedNavbar';
import { SearchBar } from './SearchBar';
import { PostCard } from './PostCard';
import { FeedSidebar } from './FeedSidebar';
import Footer from '../Footer';
import useFetch from "../../hooks/useFetch";
import { useSearch } from '../../hooks/useSearch';
import { useEffect } from 'react';
import "../../styles/feedmain.css";

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
                      variant="feed"
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