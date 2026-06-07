import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ApiError } from "../api/client";
import { listEntities, searchEntities } from "../api/sanctions";
import Pagination from "../components/Pagination";
import SearchResultsTable from "../components/SearchResultsTable";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import type { EntityRow } from "../types/api";

const DEBOUNCE_MS = 300;

function parsePage(value: string | null): number {
  const parsed = Number(value ?? "1");
  return Number.isFinite(parsed) && parsed >= 1 ? Math.floor(parsed) : 1;
}

export default function SearchPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const urlSearch = searchParams.get("search") ?? "";
  const page = parsePage(searchParams.get("page"));

  const [query, setQuery] = useState(urlSearch);
  const debouncedQuery = useDebouncedValue(query, DEBOUNCE_MS);

  const [results, setResults] = useState<EntityRow[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const trimmed = debouncedQuery.trim();
    if (trimmed === urlSearch) {
      return;
    }

    const nextParams = new URLSearchParams(searchParams);
    if (trimmed) {
      nextParams.set("search", trimmed);
    } else {
      nextParams.delete("search");
    }
    nextParams.set("page", "1");
    setSearchParams(nextParams, { replace: true });
  }, [debouncedQuery, urlSearch, searchParams, setSearchParams]);

  useEffect(() => {
    setQuery(urlSearch);
  }, [urlSearch]);

  useEffect(() => {
    let isCancelled = false;

    setIsLoading(true);
    setError(null);

    const request = urlSearch.trim()
      ? searchEntities(urlSearch.trim(), page)
      : listEntities(page);

    request
      .then((response) => {
        if (isCancelled) {
          return;
        }

        const rows = "results" in response ? response.results : response.items;
        setResults(rows);
        setTotal(response.total);
        setTotalPages(response.total_pages);
      })
      .catch((err: unknown) => {
        if (!isCancelled) {
          setResults([]);
          setTotal(0);
          setTotalPages(1);
          setError(
            err instanceof ApiError ? err.message : "Failed to load entities",
          );
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [urlSearch, page]);

  const handleSelect = (entityId: string) => {
    const returnSearch = searchParams.toString();
    navigate(`/entities/${entityId}`, {
      state: returnSearch ? { returnSearch } : undefined,
    });
  };

  const handlePageChange = (nextPage: number) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("page", String(nextPage));
    setSearchParams(nextParams);
  };

  const isSearchMode = urlSearch.trim().length > 0;

  return (
    <section className="page-section">
      <h2>Search</h2>
      <label htmlFor="entity-search" className="search-label">
        Entity name
      </label>
      <input
        id="entity-search"
        type="search"
        className="search-input"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search organizations, persons, or vessels…"
        autoComplete="off"
      />

      {isLoading && (
        <p className="status-message">
          {isSearchMode ? "Searching…" : "Loading entities…"}
        </p>
      )}

      {error && (
        <p className="status-message status-message--error" role="alert">
          {error}
        </p>
      )}

      {!isLoading && !error && isSearchMode && results.length === 0 && (
        <p className="status-message">No matching entities found.</p>
      )}

      {!isLoading && !error && results.length > 0 && (
        <>
          <SearchResultsTable
            results={results}
            showScore={isSearchMode}
            onSelect={handleSelect}
          />
          <Pagination
            page={page}
            totalPages={totalPages}
            total={total}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </section>
  );
}
