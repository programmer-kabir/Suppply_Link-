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
  `w-full px-4 py-3 rounded-lg flex items-center justify-between transition
   ${active ? "bg-white/10" : "hover:bg-white/5"}`;

const childLinkClass = ({ isActive }) =>
  `px-3 py-2 rounded-md flex items-center gap-3 transition text-sm
   ${isActive ? "bg-white/10" : "hover:bg-white/5"}`;

const CollapsibleMenu = ({
  label,
  icon: Icon,
  children = [],
  onLinkClick,
  pendingCashApproval = 0,
}) => {  const location = useLocation();

  // ✅ child active কিনা
  const hasActiveChild = useMemo(() => {
    return children.some((c) => c.path && location.pathname.startsWith(c.path));
  }, [children, location.pathname]);

  const [open, setOpen] = useState(false);

  // ✅ child active হলে auto open
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
          <Icon className="w-5 h-5" />
          <span className="text-left">{label}</span>
        </div>
        <span className="shrink-0">
          {open ? <IoChevronUp /> : <IoChevronDown />}
        </span>
      </button>

      <div
        className={`ml-6 mt-1 pl-2 border-l border-white/10 overflow-hidden transition-all duration-200
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
    <div className="flex items-center gap-3">
      <item.icon className="w-5 h-5" />
      <span className="truncate">{item.label}</span>
    </div>

    {item.path === "/cash/cash-report-approval" &&
      pendingCashApproval > 0 && (
        <span className="bg-red-500 text-white text-[10px] min-w-[20px] h-5 px-1 rounded-full flex items-center justify-center">
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
