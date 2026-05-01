import React from 'react'

const ComplaintsPage = ({complaints,COMPLAINT_CATS,cForm,cDone,submitC,setCForm,orders,Ic}) => {
const catConfig = {
  "Food Quality":    { bg:"#FCEBEB", iconColor:"#A32D2D", iconD:["M12 2a5 5 0 015 5v3H7V7a5 5 0 015-5z","M7 10h10l-1 10H8L7 10z"] },
  "Late Delivery":   { bg:"#FAEEDA", iconColor:"#854F0B", iconD:"M12 2v10l4 4M22 12A10 10 0 112 12a10 10 0 0120 0z" },
  "Quantity Issue":  { bg:"#E6F1FB", iconColor:"#185FA5", iconD:"M3 6h18M3 12h18M3 18h18" },
  "Hygiene Concern": { bg:"#EAF3DE", iconColor:"#3B6D11", iconD:"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" },
  "Wrong Item":      { bg:"#EEEDFE", iconColor:"#534AB7", iconD:["M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2","M21 12A9 9 0 113 12a9 9 0 0118 0z"] },
  "Other":           { bg:"#F1EFE8", iconColor:"#5F5E5A", iconD:["M12 16h.01","M12 8v4","M22 12A10 10 0 112 12a10 10 0 0120 0z"] },
};

function Badge({ status }) {
  const isOpen = status === "open";
  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 600,
        padding: "3px 10px",
        borderRadius: 99,
        background: isOpen ? "#FCEBEB" : "#EAF3DE",
        color: isOpen ? "#791F1F" : "#27500A",
      }}
    >
      {isOpen ? "Open" : "Resolved"}
    </span>
  );
}

const fmt = iso => new Date(iso).toLocaleDateString("en-IN", {
  day: "numeric", month: "short", year: "numeric"
});


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
            {complaints.map(complaint => {
  const cfg = catConfig[complaint.category] || catConfig["Other"];
  return (
    <div key={complaint.id} className='bg-white rounded-xl'  style={{ display:"flex", gap:12, padding:"14px 20px", borderBottom:"1px solid #ebe6de" }}>
      <div style={{ width:36, height:36, borderRadius:10, background:cfg.bg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
        <Ic d={cfg.iconD} s={14} c={cfg.iconColor} />
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap", marginBottom:4 }}>
          <span style={{ fontSize:13, fontWeight:600, color:"#1c1812" }}>{complaint.category}</span>
          <Badge status={complaint.status} />
        </div>
        <p style={{ fontSize:12, color:"#5a5048", lineHeight:1.6 }}>{complaint.details}</p>
        <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:8, fontSize:11, color:"#9a8f82" }}>
          <span>{fmt(complaint.date)}</span>
          <span>·</span>
          <span>{complaint.messCode}</span>
          <span>·</span>
          <span style={{ fontFamily:"monospace" }}>{complaint.id}</span>
        </div>
      </div>
    </div>
  );
})}
          </div>
    </div>
  )
}

export default ComplaintsPage
