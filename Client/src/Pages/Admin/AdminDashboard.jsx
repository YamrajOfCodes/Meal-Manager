import { useState } from "react";
import OverviewPage from "./SubPages/Overview/OverviewPage";
import OrdersPage from "./SubPages/Order/OrdersPage";
import PaymentsPage from "./SubPages/Payments/PaymenntsPage";
import NoticesPage from "./SubPages/Notice/NoticePage";
import MenuPage from "./SubPages/Menu/MenuPage";
import CustomersPage from "./SubPages/Customers/CustomersPage";
import { useGetOrders } from "../../hooks/Admin/adminHooks";
import { jwtDecode } from "jwt-decode";
import { useGetComplaints } from "../../hooks/User/userHooks";

const TODAY_STR = new Date().toLocaleDateString("en-IN", {
  weekday: "long", day: "numeric", month: "long",
});


const NAV = [
  { key:"overview",  label:"Home",     icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg> },
  { key:"orders",    label:"Orders",   icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg> },
  { key:"payments",  label:"Payments", dot:true, icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg> },
  { key:"notices",   label:"Notice",   icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></svg> },
  { key:"menu",      label:"Menu",     icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg> },
];

const ACCOUNT_NAV = [
  { key:"customers", label:"Customers", icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M12 7a4 4 0 100 8 4 4 0 000-8z"/></svg> },
  { key:"reports",   label:"Reports",   icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V10M12 20V4M6 20v-6"/></svg> },
  { key:"settings",  label:"Settings",  icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M12 15a3 3 0 100-6 3 3 0 000 6z"/></svg> },
];

export default function MessDashboard() {
  const [page, setPage] = useState("overview");
  const login = localStorage.getItem("login");
  const decoded = jwtDecode(login);
  // console.log("Login token:", decoded);
  const messCode = decoded.messCode;
  // console.log(messCode)
  const {data:getAllOrders} = useGetOrders(messCode)
  const {data:complaints} = useGetComplaints(messCode);

  // console.log("getAllOrders:", getAllOrders);

  const pageTitle =
    page === "overview"  ? "Overview"
    : page === "orders"  ? "Orders"
    : page === "payments"? "Payments"
    : page === "notices" ? "Notice Board"
    : page === "menu"    ? "Today's Menu"
    : page.charAt(0).toUpperCase() + page.slice(1);

  return (
    <div className="flex min-h-screen bg-[#f5f2ee] font-sans">
      {/* ── Sidebar (desktop) ── */}
      <aside className="w-[232px] flex-shrink-0 bg-white border-r border-[#e8e2d9] flex flex-col sticky top-0 h-screen overflow-y-auto hidden md:flex">
        {/* Brand */}
        <div className="px-5 py-5 border-b border-[#e8e2d9]">
          <div className="flex items-center gap-2.5">
            <div className="w-[34px] h-[34px] rounded-[9px] bg-[#c2620a] flex items-center justify-center flex-shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.4" strokeLinecap="round">
                <path d="M3 11h18M3 7h18M7 3h10M5 11v8a2 2 0 002 2h10a2 2 0 002-2v-8"/>
              </svg>
            </div>
            <div>
              <div className="text-[15px] font-bold text-[#1a1510] tracking-tight">TiffinTrack</div>
              <div className="text-[10px] text-[#9a8f82] mt-0.5">Mess Portal</div>
            </div>
          </div>
        </div>

        {/* Mess selector */}
        <div className="mx-3.5 my-3 bg-[#faf8f5] border border-[#e8e2d9] rounded-[9px] px-3 py-2.5 cursor-pointer flex items-center justify-between hover:border-[#d4ccc0] transition-colors">
          <div>
            <div className="text-xs font-semibold text-[#1a1510]">Patil Mess</div>
            <div className="text-[10px] text-[#9a8f82] mt-0.5">Pune · 24 customers</div>
          </div>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9a8f82" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
        </div>

        {/* Main nav */}
        <div className="text-[9px] font-bold uppercase tracking-widest text-[#9a8f82] px-5 pt-3 pb-1">Menu</div>
        <nav className="flex flex-col gap-0.5 px-2.5">
          {NAV.map(n => (
            <SbItem key={n.key} n={n} active={page === n.key} onClick={() => setPage(n.key)} />
          ))}
        </nav>

        {/* Account nav */}
        <div className="text-[9px] font-bold uppercase tracking-widest text-[#9a8f82] px-5 pt-4 pb-1">Account</div>
        <nav className="flex flex-col gap-0.5 px-2.5">
          {ACCOUNT_NAV.map(n => (
            <SbItem key={n.key} n={n} active={page === n.key} onClick={() => setPage(n.key)} />
          ))}
        </nav>

        {/* Footer */}
        <div className="mt-auto px-4 py-3.5 border-t border-[#e8e2d9] flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#fde8cc] flex items-center justify-center text-[11px] font-bold text-[#c2620a] flex-shrink-0">RP</div>
          <div>
            <div className="text-xs font-semibold text-[#1a1510]">Ramesh Patil</div>
            <div className="text-[10px] text-[#9a8f82]">Owner</div>
          </div>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <div className="bg-white border-b border-[#e8e2d9] px-7 py-3.5 flex items-center justify-between sticky top-0 z-20 md:px-7 px-4">
          <div>
            <div className="text-xl text-[#1a1510]" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>{pageTitle}</div>
            <div className="text-xs text-[#9a8f82] mt-0.5">{TODAY_STR}</div>
          </div>
          <div className="flex items-center gap-2">
            {page === "orders" && (
              <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[9px] bg-[#c2620a] text-white text-xs font-semibold border-none cursor-pointer hover:bg-[#a8520a] transition-colors" style={{ boxShadow: "0 2px 8px rgba(194,98,10,.25)" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                Add Customer
              </button>
            )}
            {page === "overview" && (
              <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[9px] border border-[#e8e2d9] bg-transparent text-[#5a5048] text-xs font-semibold cursor-pointer hover:bg-[#faf8f5] transition-colors">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M16 8l-4-4-4 4M12 4v12"/></svg>
                Export
              </button>
            )}
          </div>
        </div>

        {/* Page content */}
        <div className="p-7 pb-24 md:pb-24 pb-24 flex flex-col gap-5 overflow-y-auto md:px-7 px-4">
          {page === "overview"  && <OverviewPage setPage={setPage} />}
          {page === "orders"    && <OrdersPage orders={getAllOrders}/>}
          {page === "payments"  && <PaymentsPage />}
          {page === "notices"   && <NoticesPage />}
          {page === "menu"      && <MenuPage />}
          {(page === "customers" || page === "reports" || page === "settings") && (
            <div className="flex items-center justify-center h-64 text-[#9a8f82] text-sm">
              <CustomersPage/>
            </div>
          )}
        </div>
      </div>

      {/* ── Mobile bottom nav ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#e8e2d9] z-50">
        <div className="flex">
          {NAV.map(n => (
            <button
              key={n.key}
              onClick={() => setPage(n.key)}
              className={`flex-1 flex flex-col items-center py-2.5 pb-3 gap-1 text-[9px] font-semibold uppercase tracking-wider border-none bg-transparent cursor-pointer relative transition-colors ${
                page === n.key ? "text-[#c2620a]" : "text-[#9a8f82]"
              }`}
            >
              <span style={{ color: page === n.key ? "#c2620a" : "#9a8f82" }}>{n.icon}</span>
              {n.dot && page !== n.key && (
                <span className="absolute top-2 right-[calc(50%-14px)] w-1.5 h-1.5 rounded-full bg-red-500" />
              )}
              {n.label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

function SbItem({ n, active, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-2.5 px-3 py-2 rounded-[9px] text-[13px] font-medium cursor-pointer transition-all relative ${
        active
          ? "bg-[#fff4e8] text-[#c2620a] font-semibold"
          : "text-[#5a5048] hover:bg-[#faf8f5] hover:text-[#1a1510]"
      }`}
    >
      <span style={{ color: active ? "#c2620a" : "#9a8f82" }}>{n.icon}</span>
      {n.label}
      {n.dot && !active && (
        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-red-500" />
      )}
    </div>
  );
}