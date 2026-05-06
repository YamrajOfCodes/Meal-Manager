import { useState } from "react";
import { Avatar, MealPill, StatusBadge } from "../Shared/SharedComponents";

function MobileOrderCard({ order, index }) {
  const [open, setOpen] = useState(false);

  function timeAgo(iso) {
    const diff = (Date.now() - new Date(iso)) / 1000;
    if (diff < 60)    return "just now";
    if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  }

  function formatTime(iso) {
    return new Date(iso).toLocaleTimeString("en-IN", {
      hour: "2-digit", minute: "2-digit", hour12: true,
    });
  }

  const items = order.items ?? [{
    name:     order.name,
    price:    order.price,
    mealTime: order.mealTime,
    qty:      order.qty ?? 1,
  }];

  const total       = items.reduce((s, it) => s + (it.price * (it.qty ?? 1)), 0);
  const user        = order.userId ?? {};
  const userName    = user.name  ?? order.name  ?? "—";
  const userEmail   = user.email ?? "—";
  const primaryMeal = items[0]?.mealTime ?? "Lunch";

  return (
    <div className="bg-white border border-[#ebe6de] rounded-2xl overflow-hidden">

      {/* card header — always visible */}
      <div onClick={() => setOpen(o => !o)} className="px-4 pt-4 pb-3 cursor-pointer">

        {/* row 1: index + meal pill + status + chevron */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-[#c2b8a9] bg-[#f5f0ea] px-2 py-0.5 rounded-full">
              {String(index + 1).padStart(2, "0")}
            </span>
            <MealPill mealTime={primaryMeal} />
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={order.status ?? "Confirmed"} />
            <svg width={13} height={13} viewBox="0 0 24 24" fill="none"
              stroke="#c2b8a9" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"
              style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform .2s" }}>
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
        </div>

        {/* row 2: avatar + name/email */}
        <div className="flex items-center gap-2.5 mb-3">
          <Avatar name={userName} />
          <div>
            <p className="text-[13px] font-bold text-[#1c1812] leading-tight">{userName}</p>
            <p className="text-[11px] text-[#9a8f82] mt-0.5">{userEmail}</p>
          </div>
        </div>

        {/* row 3: items preview */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[13px] font-medium text-[#1c1812]">{items[0].name}</span>
          {(items[0].qty ?? 1) > 1 &&
            <span className="text-[12px] text-[#9a8f82]">×{items[0].qty}</span>}
          {items.length > 1 &&
            <span className="text-[10px] font-bold bg-[#fde0bc] text-[#c2620a] px-2 py-0.5 rounded-full">
              +{items.length - 1} more
            </span>}
        </div>

        {/* row 4: total + time */}
        <div className="flex items-center justify-between pt-2.5 border-t border-[#f5f0ea]">
          <span className="text-[15px] font-extrabold text-[#1c1812]">₹{total}</span>
          <div className="text-right">
            <p className="text-[12px] font-semibold text-[#1c1812]">{formatTime(order.createdAt)}</p>
            <p className="text-[10px] text-[#c2b8a9] mt-0.5">{timeAgo(order.createdAt)}</p>
          </div>
        </div>
      </div>

      {/* expanded panel */}
      {open && (
        <div className="bg-[#fdf9f5] border-t border-[#f0ebe3] px-4 py-3 flex flex-col gap-3">

          {/* items table */}
          <div className="bg-white border border-[#ede8e0] rounded-xl overflow-hidden text-[12px]">
            <div className="grid grid-cols-[1fr_auto_auto_auto] px-3.5 py-2 border-b border-[#f0ebe3]">
              {["Item", "Meal", "Qty", "Price"].map((h, i) => (
                <span key={h} className={`text-[10px] font-bold text-[#9a8f82] uppercase tracking-wide
                  ${i === 0 ? "text-left" : i === 3 ? "text-right" : "text-center"}`}
                  style={{ minWidth: i === 0 ? undefined : i === 3 ? 52 : 40 }}>
                  {h}
                </span>
              ))}
            </div>
            {items.map((it, i) => (
              <div key={i} className={`grid grid-cols-[1fr_auto_auto_auto] items-center px-3.5 py-2.5
                ${i < items.length - 1 ? "border-b border-[#f9f5f0]" : ""}`}>
                <span className="text-[12px] font-semibold text-[#1c1812]">{it.name}</span>
                <span className="flex justify-center" style={{ minWidth: 40 }}>
                  <MealPill mealTime={it.mealTime ?? primaryMeal} />
                </span>
                <span className="text-[12px] text-[#5a5048] font-semibold text-center" style={{ minWidth: 40 }}>
                  ×{it.qty ?? 1}
                </span>
                <span className="text-[12px] font-bold text-[#1c1812] text-right" style={{ minWidth: 52 }}>
                  ₹{it.price * (it.qty ?? 1)}
                </span>
              </div>
            ))}
            <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#faf7f3] border-t border-[#ede8e0]">
              <span className="text-[12px] font-bold text-[#5a5048]">Total</span>
              <span className="text-[14px] font-extrabold text-[#c2620a]">₹{total}</span>
            </div>
          </div>

          {/* meta chips */}
          <div className="flex gap-2 flex-wrap">
            {[
              { label: "Order ID", val: order._id?.slice(-8).toUpperCase() ?? "—" },
              { label: "Mess",     val: order.messCode ?? "—" },
              { label: "Placed",   val: new Date(order.createdAt).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) },
            ].map(m => (
              <div key={m.label} className="bg-white border border-[#ede8e0] rounded-lg px-3 py-1.5 flex flex-col gap-0.5">
                <span className="text-[9px] font-bold text-[#9a8f82] uppercase tracking-wide">{m.label}</span>
                <span className="text-[11px] font-bold text-[#1c1812]">{m.val}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default MobileOrderCard;