import { NavLink } from "react-router-dom";
import CollapsibleMenu from "../CollapsibleMenu ";
import { sidebarMenu } from "../../../public/sidebarMenu";
import { useAuth } from "../../Provider/AuthProvider";
import useUsers from "../../utils/Hooks/useUsers";
import useCashReports from "../../utils/Hooks/cash/useCashReports";

const linkClass = ({ isActive }) =>
  `px-4 py-3 rounded-lg flex items-center gap-3 ${
    isActive ? "bg-white/10" : "hover:bg-white/5"
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
    <div className="flex flex-col h-full ">
      {/* Header */}
      <div className="flex justify-between px-2 py-4">
        <div>
          <h1 className="text-2xl font-bold">SupplyLink Dashboard</h1>
          {/* <p className="text-sm text-gray-300">Admin Panel</p> */}
          <p className="text-sm text-gray-300">{userRole} Panel</p>
        </div>
        {closeDrawer && (
          <button onClick={closeDrawer} className="md:hidden">
            {/* <IoClose /> */}
          </button>
        )}
      </div>

      {/* Profile */}
      <div className="px-2 mb-4 flex gap-3 items-center">
        <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center">
          <img
            className=" rounded-full"
            src={`https://management.supplylinkbd.com/${runningUser?.photo}`}
            alt=""
          />
        </div>
        <div>
          <p className="text-sm font-semibold">{runningUser?.name}</p>
          <p className="text-xs text-gray-400">ID: {runningUser?.id}</p>
        </div>
      </div>

      {/* Navigation */}

      {/* <nav className="flex flex-col gap-2 px-2">
        {sidebarMenu.filter(hasAccess).map((item, index) =>
          item.type === "collapse" ? (
            <CollapsibleMenu
              key={index}
              {...item}
              children={item.children?.filter(hasAccess)}
              onLinkClick={handleLinkClick}
            />
          ) : (
            <NavLink
              key={index}
              to={item.path}
              end
              className={linkClass}
              onClick={handleLinkClick}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ),
        )}
      </nav> */}
<nav className="flex flex-col gap-2 px-2">
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
    <item.icon className="w-5 h-5" />
    <span>{item.label}</span>
  </div>
</NavLink>
    )
  )}
</nav>
      {/* Footer */}
      <div className="mt-auto px-2 pb-4 md:pt-5">
        <button
          onClick={handleLoutOut}
          className="w-full py-2 bg-white/5 rounded-lg hover:bg-white/10"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
