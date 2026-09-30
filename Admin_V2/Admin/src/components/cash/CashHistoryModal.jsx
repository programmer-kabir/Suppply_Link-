import React from "react";
import { FaHistory, FaTimes, FaCalendarAlt, FaMoneyBillWave, FaUserEdit, FaCommentDots, FaInfoCircle } from "react-icons/fa";

const CashHistoryModal = ({ isOpen, onClose, item }) => {
  if (!isOpen || !item) return null;

  let history = [];
  try {
    if (typeof item.edit_history === "string") {
      history = JSON.parse(item.edit_history || "[]");
    } else if (Array.isArray(item.edit_history)) {
      history = item.edit_history;
    }
  } catch (e) {
    history = [];
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col my-8">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
              <FaHistory className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">সম্পাদনার ইতিহাস (Edit History)</h2>
              <p className="text-xs text-slate-400 font-mono">
                Transaction ID: #{item.id} • {history.length} টি পূর্ববর্তী ভার্সন
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition"
          >
            <FaTimes className="w-4 h-4" />
          </button>
        </div>

        {/* Current State Card */}
        <div className="px-6 pt-5 pb-2">
          <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                🟢 বর্তমান অবস্থা (Current Active)
              </span>
              <span className="text-xs text-slate-400 font-mono">{item.date}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block">পরিমাণ:</span>
                <span className="text-sm font-bold font-mono text-emerald-400">
                  ৳ {Number(item.amount || 0).toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">ক্যাটাগরি:</span>
                <span className="text-slate-200 font-medium capitalize">{item.category || "-"}</span>
              </div>
              <div>
                <span className="text-slate-400 block">সোর্স / বিবরণ:</span>
                <span className="text-slate-200 font-medium truncate block">{item.source || item.purpose || "-"}</span>
              </div>
              <div>
                <span className="text-slate-400 block">সর্বশেষ এডিট:</span>
                <span className="text-slate-300 font-mono text-[11px]">{item.updated_at || item.createdAt || "-"}</span>
              </div>
            </div>
            {item.last_edit_reason && (
              <div className="mt-3 pt-2.5 border-t border-indigo-500/20 text-xs text-indigo-200/90">
                <span className="font-semibold text-indigo-300">সর্বশেষ কারণ:</span> {item.last_edit_reason}
              </div>
            )}
          </div>
        </div>

        {/* History Timeline */}
        <div className="p-6 overflow-y-auto max-h-[60vh] space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <FaHistory className="text-slate-500" /> অতীতের পরিবর্তনসমূহ
          </h3>

          {history.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-sm">
              কোনো পূর্ববর্তী এডিট হিস্টোরি পাওয়া যায়নি।
            </div>
          ) : (
            <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-800">
              {history.slice().reverse().map((h, index) => {
                const versionNum = history.length - index;
                return (
                  <div key={index} className="relative pl-8 space-y-2">
                    {/* Timeline Node */}
                    <div className="absolute left-1.5 top-1.5 w-4 h-4 rounded-full bg-slate-900 border-2 border-indigo-500 flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/90 shadow-md space-y-3">
                      {/* Version Header */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-slate-800 text-indigo-300 font-mono font-bold">
                            v{versionNum} (পূর্বের মান)
                          </span>
                          <span className="text-slate-400 flex items-center gap-1">
                            <FaUserEdit className="text-slate-500" /> {h.editor_name || "Admin"}
                          </span>
                        </div>
                        <span className="text-slate-500 font-mono text-[11px] flex items-center gap-1">
                          <FaCalendarAlt className="text-slate-600" /> {h.edited_at || "-"}
                        </span>
                      </div>

                      {/* Snapshot Values */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                        <div>
                          <span className="text-slate-500 block">টাকার পরিমাণ:</span>
                          <span className="text-sm font-bold font-mono text-slate-300">
                            ৳ {Number(h.amount || 0).toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">তারিখ ছিল:</span>
                          <span className="text-slate-300 font-mono">{h.date || "-"}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">ক্যাটাগরি ছিল:</span>
                          <span className="text-slate-300 capitalize">{h.category || "-"}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">সোর্স / বিবরণ:</span>
                          <span className="text-slate-300 truncate block">{h.source || h.purpose || "-"}</span>
                        </div>
                      </div>

                      {h.remarks && (
                        <div className="text-xs text-slate-400">
                          <span className="text-slate-500 font-medium">নোট:</span> {h.remarks}
                        </div>
                      )}

                      {/* Reason Box */}
                      {h.edit_reason && (
                        <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
                          <div className="flex items-center gap-1 font-semibold text-amber-400 mb-0.5">
                            <FaCommentDots className="w-3 h-3" /> এডিটের কারণ:
                          </div>
                          <p className="leading-relaxed pl-4">{h.edit_reason}</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold transition"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};

export default CashHistoryModal;
