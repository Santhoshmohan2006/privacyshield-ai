import React, { useState, useEffect, useRef } from 'react';
import {
  FiSun, FiMoon, FiLogOut, FiMenu, FiBell, FiSearch,
  FiChevronRight, FiX, FiCheck, FiTrash2, FiShield,
  FiAward, FiActivity, FiZap, FiInfo
} from 'react-icons/fi';
import {
  getUser, logoutUser,
  getNotifications, markAllNotificationsAsRead,
  markNotificationAsRead, deleteNotification, clearAllNotifications,
  getXP, getLevelInfo
} from '../../utils/storage';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Map notification title keywords to icon + color
const getNotifMeta = (title = '') => {
  const t = title.toLowerCase();
  if (t.includes('badge') || t.includes('award'))
    return { icon: <FiAward size={14} />, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' };
  if (t.includes('level') || t.includes('xp'))
    return { icon: <FiZap size={14} />, color: 'text-primary bg-primary/10 border-primary/20' };
  if (t.includes('streak'))
    return { icon: <FiActivity size={14} />, color: 'text-secondary bg-secondary/10 border-secondary/20' };
  if (t.includes('shield') || t.includes('privacy') || t.includes('scenario'))
    return { icon: <FiShield size={14} />, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' };
  return { icon: <FiInfo size={14} />, color: 'text-slate-400 bg-slate-800 border-slate-700' };
};

// Format relative time
const timeAgo = (isoString) => {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};

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

  const loadNotifications = () => setNotifications(getNotifications());

  useEffect(() => {
    loadNotifications();
    window.addEventListener('notifications_updated', loadNotifications);

    // Ctrl+K → focus search
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === 'Escape') setShowNotifDropdown(false);
    };
    window.addEventListener('keydown', handleKeyDown);

    // Click outside → close dropdown
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

  const handleLogout = () => { logoutUser(); navigate('/login'); };

  const handleMarkRead = (id, e) => {
    e.stopPropagation();
    markNotificationAsRead(id);
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    deleteNotification(id);
  };

  const handleMarkAllRead = () => markAllNotificationsAsRead();
  const handleClearAll = () => clearAllNotifications();

  const unreadCount = notifications.filter(n => !n.read).length;

  // Breadcrumbs
  const getBreadcrumbs = () => {
    const path = location.pathname.substring(1);
    if (!path) return [{ name: 'Home', path: '/' }];
    const parts = path.split('/');
    return [
      { name: 'Home', path: '/dashboard' },
      ...parts.map((p, i) => ({
        name: p.charAt(0).toUpperCase() + p.slice(1).replace('-', ' '),
        path: '/' + parts.slice(0, i + 1).join('/')
      }))
    ];
  };
  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="h-20 glass-dark border-b border-slate-700/50 flex items-center justify-between px-6 sticky top-0 z-20 backdrop-blur-xl">

      {/* ── Left: menu / breadcrumbs / search ── */}
      <div className="flex items-center gap-6 flex-1 min-w-0">
        <button
          onClick={toggleSidebar}
          className="md:hidden text-gray-300 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <FiMenu size={22} />
        </button>

        {/* Breadcrumbs */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
          {breadcrumbs.map((bc, idx) => (
            <React.Fragment key={bc.path}>
              {idx > 0 && <FiChevronRight className="text-slate-600" />}
              <span
                className={idx === breadcrumbs.length - 1
                  ? 'text-primary'
                  : 'hover:text-slate-200 cursor-pointer transition-colors'}
                onClick={() => navigate(bc.path)}
              >
                {bc.name}
              </span>
            </React.Fragment>
          ))}
        </div>

        {/* Search */}
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

      {/* ── Right: theme / notifications / user ── */}
      <div className="flex items-center gap-3">

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl hover:bg-slate-800/80 text-gray-300 transition-colors border border-transparent hover:border-slate-700/30"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
        </button>

        {/* ── Notification Bell ── */}
        <div className="relative" ref={dropdownRef}>
          <button
            id="notif-bell-btn"
            onClick={() => setShowNotifDropdown(prev => !prev)}
            className="relative p-2.5 rounded-xl hover:bg-slate-800/80 text-gray-300 transition-colors border border-transparent hover:border-slate-700/30"
            title="Notifications"
          >
            <FiBell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-slate-950 text-[9px] font-black flex items-center justify-center shadow-glow-primary leading-none">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showNotifDropdown && (
              <motion.div
                id="notif-dropdown"
                initial={{ opacity: 0, y: 12, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.95 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                className="absolute right-0 mt-3 w-[360px] glass-dark border border-slate-700/50 rounded-2xl shadow-card overflow-hidden z-50"
              >
                {/* Header */}
                <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FiBell size={14} className="text-primary" />
                    <h3 className="font-bold text-sm text-gray-100">Notifications</h3>
                    {unreadCount > 0 && (
                      <span className="text-[9px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-black">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-[11px] font-semibold text-primary hover:text-white transition-colors flex items-center gap-1"
                        title="Mark all as read"
                      >
                        <FiCheck size={12} /> All read
                      </button>
                    )}
                    {notifications.length > 0 && (
                      <button
                        onClick={handleClearAll}
                        className="text-[11px] font-semibold text-slate-500 hover:text-red-400 transition-colors flex items-center gap-1"
                        title="Clear all notifications"
                      >
                        <FiTrash2 size={12} /> Clear
                      </button>
                    )}
                  </div>
                </div>

                {/* Notification List */}
                <div className="max-h-[340px] overflow-y-auto custom-scroll">
                  {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 gap-3 text-center px-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600">
                        <FiBell size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-400">All caught up!</p>
                        <p className="text-xs text-slate-600 mt-1">No notifications yet. Complete a quiz or scenario to earn badges.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-800/70">
                      {notifications.map((notif) => {
                        const { icon, color } = getNotifMeta(notif.title);
                        return (
                          <motion.div
                            key={notif.id}
                            layout
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10, height: 0 }}
                            className={`group relative flex gap-3 px-4 py-3 hover:bg-slate-800/30 transition-colors cursor-default ${!notif.read ? 'bg-primary/[0.04] border-l-2 border-primary' : ''}`}
                          >
                            {/* Icon */}
                            <div className={`mt-0.5 w-7 h-7 rounded-lg border flex items-center justify-center flex-shrink-0 ${color}`}>
                              {icon}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <h4 className="text-xs font-bold text-gray-200 leading-tight">
                                  {notif.title}
                                  {!notif.read && (
                                    <span className="ml-1.5 inline-block w-1.5 h-1.5 rounded-full bg-primary align-middle" />
                                  )}
                                </h4>
                                <span className="text-[9px] text-slate-500 font-medium whitespace-nowrap flex-shrink-0">
                                  {timeAgo(notif.time)}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{notif.description}</p>
                            </div>

                            {/* Action buttons (appear on hover) */}
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              {!notif.read && (
                                <button
                                  onClick={(e) => handleMarkRead(notif.id, e)}
                                  className="p-1 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                                  title="Mark as read"
                                >
                                  <FiCheck size={11} />
                                </button>
                              )}
                              <button
                                onClick={(e) => handleDelete(notif.id, e)}
                                className="p-1 rounded-md bg-slate-800 text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                                title="Dismiss"
                              >
                                <FiX size={11} />
                              </button>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Footer */}
                {notifications.length > 0 && (
                  <div className="px-4 py-2.5 border-t border-slate-800 text-center">
                    <span className="text-[10px] text-slate-600 font-semibold">
                      {notifications.length} notification{notifications.length !== 1 ? 's' : ''} · {unreadCount} unread
                    </span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── User Card ── */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-700/50">
          <div className="flex flex-col text-right hidden sm:flex">
            <span className="text-xs font-bold text-white leading-none">{user?.name || 'User'}</span>
            <span className="text-[10px] text-primary font-semibold uppercase tracking-wider mt-1">
              Level {levelInfo.currentLevel} — {levelInfo.levelName}
            </span>
          </div>

          <div
            className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-slate-950 font-black shadow-lg shadow-primary/20 cursor-pointer hover:scale-105 transition-transform text-sm"
            onClick={() => navigate('/profile')}
            title="Go to Profile"
          >
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
