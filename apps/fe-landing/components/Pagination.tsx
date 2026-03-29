type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const pagesAroundCurrent = Array.from(
    { length: Math.min(3, totalPages) },
    (_, i) => i + Math.max(1, Math.min(currentPage - 1, totalPages - 2)),
  ).filter((page) => page >= 1 && page <= totalPages);

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="mr-2 flex items-center h-10 justify-center rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-gray-700 hover:bg-gray-50 disabled:opacity-50 text-sm font-medium transition-colors"
      >
        Previous
      </button>
      <div className="flex items-center gap-1">
        {currentPage > 3 && <span className="px-2 text-gray-400">...</span>}
        {pagesAroundCurrent.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`flex w-10 items-center justify-center h-10 rounded-lg text-sm font-medium transition-colors ${
              currentPage === page
                ? "bg-black text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {page}
          </button>
        ))}
        {currentPage < totalPages - 2 && (
          <span className="px-2 text-gray-400">...</span>
        )}
      </div>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="ml-2 flex items-center justify-center rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-gray-700 hover:bg-gray-50 text-sm font-medium transition-colors h-10 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
