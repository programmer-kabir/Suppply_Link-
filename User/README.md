# 🚀 SupplyLink (Bangladesh Ltd.) - Full Technical Documentation

এই ডকুমেন্টটি ডেভেলপারদের জন্য একটি কম্প্লিট গাইডলাইন হিসেবে তৈরি করা হয়েছে যাতে সিস্টেমের লজিক এবং আর্কিটেকচার সহজে বোঝা যায়।

---

## 🏛 ১. সিস্টেম আর্কিটেকচার (System Architecture)

সিস্টেমটি মূলত তিনটি স্তরে কাজ করে:

1.  **Frontend:** React.js/Next.js (UI & State Management).
2.  **Backend:** Admin Control (For all Approvals & Global Calculations).
3.  **Database Logic:** Role-Based Access Control (RBAC) - যেখানে ইউজাররা শুধুমাত্র তাদের নিজস্ব ডাটা দেখতে পাবে।

---

## 📊 ২. মডিউল ভিত্তিক বিস্তারিত ফাংশনালিটি (Detailed Functionality)

### A. হোম / ড্যাশবোর্ড (Home/Dashboard Section)

- **Top 10 Investors Widget:** \* **Logic:** `SELECT name, card_number, total_investment FROM users WHERE role='investor' ORDER BY total_investment DESC LIMIT 10`.
  - **Goal:** টপ ইনভেস্টরদের মধ্যে একটি সুস্থ প্রতিযোগিতা বজায় রাখা।
- **User Ranking System:** যদি লগইন করা ইউজার টপ ১০-এ না থাকে, তবে তার পজিশন আলাদাভাবে ক্যালকুলেট করে দেখাতে হবে।


### B. প্রোফাইল ও সিকিউরিটি (Profile & KYC Section)

- **Profile Update:** নাম, ফোন এবং ঠিকানা এডিট করার অপশন।
- **KYC Verification (The Core):**
  - ইউজারকে তার **Bank Statement (PDF/PNG)** এবং **Bank Account Info** সেভ করতে হবে।
  - **Workflow:** ডাটা সেভ করার পর `is_verified` স্ট্যাটাস `false` থাকবে। অ্যাডমিন প্যানেলে নোটিফিকেশন যাবে। অ্যাডমিন ফাইল চেক করে `Approve` বাটনে ক্লিক করলে এটি `true` হবে এবং ইউজার উইথড্র করার সুযোগ পাবে।

### C. বিনিয়োগ মডিউল (Investment Module - "Binoyog")

- **Investment Card Logic:** প্রত্যেক ইনভেস্টমেন্টের জন্য একটি ইউনিক `Investor ID` বা `Card ID` জেনারেট হবে।
- **Date Management:** প্রতিটি কার্ডের সাথে একটি `maturity_date` (বিনিয়োগের ১ বছর পর) যুক্ত থাকবে।
- **History:** ইউজার তার সব পুরাতন বিনিয়োগের রেকর্ড টেবিল ফরম্যাটে দেখতে পারবে।

## **D. লাভ ও রি-ইনভেস্টমেন্ট লজিক (Profit & Re-investment)**

1. **Company Profit Split:**  
   - অ্যাডমিন প্রতি মাসে "Company Total Profit" ইনপুট দেবে। সিস্টেম স্বয়ংক্রিয়ভাবে তার ৫০% (`Company_Share`) এবং বাকি ৫০% (`Investors_Pool`) আলাদা করবে।

2. **Individual Distribution:**  
   - `Investors_Pool` থেকে প্রত্যেক ইনভেস্টর তার বিনিয়োগের অনুপাত অনুযায়ী প্রফিট পাবে।  
     - **সূত্র:**  
       $$Individual\ Profit = \frac{User\ Investment}{Total\ Global\ Investment} \times Investors\_Pool$$

3. **Auto Re-invest:**  
   - মাসের শেষে এই `Individual Profit` সরাসরি ইউজারের `Current Investment`-এ যোগ হয়ে যাবে। এর ফলে পরের মাসে ইউজারের প্রফিট আরও বাড়বে (Compound Interest)।
   
4. **Profit Filter and View Options:**  
   - **Profit Filters:** ইউজার তার লাভের রেকর্ডকে মাস, বছর অথবা অন্যান্য কাস্টম ডেটা ফিল্টার ব্যবহার করে দেখতে পারবে।
   - **Chart Representation:** ইউজার চাইলে গ্রাফ বা চার্ট আকারে প্রফিটের পরিবর্তন দেখতে পারবে, যা মাসে মাসে প্রফিটের অগ্রগতি বোঝাতে সাহায্য করবে।
     - **Example:**  
       - বার চার্টের মাধ্যমে দেখানো হবে, "কোন মাসে কতো প্রফিট হয়েছিল?"
    - **লাভের ইতিহাস:** ইউজার চাইলে সব profit এর ইতিহাস দেখতে পারবে ।


