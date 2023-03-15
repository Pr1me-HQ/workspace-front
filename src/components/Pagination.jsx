import React from "react";

export function Pagination({ currentPage, lastPage, onPageChange }) {
  const pages = [];

  for (let i = 1; i <= lastPage; i++) {
    pages.push(i);
  }

  const visiblePages = [];
  let startPage = 1;
  let endPage = lastPage;

  if (lastPage > 10) {
    if (currentPage <= 6) {
      endPage = 10;
    } else if (currentPage >= lastPage - 5) {
      startPage = lastPage - 9;
    } else {
      startPage = currentPage - 5;
      endPage = currentPage + 4;
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    visiblePages.push(i);
  }

  const handlePageChange = (page) => {
    if (page < 1 || page > lastPage) {
      return;
    }
    onPageChange(page);
  };

  return (
    <div>
      <ul className="pagination justify-content-center">
        <li className="page-item">
          <button
            className="page-link"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
        </li>
        <li className={`page-item ${currentPage === 1 ? "active" : ""}`}>
          <button className="page-link" onClick={() => handlePageChange(1)}>
            1
          </button>
        </li>
        {startPage > 2 && (
          <li className="page-item">
            <button className="page-link" disabled>
              ...
            </button>
          </li>
        )}
        {visiblePages.map((page) => (
            (page !== 1 && page !== lastPage)  ? (
              <li
                key={page}
                className={`page-item ${currentPage === page ? "active" : ""}`}
              >
                <button className="page-link" onClick={() => handlePageChange(page)}>
                {page}
                </button>
              </li>
            ) : null
          ))}

        {endPage < lastPage - 1 && (
          <li className="page-item">
            <button className="page-link" disabled>
              ...
            </button>
          </li>
        )}
        {lastPage > 1 && (
          <li className={`page-item ${currentPage === lastPage ? "active" : ""}`}>
            <button className="page-link" onClick={() => handlePageChange(lastPage)}>
              {lastPage}
            </button>
          </li>
        )}
        <li className="page-item">
          <button
            className="page-link"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === lastPage}
          >
            Next
          </button>
        </li>
      
      </ul>
    </div>
  );
}
