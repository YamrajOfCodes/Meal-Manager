import { useState, useMemo, useEffect } from "react";
import OrderRow from "../../../../components/AdminComponents/OrderRow/OrderRow";
import MobileOrderCard from "../../../../components/AdminComponents/MobileCards/MobileOrderCard";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useGetOrders } from "../../../../hooks/Admin/adminHooks";
import { protectRoute } from "../../../../utils/ProtectedRoutes/ProtectedRoutes";

/* ─── helpers ──────────────────────────────────────────────────────── */
function timeAgo(iso) {
  const diff = (Date.now() - new Date(iso)) / 1000;
  if (diff < 60)    return "just now";
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

/* ─── inline SVG icons (no external dep needed) ─────────────────────
   Each returns a plain <svg> element.                                */
const Icon = {
  ClipboardList: ({ size = 16, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
      <rect x="9" y="3" width="6" height="4" rx="1" ry="1"/>
      <line x1="9" y1="12" x2="15" y2="12"/>
      <line x1="9" y1="16" x2="13" y2="16"/>
    </svg>
  ),
  IndianRupee: ({ size = 16, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3h12M6 8h12M15 21 6 8"/>
      <path d="M6 13h3a4 4 0 000-8"/>
    </svg>
  ),
  UtensilsCrossed: ({ size = 16, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 2l-2.3 2.3a3 3 0 000 4.2l1.8 1.8a3 3 0 004.2 0L22 8"/>
      <path d="M15 15 3.3 3.3a4.2 4.2 0 000 6l7.3 7.3c.7.7 2 .7 2.8 0L15 15z"/>
      <path d="M2 21.3l6.2-6.2"/>
    </svg>
  ),
  Search: ({ size = 14, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx={11} cy={11} r={8}/><path d="M21 21l-4.35-4.35"/>
    </svg>
  ),
  ChevronDown: ({ size = 12, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9l6 6 6-6"/>
    </svg>
  ),
  ArrowDown: ({ size = 11, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"/><path d="M19 12l-7 7-7-7"/>
    </svg>
  ),
  Inbox: ({ size = 36, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/>
      <path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"/>
    </svg>
  ),
};

/* ─── stat card ─────────────────────────────────────────────────────── */
function StatCard({ label, value, icon: IconComp, accentColor, bgColor }) {
  return (
    <div style={{
      background: "white",
      border: "1px solid #e8e2d9",
      borderRadius: 14,
      padding: "18px 20px",
      display: "flex",
      alignItems: "center",
      gap: 14,
      position: "relative",
      overflow: "hidden",
    }}>
      {/* subtle background tint stripe */}
      <div style={{
        position: "absolute", top: 0, left: 0,
        width: 3, height: "100%",
        background: accentColor, borderRadius: "14px 0 0 14px",
      }} />
      <div style={{
        width: 38, height: 38, borderRadius: 10,
        background: bgColor,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}>
        <IconComp size={17} color={accentColor} />
      </div>
      <div>
        <div style={{
          fontSize: 10, fontWeight: 700, letterSpacing: 1,
          textTransform: "uppercase", color: "#a09890",
          fontFamily: "'DM Mono', monospace",
        }}>
          {label}
        </div>
        <div style={{
          fontSize: 20, fontWeight: 800, color: "#1c1812",
          lineHeight: 1.2, marginTop: 3,
          fontFamily: "'Fraunces', serif",
          letterSpacing: -0.5,
        }}>
          {value || "—"}
        </div>
      </div>
    </div>
  );
}

/* ─── filter chip ────────────────────────────────────────────────────── */
function Chip({ active, onClick, children }) {
  return (
    <button onClick={onClick} style={{
      border: active ? "1px solid #f5c99a" : "1px solid #e4ddd5",
      background: active ? "#fff4e8" : "white",
      color: active ? "#c2620a" : "#6b6058",
      padding: "5px 14px", borderRadius: 100,
      fontSize: 11.5, fontWeight: 600, cursor: "pointer",
      transition: "all .15s", whiteSpace: "nowrap",
      lineHeight: "22px",
      fontFamily: "'DM Mono', monospace",
      letterSpacing: 0.3,
    }}>
      {children}
    </button>
  );
}

/* ════════════════════════════════════════════════════════════════════
   MAIN PAGE
════════════════════════════════════════════════════════════════════ */
function OrdersPage() {
  const [search,    setSearch]    = useState("");
  const [mealTab,   setMealTab]   = useState("All");
  const [sortKey,   setSortKey]   = useState("time");

  const meals = ["All", "Breakfast", "Lunch", "Dinner"];

  const token   = localStorage.getItem("login");
  const decoded = token ? jwtDecode(token) : null;
  const navigate = useNavigate();
  const messCode = decoded?.messCode;
  const { data: orders } = useGetOrders(messCode);

  useEffect(() => {
    protectRoute(navigate, "owner");
  }, [navigate]);

  /* ── filtered + sorted list ── */
  const filtered = useMemo(() => {
    let list = (orders ?? []).filter(o =>
      new Date(o.createdAt).toDateString() === new Date().toDateString()
    );

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(o =>
        (o.userId?.name ?? o.name ?? "").toLowerCase().includes(q) ||
        (o.userId?.email ?? "").toLowerCase().includes(q) ||
        (o._id ?? "").toLowerCase().includes(q)
      );
    }

    if (mealTab !== "All") {
      list = list.filter(o =>
        (o.items?.[0]?.mealTime ?? o.mealTime) === mealTab
      );
    }

    if (sortKey === "amount") {
      list = [...list].sort((a, b) => b.price - a.price);
    } else if (sortKey === "name") {
      list = [...list].sort((a, b) =>
        (a.userId?.name ?? a.name ?? "").localeCompare(b.userId?.name ?? b.name ?? "")
      );
    } else {
      list = [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return list;
  }, [orders, search, mealTab, sortKey]);

  /* ── stats ── */
  const stats = useMemo(() => {
    const total   = filtered.length;
    const revenue = filtered.reduce((s, o) => s + (o.price * (o.qty ?? 1)), 0);

    const byMeal = {};
    filtered.forEach(o => {
      const m = o.items?.[0]?.mealTime ?? o.mealTime ?? "Other";
      byMeal[m] = (byMeal[m] || 0) + 1;
    });
    const topMeal = Object.entries(byMeal).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";

    return { total, revenue, topMeal };
  }, [filtered]);

  const isEmpty = filtered.length === 0;

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:ital,wght@0,700;0,800;1,700&family=DM+Mono:wght@400;500;600&display=swap');

        * { box-sizing: border-box; }

        .order-row {
          animation: rowSlide .22s ease both;
        }
        @keyframes rowSlide {
          from { opacity: 0; transform: translateY(5px); }
          to   { opacity: 1; transform: none; }
        }
        .order-row:hover > td {
          background: #fdf9f5 !important;
        }

        .search-wrap input:focus {
          border-color: #c2620a !important;
          box-shadow: 0 0 0 3px rgba(194,98,10,.1);
          outline: none;
        }

        .th-cell {
          padding: 10px 14px;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: .9px;
          color: #a09890;
          white-space: nowrap;
          font-family: 'DM Mono', monospace;
          background: #faf8f5;
          border-bottom: 1px solid #ede8e0;
          text-align: left;
        }
        .th-cell.right { text-align: right; }

        .sort-btn {
          display: inline-flex; align-items: center; gap: 4px;
          background: none; border: none; cursor: pointer;
          padding: 0; color: inherit; font: inherit;
          letter-spacing: inherit; text-transform: inherit;
        }
        .sort-btn:hover { color: #c2620a; }
        .sort-btn.active { color: #c2620a; }
      `}</style>

      {/* ══ Page header ════════════════════════════════════════════ */}
      <div style={{ marginBottom: 22, display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1.2, textTransform: "uppercase", color: "#a09890", marginBottom: 4, fontFamily: "'DM Mono', monospace" }}>
            Dashboard · Orders
          </div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: "#1c1812", letterSpacing: -0.6, fontFamily: "'Fraunces', serif", lineHeight: 1.1 }}>
            Today's Orders
          </h1>
          <p style={{ margin: "5px 0 0", fontSize: 12.5, color: "#a09890", fontWeight: 500 }}>
            {today}
          </p>
        </div>
      </div>

      {/* ══ Stat strip ═════════════════════════════════════════════ */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 22 }}>
        <StatCard
          label="Total Orders"
          value={stats.total}
          icon={Icon.ClipboardList}
          accentColor="#c2620a"
          bgColor="#fff4e8"
        />
        <StatCard
          label="Revenue"
          value={`₹ ${stats.revenue.toLocaleString("en-IN")}`}
          icon={Icon.IndianRupee}
          accentColor="#15803d"
          bgColor="#f0fdf4"
        />
        <StatCard
          label="Top Meal"
          value={stats.topMeal}
          icon={Icon.UtensilsCrossed}
          accentColor="#7c3aed"
          bgColor="#f5f3ff"
        />
      </div>

      {/* ══ Main card ══════════════════════════════════════════════ */}
      <div style={{
        background: "white",
        border: "1px solid #e4ddd5",
        borderRadius: 16,
        overflow: "hidden",
        boxShadow: "0 1px 3px rgba(0,0,0,.04), 0 8px 24px rgba(0,0,0,.04)",
      }}>

        {/* ── Toolbar ── */}
        <div style={{
          padding: "12px 16px",
          borderBottom: "1px solid #ede8e0",
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          alignItems: "center",
          background: "white",
        }}>

          {/* Search */}
          <div className="search-wrap" style={{ position: "relative", flex: "1", minWidth: 160, maxWidth: 240 }}>
            <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", display: "flex" }}>
              <Icon.Search color="#c2b8a9" />
            </span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search name, email…"
              style={{
                width: "100%", paddingLeft: 32, paddingRight: 10,
                height: 34, border: "1px solid #e4ddd5",
                borderRadius: 8, fontSize: 12.5, color: "#1c1812",
                background: "#faf8f5", transition: ".15s",
                fontFamily: "'Outfit', sans-serif",
              }}
            />
          </div>

          {/* Divider */}
          <div style={{ width: 1, height: 22, background: "#ede8e0", flexShrink: 0 }} />

          {/* Meal filter */}
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
            {meals.map(m => (
              <Chip key={m} active={mealTab === m} onClick={() => setMealTab(m)}>
                {m}
              </Chip>
            ))}
          </div>
        </div>

        {/* ── Sort bar ── */}
        <div style={{
          padding: "8px 16px",
          borderBottom: "1px solid #ede8e0",
          background: "#faf8f5",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}>
          <span style={{ fontSize: 11, color: "#a09890", fontWeight: 600, fontFamily: "'DM Mono', monospace", letterSpacing: .3, marginRight: 4 }}>
            Sort by
          </span>
          {[
            { key: "time",   label: "Latest" },
            { key: "amount", label: "Amount" },
            { key: "name",   label: "Name"   },
          ].map(s => (
            <button
              key={s.key}
              className={`sort-btn ${sortKey === s.key ? "active" : ""}`}
              style={{
                fontSize: 11, fontWeight: 600, fontFamily: "'DM Mono', monospace",
                letterSpacing: .3, textTransform: "uppercase",
                color: sortKey === s.key ? "#c2620a" : "#a09890",
                padding: "4px 10px",
                borderRadius: 6,
                background: sortKey === s.key ? "#fff4e8" : "transparent",
                border: sortKey === s.key ? "1px solid #f5c99a" : "1px solid transparent",
                transition: "all .15s",
              }}
              onClick={() => setSortKey(s.key)}
            >
              {sortKey === s.key && (
                <Icon.ArrowDown size={9} color="#c2620a" />
              )}{" "}
              {s.label}
            </button>
          ))}
          <span style={{ marginLeft: "auto", fontSize: 11, color: "#a09890", fontFamily: "'DM Mono', monospace", letterSpacing: .2 }}>
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* ── Content ── */}
        {isEmpty ? (
          /* Empty state */
          <div style={{ padding: "60px 20px", textAlign: "center" }}>
            <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 64, height: 64, borderRadius: 18, background: "#faf7f3", border: "1px solid #ede8e0", marginBottom: 16 }}>
              <Icon.Inbox size={28} color="#c2b8a9" />
            </div>
            <p style={{ fontSize: 15, fontWeight: 700, color: "#1c1812", margin: 0, fontFamily: "'Fraunces', serif" }}>
              No orders found
            </p>
            <p style={{ fontSize: 12.5, color: "#a09890", marginTop: 6 }}>
              Try adjusting your filters or search query.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div style={{ overflowX: "auto", display: "block" }} className="hidden-mobile">
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 750 }}>
                <thead>
                  <tr>
                    {[
                      { label: "#",        align: "left"  },
                      { label: "Customer", align: "left"  },
                      { label: "Meal",     align: "left"  },
                      { label: "Item(s)",  align: "left"  },
                      { label: "Amount",   align: "right" },
                      { label: "Address",  align: "left"  },
                      { label: "Status",   align: "left"  },
                      { label: "Time",     align: "right" },
                      { label: "",         align: "left"  },
                    ].map((h, i) => (
                      <th key={i} className={`th-cell${h.align === "right" ? " right" : ""}`}>
                        {h.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((order, i) => (
                    <OrderRow key={order._id ?? i} order={order} index={i} />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div style={{ display: "none" }} className="show-mobile">
              <div style={{ display: "flex", flexDirection: "column", gap: 10, padding: 12 }}>
                {filtered.map((order, i) => (
                  <MobileOrderCard key={order._id ?? i} order={order} index={i} />
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── Footer count bar ── */}
        {!isEmpty && (
          <div style={{
            padding: "10px 16px",
            borderTop: "1px solid #ede8e0",
            background: "#faf8f5",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
            <span style={{ fontSize: 11, color: "#a09890", fontFamily: "'DM Mono', monospace" }}>
              Showing <strong style={{ color: "#6b6058" }}>{filtered.length}</strong> order{filtered.length !== 1 ? "s" : ""} for today
            </span>
            <span style={{ fontSize: 11, color: "#a09890", fontFamily: "'DM Mono', monospace" }}>
              Total collected:{" "}
              <strong style={{ color: "#15803d" }}>
                ₹{stats.revenue.toLocaleString("en-IN")}
              </strong>
            </span>
          </div>
        )}
      </div>

      <style>{`
        @media (min-width: 768px) {
          .hidden-mobile { display: block !important; }
          .show-mobile   { display: none   !important; }
        }
        @media (max-width: 767px) {
          .hidden-mobile { display: none   !important; }
          .show-mobile   { display: block  !important; }
        }
      `}</style>
    </div>
  );
}

export default OrdersPage;