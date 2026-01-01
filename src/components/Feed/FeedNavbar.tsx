import { Lightbulb, Bell, Plus, Menu, X, Home, TrendingUp, FolderKanban, User, LogOut, Settings } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useUser, useClerk } from "@clerk/clerk-react";
import { useNavigate } from 'react-router-dom';


export default function FeedNavbar() {

    const { user } = useUser();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const desktopDropdownRef = useRef<HTMLDivElement>(null);
    const mobileDropdownRef = useRef<HTMLDivElement>(null);
    const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
    const [, setIndicatorStyle] = useState({ left: 0, width: 0 });

    const { signOut } = useClerk();

    const activeTab =
        location.pathname === "/" ? "feed" :
            location.pathname === "/trending" ? "trending" :
                location.pathname.startsWith("/my-project") ? "projects" :
                    "";


    const [formData] = useState({
        username: user?.username
    });


    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            const target = event.target as Node;

            if (
                desktopDropdownRef.current &&
                !desktopDropdownRef.current.contains(target) &&
                mobileDropdownRef.current &&
                !mobileDropdownRef.current.contains(target)
            ) {
                setProfileDropdownOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    const handleSignOut = async () => {
        setProfileDropdownOpen(false);
        setMobileMenuOpen(false);
        try {
            await signOut();
            navigate('/');
        } catch (error) {
            console.error('Sign out error:', error);
        }
    };

    useEffect(() => {
        const activeTabElement = tabRefs.current[activeTab];
        if (activeTabElement) {
            const { offsetLeft, offsetWidth } = activeTabElement;
            setIndicatorStyle({
                left: offsetLeft,
                width: offsetWidth
            });
        }
    }, [activeTab]);


    return (
        <>
            <style>{`
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-12px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes slideInMobile {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes shimmer {
                    0% { background-position: -200% center; }
                    100% { background-position: 200% center; }
                }
                
                .dropdown-menu {
                    animation: slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                }

                .mobile-menu {
                    animation: slideInMobile 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                }

                .gradient-border {
                    
                    position: relative;
                    background: linear-gradient(135deg, rgba(147, 51, 234, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                }

                .gradient-border::before {
                   
                    content: '';
                    position: absolute;
                    inset: 0;
                    border-radius: inherit;
                    padding: 1px;
                    background: linear-gradient(135deg, rgba(147, 51, 234, 0.3), rgba(59, 130, 246, 0.3));
                    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                    -webkit-mask-composite: xor;
                    mask-composite: exclude;
                    pointer-events: none;
                }

                .shimmer-button {
                    background: linear-gradient(135deg, #9333ea 0%, #3b82f6 100%);
                    background-size: 200% auto;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .shimmer-button:hover {
                    background-position: right center;
                    transform: translateY(-2px);
                    box-shadow: 0 10px 25px -5px rgba(147, 51, 234, 0.4), 0 8px 10px -6px rgba(59, 130, 246, 0.3);
                }

                .shimmer-button:active {
                    transform: translateY(0px);
                }

                .nav-tab {
                    position: relative;
                    transition: all 0.3s ease;
                }
                .nav-tab:not(.active):hover {
                     transform: translateY(-1px);
                }

                .nav-tab::after {
                    content: '';
                    position: absolute;
                    bottom: -2px;
                    left: 50%;
                    transform: translateX(-50%) scaleX(0);
                    width: 100%;
                    height: 3px;
                    background: linear-gradient(90deg, #9333ea, #3b82f6);
                    border-radius: 2px;
                    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .nav-tab.active::after {
                    transform: translateX(-50%) scaleX(1);
                }
                .nav-indicator {
                    position: absolute;
                    bottom: -2px;
                    height: 3px;
                    background: linear-gradient(90deg, #9333ea, #3b82f6);
                    border-radius: 2px;
                    transition: left 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
                    width 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
                }

                .glassmorphism {
                    background: rgba(255, 255, 255, 0.85);
                    backdrop-filter: blur(12px) saturate(180%);
                    -webkit-backdrop-filter: blur(12px) saturate(180%);
                }

                @media (max-width: 768px) {
                    .glassmorphism {
                        background: rgba(255, 255, 255, 0.95);
                    }
                }

                .profile-avatar {
                    background: linear-gradient(135deg, #9333ea 0%, #3b82f6 100%);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .profile-avatar:hover {
                    transform: scale(1.05);
                    box-shadow: 0 8px 16px -4px rgba(147, 51, 234, 0.4);
                }

                .menu-item {
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                }
                

                .menu-item:active {
                    transform: scale(0.98);
                }
                .mobile-nav-item {
                     transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .mobile-nav-item.active {
                     transform: translateX(4px);
                }
            `}</style>

            <nav className="fixed top-0 left-0 right-0 z-50 px-3 sm:px-4 lg:px-6 pt-3 sm:pt-4">
                <div className="max-w-7xl mx-auto">
                    <div className="gradient-border glassmorphism rounded-2xl shadow-xl shadow-purple-500/10">
                        <div className="px-4 sm:px-6 lg:px-8">
                            <div className="flex justify-between items-center h-16 sm:h-18 lg:h-20">
                                {/* Logo */}
                                <div className="flex items-center space-x-2 sm:space-x-3 cursor-pointer group">
                                    <div className="bg-linear-to-br from-purple-600 to-blue-600 p-2 sm:p-2.5 rounded-xl shadow-lg shadow-purple-500/30 group-hover:shadow-purple-500/50 transition-all group-hover:scale-105">
                                        <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                    </div>
                                    <span className="text-xl sm:text-2xl lg:text-3xl font-bold bg-linear-to-r from-purple-600 via-purple-500 to-blue-600 bg-clip-text text-transparent">
                                        BuildNet
                                    </span>
                                </div>

                                {/* Desktop Navigation */}

                                <div className="hidden lg:flex items-center space-x-1">
                                    <button
                                        onClick={() => navigate("/")}
                                        className={`nav-tab px-5 py-2 rounded-xl font-semibold transition-all duration-200 ${activeTab === 'feed'
                                            ? 'active text-purple-600'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                            }`}
                                    >
                                        Feed
                                    </button>
                                    <button
                                        onClick={() => navigate("/trending")}
                                        className={`nav-tab px-5 py-2 rounded-xl font-semibold transition-all ${activeTab === 'trending'
                                            ? 'active text-purple-600'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                            }`}
                                    >
                                        Trending
                                    </button>
                                    <button
                                        onClick={() => navigate("/my-projects")}

                                        className={`nav-tab px-5 py-2 rounded-xl font-semibold transition-all duration-200 ${activeTab === 'projects'
                                            ? 'active text-purple-600'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                            }`}
                                    >
                                        My Projects
                                    </button>
                                </div>


                                {/* Desktop Right Section */}
                                <div className="hidden lg:flex items-center space-x-3">
                                    <button className="p-2.5 hover:bg-linear-to-br hover:from-gray-50 hover:to-gray-100 rounded-xl transition-all group relative">
                                        <Bell className="w-5 h-5 text-gray-600 group-hover:text-purple-600 transition-colors" />
                                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                                    </button>

                                    <button
                                        onMouseDown={(e) => e.stopPropagation()}
                                        onClick={() => navigate("/create")}
                                        className="shimmer-button text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 shadow-lg"
                                    >
                                        <Plus className="w-5 h-5" />
                                        <span>Post Idea</span>
                                    </button>

                                    {/* Desktop Profile Dropdown */}
                                    <div className="relative" ref={desktopDropdownRef}>
                                        <button
                                            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                                            className="profile-avatar w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg"
                                        >
                                            {formData.username?.toUpperCase().charAt(0) || 'U'}
                                        </button>

                                        {profileDropdownOpen && (
                                            <div
                                                className="dropdown-menu absolute right-0 mt-3 w-80 glassmorphism rounded-2xl shadow-2xl border border-purple-100 overflow-hidden"
                                                onPointerDown={(e) => e.stopPropagation()}
                                            >
                                                {/* User Info Header */}
                                                <div className="bg-linear-to-br from-purple-50 via-purple-50 to-blue-50 p-5 border-b border-purple-100">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-14 h-14 rounded-xl bg-linear-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-purple-500/30 shrink-0">
                                                            {formData.username?.toUpperCase().charAt(0) || 'U'}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-bold text-gray-900 text-base truncate">{formData.username || 'User'}</p>
                                                            <p className="text-sm text-gray-500 truncate">{user?.primaryEmailAddress?.emailAddress}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Menu Items */}
                                                <div className="p-2">
                                                    <button
                                                        onClick={() => {
                                                            navigate('/profile');
                                                            setProfileDropdownOpen(false);
                                                        }}
                                                        className="menu-item w-full flex items-center gap-3 px-4 py-3.5 hover:bg-linear-to-r hover:from-purple-50 hover:to-blue-50 rounded-xl transition text-left group"
                                                    >
                                                        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-purple-100 to-purple-50 flex items-center justify-center group-hover:from-purple-200 group-hover:to-purple-100 transition">
                                                            <User className="w-5 h-5 text-purple-600" />
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-gray-900">View Profile</p>
                                                            <p className="text-xs text-gray-500">Manage your account</p>
                                                        </div>
                                                    </button>

                                                    <button
                                                        onClick={() => {
                                                            navigate('/settings');
                                                            setProfileDropdownOpen(false);
                                                        }}
                                                        className="menu-item w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 rounded-xl transition text-left group"
                                                    >
                                                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition">
                                                            <Settings className="w-5 h-5 text-gray-600" />
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-gray-900">Settings</p>
                                                            <p className="text-xs text-gray-500">Preferences & privacy</p>
                                                        </div>
                                                    </button>
                                                </div>

                                                {/* Sign Out Button */}
                                                <div className="border-t border-purple-100 p-2">
                                                    <button
                                                        onClick={handleSignOut}
                                                        className="menu-item w-full flex items-center gap-3 px-4 py-3.5 hover:bg-linear-to-r hover:from-red-50 hover:to-pink-50 rounded-xl transition text-left group"
                                                    >
                                                        <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition">
                                                            <LogOut className="w-5 h-5 text-red-600" />
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-red-600">Sign Out</p>
                                                            <p className="text-xs text-red-500">Logout from your account</p>
                                                        </div>
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Mobile Right Section */}
                                <div className="flex lg:hidden items-center space-x-2">
                                    <button className="p-2 hover:bg-gray-50 rounded-xl transition-all relative">
                                        <Bell className="w-5 h-5 text-gray-600" />
                                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                                    </button>

                                    <div className="relative" ref={mobileDropdownRef}>
                                        <button
                                            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                                            className="profile-avatar w-10 h-10 rounded-xl flex items-center justify-center text-white font-semibold shadow-lg"
                                        >
                                            {formData.username?.toUpperCase().charAt(0) || 'U'}
                                        </button>

                                        {profileDropdownOpen && (
                                            <div
                                                className="dropdown-menu absolute right-0 mt-3 w-80 glassmorphism rounded-2xl shadow-2xl border border-purple-100 overflow-hidden"
                                                onPointerDown={(e) => e.stopPropagation()}
                                            >
                                                {/* User Info Header */}
                                                <div className="bg-linear-to-br from-purple-50 via-purple-50 to-blue-50 p-4 border-b border-purple-100">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-12 h-12 rounded-xl bg-linear-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-purple-500/30 shrink-0">
                                                            {formData.username?.toUpperCase().charAt(0) || 'U'}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-bold text-gray-900 truncate">{formData.username || 'User'}</p>
                                                            <p className="text-xs text-gray-500 truncate">{user?.primaryEmailAddress?.emailAddress}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Menu Items */}
                                                <div className="p-2">
                                                    <button
                                                        onClick={() => {
                                                            navigate('/profile');
                                                            setProfileDropdownOpen(false);
                                                        }}
                                                        className="menu-item w-full flex items-center gap-3 px-4 py-3.5 hover:bg-linear-to-r hover:from-purple-50 hover:to-blue-50 active:bg-purple-100 rounded-xl transition text-left"
                                                    >
                                                        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-purple-100 to-purple-50 flex items-center justify-center shrink-0">
                                                            <User className="w-5 h-5 text-purple-600" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="font-semibold text-gray-900">View Profile</p>
                                                            <p className="text-xs text-gray-500">Manage your account</p>
                                                        </div>
                                                    </button>

                                                    <button
                                                        onClick={() => {
                                                            navigate('/settings');
                                                            setProfileDropdownOpen(false);
                                                        }}
                                                        className="menu-item w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 active:bg-gray-100 rounded-xl transition text-left"
                                                    >
                                                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                                                            <Settings className="w-5 h-5 text-gray-600" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="font-semibold text-gray-900">Settings</p>
                                                            <p className="text-xs text-gray-500">Preferences & privacy</p>
                                                        </div>
                                                    </button>
                                                </div>

                                                {/* Sign Out Button */}
                                                <div className="border-t border-purple-100 p-2">
                                                    <button
                                                        onClick={handleSignOut}
                                                        className="menu-item w-full flex items-center gap-3 px-4 py-3.5 hover:bg-linear-to-r hover:from-red-50 hover:to-pink-50 active:bg-red-100 rounded-xl transition text-left"
                                                    >
                                                        <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
                                                            <LogOut className="w-5 h-5 text-red-600" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="font-semibold text-red-600">Sign Out</p>
                                                            <p className="text-xs text-red-500">Logout from account</p>
                                                        </div>
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                        className="p-2 hover:bg-gray-50 rounded-xl transition-all"
                                    >
                                        {mobileMenuOpen ? (
                                            <X className="w-6 h-6 text-gray-600" />
                                        ) : (
                                            <Menu className="w-6 h-6 text-gray-600" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Mobile Menu */}
                        {mobileMenuOpen && (
                            <div className="mobile-menu lg:hidden border-t border-purple-100">
                                <div className="px-4 py-4 space-y-2">
                                    {/* Navigation Links */}
                                    <button
                                        onClick={() => {
                                            navigate("/")
                                            setMobileMenuOpen(false);
                                        }}
                                        className={`menu-item w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition ${activeTab === 'feed'
                                            ? 'bg-linear-to-r from-purple-100 to-blue-100 text-purple-700 font-semibold shadow-sm'
                                            : 'text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        <Home className="w-5 h-5" />
                                        <span>Feed</span>
                                    </button>

                                    <button
                                        onClick={() => {
                                            navigate("/trending");
                                            setMobileMenuOpen(false);
                                        }}
                                        className={`menu-item w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition ${activeTab === 'trending'
                                            ? 'bg-linear-to-r from-purple-100 to-blue-100 text-purple-700 font-semibold shadow-sm'
                                            : 'text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        <TrendingUp className="w-5 h-5" />
                                        <span>Trending</span>
                                    </button>

                                    <button
                                        onClick={() => {
                                            navigate("/my-projects");

                                            setMobileMenuOpen(false);
                                        }}
                                        className={`menu-item w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition ${activeTab === 'projects'
                                            ? 'bg-linear-to-r from-purple-100 to-blue-100 text-purple-700 font-semibold shadow-sm'
                                            : 'text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        <FolderKanban className="w-5 h-5" />
                                        <span>My Projects</span>
                                    </button>

                                    {/* Post Idea Button */}
                                    <button
                                        onClick={() => {
                                            navigate("/create");
                                            setMobileMenuOpen(false);
                                        }}
                                        className="menu-item shimmer-button w-full text-white px-4 py-3.5 rounded-xl font-semibold shadow-lg flex items-center justify-center gap-2 mt-4"
                                    >
                                        <Plus className="w-5 h-5" />
                                        <span>Post Idea</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* Spacer to prevent content from hiding under navbar */}
            <div className="h-20 sm:h-24 lg:h-28"></div>
        </>
    );
}