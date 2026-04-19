import React from 'react'

const OrdersPage = ({orders,balance,CountUp}) => {
  return (
    <div>
       <div className="slide flex flex-col gap-5">

            {/* balance card */}
            <div className="card p-5 flex items-center gap-5"
              style={{background:"linear-gradient(110deg,#fff8f1 0%,#fff 70%)"}}>
              <div className="w-14 h-14 rounded-2xl bg-[#fff4e8] border-2 border-[#fde0bc] flex items-center justify-center shrink-0">
                <span className="text-[#c2620a] font-bold text-xl">₹</span>
              </div>
              <div className="flex-1">
                <p className="text-[11px] text-[#9a8f82] font-semibold uppercase tracking-wider">Total Balance Due</p>
                <p className="text-[36px] font-bold text-[#c2620a] leading-none mt-1 tracking-tight">
                  <CountUp value={balance}/>
                </p>
                <p className="text-[12px] text-[#9a8f82] mt-1">
                  Across {orders.length} order{orders.length!==1?"s":""}
                </p>
              </div>
              {balance>0 && (
                <button className="bg-[#c2620a] text-white text-[13px] font-bold px-5 py-3 rounded-xl hover:bg-[#a8520a] transition-colors shrink-0"
                  style={{boxShadow:"0 4px 14px rgba(194,98,10,.28)"}}>
                  Pay Now
                </button>
              )}
            </div>

            {orders.length===0
              ? <div className="card p-12 text-center flex flex-col items-center gap-3">
                  <span className="text-5xl">📋</span>
                  <p className="text-[#9a8f82] text-sm">No orders yet</p>
                  <button onClick={()=>setTab("menu")} className="text-[12px] font-semibold text-[#c2620a]">
                    Browse menu →
                  </button>
                </div>
              : <div className="flex flex-col gap-3">
                  {orders.map((order, idx)=>(
                    <div key={order.id} className="card overflow-hidden hover:-translate-y-0.5 hover:shadow-md transition-all">
                      <div className="flex items-center gap-3 px-5 py-3.5 border-b border-[#ebe6de]">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[13px] font-bold text-[#1c1812]">{order.id}</span>
                            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#eaf5ef] text-[#1a7f5a]">
                              {order.status}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#9a8f82] mt-0.5">{order.date} · {order.time}</p>
                        </div>
                        <p className="text-[17px] font-bold text-[#1c1812]">₹{order.total}</p>
                      </div>
                      <div className="px-5 py-3 flex flex-wrap gap-2">
                        {order.items.map((it,i)=>(
                          <span key={i} className="text-[11px] bg-[#faf8f5] border border-[#ebe6de] text-[#5a5048] px-3 py-1 rounded-full">
                            {it.name} ×{it.qty}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
            }
          </div>
    </div>
  )
}

export default OrdersPage
