import { CardHead, DueRow, MenuRow } from "../../../../components/AdminComponents/Shared/SharedComponents";
import { CardWrap } from "../../../../components/AdminComponents/Shared/SharedComponents";
import { ChipBadge } from "../../../../components/AdminComponents/Shared/SharedComponents";

function OverviewPage({ setPage,fetchedMenuItems,users,orders }) {

  const DUES = [
  { name:"Sneha Desai",    av:"SD", hue:"#7c3aed", since:"8 days",  amt:"₹1,800" },
  { name:"Meera Kulkarni", av:"MK", hue:"#c2620a", since:"12 days", amt:"₹3,200" },
  { name:"Rohan Verma",    av:"RV", hue:"#1d5fa6", since:"3 days",  amt:"₹900" },
];

const MENU = [
  { slot:"Breakfast", dish:"Poha + Chai",                  kcal:"320 kcal" },
  { slot:"Lunch",     dish:"Dal Tadka · Jeera Rice · Roti", kcal:"680 kcal" },
  { slot:"Snack",     dish:"Biscuits + Tea",               kcal:"150 kcal" },
  { slot:"Dinner",    dish:"Rajma · Rice · Salad",         kcal:"720 kcal" },
];


 let yourCollection = 0;
  let yettoRecieve  = 0;

  users?.forEach((element,index)=>{
    yourCollection += element.paid;
    yettoRecieve += element.payment
  })


let list = orders?.filter((order) => {
    return (
      new Date(order.createdAt).toDateString() ===
      new Date().toDateString()
    );
  });

  console.log(list);

let totalOrdersPrice = list?.reduce((acc,curr)=>{
  console.log(curr);
   acc += curr.price;
   return acc;
},0);

  

  console.log(totalOrdersPrice)
const today = new Date().toDateString();
const grouped = fetchedMenuItems.reduce((acc, item) => {
  const itemDate = new Date(item.updatedAt).toDateString();

  if (itemDate !== today) return acc; 

  const mealTime = item.mealTime || "Breakfast";
  acc.push(item)

  return acc;
},[]);

console.log(grouped)


  return (
    <div className="flex flex-col gap-5">
      {/* Greeting */}
      <div
        className="rounded-[14px] px-7 py-5 flex items-center justify-between overflow-hidden relative"
        style={{ background: "linear-gradient(120deg, #c2620a 0%, #e07b20 100%)", boxShadow: "0 4px 20px rgba(194,98,10,.2)" }}
      >
        <div
          className="absolute -right-8 -top-8 w-44 h-44 rounded-full pointer-events-none"
          style={{ background: "rgba(255,255,255,.08)" }}
        />
        <div className="relative z-10">
          <div className="text-white text-xl font-serif">Hello {users?.name}</div>
          <div className="text-white/75 text-xs mt-1">Here's what's happening at Patil Mess today.</div>
        </div>
        <div
          className="relative z-10 text-center px-5 py-3 rounded-[9px] hidden sm:block"
          style={{ background: "rgba(255,255,255,.18)", border: "1px solid rgba(255,255,255,.25)", backdropFilter: "blur(8px)" }}
        >
          <div className="text-white text-2xl font-bold tracking-tight">48</div>
          <div className="text-white/70 text-[10px] uppercase tracking-widest mt-0.5 font-medium">Orders today</div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
        {[
          { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c2620a" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>, iconBg:"#fff4e8", num:`₹${totalOrdersPrice}`, label:"Today's collection",  chip:"chip-green", chipLabel:"+12% today" },
          { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c0392b" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>,       iconBg:"#fdecea",  num:`₹${yettoRecieve}`, label:"Amount pending",     chip:"chip-red",   chipLabel:"3 customers" },
          { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1a7f5a" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M12 7a4 4 0 100 8 4 4 0 000-8z"/></svg>, iconBg:"#e8f5ef", num:users?.length,      label:"Active customers",   chip:"chip-blue",  chipLabel:"2 on leave" },
        ].map((k, i) => (
          <div key={i} className="bg-white border border-[#e8e2d9] rounded-[14px] p-[18px] shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-[10px] flex items-center justify-center" style={{ background: k.iconBg }}>{k.icon}</div>
              <ChipBadge type={k.chip}>{k.chipLabel}</ChipBadge>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#1a1510] tracking-tight leading-none">{k.num}</div>
              <div className="text-xs text-[#9a8f82] font-medium mt-1">{k.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Split: Monthly Collection + Dues */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-4">
        {/* <CardWrap>
          <CardHead title="Monthly Collection" sub="October 2025" />
          <div className="p-5">
            {[
              { label:"Collected so far", val:"₹38,400", color:"#1a7f5a" },
              { label:"Yet to receive",   val:"₹5,900",  color:"#c0392b" },
              { label:"Total expected",   val:"₹44,300", color:"#1a1510" },
            ].map(r => (
              <div key={r.label} className="flex items-center justify-between py-3 border-b border-[#e8e2d9] last:border-0">
                <span className="text-[13px] text-[#5a5048]">{r.label}</span>
                <span className="text-sm font-bold" style={{ color: r.color }}>{r.val}</span>
              </div>
            ))}
            <div className="mt-4">
              <div className="flex justify-between text-[11px] text-[#9a8f82] mb-1.5">
                <span>86.7% collected</span>
                <span>₹38,400 / ₹44,300</span>
              </div>
              <div className="h-2 bg-[#e8e2d9] rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width:"86.7%", background:"linear-gradient(90deg, #c2620a 0%, #f0a050 100%)" }} />
              </div>
            </div>
          </div>
        </CardWrap> */}

        <CardWrap>
          <CardHead title="Payments Due" right={<ChipBadge type="chip-red">3 overdue</ChipBadge>} />
          <div className="px-4 pb-3 pt-1">
            {users?.map(due => (
              <DueRow key={due.name} Due={due} />
            ))}
          </div>
        </CardWrap>


         <CardWrap>
        <CardHead title="Today's Menu" right={
          <button className="text-[11px] font-semibold text-[#c2620a] cursor-pointer" onClick={() => setPage("menu")}>Edit menu →</button>
        } />
        <div className="px-5 pb-2 pt-1">
          {grouped?.map(meal => <MenuRow key={meal.name} meal={meal} />)}
        </div>
      </CardWrap>
      </div>

      {/* Today's Menu preview */}
     
    </div>
  );
}

export default OverviewPage;