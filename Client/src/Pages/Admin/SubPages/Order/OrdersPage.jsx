import { useState, useMemo } from "react";
import OrderRow from "../../../../components/AdminComponents/OrderRow/OrderRow";

/* ─── tiny helpers ─── */
const MEAL_EMOJI  = { Breakfast:"☀️", Lunch:"🍛", Dinner:"🌙" };
const MEAL_COLOR  = {
  Breakfast: { bg:"#fff7ed", text:"#c2620a", dot:"#f97316" },
  Lunch:     { bg:"#f0fdf4", text:"#15803d", dot:"#22c55e" },
  Dinner:    { bg:"#eff6ff", text:"#1d4ed8", dot:"#3b82f6" },
};

function timeAgo(iso) {
  const diff = (Date.now() - new Date(iso)) / 1000;
  if (diff < 60)   return "just now";
  if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
  if (diff < 86400)return `${Math.floor(diff/3600)}h ago`;
  return new Date(iso).toLocaleDateString("en-IN",{ day:"numeric", month:"short" });
}

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString("en-IN",{
    hour:"2-digit", minute:"2-digit", hour12:true
  });
}

function initials(name="") {
  return name.trim().split(/\s+/).map(w=>w[0]).join("").toUpperCase().slice(0,2) || "??";
}

/* deterministic hue from string */
function nameHue(str="") {
  let h = 0;
  for (let i=0;i<str.length;i++) h = (h*31 + str.charCodeAt(i)) % 360;
  return h;
}

