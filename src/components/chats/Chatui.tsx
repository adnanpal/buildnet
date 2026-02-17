// components/BuidlnetUserChat.tsx
// Change: reads location.state.preSelectedUserId on mount and auto-selects that user

import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';  // ← ADD
import {
  Send, Search, MoreVertical, Phone, Video,
  Paperclip, Smile, Menu, X, Lock,
} from 'lucide-react';
import useCheckConnection from '../../hooks/Usecheckconnection';
import useChat from '../../hooks/useChat';
import { connectSocket } from '../socket/socket';

type User = {
  id: string;         // clerkUserId
  name: string;
  status: 'online' | 'away' | 'offline';
  lastSeen: string | null;
  unread: number;
};

type Props = {
  currentUser: { clerkUserId: string; name: string };
  connectedUsers: User[];
};

export default function BuidlnetUserChat({ currentUser, connectedUsers }: Props) {
  const location = useLocation();  // ← ADD

  // ── Auto-select user passed from notifications page ──────────────────────
  const preSelectedId = (location.state as any)?.preSelectedUserId ?? null;

  const defaultUser =
    // prefer the pre-selected user if they exist in connectedUsers
    connectedUsers.find((u) => u.id === preSelectedId) ??
    (connectedUsers.length > 0 ? connectedUsers[0] : null);

  const [selectedUser, setSelectedUser] = useState<User | null>(defaultUser);
  const [searchQuery, setSearchQuery]   = useState('');
  const [inputValue, setInputValue]     = useState('');
  const [sidebarOpen, setSidebarOpen]   = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ── When connectedUsers list loads (async), re-apply pre-selection ───────
  useEffect(() => {
    if (!preSelectedId) return;
    const found = connectedUsers.find((u) => u.id === preSelectedId);
    if (found) setSelectedUser(found);
  }, [connectedUsers, preSelectedId]);

  // ── Connection guard ─────────────────────────────────────────────────────
  const { accepted: isConnected } = useCheckConnection(
    currentUser.clerkUserId,
    selectedUser?.id ?? null
  );

  // ── Real-time chat ───────────────────────────────────────────────────────
  const { messages, typingUser, chatError, sendMessage, emitTyping } = useChat({
    clerkUserId: currentUser.clerkUserId,
    senderName: currentUser.name,
    targetClerkUserId: selectedUser?.id ?? '',
    isConnected: isConnected === true,
  });

  useEffect(() => {
    connectSocket(currentUser.clerkUserId);
  }, [currentUser.clerkUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingUser]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    sendMessage(inputValue);
    setInputValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const formatTime = (date: Date | string) => {
    const d = new Date(date);
    const diff = Date.now() - d.getTime();
    const mins = Math.floor(diff / 60000);
    const hrs  = Math.floor(diff / 3600000);
    if (mins < 1)  return 'Just now';
    if (hrs  < 1)  return `${mins}m ago`;
    if (hrs  < 24) return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const statusColor = (s: string) =>
    s === 'online' ? 'bg-green-500' : s === 'away' ? 'bg-yellow-500' : 'bg-gray-400';

  const initials = (name: string) =>
    name.split(' ').map((n) => n[0]).join('').toUpperCase();

  const filtered = connectedUsers.filter((u) =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-linear-to-br from-white via-purple-50 to-pink-50 overflow-hidden">

      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <div className={`fixed md:relative w-72 sm:w-64 bg-linear-to-br from-purple-50 via-pink-50 to-white border-r border-purple-200 flex flex-col transition-all duration-300 z-40 h-full ${sidebarOpen ? 'left-0' : '-left-full md:left-0'}`}>

        <div className="p-3 sm:p-4 border-b border-purple-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-linear-to-br from-blue-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {initials(currentUser.name)}
              </div>
              <div className="hidden sm:block">
                <h1 className="text-base font-bold text-purple-900">Buildnet Chat</h1>
                <p className="text-xs text-purple-500">Messages</p>
              </div>
            </div>
            <button className="p-2 hover:bg-purple-100 rounded-lg md:hidden" onClick={() => setSidebarOpen(false)}>
              <X size={18} className="text-purple-600" />
            </button>
          </div>
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-purple-200 rounded-lg text-sm text-purple-900 placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {filtered.length === 0 && (
            <p className="text-xs text-purple-400 text-center py-8 px-4">
              No connections yet.
            </p>
          )}
          {filtered.map((u) => (
            <div
              key={u.id}
              onClick={() => { setSelectedUser(u); setSidebarOpen(false); }}
              className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer mb-1 transition-colors ${
                selectedUser?.id === u.id ? 'bg-purple-100 border border-purple-200' : 'hover:bg-purple-50'
              }`}
            >
              <div className="relative shrink-0">
                <div className="w-10 h-10 bg-linear-to-br from-blue-600 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                  {initials(u.name)}
                </div>
                <div className={`absolute bottom-0 right-0 w-3 h-3 ${statusColor(u.status)} rounded-full border-2 border-white`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-purple-900 truncate">{u.name}</p>
                  {u.unread > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 bg-linear-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full font-medium">
                      {u.unread}
                    </span>
                  )}
                </div>
                <p className="text-xs text-purple-500 truncate">
                  {u.status === 'online' ? 'Online' : u.lastSeen}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 border-t border-purple-200 flex items-center gap-3">
          <div className="relative">
            <div className="w-8 h-8 bg-linear-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
              {initials(currentUser.name)}
            </div>
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-purple-900">{currentUser.name}</p>
            <p className="text-xs text-purple-500">Online</p>
          </div>
        </div>
      </div>

      {/* ── Chat Area ────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Header */}
        <div className="h-14 sm:h-16 bg-white/80 border-b border-purple-200 backdrop-blur-sm flex items-center justify-between px-3 sm:px-6">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <button className="md:hidden p-2 hover:bg-purple-100 rounded-lg" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <X size={20} className="text-purple-600" /> : <Menu size={20} className="text-purple-600" />}
            </button>
            {selectedUser ? (
              <>
                <div className="relative shrink-0">
                  <div className="w-9 h-9 bg-linear-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                    {initials(selectedUser.name)}
                  </div>
                  <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 ${statusColor(selectedUser.status)} rounded-full border-2 border-white`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-base font-semibold text-purple-900 truncate">{selectedUser.name}</h2>
                  <p className="text-xs text-purple-500">
                    {isConnected === null ? 'Checking…' : isConnected ? 'Connected · can chat' : '⚠️ Not connected'}
                  </p>
                </div>
              </>
            ) : (
              <h2 className="text-base font-semibold text-purple-400">Select a conversation</h2>
            )}
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button className="p-2 hover:bg-purple-100 rounded-lg hidden sm:block"><Phone size={17} className="text-purple-600" /></button>
            <button className="p-2 hover:bg-purple-100 rounded-lg hidden sm:block"><Video size={17} className="text-purple-600" /></button>
            <button className="p-2 hover:bg-purple-100 rounded-lg"><MoreVertical size={17} className="text-purple-600" /></button>
          </div>
        </div>

        {sidebarOpen && <div className="fixed inset-0 bg-black/20 md:hidden z-30" onClick={() => setSidebarOpen(false)} />}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">

          {!selectedUser && (
            <div className="flex items-center justify-center h-full text-sm text-purple-300">
              Select a connection to start chatting
            </div>
          )}

          {selectedUser && isConnected === false && (
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center">
                <Lock size={24} className="text-purple-400" />
              </div>
              <p className="text-sm font-semibold text-purple-800">Chat Locked</p>
              <p className="text-xs text-purple-500 text-center max-w-xs">
                You can only chat with accepted connections.
              </p>
            </div>
          )}

          {selectedUser && isConnected === null && (
            <div className="flex items-center justify-center h-full">
              <div className="w-6 h-6 border-2 border-purple-300 border-t-purple-600 rounded-full animate-spin" />
            </div>
          )}

          {selectedUser && isConnected === true && (
            <>
              {messages.length === 0 && (
                <div className="flex items-center justify-center h-full">
                  <p className="text-xs text-purple-400">No messages yet. Say hello! 👋</p>
                </div>
              )}
              {messages.map((msg) => {
                const isMine = msg.senderId === currentUser.clerkUserId;
                return (
                  <div key={msg._id} className={`flex gap-3 ${isMine ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold text-white ${isMine ? 'bg-linear-to-br from-blue-600 to-pink-500' : 'bg-linear-to-br from-purple-500 to-pink-500'}`}>
                      {isMine ? initials(currentUser.name) : initials(msg.senderName)}
                    </div>
                    <div className={`flex flex-col gap-1 max-w-xs sm:max-w-sm md:max-w-md ${isMine ? 'items-end' : 'items-start'}`}>
                      <div className={`px-3 py-2 sm:px-4 sm:py-2.5 rounded-2xl text-sm ${isMine ? 'bg-linear-to-r from-purple-600 to-blue-600 text-white rounded-tr-sm' : 'bg-white text-purple-900 border border-purple-200 rounded-tl-sm'}`}>
                        <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                      </div>
                      <span className="text-xs text-purple-400 px-1">{formatTime(msg.timestamp)}</span>
                    </div>
                  </div>
                );
              })}

              {typingUser && (
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white bg-linear-to-br from-purple-500 to-pink-500">
                    {initials(typingUser)}
                  </div>
                  <div className="px-4 py-2.5 rounded-2xl rounded-tl-sm bg-white border border-purple-200">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {chatError && (
            <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-red-500 text-white text-xs px-4 py-2 rounded-full shadow-lg">
              {chatError}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-purple-200 bg-white/80 backdrop-blur-sm p-3 sm:p-4">
          <div className="max-w-4xl mx-auto">
            {isConnected === true ? (
              <div className="flex gap-2 items-end">
                <button className="p-2 hover:bg-purple-100 rounded-lg text-purple-600 shrink-0 hidden sm:block">
                  <Paperclip size={18} />
                </button>
                <textarea
                  value={inputValue}
                  onChange={(e) => { setInputValue(e.target.value); emitTyping(); }}
                  onKeyPress={handleKeyPress}
                  placeholder={`Message ${selectedUser?.name ?? ''}…`}
                  rows={1}
                  className="flex-1 px-4 py-2.5 bg-white border border-purple-200 rounded-xl text-sm text-purple-900 placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none min-h-11 max-h-32"
                  onInput={(e) => {
                    const t = e.target as HTMLTextAreaElement;
                    t.style.height = 'auto';
                    t.style.height = Math.min(t.scrollHeight, 128) + 'px';
                  }}
                />
                <button className="p-2 hover:bg-purple-100 rounded-lg text-purple-600 shrink-0 hidden sm:block">
                  <Smile size={18} />
                </button>
                <button
                  onClick={handleSend}
                  disabled={!inputValue.trim()}
                  className="px-4 py-2.5 bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white rounded-xl transition-all flex items-center justify-center shrink-0"
                >
                  <Send size={17} />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 py-2 text-xs text-purple-400">
                <Lock size={13} />
                {isConnected === false ? 'Connect with this user to chat' : 'Select a conversation'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}