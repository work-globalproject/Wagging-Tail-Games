import { localDay } from '../lib/playerData';
import React from 'react';
import { PlaySession, DogProfile, UserAccount } from '../types';
import { Flame, Trophy, Calendar, Clock, Heart, Award, Sparkles, Share2, Cloud, CheckCircle2 } from 'lucide-react';
import { soundFx } from '../utils/audio';
import CloudSyncBanner from './CloudSyncBanner';

interface Props {
  sessions: PlaySession[];
  dogProfile: DogProfile;
  currentUser: UserAccount | null;
  onOpenShareCard: () => void;
  onOpenAuth: () => void;
}

export const StatsDashboard: React.FC<Props> = ({
  sessions,
  dogProfile,
  currentUser,
  onOpenShareCard,
  onOpenAuth,
}) => {
  const now = new Date();
  const todayStr = localDay(now);

  // Filter today's sessions
  const todaySessions = sessions.filter((s) => s.durationSeconds > 0 && localDay(new Date(s.timestamp)) === todayStr);

  // Filter this week's sessions (last 7 days)
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const weekSessions = sessions.filter((s) => new Date(s.timestamp) >= oneWeekAgo);

  // Filter this month's sessions (last 30 days)
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const monthSessions = sessions.filter((s) => new Date(s.timestamp) >= oneMonthAgo);

  // Total play minutes
  const totalMinutes = Math.round(
    sessions.reduce((acc, s) => acc + s.durationSeconds, 0) / 60
  );

  // Category counts
  const categoryCounts = sessions.reduce(
    (acc, s) => {
      acc[s.category] = (acc[s.category] || 0) + 1;
      return acc;
    },
    { curiosity: 0, problem_solving: 0, agility: 0 } as Record<string, number>
  );

  const totalCount = sessions.length || 1;
  const curiosityPct = Math.round((categoryCounts.curiosity / totalCount) * 100);
  const problemPct = Math.round((categoryCounts.problem_solving / totalCount) * 100);
  const agilityPct = Math.round((categoryCounts.agility / totalCount) * 100);

  return (
    <div id="activity-tracking-section" className="space-y-6">
      {/* Top Banner: Lightweight Session Tally Today */}
      <div className="rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 p-6 text-white shadow-lg shadow-orange-500/15 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-left">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-3xl shrink-0 shadow-inner">
            {dogProfile.avatarEmoji || '🐕'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider bg-white/25 px-2.5 py-0.5 rounded-full">
                Today's Play Tally
              </span>
              <span className="flex items-center text-xs font-semibold text-amber-100">
                <Flame className="w-3.5 h-3.5 text-amber-200 fill-amber-200 mr-0.5" />
                {dogProfile.streakCount ? `${dogProfile.streakCount} day streak` : 'Start your streak'}
              </span>
            </div>
            <h2 className="font-display font-bold text-2xl sm:text-3xl mt-0.5">
              {todaySessions.length} {todaySessions.length === 1 ? 'Game' : 'Games'} Played Today!
            </h2>
            <p className="text-xs text-amber-100 mt-0.5">
              {todaySessions.length >= 2
                ? `Amazing work! ${dogProfile.name}'s play goal is complete. Make time for rest too.`
                : `Aim for 2-3 quick fun games daily to deepen your mutual bond.`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              soundFx.playBoop(600);
              onOpenShareCard();
            }}
            className="px-4 py-2.5 rounded-2xl bg-white text-stone-900 hover:bg-amber-50 font-bold text-xs shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <Share2 className="w-4 h-4 text-amber-600" />
            <span>Pup Trading Card & Secret Games</span>
          </button>
        </div>
      </div>

      {/* Cloud Sync Banner if not logged in */}
      {!currentUser && (
        <CloudSyncBanner
          dogName={dogProfile.name || 'your pup'}
          sessionsCount={sessions.length}
          onOpenAuth={onOpenAuth}
        />
      )}

      {/* Metric Cards Grid: Week, Month, Minutes, Balance */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-stone-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">This Week</span>
            <Calendar className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-display font-bold text-stone-900">
            {weekSessions.length} <span className="text-xs font-normal text-stone-500">sessions</span>
          </div>
          <p className="text-[11px] text-stone-500 mt-0.5">Last 7 days of play</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-stone-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">This Month</span>
            <Trophy className="w-4 h-4 text-orange-500" />
          </div>
          <div className="text-2xl font-display font-bold text-stone-900">
            {monthSessions.length} <span className="text-xs font-normal text-stone-500">sessions</span>
          </div>
          <p className="text-[11px] text-stone-500 mt-0.5">30-day activity total</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-stone-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Bonding Time</span>
            <Clock className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-display font-bold text-stone-900">
            {totalMinutes} <span className="text-xs font-normal text-stone-500">minutes</span>
          </div>
          <p className="text-[11px] text-stone-500 mt-0.5">Total shared play</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-stone-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Skill Variety</span>
            <Award className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-display font-bold text-stone-900">
            {[categoryCounts.curiosity, categoryCounts.problem_solving, categoryCounts.agility].filter((c) => c > 0).length} / 3 <span className="text-xs font-normal text-stone-500">pillars</span>
          </div>
          <p className="text-[11px] text-stone-500 mt-0.5">Curiosity, Agility, Logic</p>
        </div>
      </div>

      {/* Skill Balance Progress Bar */}
      <div className="p-5 rounded-2xl bg-white border border-stone-200/80 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-sm text-stone-900 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>{dogProfile.name}'s Skill Stimulus Balance</span>
          </h3>
          <span className="text-xs text-stone-500 font-medium">All-time ratio</span>
        </div>

        <div className="h-3 w-full rounded-full bg-stone-100 flex overflow-hidden">
          <div
            style={{ width: `${curiosityPct}%` }}
            className="h-full bg-amber-400 transition-all duration-500"
            title={`Curiosity: ${curiosityPct}%`}
          />
          <div
            style={{ width: `${problemPct}%` }}
            className="h-full bg-blue-500 transition-all duration-500"
            title={`Problem-Solving: ${problemPct}%`}
          />
          <div
            style={{ width: `${agilityPct}%` }}
            className="h-full bg-emerald-500 transition-all duration-500"
            title={`Agility: ${agilityPct}%`}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between text-xs text-stone-600 pt-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span>Curiosity ({curiosityPct}%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span>Problem-Solving ({problemPct}%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Agility ({agilityPct}%)</span>
          </div>
        </div>
      </div>

      {/* Recent Activity Log */}
      {sessions.length > 0 && (
        <div className="p-5 rounded-2xl bg-white border border-stone-200/80 shadow-2xs">
          <h3 className="font-display font-bold text-sm text-stone-900 mb-3 flex items-center justify-between">
            <span>Recent Play Moments</span>
            <span className="text-xs text-stone-400 font-normal">Last {Math.min(5, sessions.length)} logs</span>
          </h3>
          <div className="space-y-2">
            {sessions.slice(0, 5).map((s) => {
              const date = new Date(s.timestamp);
              const formattedDate = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
              return (
                <div
                  key={s.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-stone-50 hover:bg-stone-100/80 border border-stone-200/60 text-xs transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">
                      {s.category === 'curiosity' ? '👃' : s.category === 'problem_solving' ? '🧩' : '🏃'}
                    </span>
                    <div>
                      <div className="font-bold text-stone-900">{s.gameTitle}</div>
                      <div className="text-[11px] text-stone-500 flex items-center gap-1.5 flex-wrap">
                        <span>{formattedDate}</span>
                        <span>•</span>
                        <span>{Math.round(s.durationSeconds / 60)} min ({s.mode} mode)</span>
                        {s.isCloudSaved ? (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-100/90 px-1.5 py-0.2 rounded-md">
                            <Cloud className="w-2.5 h-2.5 text-emerald-600" />
                            <span>Cloud Saved</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-[10px] font-medium text-stone-400">
                            Local
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {s.rating && (
                      <div className="text-amber-500 font-bold">
                        {'★'.repeat(s.rating)}
                      </div>
                    )}
                    {s.photoOrVideoUrl && (
                      <div className="w-7 h-7 rounded-lg overflow-hidden border border-amber-300">
                        <img src={s.photoOrVideoUrl} alt="Moment" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
