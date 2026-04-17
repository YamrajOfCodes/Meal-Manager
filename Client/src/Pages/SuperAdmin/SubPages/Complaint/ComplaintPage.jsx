import { useState } from "react";
import { ActionBtn, Avatar, Badge, Card, CardHead } from "../../../../components/SuperAdmin/Shared/SharedComponents";

function ComplaintsPage(){

  const COMPLAINTS_INIT = [
  { id:1, owner:"Sunita Sharma",  mess:"Sharma Tiffin", subject:"Payment not reflecting in dashboard",   status:"open",     time:"2h ago" },
  { id:2, owner:"Suresh Joshi",   mess:"Joshi Mess",    subject:"App crashing on login for customers",   status:"resolved", time:"1d ago" },
  { id:3, owner:"Priya Kulkarni", mess:"Homely Bites",  subject:"Customers not receiving notice alerts", status:"open",     time:"3h ago" },
  { id:4, owner:"Anil Deshmukh",  mess:"Desh Kitchen",  subject:"Menu update not saving properly",       status:"pending",  time:"5h ago" },
];

const CMPL_STATUS = {
  open:    { bg:"#fef2f2", color:"#b91c1c", label:"Open"     },
  resolved:{ bg:"#f0fdf4", color:"#15803d", label:"Resolved" },
  pending: { bg:"#fffbeb", color:"#b45309", label:"Pending"  },
};


  const [complaints, setComplaints] = useState(COMPLAINTS_INIT);
  const [filter, setFilter] = useState("All");

  const filtered = filter==="All" ? complaints : complaints.filter(c=>c.status===filter.toLowerCase());
  const update   = (id,status) => setComplaints(prev=>prev.map(c=>c.id===id?{...c,status}:c));

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <div style={{ display:"flex", gap:8 }}>
        {["All","Open","Pending","Resolved"].map(f=>(
          <button key={f} onClick={()=>setFilter(f)} style={{
            padding:"8px 14px", borderRadius:9, cursor:"pointer", fontFamily:"inherit",
            border:"1px solid", fontSize:12, fontWeight:600,
            borderColor: filter===f?"#c2620a":"#d4ccc0",
            background:  filter===f?"#fff4e8":"#fff",
            color:       filter===f?"#c2620a":"#5a5048",
          }}>{f}</button>
        ))}
      </div>
      <Card>
        <CardHead title="Support Complaints"
          sub={`${complaints.filter(c=>c.status==="open").length} open · ${complaints.filter(c=>c.status==="pending").length} pending`}/>
        <div>
          {filtered.map((c,i)=>{
            const s = CMPL_STATUS[c.status];
            return (
              <div key={c.id} style={{ display:"flex", gap:14, padding:"14px 22px",
                borderBottom: i<filtered.length-1?"1px solid #e8e2d9":"none", alignItems:"center" }}>
                <Avatar name={c.owner} hue="#6d28d9" size={36}/>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:"#1a1510" }}>{c.subject}</div>
                  <div style={{ fontSize:11, color:"#9a8f82", marginTop:2 }}>{c.owner} · {c.mess} · {c.time}</div>
                </div>
                <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                  <Badge bg={s.bg} color={s.color}>{s.label}</Badge>
                  {c.status!=="resolved" && (
                    <ActionBtn onClick={()=>update(c.id,"resolved")} bg="#f0fdf4" color="#15803d">Resolve</ActionBtn>
                  )}
                  {c.status==="open" && (
                    <ActionBtn onClick={()=>update(c.id,"pending")} bg="#fffbeb" color="#b45309">Pending</ActionBtn>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

export default ComplaintsPage;