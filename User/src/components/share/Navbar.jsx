import { useState, useRef, useEffect } from "react";
import { FaUserCircle, FaSignOutAlt, FaExchangeAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

const Navbar = ({ role, user, onRoleChange, onLogout }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
const allowedRoles = ["investor", "customer"];

const filteredRoles = (user?.roles || []).filter((r) =>
  allowedRoles.includes(r)
);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <header className="sticky top-0 z-50">
      <div className="backdrop-blur-xl bg-white/70 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Left: Logo */}
          <div className="flex items-center gap-3">
            <Link to={'/'}>
              {" "}
              <img
                className="md:h-12 h-8"
                src="https://app.supplylinkbd.com/uploads/sl_logo.png"
                altdiv=""
              />
            </Link>
          </div>

          <div>


{filteredRoles.length > 1 && (
  <div className="hidden md:flex items-center">
    <div className="flex bg-gray-100 p-1.5 rounded-full shadow-sm">
      {filteredRoles.map((r) => (
        <button
          key={r}
          onClick={() => onRoleChange(r)}
          className={`relative px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300
            ${
              role === r
                ? "bg-indigo-600 text-white shadow-md scale-[1.02]"
                : "text-gray-600 hover:text-gray-800"
            }`}
        >
          {r.charAt(0).toUpperCase() + r.slice(1)}
        </button>
      ))}
    </div>
  </div>
)}
          </div>

          {/* Right: User */}
          <div className="relative flex items-center gap-3" ref={dropdownRef}>
            {/* <span
              className={`text-xs px-3 py-1 rounded-full font-medium
                ${
                  role === "investor"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-indigo-100 text-indigo-700"
                }`}
            >
              {role === "investor" ? "Investor" : "Customer"}
            </span> */}
            {/* {user?.name} */}
            {/* Avatar */}
            <button onClick={() => setOpen(!open)}>
              {user?.photo ? (
                <img
                  className="w-10 h-10 rounded-full cursor-pointer border"
                  src={`https://app.supplylinkbd.com/${user.photo}`}
                  alt="user"
                />
              ) : (
                <FaUserCircle className="w-10 h-10 text-gray-600 cursor-pointer" />
              )}
            </button>

            {/* Dropdown */}
            {open && (
              <div className="absolute right-0 top-14 w-52 bg-white rounded-xl shadow-lg border overflow-hidden">
                <div className="px-4 py-3 border-b">
                  <p className="text-sm font-medium text-gray-800">
                    {user?.name || "User"}
                  </p>
                  <p className="text-xs text-gray-500">{user?.email || ""}</p>
                </div>
                <button
                  onClick={() => {
                    setOpen(false);
                    onLogout?.();
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <FaSignOutAlt />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
