import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { ApiError } from "../api/client";
import { getEntityGraph } from "../api/sanctions";
import RelationGraph from "../components/RelationGraph";
import type { GraphResponse } from "../types/api";

type GraphLocationState = {
  returnSearch?: string;
};

export default function GraphPage() {
  const { entityId } = useParams<{ entityId: string }>();
  const location = useLocation();
  const returnSearch = (location.state as GraphLocationState | null)?.returnSearch;
  const backTo = returnSearch ? `/?${returnSearch}` : "/";
  const [graph, setGraph] = useState<GraphResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!entityId) {
      return;
    }

    let isCancelled = false;

    setIsLoading(true);
    setError(null);
    setGraph(null);

    getEntityGraph(entityId)
      .then((response) => {
        if (!isCancelled) {
          setGraph(response);
        }
      })
      .catch((err: unknown) => {
        if (!isCancelled) {
          if (err instanceof ApiError && err.status === 404) {
            setError(`Entity "${entityId}" not found.`);
          } else {
            setError(
              err instanceof ApiError ? err.message : "Failed to load graph",
            );
          }
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
  }, [entityId]);

  if (!entityId) {
    return (
      <section className="page-section">
        <p>Missing entity ID.</p>
        <Link to="/">Back to search</Link>
      </section>
    );
  }

  const centerNode = graph?.nodes.find((node) => node.is_center);

  return (
    <section className="page-section">
      <p>
        <Link to={backTo}>← Back to search</Link>
      </p>

      {isLoading && <p className="status-message">Loading graph…</p>}

      {error && (
        <p className="status-message status-message--error" role="alert">
          {error}
        </p>
      )}

      {graph && centerNode && (
        <>
          <h2>{centerNode.name}</h2>
          <p className="entity-meta">
            <span
              className={
                centerNode.type === "person" ||
                centerNode.type === "organization" ||
                centerNode.type === "vessel"
                  ? `type-badge type-badge--${centerNode.type}`
                  : "type-badge"
              }
            >
              {centerNode.type}
            </span>{" "}
            · {centerNode.id}
          </p>

          {graph.edges.length === 0 ? (
            <p className="status-message">
              No direct relationships recorded for this entity.
            </p>
          ) : (
            <div className="graph-panel">
              <RelationGraph graph={graph} />
            </div>
          )}
        </>
      )}
    </section>
  );
}
