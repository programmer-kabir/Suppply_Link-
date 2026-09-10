import { FiSave, FiTrash2 } from "react-icons/fi";
import { addMonths } from "../../utils/date";
import { calculatePrincipalProfit } from "../../utils/finance";
import { TableInput } from "../TableInput";
import useUsers from "../../utils/Hooks/useUsers";
import { useMemo } from "react";

export const InstallmentItemRow = ({
  index,
  item,
  card,
  bnNumbers,
  costPrice,
  salePrice,
  onAmountChange,
                payments

}) => {
  const { principal, profit } = calculatePrincipalProfit(
    item.amount,
    costPrice,
    salePrice,
  );
// true / false

  return (
    <tr className="border-t border-slate-700">
      <td className="p-4 border-r border-slate-700">
        {bnNumbers[index]} কিস্তি
      </td>

      <td className="p-4 w-[180px] border-r border-slate-700">
        <TableInput
          value={item.amount}
          onChange={(e) => onAmountChange(index, e.target.value)}
        />
      </td>

      <td className="p-4 w-[180px] border-r border-slate-700">
        <TableInput value={principal} readOnly className="text-emerald-300" />
      </td>

      <td className="p-4 w-[180px] border-r border-slate-700">
        <TableInput value={profit} readOnly className="text-yellow-300" />
      </td>

      <td className="p-4 w-[180px] border-r border-slate-700">
        <TableInput
          type="date"
          value={addMonths(card.first_installment_date, index)}
          readOnly
        />
      </td>
      <td className="p-4 w-[180px] border-r border-slate-700">
        <TableInput type="date" />
      </td>
      <td className="p-4  border-r border-slate-700">
        <select className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1">
          <option>Cash</option>
          <option>Bank</option>
          <option>Bkash</option>
          <option>Nagad</option>
        </select>
      </td>
      <td className="p-4  w-[120px]  border-r border-slate-700">
        <TableInput type="text" readOnly className="text-yellow-300" />

        {/* <input className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1" /> */}
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
};
