import { useState } from "react";
import { Avatar, MealPill, StatusBadge } from "../Shared/SharedComponents";

/* ─── helpers ─────────────────────────────────────────────────────── */
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

/* ─── micro components ────────────────────────────────────────────── */
function MetaChip({ label, value, accent }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", gap: 3,
      background: "white",
      border: "1px solid #ede8e0",
      borderRadius: 10,
      padding: "8px 14px",
      minWidth: 0,
    }}>
      <span style={{
        fontSize: 9, fontWeight: 700, letterSpacing: 1,
        textTransform: "uppercase", color: "#b0a898",
        fontFamily: "'DM Mono', monospace",
      }}>
        {label}
      </span>
      <span style={{
        fontSize: 12.5, fontWeight: 700,
        color: accent ? "#c2620a" : "#1c1812",
        fontFamily: "'Fraunces', serif",
        lineHeight: 1.3,
      }}>
        {value}
      </span>
    </div>
  );
}

function AddressPin({ address }) {
  if (!address || address === "—") return (
    <span style={{ fontSize: 12, color: "#c2b8a9", fontStyle: "italic" }}>—</span>
  );
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 5, maxWidth: 180 }}>
      <svg width={12} height={12} viewBox="0 0 24 24" fill="none"
        stroke="#e07b39" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"
        style={{ flexShrink: 0, marginTop: 1 }}>
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
      <span style={{
        fontSize: 12, color: "#3d3228", lineHeight: 1.4,
        fontWeight: 500, wordBreak: "break-word",
      }}>
        {address}
      </span>
    </div>
  );
}

/* ─── row styles ──────────────────────────────────────────────────── */
const TD = ({ children, style = {}, ...rest }) => (
  <td style={{ padding: "13px 14px", verticalAlign: "middle", ...style }} {...rest}>
    {children}
  </td>
);

