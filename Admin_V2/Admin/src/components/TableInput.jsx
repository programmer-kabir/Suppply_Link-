export const TableInput = ({
  value,
  onChange,
  type = "text",
  readOnly = false,
  className = "",
}) => (
  <input
    type={type}
    value={value}
    readOnly={readOnly}
    onChange={onChange}
    className={`w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 ${className}`}
  />
);
