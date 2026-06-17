import { useState } from 'react';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { Card, Badge, Spinner, Skeleton } from '@/components/ui';
import { Trophy, Award, Zap, BookOpen, GraduationCap, Medal } from 'lucide-react';

type TabType = 'xp' | 'taught' | 'learned';

interface RankedItemProps {
  rank: number;
  login: string;
  value: number;
  labelSuffix: string;
}

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<TabType>('xp');
  const { mostXP, mostTaught, mostLearned, isLoadingXP, isLoadingTaught, isLoadingLearned } = useLeaderboard();

  // Pick data and loading flag matching active tab
  const getTabData = () => {
    switch (activeTab) {
      case 'xp':
        return { data: mostXP, loading: isLoadingXP, suffix: 'XP' };
      case 'taught':
        return { data: mostTaught, loading: isLoadingTaught, suffix: 'marta' };
      case 'learned':
        return { data: mostLearned, loading: isLoadingLearned, suffix: 'marta' };
    }
  };

  const { data: rankedList = [], loading, suffix } = getTabData();

  const getRankBadgeColors = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-[#ffd740] text-black border-black';
      case 2:
        return 'bg-[#cdbdff] text-black border-black';
      case 3:
        return 'bg-[#ff9b9b] text-black border-black';
      default:
        return 'bg-[#34495E] text-white border-black';
    }
  };

  const tabs = [
    { key: 'xp' as TabType, label: 'Jami XP', icon: Zap },
    { key: 'taught' as TabType, label: 'Ko‘p o‘rgatganlar', icon: GraduationCap },
    { key: 'learned' as TabType, label: 'Ko‘p o‘rganganlar', icon: BookOpen },
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in font-ibm-plex-mono text-white">
      {/* Header */}
      <div className="flex flex-col gap-1.5">
        <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2 font-montserrat tracking-tight leading-none">
          <Trophy className="h-6 w-6 text-[#ffd740] fill-[#ffd740]/20" /> Koalitsiya Reytingi
        </h1>
        <p className="text-xs text-[#B0BEC5] leading-relaxed">
          Joriy oy davomida eng faol qatnashgan School21 student va koalitsiya a‘zolari jadvali.
        </p>
      </div>

      {/* Tabs list */}
      <div className="flex border-b-2 border-black pb-3 gap-2 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider font-montserrat border-2 select-none transition-all duration-150 whitespace-nowrap cursor-pointer
                ${
                  isActive
                    ? 'bg-gradient-to-br from-[#38C9E6] to-[#43E8A0] border-black text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                    : 'bg-transparent border-transparent text-[#B0BEC5] hover:text-white hover:bg-gray-600/30'
                }
              `}
            >
              <Icon className="h-4 w-4" /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Leaderboard content listing */}
      {loading ? (
        <div className="flex flex-col gap-5">
          {/* Top Rank spotlights skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-2 animate-pulse-subtle">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-6 flex flex-col items-center text-center border-2 border-black bg-[#2A3442] rounded-3xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] gap-4">
                <Skeleton variant="circle" className="h-10 w-10" />
                <Skeleton variant="text" className="w-[50%] h-4" />
                <Skeleton variant="text" className="w-[30%] h-3" />
                <Skeleton variant="rect" className="w-full h-8 rounded-xl" />
              </div>
            ))}
          </div>
          {/* List items skeleton */}
          <div className="border-2 border-black bg-[#2A3442] rounded-3xl divide-y-2 divide-black animate-pulse-subtle">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 px-6 gap-4">
                <div className="flex items-center gap-4 w-full">
                  <Skeleton variant="rect" className="h-8 w-8 rounded-lg" />
                  <div className="flex flex-col gap-2 w-[40%]">
                    <Skeleton variant="text" className="w-full h-4" />
                    <Skeleton variant="text" className="w-1/4 h-2.5" />
                  </div>
                </div>
                <Skeleton variant="text" className="w-16 h-4" />
              </div>
            ))}
          </div>
        </div>
      ) : rankedList.length === 0 ? (
        <Card className="text-center py-12">
          <Medal className="h-12 w-12 text-[#B0BEC5] mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-white">Reyting bo‘sh</h3>
          <p className="text-xs text-[#B0BEC5] mt-1">Ushbu tur yozuvlari hali hisoblab chiqilmagan.</p>
        </Card>
      ) : (
        <div className="flex flex-col gap-5">
          {/* Top Rank spotlights if they exist */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-2">
            {rankedList.slice(0, 3).map((item) => (
              <Card
                key={item.user_id}
                className={`p-6 flex flex-col items-center text-center relative overflow-hidden group border-2 rounded-3xl
                  ${
                    item.rank === 1
                      ? 'border-black bg-gradient-to-br from-[#ffd740]/25 to-[#ffd740]/5'
                      : item.rank === 2
                      ? 'border-black bg-[#2A3442]'
                      : 'border-black bg-[#2A3442]'
                  }
                `}
              >
                {/* Visual rank medal */}
                <div
                  className={`h-10 w-10 rounded-xl flex items-center justify-center font-extrabold text-sm border-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] mb-4 font-montserrat
                    ${getRankBadgeColors(item.rank)}
                  `}
                >
                  {item.rank}
                </div>

                {/* Information */}
                <span className="text-base font-extrabold text-white truncate max-w-full font-montserrat tracking-tight">
                  @{item.first_name || 'Talaba'}
                </span>
                <span className="text-[10px] text-[#B0BEC5] font-bold tracking-widest uppercase mt-1">
                  RANK SPOTLIGHT
                </span>

                <div className="mt-4 px-4 py-2 rounded-xl bg-[#34495E] border-2 border-black w-full text-center shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                  <span className="text-xs font-black text-[#43E8A0] font-ibm-plex-mono">
                    {item.value} {suffix}
                  </span>
                </div>
              </Card>
            ))}
          </div>

          {/* Standard rows listings */}
          <Card className="p-0 overflow-hidden border-2 border-black bg-[#2A3442] rounded-3xl">
            <div className="divide-y-2 divide-black">
              {rankedList.map((item) => (
                <div
                  key={item.user_id}
                  className="flex items-center justify-between p-4 px-6 hover:bg-gray-600/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {/* Rank Indicator */}
                    <div
                      className={`h-8 w-8 rounded-lg border-2 flex items-center justify-center text-xs font-black font-ibm-plex-mono shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]
                        ${getRankBadgeColors(item.rank)}
                      `}
                    >
                      {item.rank}
                    </div>

                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-white">
                        @{item.first_name || 'Talaba'}
                      </span>
                      <span className="text-[9px] text-[#B0BEC5] font-bold uppercase tracking-wider">
                        S21 KEY MEMBER
                      </span>
                    </div>
                  </div>

                  {/* Value */}
                  <span className="text-xs font-black text-[#38C9E6] font-ibm-plex-mono">
                    {item.value} {suffix}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

