import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Dashboard/Sidebar";
import TopHeader from "../components/Dashboard/TopHeader";
import { useEffect, useRef, useState } from "react";
import "./Scrollbar.css";

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const mainRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const container = mainRef.current;
    if (!container) return;

    // ব্রাউজার ডিফল্ট রিস্টোরেশন অফ করা
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const handleScroll = () => {
      // গ্লোবাল উইন্ডো অবজেক্টে পজিশন সেভ করা
      if (!window.scrollPositions) window.scrollPositions = {};
      window.scrollPositions[location.pathname] = container.scrollTop;
    };

    container.addEventListener("scroll", handleScroll);

    // পেজ যখন মাউন্ট হবে তখন চেক করা পজিশন আছে কিনা
    const savedPos = window.scrollPositions?.[location.pathname];
    if (savedPos) {
      container.scrollTo({ top: savedPos, behavior: 'instant' });
    } else {
      container.scrollTo({ top: 0, behavior: 'instant' });
    }

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [location.pathname]);
  return (
    <div className="h-screen bg-[#071025] text-white overflow-hidden flex flex-col md:flex-row">
      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-40 md:hidden ${
          sidebarOpen ? "block" : "hidden"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
        <aside className="absolute left-0 top-0 bottom-0 w-72 bg-gradient-to-b from-slate-900 to-slate-800 p-4 overflow-y-auto custom-scrollbar shadow-2xl">
          <Sidebar
            closeDrawer={() => setSidebarOpen(false)}
            onLinkClick={() => setSidebarOpen(false)}
          />
        </aside>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:block overflow-y-auto w-72 bg-gradient-to-b from-slate-900 to-slate-800 border-r border-white/5 custom-scrollbar h-screen sticky top-0">
        <Sidebar />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen relative overflow-hidden">
        {/* Header */}
        <header className="w-full z-20">
          <TopHeader onMenuClick={() => setSidebarOpen(true)} />
        </header>

        {/* Scrollable Container */}
        <main
          id="app-scroll-container"
          ref={mainRef}
          className="flex-1 overflow-y-auto px-4 py-5 md:p-6 custom-scrollbar relative"
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;