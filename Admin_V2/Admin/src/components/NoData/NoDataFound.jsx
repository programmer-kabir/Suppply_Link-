const NoDataFound = ({
  message = "কোনো ডাটা পাওয়া যায়নি",
  subMessage = "অনুগ্রহ করে ফিল্টার পরিবর্তন করে আবার চেষ্টা করুন",
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center text-slate-400">
      <svg
        className="w-12 h-12 mb-4 text-slate-500"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.172 16.172a4 4 0 015.656 0M15 10h.01M9 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>

      <p className="text-lg font-medium">{message}</p>

      {subMessage && (
        <p className="text-sm mt-1 text-slate-500">
          {subMessage}
        </p>
      )}
    </div>
  );
};

export default NoDataFound;
