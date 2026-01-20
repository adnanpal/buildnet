import { useState } from "react";

type Props = {
  request: {
    id: number;
    name: string;
    avatar?: string;
  };
  onAccept: (id: number) => void;
  onReject: (id: number) => void;
};

export default function NotificationCard({
  request,
  onAccept,
  onReject,
}: Props) {
  const [isProcessing, setIsProcessing] = useState(false);

  const initials = request.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleAccept = async () => {
    setIsProcessing(true);
    await onAccept(request.id);
    setIsProcessing(false);
  };

  const handleReject = async () => {
    setIsProcessing(true);
    await onReject(request.id);
    setIsProcessing(false);
  };

  return (
    <div className="container mx-auto mt-6 h-auto  bg-white gradient-border glassmorphism rounded-2xl 
border-t-2 border-purple-500 shadow-purple-500/10 shadow-xl sm:h-20 lg:h-24 
    flex items-center left-0 right-0  px-3 sm:px-4 py-3 sm:py-0">

      
      <div className="ml-0 sm:ml-2 lg:ml-4 w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 
      rounded-full bg-linear-to-r from-purple-500 to-pink-500 
      flex items-center justify-center shrink-0">
        <p className="font-semibold text-white text-xs sm:text-sm lg:text-base">
          {request.avatar ?? initials}
        </p>
      </div>

      
      <div className="font-semibold text-gray-700 ml-3 sm:ml-4 lg:ml-7 flex-1 min-w-0">
        <p className="text-xs sm:text-sm lg:text-base truncate sm:whitespace-normal">
          {request.name} has sent you a following request
        </p>
      </div>

    
      <div className="ml-2 sm:ml-6 lg:ml-10 flex gap-2 sm:gap-3 lg:gap-4 shrink-0">
        <button
          onClick={handleReject}
          disabled={isProcessing}
          className="px-3 sm:px-4 lg:px-6 h-8 sm:h-9 lg:h-10 
          rounded-lg sm:rounded-xl bg-white text-gray-500 font-semibold 
          border border-slate-300 hover:bg-slate-50 transition 
          disabled:opacity-50 disabled:cursor-not-allowed 
          text-xs sm:text-sm lg:text-base"
        >
          Reject
        </button>

        <button
          onClick={handleAccept}
          disabled={isProcessing}
          className="px-3 sm:px-4 lg:px-6 h-8 sm:h-9 lg:h-10 
          rounded-lg sm:rounded-xl bg-linear-to-r 
          from-purple-500 to-pink-500 text-white font-semibold 
          shadow-md hover:opacity-90 transition 
          disabled:opacity-50 disabled:cursor-not-allowed 
          text-xs sm:text-sm lg:text-base"
        >
          Accept
        </button>
      </div>
    </div>
  );
}
