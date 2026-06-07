import { Link, useParams } from "react-router-dom";

export default function GraphPage() {
  const { entityId } = useParams<{ entityId: string }>();

  if (!entityId) {
    return (
      <section>
        <p>Missing entity ID.</p>
        <Link to="/">Back to search</Link>
      </section>
    );
  }

  return (
    <section>
      <p>
        <Link to="/">← Back to search</Link>
      </p>
      <h2>Relationship graph</h2>
      <p>
        Graph for <code>{entityId}</code> will appear here.
      </p>
    </section>
  );
}
