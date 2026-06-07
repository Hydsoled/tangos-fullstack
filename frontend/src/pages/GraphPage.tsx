import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ApiError } from "../api/client";
import { getEntityGraph } from "../api/sanctions";
import RelationGraph from "../components/RelationGraph";
import type { GraphResponse } from "../types/api";

export default function GraphPage() {
  const { entityId } = useParams<{ entityId: string }>();
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
      <section>
        <p>Missing entity ID.</p>
        <Link to="/">Back to search</Link>
      </section>
    );
  }

  const centerNode = graph?.nodes.find((node) => node.is_center);

  return (
    <section>
      <p>
        <Link to="/">← Back to search</Link>
      </p>

      {isLoading && <p>Loading graph…</p>}

      {error && (
        <p style={{ color: "#b00020" }} role="alert">
          {error}
        </p>
      )}

      {graph && centerNode && (
        <>
          <h2 style={{ marginBottom: "0.25rem" }}>{centerNode.name}</h2>
          <p style={{ marginTop: 0, color: "#555" }}>
            {centerNode.type} · {centerNode.id}
          </p>

          {graph.edges.length === 0 ? (
            <p>No direct relationships recorded for this entity.</p>
          ) : (
            <RelationGraph graph={graph} />
          )}
        </>
      )}
    </section>
  );
}
