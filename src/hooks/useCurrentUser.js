"use client";

import useSWR from "swr";
import fetcher from "@/lib/auth/fetcher";

export default function useCurrentUser() {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  const { data, error, isLoading, mutate } = useSWR(
    token ? "/api/auth/me" : null,
    fetcher
  );

  return {
    user: data,
    isLoading,
    isError: error,
    mutate,
  };
}