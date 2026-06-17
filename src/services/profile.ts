import { api } from '@/lib/axios';
import { UserMe, UserPublic, ProfileStats } from '@/types/api';

export interface MyProfileResponse {
  user: UserMe;
  stats: ProfileStats;
}

export const profileService = {
  async getMyProfile(): Promise<MyProfileResponse> {
    const { data } = await api.get<MyProfileResponse>('/profile/');
    return data;
  },

  async updateProfile(payload: {
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
  }): Promise<UserMe> {
    const { data } = await api.patch<UserMe>('/profile/', payload);
    return data;
  },

  async getSkills(): Promise<Record<string, number>> {
    const { data } = await api.get<Record<string, number>>('/profile/skills');
    return data;
  },

  async getPublicProfile(username: string): Promise<UserPublic> {
    const { data } = await api.get<UserPublic>(`/profile/${username}`);
    return data;
  },
};
