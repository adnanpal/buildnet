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
  } = useFetch("/api/posts?populate=author&populate=app_user");

  const { data, search, reset } = useSearch(
    "/api/posts?populate[author][populate]=*&filters[title][$containsi]="
  );

  useEffect(() => {
    if (!data?.data) return;

    const formatted = data.data.map((item: any) => {
      const attr = item.attributes ?? item;

      const appUserData = attr.app_user?.data ?? attr.app_user ?? null;
      const appUserAttr = appUserData?.attributes ?? appUserData ?? null;

      const authorData = attr.author?.data ?? attr.author ?? null;
      const authorAttr = authorData?.attributes ?? authorData ?? null;

      const authorId =
        authorData?.id ??
        attr.author?.data?.id ??
        attr.author?.id ??
        null;

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
          clerkUserId: authorAttr?.clerkUserId ?? "",
        },
        app_user: {
          clerkUserId: appUserAttr?.clerkUserId ?? "",
        },
      };
    });

    setPosts(formatted);
  }, [data, setPosts]);

  function handleFilterChange(value: string) {
    if (value === "all") {
      setPosts(allPosts);
      return;
    }
    if (value === "seeking") {
      setPosts(
        allPosts.filter(
          (post) => post.status === "seeking-collaborators" || post.seeking.length > 0
        )
      );
      return;
    }
    setPosts(allPosts.filter((post) => post.status === value));
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
      <div className="bg-linear-to-b from-purple-50 via-blue-50 to-indigo-50 min-h-screen">
        <FeedNavbar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

            {/* Main Feed */}
            <div className="lg:col-span-8">
              <div className="mb-6">
                <SearchBar onFilterChange={handleFilterChange} onSearch={handleSearch} />
              </div>

              {posts.length > 0 ? (
                <div className="animate-slide-up">
                  {posts.map((post, index) => (
                    <div
                      key={post.id}
                      className="animate-fade-in"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <PostCard
                        post={post}
                        onVote={handleVote}
                        onBookmark={handleBookmark}
                        variant="feed"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                /* Empty State */
                <div className="animate-scale-in text-center py-16 sm:py-24 bg-white rounded-2xl border border-gray-200">
                  <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-5 flex items-center justify-center">
                    <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No projects found</h3>
                  <p className="text-gray-500 text-sm">Try adjusting your search or filters</p>
                </div>
              )}

              {/* Load More */}
              {posts.length > 0 && (
                <div className="text-center mt-8 sm:mt-10">
                  <button className="px-6 sm:px-8 py-3 border-2 border-purple-600 text-purple-600 rounded-xl font-semibold hover:bg-purple-600 hover:text-white transition-all">
                    Load More Projects
                  </button>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-4">
              <div className="sticky top-4">
                <FeedSidebar />
              </div>
            </aside>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}