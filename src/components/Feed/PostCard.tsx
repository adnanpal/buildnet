import { CheckCircle, MoreHorizontal, Users, ArrowUp, MessageSquare, Eye, Bookmark, Share2, Sparkles, Zap } from "lucide-react";
type PostStatus = "seeking-collaborators" | "in-progress" | "launched";
import BuildNetDialog from "../modals/BuildNetDialog";
import { useState } from "react";

export interface Post {
  id: number;
  timestamp: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  votes: number;
  comments: number;
  views: number;
  seeking: string[];
  status: PostStatus;
  voted: boolean;
  bookmarked: boolean;

  author: {
    name: string;
    avatar: string;
    verified: boolean;
    title: string;
  };
}

interface PostCardProps {
  post: Post;
  onVote: (postId: number) => void;
  onBookmark: (postId: number) => void;
}

export function PostCard({ post, onVote, onBookmark }: PostCardProps) {
  const [open, setOpen] = useState(false);

  const handleSendRequest = async () => {
    // axios POST → /api/connection-requests
    console.log('Send request to user:');
    setOpen(false);
  }
  const statusConfig = {
    'seeking-collaborators': {
      color: 'bg-gradient-to-r from-green-500 to-emerald-500',
      text: 'Seeking Collaborators',
      icon: <Users className="w-3 h-3" />
    },
    'in-progress': {
      color: 'bg-gradient-to-r from-blue-500 to-cyan-500',
      text: 'In Progress',
      icon: <Zap className="w-3 h-3" />
    },
    'launched': {
      color: 'bg-gradient-to-r from-purple-500 to-pink-500',
      text: 'Launched',
      icon: <Sparkles className="w-3 h-3" />
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-4 sm:p-6 mb-4 border border-gray-100">
      {/* Author Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-linear-to-br from-purple-400 to-blue-400 flex items-center justify-center text-white font-bold shadow-lg">
            {post.author?.avatar ?? "?"}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-gray-900">{post.author?.name ?? "Anonymous"}</h3>
              {post.author?.verified && (
                <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500 shrink-0" />
              )}
            </div>
            <p className="text-xs sm:text-sm text-gray-500 truncate">{post.author.title}</p>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 shrink-0 ml-2">
          <div className={`${statusConfig[post.status]?.color} text-white px-3 py-1 rounded-full flex items-center gap-1.5 text-xs font-bold shadow-lg`}>
            {statusConfig[post.status]?.icon}
            {statusConfig[post.status]?.text}
          </div>
          <button className="p-2 sm:p-2 hover:bg-gray-100 rounded-lg transition">
            <MoreHorizontal className="w-5 h-5 sm:w-5 sm:h-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Post Content */}
      <div className="mb-4 sm:mb-4">
        <h2 className="text-xl sm:text-xl font-bold text-gray-900 mb-2 hover:text-purple-600 cursor-pointer transition line-clamp-2">
          {post.title}
        </h2>
        <p className="text-gray-600 leading-relaxed mb-4 sm:mb-4 text-sm sm:text-base line-clamp-3">
          {post.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 sm:gap-2 mb-3 sm:mb-4">
          {post.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-700 text-xs sm:text-sm rounded-full hover:bg-purple-100 hover:text-purple-700 transition cursor-pointer"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Seeking Collaborators */}
        {post.seeking.length > 0 && (
          <div className="flex items-center gap-2 p-3 bg-linear-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200">
            <Users className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-bold text-purple-900">Seeking:</span>
            <div className="flex flex-wrap gap-2">
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-2">
              {post.seeking.map((role, index) => (
                <span key={index} className="text-xs sm:text-sm text-purple-700 font-semibold">
                  {role}{index < post.seeking.length - 1 ? ',' : ''}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Post Stats and Actions */}
      <div className="flex items-center justify-between  border-t border-gray-200 sm:flex-row sm:items-center sm:justify-between  sm:gap-0 pt-3 sm:pt-4">
        {/* Stats */}
        <div className="flex items-center gap-4 sm:gap-6 text-gray-500">
          <button
            onClick={() => onVote(post.id)}
            className={`flex items-center gap-2 transition hover:scale-110 ${
                          post.voted ? 'text-purple-600' : 'hover:text-purple-600'
                        }
              }`}
          >
          
            <ArrowUp className={`w-5 h-5 sm:w-5 sm:h-5 ${post.voted ? 'fill-current' : ''}`} />
            <span className="font-bold text-sm sm:text-base">{post.votes}</span>
            
          </button>      

          <div className="flex items-center gap-2 sm:gap-2">
             <div className="p-2 rounded-lg hover:bg-gray-100 transition">
            <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="font-semibold sm:text-base">{post.comments}</span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className=" sm:text-base font-semibold">{post.views}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between sm:justify-end gap-2">
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => onBookmark(post.id)}
              className={`p-2 sm:p-3 rounded-xl transition hover:scale-110 ${
                          post.bookmarked 
                            ? 'bg-purple-100 text-purple-600' 
                            : 'hover:bg-gray-100 text-gray-400'
                        }`}
            >
              <Bookmark className={`w-5 h-5 sm:w-5 sm:h-5 ${post.bookmarked ? 'fill-current' : ''}`} />
            </button>

            <button className="p-2 hover:bg-gray-100 rounded-xl transition hover:scale-110 text-gray-400">
              <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          <button
            onClick={() => setOpen(true)}
            className="px-5 py-2 bg-linear-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold hover:shadow-xl transition hover:scale-105">
            Collaborate
          </button>
          <BuildNetDialog
            open={open}
            onClose={() => setOpen(false)}
            onConfirm={handleSendRequest}
          />
        </div>
      </div>
    </div>
  );
}