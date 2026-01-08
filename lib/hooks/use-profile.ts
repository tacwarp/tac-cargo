"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  role: string;
  preferences: {
    theme?: "light" | "dark" | "system";
    notifications?: boolean;
  };
  organization?: {
    id: string;
    name: string;
    slug: string;
    logo_url?: string;
  };
}

interface UpdateProfileData {
  full_name?: string;
  phone?: string;
  avatar_url?: string;
  preferences?: Record<string, unknown>;
}

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const response = await fetch("/api/profile");
      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }
      const data = await response.json();
      return data.profile as Profile;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateProfileData) => {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update profile");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}

export function useOrganization() {
  return useQuery({
    queryKey: ["organization"],
    queryFn: async () => {
      const response = await fetch("/api/organization");
      if (!response.ok) {
        throw new Error("Failed to fetch organization");
      }
      const data = await response.json();
      return data.organization;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const response = await fetch("/api/organization", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update organization");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organization"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}
