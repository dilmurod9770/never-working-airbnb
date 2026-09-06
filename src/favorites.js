import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useFavoret = create(
  persist(
    (set) => ({
      favorites: [],

      toggleFavorite: (listing) =>
        set((state) => {
          const bor = state.favorites.find(
            (item) => item?.id === listing?.id
          );

          return {
            favorites: bor
              ? state.favorites.filter(
                  (item) => item?.id !== listing?.id
                )
              : [...state.favorites, listing],
          };
        }),
    }),
    {
      name: "favorites",
    }
  )
);