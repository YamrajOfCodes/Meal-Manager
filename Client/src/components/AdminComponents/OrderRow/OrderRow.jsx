import { useState } from "react";
import { Avatar, MealPill, StatusBadge } from "../Shared/SharedComponents";

function OrderRow({ order, index }) {
  const [open, setOpen] = useState(false);


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

  console.log(new Date(order.createdAt).toLocaleString("en-IN", {
    day: "numeric", month: "short", hour: "2-digit", minute: "2-digit"
  }) < new Date().toLocaleString("en-IN", {
    day: "numeric", month: "short", hour: "2-digit", minute: "2-digit"
  }))


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
                     { label:"Address",     val: order?.address ?? "—" },
                    
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

export default OrderRow;