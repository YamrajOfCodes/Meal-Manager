import { useState, useEffect, useRef } from "react";
import MenuPage from "./Subpages/Menu/MenuPage";
import CartPage from "./Subpages/Cart/CartPage";
import OrdersPage from "./Subpages/Order/OrdersPage";
import ComplaintsPage from "./Subpages/Complaints/ComplaintsPage";
import OverViewPage from "./Subpages/OverView/OverViewPage";
import { useGetComplaints, useGetMenuItems, useGetMyOrders, usePlaceOrder, useRaiseComplaint } from "../../hooks/User/userHooks";
import { jwtDecode } from "jwt-decode";
import { useGetNotices } from "../../hooks/Admin/adminHooks";

/* ─────────────────────────────────────────────
   MOCK API DATA  (matches your API shape exactly)
   In prod: replace with  fetch('/api/menu?messCode=OM01')
───────────────────────────────────────────── */
const MOCK_MENU = [
  { _id: "69e49708dcaf1ec8caebad89", messCode: "OM01", name: "Chai",         price: 15,  isVeg: true,  mealTime: "Breakfast" },
  { _id: "69e49708dcaf1ec8caebad90", messCode: "OM01", name: "Poha",         price: 40,  isVeg: true,  mealTime: "Breakfast" },
  { _id: "69e49708dcaf1ec8caebad91", messCode: "OM01", name: "Bread Butter", price: 30,  isVeg: true,  mealTime: "Breakfast" },
  { _id: "69e49708dcaf1ec8caebad92", messCode: "OM01", name: "Dal Tadka",    price: 60,  isVeg: true,  mealTime: "Lunch"     },
  { _id: "69e49708dcaf1ec8caebad93", messCode: "OM01", name: "Jeera Rice",   price: 50,  isVeg: true,  mealTime: "Lunch"     },
  { _id: "69e49708dcaf1ec8caebad94", messCode: "OM01", name: "Roti (x3)",    price: 30,  isVeg: true,  mealTime: "Lunch"     },
  { _id: "69e49708dcaf1ec8caebad95", messCode: "OM01", name: "Chicken Curry",price: 120, isVeg: false, mealTime: "Lunch"     },
  { _id: "69e49708dcaf1ec8caebad96", messCode: "OM01", name: "Paneer Masala",price: 90,  isVeg: true,  mealTime: "Dinner"    },
  { _id: "69e49708dcaf1ec8caebad97", messCode: "OM01", name: "Rajma Rice",   price: 70,  isVeg: true,  mealTime: "Dinner"    },
  { _id: "69e49708dcaf1ec8caebad98", messCode: "OM01", name: "Egg Bhurji",   price: 55,  isVeg: false, mealTime: "Dinner"    },
  { _id: "69e49708dcaf1ec8caebad99", messCode: "OM01", name: "Cold Coffee",  price: 45,  isVeg: true,  mealTime: "Snacks"    },
  { _id: "69e49708dcaf1ec8caebad9a", messCode: "OM01", name: "Samosa (x2)",  price: 20,  isVeg: true,  mealTime: "Snacks"    },
];

const MEAL_ORDER = ["Breakfast", "Lunch", "Snacks", "Dinner"];
const MEAL_EMOJI = { Breakfast:"☀️", Lunch:"🍛", Snacks:"🫖", Dinner:"🌙" };

const COMPLAINT_CATS = [
  "Food Quality","Late Delivery","Quantity Issue",
  "Hygiene Concern","Wrong Item","Other",
];

