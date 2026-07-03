import { useState, useEffect, useCallback } from 'react';

const BASE_URL = 'https://rickandmortyapi.com/api/character';

// Custom hook: owns everything about *fetching characters* for a given
// search query. The UI just calls it and renders the returned state.
// Passing `query` in makes the hook re-fetch whenever the search changes.
export function useCharacters(query) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      const url = query ? `${BASE_URL}/?name=${encodeURIComponent(query)}` : BASE_URL;
      const response = await fetch(url);

      // The Rick & Morty API returns 404 when a name search matches nothing.
      // That's an empty result for us, not a real error.
      if (response.status === 404) {
        setData([]);
        setError(null);
        return;
      }
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const json = await response.json();
      setData(json.results);
      setError(null);
    } catch (err) {
      setError(err.message);
      setData([]);
    }
  }, [query]);

  // Re-run whenever `load` changes (i.e. whenever `query` changes).
  useEffect(() => {
    setIsLoading(true);
    load().finally(() => setIsLoading(false));
  }, [load]);

  // Pull-to-refresh / retry: same fetch, different spinner.
  const refresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  return { data, isLoading, refreshing, error, refresh };
}