## **E. Summary Dashboard ("সারসংক্ষেপ"):**  
   - **Company Overview:** সিস্টেমের মাধ্যমে কোম্পানির সামগ্রিক অবস্থা দেখা যাবে।  
     - **Profit:** প্রতিটি মাসে কোম্পানির মোট প্রফিট কত ছিল।  
     - **Installments (কিস্তি):** কতটি কিস্তি আদায় করা হয়েছে, এবং কোন মাসে কতো কিস্তি এসেছে।  
     - **Profit Withdrawals:** কতো জন ইনভেস্টর প্রফিট উইথড্র করেছে এবং কত টাকা উইথড্র করা হয়েছে।  
     - **Cash Balance:** এখন পর্যন্ত সিস্টেমে কত টাকা ক্যাশে রয়েছে এবং কতটা আছে আরও মালামাল হিসেবে (Investments, Assets).  
     - **Withdrawals (Last Payment):** পরবর্তীতে কবে এবং কোন দিন টাকা মূলত (Principal) উইথড্র করা হয়েছে।

   - **Specific Data Points:**  
     - **Total Profit by Month**  
     - **Total Withdrawals by Month**  
     - **Remaining Investment Pool**  
     - **Number of Investors Who Have Withdrawn**  
     - **Total Cash in Hand** vs **Total Amount Invested**  
     - **All Time Withdrawals** (How much has been withdrawn until now)

   - **Charting/Graphs:**  
     - Data will be presented in an interactive format, with multiple chart options available:
       - **Pie chart** showing the profit distribution between the company and investors.
       - **Line chart** or **Bar chart** depicting the total company profits and withdrawals across various months.


## 🛍 ৩. কাস্টমার ও কিস্তি মডিউল (Customer & Installment)

### A. পণ্য ক্রয় লজিক (Purchase Logic)

- **Down Payment:** `product_price * 0.30` (অবশ্যই নগদ বা তৎক্ষণাৎ পরিশোধ করতে হবে)।
- **Total Amount Calculation:**
  - ৬ মাস মেয়াদী কিস্তি: `(Remaining_Price * 1.10)`
  - ১২ মাস মেয়াদী কিস্তি: `(Remaining_Price * 1.15)`
- **Installment Table:** লজিক অনুযায়ী সিস্টেম অটোমেটিক ৬টি বা ১২টি কিস্তির তারিখ এবং অ্যামাউন্ট সহ একটি টেবিল জেনারেট করবে।

### B. রিকভারি ও লিগ্যাল লজিক (Security & Recovery)

- **Guarantor System:** কিস্তি শুরু করার আগে গ্যারান্টরের নাম, ফোন এবং NID সিস্টেমে এন্ট্রি থাকতে হবে।
- **Legal Action Trigger:** \* যদি কোনো কাস্টমার টানা ৫ মাস কিস্তি না দেয় বা রেসপন্স না করে, অ্যাডমিন প্যানেলে তাকে "Defaulter" হিসেবে লাল রঙে মার্ক করা হবে।
  - ১ লক্ষ টাকার ওপর লেনদেন হলে **Physical Bank Check** এবং **Statement** হার্ড কপি হিসেবে অফিসে জমা থাকতে হবে, যা আইনি ব্যবস্থার জন্য ব্যবহৃত হবে।

---

## 💸 ৪. উত্তোলন পদ্ধতি (Withdrawal System)

- **Principal vs Profit:** \* মেয়াদ ১ বছরের কম হলে: `Withdraw_Button` দেখাবে না ।
  - মেয়াদ ১ বছর বা বেশি হলে: `Withdraw_Button` ক্লিক করলে `Principal + Accrued Profit` একসাথে উঠবে।
- **Payment Channels:** ক্যাশ, ব্যাংক বা মোবাইল ওয়ালেট (Bkash/Nagad)।
- **Verification:** উইথড্র রিকোয়েস্ট দেওয়ার সময় সিস্টেম চেক করবে ইউজারের ব্যাংক স্টেটমেন্ট অ্যাডমিন কর্তৃক `Verified` কি না।

---

## 🛠 টেকনিক্যাল নোট (Developer Summary)

1.  **Charts:** ইউজারের ড্যাশবোর্ডে `Profit vs Month` দেখাতে `ApexCharts` বা `Chart.js` ব্যবহার করুন।
2.  **Security:** সকল API এন্ডপয়েন্টে `JWT` বা `Session` ভেরিফিকেশন থাকতে হবে যাতে এক ইনভেস্টর অন্য ইনভেস্টরের ডাটা দেখতে না পারে।
3.  **Notifications:** কিস্তি মিস হলে বা প্রফিট ডিস্ট্রিবিউশন হলে ইউজারকে নোটিফিকেশন পাঠানোর মেকানিজম রাখতে হবে।
