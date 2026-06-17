import { api } from '@/lib/axios';
import { Review, ReviewCreate } from '@/types/api';

export const reviewsService = {
  async createReview(payload: ReviewCreate): Promise<Review> {
    const { data } = await api.post<Review>('/reviews/', payload);
    return data;
  },

  async getMyReviews(): Promise<Review[]> {
    const { data } = await api.get<Review[]>('/reviews/my');
    return data;
  },

  async getUserReviews(userId: string): Promise<Review[]> {
    const { data } = await api.get<Review[]>(`/reviews/user/${userId}`);
    return data;
  },
};
