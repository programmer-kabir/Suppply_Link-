import React, { useEffect, useMemo, useState } from "react";
import BackButton from "../../../components/BackButton/BackButton";
import axios from "axios";
import { toast } from "react-toastify";
import useUsers from "../../../utils/Hooks/useUsers";

/* ---------- helpers ---------- */
const pad2 = (n) => String(n).padStart(2, "0");

const formatYMD = (d) => {
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return "";
  return `${dt.getFullYear()}-${pad2(dt.getMonth() + 1)}-${pad2(dt.getDate())}`;
};

const addYearsKeepDate = (ymd, years = 1) => {
  if (!ymd) return "";
  const [y, m, d] = ymd.split("-").map(Number);
  if (!y || !m || !d) return "";
  const dt = new Date(y, m - 1, d);
  dt.setFullYear(dt.getFullYear() + years);
  return formatYMD(dt);
};

/* ---------- API call (inline) ---------- */
async function createInvestmentCard(payload) {
  // ✅ তোমার আসল endpoint বসাও
  const res = await fetch("/api/investment_cards/create.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok || data?.success === false) {
    throw new Error(data?.message || "Card create failed");
  }

  return data;
}

const CreateInvestmentCard = () => {
  const { isUsersLoading, users, isUsersError } = useUsers();
  const officialStaff = useMemo(() => {
    const allowedRoles = ["admin", "manager", "staff", "developer"];

    return (users || []).filter((u) => {
      // Case A: roles array
      if (Array.isArray(u.roles)) {
        return u.roles.some((r) =>
          allowedRoles.includes(String(r).toLowerCase())
        );
      }

      // Case B: single role fields (fallback)
      const role =
        u.role_name ?? u.role ?? u.user_role ?? u.userType ?? u.type ?? "";
      return allowedRoles.includes(String(role).toLowerCase());
    });
  }, [users]);
  const today = useMemo(() => formatYMD(new Date()), []);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    investor_id: "",
    card_name: "",
    payment_type: "flexible",
    start_date: today,
    maturity_date: addYearsKeepDate(today, 1),
    status: "running",
    created_at: today,
  });

  // start_date change হলে maturity_date auto +1 year
  useEffect(() => {
    setForm((p) => ({
      ...p,
      maturity_date: addYearsKeepDate(p.start_date, 1),
    }));
  }, [form.start_date]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.investor_id || !form.card_name || !form.start_date) {
      alert("Investor ID, Card Name, Start Date লাগবে");
      return;
    }

    const payload = {
      investor_id: Number(form.investor_id),
      card_name: form.card_name.trim(),
      payment_type: form.payment_type,
      start_date: form.start_date,
      maturity_date: addYearsKeepDate(form.start_date, 1),
      status: "running",
      created_at: today,
      reference_user_id: form.reference_user_id
        ? Number(form.reference_user_id)
        : null,
    };

    try {
      setIsSubmitting(true);
      const response = await axios.post(
        `${
          import.meta.env.VITE_LOCALHOST_KEY
        }/investors/create_investment_card.php`,
        payload
      );
      toast.success(
        `${response.data.data.card_name} এর কার্ড সফলভাবে তৈরি হয়েছে`
      );
      //   alert("✅ Investment Card Created!");

      // reset (optional)
      setForm((p) => ({
        ...p,
        card_name: "",
        payment_type: "flexible",
        start_date: today,
        maturity_date: addYearsKeepDate(today, 1),
        status: "running",
        created_at: today,
      }));
    } catch (err) {
      alert(err?.message || "Create failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-5 pb-7 px-5">
      <BackButton />

      <div className="mt-4 max-w-3xl mx-auto rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <h2 className="text-lg font-semibold text-white">
          Create Investment Card
        </h2>
        <p className="mt-1 text-sm text-white/60">
          Start Date দিলেই Maturity Date অটো 1 বছর পরে হবে।
        </p>

        <form onSubmit={handleSubmit} className="mt-5 grid grid-cols-1 gap-4">
          <div>
            <label className="text-sm text-white/70">Investor ID</label>
            <input
              name="investor_id"
              type="number"
              value={form.investor_id}
              onChange={handleChange}
              placeholder="e.g. 1"
              className="mt-1 w-full rounded-xl bg-black/20 border border-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-indigo-400/40"
            />
          </div>

          <div>
            <label className="text-sm text-white/70">Card Name</label>
            <input
              name="card_name"
              value={form.card_name}
              onChange={handleChange}
              placeholder="e.g. VIP Card"
              className="mt-1 w-full rounded-xl bg-black/20 border border-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-indigo-400/40"
            />
          </div>

          <div>
            <label className="text-sm text-white/70">Payment Type</label>
            <select
              name="payment_type"
              value={form.payment_type}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl bg-black/20 border border-white/10 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-400/40"
            >
              <option value="flexible">flexible</option>
              <option value="onetime">onetime</option>
              <option value="daily">daily</option>
              <option value="weekly">weekly</option>
              <option value="monthly">monthly</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-white/70">Start Date</label>
            <input
              name="start_date"
              type="date"
              value={form.start_date}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl bg-black/20 border border-white/10 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-400/40"
            />
          </div>
          <div>
            <label className="text-sm text-white/70">
              Reference (Official Staff)
            </label>
            <select
              name="reference_user_id"
              value={form.reference_user_id}
              onChange={handleChange}
              disabled={isUsersLoading || isUsersError}
              className="mt-1 w-full rounded-xl bg-black/20 border border-white/10 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-400/40 disabled:opacity-60"
            >
              <option value="">
                {isUsersLoading
                  ? "Loading staff..."
                  : isUsersError
                  ? "Staff load failed"
                  : "Select Reference Staff"}
              </option>

              {officialStaff.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name ?? u.full_name ?? u.username ?? `User#${u.id}`}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="rounded-xl border border-white/10 bg-black/20 p-3">
              <div className="text-xs text-white/50">Maturity Date (auto)</div>
              <div className="mt-1 text-sm text-white font-semibold">
                {form.maturity_date || "-"}
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/20 p-3">
              <div className="text-xs text-white/50">Status (default)</div>
              <div className="mt-1 text-sm text-white font-semibold">
                running
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 rounded-xl bg-indigo-500/20 border border-indigo-400/30 px-4 py-2.5 text-sm text-indigo-200 hover:bg-indigo-500/30 disabled:opacity-50"
          >
            {isSubmitting ? "Creating..." : "Create Card"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateInvestmentCard;
