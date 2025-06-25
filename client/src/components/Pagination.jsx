import React from "react";

const Pagination = ({ page, total, limit, onPageChange }) => {
  const totalPages = Math.ceil(total / limit);
  if (totalPages <= 1) return null;

  // Generate page numbers (show up to 5 pages around current)
  let start = Math.max(1, page - 2);
  let end = Math.min(totalPages, page + 2);
  if (end - start < 4) {
    if (start === 1) end = Math.min(5, totalPages);
    if (end === totalPages) start = Math.max(1, totalPages - 4);
  }
  const pages = [];
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <nav className="flex justify-center mt-6">
      <ul className="inline-flex items-center gap-1 bg-white/60 backdrop-blur-md rounded-xl p-2 shadow border border-gray-200">
        <li>
          <button
            className="px-3 py-1 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50"
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
          >
            Prev
          </button>
        </li>
        {start > 1 && (
          <li>
            <button
              className="px-3 py-1 rounded-lg text-gray-600 hover:bg-gray-100"
              onClick={() => onPageChange(1)}
            >
              1
            </button>
            {start > 2 && <span className="px-2">...</span>}
          </li>
        )}
        {pages.map((p) => (
          <li key={p}>
            <button
              className={`px-3 py-1 rounded-lg font-medium ${
                p === page
                  ? "bg-gradient-to-r from-green-500 to-blue-500 text-white shadow"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => onPageChange(p)}
              disabled={p === page}
            >
              {p}
            </button>
          </li>
        ))}
        {end < totalPages && (
          <li>
            {end < totalPages - 1 && <span className="px-2">...</span>}
            <button
              className="px-3 py-1 rounded-lg text-gray-600 hover:bg-gray-100"
              onClick={() => onPageChange(totalPages)}
            >
              {totalPages}
            </button>
          </li>
        )}
        <li>
          <button
            className="px-3 py-1 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50"
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination; 