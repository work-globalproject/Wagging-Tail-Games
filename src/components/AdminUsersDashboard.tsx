import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  Activity,
  Gamepad2,
  TrendingUp,
  Clock,
  ShieldCheck,
  Search,
  Filter,
  RefreshCw,
  Award,
  Flame,
  Calendar,
  ChevronRight,
  ExternalLink,
  Sparkles,
  Zap,
  Dog,
  CheckCircle2,
  ArrowUpRight
} from 'lucide-react';
import { UserAccount, PlaySession, DogProfile } from '../types';
import { fetchAllUsersForAdmin, fetchAllUsersSessionsForAdmin, ADMIN_EMAILS } from '../lib/firebase';
import { soundFx } from '../utils/audio';

interface Props {
  currentUser: UserAccount | null;
  onOpenGameManager?: () => void;
  onOpenAuth?: () => void;
  localUsersFallback?: UserAccount[];
}

export default function AdminUsersDashboard({ currentUser, onOpenGameManager, onOpenAuth, localUsersFallback }: Props) {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [sessions, setSessions] = useState<PlaySession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [providerFilter, setProviderFilter] = useState<'all' | string>('all');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'pet_parent'>('all');
  const [selectedUser, setSelectedUser] = useState<UserAccount | null>(null);

  const loadAdminData = async () => {
    setIsLoading(true);
    soundFx.playBoop(540);
    try {
      const fetchedUsers = await fetchAllUsersForAdmin();
      if (fetchedUsers.length > 0) {
        setUsers(fetchedUsers);
        // Also fetch user sessions for rich aggregate metrics
        const allSessions = await fetchAllUsersSessionsForAdmin(fetchedUsers);
        setSessions(allSessions);
      } else if (localUsersFallback && localUsersFallback.length > 0) {
        setUsers(localUsersFallback);
      } else if (currentUser) {
        setUsers([currentUser]);
      }
    } catch (e) {
      console.error('Failed to load admin analytics:', e);
      if (currentUser) setUsers([currentUser]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, [currentUser]);

  // Aggregate Metrics
  const stats = useMemo(() => {
    const totalUsers = users.length;
    const totalPlaySessions = sessions.length + users.reduce((acc, u) => acc + (u.sessionCount || 0), 0);
    const totalPlaySeconds = sessions.reduce((acc, s) => acc + (s.durationSeconds || 0), 0) +
      users.reduce((acc, u) => acc + (u.totalPlaySeconds || 0), 0);

    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    const sevenDays = 7 * oneDay;

    let activeToday = 0;
    let activeThisWeek = 0;
    let newSignupsThisWeek = 0;

    const providerCounts: Record<string, number> = {
      google: 0,
      facebook: 0,
      instagram: 0,
      email: 0,
      other: 0,
    };

    users.forEach((u) => {
      const p = u.provider || 'email';
      providerCounts[p] = (providerCounts[p] || 0) + 1;

      const lastActiveTime = u.lastActiveAt ? new Date(u.lastActiveAt).getTime() : 0;
      const createdTime = u.createdAt ? new Date(u.createdAt).getTime() : 0;

      if (now - lastActiveTime < oneDay) activeToday++;
      if (now - lastActiveTime < sevenDays) activeThisWeek++;
      if (now - createdTime < sevenDays) newSignupsThisWeek++;
    });

    const totalMinutes = Math.round(totalPlaySeconds / 60);

    // Most popular categories and games
    const gameCounts: Record<string, { gameId: string; title: string; count: number }> = {};
    sessions.forEach((s) => {
      if (!gameCounts[s.gameId]) {
        gameCounts[s.gameId] = { gameId: s.gameId, title: s.gameTitle, count: 0 };
      }
      gameCounts[s.gameId].count += 1;
    });

    const topGames = Object.values(gameCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);

    return {
      totalUsers,
      totalPlaySessions,
      totalMinutes,
      activeToday,
      activeThisWeek,
      newSignupsThisWeek,
      providerCounts,
      topGames,
    };
  }, [users, sessions]);

  // Filtered User list
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        (u.email && u.email.toLowerCase().includes(q)) ||
        (u.displayName && u.displayName.toLowerCase().includes(q)) ||
        (u.dogProfile?.name && u.dogProfile.name.toLowerCase().includes(q)) ||
        (u.dogProfile?.breed && u.dogProfile.breed.toLowerCase().includes(q));

      const matchesProvider = providerFilter === 'all' || u.provider === providerFilter;
      const matchesRole =
        roleFilter === 'all' ||
        (roleFilter === 'admin' && (u.role === 'admin' || (u.email && ADMIN_EMAILS.includes(u.email.toLowerCase())))) ||
        (roleFilter === 'pet_parent' && u.role !== 'admin' && !(u.email && ADMIN_EMAILS.includes(u.email.toLowerCase())));

      return matchesSearch && matchesProvider && matchesRole;
    });
  }, [users, searchQuery, providerFilter, roleFilter]);

  const formatTimeAgo = (dateStr?: string) => {
    if (!dateStr) return 'Recently';
    const ms = Date.now() - new Date(dateStr).getTime();
    if (ms < 60000) return 'Just now';
    const mins = Math.floor(ms / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div id="admin-dashboard-container" className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Top Banner Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-stone-900 via-stone-800 to-amber-950 p-6 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Center • Live User & App Analytics</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-black tracking-tight">
              Sign Ups & App Usage Intelligence
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 max-w-xl">
              Real-time monitoring of pet parent sign ups, authentication providers, dog profiles, daily play streaks, and activity volume.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {!currentUser && onOpenAuth && (
              <button
                onClick={onOpenAuth}
                className="px-4 py-2 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-black shadow-md flex items-center gap-1.5 transition-all active:scale-95"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Sign In</span>
              </button>
            )}
            <button
              id="admin-refresh-data-btn"
              onClick={loadAdminData}
              disabled={isLoading}
              className="px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Updating...' : 'Sync Live'}</span>
            </button>
            {onOpenGameManager && (
              <button
                id="admin-jump-games-btn"
                onClick={() => {
                  soundFx.playBoop(620);
                  onOpenGameManager();
                }}
                className="px-4 py-2 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-black shadow-md flex items-center gap-1.5 transition-all active:scale-95"
              >
                <Gamepad2 className="w-3.5 h-3.5" />
                <span>Manage Games Catalog</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Primary KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Sign Ups */}
        <div className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-xs hover:border-amber-300 transition-colors">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Total Sign Ups</span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-display font-black text-stone-900">
              {stats.totalUsers}
            </span>
            <span className="text-xs font-bold text-emerald-600 flex items-center">
              <ArrowUpRight className="w-3 h-3" />
              +{stats.newSignupsThisWeek} this wk
            </span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1">
            Active verified dog parents across all channels
          </p>
        </div>

        {/* Active Users */}
        <div className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-xs hover:border-orange-300 transition-colors">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Active Today / 7d</span>
            <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center text-orange-700">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-display font-black text-orange-600">
              {stats.activeToday}
            </span>
            <span className="text-xs font-semibold text-stone-500">
              / {stats.activeThisWeek} weekly
            </span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1">
            Parents engaging with games or training logs
          </p>
        </div>

        {/* Recorded Game Sessions */}
        <div className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-xs hover:border-blue-300 transition-colors">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Completed Sessions</span>
            <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700">
              <Gamepad2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-display font-black text-blue-600">
              {stats.totalPlaySessions}
            </span>
            <span className="text-xs font-bold text-blue-800">
              logged
            </span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1">
            Timer, video & quick interactive play logs
          </p>
        </div>

        {/* Total Play Minutes */}
        <div className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-xs hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Playtime Logged</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-display font-black text-emerald-700">
              {stats.totalMinutes}
            </span>
            <span className="text-xs font-bold text-stone-600">minutes</span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1">
            Total canine bonding and training time
          </p>
        </div>
      </div>

      {/* Provider Distribution & Usage Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Sign Up Channel Distribution */}
        <div className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-xs space-y-4">
          <h3 className="font-display font-black text-sm text-stone-900 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>Sign Up Channel Breakdown</span>
          </h3>
          <div className="space-y-2.5">
            {[
              { key: 'google', label: 'Google OAuth', count: stats.providerCounts.google, color: 'bg-red-500' },
              { key: 'facebook', label: 'Facebook / Meta', count: stats.providerCounts.facebook, color: 'bg-blue-600' },
              { key: 'instagram', label: 'Instagram', count: stats.providerCounts.instagram, color: 'bg-pink-600' },
              { key: 'email', label: 'Email & Password', count: stats.providerCounts.email, color: 'bg-stone-700' },
            ].map((item) => {
              const pct = stats.totalUsers > 0 ? Math.round((item.count / stats.totalUsers) * 100) : 0;
              return (
                <div key={item.key} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-stone-700">
                    <span className="capitalize">{item.label}</span>
                    <span className="text-stone-500">{item.count} users ({pct}%)</span>
                  </div>
                  <div className="h-2 rounded-full bg-stone-100 overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full transition-all duration-500`}
                      style={{ width: `${Math.max(pct, item.count > 0 ? 8 : 0)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Most Played Games in App */}
        <div className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-xs space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-black text-sm text-stone-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Top Played Games Across App</span>
            </h3>
            <span className="text-[11px] font-bold text-stone-400">Play session completions</span>
          </div>

          {stats.topGames.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {stats.topGames.map((g, idx) => (
                <div key={g.gameId || idx} className="p-3 rounded-2xl bg-stone-50 border border-stone-200/70 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-xs">
                      #{idx + 1}
                    </span>
                    <div>
                      <p className="text-xs font-bold text-stone-800 line-clamp-1">{g.title}</p>
                      <p className="text-[10px] text-stone-400">Game ID: {g.gameId}</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-xl bg-white text-stone-700 text-xs font-black shadow-2xs">
                    {g.count} plays
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-stone-50 text-center border border-dashed border-stone-200">
              <p className="text-xs text-stone-500 font-medium">
                No recorded game sessions yet. As users play games with timers and videos, their activity metrics will appear here.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Users Table & Explorer */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-stone-200/80 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-display font-black text-lg text-stone-900">
              User Roster & Activity Explorer
            </h3>
            <p className="text-xs text-stone-500">
              Showing {filteredUsers.length} of {users.length} registered accounts
            </p>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-[200px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                id="admin-search-users-input"
                type="text"
                placeholder="Search email, name, dog..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>

            <select
              id="admin-filter-provider"
              value={providerFilter}
              onChange={(e) => setProviderFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-bold text-stone-700 focus:outline-none"
            >
              <option value="all">All Providers</option>
              <option value="google">Google</option>
              <option value="facebook">Facebook</option>
              <option value="instagram">Instagram</option>
              <option value="email">Email</option>
            </select>

            <select
              id="admin-filter-role"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as any)}
              className="px-2.5 py-1.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-bold text-stone-700 focus:outline-none"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admins Only</option>
              <option value="pet_parent">Pet Parents</option>
            </select>
          </div>
        </div>

        {/* User Roster Table */}
        <div className="overflow-x-auto rounded-2xl border border-stone-200">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-stone-50/80 text-stone-500 font-bold uppercase tracking-wider text-[10px] border-b border-stone-200">
                <th className="py-3 px-4">User & Email</th>
                <th className="py-3 px-3">Role</th>
                <th className="py-3 px-3">Provider</th>
                <th className="py-3 px-3">Dog Profile</th>
                <th className="py-3 px-3">Sessions</th>
                <th className="py-3 px-3">Signed Up</th>
                <th className="py-3 px-3">Last Active</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700 font-medium">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-stone-400">
                    No users found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isAdmin = u.role === 'admin' || (u.email && ADMIN_EMAILS.includes(u.email.toLowerCase()));
                  const isCurrent = currentUser?.uid === u.uid;

                  return (
                    <tr
                      key={u.uid}
                      className="hover:bg-amber-50/40 transition-colors cursor-pointer"
                      onClick={() => setSelectedUser(u)}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          {u.photoURL ? (
                            <img
                              src={u.photoURL}
                              alt={u.displayName || 'User'}
                              className="w-8 h-8 rounded-xl object-cover shrink-0"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-xs shrink-0">
                              {u.displayName ? u.displayName[0].toUpperCase() : '🐾'}
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <p className="font-bold text-stone-900 truncate">
                                {u.displayName || 'Pup Parent'}
                              </p>
                              {isCurrent && (
                                <span className="px-1.5 py-0.5 rounded-md bg-stone-200 text-stone-700 text-[9px] font-black">
                                  YOU
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-stone-500 truncate">{u.email || 'No email specified'}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        {isAdmin ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-amber-800 text-[10px] font-black">
                            <ShieldCheck className="w-3 h-3" />
                            Admin
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 text-[10px] font-semibold">
                            Pet Parent
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-3">
                        <span className="capitalize px-2 py-0.5 rounded-lg bg-stone-100 text-stone-700 text-[11px] font-bold">
                          {u.provider}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        {u.dogProfile?.name ? (
                          <div className="flex items-center gap-1.5">
                            <span className="text-base">{u.dogProfile.avatarEmoji || '🐕'}</span>
                            <div>
                              <p className="font-bold text-stone-900 leading-none">{u.dogProfile.name}</p>
                              <p className="text-[10px] text-stone-400 capitalize">{u.dogProfile.breed || u.dogProfile.size}</p>
                            </div>
                          </div>
                        ) : (
                          <span className="text-stone-400 text-[11px]">Pending</span>
                        )}
                      </td>

                      <td className="py-3 px-3 font-bold text-stone-900">
                        {u.sessionCount || 0}
                      </td>

                      <td className="py-3 px-3 text-stone-500 whitespace-nowrap">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Unknown'}
                      </td>

                      <td className="py-3 px-3 text-stone-500 whitespace-nowrap">
                        {formatTimeAgo(u.lastActiveAt || u.createdAt)}
                      </td>

                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedUser(u);
                          }}
                          className="p-1 rounded-lg hover:bg-stone-200 text-stone-500 hover:text-stone-900 transition-colors"
                          title="View user details"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected User Modal Drilldown */}
      {selectedUser && (
        <div
          className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-stone-200 space-y-4 animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-3">
                {selectedUser.photoURL ? (
                  <img
                    src={selectedUser.photoURL}
                    alt={selectedUser.displayName || 'User'}
                    className="w-12 h-12 rounded-2xl object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-lg">
                    {selectedUser.displayName ? selectedUser.displayName[0].toUpperCase() : '🐾'}
                  </div>
                )}
                <div>
                  <h4 className="font-display font-black text-lg text-stone-900">
                    {selectedUser.displayName || 'Pup Parent'}
                  </h4>
                  <p className="text-xs text-stone-500">{selectedUser.email}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/80">
                <span className="text-[10px] font-bold uppercase text-stone-400">Account ID</span>
                <p className="font-mono text-stone-700 truncate mt-0.5">{selectedUser.uid}</p>
              </div>
              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/80">
                <span className="text-[10px] font-bold uppercase text-stone-400">Auth Channel</span>
                <p className="font-bold text-stone-800 capitalize mt-0.5">{selectedUser.provider}</p>
              </div>
              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/80">
                <span className="text-[10px] font-bold uppercase text-stone-400">Created At</span>
                <p className="font-semibold text-stone-800 mt-0.5">
                  {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleString() : 'N/A'}
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/80">
                <span className="text-[10px] font-bold uppercase text-stone-400">Last Seen</span>
                <p className="font-semibold text-stone-800 mt-0.5">
                  {selectedUser.lastActiveAt ? new Date(selectedUser.lastActiveAt).toLocaleString() : 'Active in session'}
                </p>
              </div>
            </div>

            {selectedUser.dogProfile && (
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                  <span className="flex items-center gap-1.5">
                    <Dog className="w-4 h-4 text-amber-700" />
                    <span>Active Dog: {selectedUser.dogProfile.name}</span>
                  </span>
                  <span>{selectedUser.dogProfile.avatarEmoji || '🐕'}</span>
                </div>
                <p className="text-xs text-amber-800">
                  {selectedUser.dogProfile.breed || 'Custom breed'} • {selectedUser.dogProfile.size} size • {selectedUser.dogProfile.energyLevel} energy
                </p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedUser.dogProfile.motivations?.map((m) => (
                    <span key={m} className="px-2 py-0.5 rounded-md bg-amber-200/80 text-amber-900 text-[10px] font-bold">
                      {m.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-stone-800"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