/* ════════════════════════════════════════════
   MAIN PAGE
════════════════════════════════════════════ */
function OrdersPage({ orders = [] }) {

  const [search,    setSearch]    = useState("");
  const [mealTab,   setMealTab]   = useState("All");
  const [statusTab, setStatusTab] = useState("All");
  const [sortKey,   setSortKey]   = useState("time"); // time | amount | name

  const meals   = ["All","Breakfast","Lunch","Dinner"];
  const statuses= ["All","Confirmed","Pending","Cancelled","Delivered"];

  /* ── derived stats ── */
 

  /* ── filtered list ── */
;
const filtered = useMemo(() => {
  let list = orders.filter((order) => {
    return (
      new Date(order.createdAt).toDateString() ===
      new Date().toDateString()
    );
  });

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

  if (statusTab !== "All") {
    list = list.filter(o => (o.status ?? "Confirmed") === statusTab);
  }

  return list;
}, [orders, search, mealTab, statusTab]);

const stats = useMemo(() => {
  const total = filtered.length;

  let revenue = 0;
  const byMeal = {};
  let topMeal = "—";
  let maxCount = 0;

  filtered.forEach((o) => {
    const items = o.items ?? [{ price: o.price, qty: o.qty ?? 1 }];

    // revenue
    filtered.forEach((it) => {
      revenue += it.price * (it.qty ?? 1);
    });

    // meal count
    const meal = (o.items?.[0]?.mealTime ?? o.mealTime) || "Other";
    byMeal[meal] = (byMeal[meal] || 0) + 1;

    // track top meal without sorting
    if (byMeal[meal] > maxCount) {
      maxCount = byMeal[meal];
      topMeal = meal;
    }
  });

  return { total, revenue, topMeal };
}, [filtered]);

  /* ── empty state ── */
  const isEmpty = filtered.length === 0;

  return (
    <div style={{ fontFamily:"'Outfit',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');
        .order-row { animation: rowIn .25s ease both; }
        @keyframes rowIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:none} }
        .order-row:hover td { background:#fdf9f5 !important; }
        .sort-btn { background:none;border:none;cursor:pointer;padding:0; }
        .filter-chip { 
          border:1px solid #e8e2d9; background:white; color:#9a8f82;
          padding:5px 13px; border-radius:100px; font-size:11px; font-weight:600;
          cursor:pointer; transition:.12s; white-space:nowrap;
        }
        .filter-chip:hover { border-color:#ddd6cb; color:#5a5048; }
        .filter-chip.active { background:#fff4e8; color:#c2620a; border-color:#fde0bc; }
        .search-input:focus { border-color:#c2620a !important; box-shadow:0 0 0 3px rgba(194,98,10,.1); }
        .stat-card { background:white; border:1px solid #e8e2d9; border-radius:14px; padding:16px 20px; }
      `}</style>

      {/* ── Header ── */}
      <div style={{marginBottom:20}}>
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
          <div>
            <h2 style={{margin:0,fontSize:22,fontWeight:800,color:"#1c1812",letterSpacing:-.3}}>
              Orders
            </h2>
            <p style={{margin:"4px 0 0",fontSize:13,color:"#9a8f82"}}>
              {new Date().toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"long"})}
            </p>
          </div>
        </div>
      </div>

      {/* ── Stats strip ── */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:20}}>
        {[
          {
            label:"Total Orders",
            val: stats.total,
            icon:"M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2",
            color:"#c2620a", bg:"#fff4e8",
          },
          {
            label:"Revenue",
            val:`₹${stats.revenue.toLocaleString("en-IN")}`,
            icon:"M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6",
            color:"#15803d", bg:"#f0fdf4",
          },
          {
            label:"Top Meal",
            val: `${MEAL_EMOJI[stats.topMeal]??""} ${stats.topMeal}`,
            icon:"M3 11h18M3 7h18M7 3h10M5 11v8a2 2 0 002 2h10a2 2 0 002-2v-8",
            color:"#1d4ed8", bg:"#eff6ff",
          },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="grid grid-cols-1">
              <div style={{
                width:34,height:34,borderRadius:9,
                background:s.bg,display:"flex",
                alignItems:"center",justifyContent:"center",flexShrink:0,
              }}>
                <svg width={16} height={16} viewBox="0 0 24 24" fill="none"
                  stroke={s.color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d={s.icon}/>
                </svg>
              </div>
              <div>
                <div style={{fontSize:11,color:"#9a8f82",fontWeight:600,textTransform:"uppercase",letterSpacing:.4}}>
                  {s.label}
                </div>
                <div style={{fontSize:18,fontWeight:800,color:"#1c1812",lineHeight:1.2,marginTop:2}}>
                  {s.val || "—"}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Main card ── */}
      <div style={{
        background:"white", border:"1px solid #e8e2d9",
        borderRadius:16, overflow:"hidden",
        boxShadow:"0 1px 3px rgba(0,0,0,.04),0 6px 20px rgba(0,0,0,.03)",
      }}>

        {/* toolbar */}
        <div style={{padding:"14px 16px",borderBottom:"1px solid #e8e2d9",display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}}>
          {/* search */}
          <div style={{position:"relative",flex:"1",minWidth:160,maxWidth:260}}>
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none"
              stroke="#c2b8a9" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
              style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)"}}>
              <circle cx={11} cy={11} r={8}/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <input
              className="search-input"
              value={search}
              onChange={e=>setSearch(e.target.value)}
              placeholder="Search name, email…"
              style={{
                width:"100%", paddingLeft:30, paddingRight:10,
                height:32, border:"1px solid #e8e2d9", borderRadius:8,
                fontSize:12, color:"#1c1812", background:"#faf8f5",
                outline:"none", transition:".15s", boxSizing:"border-box",
              }}
            />
          </div>

          {/* meal filter */}
          <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
            {meals.map(m=>(
              <button key={m}
                className={`filter-chip ${mealTab===m?"active":""}`}
                onClick={()=>setMealTab(m)}>
                {m !== "All" && (MEAL_EMOJI[m]+" ")}{m}
              </button>
            ))}
          </div>

          {/* status filter */}
          <div style={{display:"flex",gap:4,flexWrap:"wrap",marginLeft:"auto"}}>
            {statuses.map(s=>(
              <button key={s}
                className={`filter-chip ${statusTab===s?"active":""}`}
                onClick={()=>setStatusTab(s)}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* sort bar */}
        <div style={{
          display:"flex", gap:4, padding:"8px 16px",
          borderBottom:"1px solid #f0ebe3",
          background:"#faf8f5",
        }}>
          <span style={{fontSize:11,color:"#9a8f82",fontWeight:600,marginRight:6,lineHeight:"28px"}}>
            Sort by:
          </span>
          {[
            {key:"time",  label:"Latest"},
            {key:"amount",label:"Amount"},
            {key:"name",  label:"Name"},
          ].map(s=>(
            <button key={s.key}
              className={`filter-chip ${sortKey===s.key?"active":""}`}
              onClick={()=>setSortKey(s.key)}
              style={{fontSize:11}}>
              {sortKey===s.key && <span style={{marginRight:3}}>↓</span>}
              {s.label}
            </button>
          ))}
          <span style={{marginLeft:"auto",fontSize:11,color:"#9a8f82",lineHeight:"28px"}}>
            {filtered.length} result{filtered.length!==1?"s":""}
          </span>
        </div>

        {/* table */}
        {isEmpty ? (
          <div style={{padding:"56px 20px",textAlign:"center"}}>
            <div style={{fontSize:36,marginBottom:12}}>🍽</div>
            <p style={{margin:0,fontSize:14,fontWeight:700,color:"#1c1812"}}>No orders found</p>
            <p style={{margin:"6px 0 0",fontSize:12,color:"#9a8f82"}}>
              Try adjusting your filters or search query
            </p>
          </div>
        ) : (
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",minWidth:700}}>
              <thead>
                <tr style={{borderBottom:"2px solid #f0ebe3",background:"#faf8f5"}}>
                  {["#","Customer","Meal","Item(s)","Amount","Status","Time",""].map((h,i)=>(
                    <th key={i} style={{
                      padding:"9px 16px",
                      fontSize:11, fontWeight:700, color:"#9a8f82",
                      textTransform:"uppercase", letterSpacing:.5,
                      textAlign: (i===4||i===6) ? "right" : "left",
                      whiteSpace:"nowrap",
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((order,i)=>(
                  <OrderRow key={order._id ?? i} order={order} index={i}/>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrdersPage;