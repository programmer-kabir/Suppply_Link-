import { TableInput } from "../TableInput";

export const DownPaymentRow = ({ card, amount, calc }) => (
  <tr>
    <td className="p-4 border-r border-slate-700 text-emerald-300">
      ডাউন পেমেন্ট
    </td>
    <td className="p-4 border-r border-slate-700">
      <input value={amount} readOnly className="input" />
    </td>
    <td className="p-4 border-r border-slate-700">
      <input
        value={calc.principal}
        readOnly
        className="input text-emerald-300"
      />
    </td>
    <td className="p-4 border-r border-slate-700">
      <input value={calc.profit} readOnly className="input text-yellow-300" />
    </td>
    <td className="p-4 border-r border-slate-700">
      <TableInput type="date" value={card?.delivery_date} />
    </td>
    <td className="p-4 border-r border-slate-700">
      <TableInput type="date" value={card?.delivery_date} />
    </td>
    <td className="p-4 border-r border-slate-700">
      <select className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1">
        <option>Cash</option>
        <option>Bank</option>
        <option>Bkash</option>
        <option>Nagad</option>
      </select>
    </td>
    <td className="p-4 border-r border-slate-700">
      <input className=" bg-slate-900 border border-slate-700 rounded px-2 py-1" />
    </td>
    <td className="p-4 border-r border-slate-700">
      <select className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1">
        <option value="Unpaid">Unpaid</option>
        <option value="Paid">Paid</option>
      </select>
    </td>
    <td className="p-4 flex gap-2">-</td>
  </tr>
);
