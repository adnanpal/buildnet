import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Send, Search, MoreVertical, Phone, Video,
  Paperclip, Smile, Menu, X, Lock, MessageSquare,
} from 'lucide-react';
import useCheckConnection from '../../hooks/Usecheckconnection';
import useChat from '../../hooks/useChat';

type User = {
  id: string;
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
  const location = useLocation();

  const preSelectedId = (location.state as any)?.preSelectedUserId ?? null;
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedUser = connectedUsers.find(
    (u) => u.id === selectedUserId
  ) ?? null;


  useEffect(() => {
    if (!connectedUsers.length) return;

    if (selectedUserId) {
      const exists = connectedUsers.find(u => u.id === selectedUserId);
      if (!exists) {
        setSelectedUserId(null);
      }
      return;
    }

    if (preSelectedId) {
      const found = connectedUsers.find(u => u.id === preSelectedId);
      if (found) setSelectedUserId(found.id);
      return;
    }

    setSelectedUserId(connectedUsers[0].id);
  }, [connectedUsers]);



  const { accepted: isConnected } = useCheckConnection(
    currentUser.clerkUserId,
    selectedUserId
  );

  const { messages, typingUser, chatError, sendMessage, emitTyping } = useChat({
    clerkUserId: currentUser.clerkUserId,
    senderName: currentUser.name,
    targetClerkUserId: selectedUser?.id ?? '',
    isConnected: isConnected === true,
  });

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
    const hrs = Math.floor(diff / 3600000);
    if (mins < 1) return 'Just now';
    if (hrs < 1) return `${mins}m ago`;
    if (hrs < 24) return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const statusColor = (s: string) =>
    s === 'online' ? 'bg-emerald-400' : s === 'away' ? 'bg-amber-400' : 'bg-slate-300';

  const initials = (name: string) =>
    name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  const filtered = connectedUsers.filter((u) =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase())
  );



  return (
    /*
      KEY FIX: Use h-full instead of h-screen so this component fills
      only the space below the navbar (parent layout must be: 
        <div className="flex flex-col h-screen">
          <Navbar />   ← fixed height
          <main className="flex-1 overflow-hidden"> ← this component goes here
            <BuidlnetUserChat />
          </main>
        </div>
    */
    <div className="relative flex h-full bg-slate-50 overflow-hidden font-sans">

      {/* ── Mobile overlay ─────────────────────────────────────────────── */}
      {sidebarOpen && (
        <div
          className="absolute inset-0 bg-black/40 md:hidden z-10"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      {/*
        On mobile: fixed, starts at top of THIS container (not viewport top),
        so it won't overlap the navbar. We rely on the parent wrapping this
        component with overflow-hidden so the sidebar clips correctly.
        On md+: relative, part of normal flow.
      */}
      <aside
        className={`
          absolute md:relative inset-y-0 left-0
          w-72 bg-white border-r border-slate-200
          flex flex-col z-20
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Sidebar header */}
        <div className="px-4 py-3 border-b border-slate-100 shrink-0">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-slate-800">Chats</h2>
            <button
              className="md:hidden p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={16} />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search conversations…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto py-2 px-2">
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-center px-4">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                <MessageSquare size={18} className="text-slate-400" />
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {searchQuery ? 'No results found' : 'No connections yet'}
              </p>
            </div>
          )}

          {filtered.map((u) => (
            <button
              key={u.id}
              onClick={() => { setSelectedUserId(u.id); setSidebarOpen(false); }}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5 text-left
                transition-all duration-150 group
                ${selectedUser?.id === u.id
                  ? 'bg-violet-50 ring-1 ring-violet-200'
                  : 'hover:bg-slate-50'
                }
              `}
            >
              <div className="relative shrink-0">
                <div className={`
                  w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-semibold shadow-sm
                  ${selectedUser?.id === u.id
                    ? 'bg-linear-to-br from-violet-500 to-fuchsia-500'
                    : 'bg-linear-to-br from-slate-400 to-slate-500'
                  }
                `}>
                  {initials(u.name)}
                </div>
                <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 ${statusColor(u.status)} rounded-full border-2 border-white`} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <p className={`text-sm font-medium truncate ${selectedUser?.id === u.id ? 'text-violet-900' : 'text-slate-700'}`}>
                    {u.name}
                  </p>
                  {u.unread > 0 && (
                    <span className="shrink-0 min-w-[18px] h-[18px] px-1 bg-violet-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {u.unread}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 truncate mt-0.5">
                  {u.status === 'online' ? (
                    <span className="text-emerald-500 font-medium">Online</span>
                  ) : u.lastSeen ? (
                    formatTime(u.lastSeen)
                  ) : (
                    "Offline"
                  )}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Current user footer */}
        <div className="px-4 py-3 border-t border-slate-100 shrink-0 flex items-center gap-3">
          <div className="relative shrink-0">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-xs font-semibold">
              {initials(currentUser.name)}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-700 truncate">{currentUser.name}</p>
            <p className="text-[10px] text-emerald-500 font-medium">Active now</p>
          </div>
        </div>
      </aside>

      {/* ── Chat Area ────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0">

        {/* Chat header */}
        <header className="shrink-0 h-[60px] bg-white border-b border-slate-200 flex items-center justify-between px-4 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors shrink-0"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu size={18} />
            </button>

            {selectedUser ? (
              <>
                <div className="relative shrink-0">
                  <div className="w-9 h-9 rounded-xl bg-linear-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-xs font-semibold shadow-sm">
                    {initials(selectedUser.name)}
                  </div>
                  <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 ${statusColor(selectedUser.status)} rounded-full border-2 border-white`} />
                </div>
                <div className="min-w-0">
                  <h2 className="text-sm font-semibold text-slate-800 truncate">{selectedUser.name}</h2>
                  <p className="text-xs text-slate-400 truncate">
                    {isConnected === null
                      ? 'Checking connection…'
                      : isConnected
                        ? selectedUser.status === 'online' ? 'Online · can message' : selectedUser.lastSeen
                          ? `Last Seen ${formatTime(selectedUser.lastSeen)}`
                          : "Offline"
                        : '⚠️ Not connected'}
                  </p>
                </div>
              </>
            ) : (
              <h2 className="text-sm font-medium text-slate-400">Select a conversation</h2>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors hidden sm:flex">
              <Phone size={16} />
            </button>
            <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors hidden sm:flex">
              <Video size={16} />
            </button>
            <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
              <MoreVertical size={16} />
            </button>
          </div>
        </header>

        {/* Messages — the ONLY scrollable region */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="max-w-3xl mx-auto px-4 py-4 sm:px-6 sm:py-6 flex flex-col gap-3">

            {!selectedUser && (
              <div className="flex flex-col items-center justify-center h-64 gap-4 text-center">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
                  <MessageSquare size={24} className="text-slate-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">No conversation selected</p>
                  <p className="text-xs text-slate-400 mt-1">Pick someone from the sidebar to start chatting</p>
                </div>
              </div>
            )}

            {selectedUser && isConnected === false && (
              <div className="flex flex-col items-center justify-center h-64 gap-4 text-center">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
                  <Lock size={22} className="text-slate-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700">Chat locked</p>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs">
                    You can only message accepted connections. Send a connection request to unlock.
                  </p>
                </div>
              </div>
            )}

            {selectedUser && isConnected === null && (
              <div className="flex items-center justify-center h-32">
                <div className="w-6 h-6 border-2 border-slate-200 border-t-violet-500 rounded-full animate-spin" />
              </div>
            )}

            {selectedUser && isConnected === true && (
              <>
                {messages.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-48 gap-3 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-violet-100 to-fuchsia-100 flex items-center justify-center text-lg">
                      👋
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-600">No messages yet</p>
                      <p className="text-xs text-slate-400 mt-1">Say hello to {selectedUser.name}!</p>
                    </div>
                  </div>
                )}

                {messages.map((msg) => {
                  const isMine = msg.senderId === currentUser.clerkUserId;
                  return (
                    <div key={msg._id} className={`flex gap-2 sm:gap-3 w-full ${isMine ? 'flex-row-reverse' : 'flex-row'}`}>
                      {/* Avatar */}
                      <div className={`
                        w-7 h-7 rounded-lg flex items-center justify-center shrink-0 self-end
                        text-[10px] font-bold text-white shadow-sm
                        ${isMine
                          ? 'bg-linear-to-br from-violet-500 to-fuchsia-500'
                          : 'bg-linear-to-br from-slate-500 to-slate-600'
                        }
                      `}>
                        {isMine ? initials(currentUser.name) : initials(msg.senderName)}
                      </div>

                      {/* Bubble */}
                      <div className={`flex flex-col gap-1 min-w-0 max-w-[70%] sm:max-w-[60%] ${isMine ? 'items-end' : 'items-start'}`}>
                        <div className={`
                          px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed w-full
                          ${isMine
                            ? 'bg-linear-to-br from-violet-500 to-fuchsia-500 text-white rounded-br-sm shadow-sm shadow-violet-200'
                            : 'bg-white text-slate-700 border border-slate-200 rounded-bl-sm shadow-sm'
                          }
                        `}>
                          <p className="whitespace-pre-wrap wrap-break-word overflow-wrap-anywhere" style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>{msg.text}</p>
                        </div>
                        <span className="text-[10px] text-slate-400 px-1">{formatTime(msg.timestamp)}</span>
                      </div>
                    </div>
                  );
                })}

                {/* Typing indicator */}
                {typingUser && (
                  <div className="flex gap-2 sm:gap-3 items-end">
                    <div className="w-7 h-7 rounded-lg bg-linear-to-br from-slate-500 to-slate-600 flex items-center justify-center shrink-0 text-[10px] font-bold text-white shadow-sm">
                      {initials(typingUser)}
                    </div>
                    <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-white border border-slate-200 shadow-sm">
                      <div className="flex gap-1 items-center">
                        {[0, 0.15, 0.3].map((delay, i) => (
                          <div
                            key={i}
                            className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"
                            style={{ animationDelay: `${delay}s` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Error toast */}
        {chatError && (
          <div className="shrink-0 mx-4 mb-2">
            <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-4 py-2 rounded-lg text-center">
              {chatError}
            </div>
          </div>
        )}

        {/* Input bar */}
        <div className="shrink-0 border-t border-slate-200 bg-white px-4 py-3">
          <div className="max-w-3xl mx-auto">
            {isConnected === true ? (
              <div className="flex items-end gap-2">
                <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 shrink-0 transition-colors hidden sm:flex">
                  <Paperclip size={17} />
                </button>

                <div className="flex-1 relative">
                  <textarea
                    value={inputValue}
                    onChange={(e) => { setInputValue(e.target.value); emitTyping(); }}
                    onKeyPress={handleKeyPress}
                    placeholder={`Message ${selectedUser?.name ?? ''}…`}
                    rows={1}
                    className="
                      w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl
                      text-sm text-slate-800 placeholder-slate-400
                      focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent focus:bg-white
                      resize-none min-h-[42px] max-h-32 transition-all leading-relaxed
                    "
                    onInput={(e) => {
                      const t = e.target as HTMLTextAreaElement;
                      t.style.height = 'auto';
                      t.style.height = Math.min(t.scrollHeight, 128) + 'px';
                    }}
                  />
                </div>

                <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 shrink-0 transition-colors hidden sm:flex">
                  <Smile size={17} />
                </button>

                <button
                  onClick={handleSend}
                  disabled={!inputValue.trim()}
                  className="
                    p-2.5 rounded-xl shrink-0 transition-all
                    bg-linear-to-br from-violet-500 to-fuchsia-500
                    hover:from-violet-600 hover:to-fuchsia-600
                    disabled:from-slate-200 disabled:to-slate-200 disabled:cursor-not-allowed
                    text-white disabled:text-slate-400
                    shadow-sm hover:shadow-md hover:shadow-violet-200 disabled:shadow-none
                    flex items-center justify-center
                  "
                >
                  <Send size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 py-2.5 text-xs text-slate-400">
                <Lock size={12} />
                {isConnected === false
                  ? 'Connect with this user to chat'
                  : 'Select a conversation to start messaging'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}