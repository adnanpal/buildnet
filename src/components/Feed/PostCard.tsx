import { CheckCircle, MoreHorizontal, Users, ArrowUp, MessageSquare, Eye, Bookmark, Share2, Sparkles, Zap } from "lucide-react";
type PostStatus = "seeking-collaborators" | "in-progress" | "launched";
import BuildNetDialog from "../modals/BuildNetDialog";
import { useState } from "react";
import api from "../../api/axios";
import { useUser } from "@clerk/clerk-react";


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
    id: number,
    name: string;
    avatar: string;
    verified: boolean;
    title: string;
    clerkUserId: string;  
  };
  app_user: {
  clerkUserId: string;
};
}

interface PostCardProps {
  post: Post;
  onVote: (postId: number) => void;
  onBookmark: (postId: number) => void;
  variant?: "feed"|"my-projects";
  onDelete?: (postId: number) => void;
}

export function PostCard({ post, onVote,onDelete, onBookmark,variant = "feed" }: PostCardProps) {
  const [open, setOpen] = useState(false);
  const [selectedClerkUserId, setSelectedClerkUserId] = useState<string | null>(null);
  const { user } = useUser();


  const [expanded,setExpanded] = useState(false);


  const handleSendRequest = async () => {
  try {
    const fromClerkUserId = user?.id;
    console.log("from user id",fromClerkUserId);
    console.log("selected user id",selectedClerkUserId);

    if (!fromClerkUserId || !selectedClerkUserId) {
      alert("Missing user information");
      return;
    }
    if (!post.app_user?.clerkUserId) {
      alert("This user is not linked to an account yet");
      return;
    }

    if (fromClerkUserId === selectedClerkUserId) {
      alert("You cannot send request to yourself");
      return;
    }

    // Resolve FROM user
    const fromRes = await api.get(
      `/api/app-users?filters[clerkUserId][$eq]=${fromClerkUserId}`
    );
    const fromUser = fromRes.data.data[0];
    if (!fromUser) throw new Error("From user not found");

    // Resolve TO user
    const toRes = await api.get(
      `/api/app-users?filters[clerkUserId][$eq]=${selectedClerkUserId}`
    );
    const toUser = toRes.data.data[0];
    if (!toUser) throw new Error("Target user not found");

    // Create request
    await api.post("/api/connection-requests", {
      data: {
        fromUser: fromUser.id,
        toUser: toUser.id,
        connectionStatus: "pending",
      },
    });

    alert("Connection request sent");
    setOpen(false);

  } catch (err: any) {
    console.error(err);
    alert(err.message);
  }
};


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
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-4 sm:p-4 mb-4 border border-gray-100">
      {/* Author Header */}
      <div className="flex items-start justify-between mb-4 gap-2">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-12 h-12 rounded-xl bg-linear-to-br from-purple-400 to-blue-400 flex items-center justify-center text-white font-bold shadow-lg shrink-0">
            {post.author?.avatar ?? "?"}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-gray-900 truncate">{post.author?.name ?? "Anonymous"}</h3>
              {post.author?.verified && (
                <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500 shrink-0" />
              )}
            </div>
            <p className="text-xs sm:text-sm text-gray-500 truncate">{post.author.title}</p>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <div className={`${statusConfig[post.status]?.color} text-white px-2 sm:px-3 py-1 rounded-full flex items-center gap-1 sm:gap-1.5 text-xs font-bold shadow-lg whitespace-nowrap`}>
            {statusConfig[post.status]?.icon}
            <span>{statusConfig[post.status]?.text}</span>
          </div>
          <button className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition shrink-0">
            <MoreHorizontal className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Post Content */}
      <div className="mb-4 sm:mb-4">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 hover:text-purple-600 cursor-pointer transition line-clamp-2">
          {post.title}
        </h2>
        <p className={`text-gray-600 leading-relaxed mb-4 sm:mb-4 text-sm sm:text-base transition-all ${expanded ? "":"line-clamp-3"}`}>
          {post.description}
        </p>
        
       {post.description.length > 120 && (
        <button
        onClick={()=>setExpanded(!expanded)}
           className="text-purple-600 text-sm mb-4 font-semibold hover:underline">
          {expanded ? "Read less" : "Read more"}
        </button>
       )}

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
            <Users className="w-5 h-5 text-purple-600 shrink-0" />
            <span className="text-sm font-bold text-purple-900 shrink-0">Seeking:</span>
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
      <div className="flex items-center justify-between border-t border-gray-200 pt-3 sm:pt-4 gap-2">
  {/* Stats */}
  <div className="flex items-center gap-2 sm:gap-6 text-gray-500">
    <button
      onClick={() => onVote(post.id)}
      className={`flex items-center gap-1 sm:gap-2 transition hover:scale-110 ${post.voted ? 'text-purple-600' : 'hover:text-purple-600'}`}
    >
      <ArrowUp className={`w-4 h-4 sm:w-5 sm:h-5 ${post.voted ? 'fill-current' : ''}`} />
      <span className="font-bold text-xs sm:text-base">{post.votes}</span>
    </button>

    <div className="flex items-center gap-1 sm:gap-2">
      <div className="p-1 sm:p-2 rounded-lg hover:bg-gray-100 transition">
        <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
      </div>
      <span className="text-xs font-semibold sm:text-base">{post.comments}</span>
    </div>

    <div className="flex items-center gap-1 sm:gap-2">
      <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
      <span className="text-xs sm:text-base font-semibold">{post.views}</span>
    </div>
  </div>

  {/* Actions */}
  <div className="flex items-center gap-1 sm:gap-2">
    <button
      onClick={() => onBookmark(post.id)}
      className={`p-1.5 sm:p-2.5 rounded-xl transition hover:scale-110 ${post.bookmarked
        ? 'bg-purple-100 text-purple-600'
        : 'hover:bg-gray-100 text-gray-400'
        }`}
    >
      <Bookmark className={`w-4 h-4 sm:w-5 sm:h-5 ${post.bookmarked ? 'fill-current' : ''}`} />
    </button>

    <button className="p-1.5 sm:p-2.5 hover:bg-gray-100 rounded-xl transition hover:scale-110 text-gray-400">
      <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
    </button>
    
    {variant === "feed"?(
    <button
      onClick={() => {
        setOpen(true);
        console.log("Clicked author:", post.author);
        setSelectedClerkUserId(post.app_user.clerkUserId);
      }}
      className="px-3 py-1.5 sm:px-5 sm:py-2.5 bg-linear-to-r from-purple-600 to-blue-600 text-white rounded-lg sm:rounded-xl font-bold hover:shadow-xl transition hover:scale-105 text-xs sm:text-base whitespace-nowrap">
      Collaborate
    </button>
  ):(
    <>
            <button
              onClick={() => setOpen(true)}
              className="px-3 py-1.5 sm:px-5 sm:py-2.5 bg-linear-to-r from-red-500 to-red-600 text-white rounded-lg sm:rounded-xl font-bold hover:shadow-xl transition hover:scale-105 text-xs sm:text-base whitespace-nowrap"
            >
              Delete
            </button>

          </>
          )}

          <BuildNetDialog
            open={open}
            variant={variant}
            onClose={() => setOpen(false)}
            onConfirm={variant==="feed"?handleSendRequest:()=>onDelete?.(post.id)}
          />
        </div>
      </div>
    </div>
  );
}