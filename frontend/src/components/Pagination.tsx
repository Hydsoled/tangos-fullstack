type PaginationProps = {
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({
  page,
  totalPages,
  total,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) {
    return (
      <p className="pagination-summary">
        Showing {total} {total === 1 ? "entity" : "entities"}
      </p>
    );
  }

  return (
    <nav className="pagination" aria-label="Results pagination">
      <p className="pagination-summary">
        Page {page} of {totalPages} · {total} {total === 1 ? "entity" : "entities"}
      </p>
      <div className="pagination-controls">
        <button
          type="button"
          className="pagination-button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </button>
        <button
          type="button"
          className="pagination-button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </button>
      </div>
    </nav>
  );
}
