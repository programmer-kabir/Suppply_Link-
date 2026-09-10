import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

const ChartCashReports = ({chartData}) => {
  return (
    <div className="xl:col-span-2 bg-[#131c31] border border-[#1d2942] rounded-3xl p-5">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-white">Cash Flow Overview</h2>

        <p className="text-sm text-gray-400 mt-1">আয় এবং ব্যয়ের তুলনা</p>
      </div>

      <div className="h-[380px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barGap={8}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />

            <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: "#94a3b8" }} />

            <YAxis stroke="#94a3b8" tick={{ fill: "#94a3b8" }} />

            <Tooltip cursor={{ fill: "transparent" }} />

            <Legend />

            <Bar
              dataKey="cashIn"
              name="আয়"
              fill="#22c55e"
              radius={[8, 8, 0, 0]}
            />

            <Bar
              dataKey="cashOut"
              name="ব্যয়"
              fill="#ef4444"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartCashReports;
