import React from "react";
import PropTypes from "prop-types";

function Pagination({ currentPage, totalPages, onPageChange }) {
  const renderPageNumbers = () => {
    const pageButtons = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageButtons.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pageButtons.push(1, 2, 3, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageButtons.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pageButtons.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }

    return pageButtons;
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "10px",
        marginBottom: "10px",
        fontSize: "14px",
      }}
    >
      {/* 第一頁 */}
      <span
        onClick={() => onPageChange(1)}
        style={{
          cursor: currentPage === 1 ? "default" : "pointer",
          margin: "0 5px",
          color: currentPage === 1 ? "#999" : "#000",
        }}
      >
        {"<<"}
      </span>

      {/* 上一頁 */}
      <span
        onClick={() => onPageChange(currentPage - 1)}
        style={{
          cursor: currentPage === 1 ? "default" : "pointer",
          margin: "0 5px",
          color: currentPage === 1 ? "#999" : "#000",
        }}
      >
        {"<"}
      </span>

      {/* 動態顯示頁碼 */}
      {renderPageNumbers().map((page, index) => (
        <span
          key={index}
          onClick={() => typeof page === "number" && onPageChange(page)}
          style={{
            margin: "0 5px",
            cursor: typeof page === "number" ? "pointer" : "default",
            fontWeight: page === currentPage ? "bold" : "normal",
            backgroundColor: page === currentPage ? "#bbdefb" : "transparent",
            color: page === currentPage ? "#FFFFFF" : "#000000",
            padding: page === currentPage ? "3px 6px" : "0",
            borderRadius: "4px",
          }}
        >
          {page}
        </span>
      ))}

      {/* 下一頁 */}
      <span
        onClick={() => onPageChange(currentPage + 1)}
        style={{
          cursor: currentPage === totalPages ? "default" : "pointer",
          margin: "0 5px",
          color: currentPage === totalPages ? "#999" : "#000",
        }}
      >
        {">"}
      </span>

      {/* 最後一頁 */}
      <span
        onClick={() => onPageChange(totalPages)}
        style={{
          cursor: currentPage === totalPages ? "default" : "pointer",
          margin: "0 5px",
          color: currentPage === totalPages ? "#999" : "#000",
        }}
      >
        {">>"}
      </span>
    </div>
  );
}

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default Pagination;
