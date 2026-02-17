import { useUser } from "@clerk/clerk-react";
import useConnectionRequests from "../../hooks/useConnectionRequest";
import NotificationCard from "../Feed/Notifications";
import api from "../../api/axios";
import { toast } from "react-toastify";
import { Bell, Users } from "lucide-react";
import FeedNavbar from "../Feed/FeedNavbar";

export default function FollowRequestNotifications() {
  const { user } = useUser();
  const clerkUserId = user?.id ?? null;
  const { requests, loading, setRequests } = useConnectionRequests(clerkUserId);

  const handleAccept = async (id: string) => {
    try {
      const res = await api.put(`/api/connection-requests/${id}`, {
        data: { connectionStatus: "accepted" },
      });
      if (res && (res.status === 200 || res.status === 204)) {
        setRequests(prev => prev.filter(r => r.id !== id));
        toast.success("Connection request accepted");
      } else {
        toast.error("Failed to accept request");
      }
    } catch (err) {
      console.error("Failed to accept request", err);
      toast.error("Failed to accept request");
    }
  };

  const handleReject = async (id: string) => {
    try {
      const res = await api.put(`/api/connection-requests/${id}`, {
        data: { connectionStatus: "rejected" },
      });
      if (res && (res.status === 200 || res.status === 204)) {
        setRequests(prev => prev.filter(r => r.id !== id));
        toast.info("Connection request declined");
      } else {
        toast.error("Failed to reject request");
      }
    } catch (err) {
      console.error("Failed to reject request", err);
      toast.error("Failed to reject request");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-white to-blue-50">
      <FeedNavbar />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

        {/* Page header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-purple-100 rounded-2xl flex items-center justify-center">
            <Bell className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 leading-tight">Notifications</h1>
            <p className="text-sm text-gray-500">Manage your connection requests</p>
          </div>
          {!loading && requests.length > 0 && (
            <span className="ml-auto px-2.5 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-lg">
              {requests.length} pending
            </span>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative w-12 h-12 mb-4">
              <div className="absolute inset-0 rounded-full border-4 border-purple-100" />
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-600 animate-spin" />
            </div>
            <p className="text-sm font-medium text-gray-600">Loading requests…</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && requests.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 py-16 px-6 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-1">No pending requests</h3>
            <p className="text-sm text-gray-500">When someone sends you a connection request, it'll show up here.</p>
          </div>
        )}

        {/* Request list */}
        {!loading && requests.length > 0 && (
          <div className="animate-slide-up space-y-3">
            {requests.map(req => (
              <NotificationCard
                key={req.id}
                request={{
                  id: req.id as string,
                  name: req.sender.name,
                  avatar: req.sender.avatar,
                }}
                onAccept={handleAccept}
                onReject={handleReject}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}