
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


function getStatusConfig(payment) {
  const amount = parseFloat(String(payment).replace(/[^0-9.]/g, "")) || 0;
  if (amount >= 5000)
    return { color: "#dc2626", bg: "rgba(220,38,38,0.07)", label: "High Due", dot: "#dc2626" };
  if (amount >= 1000)
    return { color: "#d97706", bg: "rgba(217,119,6,0.07)", label: "Pending", dot: "#f59e0b" };
  return { color: "#b45309", bg: "rgba(180,83,9,0.07)", label: "Low Due", dot: "#fb923c" };
}
 
// ---- Location Icon ----
function LocationIcon({ color }) {
  return (
    <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
      <path
        d="M7 1C4.79 1 3 2.79 3 5c0 3.25 4 8 4 8s4-4.75 4-8c0-2.21-1.79-4-4-4z"
        fill={color}
        opacity="0.18"
        stroke={color}
        strokeWidth="1.2"
      />
      <circle cx="7" cy="5" r="1.4" fill={color} />
    </svg>
  );
}
 
// ---- Bell Icon ----
function BellIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 18 18" fill="none">
      <path
        d="M9 2a5 5 0 0 1 5 5v3l1.5 2H2.5L4 10V7a5 5 0 0 1 5-5z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M7.5 14.5a1.5 1.5 0 0 0 3 0"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
 

