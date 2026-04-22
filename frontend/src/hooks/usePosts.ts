import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import { Post, AuthResponse } from '@/types';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';

export const usePosts = (params = {}) => {
  return useQuery({
    queryKey: ['posts', params],
    queryFn: async () => {
      const { data } = await api.get('/posts', { params });
      return data;
    },
  });
};

export const usePost = (slug: string) => {
  return useQuery({
    queryKey: ['post', slug],
    queryFn: async () => {
      const { data } = await api.get(`/posts/${slug}`);
      return data as Post;
    },
    enabled: !!slug,
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (newPost: any) => {
      const { data } = await api.post('/posts', newPost);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      router.push('/blogs');
    },
  });
};
