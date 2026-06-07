import type { CSSProperties } from "react";
import type { SearchResultItem } from "../types/api";

type SearchResultsTableProps = {
  results: SearchResultItem[];
  onSelect: (entityId: string) => void;
};

export default function SearchResultsTable({
  results,
  onSelect,
}: SearchResultsTableProps) {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
      <thead>
        <tr>
          <th style={headerCellStyle}>Name</th>
          <th style={headerCellStyle}>Type</th>
          <th style={headerCellStyle}>Country</th>
          <th style={headerCellStyle}>Programs</th>
          <th style={{ ...headerCellStyle, textAlign: "right" }}>Score</th>
        </tr>
      </thead>
      <tbody>
        {results.map((result) => (
          <tr
            key={result.id}
            onClick={() => onSelect(result.id)}
            style={rowStyle}
          >
            <td style={cellStyle}>{result.name}</td>
            <td style={cellStyle}>{result.type}</td>
            <td style={cellStyle}>{result.country || "—"}</td>
            <td style={cellStyle}>{result.programs.join(", ") || "—"}</td>
            <td style={{ ...cellStyle, textAlign: "right" }}>
              {result.score.toFixed(3)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const headerCellStyle: CSSProperties = {
  textAlign: "left",
  padding: "0.75rem",
  borderBottom: "2px solid #ddd",
};

const cellStyle: CSSProperties = {
  padding: "0.75rem",
  borderBottom: "1px solid #eee",
};

const rowStyle: CSSProperties = {
  cursor: "pointer",
};
