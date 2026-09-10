import React, { useMemo, useState } from "react";
import useUsers from "../../../utils/Hooks/useUsers";
import Loader from "../../../components/Loader/Loader";
import { Link } from "react-router-dom";
import { FaPhoneAlt, FaIdCard, FaMapMarkerAlt } from "react-icons/fa";

const Investors = () => {
  const { isUsersLoading, users, isUsersError } = useUsers();

  const [search, setSearch] = useState("");


  const filteredUsers = useMemo(() => {
    if (!users) return [];

    const keyword = search.toLowerCase();

    return (
      users
        // 🔥 only investors
        .filter((user) => user.roles?.includes("investor"))
        // 🔍 search inside investors
        .filter(
          (user) =>
            user.name?.toLowerCase().includes(keyword) ||
            user.mobile?.toLowerCase().includes(keyword) ||
            String(user.id).includes(keyword)
        )
    );
  }, [users, search]);


  if (isUsersError) {
    return (
      <div className="p-6 flex flex-col items-center justify-center text-red-400">
        <span className="text-4xl mb-2">⚠️</span>
        <p className="font-semibold">Failed to load users</p>
        <p className="text-sm text-red-300">Please try again later</p>
      </div>
    );
  }
  return (
    <div className="mx-auto text-gray-200 max-w-[1600px]">
      {/* ===== Header ===== */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-white">All Investors</h2>
          <p className="text-sm text-gray-400">
            Total investors: {filteredUsers.length}
          </p>
        </div>

        <input
          type="text"
          placeholder="Search by name, mobile, role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 w-full md:w-96
                     text-gray-200 placeholder-gray-400
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* ===== Cards ===== */}
      {filteredUsers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <span className="text-5xl mb-4">😕</span>
          <h3 className="text-lg font-semibold text-gray-300">
            No investors found
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Try adjusting your search keywords
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredUsers.map((user) => (
            <Link
              to={`/investors/details?user_id=${user.id}`}
              key={user.id}
              className="group bg-gradient-to-b from-gray-900 to-gray-950
                         border border-gray-800 rounded-2xl p-4
                         hover:border-blue-500 hover:shadow-xl transition-all"
            >
              {/* ===== Top ===== */}
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={
                    user.photo
                      ? `https://management.supplylinkbd.com/${user.photo}`
                      : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          user.name || "User"
                        )}&background=1f2937&color=fff`
                  }
                  alt={user.name}
                  className="w-14 h-14 rounded-full object-cover
                             border border-gray-700 group-hover:border-blue-500"
                />

                <div className="flex-1">
                  <h3 className="text-white font-semibold truncate">
                    {user.name || "No Name"}
                  </h3>
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                    <FaPhoneAlt className="text-gray-500" size={12} />
                    {user.mobile || "N/A"}
                  </p>
                </div>

                <span className="text-[10px] text-gray-400 bg-gray-800 px-2 py-1 rounded">
                  ID {user.id}
                </span>
              </div>

              {/* ===== Extra Info ===== */}
              <div className="space-y-2 text-sm text-gray-400">
                {user.id_number && (
                  <p className="flex items-center gap-2">
                    <FaIdCard className="text-gray-500" size={14} />
                    {user.id_number}
                  </p>
                )}

                {user.address && (
                  <p className="flex items-center gap-2 line-clamp-2">
                    <FaMapMarkerAlt className="text-gray-500" size={14} />
                    {user.address}
                  </p>
                )}
              </div>

              {/* ===== Roles ===== */}
              {/* <div className="mt-4 flex flex-wrap gap-2">
                {user.roles?.length > 0 ? (
                  user.roles.map((role, i) => (
                    <span
                      key={i}
                      className="text-xs px-3 py-1 rounded-full
                                 bg-blue-900/30 text-blue-300"
                    >
                      {role}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-gray-500">No role</span>
                )}
              </div> */}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Investors;
