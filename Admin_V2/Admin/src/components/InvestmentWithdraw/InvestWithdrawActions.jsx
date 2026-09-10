import Swal from "sweetalert2";
import { toast } from "react-toastify";
import useProfitAnalytics from "../../utils/Hooks/useProfitAnalytics";
// import ''
export const createWithdrawActions = ({ user, refetch, baseUrl }) => {
  const updateWithdraw = async (payload) => {
    const res = await fetch(
      `${baseUrl}/withdraw_applications/update_withdraw_request.php`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      },
    );
    const data = await res.json();
    if (!data?.success) throw new Error(data?.message || "Update failed");
    return data;
  };

  const handleReject = async (row) => {
    if (!row?.id) return;

    const { value: note, isConfirmed } = await Swal.fire({
      title: `Reject request #${row.id}?`,
      input: "textarea",
      inputLabel: "Reject reason (required)",
      inputPlaceholder: "Type reject reason...",
      showCancelButton: true,
      confirmButtonText: "Reject",
      confirmButtonColor: "#ef4444",
      preConfirm: (v) => {
        const t = String(v || "").trim();
        if (!t) {
          Swal.showValidationMessage("Reject reason is required");
          return false;
        }
        return t;
      },
    });

    if (!isConfirmed) return;

    try {
      await updateWithdraw({
        request_id: row.id,
        action: "rejected",
        reject_reason: note,
        reviewed_by: user?.id,
      });
      await refetch?.();
      toast.success(`Request #${row.id} rejected`);
    } catch (e) {
      toast.error(e.message);
    }
  };

  const handlePaid = async (row) => {
    if (!row?.id) return;

    const { value: pm, isConfirmed } = await Swal.fire({
      title: `Mark as paid #${row.id}?`,
      input: "text",
      inputLabel: "Payment method (optional)",
      inputPlaceholder: "Cash / bKash / Nagad / Bank ...",
      showCancelButton: true,
      confirmButtonText: "Mark Paid",
      confirmButtonColor: "#22c55e",
      preConfirm: (v) => String(v || "").trim(),
    });

    if (!isConfirmed) return;

    try {
      await updateWithdraw({
        request_id: row.id,
        action: "paid",
        payment_method: pm || "Cash",
        reviewed_by: user?.id,
      });
      await refetch?.();
      toast.success(`Request #${row.id} marked as paid`);
    } catch (e) {
      toast.error(e.message);
    }
  };

  return { handleReject, handlePaid };
};