function AvatarDue({ initials = "??", hue = 200 }) {
  const bg = `hsl(${hue}, 55%, 92%)`;
  const color = `hsl(${hue}, 50%, 35%)`;
  const border = `hsl(${hue}, 45%, 80%)`;
  return (
    <div
      style={{
        width: "40px",
        height: "40px",
        borderRadius: "12px",
        background: bg,
        border: `1.5px solid ${border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        fontFamily: "'Georgia', serif",
        fontSize: "13px",
        fontWeight: 700,
        color,
        letterSpacing: "0.02em",
        userSelect: "none",
      }}
    >
      {initials?.toUpperCase()}
    </div>
  );
}


export function DueRow({ Due }) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const hue = getHue(Due?.name);
  const status = getStatusConfig(Due?.payment);
 
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "11px 14px",
        borderRadius: "14px",
        background: hovered ? "rgba(30,15,5,0.03)" : "transparent",
        borderBottom: "1px solid rgba(30,20,10,0.07)",
        transition: "background 0.2s ease",
        position: "relative",
      }}
    >
      {/* Left accent bar */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: "50%",
          transform: "translateY(-50%)",
          width: "3px",
          height: hovered ? "60%" : "0%",
          borderRadius: "0 3px 3px 0",
          background: status.color,
          transition: "height 0.2s ease",
        }}
      />
 
      {/* Avatar */}
      {/* <AvatarDue initials={Due?.name?.slice(0, 2)} hue={hue} /> */}
 
      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: "13.5px",
            fontWeight: 700,
            color: "#1a1510",
            letterSpacing: "-0.01em",
            fontFamily: "'Georgia', serif",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {Due?.name}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            marginTop: "3px",
          }}
        >
          <LocationIcon color="#9a8f82" />
          <span
            style={{
              fontSize: "10.5px",
              color: "#9a8f82",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {Due?.address}
          </span>
        </div>
      </div>
 
      {/* Amount + status */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "6px", flexShrink: 0, minWidth: "70px" }}>
        <span
          style={{
            fontSize: "14px",
            fontWeight: 800,
            color: status.color,
            fontFamily: "'Georgia', serif",
            letterSpacing: "-0.02em",
            lineHeight: 1,
            textAlign: "right",
          }}
        >
          {Due?.payment}
        </span>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: "4px",
            fontSize: "9.5px",
            fontWeight: 700,
            color: status.color,
            letterSpacing: "0.07em",
            textTransform: "uppercase",
            background: status.bg,
            padding: "2px 7px",
            borderRadius: "20px",
            lineHeight: 1.4,
            whiteSpace: "nowrap",
          }}
        >
          <span
            style={{
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              background: status.dot,
              display: "inline-block",
              flexShrink: 0,
            }}
          />
          {status.label}
        </span>
      </div>
 
      {/* Remind Button */}
      <button
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
        onMouseLeave={() => setPressed(false)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "5px",
          padding: "7px 12px",
          borderRadius: "10px",
          background: pressed ? status.color : status.bg,
          color: pressed ? "#fff" : status.color,
          border: `1.5px solid ${status.color}30`,
          fontSize: "11px",
          fontWeight: 700,
          letterSpacing: "0.02em",
          cursor: "pointer",
          flexShrink: 0,
          transition: "background 0.15s ease, color 0.15s ease, transform 0.12s ease",
          transform: pressed ? "scale(0.95)" : "scale(1)",
          whiteSpace: "nowrap",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <BellIcon />
        Remind
      </button>
    </div>
  );
}
 

import { useState } from "react";

const MEAL_CONFIG = {
  Breakfast: {
    icon: (
      <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
        <circle cx="14" cy="14" r="6" fill="#F59E0B" opacity="0.15"/>
        <circle cx="14" cy="14" r="4" fill="#F59E0B" opacity="0.3"/>
        <circle cx="14" cy="14" r="2.5" fill="#F59E0B"/>
        {/* Sun rays */}
        {[0,45,90,135,180,225,270,315].map((deg, i) => (
          <line
            key={i}
            x1={14 + 7 * Math.cos((deg * Math.PI) / 180)}
            y1={14 + 7 * Math.sin((deg * Math.PI) / 180)}
            x2={14 + 9.5 * Math.cos((deg * Math.PI) / 180)}
            y2={14 + 9.5 * Math.sin((deg * Math.PI) / 180)}
            stroke="#F59E0B"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        ))}
      </svg>
    ),
    label: "Breakfast",
    accent: "#F59E0B",
    bg: "rgba(245,158,11,0.08)",
    badge: "AM",
  },
  Lunch: {
    icon: (
      <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
        {/* Fork */}
        <line x1="9" y1="6" x2="9" y2="22" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M7 6 C7 10 11 10 11 6" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
        {/* Knife */}
        <line x1="19" y1="6" x2="19" y2="22" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M19 6 L21 10 L19 12" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        {/* Plate circle */}
        <circle cx="14" cy="15" r="5" stroke="#22C55E" strokeWidth="1" opacity="0.35"/>
      </svg>
    ),
    label: "Lunch",
    accent: "#22C55E",
    bg: "rgba(34,197,94,0.08)",
    badge: "PM",
  },
  Dinner: {
    icon: (
      <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
        {/* Moon */}
        <path
          d="M19 14.5C19 18.09 16.09 21 12.5 21C8.91 21 6 18.09 6 14.5C6 10.91 8.91 8 12.5 8C11.67 9.38 11.25 10.92 11.25 12.5C11.25 16.09 14.16 19 17.75 19C18.2 19 18.62 18.95 19 18.85C19 17.43 19 14.5 19 14.5Z"
          fill="#818CF8"
          opacity="0.2"
        />
        <path
          d="M19 14.5C19 18.09 16.09 21 12.5 21C8.91 21 6 18.09 6 14.5C6 10.91 8.91 8 12.5 8C11.67 9.38 11.25 10.92 11.25 12.5C11.25 16.09 14.16 19 17.75 19C18.2 19 18.62 18.95 19 18.85"
          stroke="#818CF8"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Stars */}
        <circle cx="21" cy="8" r="1" fill="#818CF8" opacity="0.6"/>
        <circle cx="23" cy="12" r="0.7" fill="#818CF8" opacity="0.4"/>
        <circle cx="20" cy="5" r="0.6" fill="#818CF8" opacity="0.5"/>
      </svg>
    ),
    label: "Dinner",
    accent: "#818CF8",
    bg: "rgba(129,140,248,0.08)",
    badge: "Eve",
  },
  Snack: {
    icon: (
      <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
        <path d="M8 20 Q14 10 20 20" stroke="#FB923C" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
        <circle cx="14" cy="11" r="3" fill="#FB923C" opacity="0.2" stroke="#FB923C" strokeWidth="1.2"/>
        <circle cx="14" cy="11" r="1.2" fill="#FB923C"/>
      </svg>
    ),
    label: "Snack",
    accent: "#FB923C",
    bg: "rgba(251,146,60,0.08)",
    badge: "Snk",
  },
};

function getMealConfig(mealTime) {
  if (!mealTime) return MEAL_CONFIG["Breakfast"];
  const key = Object.keys(MEAL_CONFIG).find(
    (k) => k.toLowerCase() === mealTime.toLowerCase()
  );
  return MEAL_CONFIG[key] || MEAL_CONFIG["Breakfast"];
}

export function MenuRow({ meal }) {
  const [hovered, setHovered] = useState(false);
  const config = getMealConfig(meal?.mealTime);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "14px",
        padding: "12px 16px",
        borderRadius: "14px",
        background: hovered ? config.bg : "transparent",
        borderBottom: "1px solid rgba(30,20,10,0.07)",
        transition: "background 0.22s ease",
        cursor: "default",
        position: "relative",
      }}
    >
      {/* Icon Badge */}
      <div
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "12px",
          background: config.bg,
          border: `1.5px solid ${config.accent}22`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          transition: "transform 0.18s ease, box-shadow 0.18s ease",
          transform: hovered ? "scale(1.08)" : "scale(1)",
          boxShadow: hovered ? `0 4px 16px ${config.accent}33` : "none",
        }}
      >
        {config.icon}
      </div>

      {/* Meal Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: "13.5px",
            fontWeight: 600,
            color: "#1a1510",
            letterSpacing: "-0.01em",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            fontFamily: "'Georgia', serif",
          }}
        >
          {meal?.name || "Unnamed Meal"}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            marginTop: "2px",
          }}
        >
          <span
            style={{
              fontSize: "10px",
              fontWeight: 700,
              color: config.accent,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              fontFamily: "monospace",
            }}
          >
            {config.badge}
          </span>
          <span
            style={{
              width: "2px",
              height: "2px",
              borderRadius: "50%",
              background: "#c9bfb5",
              display: "inline-block",
            }}
          />
          <span
            style={{
              fontSize: "10.5px",
              color: "#9a8f82",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            {config.label}
          </span>
        </div>
      </div>

      {/* Price */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontSize: "14px",
            fontWeight: 700,
            color: "#1a1510",
            letterSpacing: "-0.02em",
            fontFamily: "'Georgia', serif",
          }}
        >
          {meal?.price || "—"}
        </span>
      </div>

      {/* Hover accent line */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: "50%",
          transform: "translateY(-50%)",
          width: "3px",
          height: hovered ? "60%" : "0%",
          borderRadius: "0 3px 3px 0",
          background: config.accent,
          transition: "height 0.22s ease",
        }}
      />
    </div>
  );
}

// ---- Demo ----
const sampleMeals = [
  { mealTime: "Breakfast", name: "Avocado Toast with Poached Eggs", price: "₹280" },
  { mealTime: "Lunch", name: "Grilled Chicken Caesar Salad", price: "₹420" },
  { mealTime: "Dinner", name: "Butter Paneer Masala with Naan", price: "₹380" },
  { mealTime: "Snack", name: "Fresh Fruit Bowl with Yogurt", price: "₹180" },
];

export default function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f0ea",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, sans-serif",
        padding: "24px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "#fff",
          borderRadius: "24px",
          boxShadow: "0 8px 48px rgba(80,50,20,0.10)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 20px 12px",
            borderBottom: "1px solid rgba(30,20,10,0.07)",
          }}
        >
          <p
            style={{
              fontSize: "10px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#9a8f82",
              fontWeight: 700,
              margin: 0,
              marginBottom: "2px",
            }}
          >
            Today's Menu
          </p>
          <h2
            style={{
              fontSize: "22px",
              fontWeight: 800,
              color: "#1a1510",
              margin: 0,
              fontFamily: "'Georgia', serif",
              letterSpacing: "-0.02em",
            }}
          >
            Daily Meals
          </h2>
        </div>

        {/* Rows */}
        <div style={{ padding: "8px 4px" }}>
          {sampleMeals.map((meal, i) => (
            <MenuRow key={i} meal={meal} />
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "12px 20px",
            borderTop: "1px solid rgba(30,20,10,0.07)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: "11px", color: "#9a8f82" }}>4 meals · today</span>
          <span
            style={{
              fontSize: "13px",
              fontWeight: 700,
              color: "#1a1510",
              fontFamily: "'Georgia', serif",
            }}
          >
            ₹1,260
          </span>
        </div>
      </div>
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