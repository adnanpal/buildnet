import { useUser } from "@clerk/clerk-react";
import useConnectionRequests from "../../hooks/useConnectionRequest";
import NotificationCard from "../Feed/Notifications";
import api from "../../api/axios";

export default function FollowRequestNotifications(){

    const {user} = useUser();
    const clerkUserId = user?.id??null;

    const {requests,loading,setRequests} = useConnectionRequests(clerkUserId);


    const handleAccept = async (id: number)=>{
        await api.put(`/api/connection-requests/${id}`,{
            data: {connectionStatus: "accepted"},
        });

        setRequests(prev=>prev.filter(r=>r.id!==id));
    };

    const handleReject = async(id: number)=>{
        await api.put(`/api/connection-requests/${id}`,{
            data:{connectionStatus:"rejected"},
        });

         setRequests(prev => prev.filter(r => r.id !== id));
    };
    
   if (loading) return <p className="text-center py-10">Loading...</p>;
   if (requests.length === 0) {
    return (
      <p className="text-center py-10 text-gray-500">
        No pending follow requests
      </p>
    );
  }
   return (
    <div className="max-w-4xl mx-auto py-8 space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">
        Follow Requests
      </h1>

      {requests.map(req => (
        <NotificationCard
          key={req.id}
          request={{
            id: req.id,
            name: req.sender.name,
            avatar: req.sender.avatar,
          }}
          onAccept={handleAccept}
          onReject={handleReject}
        />
      ))}
    </div>
  );
}