/* ── animated balance counter ── */
function CountUp({ value, prefix = "₹" }) {
  const [display, setDisplay] = useState(value);
  const prev = useRef(value);
  useEffect(() => {
    if (prev.current === value) return;
    const from = prev.current;
    const to   = value;
    const dur  = 700;
    const t0   = performance.now();
    const raf  = (now) => {
      const p    = Math.min((now - t0) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(from + (to - from) * ease));
      if (p < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
    prev.current = value;
  }, [value]);
  return <>{prefix}{display}</>;
}

/* ── svg icon helper ── */
export function Ic({ d, s = 16, c = "currentColor", sw = 1.9 }) {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none"
      stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      {[].concat(d).map((p, i) => <path key={i} d={p} />)}
    </svg>
  );
}

/* ── veg indicator (FSSAI style square) ── */
function VegBox({ isVeg }) {
  return (
    <span className={`inline-flex items-center justify-center w-[18px] h-[18px] rounded-[3px] border-2 shrink-0
      ${isVeg ? "border-green-600" : "border-red-600"}`}>
      <span className={`w-[8px] h-[8px] rounded-full ${isVeg ? "bg-green-600" : "bg-red-600"}`} />
    </span>
  );
}

/* ═══════════════════════════════════════════════
   ROOT COMPONENT
═══════════════════════════════════════════════ */
export default function UserDashboard() {


   const token = localStorage.getItem("login");
   let decoded, messCode;
   try {
     decoded = jwtDecode(token);
     messCode = decoded?.messCode;
   } catch (error) {
     console.error("Failed to decode token:", error);
     messCode = null; // or some default
   }



  const [tab,        setTab]        = useState("home");
  const [menu,       setMenu]       = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [mealFilter, setMealFilter] = useState("All");
  const [vegOnly,    setVegOnly]    = useState(false);
  const [cart,       setCart]       = useState({});        // { _id: qty }
  const [balance,    setBalance]    = useState(0);
  const [orders,     setOrders]     = useState([]);
  // const [complaints, setComplaints] = useState([]);
  const [cForm,      setCForm]      = useState({ cat:"", desc:"", messCode,date:new Date().toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" }),status:"open",userId:decoded._id });
  const [cDone,      setCDone]      = useState(false);
  const [toast,      setToast]      = useState(null);

   
  //  console.log(messCode)

  const { data: fetchedMenu = [], isLoading: menuLoading } = useGetMenuItems(messCode);
  const {data:complaints} = useGetComplaints(messCode);
  const { mutate: placeOrderMutation } = usePlaceOrder();
  const {mutate:raiseComplaint} = useRaiseComplaint();
  const {data:getNotices} = useGetNotices(messCode);
  const { data: myOrders = [] } = useGetMyOrders(decoded?._id);
  const totalPrice = myOrders[0]?.userId?.payment || 0;

  // console.log(complaintss);

 

  /* ── toast ── */
  const fire = (msg, type = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2600);
  };

  /* ── cart utils ── */
  const inc = id => setCart(c => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const dec = id => setCart(c => {
    const n = { ...c };
    if (n[id] > 1) n[id]--; else delete n[id];
    return n;
  });
  const clear = () => setCart({});

  const cartRows  = Object.entries(cart)
    .map(([id, qty]) => ({ item: menu.find(m => m._id === id), qty }))
    .filter(x => x.item);
  const cartTotal = cartRows.reduce((s, { item, qty }) => s + item.price * qty, 0);
  const cartCount = Object.values(cart).reduce((s, q) => s + q, 0);

  /* ── place order ── */
const placeOrder = () => {
  if (!cartRows.length) return;

  const id = decoded?._id || "UnknownUser";
  const now = new Date();

  // console.log("Placing order for user ID:", id);

  let data = 
    {
      userId: id,   // ✅ works now
      messCode: decoded?.messCode,
      items: cartRows.map(({ item, qty }) => ({
        name: item.name,
        qty,
        price: item.price
      })),
      total: cartTotal,
      time: now.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit"
      }),
      date: now.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short"
      }),
      status: "Confirmed",
      mealTime: cartRows[0].item.mealTime, // assuming all items are from the same meal time
    }

    // console.log(data.items[0])
  

  placeOrderMutation(data);
  // console.log(data)
  setCart({});

  setBalance(b => b + cartTotal);
  fire(`Order placed! ₹${cartTotal} added to balance.`);
  setTab("orders");
};


  /* ── complaint submit ── */
  const submitC = () => {
    if (!cForm.cat || !cForm.desc.trim()) return;
    // setComplaints(prev => [{
    //   userId:      decoded._id,
    //   messCode:messCode,
    //   cat:     cForm.cat,
    //   desc:    cForm.desc,
    //   date:    new Date().toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" }),
    //   status:  "Open",
    // },]);
    setCForm({ cat:"", desc:"", orderId:"" });
    raiseComplaint(cForm)
    setCDone(true);
    setTimeout(() => setCDone(false), 2500);
    fire("Complaint submitted. We'll respond within 24 hrs.", "info");
  };

  /* ── filtered + grouped menu ── */
