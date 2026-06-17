import { useQuery } from '@tanstack/react-query';
import { leaderboardService } from '@/services/leaderboard';

export function useLeaderboard() {
  const mostXPQuery = useQuery({
    queryKey: ['leaderboard', 'most-xp'],
    queryFn: leaderboardService.getMostXP,
  });

  const mostTaughtQuery = useQuery({
    queryKey: ['leaderboard', 'most-taught'],
    queryFn: leaderboardService.getMostTaught,
  });

  const mostLearnedQuery = useQuery({
    queryKey: ['leaderboard', 'most-learned'],
    queryFn: leaderboardService.getMostLearned,
  });

  return {
    mostXP: mostXPQuery.data || [],
    isLoadingXP: mostXPQuery.isLoading,

    mostTaught: mostTaughtQuery.data || [],
    isLoadingTaught: mostTaughtQuery.isLoading,

    mostLearned: mostLearnedQuery.data || [],
    isLoadingLearned: mostLearnedQuery.isLoading,
  };
}
export default useLeaderboard;
