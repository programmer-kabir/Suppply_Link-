// import { useState, useEffect } from "react";
// import InvestorHome from "./InvestorHome";
// import CustomerHome from "./CustomerHome";
// import Navbar from "../components/share/Navbar";
// import useCurrentUser from "../Utils/currentUser";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";
// import RoleSelect from "./RoleSelect";
// const HomePage = () => {
//   const runningUser = useCurrentUser();
//   const navigate = useNavigate();

  
//     const [activeRole, setActiveRole] = useState(null);

//   // ✅ allowed roles
//   const allowedRoles = ["investor", "customer"];

//   // ✅ filter roles safely
//   const filteredRoles = (runningUser?.roles || []).filter((r) =>
//     allowedRoles.includes(r)
//   );

//     // ✅ ONLY ONE useEffect (important)
//   useEffect(() => {
//     if (!filteredRoles.length) return;

//     const savedRole = localStorage.getItem("activeRole");

//     if (savedRole && filteredRoles.includes(savedRole)) {
//       setActiveRole(savedRole);
//     } else {
//       setActiveRole(filteredRoles[0]);
//       localStorage.setItem("activeRole", filteredRoles[0]);
//     }
//   }, [runningUser]);

//   const handleRoleChange = (role) => {
//     setActiveRole(role);
//     localStorage.setItem("activeRole", role);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("investorUser");
//     localStorage.removeItem("activeRole");
//     toast.success("আপনি সফলভাবে লগআউট হয়েছেন");
//     setTimeout(() => navigate("/login"), 800);
//   };
//   useEffect(() => {
//     if (!runningUser?.roles) return;

//     const saved = localStorage.getItem("activeRole");

//     if (saved && runningUser.roles.includes(saved)) {
//       setActiveRole(saved);
//     } else {
//       setActiveRole(runningUser.roles[0]);
//       localStorage.setItem("activeRole", runningUser.roles[0]);
//     }
//   }, [runningUser]);

//   if (!runningUser || !activeRole) return null;

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Navbar
//          role={activeRole}
//         user={runningUser}
//         onRoleChange={(role) => {
//           setActiveRole(role);
//           localStorage.setItem("activeRole", role);
//         }}
//         onLogout={handleLogout}
//       />
//       <RoleSelect
//          roles={filteredRoles}
//         activeRole={activeRole}
//         onChange={(role) => {
//           setActiveRole(role);
//           localStorage.setItem("activeRole", role);
//         }}
//       />

//       {activeRole === "customer" && <CustomerHome />}
//       {activeRole === "investor" && <InvestorHome />}
//     </div>
//   );
// };

// export default HomePage;
import { useState, useEffect } from "react";
import InvestorHome from "./InvestorHome";
import CustomerHome from "./CustomerHome";
import Navbar from "../components/share/Navbar";
import useCurrentUser from "../Utils/currentUser";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import RoleSelect from "./RoleSelect";

const HomePage = () => {
  const runningUser = useCurrentUser();
  const navigate = useNavigate();

  const [activeRole, setActiveRole] = useState(null);

  // ✅ allowed roles
  const allowedRoles = ["investor", "customer"];

  // ✅ filter roles safely
  const filteredRoles = (runningUser?.roles || []).filter((r) =>
    allowedRoles.includes(r)
  );

  // ✅ ONLY ONE useEffect (important)
  useEffect(() => {
    if (!filteredRoles.length) return;

    const savedRole = localStorage.getItem("activeRole");

    if (savedRole && filteredRoles.includes(savedRole)) {
      setActiveRole(savedRole);
    } else {
      setActiveRole(filteredRoles[0]);
      localStorage.setItem("activeRole", filteredRoles[0]);
    }
  }, [runningUser]);

  const handleLogout = () => {
    localStorage.removeItem("investorUser");
    localStorage.removeItem("activeRole");
    toast.success("আপনি সফলভাবে লগআউট হয়েছেন");
    setTimeout(() => navigate("/login"), 800);
  };

  if (!runningUser || !activeRole) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        role={activeRole}
        user={runningUser}
        onRoleChange={(role) => {
          setActiveRole(role);
          localStorage.setItem("activeRole", role);
        }}
        onLogout={handleLogout}
      />

      <RoleSelect
        roles={filteredRoles} // ✅ only allowed roles যাবে
        activeRole={activeRole}
        onChange={(role) => {
          setActiveRole(role);
          localStorage.setItem("activeRole", role);
        }}
      />

      {activeRole === "customer" && <CustomerHome />}
      {activeRole === "investor" && <InvestorHome />}
    </div>
  );
};

export default HomePage;