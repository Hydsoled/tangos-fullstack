import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ApiError } from "../api/client";
import { searchEntities } from "../api/sanctions";
import SearchResultsTable from "../components/SearchResultsTable";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import type { SearchResultItem } from "../types/api";

const DEBOUNCE_MS = 300;

export default function SearchPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, DEBOUNCE_MS);
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const trimmedQuery = debouncedQuery.trim();

    if (!trimmedQuery) {
      setResults([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    let isCancelled = false;

    setIsLoading(true);
    setError(null);

    searchEntities(trimmedQuery)
      .then((response) => {
        if (!isCancelled) {
          setResults(response.results);
        }
      })
      .catch((err: unknown) => {
        if (!isCancelled) {
          setResults([]);
          setError(
            err instanceof ApiError ? err.message : "Search request failed",
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
  }, [debouncedQuery]);

  const handleSelect = (entityId: string) => {
    navigate(`/entities/${entityId}`);
  };

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

      {isLoading && <p className="status-message">Searching…</p>}

      {error && (
        <p className="status-message status-message--error" role="alert">
          {error}
        </p>
      )}

      {!isLoading && !error && debouncedQuery.trim() && results.length === 0 && (
        <p className="status-message">No matching entities found.</p>
      )}

      {results.length > 0 && (
        <SearchResultsTable results={results} onSelect={handleSelect} />
      )}
    </section>
  );
}
