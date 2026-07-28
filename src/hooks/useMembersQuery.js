// src/hooks/useMembersQuery.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMembers, createMember, updateMember, deleteMember } from '../api/memberApi';

export const useMembersQuery = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['members'],
    queryFn: getMembers,
  });

  const createMutation = useMutation({
    mutationFn: createMember,
    onSuccess: () => {
      queryClient.invalidateQueries(['members']);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateMember(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['members']);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMember,
    onSuccess: () => {
      queryClient.invalidateQueries(['members']);
    },
  });

  return {
    members: data || [],
    isLoading,
    error,
    createMember: createMutation.mutateAsync,
    updateMember: updateMutation.mutateAsync,
    deleteMember: deleteMutation.mutateAsync,
  };
};

export default useMembersQuery;
