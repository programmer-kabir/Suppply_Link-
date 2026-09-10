import React from "react";
import { FiMenu, FiSearch, FiBell } from "react-icons/fi";
import { useAuth } from "../../Provider/AuthProvider";
import useUsers from "../../utils/Hooks/useUsers";

const TopHeader = ({ onMenuClick }) => {
  const { user } = useAuth() || {};
  const { users = [] } = useUsers();
  const currentUser = users.find((u) => u?.id === user?.id);

  return (
    <header className="border-b border-white/5 bg-black/20 backdrop-blur-sm sticky top-0 z-1 print:hidden">
      <div className="p-4 flex items-center md:justify-end justify-between gap-4 ">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-lg bg-gray-800/60 hover:bg-gray-700"
          aria-label="Open menu"
        >
          <FiMenu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-4 ml-4">
          <button
            className="p-2 rounded-lg bg-gray-800/60 hover:bg-gray-700 relative"
            aria-label="Notifications"
          >
            <FiBell className="w-5 h-5 text-gray-200" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          <div className="flex items-center gap-3">
            <div className="">
              <img
                className="w-8 h-8 rounded-full"
                src={`https://management.supplylinkbd.com/${currentUser?.photo}`}
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopHeader;
