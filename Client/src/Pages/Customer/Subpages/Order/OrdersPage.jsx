import React, { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Loader from "../../../../components/AdminComponents/Shared/Loader";

/* ─── TOKENS ─────────────────────────────────── */
const T = {
  bg: "#f6f3ef",
  surface: "#ffffff",
  surface2: "#faf8f5",
  border: "#ebe6de",
  border2: "#ddd6cb",
  brand: "#c2620a",
  brandLt: "#fff4e8",
  brandMid: "#fde0bc",
  green: "#1a7f5a",
  greenLt: "#eaf5ef",
  red: "#c0392b",
  redLt: "#fdecea",
  blue: "#1d5fa6",
  blueLt: "#e8f0fb",
  purple: "#6d28d9",
  purpleLt: "#f3f0fb",
  t1: "#1c1812",
  t2: "#5a5048",
  t3: "#9a8f82",
  t4: "#c4b9ad",
};

/* ─── MEAL CONFIG ────────────────────────────── */
const MEAL = {
  Breakfast: {
    label: "Breakfast", bg: "#fff4e8", color: "#c2620a",
    icon: (c, s = 18) => (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="4" fill={c} fillOpacity=".18" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
    ),
  },
  Lunch: {
    label: "Lunch", bg: "#e8f0fb", color: "#1d5fa6",
    icon: (c, s = 18) => (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="13" r="7" fill={c} fillOpacity=".12" />
        <path d="M8 8v3a2 2 0 004 0V8M10 11v7M14 8v11" />
      </svg>
    ),
  },
  Snacks: {
    label: "Snacks", bg: "#eaf5ef", color: "#1a7f5a",
    icon: (c, s = 18) => (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 11h14v5a4 4 0 01-4 4H8a4 4 0 01-4-4v-5z" fill={c} fillOpacity=".14" />
        <path d="M18 13h1a2 2 0 100-4h-1M7 7c0-1.5 2-1.5 2-3M11 7c0-1.5 2-1.5 2-3" />
      </svg>
    ),
  },
  Dinner: {
    label: "Dinner", bg: "#f3f0fb", color: "#6d28d9",
    icon: (c, s = 18) => (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" fill={c} fillOpacity=".15" />
        <path d="M18.5 4l.5 1.5 1.5.5-1.5.5-.5 1.5-.5-1.5L17 6l1.5-.5z" fill={c} stroke="none" />
      </svg>
    ),
  },
};
const getMeal = k => MEAL[k] || {
  label: k, bg: T.surface2, color: T.t2, icon: (c, s = 18) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.9" strokeLinecap="round">
      <circle cx="12" cy="12" r="9" fill={c} fillOpacity=".1" /><path d="M12 8v4l3 3" />
    </svg>
  )
};

