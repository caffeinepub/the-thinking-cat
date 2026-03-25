import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AffiliateProduct, BlogPost } from "../backend.d";
import { useActor } from "./useActor";

export function useGetAllBlogPosts() {
  const { actor, isFetching } = useActor();
  return useQuery<BlogPost[]>({
    queryKey: ["blogPosts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllBlogPosts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllAffiliateProducts() {
  const { actor, isFetching } = useActor();
  return useQuery<AffiliateProduct[]>({
    queryKey: ["affiliateProducts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllAffiliateProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitFeedback() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      email,
      message,
    }: { name: string; email: string; message: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.submitFeedback(name, email, message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feedback"] });
    },
  });
}
