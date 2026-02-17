import { useState } from "react";
import { UserPlus, Check, X, Loader2 } from "lucide-react";

type Props = {
  request: {
    id: string;
    name: string;
    avatar?: string;
    senderClerkUserId: string;
  };
  onAccept: (id: string, senderClerkUserId: string) => void;
  onReject: (id: string) => void;
};

export default function NotificationCard({ request, onAccept, onReject }: Props) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [action, setAction] = useState<"accept" | "reject" | null>(null);

  const initials = request.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleAccept = async () => {
    setIsProcessing(true);
    setAction("accept");
    await onAccept(request.id, request.senderClerkUserId);
    setIsProcessing(false);
  };

  const handleReject = async () => {
    setIsProcessing(true);
    setAction("reject");
    await onReject(request.id);
    setIsProcessing(false);
  };

  return (
    <div className="hover-lift bg-white rounded-2xl border border-gray-200 px-4 sm:px-5 py-4 flex items-center gap-4">

      {/* Avatar */}
      <div className="relative shrink-0">
        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-linear-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-sm">
          <span className="font-bold text-white text-sm sm:text-base">
            {request.avatar ?? initials}
          </span>
        </div>
        {/* Connection icon badge */}
        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100">
          <UserPlus className="w-3 h-3 text-purple-600" />
        </div>
      </div>

      {/* Message */}
      <div className="flex-1 min-w-0">
        <p className="text-sm sm:text-base text-gray-800 leading-snug">
          <span className="font-bold">{request.name}</span>
          <span className="text-gray-500 font-normal"> sent you a connection request</span>
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Reject */}
        <button
          onClick={handleReject}
          disabled={isProcessing}
          title="Decline"
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl border-2 border-gray-200 bg-white text-gray-400 hover:border-red-200 hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isProcessing && action === "reject" ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <X className="w-4 h-4" />
          )}
        </button>

        {/* Accept */}
        <button
          onClick={handleAccept}
          disabled={isProcessing}
          title="Accept"
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-linear-to-br from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 flex items-center justify-center shadow-sm hover:shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isProcessing && action === "accept" ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Check className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
}