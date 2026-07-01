import { NavLink, Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Modal } from '@/components/ui';
import {
  LayoutDashboard,
  CalendarDays,
  Search,
  Trophy,
  User,
  Bell,
  Settings,
  LogOut,
  Zap,
  Coins,
  Network,
  MoreVertical,
} from 'lucide-react';

interface NavbarProps {
  unreadCount?: number;
}

export function Navbar({ unreadCount = 0 }: NavbarProps) {
  const { logout, user } = useAuth();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const links = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/slots', label: 'Calendar' },
    { to: '/leaderboard', label: 'Progress' },
    { to: '/search', label: 'Projects' },
    { to: '/notifications', label: 'Activities' },
    { to: '/settings', label: 'More' },
  ];

  if (!user) {
    return (
      <nav className="h-16 hidden lg:flex items-center justify-between rounded-2xl bg-[#1C2330]/90 border border-white/10 px-6 sticky top-6 z-30 mx-10 mt-6 font-ibm-plex-mono">
        <div className="h-6 w-32 bg-[#252D3A] animate-pulse rounded-lg" />
        <div className="h-10 w-10 rounded-xl bg-[#252D3A] animate-pulse" />
      </nav>
    );
  }

  return (
    <div className="hidden lg:block sticky top-6 z-30 mx-10 mt-6 font-sans">
      {/* Primary Top Nav Container */}
      <nav className="h-16 flex items-center justify-between rounded-2xl bg-[#1E2330] border border-[#2A3040] backdrop-blur-xl px-6 relative overflow-hidden shadow-2xl z-30">
        
        {/* Decorative visual wave shape on the left */}
        <div className="absolute left-0 top-0 h-full w-[170px] overflow-hidden pointer-events-none select-none z-10">
          <svg
            width="267"
            height="192"
            viewBox="0 0 267 192"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute -top-[12px] -left-[15px]"
          >
            <defs>
              <linearGradient id="nav_gradient" x1="32" y1="0" x2="267" y2="192" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#38C6E6" />
                <stop offset="45%" stopColor="#34DBB1" />
                <stop offset="100%" stopColor="#43E8A0" />
              </linearGradient>
            </defs>
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M32 0V13.915C32 21.7049 38.3771 28.0207 46.2424 28.0207H87.1894C109.306 28.0207 129.917 57.4932 129.917 78.2724V174.368C129.917 184.106 137.887 192 147.72 192H249.197C259.03 192 267 184.106 267 174.368V72.1012C267 62.3629 259.03 54.469 249.197 54.469H153.061C121.9 54.469 101.432 25.3759 101.432 13.0333V0H32Z"
              fill="url(#nav_gradient)"
            />
          </svg>
        </div>
        
        {/* Transparent logo zone linking to home/dashboard */}
        <Link 
          to="/dashboard" 
          className="absolute left-0 top-0 h-full w-[150px] z-20 cursor-pointer pointer-events-auto" 
          title="Home"
        />

        {/* 2. Navigation Tab Menu */}
        <div className="flex items-center gap-6 xl:gap-8 z-20 ml-auto mr-12 h-full">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `relative text-[13px] font-black tracking-wide transition-all duration-200 h-full flex items-center cursor-pointer select-none
                 ${isActive ? 'text-[#3BE5C2]' : 'text-[#8095AF] hover:text-white'}`
              }
            >
              {({ isActive }) => (
                <>
                  <span>{link.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#3BE5C2] rounded-full" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* 3. Actions / Controls */}
        <div className="flex items-center gap-4.5 shrink-0 z-20">
          {/* Peer points indicator showing current total in tooltip */}
          <div 
            className="hidden xl:flex items-center gap-1 text-[#8095AF] select-none text-xs font-bold"
            title={`${user.peer_points} Peer Points & ${user.peer_coins} Peer Coins`}
          >
            <Zap className="h-4 w-4 text-[#38C9E6]" />
            <span>{user.peer_points}</span>
          </div>

          {/* Network icon trigger button */}
          <button 
            className="text-[#8095AF] hover:text-white transition-all cursor-pointer p-1"
            title="Network Graphs"
          >
            <Network className="h-5 w-5 stroke-[2]" />
          </button>

          {/* Notifications bell with indicator badge */}
          <Link 
            to="/notifications" 
            className="relative text-[#8095AF] hover:text-white transition-all cursor-pointer p-1 flex items-center justify-center"
            title="Notifications"
          >
            <Bell className="h-5 w-5 stroke-[2]" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            )}
          </Link>

          {/* Search box button */}
          <Link 
            to="/search"
            className="h-10 w-10 flex items-center justify-center bg-[#2B3142] rounded-xl text-[#8095AF] hover:text-white transition-all border border-[#2A3040] cursor-pointer"
            title="Search"
          >
            <Search className="h-5 w-5 stroke-[2.2]" />
          </Link>

          {/* Dynamic Profile Dropdown Selector block */}
          <div className="relative" id="profile-dropdown-container">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="h-11 px-3 bg-[#2B3142] rounded-xl flex items-center gap-2 text-[#8095AF] hover:text-white transition-all cursor-pointer border border-[#2A3040] select-none"
              title={`Profile: @${user.school21_login}`}
            >
              <MoreVertical className="h-5 w-5 stroke-[1.8]" />
              <div className="h-7 w-7 rounded-full bg-[#1E2330] overflow-hidden flex items-center justify-center border border-[#2A3040]">
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt={user.school21_login} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <User className="h-4 w-4 text-gray-400" />
                )}
              </div>
            </button>
            
            {/* Float Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-[#1E2330] border border-[#2A3040] rounded-xl shadow-2xl py-1 z-50 animate-fade-in text-sm font-medium">
                <Link
                  to="/profile"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 text-[#8095AF] hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                >
                  <User className="h-4 w-4" />
                  <span>Mening profilim</span>
                </Link>
                <Link
                  to="/settings"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 text-[#8095AF] hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                >
                  <Settings className="h-4 w-4" />
                  <span>Sozlamalar</span>
                </Link>
                <div className="border-t border-white/5 my-1" />
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    setIsLogoutModalOpen(true);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-red-400 hover:text-red-300 hover:bg-white/5 transition-all cursor-pointer text-left font-semibold"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Tizimdan chiqish</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Logout confirmation drawer modal */}
      <Modal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        title="Tizimdan Chiqish"
      >
        <div className="flex flex-col gap-4">
          <p className="text-xs sm:text-sm text-[#B0BEC5] leading-relaxed">
            Haqiqatdan ham tizimdan chiqmoqchimisiz? Kelgusi kirishlar uchun qayta avtorizatsiyadan oʻtishingiz talab etiladi.
          </p>
          <div className="flex gap-3 justify-end pt-2">
            <button
              onClick={() => setIsLogoutModalOpen(false)}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white font-black rounded-xl border border-white/10 transition-all text-xs tracking-wider uppercase cursor-pointer"
            >
              Qolish
            </button>
            <button
              onClick={() => {
                setIsLogoutModalOpen(false);
                logout();
              }}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-black rounded-xl border border-transparent transition-all text-xs tracking-wider uppercase cursor-pointer"
            >
              Chiqish
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Navbar;
