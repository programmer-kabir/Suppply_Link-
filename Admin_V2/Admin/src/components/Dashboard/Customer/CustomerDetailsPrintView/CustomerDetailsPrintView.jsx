import React, { useMemo } from "react";
import "./CustomerDetailsPrintView.css";
import {
  getPrintSignatureByName,
  getSignatureByName,
} from "../../../../../public/signature";

const padRows = (rows, target) => {
  const out = [...rows];
  while (out.length < target) out.push(null);
  return out;
};

const toBnDigits = (input) =>
  String(input ?? "").replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[d]);

const formatBDTbn = (n) => {
  const num = Number(n);
  if (!isFinite(num)) return "";
  return toBnDigits(num.toLocaleString("en-US")); // comma সহ
};

const addMonths = (dateStr, months) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";

  const day = d.getDate();
  d.setMonth(d.getMonth() + months);

  // month overflow fix (e.g., Jan 31 + 1 month)
  if (d.getDate() !== day) d.setDate(0);

  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();

  // dd-mm-yyyy (Bangla digits)
  return toBnDigits(`${dd}-${mm}-${yyyy}`);
};

const getLastInstallmentDate = (firstDate, installmentCount) => {
  const count = Number(installmentCount) || 0;
  if (!firstDate || count <= 0) return "";
  return addMonths(firstDate, count - 1);
};