// const {isProfitAnalyticsLoading,isUProfitAnalyticsError,profitAnalytics} = useProfitAnalytics()
export const handlePrint = (row) => {
const today = new Date().toISOString().slice(0, 10);
// const profit = profitAnalytics.filter(ap=>ap.card_id===row.card_id)
// console.log(profit)

const maturityDate = (row?.maturity_date || "").slice(0, 10);


const isMaturityWithdraw =
  maturityDate && today >= maturityDate;

  if (!row) return;

  const bnDigits = (s) =>
    String(s ?? "")
      .replaceAll("0", "০")
      .replaceAll("1", "১")
      .replaceAll("2", "২")
      .replaceAll("3", "৩")
      .replaceAll("4", "৪")
      .replaceAll("5", "৫")
      .replaceAll("6", "৬")
      .replaceAll("7", "৭")
      .replaceAll("8", "৮")
      .replaceAll("9", "৯");

  const bnDate = (dateStr) => {
    // expects YYYY-MM-DD
    const d = (dateStr || "").slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) return bnDigits(d || "");
    const [y, m, day] = d.split("-");
    return `${bnDigits(day)}-${bnDigits(m)}-${bnDigits(y)}`;
  };
  const profitAmount = Number(row?.total_profit || 0);
  const mainAmount = Number(row?.amount || 0);
  const totalAmount = mainAmount + profitAmount;
  const safe = (t) =>
    String(t ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

  const w = window.open("", "_blank", "width=900,height=650");
  if (!w) return;

  const html = `
<!doctype html>
<html lang="bn">
<head>
  <meta charset="utf-8" />
  <title>Withdraw Request #${safe(row.id)}</title>

  <style>
    /* ===== toolbar (screen only) ===== */
   /* ===== A4 print area ===== */
@page { size: A4; margin: 16mm 16mm; }

body{
  margin:0;
  background:#111827;
}

/* screen view */
.page{
  background:#fff;
  color:#000;
  width: 210mm;
  min-height: 297mm;
  margin: 14px auto;          /* ✅ top-bottom কম */
  box-shadow: 0 10px 30px rgba(0,0,0,.25);
}

/* ✅ only for SCREEN: keep padding */
.content{
  padding: 10mm 10mm;          /* ✅ 25mm থেকে কম */
  font-family: "Kalpurush","Siyam Rupali","SolaimanLipi", Arial, sans-serif;
  font-size: 14px;             /* ✅ একটু ছোট */
  line-height: 1.65;           /* ✅ tight */
}

/* tighten spacing */
p{ margin: 8px 0; font-size:22px; }            /* ✅ paragraph gap কম */
.header{ text-align:center; margin-bottom: 8px; }
.company-name{ font-size:40px; font-weight:700; }
.company-address{ font-size:30px; }
.divider{ border-top:1px solid #000; margin: 8px 0 10px; }
.title{
  font-size:26px;
  font-weight:700;
  text-align:center;
  text-decoration: underline;
  margin-bottom: 12px;
}
  .info-block{
  margin: 6px 0 !important;
  line-height: 1.4 !important;
}
.meta{ display:flex; justify-content: space-between; margin-bottom: 10px;font-size:22px; }
.to{ margin-bottom: 10px;font-size:22px; }
.subject{ font-weight:700; margin-bottom: 10px;font-size:22px; }
.signature{ margin-top: 20px; }
.signature p{ margin: 3px 0; }

/* hide toolbar when printing */
@media print{
  body{ background:#fff; }
  .toolbar{ display:none !important; }
  .page{ margin:0; box-shadow:none; }

  /* ✅ PRINT-এ padding একবারই হবে: @page margin */
  .content{ padding: 0 !important; }
}

  </style>
</head>

<body>
  <div class="toolbar">
    <div class="left">Withdraw Request #${safe(row.id)} • A4 Print View</div>
    <div class="btns">
      <button class="btn" onclick="window.print()">🖨️ Print</button>
      <button class="btn" onclick="window.print()">⬇️ Save as PDF</button>
      <button class="btn" onclick="window.close()">✖ Close</button>
    </div>
  </div>

  <div class="page">
    <div class="content">

      <div class="header">
        <div class="company-name">সাপ্লাইলিংক বাংলাদেশ লিমিটেড</div>
        <div class="company-address">রফিক মঞ্জিল, মঙ্গলকাটা, সুনামগঞ্জ সদর</div>
      </div>

      <div class="divider"></div>

      <div class="title">
  ${
    isMaturityWithdraw
      ? "বিনিয়োগের মূলধন ও লভ্যাংশ উত্তোলনের আবেদনপত্র"
      : "বিনিয়োগের আগাম সমাপ্তির আবেদনপত্র"
  }
</div>

      <div class="meta">
        <div></div>
        <div>তারিখ: ${safe(bnDate(row?.requested_at || row?.created_at || ""))}</div>
      </div>

      <div class="to">
        বরাবর,<br/>
        ব্যবস্থাপনা পরিচালক<br/>
        সাপ্লাইলিংক বাংলাদেশ লিমিটেড<br/>
        রফিক মঞ্জিল, মঙ্গলকাটা, সুনামগঞ্জ সদর
      </div>

     <div class="subject">
  ${
    isMaturityWithdraw
      ? "বিষয়: বিনিয়োগের মেয়াদ পূর্ণ হওয়ায় জমাকৃত মূলধন ও অর্জিত লভ্যাংশ উত্তোলনের জন্য আবেদন।"
      : "বিষয়: বিনিয়োগের আগাম সমাপ্তি (Early Exit) এবং পাওনা বুঝিয়ে পাওয়ার আবেদন।"
  }
</div>

      <p>জনাব,</p>


           <p class="info-block">
  বিনীত নিবেদন এই যে, আমি
  <b>${safe(row?.investor_name || "________________")}</b>,
  আপনার প্রতিষ্ঠানের একজন তালিকাভুক্ত বিনিয়োগকারী।
  আমার বিনিয়োগকারী আইডি নম্বর:
  <b>${safe(bnDigits(row?.investor_id || ""))}</b>। 

 আমার কার্ড নম্বর:
  <b>${safe(bnDigits(row?.card_id || ""))} </b>|
  ${
    isMaturityWithdraw
      ? `
        <br/>
        আমার জমাকৃত মূলধনের পরিমাণ:
        <b>৳${safe(
          bnDigits(mainAmount.toFixed(2)),
        )}</b>।
        <br/>

        অর্জিত লভ্যাংশের পরিমাণ:
        <b>৳${safe(
          bnDigits(profitAmount.toFixed(2)),
        )}</b>। <br/>

        সর্বমোট প্রাপ্য টাকার পরিমাণ: 
        <b>৳${safe(
          bnDigits(totalAmount.toFixed(2)),
        )}</b>।
      `
      : `
        <br/>
        আমার মোট বিনিয়োগের পরিমাণ:
        <b>৳${safe(
          bnDigits(mainAmount.toFixed(2)),
        )}</b>।
      `
  }
</p>
${
  isMaturityWithdraw
    ? `
<p>
  আমার বিনিয়োগের নির্ধারিত মেয়াদ সম্পূর্ণরূপে শেষ হয়েছে।
  তাই প্রতিষ্ঠানের প্রচলিত নীতিমালা অনুযায়ী আমার জমাকৃত মূলধনসহ
  অর্জিত লভ্যাংশ উত্তোলনের জন্য বিনীতভাবে আবেদন জানাচ্ছি।
</p>
`
    : `
<p>
  বর্তমানে আমার ব্যক্তিগত ও জরুরি আর্থিক প্রয়োজনের কারণে নির্ধারিত মেয়াদ শেষ হওয়ার পূর্বেই
  আমার বিনিয়োগটি সম্পূর্ণরূপে সমাপ্ত (Early Exit) করতে ইচ্ছুক।
  আমি অবগত আছি যে, প্রতিষ্ঠানের প্রচলিত নীতিমালা অনুযায়ী মেয়াদের পূর্বে বিনিয়োগ প্রত্যাহারের ক্ষেত্রে
  লভ্যাংশ সমন্বয় অথবা প্রযোজ্য প্রসেসিং ফি কর্তন করা হতে পারে, যা আমি মেনে নিতে সম্মত।
</p>
`
}

<p>
  ${
    isMaturityWithdraw
      ? "  অতএব, আমার বিনিয়োগের বিপরীতে প্রাপ্য মূলধন ও অর্জিত লভ্যাংশ দ্রুত পরিশোধের প্রয়োজনীয় ব্যবস্থা গ্রহণ করার জন্য বিনীত অনুরোধ জানাচ্ছি।"
      : "অতএব, বিনীত প্রার্থনা এই যে, আমার বিনিয়োগের সময়কাল ও Weighted Value বিবেচনা করে আমার মূলধন এবং অর্জিত লভ্যাংশ (প্রযোজ্য ক্ষেত্রে) দ্রুত বুঝিয়ে দেওয়ার জন্য প্রয়োজনীয় ব্যবস্থা গ্রহণ করলে আমি কৃতজ্ঞ থাকব।"
  }
</p>
      <p>ধন্যবাদান্তে,</p>

      <div class="signature">
        <p>আবেদনকারীর স্বাক্ষর: ______________________</p>
        <p>নাম: ${safe(row?.investor_name || "________________")}</p>
        <p>মোবাইল নম্বর: ${safe(bnDigits(row?.mobile || "________________"))}</p>
        <p>বিনিয়োগকারী আইডি: ${safe(bnDigits(row?.investor_id || ""))}</p>
        <p>কার্ড নং: ${safe(bnDigits(row?.card_id || ""))}</p>
      </div>

      <div style="margin-top:8px; font-size:12px; opacity:.75;">
        নোট: ইউজার নোট/কারণ: ${safe(row?.reason || "-")}
      </div>

    </div>
  </div>
</body>
</html>
`;

  w.document.open();
  w.document.write(html);
  w.document.close();
};
