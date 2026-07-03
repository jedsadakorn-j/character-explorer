import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@character_explorer:favorites';

// Context lets ANY component read/toggle favorites without passing props down
// through every screen. The value is provided once at the top of the app.
const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  // Favorites are stored as a map of id -> character object, so we can both
  // check membership quickly (favorites[id]) and later list the full objects.
  const [favorites, setFavorites] = useState({});
  const [loaded, setLoaded] = useState(false);

  // 1. Load saved favorites from disk once, when the app starts.
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setFavorites(JSON.parse(raw));
      } catch (err) {
        console.warn('Failed to load favorites', err);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  // 2. Persist to disk whenever favorites change — but not until the initial
  // load finished, otherwise we'd overwrite stored data with the empty {}.
  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(favorites)).catch((err) =>
      console.warn('Failed to save favorites', err)
    );
  }, [favorites, loaded]);

  const toggleFavorite = useCallback((character) => {
    setFavorites((prev) => {
      const next = { ...prev };
      if (next[character.id]) {
        delete next[character.id]; // already a favorite -> remove
      } else {
        next[character.id] = character; // not yet -> add
      }
      return next;
    });
  }, []);

  const isFavorite = useCallback((id) => Boolean(favorites[id]), [favorites]);

  // useMemo keeps the context value stable between renders unless something
  // actually changed, avoiding needless re-renders of consumers.
  const value = useMemo(
    () => ({ favorites, toggleFavorite, isFavorite }),
    [favorites, toggleFavorite, isFavorite]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

// Small convenience hook so components just call useFavorites().
export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error('useFavorites must be used inside a <FavoritesProvider>');
  }
  return ctx;
}
