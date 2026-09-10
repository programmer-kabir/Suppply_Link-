import React, { useMemo } from "react";
import { FaUserTie, FaIdBadge } from "react-icons/fa";
import { FaUsers } from "react-icons/fa6";
import { Link } from "react-router-dom";

const pickName = (u) =>
  u?.name ?? u?.full_name ?? u?.username ?? `User#${u?.id}`;

const allowedRoles = ["admin", "manager", "staff", "developer"];

const getAllowedRoles = (u) => {
  if (Array.isArray(u?.roles)) {
    return u.roles
      .map((r) => String(r).toLowerCase().trim())
      .filter((r) => allowedRoles.includes(r));
  }

  const role =
    u?.role_name ?? u?.role ?? u?.user_role ?? u?.userType ?? u?.type ?? "";
  const r = String(role).toLowerCase().trim();

  return allowedRoles.includes(r) ? [r] : [];
};

const RoleBadge = ({ text = "" }) => {
  const t = String(text || "").toLowerCase();
  const primary = t.includes("admin")
    ? "bg-rose-500/15 text-rose-200 border-rose-500/30"
    : t.includes("manager")
    ? "bg-amber-500/15 text-amber-200 border-amber-500/30"
    : t.includes("developer")
    ? "bg-indigo-500/15 text-indigo-200 border-indigo-500/30"
    : "bg-emerald-500/15 text-emerald-200 border-emerald-500/30";

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs ${primary}`}
      title={text}
    >
      <FaUserTie className="opacity-80" />
      <span className="capitalize">{text || "staff"}</span>
    </span>
  );
};

const toStr = (n) => String(n ?? 0);

export const StaffCard = ({
  staff,
  installmentCard = [],
  investmentCards = [],
  onView,
}) => {
  const name = pickName(staff);

  const allowed = getAllowedRoles(staff);
  if (allowed.length === 0) return null;

  const roleText = allowed.join(", ");
  const staffId = Number(staff?.id);

  // ✅ Sales + Investors counts (string)
  const stats = useMemo(() => {
    let sales = 0;
    let investors = 0;
    let profit = 0;
    let cost_price = 0;
    let total_investment = 0;
    (installmentCard || []).forEach((c) => {
      const refId = Number(c?.reference_user_id);
      if (refId && refId === staffId) {
        sales += 1;
        profit += Number(c?.profit || 0); // ✅ profit sum
      }
    });
    (installmentCard || []).forEach((c) => {
      const refId = Number(c?.reference_user_id);
      if (refId && refId === staffId) {
        cost_price += Number(c?.cost_price || 0); // ✅ cost_price sum
      }
    });

    (investmentCards || []).forEach((ic) => {
      const refId = Number(ic?.reference_user_id);
      if (refId && refId === staffId) investors += 1;
    });
    (investmentCards || []).forEach((ic) => {
      const refId = Number(ic?.reference_user_id);
      if (refId && refId === staffId) {
        total_investment += Number(ic?.investment_amount || 0);
      }
    });

    return {
      sales: String(sales),
      investors: String(investors),
      profit: profit.toLocaleString("en-US", {
        maximumFractionDigits: 2,
      }),
      cost_price: cost_price.toLocaleString("en-US", {
        maximumFractionDigits: 2,
      }),
      total_investment: total_investment.toLocaleString("en-US", {
        maximumFractionDigits: 2,
      }),
    };
  }, [installmentCard, investmentCards, staffId]);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.07] transition shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-4">
            <img
              src={
                staff?.photo
                  ? `https://management.supplylinkbd.com/${staff.photo}`
                  : ""
              }
              alt={name}
              className="w-14 h-14 rounded-full border border-white/10 object-cover bg-white/5"
              onError={(e) => {
                e.currentTarget.src =
                  "https://ui-avatars.com/api/?name=" +
                  encodeURIComponent(name) +
                  "&background=0D2235&color=fff";
              }}
            />

            <div className="min-w-0">
              <h3 className="text-white font-semibold truncate">{name}</h3>
              <div className="mt-2">
                <RoleBadge text={roleText} />
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-300 flex items-center gap-2">
            <FaIdBadge className="opacity-80" />
            <span>ID: {staffId || "-"}</span>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-white/10 bg-black/20 p-3">
            <p className="text-[11px] text-slate-400">Sales Count</p>
            <p className="text-white font-semibold mt-1">{stats.sales}</p>
          </div>

          <div className="rounded-xl border border-white/10 bg-black/20 p-3">
            <p className="text-[11px] text-slate-400">Total Amount</p>
            <p className="text-white font-semibold mt-1">{stats.cost_price}</p>
          </div>

          <div className="rounded-xl border border-white/10 bg-black/20 p-3">
            <p className="text-[11px] text-slate-400">Total Profit </p>
            <p className="text-white font-semibold mt-1">{stats.profit}</p>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-white/10 bg-black/20 p-3">
            <p className="text-[11px] text-slate-400">Total Investors</p>
            <p className="text-white font-semibold mt-1">{stats.investors}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-black/20 p-3">
            <p className="text-[11px] text-slate-400">Total Investment </p>
            <p className="text-white font-semibold mt-1">
              {stats.total_investment}
            </p>
          </div>
        </div>
        <div className="mt-5 text-center">
          <div className="rounded-xl border border-white/10 bg-black/20 p-3">
            <p className="text-[11px] text-slate-400">Total Credit</p>
            <p className="text-white font-semibold mt-1">{stats.investors}</p>
          </div>
        </div>
      </div>

      <div className="px-5 pb-5 flex items-center gap-3">
        <button
          onClick={() => onView?.(staff)}
          className="flex-1 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 transition"
        >
          <Link to={`view_reports?staffId=${staffId}`}>View Report</Link>
        </button>

        <Link to={`referred-users?staffId=${staffId}`}>
          <button
            type="button"
            className="w-11 h-11 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-white flex items-center justify-center transition"
            title="Team"
          >
            <FaUsers />
          </button>
        </Link>
      </div>
    </div>
  );
};
