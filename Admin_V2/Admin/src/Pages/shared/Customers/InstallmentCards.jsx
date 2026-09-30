import React, { useMemo, useState, useEffect } from "react";
import axios from "axios";
import useUsers from "../../../utils/Hooks/useUsers";
import {
  FaUser,
  FaPhoneAlt,
  FaBoxOpen,
  FaCalendarAlt,
  FaSearch,
  FaChartLine,
  FaArrowRight,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import Loader from "../../../components/Loader/Loader";
import NoDataFound from "../../../components/NoData/NoDataFound";
import Pagination from "../../../components/Pagination";
import { useAuth } from "../../../Provider/AuthProvider";

const PAGE_SIZE = 40;

const InstallmentCards = () => {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [cards, setCards] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [statusCount, setStatusCount] = useState({ running: 0, fullyPaid: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const { users } = useUsers();

  // Reset to page 1 whenever search query changes
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  // Fetch cards from server with server-side pagination & search
  useEffect(() => {
    let isMounted = true;

    const fetchCards = async () => {
      setIsLoading(true);
      setIsError(false);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_LOCALHOST_KEY}/customers/get_installment_cards.php`,
          {
            params: {
              page: currentPage,
              limit: PAGE_SIZE,
              search: search.trim(),
            },
          }
        );

        if (isMounted && response.data?.success) {
          setCards(response.data.data || []);
          setTotalPages(response.data.total_pages || 1);
          setTotalCount(response.data.total || 0);
          if (response.data.status_counts) {
            setStatusCount({
              running: response.data.status_counts.running || 0,
              fullyPaid: response.data.status_counts.fullyPaid || 0,
            });
          }
        }
      } catch (err) {
        if (isMounted) setIsError(true);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchCards();
    }, 300);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [currentPage, search]);

  const pageNumbers = useMemo(() => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }, [totalPages]);

  if (isError) {
    return (
      <NoDataFound message="No Card Found" subMessage="Please Try again" />
    );
  }

  const currentUser = users?.find((u) => u.id === user?.id);
  const statusStyles = {
    Running: "bg-blue-900/30 text-blue-300",
    "Fully Paid": "bg-emerald-900/30 text-emerald-300",
    Overdue: "bg-red-900/30 text-red-300",
  };

  return (
    <div className="w-full">
      <div className="mb-6 w-full flex flex-col sm:flex-row gap-4 justify-between sm:justify-end items-center">
        <div className="flex gap-3">
          <div className="bg-blue-900/30 text-blue-300 px-3 py-1.5 rounded-lg text-xs font-semibold">
            Running: {statusCount.running}
          </div>

          <div className="bg-emerald-900/30 text-emerald-300 px-3 py-1.5 rounded-lg text-xs font-semibold">
            Fully Paid: {statusCount.fullyPaid}
          </div>

          <div className="bg-gray-800 text-gray-300 px-3 py-1.5 rounded-lg text-xs font-semibold">
            Total: {totalCount}
          </div>
        </div>

        <div className="relative w-full sm:max-w-md">
          <FaSearch className="absolute left-3 top-3.5 text-gray-400 text-sm" />
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search by Card ID / User ID / Product / Mobile"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl
                       bg-gray-900 border border-gray-800
                       text-sm text-white placeholder-gray-500
                       focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          />
        </div>
      </div>

      <div>
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader />
          </div>
        ) : cards.length === 0 ? (
          <NoDataFound
            message="No Matching Card Found"
            subMessage="Try different Card ID, User ID, Product or Mobile"
          />
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {cards.map((item) => (
                <div
                  key={item?.id}
                  className="rounded-2xl border border-gray-800
                             bg-gradient-to-b from-gray-900 to-gray-950
                             p-5 hover:border-blue-500
                             hover:shadow-xl transition-all flex flex-col justify-between"
                >
                  <Link to={`/customers/installment_cards/card_Details?cardId=${item?.id}`}>
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-xs text-gray-400">Card ID</p>
                        <p className="font-semibold text-white">
                          {item.card_id}
                        </p>
                      </div>

                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full
                        ${statusStyles[item.status] || "bg-gray-800 text-gray-300"}`}
                      >
                        {item.status}
                      </span>
                    </div>

                    {/* Product */}
                    <div className="mb-4 space-y-1">
                      <p className="flex items-center gap-2 text-gray-300 text-sm">
                        <FaBoxOpen className="text-gray-500" />
                        {item.product_name}
                      </p>
                      <p className="text-xs text-gray-400">
                        Sale Type:{" "}
                        <span className="text-gray-200 font-medium">
                          {item.sale_type}
                        </span>
                      </p>
                    </div>

                    {/* Customer */}
                    <div className="border-t border-gray-800 pt-3 space-y-2 text-sm">
                      <p className="flex items-center gap-2 text-gray-300">
                        <FaUser className="text-gray-500" />
                        <span className="font-semibold">
                          ({item.customer_user_id || item.user_id})
                        </span>{" "}
                        {item.user_name || "Unknown"}
                      </p>
                      <p className="flex items-center gap-2 text-gray-400">
                        <FaPhoneAlt className="text-gray-500" />
                        {item.user_mobile || "N/A"}
                      </p>
                    </div>

                    {/* Dates */}
                    <div className="mt-3 space-y-1 text-xs text-gray-400">
                      <p className="flex items-center gap-2">
                        <FaCalendarAlt className="text-gray-500" />
                        Delivery: {item.delivery_date || "—"}
                      </p>
                      <p className="flex items-center gap-2">
                        <FaCalendarAlt className="text-gray-500" />
                        First Installment: {item.first_installment_date || "—"}
                      </p>
                    </div>
                  </Link>

                  {/* ===== Action Area (fixed height) ===== */}
                  <div className="mt-4 pt-3 border-t border-gray-800/60 flex items-end">
                    {currentUser?.role !== "staff" &&
                      item.status !== "Fully Paid" && (
                        <Link
                          to={`/customer/create_installment_chart?cardId=${item.id}`}
                          className="w-full"
                        >
                          <button
                            className="group w-full flex items-center justify-center gap-2
                               rounded-xl px-4 py-2.5
                               bg-gradient-to-r from-blue-600/90 to-indigo-600/90
                               text-sm font-semibold text-white
                               hover:from-blue-500 hover:to-indigo-500
                               transition-all"
                          >
                            <FaChartLine />
                            <span>
                              {item.has_chart
                                ? "Update Installment Chart"
                                : "Create Installment Chart"}
                            </span>
                            <FaArrowRight className="group-hover:translate-x-1 transition" />
                          </button>
                        </Link>
                      )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="mt-8 mb-4">
              <Pagination
                reportData={{ length: totalCount }}
                currentPage={currentPage}
                totalPages={totalPages}
                PAGE_SIZE={PAGE_SIZE}
                pageNumbers={pageNumbers}
                setCurrentPage={setCurrentPage}
                storageKey="installment_cards_page"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default InstallmentCards;
