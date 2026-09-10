import { Link } from "react-router-dom";

const CashButton = ({ text, icon: Icon, accent, onClick, link }) => {
  // 👉 যদি link থাকে → Link use হবে
  if (link) {
    return (
      <Link
        to={link}
        className="flex items-center justify-center gap-2 p-4 rounded-xl bg-[#111827] border border-white/10 text-white hover:bg-[#1f2937] transition"
      >
        <Icon className={accent} />
        {text}
      </Link>
    );
  }

  // 👉 না থাকলে normal button
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center gap-2 p-4 rounded-xl bg-[#111827] border border-white/10 text-white hover:bg-[#1f2937] transition"
    >
      <Icon className={accent} />
      {text}
    </button>
  );
};

export default CashButton;
