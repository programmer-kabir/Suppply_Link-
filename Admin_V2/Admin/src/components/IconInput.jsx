import React from "react";

const IconInput = ({
  label,
  icon: Icon,
  register,
  name,
  type = "text",
  placeholder,
  textarea = false,
  rows = 2,
  children,
  ...rest
}) => {
  const inputWrapper =
    "flex items-center gap-2 bg-[#0f1b2d] border border-white/10 rounded-lg px-3 py-1";

  const inputClass =
    "w-full py-2 text-base bg-transparent text-white focus:outline-none placeholder:text-slate-400";

  const iconClass = "text-slate-400";

  return (
    <div className="space-y-1">
      {label && <label className="text-sm text-slate-300">{label}</label>}

      {/* TEXTAREA */}
      {textarea ? (
        <div className="relative bg-[#0f1b2d] border border-white/10 rounded-lg">
          {Icon && <Icon className="absolute left-3 top-3 text-slate-400" />}
          <textarea
            {...register(name)}
            rows={rows}
            placeholder={placeholder}
            {...rest}
            className="w-full pl-10 pr-3 py-2 bg-transparent text-white focus:outline-none placeholder:text-slate-400 resize-none"
          />
        </div>
      ) : (
        <div className={inputWrapper}>
          {Icon && <Icon className={iconClass} />}
          {children ? (
            children
          ) : (
            <input
              type={type}
              {...register(name)}
              placeholder={placeholder}
              {...rest}
              className={inputClass}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default IconInput;
