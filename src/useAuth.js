import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuth = create()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,

      setAccessToken: (token) =>
        set({
          accessToken: token,
        }),

      setUser: (user) =>
        set({
          user: user,
        }),
      logout: () =>
        set({
          accessToken: null,
          user: null,
        }),
    }),
    {
      name: "auth",
    }
  )
);