/* ─── main component ──────────────────────────────────────────────── */
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
  const userName    = user.name  ?? order.name ?? "—";
  const userEmail   = user.email ?? "—";
  const primaryMeal = items[0]?.mealTime ?? "Lunch";
  const status      = order.status ?? "Confirmed";

  /* status → accent colour for left border stripe */
  const stripeColor = {
    Confirmed:  "#4caf8a",
    Pending:    "#f5a623",
    Cancelled:  "#e05c5c",
    Delivered:  "#5b8dee",
  }[status] ?? "#c2b8a9";

  return (
    <>
      {/* ── Main row ─────────────────────────────────────────────── */}
      <tr
        onClick={() => setOpen(o => !o)}
        style={{
          cursor: "pointer",
          borderBottom: open ? "none" : "1px solid #f0ebe3",
          background: open ? "#fdf9f5" : "white",
          transition: "background .18s",
          animationDelay: `${index * 40}ms`,
          position: "relative",
        }}
        className="order-row"
      >
        {/* Status stripe + index */}
        <TD style={{ width: 52, padding: "13px 10px 13px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 3, height: 36, borderRadius: 4,
              background: stripeColor,
              flexShrink: 0,
            }} />
            <span style={{
              fontSize: 10, color: "#c2b8a9", fontWeight: 700,
              fontFamily: "'DM Mono', monospace", letterSpacing: .5,
            }}>
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
        </TD>

        {/* Customer */}
        <TD>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Avatar name={userName} />
            <div style={{ minWidth: 0 }}>
              <div style={{
                fontSize: 13, fontWeight: 700, color: "#1c1812",
                lineHeight: 1.25, fontFamily: "'Fraunces', serif",
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                maxWidth: 150,
              }}>
                {userName}
              </div>
              <div style={{ fontSize: 11, color: "#9a8f82", marginTop: 2, lineHeight: 1 }}>
                {userEmail}
              </div>
            </div>
          </div>
        </TD>

        {/* Meal tag */}
        <TD style={{ width: 90 }}>
          <MealPill mealTime={primaryMeal} />
        </TD>

        {/* Item(s) */}
        <TD>
          {items.length === 1 ? (
            <span style={{ fontSize: 13, color: "#1c1812", fontWeight: 600 }}>
              {items[0].name}
              {(items[0].qty ?? 1) > 1 &&
                <span style={{ color: "#9a8f82", marginLeft: 4, fontWeight: 400 }}>
                  ×{items[0].qty}
                </span>}
            </span>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 13, color: "#1c1812", fontWeight: 600 }}>
                {items[0].name}
              </span>
              <span style={{
                fontSize: 10, fontWeight: 700,
                background: "#fde0bc", color: "#c2620a",
                padding: "2px 7px", borderRadius: 100, flexShrink: 0,
              }}>
                +{items.length - 1}
              </span>
            </div>
          )}
        </TD>

        {/* Amount */}
        <TD style={{ textAlign: "right", width: 80 }}>
          <span style={{
            fontSize: 14, fontWeight: 800, color: "#1c1812",
            fontVariantNumeric: "tabular-nums",
            fontFamily: "'Fraunces', serif",
          }}>
            ₹{total}
          </span>
        </TD>

        {/* Address */}
        <TD style={{ maxWidth: 160 }}>
          <AddressPin address={order.address} />
        </TD>

        {/* Status badge */}
        <TD style={{ width: 110 }}>
          <StatusBadge status={status} />
        </TD>

        {/* Time */}
        <TD style={{ textAlign: "right", width: 90 }}>
          <div style={{
            fontSize: 12, color: "#1c1812", fontWeight: 600,
            fontFamily: "'DM Mono', monospace",
          }}>
            {formatTime(order.createdAt)}
          </div>
          <div style={{ fontSize: 10, color: "#c2b8a9", marginTop: 2 }}>
            {timeAgo(order.createdAt)}
          </div>
        </TD>

        {/* Expand chevron */}
        <TD style={{ width: 32, padding: "13px 14px 13px 4px" }}>
          <div style={{
            width: 22, height: 22, borderRadius: 6,
            border: "1px solid #ede8e0",
            display: "flex", alignItems: "center", justifyContent: "center",
            background: open ? "#f5ede3" : "transparent",
            transition: "background .18s",
          }}>
            <svg
              width={11} height={11} viewBox="0 0 24 24" fill="none"
              stroke={open ? "#c2620a" : "#b0a898"}
              strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"
              style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform .22s" }}
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
        </TD>
      </tr>

      {/* ── Expanded detail panel ──────────────────────────────────── */}
      {open && (
        <tr style={{ background: "#fdf9f5", borderBottom: "1px solid #f0ebe3" }}>
          <td colSpan={9} style={{ padding: "0 18px 18px 18px" }}>

            {/* indent to align under Customer name */}
            <div style={{
              marginLeft: 52 + 36 + 10, /* stripe+index + avatar + gap */
              display: "flex", flexDirection: "column", gap: 12,
            }}>

              {/* ── Items breakdown table ──────────────────── */}
              <div style={{
                background: "white",
                border: "1px solid #ede8e0",
                borderRadius: 12,
                overflow: "hidden",
                fontSize: 12,
                boxShadow: "0 1px 4px rgba(28,24,18,.04)",
              }}>
                {/* header */}
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 100px 60px 80px",
                  padding: "8px 16px",
                  borderBottom: "1px solid #f0ebe3",
                  background: "#faf7f3",
                  color: "#9a8f82", fontWeight: 700, fontSize: 10,
                  letterSpacing: .8, textTransform: "uppercase",
                  fontFamily: "'DM Mono', monospace",
                }}>
                  <span>Item</span>
                  <span style={{ textAlign: "center" }}>Meal</span>
                  <span style={{ textAlign: "center" }}>Qty</span>
                  <span style={{ textAlign: "right" }}>Price</span>
                </div>

                {/* rows */}
                {items.map((it, i) => (
                  <div key={i} style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 100px 60px 80px",
                    padding: "10px 16px",
                    borderBottom: i < items.length - 1 ? "1px solid #f6f2ed" : "none",
                    alignItems: "center",
                  }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#1c1812", fontFamily: "'Fraunces', serif" }}>
                      {it.name}
                    </span>
                    <span style={{ textAlign: "center" }}>
                      <MealPill mealTime={it.mealTime ?? primaryMeal} />
                    </span>
                    <span style={{ textAlign: "center", fontSize: 13, color: "#5a5048", fontWeight: 600 }}>
                      ×{it.qty ?? 1}
                    </span>
                    <span style={{ textAlign: "right", fontWeight: 700, color: "#1c1812", fontSize: 13 }}>
                      ₹{it.price * (it.qty ?? 1)}
                    </span>
                  </div>
                ))}

                {/* total */}
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  padding: "10px 16px",
                  background: "#faf7f3",
                  borderTop: "1px solid #ede8e0",
                }}>
                  <span style={{
                    fontSize: 11, fontWeight: 700, color: "#9a8f82",
                    textTransform: "uppercase", letterSpacing: .6,
                    fontFamily: "'DM Mono', monospace",
                  }}>
                    Order Total
                  </span>
                  <span style={{
                    fontWeight: 800, color: "#c2620a", fontSize: 15,
                    fontFamily: "'Fraunces', serif",
                  }}>
                    ₹{total}
                  </span>
                </div>
              </div>

              {/* ── Meta chips row ────────────────────────── */}
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "stretch" }}>
                <MetaChip
                  label="Order ID"
                  value={`#${order._id?.slice(-8).toUpperCase() ?? "—"}`}
                  accent
                />
                <MetaChip
                  label="Mess"
                  value={order.messCode ?? "—"}
                />
                <MetaChip
                  label="Placed"
                  value={new Date(order.createdAt).toLocaleString("en-IN", {
                    day: "numeric", month: "short",
                    hour: "2-digit", minute: "2-digit",
                  })}
                />
                {/* Address chip — wider */}
                <div style={{
                  display: "flex", flexDirection: "column", gap: 3,
                  background: "white",
                  border: "1px solid #ede8e0",
                  borderRadius: 10,
                  padding: "8px 14px",
                  flex: "1 1 180px",
                  maxWidth: 280,
                }}>
                  <span style={{
                    fontSize: 9, fontWeight: 700, letterSpacing: 1,
                    textTransform: "uppercase", color: "#b0a898",
                    fontFamily: "'DM Mono', monospace",
                    display: "flex", alignItems: "center", gap: 4,
                  }}>
                    <svg width={9} height={9} viewBox="0 0 24 24" fill="none"
                      stroke="#e07b39" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                    Delivery Address
                  </span>
                  <span style={{
                    fontSize: 12.5, fontWeight: 600,
                    color: "#1c1812", lineHeight: 1.45,
                  }}>
                    {order.address ?? "—"}
                  </span>
                </div>
              </div>

            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default OrderRow;