// import { useState } from "react";
// import { NavLink } from "react-router-dom";
// import { IoChevronDown, IoChevronUp } from "react-icons/io5";

// const linkClass = ({ isActive }) =>
//   `px-4 py-3 rounded-lg flex items-center gap-3 ${
//     isActive ? "bg-white/10" : "hover:bg-white/5"
//   }`;

// const CollapsibleMenu = ({ label, icon: Icon, children, onLinkClick }) => {
//   const [open, setOpen] = useState(false);

//   return (
//     <>
//       <button
//         onClick={() => setOpen(!open)}
//         className="w-full px-4 py-3 rounded-lg flex justify-between hover:bg-white/5"
//       >
//         <div className="flex gap-3 items-center">
//           <Icon className="w-5 h-5" />
//           {label}
//         </div>
//         {open ? <IoChevronUp /> : <IoChevronDown />}
//       </button>

//       <div
//         className={`ml-6 transition-all overflow-hidden ${
//           open ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
//         }`}
//       >
//         {children.map((item, i) => (
//           <NavLink
//             key={i}
//             to={item.path}
//             className={linkClass}
//             onClick={onLinkClick}
//           >
//             <item.icon className="w-5 h-5" />
//             {item.label}
//           </NavLink>
//         ))}
//       </div>
//     </>
//   );
// };

// export default CollapsibleMenu;
import { useEffect, useMemo, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";

const parentBtnClass = (active) =>
  `w-full px-3.5 py-2.5 rounded-xl flex items-center justify-between transition-all duration-150 text-sm font-medium
   ${active ? "bg-indigo-600/10 text-indigo-300 font-semibold border border-indigo-500/20" : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/40"}`;

const childLinkClass = ({ isActive }) =>
  `px-3 py-2 rounded-xl flex items-center gap-3 transition-all duration-150 text-xs font-medium
   ${isActive ? "bg-indigo-600/20 text-indigo-300 font-bold border border-indigo-500/30" : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/30"}`;

const CollapsibleMenu = ({
  label,
  icon: Icon,
  children = [],
  onLinkClick,
  pendingCashApproval = 0,
}) => {
  const location = useLocation();

  const hasActiveChild = useMemo(() => {
    return children.some((c) => c.path && location.pathname.startsWith(c.path));
  }, [children, location.pathname]);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (hasActiveChild) setOpen(true);
  }, [hasActiveChild]);

  return (
    <div className="flex flex-col">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={parentBtnClass(hasActiveChild)}
      >
        <div className="flex gap-3 items-center">
          <Icon className="w-4 h-4 text-indigo-400" />
          <span className="text-left text-sm font-medium">{label}</span>
        </div>
        <span className="shrink-0 text-slate-500 text-xs">
          {open ? <IoChevronUp /> : <IoChevronDown />}
        </span>
      </button>

      <div
        className={`ml-4 mt-1 pl-2.5 border-l-2 border-indigo-500/20 overflow-hidden transition-all duration-200
        ${open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="flex flex-col gap-1 py-1">
          {children.map((item, i) => (
            <NavLink
              key={i}
              to={item.path}
              className={childLinkClass}
              onClick={onLinkClick}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2.5">
                  <item.icon className="w-3.5 h-3.5 text-indigo-400/80" />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.path === "/cash/cash-report-approval" &&
                  pendingCashApproval > 0 && (
                    <span className="bg-rose-500 text-white text-[10px] min-w-[20px] h-4.5 px-1.5 rounded-full flex items-center justify-center font-bold shadow-md shadow-rose-900/40">
                      {pendingCashApproval}
                    </span>
                  )}
              </div>
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CollapsibleMenu;
