import type { SearchResultItem } from "../types/api";

type SearchResultsTableProps = {
  results: SearchResultItem[];
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
            <th className="score-cell">Score</th>
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
              <td className="score-cell">{result.score.toFixed(3)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
