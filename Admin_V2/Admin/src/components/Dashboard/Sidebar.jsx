import { NavLink } from "react-router-dom";
import CollapsibleMenu from "../CollapsibleMenu ";
import { sidebarMenu } from "../../../public/sidebarMenu";
import { useAuth } from "../../Provider/AuthProvider";
import useUsers from "../../utils/Hooks/useUsers";
import useCashReports from "../../utils/Hooks/cash/useCashReports";

const linkClass = ({ isActive }) =>
  `px-3.5 py-2.5 rounded-xl flex items-center gap-3 transition-all duration-150 text-sm font-medium ${
    isActive
      ? "bg-indigo-600/15 text-indigo-400 font-semibold border border-indigo-500/30 shadow-inner"
      : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"
  }`;

const Sidebar = ({ onLinkClick, closeDrawer }) => {
  const { user, logout } = useAuth();
  
  const { users } = useUsers();
  const { CashReports } = useCashReports();

  const pendingCashApproval = Array.isArray(CashReports)
    ? CashReports.filter(
        (cash) =>
          cash.approval_status?.toLowerCase() === "pending"
      ).length
    : 0;

  if (!user) return null;

  const targetRoles = ['developer', 'staff', 'manager', 'admin'];
  const userRole =
    targetRoles?.find(role => user?.role?.includes(role)) || 'no valid role';

  const runningUser = Array.isArray(users)
    ? users.find((u) => Number(u?.id) === Number(user?.id))
    : null;

  const hasAccess = (item) =>
    !item.roles || (Array.isArray(user?.role) && user?.role.some(role => item.roles.includes(role)));

  const handleLoutOut = () => {
    logout();
  };

  const handleLinkClick = () => {
    onLinkClick?.();
    closeDrawer?.();
  };

  return (
    <div className="flex flex-col h-full select-none">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-3 py-4 mb-2 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
            <h1 className="text-lg font-extrabold text-white tracking-tight">SupplyLink</h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5 capitalize font-medium">{userRole} Command Panel</p>
        </div>
        {closeDrawer && (
          <button onClick={closeDrawer} className="md:hidden text-slate-400 hover:text-white p-1">
            ✕
          </button>
        )}
      </div>

      {/* User Profile Card */}
      <div className="px-3 py-2.5 mb-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full ring-2 ring-indigo-500/30 overflow-hidden bg-slate-800 flex items-center justify-center shrink-0">
          <img
            className="w-full h-full object-cover"
            src={`https://management.supplylinkbd.com/${runningUser?.photo}`}
            alt=""
            onError={(e) => {
              e.target.src = "https://ui-avatars.com/api/?name=" + (runningUser?.name || "User") + "&background=6366f1&color=fff";
            }}
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-slate-100 truncate">{runningUser?.name || "Admin User"}</p>
          <p className="text-xs text-slate-400 font-mono">ID: #{runningUser?.id || "-"}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 px-1 flex-1 overflow-y-auto custom-scrollbar">
        {sidebarMenu.filter(hasAccess).map((item, index) =>
          item.type === "collapse" ? (
            <CollapsibleMenu
              key={index}
              {...item}
              children={item.children?.filter(hasAccess)}
              onLinkClick={handleLinkClick}
              pendingCashApproval={pendingCashApproval}
            />
          ) : (
            <NavLink
              key={index}
              to={item.path}
              end
              className={linkClass}
              onClick={handleLinkClick}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-4 h-4 text-indigo-400 shrink-0" />
                <span className="truncate">{item.label}</span>
              </div>
            </NavLink>
          )
        )}
      </nav>

      {/* Footer */}
      <div className="mt-auto px-2 pt-4 pb-2 border-t border-slate-800/80">
        <button
          onClick={handleLoutOut}
          className="w-full py-2.5 px-3 rounded-xl bg-slate-900/80 hover:bg-rose-500/15 hover:text-rose-400 text-slate-400 border border-slate-800/80 text-xs font-semibold flex items-center justify-center gap-2 transition duration-150"
        >
          <span>🚪</span>
          <span>সাইন আউট (Logout)</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
