import { Avatar, CardHead, CardWrap, ChipBadge, DueRow, Pill } from "../../../../components/AdminComponents/Shared/SharedComponents";

function PaymentsPage() {

  const DUES = [
  { name:"Sneha Desai",    av:"SD", hue:"#7c3aed", since:"8 days",  amt:"₹1,800" },
  { name:"Meera Kulkarni", av:"MK", hue:"#c2620a", since:"12 days", amt:"₹3,200" },
  { name:"Rohan Verma",    av:"RV", hue:"#1d5fa6", since:"3 days",  amt:"₹900" },
];

  const ORDERS = [
  { name:"Rahul Patil",     room:"B-204", meals:"Lunch + Dinner", amount:"₹3,200", status:"paid",    av:"RP", hue:"#c2620a" },
  { name:"Sneha Desai",    room:"A-102", meals:"Lunch only",     amount:"₹1,800", status:"due",     av:"SD", hue:"#7c3aed" },
  { name:"Arjun Mehta",    room:"C-310", meals:"Lunch + Dinner", amount:"₹900",   status:"paid",    av:"AM", hue:"#1a7f5a" },
  { name:"Priya Sharma",   room:"B-105", meals:"Dinner only",    amount:"₹1,500", status:"partial", av:"PS", hue:"#db2777" },
  { name:"Karan Joshi",    room:"D-401", meals:"Lunch + Dinner", amount:"₹180",   status:"paid",    av:"KJ", hue:"#1d5fa6" },
  { name:"Meera Kulkarni", room:"A-208", meals:"Lunch + Dinner", amount:"₹3,200", status:"due",     av:"MK", hue:"#c2620a" },
];

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-3.5">
        {[
          { iconColor:"#1a7f5a", iconBg:"#e8f5ef", icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1a7f5a" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>, num:"₹38,400", label:"Collected this month" },
          { iconColor:"#c0392b", iconBg:"#fdecea",  icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c0392b" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01"/></svg>, num:"₹5,900", label:"Yet to receive" },
        ].map((k, i) => (
          <div key={i} className="bg-white border border-[#e8e2d9] rounded-[14px] p-[18px] shadow-sm flex flex-col gap-3">
            <div className="w-9 h-9 rounded-[10px] flex items-center justify-center" style={{ background: k.iconBg }}>{k.icon}</div>
            <div>
              <div className="text-2xl font-bold text-[#1a1510] tracking-tight leading-none">{k.num}</div>
              <div className="text-xs text-[#9a8f82] font-medium mt-1">{k.label}</div>
            </div>
          </div>
        ))}
      </div>

      <CardWrap>
        <CardHead title="Overdue Payments" right={<ChipBadge type="chip-red">3 pending</ChipBadge>} />
        <div className="px-4 pb-3 pt-1">
          {DUES.map(d => <DueRow key={d.name} d={d} />)}
        </div>
      </CardWrap>

      <CardWrap>
        <CardHead title="All Payments" />
        <div>
          {ORDERS.map(o => (
            <div key={o.name} className="flex items-center gap-3 px-5 py-3 border-b border-[#e8e2d9] last:border-0 hover:bg-[#faf8f5] transition-colors">
              <Avatar initials={o.av} hue={o.hue} />
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-semibold text-[#1a1510]">{o.name}</div>
                <div className="text-[11px] text-[#9a8f82] mt-0.5">{o.room}</div>
              </div>
              <div className="text-[13px] font-bold text-[#1a1510]">{o.amount}</div>
              <Pill status={o.status} />
            </div>
          ))}
        </div>
      </CardWrap>
    </div>
  );
}

export default PaymentsPage;