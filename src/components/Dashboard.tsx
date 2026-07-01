import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSlots } from '@/hooks/useSlots';
import { useAuth } from '@/hooks/useAuth';
import { useDashboard } from '@/hooks/useDashboard';
import { useNotifications } from '@/hooks/useNotifications';
import { Slot, Notification } from '@/types/api';
import { formatDateTime, formatRelativeTime } from '@/lib/utils';
import { Button, Card, Badge } from '@/components/ui';
import {
  Clock,
  ArrowRight,
  User,
  Bell,
  CalendarDays
} from 'lucide-react';

export function Dashboard() {
  const { user: authUser } = useAuth();
  const navigate = useNavigate();

  // Peer Learn API Hooks
  const { dashboard, isLoading: isLoadingDashboard } = useDashboard();
  const { slots, isLoadingSlots } = useSlots();
  const { notifications, markAsRead } = useNotifications();

  const currentUser = dashboard?.user || authUser;
  const levelProgress = dashboard?.xp_to_next_level ?? 65;

  // Filter up to 3 upcoming slots related to the current user (my schedule)
  const mySchedule = useMemo(() => {
    if (!slots || !currentUser?.id) return [];
    return slots
      .filter((slot: Slot) => {
        const isMySlot = slot.reviewer_id === currentUser.id || slot.reviewee_id === currentUser.id;
        return isMySlot && (slot.status === 'open' || slot.status === 'booked' || slot.status === 'in_progress');
      })
      .slice(0, 3);
  }, [slots, currentUser?.id]);

  // Filter 3 of the latest available open slots for discovery
  const availableSlots = useMemo(() => {
    if (!slots) return [];
    return slots
      .filter((slot: Slot) => slot.status === 'open' && slot.reviewer_id !== currentUser?.id)
      .slice(0, 3);
  }, [slots, currentUser?.id]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in text-[#dde4e0] flex flex-col gap-10 text-left font-ibm-plex-mono">
      
      {/* ── PROFILE HEADER SECTION (Calendar Aesthetic) ── */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b-2 border-black/30">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="h-16 w-16 rounded-full border-2 border-black bg-[#1E2A38] overflow-hidden flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              {currentUser?.avatar_url ? (
                <img 
                  src={currentUser.avatar_url} 
                  alt={currentUser.school21_login} 
                  className="h-full w-full object-cover" 
                  referrerPolicy="no-referrer"
                />
              ) : (
                <User className="h-6 w-6 text-[#38C9E6]" />
              )}
            </div>
            <span className="absolute -bottom-1 -right-1 bg-[#43E8A0] text-black text-[9px] font-black px-1.5 py-0.5 rounded-full border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
              Lvl {currentUser?.level ?? 1}
            </span>
          </div>

          <div>
            <h1 className="text-xl font-black text-white font-montserrat tracking-tight leading-none">
              {currentUser?.first_name || currentUser?.school21_login || 'Talaba'}
            </h1>
            <p className="text-xs text-[#B0BEC5] flex items-center gap-1.5 mt-1.5 leading-none">
              <span>{currentUser?.core_program || 'Asosiy dastur'}</span>
              <span>·</span>
              <span className="text-[#43E8A0] font-bold">{currentUser?.main_track || 'Yo‘nalish'}</span>
            </p>
          </div>
        </div>

        {/* Level XP Progress Bar with Calendar style theme */}
        <div className="w-full md:w-[240px] flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[10px] font-bold">
            <span className="text-[#B0BEC5]">Daraja Progressi</span>
            <span className="text-[#43E8A0] font-black">{levelProgress}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-black/40 border border-black overflow-hidden shadow-[inset_1px_1px_1px_rgba(0,0,0,0.5)]">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-[#38C9E6] to-[#43E8A0] transition-all duration-300"
              style={{ width: `${levelProgress}%` }}
            />
          </div>
        </div>
      </header>

      {/* ── KEY PERFORMANCE STATS ROW (Neobrutalist cards) ── */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4" id="stats-performance-cards">
        {[
          { label: 'Koalitsiya', value: currentUser?.coalition_name || 'Koalitsiyasiz', badgeType: 'secondary' as const },
          { label: 'Peer Ball', value: `${currentUser?.peer_points ?? 0} PRP`, badgeType: 'gold' as const },
          { label: 'Tajriba', value: `${currentUser?.xp ?? 0} XP`, badgeType: 'primary' as const },
          { label: 'Joylashuv', value: currentUser?.current_location || 'Oflayn', badgeType: 'success' as const },
        ].map((stat, idx) => (
          <div 
            key={idx} 
            className="bg-[#2A3442] border-2 border-black rounded-2xl p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex flex-col text-left gap-1"
          >
            <span className="text-[9px] text-[#B0BEC5] uppercase tracking-widest font-black leading-none">{stat.label}</span>
            <span className="text-sm font-black text-white font-montserrat truncate mt-1">
              {stat.value}
            </span>
          </div>
        ))}
      </section>

      {/* ── CENTRAL AGENDA & ACTIVITY LAYOUT ── */}
      <main className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* PANEL A: UPCOMING SCHEDULE */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b-2 border-black/20 pb-2">
            <h2 className="text-xs font-black text-[#B0BEC5] uppercase tracking-wider font-montserrat flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4 text-[#38C9E6]" />
              Mening darslarim
            </h2>
            <Link 
              to="/slots" 
              className="text-[10px] font-black text-[#38C9E6] hover:text-[#43E8A0] transition-colors uppercase font-montserrat"
            >
              Barchasi ➜
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            {isLoadingDashboard || isLoadingSlots ? (
              <div className="py-8 flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#38C9E6]" />
              </div>
            ) : mySchedule.length === 0 ? (
              <div className="py-8 px-4 rounded-2xl border-2 border-black bg-[#1E2A38]/30 flex flex-col items-center justify-center text-center gap-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <p className="text-xs text-[#B0BEC5]">Yaqin orada darslaringiz yo‘q.</p>
                <Button 
                  variant="primary"
                  onClick={() => navigate('/slots')}
                  className="h-8 px-4 text-[9px]"
                >
                  Dars ochish +
                </Button>
              </div>
            ) : (
              mySchedule.map((slot) => {
                const isReviewer = slot.reviewer_id === currentUser?.id;
                const statusType = slot.status === 'open' ? 'success' : slot.status === 'booked' ? 'primary' : 'warning';
                
                return (
                  <Card 
                    key={slot.id}
                    onClick={() => navigate(`/slots/${slot.id}`)}
                    className="flex flex-col gap-2 bg-[#2A3442] hover:bg-[#34495E]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex flex-col min-w-0">
                        <span className="text-[8px] font-black text-[#B0BEC5] tracking-widest uppercase">
                          {isReviewer ? 'Reviewer (Siz)' : 'Reviewee (Siz)'}
                        </span>
                        <h3 className="text-sm font-black text-white font-montserrat truncate mt-1">
                          {slot.reviewer_project}
                        </h3>
                      </div>
                      <Badge type={statusType}>
                        {slot.status === 'open' ? 'Ochiq' : slot.status === 'booked' ? 'Band' : 'Faol'}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-3 text-[10px] text-[#B0BEC5] font-bold border-t border-black/10 pt-2 mt-1">
                      <Clock className="h-3.5 w-3.5 text-[#38C9E6]" />
                      <span>{formatDateTime(slot.start_time)}</span>
                      <span>·</span>
                      <span className="uppercase text-white">{slot.campus}</span>
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        </section>

        {/* PANEL B: RECENT NOTIFICATIONS */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b-2 border-black/20 pb-2">
            <h2 className="text-xs font-black text-[#B0BEC5] uppercase tracking-wider font-montserrat flex items-center gap-1.5">
              <Bell className="h-4 w-4 text-[#38C9E6]" />
              Bildirishnomalar
            </h2>
            <Link 
              to="/notifications" 
              className="text-[10px] font-black text-[#38C9E6] hover:text-[#43E8A0] transition-colors uppercase font-montserrat"
            >
              Barchasi ➜
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            {notifications.slice(0, 3).length === 0 ? (
              <div className="py-8 px-4 rounded-2xl border-2 border-black bg-[#1E2A38]/30 flex items-center justify-center text-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <p className="text-xs text-[#B0BEC5]">Yangi xabarlar yo‘q.</p>
              </div>
            ) : (
              notifications.slice(0, 3).map((notif: Notification) => (
                <Card 
                  key={notif.id}
                  onClick={() => {
                    if (!notif.is_read) {
                      try { markAsRead(notif.id); } catch(e) {}
                    }
                    if (notif.slot_id) {
                      navigate(`/slots/${notif.slot_id}`);
                    }
                  }}
                  className={`flex flex-col text-left relative ${!notif.is_read ? 'border-l-4 border-l-[#43E8A0]' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] text-[#B0BEC5] font-black">
                      {formatRelativeTime(notif.created_at)}
                    </span>
                    {!notif.is_read && (
                      <span className="h-2 w-2 rounded-full bg-[#43E8A0]" />
                    )}
                  </div>
                  <h4 className="text-xs font-extrabold text-white mt-1.5 font-montserrat">
                    {notif.title || 'Bildirishnoma'}
                  </h4>
                  <p className="text-[11px] text-[#B0BEC5] mt-1 line-clamp-1">
                    {notif.body}
                  </p>
                </Card>
              ))
            )}
          </div>
        </section>

      </main>

      {/* ── AVAILABLE SLOTS DISCOVERY GRID (Calendar Styled Cards) ── */}
      <section className="border-t-2 border-black/20 pt-8 flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h2 className="text-xs font-black text-[#B0BEC5] uppercase tracking-wider font-montserrat">
              Mavjud Peer Slotlari
            </h2>
            <p className="text-[11px] text-[#B0BEC5] mt-0.5">Baholash uchun boshqa talabalar ochgan bo'sh uchrashuvlar</p>
          </div>
          <Link 
            to="/slots" 
            className="text-[10px] font-black text-[#38C9E6] hover:text-[#43E8A0] transition-colors uppercase font-montserrat"
          >
            Barchasini ko'rish ➜
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {isLoadingSlots ? (
            [1, 2, 3].map((n) => (
              <div key={n} className="bg-[#2A3442] border-2 border-black rounded-2xl h-24 animate-pulse shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]" />
            ))
          ) : availableSlots.length === 0 ? (
            <div className="col-span-3 py-6 text-center border-2 border-black rounded-2xl bg-[#1E2A38]/30 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <p className="text-xs text-[#B0BEC5]">Hozirda bo'sh peer slotlari topilmadi.</p>
            </div>
          ) : (
            availableSlots.map((slot) => (
              <Card 
                key={slot.id}
                onClick={() => navigate(`/slots/${slot.id}`)}
                className="flex flex-col gap-2 justify-between"
              >
                <div className="flex flex-col">
                  <span className="text-[8px] font-black text-[#B0BEC5] uppercase tracking-widest leading-none">Mavjud uchrashuv</span>
                  <h4 className="text-xs font-black text-white mt-1.5 font-montserrat truncate">
                    {slot.reviewer_project}
                  </h4>
                </div>
                
                <div className="flex flex-col gap-0.5 text-[10px] text-[#B0BEC5] border-t border-black/10 pt-2 mt-2 font-bold">
                  <span className="truncate text-[#38C9E6]">{formatDateTime(slot.start_time)}</span>
                  <span className="uppercase text-white text-[9px]">{slot.campus}</span>
                </div>
              </Card>
            ))
          )}
        </div>
      </section>

      {/* ── QUICK ACTION FOOTER ── */}
      <footer className="border-t-2 border-black/30 pt-6 mt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-[#B0BEC5] text-center sm:text-left">
          Loyiha baholatish yoki boshqalarni baholash uchun dars slotini boshqaring.
        </p>
        <Button
          variant="primary"
          onClick={() => navigate('/slots')}
          className="w-full sm:w-auto h-10 px-5 text-xs font-extrabold"
        >
          Dars slotlari <ArrowRight className="h-4 w-4" />
        </Button>
      </footer>

    </div>
  );
}

export default Dashboard;
