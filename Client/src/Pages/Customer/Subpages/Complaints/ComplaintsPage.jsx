import React from 'react'

const ComplaintsPage = ({complaints,COMPLAINT_CATS,cForm,cDone,submitC,setCForm,orders,Ic}) => {
  return (
    <div>
       <div className="slide flex flex-col gap-5 max-w-2xl w-full mx-auto">

            {/* raise form */}
            <div className="card overflow-hidden">
              <div className="card-hd">
                <div>
                  <p className="font-semibold text-[14px] text-[#1c1812]">Raise a Complaint</p>
                  <p className="text-[11px] text-[#9a8f82] mt-0.5">We take every complaint seriously and respond within 24 hours</p>
                </div>
              </div>
              <div className="p-5 flex flex-col gap-4">

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#9a8f82] uppercase tracking-wide mb-1.5">
                      Category *
                    </label>
                    <select value={cForm.cat} onChange={e=>setCForm(f=>({...f,cat:e.target.value}))}
                      className="w-full bg-[#faf8f5] border border-[#ebe6de] rounded-[10px] px-3 py-2.5 text-[13px] text-[#1c1812] cursor-pointer"
                      style={{border:"1px solid #ebe6de"}}>
                      <option value="">Select category…</option>
                      {COMPLAINT_CATS.map(c=><option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#9a8f82] uppercase tracking-wide mb-1.5">
                      Link Order (optional)
                    </label>
                    <select value={cForm.orderId} onChange={e=>setCForm(f=>({...f,orderId:e.target.value}))}
                      className="w-full bg-[#faf8f5] border border-[#ebe6de] rounded-[10px] px-3 py-2.5 text-[13px] text-[#1c1812] cursor-pointer"
                      style={{border:"1px solid #ebe6de"}}>
                      <option value="">No order linked</option>
                      {orders.map(o=><option key={o.id} value={o.id}>{o.id} · ₹{o.total}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#9a8f82] uppercase tracking-wide mb-1.5">
                    Description *
                  </label>
                  <textarea rows={4} value={cForm.desc}
                    onChange={e=>setCForm(f=>({...f,desc:e.target.value.slice(0,500)}))}
                    placeholder="Describe your issue clearly so we can resolve it quickly…"
                    className="w-full bg-[#faf8f5] rounded-[10px] px-4 py-3 text-[13px] text-[#1c1812] resize-none"
                    style={{border:"1px solid #ebe6de"}}/>
                  <p className="text-right text-[10px] text-[#9a8f82] mt-1">{cForm.desc.length}/500</p>
                </div>

                <button onClick={submitC}
                  disabled={!cForm.cat || !cForm.desc.trim()}
                  className="flex items-center justify-center gap-2 bg-[#c2620a] text-white font-bold text-[13px] py-3.5 rounded-xl hover:bg-[#a8520a] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{boxShadow:"0 4px 14px rgba(194,98,10,.22)"}}>
                  <Ic d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" s={15} c="white"/>
                  Submit Complaint
                </button>

                {cDone && (
                  <div className="pop flex items-center gap-2 bg-[#eaf5ef] border border-[#a0d8be] rounded-xl px-4 py-3 text-[12px] text-[#1a7f5a] font-semibold">
                    <Ic d="M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3" s={15} c="#1a7f5a"/>
                    Complaint submitted! We'll respond within 24 hours.
                  </div>
                )}
              </div>
            </div>

            {/* complaint history */}
            {complaints.length>0 && (
              <div className="card overflow-hidden">
                <div className="card-hd">
                  <p className="font-semibold text-[14px] text-[#1c1812]">Your Complaints</p>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#fdecea] text-[#c0392b]">
                    {complaints.filter(c=>c.status==="Open").length} open
                  </span>
                </div>
                <div>
                  {complaints.map(c=>(
                    <div key={c.id} className="flex gap-3 px-5 py-4 border-b border-[#ebe6de] last:border-0">
                      <div className="w-9 h-9 rounded-xl bg-[#fdecea] flex items-center justify-center shrink-0 mt-0.5">
                        <Ic d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" s={14} c="#c0392b"/>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-[13px] font-bold text-[#1c1812]">{c.cat}</span>
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${c.status==="Open"?"bg-[#fdecea] text-[#c0392b]":"bg-[#eaf5ef] text-[#1a7f5a]"}`}>
                            {c.status}
                          </span>
                          <span className="text-[10px] text-[#9a8f82] font-mono">{c.id}</span>
                        </div>
                        <p className="text-[12px] text-[#5a5048] leading-relaxed">{c.desc}</p>
                        <div className="flex items-center gap-3 mt-1.5 text-[10px] text-[#9a8f82]">
                          <span>{c.date}</span>
                          {c.orderId!=="—" && <span>· Order: {c.orderId}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
    </div>
  )
}

export default ComplaintsPage