/* ─── MOCK DATA ──────────────────────────────── */
const MOCK = [
  { _id: "a01", createdAt: "2026-04-22T08:10:00Z", mealTime: "Breakfast", messCode: "KK01", name: "Chai", price: 15, userId: { email: "kc@gmail.com", name: "Kc", payment: 350, _id: "69e70ae2" } },
  { _id: "a02", createdAt: "2026-04-22T13:05:00Z", mealTime: "Lunch", messCode: "KK01", name: "Dal Tadka", price: 60, userId: { email: "kc@gmail.com", name: "Kc", payment: 350, _id: "69e70ae2" } },
  { _id: "a03", createdAt: "2026-04-21T07:58:00Z", mealTime: "Breakfast", messCode: "KK01", name: "Chai", price: 15, userId: { email: "kc@gmail.com", name: "Kc", payment: 350, _id: "69e70ae2" } },
  { _id: "a04", createdAt: "2026-04-21T08:30:00Z", mealTime: "Lunch", messCode: "KK01", name: "Jeera Rice", price: 50, userId: { email: "kc@gmail.com", name: "Kc", payment: 350, _id: "69e70ae2" } },
  { _id: "a05", createdAt: "2026-04-21T14:10:00Z", mealTime: "Snacks", messCode: "KK01", name: "Samosa (x2)", price: 20, userId: { email: "kc@gmail.com", name: "Kc", payment: 350, _id: "69e70ae2" } },
  { _id: "a06", createdAt: "2026-04-21T20:00:00Z", mealTime: "Dinner", messCode: "KK01", name: "Paneer Masala", price: 90, userId: { email: "kc@gmail.com", name: "Kc", payment: 350, _id: "69e70ae2" } },
  { _id: "a07", createdAt: "2026-04-20T07:45:00Z", mealTime: "Breakfast", messCode: "KK01", name: "Poha", price: 40, userId: { email: "kc@gmail.com", name: "Kc", payment: 350, _id: "69e70ae2" } },
  { _id: "a08", createdAt: "2026-04-20T13:00:00Z", mealTime: "Lunch", messCode: "KK01", name: "Roti (x3)", price: 30, userId: { email: "kc@gmail.com", name: "Kc", payment: 350, _id: "69e70ae2" } },
  { _id: "a09", createdAt: "2026-04-20T20:30:00Z", mealTime: "Dinner", messCode: "KK01", name: "Rajma Rice", price: 70, userId: { email: "kc@gmail.com", name: "Kc", payment: 350, _id: "69e70ae2" } },
  { _id: "a10", createdAt: "2026-04-19T08:00:00Z", mealTime: "Breakfast", messCode: "KK01", name: "Bread Butter", price: 30, userId: { email: "kc@gmail.com", name: "Kc", payment: 350, _id: "69e70ae2" } },
  { _id: "a11", createdAt: "2026-04-19T14:30:00Z", mealTime: "Snacks", messCode: "KK01", name: "Cold Coffee", price: 45, userId: { email: "kc@gmail.com", name: "Kc", payment: 350, _id: "69e70ae2" } },
  { _id: "a12", createdAt: "2026-04-19T20:00:00Z", mealTime: "Dinner", messCode: "KK01", name: "Egg Bhurji", price: 55, userId: { email: "kc@gmail.com", name: "Kc", payment: 350, _id: "69e70ae2" } },
];

/* ─── UTILS ──────────────────────────────────── */
const fmtDate = iso => new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
const fmtTime = iso => new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
const fmtDay = iso => {
  const d = Math.floor((Date.now() - new Date(iso)) / 86400000);
  if (d === 0) return "Today"; if (d === 1) return "Yesterday";
  return new Date(iso).toLocaleDateString("en-IN", { weekday: "long" });
};
const groupByDate = arr => arr.reduce((a, o) => {
  const k = new Date(o.createdAt).toDateString(); (a[k] = a[k] || []).push(o); return a;
}, {});

/* ─── HELPERS ────────────────────────────────── */
function Ic({ d, s = 16, c = T.t3, sw = 1.9, fill = "none" }) {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill={fill} stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", flexShrink: 0 }}>
      {[].concat(d).map((p, i) => <path key={i} d={p} />)}
    </svg>
  );
}

function CountUp({ value, prefix = "₹" }) {
  const [d, setD] = React.useState(value);
  const p = React.useRef(value);
  React.useEffect(() => {
    if (p.current === value) return;
    const from = p.current, t0 = performance.now();
    const r = now => {
      const pct = Math.min((now - t0) / 700, 1);
      setD(Math.round(from + (value - from) * (1 - Math.pow(1 - pct, 3))));
      if (pct < 1) requestAnimationFrame(r);
    };
    requestAnimationFrame(r);
    p.current = value;
  }, [value]);
  return <>{prefix}{d?.toLocaleString("en-IN")}</>;
}

