import { useState, useRef, useEffect } from 'react';
import { Send, Search, MoreVertical, Phone, Video, Paperclip, Smile, Menu, X } from 'lucide-react';

export default function BuidlnetUserChat() {
  // Mock current user
  const [currentUser] = useState({
    id: 1,
    name: 'You',
    avatar: null,
    status: 'online'
  });

  // Mock users list
  const [users] = useState([
    { id: 2, name: 'Sarah Chen', status: 'online', lastSeen: null, unread: 3 },
    { id: 3, name: 'Mike Johnson', status: 'online', lastSeen: null, unread: 0 },
    { id: 4, name: 'Emma Wilson', status: 'away', lastSeen: '5m ago', unread: 1 },
    { id: 5, name: 'Alex Rodriguez', status: 'offline', lastSeen: '2h ago', unread: 0 },
    { id: 6, name: 'Jessica Lee', status: 'online', lastSeen: null, unread: 0 },
    { id: 7, name: 'David Kim', status: 'offline', lastSeen: '1d ago', unread: 0 },
  ]);

  const [selectedUser, setSelectedUser] = useState(users[0]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock messages for the selected conversation
  const [conversations, setConversations] = useState({
    2: [
      { id: 1, senderId: 2, content: 'Hey! How are you?', timestamp: new Date(Date.now() - 3600000) },
      { id: 2, senderId: 1, content: 'Hi Sarah! I\'m doing great, thanks! How about you?', timestamp: new Date(Date.now() - 3500000) },
      { id: 3, senderId: 2, content: 'Pretty good! Working on that new project we discussed.', timestamp: new Date(Date.now() - 3400000) },
      { id: 4, senderId: 2, content: 'Would love to get your feedback when you have time.', timestamp: new Date(Date.now() - 300000) },
    ],
    3: [
      { id: 1, senderId: 3, content: 'Meeting at 3pm today?', timestamp: new Date(Date.now() - 7200000) },
      { id: 2, senderId: 1, content: 'Yes, confirmed!', timestamp: new Date(Date.now() - 7100000) },
    ],
    4: [
      { id: 1, senderId: 4, content: 'Check out this design!', timestamp: new Date(Date.now() - 1800000) },
    ],
    5: [],
    6: [],
    7: [],
  });

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversations, selectedUser]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const newMessage = {
      id: (conversations[selectedUser.id as keyof typeof conversations]?.length || 0) + 1,
      senderId: currentUser.id,
      content: inputValue,
      timestamp: new Date()
    };

    setConversations(prev => ({
      ...prev,
      [selectedUser.id]: [...(prev[selectedUser.id as keyof typeof prev] || []), newMessage]
    }));
    
    setInputValue('');

    // Simulate typing indicator and response
    setIsTyping(true);
    setTimeout(() => {
      const response = {
        id: (conversations[selectedUser.id as keyof typeof conversations]?.length || 0) + 2,
        senderId: selectedUser.id,
        content: `Hello,This interface is develop by Adnan Pal,Realtime Chat is still in Development and It Will Be Launched Soon,This is Automated Message ${selectedUser.name}.`,
        timestamp: new Date()
      };
      setConversations(prev => ({
        ...prev,
        [selectedUser.id]: [...(prev[selectedUser.id as keyof typeof prev] || []), response]
      }));
      setIsTyping(false);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    
    if (hours < 1) {
      const minutes = Math.floor(diff / 60000);
      return minutes < 1 ? 'Just now' : `${minutes}m ago`;
    } else if (hours < 24) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      default: return 'bg-gray-400';
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentMessages = conversations[selectedUser.id as keyof typeof conversations] || [];

  return (
    <div className="flex h-screen bg-linear-to-br from-white via-purple-50 to-pink-50 overflow-hidden">
    
      {/* Sidebar */}
      <div className={`fixed md:relative w-72 sm:w-64 bg-linear-to-br from-purple-50 via-pink-50 to-white border-r border-purple-200 flex flex-col transition-all duration-300 z-40 h-full ${sidebarOpen ? 'left-0' : '-left-full md:left-0'}`}>
        {/* Sidebar Header */}
        <div className="p-3 sm:p-4 border-b border-purple-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-linear-to-br from-blue-500 to-pink-500 rounded-full flex items-center justify-center font-bold text-white text-sm">
                {currentUser.name.charAt(0)}
              </div>
              <div className="hidden sm:block">
                <h1 className="text-base sm:text-lg font-bold text-purple-900">Buildnet Chat</h1>
                <p className="text-xs text-purple-600">Messages</p>
              </div>
            </div>
            <button className="p-2 hover:bg-purple-100 rounded-lg transition-colors" onClick={() => setSidebarOpen(false)}>
              <MoreVertical size={16} className="text-purple-600 sm:hidden" />
              <MoreVertical size={18} className="text-purple-600 hidden sm:block" />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 sm:py-2 bg-white border border-purple-200 rounded-lg text-purple-900 placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs sm:text-sm"
            />
          </div>
        </div>

        {/* Users List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-1 sm:p-2">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                onClick={() => { setSelectedUser(user); setSidebarOpen(false); }}
                className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg cursor-pointer transition-colors mb-1 text-sm ${
                  selectedUser.id === user.id
                    ? 'bg-purple-100 border border-purple-200'
                    : 'hover:bg-purple-50'
                }`}
              >
                <div className="relative">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-br from-blue-600  to-pink-500 rounded-full flex items-center justify-center font-bold text-white text-xs sm:text-sm">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className={`absolute bottom-0 right-0 w-3 h-3 sm:w-3.5 sm:h-3.5 ${getStatusColor(user.status)} rounded-full border-2 border-white`}></div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs sm:text-sm font-medium text-purple-900 truncate">{user.name}</p>
                    {user.unread > 0 && (
                      <span className="ml-1 sm:ml-2 px-1.5 sm:px-2 py-0.5 bg-linear-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full font-medium">
                        {user.unread}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-purple-600 truncate hidden sm:block">
                    {user.status === 'online' ? 'Online' : user.lastSeen}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Current User Footer */}
        <div className="p-3 sm:p-4 border-t border-purple-200">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-linear-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center font-bold text-white text-xs sm:text-sm">
                {currentUser.name.charAt(0)}
              </div>
              <div className="absolute bottom-0 right-0 w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div className="flex-1 hidden sm:block">
              <p className="text-sm font-medium text-purple-900">{currentUser.name}</p>
              <p className="text-xs text-purple-600">Online</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="h-14 sm:h-16 bg-white/80 border-b border-purple-200 backdrop-blur-sm flex items-center justify-between px-3 sm:px-6">
          <div className="flex items-center gap-2 sm:gap-3 flex-1">
            <button 
              className="md:hidden p-2 hover:bg-purple-100 rounded-lg transition-colors"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X size={20} className="text-purple-600" /> : <Menu size={20} className="text-purple-600" />}
            </button>
            <div className="relative">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-linear-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center font-bold text-white text-xs sm:text-sm">
                {selectedUser.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className={`absolute bottom-0 right-0 w-2 h-2 sm:w-3 sm:h-3 ${getStatusColor(selectedUser.status)} rounded-full border-2 border-white`}></div>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-base sm:text-lg font-semibold text-purple-900 truncate">{selectedUser.name}</h2>
              <p className="text-xs text-purple-600 truncate">
                {selectedUser.status === 'online' ? 'Active now' : `Last seen ${selectedUser.lastSeen}`}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-1 sm:gap-2">
            <button className="p-1.5 sm:p-2 hover:bg-purple-100 rounded-lg transition-colors hidden sm:block">
              <Phone size={18} className="text-purple-600" />
            </button>
            <button className="p-1.5 sm:p-2 hover:bg-purple-100 rounded-lg transition-colors hidden sm:block">
              <Video size={18} className="text-purple-600" />
            </button>
            <button className="p-1.5 sm:p-2 hover:bg-purple-100 rounded-lg transition-colors">
              <MoreVertical size={18} className="text-purple-600" />
            </button>
          </div>
        </div>
        
        {/* Overlay for mobile */}
        {sidebarOpen && <div className="fixed inset-0 bg-black/20 md:hidden z-30" onClick={() => setSidebarOpen(false)}></div>}

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4">
          {currentMessages.map((message: any) => {
            const isSent = message.senderId === currentUser.id;
            return (
              <div
                key={message.id}
                className={`flex gap-3 ${isSent ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold text-white ${
                  isSent 
                    ? 'bg-linear-to-br from-blue-600  to-pink-500'
                    : 'bg-linear-to-br from-purple-500 to-pink-500'
                }`}>
                  {isSent ? currentUser.name.charAt(0) : selectedUser.name.split(' ').map(n => n[0]).join('')}
                </div>

                <div className={`flex flex-col gap-1 max-w-xs sm:max-w-sm md:max-w-md ${isSent ? 'items-end' : 'items-start'}`}>
                  <div className={`px-3 py-2 sm:px-4 sm:py-2.5 rounded-2xl text-sm sm:text-base ${
                    isSent
                      ? 'bg-linear-to-r from-purple-600  to-blue-600 text-white rounded-tr-sm'
                      : 'bg-white text-purple-900 border border-purple-200 rounded-tl-sm'
                  }`}>
                    <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                  </div>
                  <span className="text-xs text-purple-400 px-1 mt-0.5">
                    {formatTime(message.timestamp)}
                  </span>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex gap-2 sm:gap-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold text-white bg-linear-to-br from-purple-500 to-pink-500">
                {selectedUser.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="px-3 py-2 sm:px-4 sm:py-2.5 rounded-2xl rounded-tl-sm bg-white border border-purple-200">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-purple-200 bg-white/80 backdrop-blur-sm p-2 sm:p-3 md:p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-1 sm:gap-2 items-end">
              <button className="p-1.5 sm:p-2 md:p-3 hover:bg-purple-100 rounded-lg transition-colors text-purple-600 hover:text-purple-700 shrink-0 hidden sm:block">
                <Paperclip size={18} />
              </button>
              
              <div className="flex-1 relative">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Message..."
                  rows={1}
                  className="w-full px-2.5 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 bg-white border border-purple-200 rounded-lg sm:rounded-xl text-xs sm:text-sm md:text-base text-purple-900 placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none min-h-10 sm:min-h-12 max-h-32"
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    target.style.height = Math.min(target.scrollHeight, 128) + 'px';
                  }}
                />
              </div>

              <button className="p-1.5 sm:p-2 md:p-3 hover:bg-purple-100 rounded-lg transition-colors text-purple-600 hover:text-purple-700 shrink-0 hidden sm:block">
                <Smile size={18} />
              </button>
              
              <button
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className="px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white rounded-lg sm:rounded-xl transition-all flex items-center justify-center font-medium disabled:opacity-50 shrink-0"
              >
                <Send size={16} className="sm:hidden" />
                <Send size={18} className="hidden sm:block" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
   
  );
}