import React from "react";
import { PRIORITY_OPTIONS } from "../../../utils/dashboardHelpers";

const AssignTasksModal = ({
  isOpen,
  onClose,
  staffUsers,
  selectedStaffId,
  setSelectedStaffId,
  assignDueDate,
  setAssignDueDate,
  taskRows,
  addTaskRow,
  removeTaskRow,
  updateTaskRow,
  onAssignAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-3">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      <div className="relative w-full max-w-3xl rounded border border-white/10 bg-[#0b1220]/95 p-5 max-h-[75vh] overflow-y-auto sl-scroll">
        <h3 className="text-white font-semibold text-lg">Assign Tasks</h3>
        <p className="text-xs text-slate-400 mt-1">
          Short title + optional description + priority
        </p>

        {/* staff */}
        <div className="mt-3">
          <label className="text-xs text-slate-400">Staff</label>
          <select
            value={selectedStaffId}
            onChange={(e) => setSelectedStaffId(e.target.value)}
            className="w-full rounded-xl px-3 py-2 text-sm bg-[#0f1b2d] text-white border border-white/10"
          >
            <option value="">Select staff</option>
            {staffUsers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} (#{s.id})
              </option>
            ))}
          </select>
        </div>

        {/* tasks */}
        <div className="mt-4 space-y-3">
          {taskRows.map((row, idx) => (
            <div
              key={row.id}
              className="rounded-xl border border-white/10 bg-white/5 p-3"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-slate-400">Task {idx + 1}</p>
                {taskRows.length > 1 && (
                  <button
                    onClick={() => removeTaskRow(row.id)}
                    className="text-xs text-red-400 hover:text-red-300"
                  >
                    Remove
                  </button>
                )}
              </div>

              <input
                placeholder="Task title (short)"
                value={row.title}
                onChange={(e) => updateTaskRow(row.id, "title", e.target.value)}
                className="w-full rounded-lg px-3 py-2 text-sm bg-[#0f1b2d] text-white border border-white/10"
              />

              <div className="mt-2">
                <label className="block text-[11px] text-slate-400 mb-1">
                  Priority
                </label>
                <select
                  value={row.priority || "medium"}
                  onChange={(e) =>
                    updateTaskRow(row.id, "priority", e.target.value)
                  }
                  className="w-full rounded-lg px-3 py-2 text-sm bg-[#0f1b2d] text-white border border-white/10"
                >
                  {PRIORITY_OPTIONS.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>

              <textarea
                rows={2}
                placeholder="Description (optional, details)"
                value={row.description}
                onChange={(e) =>
                  updateTaskRow(row.id, "description", e.target.value)
                }
                className="w-full mt-2 rounded-lg px-3 py-2 text-sm bg-[#0f1b2d] text-white border border-white/10 resize-none"
              />
              <input
                placeholder="Credit Points"
                value={row.credit_points}
                onChange={(e) =>
                  updateTaskRow(row.id, "credit_points", e.target.value)
                }
                className="w-full rounded-lg px-3 py-2 text-sm bg-[#0f1b2d] text-white border border-white/10"
              />
            </div>
          ))}
        </div>

        <button
          onClick={addTaskRow}
          className="mt-3 text-sm text-sky-400 hover:text-sky-300"
        >
          + Add another task
        </button>

        {/* due date */}
        <div className="mt-3">
          <label className="text-xs text-slate-400">Due date</label>
          <input
            type="date"
            value={assignDueDate}
            onChange={(e) => setAssignDueDate(e.target.value)}
            className="w-full mt-1 rounded-xl px-3 py-2 text-sm bg-[#0f1b2d] text-white border border-white/10 date-fix"
          />
        </div>

        {/* actions */}
        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/80"
          >
            Cancel
          </button>
          <button
            onClick={onAssignAll}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white"
          >
            Assign All
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignTasksModal;
