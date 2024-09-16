import React, { useEffect, useRef } from "react";
import ReactPaginate from "react-paginate";

const Paginate = ({ total, perPage, onPageChange }) => {
  const handlePageClick = (e) => {
    const selectedPage = e.selected + 1;
    if (onPageChange) {
      onPageChange(selectedPage);
    }
  };

  return (
    <div className=" pt-7 flex items-center justify-center" id="paginate">
      <div>
        <ReactPaginate
          // renderOnZeroPageCount={0}
          breakLabel="..."
          nextLabel={`>`}
          containerClassName="flex gap-x-2"
          pageClassName="bg-red-500 !text-white  p-1.5 border border-gray-300 text-gray-500 hover:text-gray-700 hover:bg-gray-100    "
          pageLinkClassName=""
          previousClassName="bg-green-500 !text-white p-1.5 border border-gray-300 text-gray-500 hover:text-gray-700 hover:bg-green-600 "
          nextClassName="bg-green-500 !text-white p-1.5 border border-gray-300 text-gray-500 hover:text-gray-700 hover:bg-green-600 "
          nextLinkClassName=""
          previousLinkClassName=""
          breakClassName="bg-black p-1.5 !text-white  border border-gray-300 text-gray-500 hover:text-gray-700 hover:bg-gray-100 "
          breakLinkClassName="page-link"
          activeClassName="!bg-yellow-500 !text-white "
          onPageChange={handlePageClick}
          marginPagesDisplayed={1} // number of pages to display on both sides of current page
          pageRangeDisplayed={1}
          pageCount={Math.ceil(total / perPage)}
          previousLabel={`<`}
          // forcePage={Number(current.get("pageNo")) - 1}
        />
      </div>
    </div>
  );
};

export default Paginate;
