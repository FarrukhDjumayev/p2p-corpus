import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout';
import { AuthGuard, GuestGuard } from '@/components/guards';
import { Spinner } from '@/components/ui';

// Lazy loading our 12 interactive views
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const OnboardingPage = lazy(() => import('@/pages/OnboardingPage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const SlotsPage = lazy(() => import('@/pages/SlotsPage'));
const SlotDetailPage = lazy(() => import('@/pages/SlotDetailPage'));
const SearchPage = lazy(() => import('@/pages/SearchPage'));
const LeaderboardPage = lazy(() => import('@/pages/LeaderboardPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const UserProfilePage = lazy(() => import('@/pages/UserProfilePage'));
const ReviewPage = lazy(() => import('@/pages/ReviewPage'));
const NotificationsPage = lazy(() => import('@/pages/NotificationsPage'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));

// High-contrast page suspense loader
const PageSuspense = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<Spinner fullScreen />}>
    {children}
  </Suspense>
);

export const router = createBrowserRouter([
  // Guest-only area
  {
    path: '/login',
    element: (
      <GuestGuard>
        <PageSuspense>
          <LoginPage />
        </PageSuspense>
      </GuestGuard>
    ),
  },

  // Onboarding area (protected, sets onboarding_done once complete)
  {
    path: '/onboarding',
    element: (
      <AuthGuard>
        <PageSuspense>
          <OnboardingPage />
        </PageSuspense>
      </AuthGuard>
    ),
  },

  // Authenticated Workspace Area with dynamic global layouts
  {
    path: '/',
    element: (
      <AuthGuard>
        <AppLayout />
      </AuthGuard>
    ),
    children: [
      {
        path: '',
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: (
          <PageSuspense>
            <DashboardPage />
          </PageSuspense>
        ),
      },
      {
        path: 'slots',
        element: (
          <PageSuspense>
            <SlotsPage />
          </PageSuspense>
        ),
      },
      {
        path: 'slots/:id',
        element: (
          <PageSuspense>
            <SlotDetailPage />
          </PageSuspense>
        ),
      },
      {
        path: 'search',
        element: (
          <PageSuspense>
            <SearchPage />
          </PageSuspense>
        ),
      },
      {
        path: 'leaderboard',
        element: (
          <PageSuspense>
            <LeaderboardPage />
          </PageSuspense>
        ),
      },
      {
        path: 'profile',
        element: (
          <PageSuspense>
            <ProfilePage />
          </PageSuspense>
        ),
      },
      {
        path: 'profile/:username',
        element: (
          <PageSuspense>
            <UserProfilePage />
          </PageSuspense>
        ),
      },
      {
        path: 'review',
        element: (
          <PageSuspense>
            <ReviewPage />
          </PageSuspense>
        ),
      },
      {
        path: 'notifications',
        element: (
          <PageSuspense>
            <NotificationsPage />
          </PageSuspense>
        ),
      },
      {
        path: 'settings',
        element: (
          <PageSuspense>
            <SettingsPage />
          </PageSuspense>
        ),
      },
    ],
  },

  // Fallback Catch All redirects unauthenticated or logged out users cleanly
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
]);
export default router;
