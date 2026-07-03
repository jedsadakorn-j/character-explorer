import { useState, useEffect, useCallback, useRef } from 'react';

const BASE_URL = 'https://rickandmortyapi.com/api/character';

// Data hook for the character list. It owns fetching, filtering (name + status),
// and pagination. Callers pass the current filters and get back state plus a
// loadMore() to append the next page.
export function useCharacters({ query = '', status = '' } = {}) {
  const [data, setData] = useState([]);
  const [info, setInfo] = useState(null); // API pagination meta: { count, pages, next, prev }
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true); // first page
  const [isLoadingMore, setIsLoadingMore] = useState(false); // next pages
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Holds the AbortController for the in-flight request. Sharing it in a ref
  // lets a filter change cancel BOTH the first-page fetch and any load-more.
  const abortRef = useRef(null);

  const buildUrl = useCallback(
    (pageNum) => {
      let url = `${BASE_URL}/?page=${pageNum}`;
      if (query) url += `&name=${encodeURIComponent(query)}`;
      if (status) url += `&status=${encodeURIComponent(status)}`;
      return url;
    },
    [query, status]
  );

  // Fetch a single page. Returns { results, info }. Treats the API's 404
  // ("no matches") as an empty result rather than an error.
  const fetchPage = useCallback(
    async (pageNum, signal) => {
      const response = await fetch(buildUrl(pageNum), { signal });
      if (response.status === 404) return { results: [], info: null };
      if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
      return response.json();
    },
    [buildUrl]
  );

  // Whenever the filters change, cancel any in-flight request and reload page 1.
  useEffect(() => {
    const controller = new AbortController();
    abortRef.current = controller;

    setIsLoading(true);
    setError(null);
    fetchPage(1, controller.signal)
      .then((json) => {
        setData(json.results);
        setInfo(json.info);
        setPage(1);
      })
      .catch((err) => {
        if (err.name === 'AbortError') return; // a newer request superseded this one
        setError(err.message);
        setData([]);
        setInfo(null);
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    // Cleanup runs on unmount AND before the next effect (filters changed).
    return () => controller.abort();
  }, [fetchPage]);

  // Append the next page. Called by FlatList's onEndReached.
  const loadMore = useCallback(async () => {
    // Skip if already busy, or if the API says there's no next page.
    if (isLoading || isLoadingMore || !info?.next) return;

    const nextPage = page + 1;
    setIsLoadingMore(true);
    try {
      const json = await fetchPage(nextPage, abortRef.current?.signal);
      setData((prev) => [...prev, ...json.results]);
      setInfo(json.info);
      setPage(nextPage);
    } catch (err) {
      if (err.name !== 'AbortError') setError(err.message);
    } finally {
      setIsLoadingMore(false);
    }
  }, [fetchPage, info, page, isLoading, isLoadingMore]);

  // Pull-to-refresh: reload page 1 with a fresh controller.
  const refresh = useCallback(async () => {
    const controller = new AbortController();
    abortRef.current = controller;

    setRefreshing(true);
    try {
      const json = await fetchPage(1, controller.signal);
      setData(json.results);
      setInfo(json.info);
      setPage(1);
      setError(null);
    } catch (err) {
      if (err.name !== 'AbortError') setError(err.message);
    } finally {
      setRefreshing(false);
    }
  }, [fetchPage]);

  return {
    data,
    isLoading,
    isLoadingMore,
    refreshing,
    error,
    hasMore: Boolean(info?.next),
    loadMore,
    refresh,
  };
}
