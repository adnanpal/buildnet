import { CheckCircle, Users, ArrowUp, MessageSquare, Eye, Bookmark, Share2, Sparkles, Zap, Trash2, Edit3 } from "lucide-react";
type PostStatus = "seeking-collaborators" | "in-progress" | "launched";
import BuildNetDialog from "../modals/BuildNetDialog";
import { useState } from "react";
import api from "../../api/axios";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

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
  documentId: string;
  author: {
    id: number;
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
  onVote: (documentId: string) => void;
  onBookmark: (postId: number) => void;
  variant?: "feed" | "my-projects";
  onDelete?: (documentId: string) => void;
}

export function PostCard({ post, onVote, onDelete, onBookmark, variant = "feed" }: PostCardProps) {
  const [open, setOpen] = useState(false);
  const [selectedClerkUserId, setSelectedClerkUserId] = useState<string | null>(null);
  const { user } = useUser();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const handleSendRequest = async () => {
    try {
      const fromClerkUserId = user?.id;

      if (!fromClerkUserId || !selectedClerkUserId) {
        alert("Missing user information");
        return;
      }
      if (!post.app_user?.clerkUserId) {
        alert("This user is not linked to an account yet");
        return;
      }
      if (fromClerkUserId === selectedClerkUserId) {
        toast.error("You cannot send request to yourself");
        return;
      }

      const fromRes = await api.get(`/api/app-users?filters[clerkUserId][$eq]=${fromClerkUserId}`);
      const fromUser = fromRes.data.data[0];
      if (!fromUser) throw new Error("From user not found");

      const toRes = await api.get(`/api/app-users?filters[clerkUserId][$eq]=${selectedClerkUserId}`);
      const toUser = toRes.data.data[0];
      if (!toUser) throw new Error("Target user not found");

      const existingRequestRes = await api.get(
        `/api/connection-requests?filters[$or][0][fromUser][$eq]=${fromUser.id}&filters[$or][0][toUser][$eq]=${toUser.id}&filters[$or][1][fromUser][$eq]=${toUser.id}&filters[$or][1][toUser][$eq]=${fromUser.id}`
      );

      if (existingRequestRes.data.data && existingRequestRes.data.data.length > 0) {
        const existingRequest = existingRequestRes.data.data[0];
        const status = existingRequest.attributes?.connectionStatus || existingRequest.connectionStatus;

        if (status === "accepted") {
          toast.info("You are already connected with this user");
          setOpen(false);
          return;
        } else if (status === "pending") {
          toast.info("Connection request is already pending");
          setOpen(false);
          return;
        } else if (status === "rejected") {
          toast.error("Your previous connection request was rejected");
          try {
            const documentId = existingRequest.documentId ?? existingRequest.id;
            await api.put(`/api/connection-requests/${documentId}`, {
              data: { connectionStatus: "pending" },
            });
            toast.success("Request sent again. Waiting for response...");
          } catch (resendErr) {
            console.error("Failed to resend request", resendErr);
            toast.error("Failed to resend request. Please try again.");
          }
          setOpen(false);
          return;
        }
        return;
      }

      await api.post("/api/connection-requests", {
        data: { fromUser: fromUser.id, toUser: toUser.id, connectionStatus: "pending" },
      });

      toast.success("Connection request sent");
      setOpen(false);
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    }
  };

  const statusConfig = {
    "seeking-collaborators": {
      badgeClass: "bg-emerald-500 text-white",
      seekingBg: "bg-emerald-50 border-emerald-200",
      seekingText: "text-emerald-700",
      seekingPill: "bg-white border-emerald-200 text-emerald-700",
      text: "Seeking Collaborators",
      icon: <Users className="w-3.5 h-3.5" />,
    },
    "in-progress": {
      badgeClass: "bg-blue-500 text-white",
      seekingBg: "bg-blue-50 border-blue-200",
      seekingText: "text-blue-700",
      seekingPill: "bg-white border-blue-200 text-blue-700",
      text: "In Progress",
      icon: <Zap className="w-3.5 h-3.5" />,
    },
    launched: {
      badgeClass: "bg-purple-500 text-white",
      seekingBg: "bg-purple-50 border-purple-200",
      seekingText: "text-purple-700",
      seekingPill: "bg-white border-purple-200 text-purple-700",
      text: "Launched",
      icon: <Sparkles className="w-3.5 h-3.5" />,
    },
  };

  const config = statusConfig[post.status];

  return (
    <article className="hover-lift bg-white rounded-2xl border border-gray-200 overflow-hidden mb-4">
      <div className="p-4 sm:p-6">

        {/* Author Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div
            onClick={() => {
              const clerkId = post.app_user?.clerkUserId;
              if (clerkId) navigate(`/user/${clerkId}`);
            }}
            className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer group"
          >
            <div className="relative shrink-0">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-linear-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold text-base sm:text-lg">
                {post.author?.avatar ?? "?"}
              </div>
              {post.author?.verified && (
                <div className="absolute -bottom-0.5 -right-0.5 bg-white rounded-full p-0.5">
                  <CheckCircle className="w-3.5 h-3.5 text-blue-500 fill-current" />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-gray-900 truncate text-sm sm:text-base group-hover:text-purple-600 transition-colors">
                {post.author?.name ?? "Anonymous"}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 truncate">{post.author.title}</p>
            </div>
          </div>

          {/* Status Badge */}
          <span className={`${config.badgeClass} shrink-0 px-2.5 sm:px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-medium`}>
            {config.icon}
            <span className="hidden sm:inline">{config.text}</span>
          </span>
        </div>

        {/* Title */}
        <h2
          onClick={() => {
            const clerkId = post.app_user?.clerkUserId;
            if (clerkId) navigate(`/user/${clerkId}`);
          }}
          className="text-lg sm:text-xl font-bold text-gray-900 mb-2 hover:text-purple-600 cursor-pointer transition-colors leading-snug"
        >
          {post.title}
        </h2>

        {/* Description */}
        <p className={`text-gray-600 text-sm sm:text-base leading-relaxed mb-3 ${expanded ? "" : "line-clamp-3"}`}>
          {post.description}
        </p>

        {post.description.length > 120 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-purple-600 text-sm font-medium hover:text-purple-700 mb-4 inline-flex items-center gap-1"
          >
            {expanded ? "Show less ↑" : "Read more ↓"}
          </button>
        )}

        {/* Tags */}
        {variant === "feed" && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-lg hover:bg-purple-50 hover:text-purple-700 transition-colors cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Seeking Section */}
        {variant === "feed" && post.seeking.length > 0 && (
          <div className={`${config.seekingBg} border rounded-xl p-3 sm:p-4`}>
            <div className="flex items-start gap-2.5">
              <Users className={`w-4 h-4 sm:w-5 sm:h-5 ${config.seekingText} shrink-0 mt-0.5`} />
              <div className="min-w-0 flex-1">
                <span className={`text-xs sm:text-sm font-semibold ${config.seekingText} block mb-2`}>
                  Looking for:
                </span>
                <div className="flex flex-wrap gap-2">
                  {post.seeking.map((role, index) => (
                    <span
                      key={index}
                      className={`${config.seekingPill} border text-xs font-medium px-2.5 py-1 rounded-md`}
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer: Stats + Actions */}
      <div className="border-t border-gray-100 bg-gray-50/60 px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-2">

          {/* Stats */}
          {variant === "feed" && (
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => onVote(post.documentId)}
                className={`flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                  post.voted
                    ? "bg-purple-100 text-purple-700"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                }`}
              >
                <ArrowUp className={`w-4 h-4 ${post.voted ? "fill-current" : ""}`} />
                <span>{post.votes}</span>
              </button>

              <div className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 text-gray-500 text-sm">
                <MessageSquare className="w-4 h-4" />
                <span className="font-semibold hidden sm:inline">{post.comments}</span>
              </div>

              <div className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 text-gray-500 text-sm">
                <Eye className="w-4 h-4" />
                <span className="font-semibold hidden sm:inline">{post.views}</span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => onBookmark(post.id)}
              title={post.bookmarked ? "Remove bookmark" : "Bookmark"}
              className={`p-2 sm:p-2.5 rounded-lg transition-all ${
                post.bookmarked
                  ? "bg-purple-100 text-purple-600"
                  : "text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              }`}
            >
              <Bookmark className={`w-4 h-4 sm:w-5 sm:h-5 ${post.bookmarked ? "fill-current" : ""}`} />
            </button>

            <button
              title="Share"
              className="p-2 sm:p-2.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-lg transition-all"
            >
              <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {variant === "feed" ? (
              <button
                onClick={() => {
                  setOpen(true);
                  setSelectedClerkUserId(post.app_user.clerkUserId);
                }}
                className="px-4 sm:px-5 py-2 sm:py-2.5 bg-linear-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all shadow-sm hover:shadow-md text-sm whitespace-nowrap"
              >
                Collaborate
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate("/create", { state: { editingPost: post } })}
                  className="flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-all text-sm"
                >
                  <Edit3 className="w-4 h-4" />
                  <span className="hidden sm:inline">Edit</span>
                </button>
                <button
                  onClick={() => setOpen(true)}
                  className="flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-all text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Delete</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <BuildNetDialog
        open={open}
        variant={variant}
        onClose={() => setOpen(false)}
        onConfirm={
          variant === "feed"
            ? handleSendRequest
            : () => { onDelete?.(post.documentId); setOpen(false); }
        }
      />
    </article>
  );
}