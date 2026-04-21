import { useState, useMemo } from "react";

/* ─── tiny helpers ─── */
const MEAL_EMOJI  = { Breakfast:"☀️", Lunch:"🍛", Snacks:"🫖", Dinner:"🌙" };
const MEAL_COLOR  = {
  Breakfast: { bg:"#fff7ed", text:"#c2620a", dot:"#f97316" },
  Lunch:     { bg:"#f0fdf4", text:"#15803d", dot:"#22c55e" },
  Snacks:    { bg:"#fefce8", text:"#a16207", dot:"#eab308" },
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

/* ─── Avatar ─── */
function Avatar({ name }) {
  const hue = nameHue(name);
  return (
    <div style={{
      width:36, height:36, borderRadius:10, flexShrink:0,
      background:`hsl(${hue},55%,92%)`,
      color:`hsl(${hue},55%,38%)`,
      display:"flex", alignItems:"center", justifyContent:"center",
      fontSize:12, fontWeight:700, letterSpacing:.5,
    }}>
      {initials(name)}
    </div>
  );
}

/* ─── Meal pill ─── */
function MealPill({ mealTime }) {
  const c = MEAL_COLOR[mealTime] || { bg:"#f3f4f6", text:"#6b7280", dot:"#9ca3af" };
  return (
    <span style={{
      display:"inline-flex", alignItems:"center", gap:5,
      background:c.bg, color:c.text,
      fontSize:11, fontWeight:600,
      padding:"3px 9px", borderRadius:100,
    }}>
      <span style={{width:6,height:6,borderRadius:"50%",background:c.dot,flexShrink:0}}/>
      {MEAL_EMOJI[mealTime] ?? "🍽"} {mealTime}
    </span>
  );
}

/* ─── Status badge ─── */
function StatusBadge({ status }) {
  const map = {
    Confirmed: { bg:"#f0fdf4", text:"#15803d", label:"Confirmed" },
    Pending:   { bg:"#fefce8", text:"#a16207", label:"Pending"   },
    Cancelled: { bg:"#fef2f2", text:"#b91c1c", label:"Cancelled" },
    Delivered: { bg:"#eff6ff", text:"#1d4ed8", label:"Delivered" },
  };
  const s = map[status] || { bg:"#f3f4f6", text:"#6b7280", label: status };
  return (
    <span style={{
      background:s.bg, color:s.text,
      fontSize:11, fontWeight:700,
      padding:"3px 10px", borderRadius:100,
      letterSpacing:.3,
    }}>
      {s.label}
    </span>
  );
}

/* ─── Expandable row for item details ─── */
function OrderRow({ order, index }) {
  const [open, setOpen] = useState(false);

  /* support both shapes: order.items[] or single-item order */
  const items = order.items ?? [{
    name:     order.name,
    price:    order.price,
    mealTime: order.mealTime,
    qty:      order.qty ?? 1,
  }];

  const total = items.reduce((s, it) => s + (it.price * (it.qty??1)), 0);
  const user  = order.userId ?? {};
  const userName  = user.name  ?? order.name ?? "—";
  const userEmail = user.email ?? "—";

  /* primary mealTime = first item's */
  const primaryMeal = items[0]?.mealTime ?? "Lunch";

  return (
    <>
      <tr
        onClick={() => setOpen(o=>!o)}
        style={{
          cursor:"pointer",
          borderBottom: open ? "none" : "1px solid #f0ebe3",
          background: open ? "#fdf9f5" : "white",
          transition:"background .15s",
          animationDelay:`${index*40}ms`,
        }}
        className="order-row"
      >
        {/* # */}
        <td style={{padding:"12px 16px", width:40}}>
          <span style={{fontSize:11,color:"#c2b8a9",fontWeight:600}}>
            {String(index+1).padStart(2,"0")}
          </span>
        </td>

        {/* Customer */}
        <td style={{padding:"12px 0"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <Avatar name={userName} />
            <div>
              <div style={{fontSize:13,fontWeight:700,color:"#1c1812",lineHeight:1.2}}>
                {userName}
              </div>
              <div style={{fontSize:11,color:"#9a8f82",marginTop:2}}>
                {userEmail}
              </div>
            </div>
          </div>
        </td>

        {/* Meal */}
        <td style={{padding:"12px 16px"}}>
          <MealPill mealTime={primaryMeal}/>
        </td>

        {/* Item(s) */}
        <td style={{padding:"12px 16px"}}>
          {items.length === 1 ? (
            <span style={{fontSize:13,color:"#1c1812",fontWeight:500}}>
              {items[0].name}
              {(items[0].qty??1) > 1 &&
                <span style={{color:"#9a8f82",marginLeft:4}}>×{items[0].qty}</span>}
            </span>
          ) : (
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <span style={{fontSize:13,color:"#1c1812",fontWeight:500}}>
                {items[0].name}
              </span>
              <span style={{
                fontSize:10,fontWeight:700,
                background:"#fde0bc",color:"#c2620a",
                padding:"2px 6px",borderRadius:100
              }}>
                +{items.length-1} more
              </span>
            </div>
          )}
        </td>

        {/* Amount */}
        <td style={{padding:"12px 16px", textAlign:"right"}}>
          <span style={{fontSize:14,fontWeight:800,color:"#1c1812",fontVariantNumeric:"tabular-nums"}}>
            ₹{total}
          </span>
        </td>

        {/* Status */}
        <td style={{padding:"12px 16px"}}>
          <StatusBadge status={order.status ?? "Confirmed"}/>
        </td>

        {/* Time */}
        <td style={{padding:"12px 16px", textAlign:"right"}}>
          <div style={{fontSize:12,color:"#1c1812",fontWeight:600}}>
            {formatTime(order.createdAt)}
          </div>
          <div style={{fontSize:10,color:"#c2b8a9",marginTop:2}}>
            {timeAgo(order.createdAt)}
          </div>
        </td>

        {/* Expand chevron */}
        <td style={{padding:"12px 14px 12px 4px", width:28}}>
          <svg
            width={14} height={14} viewBox="0 0 24 24" fill="none"
            stroke="#c2b8a9" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"
            style={{transform: open?"rotate(180deg)":"rotate(0deg)", transition:"transform .2s"}}
          >
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </td>
      </tr>

      {/* ── Expanded detail panel ── */}
      {open && (
        <tr style={{background:"#fdf9f5", borderBottom:"1px solid #f0ebe3"}}>
          <td colSpan={8} style={{padding:"0 16px 14px 16px"}}>
            <div style={{
              marginLeft:40+10+36, /* align under customer name */
              display:"flex", flexDirection:"column", gap:10,
            }}>
              {/* items breakdown */}
              <div style={{
                background:"white", border:"1px solid #ede8e0",
                borderRadius:10, overflow:"hidden",
                fontSize:12,
              }}>
                <div style={{
                  display:"grid",
                  gridTemplateColumns:"1fr auto auto auto",
                  padding:"8px 14px",
                  borderBottom:"1px solid #f0ebe3",
                  color:"#9a8f82", fontWeight:600, fontSize:11,
                  letterSpacing:.4, textTransform:"uppercase",
                }}>
                  <span>Item</span>
                  <span style={{textAlign:"center",minWidth:60}}>Meal</span>
                  <span style={{textAlign:"center",minWidth:40}}>Qty</span>
                  <span style={{textAlign:"right",minWidth:60}}>Price</span>
                </div>
                {items.map((it,i) => (
                  <div key={i} style={{
                    display:"grid",
                    gridTemplateColumns:"1fr auto auto auto",
                    padding:"9px 14px",
                    borderBottom: i<items.length-1 ? "1px solid #f9f5f0" : "none",
                    alignItems:"center",
                  }}>
                    <span style={{fontSize:13,fontWeight:600,color:"#1c1812"}}>{it.name}</span>
                    <span style={{textAlign:"center",minWidth:60}}>
                      <MealPill mealTime={it.mealTime??primaryMeal}/>
                    </span>
                    <span style={{textAlign:"center",minWidth:40,fontSize:13,color:"#5a5048",fontWeight:600}}>
                      ×{it.qty??1}
                    </span>
                    <span style={{textAlign:"right",minWidth:60,fontWeight:700,color:"#1c1812",fontSize:13}}>
                      ₹{it.price*(it.qty??1)}
                    </span>
                  </div>
                ))}
                {/* total row */}
                <div style={{
                  display:"grid",
                  gridTemplateColumns:"1fr auto",
                  padding:"9px 14px",
                  background:"#faf7f3",
                  borderTop:"1px solid #ede8e0",
                }}>
                  <span style={{fontSize:12,fontWeight:700,color:"#5a5048"}}>Total</span>
                  <span style={{fontWeight:800,color:"#c2620a",fontSize:14}}>₹{total}</span>
                </div>
              </div>

              {/* meta row */}
              <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
                {[
                  { label:"Order ID", val: order._id?.slice(-8).toUpperCase() ?? "—" },
                  { label:"Mess",     val: order.messCode ?? "—" },
                  { label:"Placed",   val: new Date(order.createdAt).toLocaleString("en-IN",{
                      day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"
                    }) },
                ].map(m => (
                  <div key={m.label} style={{
                    background:"white", border:"1px solid #ede8e0",
                    borderRadius:8, padding:"7px 12px",
                    display:"flex", flexDirection:"column", gap:2,
                  }}>
                    <span style={{fontSize:10,color:"#9a8f82",fontWeight:600,textTransform:"uppercase",letterSpacing:.4}}>
                      {m.label}
                    </span>
                    <span style={{fontSize:12,fontWeight:700,color:"#1c1812"}}>
                      {m.val}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

/* ════════════════════════════════════════════
   MAIN PAGE
════════════════════════════════════════════ */
function OrdersPage({ orders = [] }) {

  const [search,    setSearch]    = useState("");
  const [mealTab,   setMealTab]   = useState("All");
  const [statusTab, setStatusTab] = useState("All");
  const [sortKey,   setSortKey]   = useState("time"); // time | amount | name

  const meals   = ["All","Breakfast","Lunch","Snacks","Dinner"];
  const statuses= ["All","Confirmed","Pending","Cancelled","Delivered"];

  /* ── derived stats ── */
  const stats = useMemo(() => {
    const total   = orders.length;
    const revenue = orders.reduce((s,o) => {
      const items = o.items ?? [{ price:o.price, qty:o.qty??1 }];
      return s + items.reduce((ss,it)=>ss+it.price*(it.qty??1),0);
    }, 0);
    const byMeal = {};
    orders.forEach(o => {
      const m = (o.items?.[0]?.mealTime ?? o.mealTime) || "Other";
      byMeal[m] = (byMeal[m]||0)+1;
    });
    const topMeal = Object.entries(byMeal).sort((a,b)=>b[1]-a[1])[0]?.[0] ?? "—";
    return { total, revenue, topMeal };
  }, [orders]);

  /* ── filtered list ── */
  const filtered = useMemo(() => {
    let list = [...orders];

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

    list.sort((a,b) => {
      if (sortKey === "time")   return new Date(b.createdAt)-new Date(a.createdAt);
      if (sortKey === "amount") {
        const tot = o => (o.items??[{price:o.price,qty:o.qty??1}])
          .reduce((s,it)=>s+it.price*(it.qty??1),0);
        return tot(b)-tot(a);
      }
      if (sortKey === "name") {
        const na = (a.userId?.name??a.name??"").toLowerCase();
        const nb = (b.userId?.name??b.name??"").toLowerCase();
        return na.localeCompare(nb);
      }
      return 0;
    });

    return list;
  }, [orders, search, mealTab, statusTab, sortKey]);

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
            <div style={{display:"flex",alignItems:"center",gap:10}}>
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