const CustomerDetailsPrintView = ({
  user,
  users,
  granter,
  cards = [],
  onClose,
  minRows = 0, // 0 => only dynamic | 12 => form-style blank rows
  company = {
    address:
      "গণপ্রজাতন্ত্রী বাংলাদেশ সরকার কর্তৃক অনুমোদিত (রেজি: C-201532/2025)",
    name: "সাপ্লাইলিংক বাংলাদেশ লিমিটেড",
    address1: "অফিস: রফিক মঞ্জিল, মঙ্গলকাটা বাজার, সুনামগঞ্জ সদর",
    phone_web: "📞 01339-631586 | 🌐 www.supplylinkbd.com ",
  },
}) => {
  const today = useMemo(() => {
    const d = new Date();
    // dd/mm/yyyy -> bangla digit
    return toBnDigits(d.toLocaleDateString("en-GB"));
  }, []);
  const totalPrincipalAmount = cards[0]?.payments?.reduce((sum, r) => {
    if (!r) return sum;
    return sum + (Number(r.principal_amount) || 0);
  }, 0);
  const totalProfitAmount = cards[0]?.payments?.reduce((sum, r) => {
    if (!r) return sum;
    return sum + (Number(r.profit_amount) || 0);
  }, 0);

  return (
    <div className="print-page-fix min-h-screen bg-slate-900">
      <div className="max-w-[980px] mx-auto">
        {/* Screen controls only */}
        <div className="flex items-center justify-between mb-4 print:hidden">
          <button
            onClick={onClose}
            className="px-3 py-2 rounded bg-gray-800 text-white"
          >
            ← Back
          </button>

          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded bg-blue-600 text-white"
          >
            🖨️ Print
          </button>
        </div>

        <div className="overflow-hidden pb-10">
          <div className="print-area flex flex-col items-center gap-6">
            {cards.map((card, idx) => {
              const payments = (card.payments || [])
                .slice()
                .sort(
                  (a, b) => Number(a.installment_no) - Number(b.installment_no),
                );

              const rows =
                minRows > 0
                  ? padRows(payments, Math.max(minRows, payments.length))
                  : payments;

              const lastInstallmentDate = getLastInstallmentDate(
                card?.first_installment_date,
                card?.installment_count,
              );

              const costPrice =
                (Number(card?.purchase_price) || 0) +
                (Number(card?.additional_cost) || 0);

              const remainingAmount =
                costPrice - (Number(card?.down_payment) || 0);

              return (
                <div
                  key={card.id}
                  className="a4-sheet"
                  style={{ fontFamily: "Kalpurush" }}
                >
                  <div className="sheet-inner">
                    {/* HEADER */}
                    <div className="header">
                      <div className="header-left">
                        <div className="company-address text-center">
                          {company.address}
                        </div>
                        <div className="company-name">{company.name}</div>
                        <div className="company-address1">
                          {company.address1}
                        </div>
                        <div className="company-sub">{company.phone_web}</div>
                      </div>
                    </div>
                    <div className="border-t border-dashed mt-3"></div>
                    <div className="ribbon-wrap ">
                      <div className="ribbon">
                        <span>
                          কার্ড নাম্বার: {toBnDigits(card?.card_number || "")}
                        </span>
                      </div>
                    </div>

                    {/* ===== Customer + Guarantor ===== */}
                    <table className="info-table">
                      <thead>
                        <tr>
                          <th colSpan={2}>👤 গ্রাহকের তথ্য:</th>
                          <th colSpan={2}>🔵 গ্যারান্টরের তথ্য:</th>
                        </tr>
                      </thead>

                      <tbody>
                        <tr>
                          <td className="lbl">গ্রাহকের নাম</td>
                          <td className="val">{user?.name || ""}</td>

                          <td className="lbl">গ্যারান্টরের নাম</td>
                          <td className="val">{granter?.name || ""}</td>
                        </tr>

                        <tr>
                          <td className="lbl">গ্রাহক আইডি</td>
                          <td className="val">{toBnDigits(user?.id || "")}</td>

                          <td className="lbl">এনআইডি নাম্বার</td>
                          <td className="val">
                            {toBnDigits(granter?.nid || "")}
                          </td>
                        </tr>

                        <tr>
                          <td className="lbl">এনআইডি নাম্বার</td>
                          <td className="val">{toBnDigits(user?.nid || "")}</td>

                          <td className="lbl">পিতার নাম</td>
                          <td className="val">{granter?.father_name || ""}</td>
                        </tr>

                        <tr>
                          <td className="lbl">পিতার নাম</td>
                          <td className="val">{user?.father_name || ""}</td>

                          <td className="lbl">মাতার নাম</td>
                          <td className="val">{granter?.mother_name || ""}</td>
                        </tr>

                        <tr>
                          <td className="lbl">মাতার নাম</td>
                          <td className="val">{user?.mother_name || ""}</td>

                          <td className="lbl">মোবাইল নাম্বার</td>
                          <td className="val">
                            {toBnDigits(granter?.mobile || "")}
                          </td>
                        </tr>

                        <tr>
                          <td className="lbl">মোবাইল নাম্বার</td>
                          <td className="val">
                            {toBnDigits(user?.mobile || "")}
                          </td>

                          <td className="lbl">স্থায়ী ঠিকানা</td>
                          <td
                            className={`val addr ${
                              (granter?.permanent_address || "").length > 50
                                ? "addr-small"
                                : ""
                            }`}
                          >
                            {granter?.permanent_address || ""}
                          </td>
                        </tr>

                        <tr>
                          <td className="lbl">স্থায়ী ঠিকানা</td>
                          <td
                            className={`val addr ${
                              (user?.permanent_address || "").length > 50
                                ? "addr-small"
                                : ""
                            }`}
                          >
                            {user?.permanent_address || ""}
                          </td>

                          <td className="lbl">বর্তমান ঠিকানা</td>
                          <td
                            className={`val addr ${
                              (granter?.address || "").length > 50
                                ? "addr-small"
                                : ""
                            }`}
                          >
                            {granter?.address || ""}
                          </td>
                        </tr>

                        <tr>
                          <td className="lbl">বর্তমান ঠিকানা</td>
                          <td
                            className={`val addr ${
                              (user?.address || "").length > 50
                                ? "addr-small"
                                : ""
                            }`}
                          >
                            {user?.address || ""}
                          </td>

                          <td className="lbl">পেশা ও মাসিক আয়</td>
                          <td className="val">{granter?.occupation || ""}</td>
                        </tr>

                        <tr>
                          <td className="lbl">পেশা ও মাসিক আয়</td>
                          <td className="val">{user?.occupation || ""}</td>

                          <td className="lbl text-[10px]">
                            গ্রাহকের সাথে সম্পর্ক
                          </td>
                          <td className="val">{granter?.relation || ""}</td>
                        </tr>
                      </tbody>

                      <tfoot>
                        <tr>
                          <td colSpan={2} className="attachments">
                            সংযুক্ত: ☐ এনআইডি ফটোকপি ☐ পাসপোর্ট সাইজ ছবি ☐
                            সাম্প্রতিক ব্যাংক স্টেটমেন্ট ☐ আয় সনদ
                          </td>
                          <td colSpan={2} className="attachments">
                            সংযুক্ত: ☐ এনআইডি ফটোকপি ☐ পাসপোর্ট সাইজ ছবি ☐
                            সাম্প্রতিক ব্যাংক স্টেটমেন্ট ☐ আয় সনদ
                          </td>
                        </tr>
                      </tfoot>
                    </table>

                    {/* ===== Product + Plan ===== */}
                    <table className="summary-form-table">
                      <thead>
                        <tr>
                          <th colSpan={2}>📦 পণ্যের তথ্য</th>
                          <th colSpan={2}>📋 কিস্তি পরিকল্পনা</th>
                        </tr>
                      </thead>

                      <tbody>
                        <tr>
                          <td className="lbl">পণ্যের নাম ও বিবরণ</td>
                          <td
                            className={`val addr ${
                              (card?.product_name || "").length > 55
                                ? "addr-small"
                                : ""
                            }`}
                          >
                            {card?.product_name || ""}
                          </td>

                          <td className="lbl">
                            সাপ্লাইলিংকের চুড়ান্ত বিক্রয়মুল্যঃ
                          </td>
                          <td className="val">
                            ৳ {formatBDTbn(card?.sale_price)}
                          </td>
                        </tr>

                        <tr>
                          <td className="lbl">বাজারমূল্য / MRP</td>
                          <td className="val">৳ {formatBDTbn(card?.mrp)}</td>

                          <td className="lbl">ডাউন পেমেন্ট</td>
                          <td className="val">
                            ৳ {formatBDTbn(card?.down_payment)}
                          </td>
                        </tr>

                        <tr>
                          <td className="lbl">সাপ্লাইলিংকের ক্রয়মূল্য (PP)</td>
                          <td className="val">
                            ৳ {formatBDTbn(card?.purchase_price)}
                          </td>

                          <td className="lbl">বাকি পরিমাণ</td>
                          <td className="val">
                            ৳ {formatBDTbn(remainingAmount)}
                          </td>
                        </tr>

                        <tr>
                          <td className="lbl addr">
                            অন্যান্য খরচ (Additional Cost)
                          </td>
                          <td className="val addr">
                            ৳ {formatBDTbn(card?.additional_cost)}
                          </td>

                          <td className="lbl">কিস্তির সংখ্যা</td>
                          <td className="val">
                            {toBnDigits(card?.installment_count || "")}
                          </td>
                        </tr>

                        <tr>
                          <td className="lbl">মোট খরচমুল্য (Cost Price)</td>
                          <td className="val">৳ {formatBDTbn(costPrice)}</td>

                          <td className="lbl">মাসিক কিস্তির পরিমাণ</td>
                          <td className="val">
                            ৳ {formatBDTbn(card?.per_installment_amount)}
                          </td>
                        </tr>

                        <tr>
                          <td className="lbl">মুনাফা হার (%)</td>
                          <td className="val"></td>

                          <td className="lbl">ডেলিভারি তারিখ</td>
                          <td className="val">
                            {card?.delivery_date
                              ? addMonths(card.delivery_date, 0)
                              : ""}
                          </td>
                        </tr>

                        <tr>
                          <td className="lbl">প্রকৃত লাভের হার(%)</td>
                          <td className="val">
                            {" "}
                            ৳ {formatBDTbn(card?.profit)}
                          </td>

                          <td className="lbl">১ম কিস্তির তারিখ</td>
                          <td className="val">
                            {card?.first_installment_date
                              ? addMonths(card.first_installment_date, 0)
                              : ""}
                          </td>
                        </tr>

                        <tr>
                          <td className="lbl">প্রকৃত লাভ</td>
                          <td className="val"></td>

                          <td className="lbl">শেষ কিস্তির তারিখ</td>
                          <td className="val">{lastInstallmentDate}</td>
                        </tr>
                      </tbody>
                    </table>

                    {/* ===== Installment Chart ===== */}
                    <table className="inst-chart-table">
                      <thead>
                        <tr>
                          <th colSpan={10} className="inst-title">
                            🗂️ কিস্তিভিত্তিক পেমেন্ট চার্ট
                          </th>
                        </tr>

                        <tr>
                          <th style={{ width: "35px" }}>নং</th>
                          <th style={{ width: "120px" }}>ট্যাগ</th>
                          <th style={{ width: "90px" }}>পুজি</th>
                          <th style={{ width: "90px" }}>লাভ</th>
                          <th style={{ width: "110px" }}>মোট পরিমাণ</th>
                          <th style={{ width: "110px" }}>পরিশোধের তারিখ</th>
                          <th style={{ width: "95px" }}>বকেয়া</th>
                          <th style={{ width: "100px" }}>পেমেন্ট মাধ্যম</th>
                          <th style={{ width: "120px" }}>রিসিট নং / TrxID</th>
                          <th style={{ width: "100px" }}>
                            গ্রাহণকারীর স্বাক্ষর
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {rows.map((p, i) => {
                          if (!p) {
                            return (
                              <tr key={`blank-${i}`}>
                                {Array.from({ length: 10 }).map((_, k) => (
                                  <td key={k} className="tc"></td>
                                ))}
                              </tr>
                            );
                          }

                          const isDownPayment = Number(p.installment_no) === 0;

                          const tagText = isDownPayment
                            ? "ডাউন পেমেন্ট"
                            : p.tag ||
                              `${toBnDigits(p.installment_no)} নং কিস্তি`;

                          const price = Number(p.due_amount || 0);
                          const paidDate = p.paid_date
                            ? addMonths(p.paid_date, 0)
                            : "";

                          const principalAmount = Number(p.principal_amount);

                          const profitAmount = Number(p.profit_amount);

                          const collectPersonId = Number(p?.collected_by);
                          const collectPerson = users.find(
                            (u) => Number(u.id) === Number(collectPersonId),
                          );
                          return (
                            <tr key={p.id}>
                              <td className="tc">
                                {isDownPayment
                                  ? "০"
                                  : toBnDigits(p.installment_no)}
                              </td>

                              <td className="tc">{tagText}</td>

                              <td className="tc">
                                ৳{formatBDTbn(principalAmount)}
                              </td>
                              <td className="tc">
                                {" "}
                                ৳{formatBDTbn(profitAmount)}
                              </td>
                              <td className="tc">৳ {formatBDTbn(price)}</td>
                              <td className="tc">{paidDate}</td>
                              <td className="tc"></td>
                              <td className="tc"></td>
                              <td className="tc"></td>
                              <td className="tc">
                                {(() => {
                                  const signUrl = getPrintSignatureByName(
                                    collectPerson?.name,
                                  );

                                  if (!signUrl) return null; // signature না থাকলে ফাঁকা

                                  return (
                                    <img
                                      src={signUrl}
                                      alt={`${collectPerson?.name} signature`}
                                      style={{
                                        maxWidth: 40,
                                        maxHeight: 22,
                                        objectFit: "contain",
                                        margin: "0 auto",
                                        display: "block",
                                      }}
                                    />
                                  );
                                })()}
                              </td>
                            </tr>
                          );
                        })}

                        {/* Total row */}
                        <tr>
                          <td colSpan={2} className="total-cell">
                            মোট:
                          </td>
                          <td className="tc">
                            {" "}
                            ৳ {formatBDTbn(totalPrincipalAmount)}
                          </td>
                          <td className="tc">
                            ৳ {formatBDTbn(totalProfitAmount)}
                          </td>
                          <td className="tc"></td>
                          <td className="tc"></td>
                          <td className="tc"></td>
                          <td className="tc"></td>
                          <td className="tc"></td>
                          <td className="tc"></td>
                        </tr>
                      </tbody>
                    </table>

                    {/* FOOTER SIGN */}
                    <div className="footer">
                      <div className="sig">
                        <div className="line" />
                        <div className="cap">গ্রাহকের স্বাক্ষর</div>
                      </div>
                      <div className="sig">
                        <div className="line" />
                        <div className="cap">অফিস অনুমোদন</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailsPrintView;
