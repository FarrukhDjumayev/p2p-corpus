import { useDashboard } from '@/hooks/useDashboard';
import { useAuth } from '@/hooks/useAuth';
import { Card, Spinner, ProgressBar, EmptyState, Badge, Skeleton } from '@/components/ui';
import { SlotCard } from '@/components/slots';
import { useNavigate, Link } from 'react-router-dom';
import {
  Trophy,
  Zap,
  Coins,
  Compass,
  CalendarCheck,
  Search,
  PlusCircle,
  TrendingUp,
} from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { dashboard, isLoading, isError, refetch } = useDashboard();
  const { user } = useAuth();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-8 animate-fade-in font-ibm-plex-mono">
        {/* Header welcome slot skeleton */}
        <div className="bg-[#2A3442] p-6 sm:p-8 rounded-3xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex flex-col gap-3 w-full max-w-md">
            <Skeleton variant="text" className="w-1/2 h-6" />
            <Skeleton variant="text" className="w-[85%] h-4" />
          </div>
          <div className="flex gap-3 w-full md:w-auto h-11">
            <Skeleton variant="rect" className="w-[140px] h-full rounded-xl" />
            <Skeleton variant="rect" className="w-[140px] h-full rounded-xl" />
          </div>
        </div>

        {/* Gamification Statistics Matrix skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-[#2A3442] p-5 rounded-2xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Skeleton variant="circle" className="h-5 w-5" />
                <Skeleton variant="text" className="w-20 h-3" />
              </div>
              <Skeleton variant="text" className="w-12 h-8" />
              <Skeleton variant="text" className="w-24 h-3 mt-2" />
            </div>
          ))}
        </div>

        {/* Progress block skeleton */}
        <div className="bg-[#2A3442] p-6 rounded-3xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-4">
          <div className="flex justify-between items-center border-b-2 border-black pb-4">
            <Skeleton variant="text" className="w-40 h-3" />
            <Skeleton variant="rect" className="w-24 h-5 rounded-md" />
          </div>
          <Skeleton variant="rect" className="w-full h-8 rounded-xl" />
        </div>

        {/* Active evaluation slots skeleton */}
        <div className="flex flex-col gap-4">
          <div className="border-b-2 border-black pb-3">
            <Skeleton variant="text" className="w-48 h-4" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[#2A3442] p-6 rounded-3xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-4 animate-pulse-subtle">
                <div className="flex justify-between items-start border-b-2 border-black pb-4">
                  <div className="flex flex-col gap-2 w-[60%]">
                    <Skeleton variant="text" className="w-[45%] h-3" />
                    <Skeleton variant="text" className="w-full h-5" />
                  </div>
                  <Skeleton variant="rect" className="w-16 h-6 rounded-md" />
                </div>
                <div className="flex flex-col gap-3">
                  <Skeleton variant="text" className="w-3/4 h-3" />
                  <Skeleton variant="text" className="w-1/2 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError || !dashboard) {
    return (
      <div className="py-16 text-center flex flex-col items-center gap-6 bg-[#2A3442] border-2 border-black rounded-3xl p-8 max-w-md mx-auto shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-ibm-plex-mono text-white">
        <div className="h-12 w-12 rounded-full bg-red-500/10 border-2 border-red-500/30 flex items-center justify-center text-red-400 font-extrabold text-xl">
          !
        </div>
        <p className="text-sm font-semibold max-w-xs">Tizim ma‘lumotlarini yuklashda xatolik yuz berdi.</p>
        <button
          onClick={() => refetch()}
          className="px-5 py-2.5 bg-[#34495E] border-2 border-black hover:bg-gray-600 text-[#38C9E6] font-extrabold rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all text-xs uppercase tracking-wider font-montserrat"
        >
          Qayta urinish
        </button>
      </div>
    );
  }

  const { xp_to_next_level, active_slots } = dashboard;
  const currentLevelXp = user?.xp || 0;
  // Calculate relative level progress (assuming roughly 1000 XP per level sequence for clean visualization)
  const nextLevelTotal = currentLevelXp + xp_to_next_level;
  const levelProgressPercent = nextLevelTotal > 0 ? Math.round((currentLevelXp / nextLevelTotal) * 100) : 0;

  return (
    <div className="flex flex-col gap-8 animate-fade-in font-ibm-plex-mono">
      {/* Header welcome slot */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-[#2A3442] p-6 sm:p-8 rounded-3xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-xl sm:text-2xl font-black text-white font-montserrat tracking-tight leading-none">
            Salom, <span className="text-[#38C9E6]">@{user?.school21_login}</span>! 🧑‍💻
          </h1>
          <p className="text-xs text-[#B0BEC5] leading-relaxed">
            School21 Peer-to-Peer o‘qitish va baholash platformasidagi bugungi faolligingiz.
          </p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Link
            to="/slots"
            className="flex-1 md:flex-none h-11 px-5 rounded-xl bg-gradient-to-br from-[#38C9E6] to-[#43E8A0] text-black font-extrabold border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider font-montserrat"
          >
            <PlusCircle className="h-4 w-4" /> Dars e‘lon qilish
          </Link>
          <Link
            to="/search"
            className="flex-1 md:flex-none h-11 px-5 rounded-xl bg-[#34495E] hover:bg-gray-600 text-white font-extrabold border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider font-montserrat"
          >
            <Search className="h-4 w-4 text-[#38C9E6]" /> Slot Qidirish
          </Link>
        </div>
      </div>

      {/* Gamification Statistics Matrix */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Stat item: Level + XP */}
        <Card className="flex flex-col gap-2 relative overflow-hidden group">
          <div className="absolute top-0 right-0 h-16 w-16 bg-[#38C9E6]/5 rounded-full blur-xl transition-all" />
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-[#38C9E6]" />
            <span className="text-[10px] uppercase tracking-widest font-black text-[#B0BEC5] font-montserrat">
              Daraja (LEVEL)
            </span>
          </div>
          <p className="text-4xl font-black text-white mt-1 font-montserrat">{user?.level || 0}</p>
          <span className="text-[10px] text-[#B0BEC5] mt-auto flex items-center gap-1 font-bold">
            <TrendingUp className="h-3.5 w-3.5 text-[#43E8A0]" /> Jami XP: {user?.xp}
          </span>
        </Card>

        {/* Stat item: Peer Points */}
        <Card className="flex flex-col gap-2 relative overflow-hidden group">
          <div className="absolute top-0 right-0 h-16 w-16 bg-[#43E8A0]/5 rounded-full blur-xl transition-all font-montserrat" />
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-[#43E8A0] fill-[#43E8A0]/10" />
            <span className="text-[10px] uppercase tracking-widest font-black text-[#B0BEC5] font-montserrat">
              Ballar (Points)
            </span>
          </div>
          <p className="text-4xl font-black text-[#43E8A0] mt-1 font-montserrat">{user?.peer_points || 0}</p>
          <span className="text-[10px] text-[#B0BEC5] mt-auto">
            Guruh darslari uchun ajratilgan ball
          </span>
        </Card>

        {/* Stat item: Peer Coins */}
        <Card className="flex flex-col gap-2 relative overflow-hidden group">
          <div className="absolute top-0 right-0 h-16 w-16 bg-[#ffd740]/5 rounded-full blur-xl transition-all" />
          <div className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-[#ffd740] fill-[#ffd740]/10" />
            <span className="text-[10px] uppercase tracking-widest font-black text-[#B0BEC5] font-montserrat">
              Sikkalar (Coins)
            </span>
          </div>
          <p className="text-4xl font-black text-[#ffd740] mt-1 font-montserrat">{user?.peer_coins || 0}</p>
          <span className="text-[10px] text-[#B0BEC5] mt-auto font-medium">
            Do‘kon sotuvlari va sovrinlar valyutasi
          </span>
        </Card>

        {/* Stat item: Main Track */}
        <Card className="flex flex-col gap-2 relative overflow-hidden group">
          <div className="absolute top-0 right-0 h-16 w-16 bg-[#38C9E6]/5 rounded-full blur-xl transition-all" />
          <div className="flex items-center gap-2">
            <Compass className="h-5 w-5 text-[#38C9E6]" />
            <span className="text-[10px] uppercase tracking-widest font-black text-[#B0BEC5] font-montserrat">
              Yo‘nalishingiz
            </span>
          </div>
          <p className="text-lg font-black text-white mt-2 truncate font-montserrat">
            {user?.main_track || 'Tanlanmagan'}
          </p>
          <span className="text-[9px] text-[#B0BEC5] mt-auto uppercase font-bold tracking-wider">
            KOALITSIYA: <span className="text-[#38C9E6]">{user?.coalition_name || 'YO‘Q'}</span>
          </span>
        </Card>
      </div>

      {/* Gamification Progress Tracker */}
      <Card className="p-6">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center border-b-2 border-black pb-4">
            <span className="text-[10px] uppercase tracking-widest font-extrabold text-[#B0BEC5] font-montserrat">
              Keyingi darajagacha progress
            </span>
            <Badge type="secondary">{`Keyingi daraja: ${user ? user.level + 1 : 1}`}</Badge>
          </div>
          <ProgressBar
            percent={levelProgressPercent}
            labelLeft={`Hozirgi XP: ${user?.xp}`}
            labelRight={`Keyingi daraja: yana ${xp_to_next_level} XP zarur`}
          />
        </div>
      </Card>

      {/* Active evaluation slots */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center border-b-2 border-black pb-3">
          <span className="text-sm font-extrabold text-white flex items-center gap-2 font-montserrat uppercase tracking-wider">
            <CalendarCheck className="h-5 w-5 text-[#38C9E6]" /> Aktiv darslar va slotlarim
          </span>
          {active_slots.length > 0 && (
            <span className="text-[10px] text-[#B0BEC5] font-bold tracking-wider">
              JAMI: {active_slots.length} DARS
            </span>
          )}
        </div>

        {active_slots.length === 0 ? (
          <EmptyState
            title="Sizda kutilayotgan darslar yo'q"
            description="Kutilayotgan yoki boshlangan darslar topilmadi. O'qitish uchun yangi slot e'lon qiling yoki o'rganish uchun boshqa talabalarning slotlarini band qiling."
          >
            <div className="flex gap-4 justify-center">
              <Link
                to="/slots"
                className="h-11 px-6 rounded-xl bg-gradient-to-br from-[#38C9E6] to-[#43E8A0] text-black border-2 border-black font-extrabold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all flex items-center justify-center text-xs uppercase tracking-wider font-montserrat"
              >
                Yangi dars ochish
              </Link>
              <Link
                to="/search"
                className="h-11 px-6 rounded-xl bg-[#34495E] hover:bg-gray-600 text-white border-2 border-black font-extrabold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all flex items-center justify-center text-xs uppercase tracking-wider font-montserrat"
              >
                Dars qidirish
              </Link>
            </div>
          </EmptyState>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {active_slots.map((slot) => (
              <SlotCard key={slot.id} slot={slot} currentUserId={user?.id} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
