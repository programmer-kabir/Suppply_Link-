// import { IoIosArrowForward } from "react-icons/io";

// const Pagination = ({
//   reportData,
//   currentPage,
//   totalPages,
//   PAGE_SIZE,
//   pageNumbers,
//   setCurrentPage,
// }) => {
//   return (
//     <div className="w-full px-5">
//       {reportData.length > PAGE_SIZE && (
//         <div className="flex justify-between items-center mt-4">
//           <p className="text-sm text-slate-400">
//             Page {currentPage} of {totalPages}
//           </p>

//           <div className="flex items-center gap-1">
//             {/* Previous */}
//             <button
//               disabled={currentPage === 1}
//               onClick={() => setCurrentPage((p) => p - 1)}
//               className="px-3 py-1 rounded border border-slate-600 text-slate-300 disabled:opacity-40 hover:bg-slate-700"
//             >
//               Previous
//             </button>

//             {/* Page Numbers */}
//             {pageNumbers.map((page) => (
//               <button
//                 key={page}
//                 onClick={() => setCurrentPage(page)}
//                 className={`px-3 py-1 rounded border text-sm
//               ${
//                 currentPage === page
//                   ? "bg-blue-600 text-white border-blue-600"
//                   : "border-slate-600 text-slate-300 hover:bg-slate-700"
//               }`}
//               >
//                 {page}
//               </button>
//             ))}

//             {/* Next */}
//             <button
//               disabled={currentPage === totalPages}
//               onClick={() => setCurrentPage((p) => p + 1)}
//               className="px-3 py-1 rounded border border-slate-600 text-slate-300 disabled:opacity-40 hover:bg-slate-700"
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Pagination;
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const Pagination = ({
  reportData,
  currentPage,
  totalPages,
  PAGE_SIZE,
  pageNumbers,
  setCurrentPage,
  storageKey,
}) => {
  if (!reportData || reportData.length <= PAGE_SIZE) return null;

  const goTo = (page) => {
    const clamped = Math.min(Math.max(1, page), totalPages);
    if (storageKey) sessionStorage.setItem(storageKey, String(clamped));
    setCurrentPage(clamped);
  };

  return (
    <div className="w-full px-2 md:px-5">
      <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <p className="text-sm text-slate-400">
          Page {currentPage} of {totalPages}
        </p>

        {/* ✅ Mobile overflow scroll */}
        <div className="flex items-center gap-2">
          {/* Prev */}
          <button
            disabled={currentPage === 1}
            onClick={() => goTo(currentPage - 1)}
            className="shrink-0 flex items-center gap-1 px-3 py-1 rounded border border-slate-600
                       text-slate-300 disabled:opacity-40 hover:bg-slate-700"
          >
            <IoIosArrowBack />
            <span className="hidden sm:inline">Previous</span>
          </button>

          {/* ✅ Numbers (horizontal scroll on small devices) */}
          <div
            className="flex-1 overflow-x-auto whitespace-nowrap"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            <div className="inline-flex gap-1">
              {pageNumbers.map((page) => (
                <button
                  key={page}
                  onClick={() => goTo(page)}
                  className={`shrink-0 px-3 py-1 rounded border text-sm
                    ${
                      currentPage === page
                        ? "bg-blue-600 text-white border-blue-600"
                        : "border-slate-600 text-slate-300 hover:bg-slate-700"
                    }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>

          {/* Next */}
          <button
            disabled={currentPage === totalPages}
            onClick={() => goTo(currentPage + 1)}
            className="shrink-0 flex items-center gap-1 px-3 py-1 rounded border border-slate-600
                       text-slate-300 disabled:opacity-40 hover:bg-slate-700"
          >
            <span className="hidden sm:inline">Next</span>
            <IoIosArrowForward />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
