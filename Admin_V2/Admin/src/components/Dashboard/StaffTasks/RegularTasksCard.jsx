import React from "react";
import { FiPlus } from "react-icons/fi";

const RegularTasksCard = ({
  taskText,
  setTaskText,
  tasks,
  onAddTask,
  onToggleTask,
}) => {
  const completedCount = tasks.filter((t) => t.done).length;
  const taskProgress = Math.round(
    (completedCount / Math.max(1, tasks.length)) * 100,
  );

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white font-semibold">Regular Tasks</h3>
          <p className="text-xs text-slate-400 mt-1">
            নিজের daily কাজ track করো
          </p>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-400">Completion</div>
          <div className="text-sm font-semibold text-white">
            {taskProgress}%
          </div>
        </div>
      </div>

      <div className="mt-3 w-full h-2 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
          style={{ width: `${taskProgress}%` }}
        />
      </div>

      <div className="mt-4 flex flex-col sm:flex-row gap-2">
        <input
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          placeholder="Add a new task..."
          className="w-full rounded-xl px-3 py-2 text-sm bg-[#0f1b2d] text-slate-100 border border-white/10
          focus:outline-none focus:ring-2 focus:ring-sky-500/60 placeholder:text-slate-400"
        />
        <button
          onClick={onAddTask}
          className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium
          bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500
          text-white border border-white/10 transition active:scale-[0.98]"
        >
          <FiPlus /> Add
        </button>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
        {tasks.map((t) => (
          <button
            key={t.id}
            onClick={() => onToggleTask(t.id)}
            className={`text-left rounded-xl border px-4 py-3 transition ${
              t.done
                ? "border-emerald-400/30 bg-emerald-500/10"
                : "border-white/10 bg-white/5 hover:bg-white/10"
            }`}
          >
            <p className={`text-sm ${t.done ? "text-white" : "text-white/85"}`}>
              {t.title}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              {t.done ? "Completed" : "Pending"}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RegularTasksCard;
