import { useState } from "react";
import { Badge, Card, CardHead, FieldLabel, InputRow, Modal } from "../../../../components/SuperAdmin/Shared/SharedComponents";

function NoticePage(){
 
const NOTICES_INIT = [
  { id:1, title:"Scheduled maintenance",        body:"Platform maintenance on 20 Apr 2–4 AM IST. Expect brief downtime.",                   target:"All Owners",   type:"warning", time:"Today 10:00 AM" },
  { id:2, title:"New UPI auto-collect feature", body:"Pro plan owners can now enable automatic UPI collection from their payments panel.",   target:"Pro Owners",   type:"info",    time:"Yesterday 3 PM" },
  { id:3, title:"May subscription reminder",    body:"Remind all Basic plan owners that their May renewal is due by 30 April.",              target:"Basic Owners", type:"payment", time:"16 Apr 9 AM"    },
];

const TYPE_META = {
  info:    { label:"Info",    bg:"#eff6ff", color:"#1d4ed8" },
  warning: { label:"Warning", bg:"#fffbeb", color:"#b45309" },
  payment: { label:"Payment", bg:"#fff7ed", color:"#c2410c" },
  urgent:  { label:"Urgent",  bg:"#fef2f2", color:"#b91c1c" },
};


  const [notices,  setNotices]  = useState(NOTICES_INIT);
  const [title,    setTitle]    = useState("");
  const [body,     setBody]     = useState("");
  const [target,   setTarget]   = useState("All Owners");
  const [type,     setType]     = useState("info");
  const [deleteId, setDeleteId] = useState(null);

  const post = () => {
    if(!title.trim()||!body.trim()) return;
    setNotices(prev=>[{ id:Date.now(), title, body, target, type, time:"Just now" }, ...prev]);
    setTitle(""); setBody("");
  };

  const TARGETS = ["All Owners","Pro Owners","Basic Owners","Active Owners","Inactive Owners"];

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
      <Card>
        <CardHead title="Broadcast a Notice" sub="Send platform-wide messages to mess owners"/>
        <div style={{ padding:"18px 22px" }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 16px" }}>
            <InputRow label="Notice Title" value={title} onChange={setTitle} placeholder="e.g. Scheduled maintenance…"/>
            <div style={{ marginBottom:14 }}>
              <FieldLabel>Target Audience</FieldLabel>
              <select value={target} onChange={e=>setTarget(e.target.value)}
                style={{ width:"100%", padding:"9px 12px", borderRadius:8, border:"1px solid #d4ccc0",
                  fontSize:13, color:"#1a1510", background:"#faf8f5", fontFamily:"inherit", outline:"none" }}>
                {TARGETS.map(t=><option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div style={{ marginBottom:14 }}>
            <FieldLabel>Message Body</FieldLabel>
            <textarea value={body} onChange={e=>setBody(e.target.value)} rows={4}
              placeholder="Write your notice here…"
              style={{ width:"100%", padding:"10px 12px", borderRadius:8, border:"1px solid #d4ccc0",
                fontSize:13, color:"#1a1510", background:"#faf8f5", fontFamily:"inherit",
                outline:"none", resize:"none", lineHeight:1.6, boxSizing:"border-box" }}/>
          </div>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:10 }}>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
              {Object.entries(TYPE_META).map(([k,m])=>(
                <button key={k} onClick={()=>setType(k)} style={{
                  padding:"5px 13px", borderRadius:7, fontSize:11, fontWeight:700,
                  cursor:"pointer", border:"1px solid", fontFamily:"inherit",
                  background:    type===k ? m.bg          : "transparent",
                  color:         type===k ? m.color        : "#9a8f82",
                  borderColor:   type===k ? `${m.color}50` : "#e8e2d9",
                }}>{m.label}</button>
              ))}
            </div>
            <button onClick={post} style={{ padding:"9px 24px", borderRadius:9, background:"#c2620a",
              color:"#fff", border:"none", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit",
              boxShadow:"0 2px 8px rgba(194,98,10,.3)" }}>
              Post Notice
            </button>
          </div>
        </div>
      </Card>

      <Card>
        <CardHead title="Posted Notices" sub={`${notices.length} total`}/>
        <div>
          {notices.map((n,i)=>{
            const m = TYPE_META[n.type]||TYPE_META.info;
            const icons = { info:"ℹ️", warning:"⚠️", payment:"💳", urgent:"🚨" };
            return (
              <div key={n.id} style={{ display:"flex", gap:14, padding:"14px 22px",
                borderBottom: i<notices.length-1?"1px solid #e8e2d9":"none", alignItems:"flex-start" }}>
                <div style={{ width:36, height:36, borderRadius:9, background:m.bg,
                  display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:16 }}>
                  {icons[n.type]||"ℹ️"}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                    <div style={{ fontSize:13, fontWeight:700, color:"#1a1510" }}>{n.title}</div>
                    <Badge bg={m.bg} color={m.color}>{m.label}</Badge>
                  </div>
                  <div style={{ fontSize:13, color:"#5a5048", lineHeight:1.55 }}>{n.body}</div>
                  <div style={{ display:"flex", gap:12, marginTop:6 }}>
                    <span style={{ fontSize:11, color:"#9a8f82" }}>{n.time}</span>
                    <span style={{ fontSize:11, color:"#9a8f82" }}>→ {n.target}</span>
                  </div>
                </div>
                <button onClick={()=>setDeleteId(n.id)} style={{ background:"#fef2f2", border:"none",
                  borderRadius:7, padding:"5px 11px", fontSize:11, fontWeight:600, color:"#b91c1c",
                  cursor:"pointer", fontFamily:"inherit", flexShrink:0 }}>Delete</button>
              </div>
            );
          })}
        </div>
      </Card>

      <Modal open={!!deleteId} onClose={()=>setDeleteId(null)} title="Delete Notice">
        <p style={{ fontSize:14, color:"#5a5048", lineHeight:1.6, marginBottom:20 }}>
          Remove this notice? Owners who haven't seen it will no longer receive it.
        </p>
        <div style={{ display:"flex", justifyContent:"flex-end", gap:10 }}>
          <button onClick={()=>setDeleteId(null)} style={{ padding:"9px 20px", borderRadius:8,
            border:"1px solid #d4ccc0", background:"#fff", color:"#5a5048", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>
            Cancel
          </button>
          <button onClick={()=>{ setNotices(p=>p.filter(x=>x.id!==deleteId)); setDeleteId(null); }} style={{
            padding:"9px 20px", borderRadius:8, border:"none", background:"#b91c1c",
            color:"#fff", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default NoticePage;