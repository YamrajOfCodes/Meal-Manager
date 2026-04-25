import React from 'react'

const OverViewPage = ({
    balance, 
    orders, 
    complaints, 
    today, 
    setTab,
    Today,
    CountUp,
    Ic,
    loading,
    menu,
    VegBox,
    cart,
    notices
}) => {
  return (
    <div>
      <div className="slide flex flex-col gap-5">

            {/* hero banner */}
            <div className="rounded-2xl relative overflow-hidden flex items-center justify-between gap-4"
              style={{background:"linear-gradient(120deg,#c2620a 0%,#e07b20 65%,#f0a050 100%)", padding:"24px 28px"}}>
              <div className="relative z-10">
                <h1 className="text-2xl text-white font-bold leading-tight" style={{fontFamily:"'Lora',serif"}}>
                  Good morning, Kundan 👋
                </h1>
                <p className="text-white/70 text-[13px] mt-1">{today}</p>
                <div className="flex gap-3 mt-4 flex-wrap">
                  <button onClick={()=>setTab("menu")}
                    className="bg-white text-[#c2620a] text-[12px] font-bold px-5 py-2.5 rounded-full hover:bg-[#fff4e8] transition-colors">
                    Order Now →
                  </button>
                  <button onClick={()=>setTab("orders")}
                    className="text-white border border-white/30 text-[12px] font-semibold px-5 py-2.5 rounded-full hover:bg-white/10 transition-colors">
                    My Orders
                  </button>
                </div>
              </div>
              {/* decorative orbs */}
              <div className="absolute right-[-24px] top-[-24px] w-40 h-40 rounded-full bg-white/10 pointer-events-none"/>
              <div className="absolute right-[56px] bottom-[-48px] w-28 h-28 rounded-full bg-white/06 pointer-events-none"/>
              {/* floating balance */}
              <div className="relative z-10 bg-white/18 border border-white/25 rounded-2xl px-5 py-4 text-center backdrop-blur shrink-0 desk">
                <p className="text-[10px] text-white/60 uppercase tracking-wider font-semibold">Balance Due</p>
                <p className="text-[28px] font-bold text-white leading-none mt-1">
                  <CountUp value={balance}/>
                </p>
              </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-3 gap-4">
              {[
                {
                  label:"Balance Due", val:<CountUp value={balance}/>, sub:"Total to pay this month",
                  iconD:"M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6",
                  iconBg:"bg-[#fff4e8]", iconC:"#c2620a",
                  chipLabel: balance>0?"Pending":"Cleared", chipCls: balance>0?"bg-[#fdecea] text-[#c0392b]":"bg-[#eaf5ef] text-[#1a7f5a]",
                },
                {
                  label:"Orders Placed", val: orders.length, sub:"This session",
                  iconD:"M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8",
                  iconBg:"bg-[#e8f0fb]", iconC:"#1d5fa6",
                  chipLabel:"Today", chipCls:"bg-[#e8f0fb] text-[#1d5fa6]",
                },
                {
                  label:"Open Complaints", val: complaints.filter(c=>c.status==="Open").length, sub:"Pending resolution",
                  iconD:"M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z",
                  iconBg:"bg-[#fdecea]", iconC:"#c0392b",
                  chipLabel:"Active", chipCls:"bg-[#fdecea] text-[#c0392b]",
                },
              ].map((k,i)=>(
                <div key={i} className="card p-5 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 rounded-xl ${k.iconBg} flex items-center justify-center`}>
                      <Ic d={k.iconD} s={17} c={k.iconC}/>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${k.chipCls}`}>
                      {k.chipLabel}
                    </span>
                  </div>
                  <div>
                    <p className="text-[27px] font-bold text-[#1c1812] leading-none tracking-tight">{k.val}</p>
                    <p className="text-[13px] font-semibold text-[#1c1812] mt-1">{k.label}</p>
                    <p className="text-[11px] text-[#9a8f82] mt-0.5">{k.sub}</p>
                  </div>
                </div>
              ))}
            </div>


            {/* notices */}
            <div className="card overflow-hidden">
              <div className="card-hd">
                <p className="font-semibold text-[14px] text-[#1c1812]">📢 Mess Notices</p>
              </div>
               {
                notices?.map((n,i)=>{
                  return(
                    <>
                     <div key={i} className="flex gap-3 px-5 py-3.5 border-b border-[#ebe6de] last:border-0">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${n.t==="info"?"bg-[#e8f0fb]":"bg-[#fff4e8]"}`}>
                    <Ic d={n.t==="info"
                      ? "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      : "M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"
                    } s={14} c={n.t==="info"?"#1d5fa6":"#c2620a"}/>
                  </div>
                  <div>
                    <p className="text-[12px] text-[#5a5048] leading-relaxed">{n.text}</p>
                    <p className="text-[10px] text-[#9a8f82] mt-1">{n.time}</p>
                  </div>
                </div>
                    </>
                  )
                })
               }
            </div>
          </div>
    </div>
  )
}

export default OverViewPage
