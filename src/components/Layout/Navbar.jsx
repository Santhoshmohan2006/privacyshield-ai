import React, { useState, useEffect, useRef } from 'react';
import { FiSun, FiMoon, FiLogOut, FiMenu, FiBell, FiSearch, FiChevronRight } from 'react-icons/fi';
import { getUser, logoutUser, getNotifications, markAllNotificationsAsRead, getXP, getLevelInfo } from '../../utils/storage';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ theme, toggleTheme, toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUser();
  
  const [notifications, setNotifications] = useState([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);
  const dropdownRef = useRef(null);
  
  const xp = getXP();
  const levelInfo = getLevelInfo(xp);

  const loadNotifications = () => {
    setNotifications(getNotifications());
  };

  useEffect(() => {
    loadNotifications();
    
    // Add custom event listener for storage/notification changes
    window.addEventListener('notifications_updated', loadNotifications);
    
    // Keyboard shortcut for search (Ctrl + K)
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    
    // Close dropdown on click outside
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowNotifDropdown(false);
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('notifications_updated', loadNotifications);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const handleMarkAllRead = () => {
    markAllNotificationsAsRead();
    loadNotifications();
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // Breadcrumbs builder
  const getBreadcrumbs = () => {
    const path = location.pathname.substring(1);
    if (!path) return [{ name: 'Home', path: '/' }];
    
    const parts = path.split('/');
    return [
      { name: 'Home', path: '/dashboard' },
      ...parts.map((p, i) => {
        const url = '/' + parts.slice(0, i + 1).join('/');
        const formattedName = p.charAt(0).toUpperCase() + p.slice(1).replace('-', ' ');
        return { name: formattedName, path: url };
      })
    ];
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="h-20 glass-dark border-b border-slate-700/50 flex items-center justify-between px-6 sticky top-0 z-20 backdrop-blur-xl">
      {/* Left side: Menu toggle, breadcrumbs, search */}
      <div className="flex items-center gap-6 flex-1 min-w-0">
        <button onClick={toggleSidebar} className="md:hidden text-gray-300 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors">
          <FiMenu size={22} />
        </button>
        
        {/* Breadcrumbs */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
          {breadcrumbs.map((bc, idx) => (
            <React.Fragment key={bc.path}>
              {idx > 0 && <FiChevronRight className="text-slate-600" />}
              <span className={idx === breadcrumbs.length - 1 ? 'text-primary' : 'hover:text-slate-200 cursor-pointer'} onClick={() => navigate(bc.path)}>
                {bc.name}
              </span>
            </React.Fragment>
          ))}
        </div>

        {/* Global Search */}
        <div className="relative max-w-xs w-full hidden md:block">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search platform... (Ctrl+K)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/40 border border-slate-700/50 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-primary/50 text-slate-200 placeholder-slate-500 transition-all"
          />
        </div>
      </div>

      {/* Right side: Actions, Notifications, User details */}
      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-2.5 rounded-xl hover:bg-slate-800/80 text-gray-300 transition-colors border border-transparent hover:border-slate-700/30"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
        </button>

        {/* Notification Bell */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowNotifDropdown(!showNotifDropdown)}
            className="p-2.5 rounded-xl hover:bg-slate-800/80 text-gray-300 transition-colors border border-transparent hover:border-slate-700/30 relative"
          >
            <FiBell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary animate-pulse shadow-glow-primary" />
            )}
          </button>

          <AnimatePresence>
            {showNotifDropdown && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-3 w-88 glass-dark border border-slate-700/50 rounded-2xl shadow-card overflow-hidden z-50"
              >
                <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                  <h3 className="font-bold text-sm text-gray-100 flex items-center gap-2">
                    Notifications
                    {unreadCount > 0 && (
                      <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-black">
                        {unreadCount} new
                      </span>
                    )}
                  </h3>
                  {unreadCount > 0 && (
                    <button 
                      onClick={handleMarkAllRead}
                      className="text-xs font-semibold text-primary hover:text-white transition-colors"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto custom-scroll divide-y divide-slate-800">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 text-xs font-medium">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div 
                        key={notif.id} 
                        className={`p-4 hover:bg-slate-800/40 transition-colors ${!notif.read ? 'bg-primary/5 border-l-2 border-primary' : ''}`}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="text-xs font-bold text-gray-200">{notif.title}</h4>
                          <span className="text-[9px] text-slate-500 font-medium whitespace-nowrap">
                            {new Date(notif.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1 leading-normal">{notif.description}</p>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Card */}
        <div className="flex items-center gap-3 pl-4 border-l border-slate-700/50">
          <div className="flex flex-col text-right hidden sm:flex">
            <span className="text-xs font-bold text-white leading-none">
              {user?.name || 'User'}
            </span>
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-1 text-primary">
              Level {levelInfo.currentLevel} — {levelInfo.levelName}
            </span>
          </div>

          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-black shadow-lg shadow-primary/20 cursor-pointer hover:scale-105 transition-transform" onClick={() => navigate('/profile')}>
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>

          <button 
            onClick={handleLogout}
            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
            title="Logout"
          >
            <FiLogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
