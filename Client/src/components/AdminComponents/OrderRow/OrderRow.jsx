import { useState } from "react";
import { Avatar, MealPill, StatusBadge } from "../Shared/SharedComponents";

/* ─── helpers ───────────────────────────────────────────────────── */
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

/* ─── shared td ─────────────────────────────────────────────────── */
const TD = ({ children, style = {}, ...rest }) => (
  <td style={{ padding: "12px 14px", verticalAlign: "middle", ...style }} {...rest}>
    {children}
  </td>
);

/* ─── main component ─────────────────────────────────────────────── */
function OrderRow({ order, index }) {
  const [open, setOpen] = useState(false);

  const items = order.items ?? [{
    name:     order.name,
    price:    order.price,
    mealTime: order.mealTime,
    qty:      order.qty ?? 1,
  }];

  const total       = items.reduce((s, it) => s + it.price * (it.qty ?? 1), 0);
  const user        = order.userId ?? {};
  const userName    = user.name  ?? order.name  ?? "—";
  const userEmail   = user.email ?? "—";
  const primaryMeal = items[0]?.mealTime ?? "Lunch";
  const status      = order.status ?? "Confirmed";

  return (
    <>
      {/* ── Main row ─────────────────────────────────────── */}
      <tr
        onClick={() => setOpen(o => !o)}
        className="ord-row"
        style={{
          cursor: "pointer",
          borderBottom: open ? "none" : "1px solid #eae4dc",
          background: open ? "#faf8f5" : "white",
          transition: "background .15s",
          animationDelay: `${index * 30}ms`,
        }}
      >
        {/* Index */}
        <TD style={{ width: 40 }}>
          <span style={{ fontSize: 11, color: "#c2b8a9", fontWeight: 500 }}>
            {String(index + 1).padStart(2, "0")}
          </span>
        </TD>

        {/* Customer */}
        <TD>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <Avatar name={userName} />
            <div style={{ minWidth: 0 }}>
              <div style={{
                fontSize: 13, fontWeight: 600, color: "#1c1812",
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                maxWidth: 160, lineHeight: 1.3,
              }}>
                {userName}
              </div>
              <div style={{ fontSize: 11, color: "#9a9086", marginTop: 1 }}>
                {userEmail}
              </div>
            </div>
          </div>
        </TD>

        {/* Meal */}
        <TD style={{ width: 100 }}>
          <MealPill mealTime={primaryMeal} />
        </TD>

        {/* Items */}
        <TD>
          <span style={{ fontSize: 13, color: "#1c1812", fontWeight: 500 }}>
            {items[0].name}
            {(items[0].qty ?? 1) > 1 &&
              <span style={{ color: "#9a9086", marginLeft: 3, fontWeight: 400 }}>×{items[0].qty}</span>}
          </span>
          {items.length > 1 && (
            <span style={{
              marginLeft: 6, fontSize: 10, fontWeight: 600,
              background: "#fde0bc", color: "#b85c14",
              padding: "2px 6px", borderRadius: 100,
            }}>
              +{items.length - 1}
            </span>
          )}
        </TD>

        {/* Amount */}
        <TD style={{ textAlign: "right", width: 80 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#1c1812" }}>
            ₹{total.toLocaleString("en-IN")}
          </span>
        </TD>

        {/* Address */}
        <TD style={{ maxWidth: 160 }}>
          {order.address ? (
            <div style={{ display: "flex", alignItems: "flex-start", gap: 4 }}>
              <svg width={12} height={12} viewBox="0 0 24 24" fill="none"
                stroke="#9a9086" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
                style={{ flexShrink: 0, marginTop: 1 }}>
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <span style={{ fontSize: 12, color: "#5a5048", lineHeight: 1.4 }}>
                {order.address}
              </span>
            </div>
          ) : (
            <span style={{ fontSize: 12, color: "#c2b8a9" }}>—</span>
          )}
        </TD>

        {/* Status */}
        <TD style={{ width: 110 }}>
          <StatusBadge status={status} />
        </TD>

        {/* Time */}
        <TD style={{ textAlign: "right", width: 88 }}>
          <div style={{ fontSize: 12, fontWeight: 500, color: "#1c1812" }}>
            {formatTime(order.createdAt)}
          </div>
          <div style={{ fontSize: 11, color: "#9a9086", marginTop: 1 }}>
            {timeAgo(order.createdAt)}
          </div>
        </TD>

        {/* Chevron */}
        <TD style={{ width: 36, padding: "12px 14px 12px 4px" }}>
          <div style={{
            width: 24, height: 24, borderRadius: 5,
            border: "1px solid #e4ddd5",
            display: "flex", alignItems: "center", justifyContent: "center",
            background: open ? "#f5f2ef" : "transparent",
            transition: "background .15s",
          }}>
            <svg width={11} height={11} viewBox="0 0 24 24" fill="none"
              stroke={open ? "#3d3228" : "#b0a898"}
              strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"
              style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .2s" }}>
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </div>
        </TD>
      </tr>

      {/* ── Expanded panel ───────────────────────────────── */}
      {open && (
        <tr style={{ background: "#faf8f5", borderBottom: "1px solid #eae4dc" }}>
          <td colSpan={9} style={{ padding: "0 16px 16px 16px" }}>
            <div style={{
              marginLeft: 40 + 32 + 9, /* index col + avatar + gap */
              display: "flex", flexDirection: "column", gap: 10,
            }}>

              {/* Items breakdown */}
              <div style={{
                background: "white",
                border: "1px solid #e4ddd5",
                borderRadius: 8,
                overflow: "hidden",
                fontSize: 12,
              }}>
                {/* header */}
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 90px 50px 70px",
                  padding: "7px 14px",
                  background: "#faf8f5",
                  borderBottom: "1px solid #eae4dc",
                  fontSize: 10, fontWeight: 600, color: "#9a9086",
                  textTransform: "uppercase", letterSpacing: ".06em",
                }}>
                  <span>Item</span>
                  <span style={{ textAlign: "center" }}>Meal</span>
                  <span style={{ textAlign: "center" }}>Qty</span>
                  <span style={{ textAlign: "right" }}>Price</span>
                </div>

                {items.map((it, i) => (
                  <div key={i} style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 90px 50px 70px",
                    padding: "9px 14px",
                    borderBottom: i < items.length - 1 ? "1px solid #f0ebe3" : "none",
                    alignItems: "center",
                  }}>
                    <span style={{ fontSize: 13, fontWeight: 500, color: "#1c1812" }}>{it.name}</span>
                    <span style={{ textAlign: "center" }}>
                      <MealPill mealTime={it.mealTime ?? primaryMeal} />
                    </span>
                    <span style={{ textAlign: "center", fontSize: 12, color: "#6b6058" }}>×{it.qty ?? 1}</span>
                    <span style={{ textAlign: "right", fontWeight: 600, color: "#1c1812", fontSize: 13 }}>
                      ₹{(it.price * (it.qty ?? 1)).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}

                {/* Total row */}
                <div style={{
                  display: "grid", gridTemplateColumns: "1fr auto",
                  padding: "8px 14px",
                  background: "#faf8f5", borderTop: "1px solid #eae4dc",
                }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "#9a9086", textTransform: "uppercase", letterSpacing: ".06em" }}>
                    Total
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#1c1812" }}>
                    ₹{total.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Meta row */}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {[
                  { label: "Order ID", value: `#${order._id?.slice(-8).toUpperCase() ?? "—"}` },
                  { label: "Mess",     value: order.messCode ?? "—" },
                  { label: "Placed",   value: new Date(order.createdAt).toLocaleString("en-IN", {
                      day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
                    }) },
                  { label: "Address",  value: order.address ?? "—" },
                ].map(m => (
                  <div key={m.label} style={{
                    background: "white", border: "1px solid #e4ddd5",
                    borderRadius: 7, padding: "7px 12px",
                    display: "flex", flexDirection: "column", gap: 2,
                  }}>
                    <span style={{
                      fontSize: 10, fontWeight: 600, color: "#9a9086",
                      textTransform: "uppercase", letterSpacing: ".06em",
                    }}>
                      {m.label}
                    </span>
                    <span style={{ fontSize: 12, fontWeight: 500, color: "#1c1812" }}>
                      {m.value}
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

export default OrderRow;