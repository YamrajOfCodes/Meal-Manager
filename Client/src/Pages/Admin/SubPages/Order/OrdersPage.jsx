import { useState } from "react";
import { Avatar, CardHead, CardWrap, Pill } from "../../../../components/AdminComponents/Shared/SharedComponents";

function OrdersPage() {

  const ORDERS = [
  { name:"Rahul Patil",     room:"B-204", meals:"Lunch + Dinner", amount:"₹3,200", status:"paid",    av:"RP", hue:"#c2620a" },
  { name:"Sneha Desai",    room:"A-102", meals:"Lunch only",     amount:"₹1,800", status:"due",     av:"SD", hue:"#7c3aed" },
  { name:"Arjun Mehta",    room:"C-310", meals:"Lunch + Dinner", amount:"₹900",   status:"paid",    av:"AM", hue:"#1a7f5a" },
  { name:"Priya Sharma",   room:"B-105", meals:"Dinner only",    amount:"₹1,500", status:"partial", av:"PS", hue:"#db2777" },
  { name:"Karan Joshi",    room:"D-401", meals:"Lunch + Dinner", amount:"₹180",   status:"paid",    av:"KJ", hue:"#1d5fa6" },
  { name:"Meera Kulkarni", room:"A-208", meals:"Lunch + Dinner", amount:"₹3,200", status:"due",     av:"MK", hue:"#c2620a" },
];




  const [orderTab, setOrderTab] = useState("All");
  const filtered = orderTab === "Paid" ? ORDERS.filter(o => o.status === "paid")
    : orderTab === "Due" ? ORDERS.filter(o => o.status === "due" || o.status === "partial")
    : ORDERS;

  return (
    <CardWrap>
      <CardHead title="Today's Orders" sub={`${ORDERS.length} customers`} />
      <div className="flex gap-0 px-5 border-b border-[#e8e2d9]">
        {["All","Paid","Due"].map(t => (
          <button
            key={t}
            onClick={() => setOrderTab(t)}
            className={`text-xs font-medium px-3.5 py-2.5 border-b-2 transition-all whitespace-nowrap cursor-pointer bg-transparent ${
              orderTab === t
                ? "text-[#c2620a] border-[#c2620a] font-semibold"
                : "text-[#9a8f82] border-transparent hover:text-[#1a1510]"
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      <div>
        {filtered.map(o => (
          <div key={o.name} className="flex items-center gap-3 px-5 py-3 border-b border-[#e8e2d9] last:border-0 hover:bg-[#faf8f5] transition-colors">
            <Avatar initials={o.av} hue={o.hue} />
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold text-[#1a1510]">{o.name}</div>
              <div className="text-[11px] text-[#9a8f82] mt-0.5">{o.room} · {o.meals}</div>
            </div>
            <div className="text-[13px] font-bold text-[#1a1510]">{o.amount}</div>
            <Pill status={o.status} />
          </div>
        ))}
      </div>
    </CardWrap>
  );
}

export default OrdersPage;