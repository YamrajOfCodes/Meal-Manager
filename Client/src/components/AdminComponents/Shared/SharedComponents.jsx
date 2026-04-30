
const STATUS_STYLES = {
  paid:    { pill: "bg-green-100 text-green-700",  label:"Paid"    },
  due:     { pill: "bg-red-100 text-red-600",      label:"Due"     },
  partial: { pill: "bg-amber-100 text-amber-700",  label:"Partial" },
};

const MEAL_COLOR  = {
  Breakfast: { bg:"#fff7ed", text:"#c2620a", dot:"#f97316" },
  Lunch:     { bg:"#f0fdf4", text:"#15803d", dot:"#22c55e" },
  Dinner:    { bg:"#eff6ff", text:"#1d4ed8", dot:"#3b82f6" },
};


const getHue = (str = "") => {
  const colors = [
    "#7c3aed", "#c2620a", "#1d5fa6", "#1a7f5a",
    "#db2777", "#b45309", "#0f766e", "#9333ea",
    "#dc2626", "#2563eb"
  ];
  const index = str.charCodeAt(0) % colors.length;
  return colors[index];
};

const MEAL_EMOJI  = { Breakfast:"☀️", Lunch:"🍛", Dinner:"🌙" };

export function Avatar({ initials, hue, size = 34 }) {
  return (
    <div
      className="flex items-center justify-center rounded-full font-bold flex-shrink-0 text-xs"
      style={{ width: size, height: size, background: `${hue}18`, color: hue }}
    >
      {initials}
    </div>
  );
}

export function Pill({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.due;
  return (
    <span className={`inline-flex items-center text-[10px] font-semibold rounded-full px-2.5 py-0.5 ${s.pill}`}>
      {s.label}
    </span>
  );
}

export function CardWrap({ children, className = "" }) {
  return (
    <div className={`bg-white border border-[#e8e2d9] rounded-[14px] shadow-sm overflow-hidden ${className}`}>
      {children}
    </div>
  );
}

export function CardHead({ title, sub, right }) {
  return (
    <div className="px-5 py-4 border-b border-[#e8e2d9] flex items-center justify-between">
      <div>
        <div className="text-sm font-bold text-[#1a1510]">{title}</div>
        {sub && <div className="text-[11px] text-[#9a8f82] mt-0.5">{sub}</div>}
      </div>
      {right}
    </div>
  );
}


export function DueRow({ Due }) {
  console.log(Due)
  return (
    <div className="flex items-center gap-3 py-3 border-b border-[#e8e2d9] last:border-0">
      <Avatar initials={Due?.name?.slice(0,2)} hue={getHue(Due?.name)}  />
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-semibold text-[#1a1510]">{Due?.name}</div>
        <div className="text-[11px] text-[#9a8f82] mt-0.5">Location {Due?.address}</div>
        {/* <div className="text-[11px] text-[#9a8f82] mt-0.5">Due since {Due.since}</div> */} 
      </div>
      <div className="text-[13px] font-bold text-[#c0392b]">{Due?.payment}</div>
      <button className="px-3 py-1.5 rounded-[6px] bg-[#fdecea] text-[#c0392b] text-[11px] font-semibold border border-[rgba(192,57,43,.15)] cursor-pointer hover:opacity-80 transition-opacity whitespace-nowrap ml-2">
        Remind
      </button>
    </div>
  );
}

 export function MenuRow({ meal }) {

  console.log(meal)
  return (
    <div className="flex items-center justify-between py-3 border-b border-[#e8e2d9] last:border-0">
      <span className="text-[10px] font-bold uppercase tracking-wider text-[#9a8f82] min-w-[68px]">{meal?.mealTime}</span>
      <span className="flex-1 text-[13px] text-[#1a1510] font-medium">{meal?.name}</span>
      <span className="text-[11px] text-[#9a8f82]">{meal?.price}</span>
    </div>
  );
}

 export function ChipBadge({ type, children }) {
  const styles = {
    "chip-green": "bg-green-100 text-green-700",
    "chip-red":   "bg-red-100 text-red-600",
    "chip-amber": "bg-amber-100 text-amber-700",
    "chip-blue":  "bg-blue-100 text-blue-700",
  };
  return (
    <span className={`text-[10px] font-semibold rounded-full px-2.5 py-0.5 ${styles[type] || styles["chip-blue"]}`}>
      {children}
    </span>
  );
}



//  OrderPage Admin Components


 export function Avatarr({ name }) {
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
export function MealPill({ mealTime }) {
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
export function StatusBadge({ status }) {
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