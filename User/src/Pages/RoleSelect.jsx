
const RoleSelect = ({ roles, activeRole, onChange }) => {
  if (!roles || roles.length <= 1) return null;

  return (
   <div className="sticky top-[64px] z-40 bg-white/80 backdrop-blur border-b md:hidden">
  <div className="max-w-7xl mx-auto px-4 py-3 flex justify-center">
    
    {/* Tabs Container */}
    <div className="flex bg-gray-100 p-1.5 rounded-full shadow-sm">
      {roles.map((role) => (
        <button
          key={role}
          onClick={() => onChange(role)}
          className={`relative px-7 py-2 rounded-full text-sm font-semibold transition-all duration-300
            ${
              activeRole === role
                ? "bg-indigo-600 text-white shadow-md scale-[1.02]"
                : "text-gray-600 hover:text-gray-800"
            }`}
        >
          {role === "customer" ? "Customer" : "Investor"}
        </button>
      ))}
    </div>

  </div>
</div>

  );
};

export default RoleSelect;
