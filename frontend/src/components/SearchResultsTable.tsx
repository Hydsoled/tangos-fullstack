import type { EntityRow } from "../types/api";

type SearchResultsTableProps = {
  results: EntityRow[];
  showScore: boolean;
  onSelect: (entityId: string) => void;
};

function typeBadgeClass(type: string): string {
  if (type === "person" || type === "organization" || type === "vessel") {
    return `type-badge type-badge--${type}`;
  }

  return "type-badge";
}

export default function SearchResultsTable({
  results,
  showScore,
  onSelect,
}: SearchResultsTableProps) {
  return (
    <div className="results-table-wrapper">
      <table className="results-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Country</th>
            <th>Programs</th>
            {showScore && <th className="score-cell">Score</th>}
          </tr>
        </thead>
        <tbody>
          {results.map((result) => (
            <tr key={result.id} onClick={() => onSelect(result.id)}>
              <td>{result.name}</td>
              <td>
                <span className={typeBadgeClass(result.type)}>{result.type}</span>
              </td>
              <td>{result.country || "—"}</td>
              <td>{result.programs.join(", ") || "—"}</td>
              {showScore && (
                <td className="score-cell">
                  {typeof result.score === "number" ? result.score.toFixed(3) : "—"}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