const visible = menu.filter(m =>
  (mealFilter === "All" ||
   m.mealTime?.toLowerCase().trim() === mealFilter.toLowerCase()) &&
  (!vegOnly || m.isVeg)
);

const grouped = MEAL_ORDER.reduce((acc, meal) => {
  const items = visible.filter(
    m => m.mealTime?.toLowerCase().trim() === meal.toLowerCase()
  );

  if (items.length) acc[meal] = items;
  return acc;
}, {});

  const today = new Date().toLocaleDateString("en-IN", {
    weekday:"long", day:"numeric", month:"long",
  });

  useEffect(() => {
  if (!menuLoading && fetchedMenu.length > 0) {
    setMenu(fetchedMenu);
    setLoading(false);
  }
}, [fetchedMenu, menuLoading]);

  /* ─────────────── NAV ITEMS ─────────────── */
  const NAV = [
    { key:"home",       label:"Home",      d:"M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" },
    { key:"menu",       label:"Menu",     d:"M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" },
    { key:"cart",       label:"Cart",      d:["M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z","M3 6h18","M16 10a4 4 0 01-8 0"] },
    { key:"orders",     label:"Orders",    d:["M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z","M14 2v6h6","M16 13H8","M16 17H8","M10 9H8"] },
    { key:"complaints", label:"Help",      d:"M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" },
  ];

  /* ─────────────── RENDER ─────────────── */
  return (
    <div className="min-h-screen bg-[#f6f3ef]" style={{fontFamily:"'Outfit',sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,600;1,400&family=Outfit:wght@400;500;600;700&display=swap');
        *{box-sizing:border-box;}
        body{margin:0;}
        .card{background:#fff;border:1px solid #ebe6de;border-radius:16px;box-shadow:0 1px 3px rgba(0,0,0,.05),0 6px 20px rgba(0,0,0,.04);}
        .card-hd{padding:16px 20px;border-bottom:1px solid #ebe6de;display:flex;align-items:center;justify-content:space-between;}
        @keyframes slideUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
        @keyframes popIn{from{opacity:0;transform:scale(.88)}to{opacity:1;transform:scale(1)}}
        @keyframes toastUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
        .slide{animation:slideUp .32s cubic-bezier(.22,1,.36,1) both}
        .pop{animation:popIn .22s cubic-bezier(.34,1.56,.64,1) both}
        .toast-anim{animation:toastUp .28s ease both}
        .tab-d:not(.tab-a){color:#9a8f82}
        .tab-d:not(.tab-a):hover{color:#5a5048;background:#faf8f5}
        .tab-a{color:#c2620a;border-bottom:2px solid #c2620a;font-weight:600}
        .chip-btn{padding:6px 14px;border-radius:100px;font-size:12px;font-weight:600;cursor:pointer;border:1px solid #ebe6de;background:#fff;color:#9a8f82;transition:.12s}
        .chip-btn:hover{border-color:#ddd6cb;color:#5a5048}
        .chip-btn.on{background:#fff4e8;color:#c2620a;border-color:#fde0bc}
        input,textarea,select{outline:none}
        input:focus,textarea:focus,select:focus{border-color:#c2620a!important;box-shadow:0 0 0 3px rgba(194,98,10,.1)}
        .qty-ring{width:30px;height:30px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:700;cursor:pointer;transition:.12s;border:none;background:transparent}
        .row-hover:hover{background:#faf8f5}
        @media(max-width:768px){
          .desk{display:none!important}
          .page-wrap{padding:16px 14px 88px!important}
        }
        @media(min-width:769px){.mob{display:none!important}}
      `}</style>

      {/* ════════════════ TOP BAR ════════════════ */}
     {/* ════ DESKTOP HEADER ════ */}
<header className="desk" style={{
  position:"sticky", top:0, zIndex:40,
  background:"#fff",
  borderBottom:"1px solid #ece6de",
  height:60,
  display:"flex",
  alignItems:"stretch",
  fontFamily:"'DM Sans',sans-serif",
}}>

  {/* Brand */}
  <div style={{
    display:"flex", alignItems:"center", gap:11,
    padding:"0 22px",
    borderRight:"1px solid #ece6de",
    flexShrink:0, minWidth:180,
  }}>
    <div style={{
      width:34, height:34, borderRadius:9,
      background:"#c2620a",
      display:"flex", alignItems:"center", justifyContent:"center",
      flexShrink:0,
    }}>
      <Ic d="M3 11h18M3 7h18M7 3h10M5 11v8a2 2 0 002 2h10a2 2 0 002-2v-8"
          s={16} c="white" sw={2.2}/>
    </div>
    <div>
      <p style={{
        fontFamily:"'Syne',sans-serif",
        fontSize:15, fontWeight:600,
        color:"#1a1410", letterSpacing:"-.02em",
        lineHeight:1, margin:0,
      }}>Patil Mess</p>
      <div style={{display:"flex", alignItems:"center", gap:5, marginTop:3}}>
        <span style={{
          width:6, height:6, borderRadius:"50%",
          background:"#16a34a", display:"inline-block",
          animation:"pulse 2s ease infinite",
        }}/>
        {["OM01","Pune"].map(t => (
          <span key={t} style={{
            fontSize:9.5, fontWeight:500,
            background:"#f3ede6", color:"#6b5f54",
            padding:"1px 6px", borderRadius:100,
          }}>{t}</span>
        ))}
      </div>
    </div>
  </div>

  {/* Nav Tabs */}
  <nav style={{display:"flex", alignItems:"stretch", flex:1, padding:"0 6px"}}>
    {NAV.map(n => (
      <button key={n.key}
        onClick={() => setTab(n.key)}
        style={{
          display:"flex", alignItems:"center", gap:7,
          padding:"0 16px",
          fontSize:13,
          fontWeight: tab===n.key ? 500 : 400,
          color: tab===n.key ? "#c2620a" : "#b5a99e",
          background:"none", border:"none",
          borderBottom: tab===n.key ? "2px solid #c2620a" : "2px solid transparent",
          cursor:"pointer",
          transition:"color .15s",
          position:"relative",
          whiteSpace:"nowrap",
          fontFamily:"'DM Sans',sans-serif",
        }}>
        {/* Icon pill */}
        <span style={{
          width:26, height:26, borderRadius:7,
          display:"flex", alignItems:"center", justifyContent:"center",
          background: tab===n.key ? "#fff4e8" : "transparent",
          transition:"background .15s",
          flexShrink:0,
        }}>
          <Ic d={n.d} s={14}
            c={tab===n.key ? "#c2620a" : "#b5a99e"}
            sw={tab===n.key ? 2.1 : 1.8}/>
        </span>
        {n.label}
        {/* Cart badge */}
        {n.key==="cart" && cartCount>0 && (
          <span className="pop" style={{
            position:"absolute", top:11, right:6,
            minWidth:17, height:17, borderRadius:100,
            background:"#dc2626", color:"#fff",
            fontSize:9, fontWeight:600,
            display:"flex", alignItems:"center", justifyContent:"center",
            padding:"0 4px",
          }}>{cartCount}</span>
        )}
        {/* Help dot */}
        {n.key==="complaints" && complaints.filter(c=>c.status==="open").length>0 && (
          <span style={{
            position:"absolute", top:13, right:9,
            width:7, height:7, borderRadius:"50%",
            background:"#dc2626",
            border:"2px solid #fff",
          }}/>
        )}
      </button>
    ))}
  </nav>

  {/* Right Actions */}
  <div style={{
    display:"flex", alignItems:"center", gap:8,
    padding:"0 16px",
    borderLeft:"1px solid #ece6de",
    flexShrink:0,
  }}>
    {/* Due chip */}
    <div onClick={()=>setTab("orders")} style={{
      display:"flex", alignItems:"center", gap:8,
      padding:"6px 12px 6px 8px",
      borderRadius:10,
      border:"1px solid #fddcb5",
      background:"#fff4e8",
      cursor:"pointer",
    }}>
      <div style={{
        width:26, height:26, borderRadius:7,
        background:"#c2620a",
        display:"flex", alignItems:"center", justifyContent:"center",
        flexShrink:0,
      }}>
        <Ic d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"
            s={13} c="white" sw={2.2}/>
      </div>
      <div>
        <p style={{fontSize:9.5, color:"#c2620a", opacity:.7, lineHeight:1, margin:0}}>
          Amount Due
        </p>
        <p style={{
          fontSize:13.5, fontWeight:600, color:"#c2620a",
          lineHeight:1, margin:"2px 0 0",
          fontFamily:"'Syne',sans-serif",
        }}>
          <CountUp value={totalPrice}/>
        </p>
      </div>
    </div>

    {/* separator */}
    <div style={{width:1, height:22, background:"#ece6de"}}/>

    {/* Cart button */}
    <button onClick={()=>setTab("cart")} style={{
      display:"flex", alignItems:"center", gap:7,
      padding:"8px 16px", borderRadius:10,
      background:"#c2620a", color:"#fff",
      fontSize:13, fontWeight:500,
      border:"none", cursor:"pointer",
      fontFamily:"'DM Sans',sans-serif",
    }}>
      <Ic d={["M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z","M3 6h18","M16 10a4 4 0 01-8 0"]}
          s={14} c="white"/>
      Cart
      {cartCount>0 && (
        <span className="pop" style={{
          minWidth:18, height:18, borderRadius:100,
          background:"#fff", color:"#c2620a",
          fontSize:10, fontWeight:700,
          display:"flex", alignItems:"center", justifyContent:"center",
          padding:"0 4px",
        }}>{cartCount}</span>
      )}
    </button>

    {/* separator */}
    <div style={{width:1, height:22, background:"#ece6de"}}/>

    {/* Avatar */}
    <div style={{
      width:34, height:34, borderRadius:"50%",
      background:"#f3ede6",
      border:"1.5px solid #ece6de",
      display:"flex", alignItems:"center", justifyContent:"center",
      fontSize:11, fontWeight:600, color:"#6b5f54",
      cursor:"pointer",
      fontFamily:"'Syne',sans-serif",
      flexShrink:0,
    }}>RS</div>
  </div>
</header>

      {/* ════════════════ TOAST ════════════════ */}
      {toast && (
        <div className={`toast-anim fixed bottom-24 left-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-lg text-[13px] font-semibold text-white`}
          style={{transform:"translateX(-50%)", background: toast.type==="info"?"#1d5fa6":"#1a7f5a"}}>
          <Ic d={toast.type==="info"
            ? "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
            : "M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3"
          } s={15} c="white"/>
          {toast.msg}
        </div>
      )}

      {/* ════════════════ PAGE ════════════════ */}
      <main className="page-wrap" style={{padding:"24px 28px 96px"}}>

        {/* ─────────── HOME ─────────── */}
        {tab==="home" && (
          <OverViewPage
          balance={balance}
          orders={myOrders}
          complaints={complaints}
          today={today}
          setTab={setTab}
          Today={today}
          CountUp={CountUp}
          Ic={Ic}
          loading={loading}
          menu={menu}
          vegOnly={vegOnly}
          VegBox={VegBox}
          cart={cart}
          notices={getNotices}
          />
        )}

        {/* ─────────── MENU / ORDER ─────────── */}
        {tab==="menu" && (
          <MenuPage
          MEAL_EMOJI={MEAL_EMOJI}
          MEAL_ORDER={MEAL_ORDER}
            grouped={grouped}
            mealFilter={mealFilter} setMealFilter={setMealFilter}
            vegOnly={vegOnly} setVegOnly={setVegOnly}
            cart={cart} inc={inc} dec={dec}
            VegBox={VegBox}
            cartCount={cartCount}
            cartTotal={cartTotal}
            loading={menuLoading}
            setTab={setTab}
          />
        )}

        {/* ─────────── CART ─────────── */}
        {tab==="cart" && (
          <CartPage
          balance={balance}
          cartCount={cartCount}
          cartTotal={cartTotal}
          cartRows={cartRows}
          placeOrder={placeOrder}
          clear={clear}
          VegBox={VegBox}
          IC={Ic}
          setTab={setTab}
          dec={dec}
          />
        )}

        {/* ─────────── MY ORDERS ─────────── */}
        {tab==="orders" && (
         <OrdersPage
         balance={balance}
         orders={myOrders}
         CountUp={CountUp}
         />
        )}

        {/* ─────────── COMPLAINTS ─────────── */}
        {tab==="complaints" && (
          <ComplaintsPage
          COMPLAINT_CATS={COMPLAINT_CATS}
          cDone={cDone}
          cForm={cForm}
          complaints={complaints}
          setCForm={setCForm}
          submitC={submitC}
          orders={orders}
          Ic={Ic}
          />
        )}

      </main>

      {/* ════════════════ MOBILE BOTTOM NAV ════════════════ */}
      {/* ════ MOBILE BOTTOM NAV ════ */}
<nav className="mob" style={{
  position:"fixed", bottom:0, left:0, right:0,
  background:"#fff",
  borderTop:"1px solid #ece6de",
  zIndex:40,
  padding:`6px 8px calc(6px + env(safe-area-inset-bottom,0px))`,
}}>
  <div style={{
    display:"flex", gap:2,
    background:"#faf8f5",
    borderRadius:14, padding:4,
  }}>
    {NAV.map(n => (
      <button key={n.key}
        onClick={() => setTab(n.key)}
        style={{
          flex:1,
          display:"flex", flexDirection:"column", alignItems:"center", gap:3,
          padding:"7px 4px",
          borderRadius:10,
          border:"none",
          background: tab===n.key ? "#fff4e8" : "none",
          cursor:"pointer",
          transition:"background .15s",
          position:"relative",
          fontFamily:"'DM Sans',sans-serif",
        }}>
        {n.key==="cart" && cartCount>0 && (
          <span className="pop" style={{
            position:"absolute", top:4, right:"calc(50% - 18px)",
            minWidth:15, height:15, borderRadius:100,
            background:"#dc2626", color:"#fff",
            fontSize:8.5, fontWeight:600,
            display:"flex", alignItems:"center", justifyContent:"center",
            padding:"0 3px",
            border:"1.5px solid #fff",
          }}>{cartCount}</span>
        )}
        {n.key==="complaints" && complaints.filter(c=>c.status==="Open").length>0 && tab!=="complaints" && (
          <span style={{
            position:"absolute", top:5, right:"calc(50% - 16px)",
            width:7, height:7, borderRadius:"50%",
            background:"#dc2626",
            border:"1.5px solid #fff",
          }}/>
        )}
        <Ic d={n.d} s={20}
          c={tab===n.key ? "#c2620a" : "#b5a99e"}
          sw={tab===n.key ? 2.1 : 1.7}/>
        <span style={{
          fontSize:9, fontWeight:500,
          color: tab===n.key ? "#c2620a" : "#b5a99e",
          letterSpacing:".03em",
          textTransform:"uppercase",
        }}>{n.label}</span>
      </button>
    ))}
  </div>
</nav>
    </div>
  );
}