function StatCard({ label, value, iconD, iconColor, iconBg }) {
  return (
    <div style={{ flex: 1, minWidth: 0, background: "#fff", border: `1px solid ${T.border}`, borderRadius: 14, padding: "14px 18px", display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: T.t3, textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</span>
        <div style={{ width: 30, height: 30, borderRadius: 9, background: iconBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Ic d={iconD} s={14} c={iconColor} sw={2} />
        </div>
      </div>
      <p style={{ fontSize: 22, fontWeight: 700, color: T.t1, lineHeight: 1, letterSpacing: "-0.025em" }}>{value}</p>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   MAIN
═══════════════════════════════════════════════ */
export default function OrdersPage({ orders = MOCK, balance: balProp }) {
  const [filter, setFilter] = useState("All");
  const [sortCol, setSortCol] = useState("date");
  const [sortDir, setSortDir] = useState("desc");
  const [expanded, setExpanded] = useState(null);
  const [loader,setLoader] = useState(false);

  const [page, setPage] = useState(1);
  const PER_PAGE = 8;

  const user = orders[0]?.userId ?? {};

  const balance = user?.payment;
  console.log(balance)
  const totalSpent = orders?.reduce((s, o) => s + o.price, 0);
  const thisWeek = orders?.filter(o => (Date.now() - new Date(o.createdAt)) < 7 * 86400000).length;
  const avgOrder = orders?.length ? Math.round(totalSpent / orders.length) : 0;

  const mealTypes = ["All", ...new Set(orders.map(o => o.mealTime))];

  const downloadStatement = (orders, user) => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text("Mess Statement", 14, 20);

    // User Info
    doc.setFontSize(11);
    doc.text(`Name: ${user?.name}`, 14, 30);
    doc.text(`Email: ${user?.email}`, 14, 36);

    // Table Data
    const tableData = orders.map(o => ([
      o.name,
      o.mealTime,
      new Date(o.createdAt).toLocaleDateString("en-IN"),
      `₹${o.price}`
    ]));

    autoTable(doc, {
      startY: 45,
      head: [["Item", "Meal", "Date", "Amount"]],
      body: tableData,
    });

    // Total
    const total = orders.reduce((sum, o) => sum + o.price, 0);
    doc.text(`Total: ₹${total}`, 14, doc.lastAutoTable.finalY + 10);

    // Download
    doc.save("statement.pdf");
  };

  /* sort + filter */
  const sorted = [...orders]
    .filter(o => filter === "All" || o.mealTime === filter)
    .sort((a, b) => {
      if (sortCol === "date") return sortDir === "asc" ? new Date(a.createdAt) - new Date(b.createdAt) : new Date(b.createdAt) - new Date(a.createdAt);
      if (sortCol === "price") return sortDir === "asc" ? a.price - b.price : b.price - a.price;
      if (sortCol === "name") return sortDir === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      return 0;
    });

  const totalPages = Math.ceil(sorted.length / PER_PAGE);
  const paged = sorted.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  /* mobile grouping */
  const mobileGrouped = groupByDate(sorted);
  const mobileDateKeys = Object.keys(mobileGrouped).sort((a, b) => new Date(b) - new Date(a));

  const toggleSort = col => {
    if (sortCol === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortCol(col); setSortDir("asc"); }
    setPage(1);
  };

  const SortIcon = ({ col }) => (
    <span style={{ marginLeft: 4, opacity: sortCol === col ? 1 : 0.3, fontSize: 10 }}>
      {sortCol === col ? (sortDir === "asc" ? "↑" : "↓") : "↕"}
    </span>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:wght@600&family=Outfit:wght@400;500;600;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        body{font-family:'Outfit',sans-serif;background:${T.bg};-webkit-font-smoothing:antialiased;}
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-thumb{background:${T.border2};border-radius:4px}
        @keyframes slideUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
        @keyframes dropIn{from{opacity:0;transform:translateY(-5px)}to{opacity:1;transform:none}}
        .slide{animation:slideUp .3s cubic-bezier(.22,1,.36,1) both}
        .dropin{animation:dropIn .18s ease both}

        /* filter chip */
        .fc{display:inline-flex;align-items:center;gap:6px;padding:7px 15px;border-radius:100px;
            font-size:12px;font-weight:600;cursor:pointer;border:1px solid ${T.border};
            background:#fff;color:${T.t3};font-family:'Outfit',sans-serif;transition:all .12s;}
        .fc:hover{border-color:${T.border2};color:${T.t2};background:${T.surface2};}
        .fc.on{background:${T.brandLt};color:${T.brand};border-color:${T.brandMid};}

        /* table */
        .rec-table{width:100%;border-collapse:separate;border-spacing:0;}
        .rec-table thead th{
          padding:11px 16px;font-size:11px;font-weight:700;color:${T.t3};
          text-transform:uppercase;letter-spacing:0.07em;text-align:left;
          background:${T.surface2};border-bottom:2px solid ${T.border};
          cursor:pointer;user-select:none;white-space:nowrap;
          transition:color .12s;
        }
        .rec-table thead th:first-child{border-radius:10px 0 0 0;}
        .rec-table thead th:last-child {border-radius:0 10px 0 0;}
        .rec-table thead th:hover{color:${T.t1};}
        .rec-table tbody tr{transition:background .1s;}
        .rec-table tbody tr:hover td{background:${T.surface2};}
        .rec-table tbody td{
          padding:13px 16px;font-size:13px;color:${T.t2};
          border-bottom:1px solid ${T.border};vertical-align:middle;
        }
        .rec-table tbody tr:last-child td{border-bottom:none;}
        .rec-table tbody tr:last-child td:first-child{border-radius:0 0 0 10px;}
        .rec-table tbody tr:last-child td:last-child {border-radius:0 0 10px 0;}

        /* row expand */
        .expand-tr td{background:${T.surface2}!important;border-bottom:2px solid ${T.brandMid}!important;}
        .expand-detail{animation:dropIn .18s ease both;}

        /* page btn */
        .pgbtn{width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;
               font-size:12px;font-weight:600;cursor:pointer;border:1px solid ${T.border};
               background:#fff;color:${T.t2};font-family:'Outfit',sans-serif;transition:all .12s;}
        .pgbtn:hover{border-color:${T.border2};background:${T.surface2};}
        .pgbtn.cur{background:${T.brand};color:#fff;border-color:${T.brand};}
        .pgbtn:disabled{opacity:0.35;cursor:not-allowed;}

        /* pay / stmt */
        .paybtn{display:flex;align-items:center;gap:8px;background:${T.brand};color:#fff;
                font-size:13px;font-weight:700;padding:11px 22px;border-radius:12px;border:none;
                cursor:pointer;font-family:'Outfit',sans-serif;
                box-shadow:0 4px 14px rgba(194,98,10,.3);transition:background .12s,transform .1s;}
        .paybtn:hover{background:#a8520a;}
        .paybtn:active{transform:scale(.97);}
        .stmtbtn{display:flex;align-items:center;gap:7px;background:#fff;color:${T.t2};
                 font-size:12px;font-weight:600;padding:10px 18px;border-radius:12px;
                 border:1px solid ${T.border};cursor:pointer;font-family:'Outfit',sans-serif;
                 transition:background .12s;}
        .stmtbtn:hover{background:${T.surface2};}

        /* mobile card */
        .m-ocard{background:#fff;border:1px solid ${T.border};border-radius:14px;overflow:hidden;
                 transition:box-shadow .15s,transform .15s;}
        .m-ocard:hover{box-shadow:0 4px 16px rgba(0,0,0,.08);transform:translateY(-1px);}
        .m-orow{width:100%;display:flex;align-items:center;gap:12px;padding:13px 16px;
                background:transparent;border:none;cursor:pointer;font-family:'Outfit',sans-serif;
                text-align:left;transition:background .12s;}
        .m-orow:hover{background:${T.surface2};}
        .chev{transition:transform .2s ease;}
        .chev.open{transform:rotate(180deg);}

        /* desktop shows table, hides mobile cards */
        .desk-only{display:block;}
        .mob-only{display:none;}

        @media(max-width:768px){
          .desk-only{display:none!important;}
          .mob-only{display:block!important;}
          .bal-row{flex-direction:column!important;}
          .bal-acts{width:100%!important;flex-direction:row!important;}
          .paybtn,.stmtbtn{flex:1;justify-content:center;}
          .stats-row{flex-direction:column!important;}
          .user-email{display:none!important;}
          .dgrid{grid-template-columns:repeat(2,1fr)!important;}
        }
      `}</style>

      {/* ── WRAPPER: 90% desktop / 100% mobile ── */}
      <div className="slide" style={{
        width: "90%", maxWidth: 1200, margin: "0 auto",
        padding: "24px 0 48px",
        display: "flex", flexDirection: "column", gap: 20,
        fontFamily: "'Outfit',sans-serif",
      }}>
        <style>{`
          @media(max-width:768px){
            .outer-wrap{width:100%!important;padding:16px 0 80px!important;}
          }
        `}</style>

        {/* ════ USER + BALANCE CARD ════ */}
        <div style={{ background: "#fff", border: `1px solid ${T.border}`, borderRadius: 20, overflow: "hidden", boxShadow: "0 2px 4px rgba(0,0,0,.04),0 8px 28px rgba(0,0,0,.06)" }}>

          {/* banner */}
          <div style={{ background: "linear-gradient(120deg,#b85508 0%,#d96c16 50%,#eb8c2a 100%)", padding: "22px 28px 60px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", right: -30, top: -30, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,.08)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", left: "45%", bottom: -60, width: 220, height: 220, borderRadius: "50%", background: "rgba(0,0,0,.06)", pointerEvents: "none" }} />
            <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 42, height: 42, borderRadius: "50%", background: "rgba(255,255,255,.22)", border: "2px solid rgba(255,255,255,.35)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: "white", flexShrink: 0, textTransform: "uppercase" }}>
                  {user.name?.[0] ?? "U"}
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    <span style={{ color: "white", fontWeight: 700, fontSize: 16, textTransform: "capitalize" }}>{user.name || "User"}</span>
                    <span style={{ color: "rgba(255,255,255,.4)" }}>·</span>
                    <span className="user-email" style={{ color: "rgba(255,255,255,.7)", fontSize: 12 }}>{user.email}</span>
                  </div>
                  <p style={{ color: "rgba(255,255,255,.55)", fontSize: 11, marginTop: 4 }}>{orders[0]?.messCode} Mess</p>
                </div>
              </div>
              <span style={{ background: "rgba(255,255,255,.18)", border: "1px solid rgba(255,255,255,.28)", color: "white", fontSize: 10, fontWeight: 700, padding: "5px 14px", borderRadius: 100, letterSpacing: "0.05em" }}>
                MEMBER
              </span>
            </div>
          </div>

          {/* balance pill */}
          <div style={{ margin: "-38px 22px 0", position: "relative", zIndex: 10 }}>
            <div className="bal-row" style={{ display: "flex", alignItems: "center", gap: 18, background: "white", borderRadius: 16, border: `1px solid ${T.border}`, padding: "18px 22px", boxShadow: "0 6px 24px rgba(0,0,0,.10)" }}>
              <div style={{ width: 54, height: 54, borderRadius: 15, flexShrink: 0, background: T.brandLt, border: `2px solid ${T.brandMid}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: T.brand, fontWeight: 800, fontSize: 22 }}>₹</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: T.t3, textTransform: "uppercase", letterSpacing: "0.09em" }}>Amount Due</p>
                <p style={{ fontSize: 38, fontWeight: 800, color: T.brand, lineHeight: 1, marginTop: 5, letterSpacing: "-0.03em" }}>
                  <CountUp value={balance || "0"} />
                </p>
                <p style={{ fontSize: 12, color: T.t3, marginTop: 5 }}>{orders.length} order{orders.length !== 1 ? "s" : ""} placed</p>
              </div>
              <div className="bal-acts" style={{ display: "flex", flexDirection: "column", gap: 9, flexShrink: 0 }}>
                {balance > 0 && <button className="paybtn   disabled:opacity-50 
                disabled:cursor-not-allowed
              disabled:bg-orange-300" disabled><Ic d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" s={14} c="white" sw={2.2} />Pay Now</button>}
                <button className="stmtbtn" onClick={() => downloadStatement(orders, user)}><Ic d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M16 8l-4-4-4 4M12 4v12" s={13} c={T.t2} />Statement</button>
              </div>
            </div>
          </div>

          {/* stats */}
          <div className="stats-row" style={{ display: "flex", gap: 14, padding: "16px 22px 22px" }}>
            <StatCard label="Total Spent" value={`₹${totalSpent.toLocaleString("en-IN")}`} iconD="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" iconColor={T.green} iconBg={T.greenLt} />
            <StatCard label="This Week" value={`${thisWeek} orders`} iconD="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" iconColor={T.blue} iconBg={T.blueLt} />
            <StatCard label="Avg / Order" value={`₹${avgOrder}`} iconD="M18 20V10M12 20V4M6 20v-6" iconColor={T.purple} iconBg={T.purpleLt} />
          </div>
        </div>

        {/* ════ FILTER + SUMMARY ROW ════ */}
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
          {mealTypes.map(m => {
            const meta = getMeal(m);
            return (
              <button key={m} className={`fc${filter === m ? " on" : ""}`} onClick={() => { setFilter(m); setPage(1); }}>
                <span style={{ display: "flex", alignItems: "center" }}>{meta.icon(filter === m ? meta.color : T.t3, 14)}</span>
                {m}
              </button>
            );
          })}
          <span style={{ marginLeft: "auto", fontSize: 12, color: T.t3, fontWeight: 500 }}>
            {sorted.length} record{sorted.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* ════ DESKTOP: TABLE VIEW ════ */}
        <div className="desk-only">
          {sorted.length === 0 ? (
            <div style={{ background: "#fff", border: `1px solid ${T.border}`, borderRadius: 16, padding: "56px", textAlign: "center" }}>
              <p style={{ color: T.t3, fontSize: 14 }}>No records match this filter.</p>
            </div>
          ) : (
            <div style={{ background: "#fff", border: `1px solid ${T.border}`, borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,.05)" }}>
              {/* table header row with count + pagination info */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderBottom: `1px solid ${T.border}`, background: T.surface2 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 30, height: 30, borderRadius: 8, background: T.brandLt, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Ic d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" s={14} c={T.brand} />
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 700, color: T.t1 }}>Order Records</span>
                  <span style={{ fontSize: 11, color: T.t3, background: T.border, padding: "2px 8px", borderRadius: 100 }}>{sorted.length} total</span>
                </div>
                <span style={{ fontSize: 12, color: T.t3 }}>
                  Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, sorted.length)} of {sorted.length}
                </span>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table className="rec-table">
                  <thead>
                    <tr>
                      <th style={{ width: 44 }}></th>
                      <th onClick={() => toggleSort("name")} style={{ minWidth: 140 }}>
                        Item Name <SortIcon col="name" />
                      </th>
                      <th>Meal</th>
                      <th onClick={() => toggleSort("date")} style={{ minWidth: 160 }}>
                        Date &amp; Time <SortIcon col="date" />
                      </th>
                      <th>Mess</th>
                      <th onClick={() => toggleSort("price")} style={{ textAlign: "right", minWidth: 90 }}>
                        Amount <SortIcon col="price" />
                      </th>
                      <th style={{ textAlign: "center" }}>Status</th>
                      <th style={{ width: 36 }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {paged.map((o, idx) => {
                      const meta = getMeal(o.mealTime);
                      const isOpen = expanded === o._id;
                      const rowNum = (page - 1) * PER_PAGE + idx + 1;
                      return (
                        <React.Fragment key={o._id}>
                          <tr
                            style={{ cursor: "pointer" }}
                            onClick={() => setExpanded(isOpen ? null : o._id)}
                          >
                            {/* row number */}
                            <td style={{ textAlign: "center", color: T.t4, fontSize: 11, fontWeight: 600, paddingLeft: 16 }}>
                              {rowNum}
                            </td>
                            {/* item name */}
                            <td>
                              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <div style={{ width: 34, height: 34, borderRadius: 9, background: meta.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                  {meta.icon(meta.color, 16)}
                                </div>
                                <span style={{ fontWeight: 600, color: T.t1, textTransform: "capitalize" }}>{o.name}</span>
                              </div>
                            </td>
                            {/* meal pill */}
                            <td>
                              <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 100, background: meta.bg, color: meta.color, whiteSpace: "nowrap" }}>
                                {meta.label}
                              </span>
                            </td>
                            {/* date */}
                            <td>
                              <span style={{ fontSize: 13, color: T.t1, fontWeight: 500 }}>{fmtDate(o.createdAt)}</span>
                              <span style={{ fontSize: 11, color: T.t3, marginLeft: 8 }}>{fmtTime(o.createdAt)}</span>
                            </td>
                            {/* mess code */}
                            <td>
                              <span style={{ fontSize: 12, fontWeight: 600, color: T.t2, fontFamily: "monospace", background: T.surface2, padding: "3px 8px", borderRadius: 6, border: `1px solid ${T.border}` }}>
                                {o.messCode}
                              </span>
                            </td>
                            {/* amount */}
                            <td style={{ textAlign: "right", fontWeight: 700, fontSize: 14, color: T.t1 }}>
                              ₹{o.price}
                            </td>
                            {/* status */}
                            <td style={{ textAlign: "center" }}>
                              <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 100, background: T.greenLt, color: T.green }}>
                                Confirmed
                              </span>
                            </td>
                            {/* expand */}
                            <td style={{ paddingRight: 16 }}>
                              <div className={`chev${isOpen ? " open" : ""}`} style={{ width: 26, height: 26, borderRadius: 7, background: T.surface2, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }}>
                                <Ic d="M6 9l6 6 6-6" s={12} c={T.t3} sw={2.2} />
                              </div>
                            </td>
                          </tr>

                          {/* expanded detail row */}
                          {isOpen && (
                            <tr className="expand-tr">
                              <td colSpan={8} style={{ padding: 0 }}>
                                <div className="dropin" style={{ padding: "18px 24px" }}>
                                  <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 16 }}>
                                    {[
                                      { label: "Full Order ID", val: o._id, mono: true },
                                      { label: "Customer", val: o.userId?.name, cap: true },
                                      { label: "Email", val: o.userId?.email },
                                      { label: "Mess Code", val: o.messCode, mono: true },
                                      { label: "Placed At", val: `${fmtDate(o.createdAt)} ${fmtTime(o.createdAt)}` },
                                      { label: "Amount", val: `₹${o.price}`, accent: true },
                                    ].map(r => (
                                      <div key={r.label}>
                                        <p style={{ fontSize: 9, fontWeight: 700, color: T.t4, textTransform: "uppercase", letterSpacing: "0.09em", marginBottom: 4 }}>{r.label}</p>
                                        <p style={{ fontSize: 12, fontWeight: 600, color: r.accent ? T.brand : T.t1, fontFamily: r.mono ? "monospace" : "inherit", textTransform: r.cap ? "capitalize" : "none", wordBreak: "break-all" }}>{r.val || "—"}</p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* pagination */}
              {totalPages > 1 && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px", borderTop: `1px solid ${T.border}`, background: T.surface2 }}>
                  <button className="pgbtn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                    <Ic d="M15 18l-6-6 6-6" s={14} c={T.t2} />
                  </button>
                  <div style={{ display: "flex", gap: 6 }}>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                      <button key={n} className={`pgbtn${page === n ? " cur" : ""}`} onClick={() => setPage(n)}>
                        {n}
                      </button>
                    ))}
                  </div>
                  <button className="pgbtn" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                    <Ic d="M9 18l6-6-6-6" s={14} c={T.t2} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ════ MOBILE: CARD VIEW (grouped by date) ════ */}
        <div className="mob-only">
          {sorted.length === 0 ? (
            <div style={{ background: "#fff", border: `1px solid ${T.border}`, borderRadius: 16, padding: "48px 24px", textAlign: "center" }}>
              <p style={{ color: T.t3, fontSize: 14 }}>No orders match this filter.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {mobileDateKeys.map(dk => {
                const dayOrders = mobileGrouped[dk];
                const dayTotal = dayOrders.reduce((s, o) => s + o.price, 0);
                return (
                  <div key={dk}>
                    {/* date header */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10, paddingBottom: 10, borderBottom: `1px solid ${T.border}` }}>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: T.t1 }}>{fmtDay(dayOrders[0].createdAt)}</span>
                        <span style={{ fontSize: 11, color: T.t3 }}>{fmtDate(dayOrders[0].createdAt)}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 11, fontWeight: 600, color: T.brand, background: T.brandLt, padding: "3px 10px", borderRadius: 100 }}>₹{dayTotal}</span>
                        <span style={{ fontSize: 11, color: T.t3 }}>{dayOrders.length} item{dayOrders.length !== 1 ? "s" : ""}</span>
                      </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {dayOrders.map((o, idx) => {
                        const meta = getMeal(o.mealTime);
                        const isOpen = expanded === o._id;
                        return (
                          <div key={o._id} className="m-ocard">
                            <button className="m-orow" onClick={() => setExpanded(isOpen ? null : o._id)}>
                              <div style={{ width: 42, height: 42, borderRadius: 11, background: meta.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                {meta.icon(meta.color, 18)}
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
                                  <span style={{ fontSize: 14, fontWeight: 600, color: T.t1, textTransform: "capitalize" }}>{o.name}</span>
                                  <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 100, background: meta.bg, color: meta.color }}>{meta.label}</span>
                                </div>
                                <div style={{ display: "flex", gap: 6, marginTop: 3 }}>
                                  <span style={{ fontSize: 11, color: T.t3 }}>{fmtTime(o.createdAt)}</span>
                                  <span style={{ color: T.t4, fontSize: 10 }}>·</span>
                                  <span style={{ fontSize: 11, color: T.t3, fontWeight: 500 }}>{o.messCode}</span>
                                </div>
                              </div>
                              <span style={{ fontSize: 15, fontWeight: 700, color: T.t1, flexShrink: 0 }}>₹{o.price}</span>
                              <div className={`chev${isOpen ? " open" : ""}`} style={{ width: 26, height: 26, borderRadius: 7, background: T.surface2, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                <Ic d="M6 9l6 6 6-6" s={12} c={T.t3} sw={2.2} />
                              </div>
                            </button>
                            {isOpen && (
                              <div className="dropin" style={{ borderTop: `1px solid ${T.border}`, background: T.surface2, padding: "14px 16px" }}>
                                <div className="dgrid" style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12 }}>
                                  {[
                                    { label: "Order ID", val: o._id.slice(-8).toUpperCase(), mono: true },
                                    { label: "Amount", val: `₹${o.price}`, accent: true },
                                    { label: "Customer", val: o.userId?.name, cap: true },
                                    { label: "Status", val: "Confirmed", green: true },
                                    { label: "Email", val: o.userId?.email, small: true },
                                    { label: "Mess", val: o.messCode, mono: true },
                                  ].map(r => (
                                    <div key={r.label}>
                                      <p style={{ fontSize: 9, fontWeight: 700, color: T.t4, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3 }}>{r.label}</p>
                                      <p style={{ fontSize: r.small ? 11 : 12, fontWeight: 600, color: r.accent ? T.brand : r.green ? T.green : T.t1, fontFamily: r.mono ? "monospace" : "inherit", textTransform: r.cap ? "capitalize" : "none", wordBreak: "break-all" }}>{r.val || "—"}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

        {loader && (
        <div className="fixed inset-0 flex items-center justify-center bg-[#f6f3ef]/40 backdrop-blur-sm z-50">
          <Loader />
        </div>
      )}
    </>
  );
}