import { Avatar, Badge, Card, CardHead } from "../../../../components/SuperAdmin/Shared/SharedComponents";

function OverviewPage({ owners, setPage }){
  const active    = owners?.filter(o=>o.status==="active").length;
  const inactive  = owners?.filter(o=>o.status==="inactive").length;
  const pro       = owners?.filter(o=>o.plan==="Pro").length;
  const totalRev  = owners?.reduce((a,o)=>a+o.revenue,0);
  const totalCust = owners?.reduce((a,o)=>a+o.customers,0);

  const fmt      = n => "₹" + Number(n).toLocaleString("en-IN");
  const ownerHue = id => HUES[(id-1) % HUES.length];
  const HUES = ["#c2620a","#7c3aed","#1a7f5a","#db2777","#1d5fa6","#b45309","#0f766e","#9333ea"];

 const PLAN_META = {
  Pro:   { bg:"#ede9fe", color:"#6d28d9" },
  Basic: { bg:"#f0fdf4", color:"#15803d" },
};



  const kpis = [
    { label:"Total Mess Owners", val:owners?.length, chip:`${active} active`,  chipBg:"#dcfce7", chipC:"#15803d", icon:"🏪" },
    { label:"Platform Revenue",  val:fmt(totalRev), chip:"This month",        chipBg:"#fff7ed", chipC:"#c2410c", icon:"💰" },
    { label:"Total Customers",   val:totalCust,     chip:`across all messes`, chipBg:"#eff6ff", chipC:"#1d4ed8", icon:"👥" },
    { label:"Pro Plan Owners",   val:pro,           chip:`${owners?.length-pro} on Basic`, chipBg:"#ede9fe", chipC:"#6d28d9", icon:"⭐" },
  ];

  const months  = ["Nov","Dec","Jan","Feb","Mar","Apr"];
  const mockRev = [28000,34000,39000,42000,47000,totalRev];
  const maxRev  = Math.max(...mockRev);

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>

      {/* Hero banner */}
      <div style={{
        borderRadius:14, padding:"22px 28px",
        background:"linear-gradient(120deg,#0f172a 0%,#1e293b 100%)",
        display:"flex", alignItems:"center", justifyContent:"space-between",
        position:"relative", overflow:"hidden",
      }}>
        <div style={{ position:"absolute", right:-40, top:-40, width:220, height:220,
          borderRadius:"50%", background:"rgba(251,191,36,.07)", pointerEvents:"none" }}/>
        <div style={{ position:"absolute", right:80, bottom:-60, width:160, height:160,
          borderRadius:"50%", background:"rgba(99,102,241,.08)", pointerEvents:"none" }}/>
        <div style={{ position:"relative", zIndex:1 }}>
          <div style={{ fontFamily:"Georgia,serif", fontSize:24, color:"#fff", marginBottom:4 }}>
            Good morning, Super Admin 👋
          </div>
          <div style={{ fontSize:12, color:"rgba(255,255,255,.6)" }}>
            TiffinTrack platform · {new Date().toLocaleDateString("en-IN",{ weekday:"long", day:"numeric", month:"long", year:"numeric" })}
          </div>
        </div>
        <div style={{ position:"relative", zIndex:1, display:"flex", gap:12 }}>
          {[{val:owners.length,lbl:"Owners"},{val:active,lbl:"Active",c:"#4ade80"},{val:inactive,lbl:"Inactive",c:"#f87171"}].map(s=>(
            <div key={s.lbl} style={{
              background:"rgba(255,255,255,.08)", border:"1px solid rgba(255,255,255,.13)",
              borderRadius:10, padding:"10px 18px", textAlign:"center",
            }}>
              <div style={{ fontSize:22, fontWeight:700, color:s.c||"#fbbf24", letterSpacing:"-.02em" }}>{s.val}</div>
              <div style={{ fontSize:10, color:"rgba(255,255,255,.55)", marginTop:2, textTransform:"uppercase", letterSpacing:".07em" }}>{s.lbl}</div>
            </div>
          ))}
        </div>
      </div>

      {/* KPI row */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }}>
        {kpis.map(k=>(
          <Card key={k.label} style={{ padding:"18px 20px" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
              <div style={{ fontSize:22 }}>{k.icon}</div>
              <Badge bg={k.chipBg} color={k.chipC}>{k.chip}</Badge>
            </div>
            <div style={{ fontSize:26, fontWeight:700, color:"#1a1510", letterSpacing:"-.03em", lineHeight:1 }}>{k.val}</div>
            <div style={{ fontSize:12, color:"#9a8f82", marginTop:5 }}>{k.label}</div>
          </Card>
        ))}
      </div>

      {/* Top owners + revenue chart */}
      <div style={{ display:"grid", gridTemplateColumns:"1.4fr 1fr", gap:18 }}>
        <Card>
          <CardHead title="Top Performing Owners" sub="By revenue this month"
            right={<span onClick={()=>setPage("owners")} style={{ fontSize:11, fontWeight:600, color:"#c2620a", cursor:"pointer" }}>View all →</span>}
          />
          <div>
            {[...owners].sort((a,b)=>b.revenue-a.revenue).slice(0,5).map((o,i)=>(
              <div key={o.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"11px 20px",
                borderBottom: i<4?"1px solid #e8e2d9":"none" }}>
                <div style={{ width:22, fontSize:12, fontWeight:700, color:"#9a8f82" }}>#{i+1}</div>
                <Avatar name={o.name} hue={ownerHue(o.id)} size={32}/>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:600, color:"#1a1510" }}>{o.name}</div>
                  <div style={{ fontSize:11, color:"#9a8f82" }}>{o.mess} · {o.city}</div>
                </div>
                <div style={{ fontSize:13, fontWeight:700, color:"#1a1510" }}>{fmt(o.revenue)}</div>
                <Badge bg={PLAN_META[o.plan].bg} color={PLAN_META[o.plan].color}>{o.plan}</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHead title="Revenue Trend" sub="Last 6 months"/>
          <div style={{ padding:"16px 22px 20px" }}>
            <div style={{ display:"flex", alignItems:"flex-end", gap:8, height:140 }}>
              {mockRev.map((v,i)=>(
                <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                  <div style={{ fontSize:9, color:"#9a8f82", textAlign:"center" }}>
                    {i===5 ? fmt(v) : ""}
                  </div>
                  <div style={{
                    width:"100%", borderRadius:"4px 4px 0 0", minHeight:4,
                    height:`${(v/maxRev)*115}px`,
                    background: i===5 ? "#c2620a" : "#e8e2d9",
                    transition:"height .4s",
                  }}/>
                  <div style={{ fontSize:10, color:"#9a8f82" }}>{months[i]}</div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Plan distribution */}
      <Card style={{ padding:"20px 24px" }}>
        <div style={{ fontSize:14, fontWeight:700, color:"#1a1510", marginBottom:14 }}>Plan Distribution</div>
        <div style={{ display:"flex", gap:24, marginBottom:10 }}>
          {[{label:"Pro",count:pro,color:"#6d28d9"},{label:"Basic",count:owners.length-pro,color:"#16a34a"}].map(p=>(
            <div key={p.label} style={{ display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ width:10, height:10, borderRadius:2, background:p.color }}/>
              <span style={{ fontSize:12, color:"#5a5048" }}>{p.label} — <strong>{p.count}</strong></span>
            </div>
          ))}
        </div>
        <div style={{ height:10, borderRadius:5, background:"#e8e2d9", overflow:"hidden", display:"flex" }}>
          <div style={{ width:`${(pro/owners.length)*100}%`, background:"#6d28d9", transition:"width .5s" }}/>
          <div style={{ flex:1, background:"#16a34a" }}/>
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", marginTop:5 }}>
          <span style={{ fontSize:11, color:"#9a8f82" }}>{Math.round((pro/owners.length)*100)}% Pro</span>
          <span style={{ fontSize:11, color:"#9a8f82" }}>{Math.round(((owners.length-pro)/owners.length)*100)}% Basic</span>
        </div>
      </Card>
    </div>
  );
}

export default OverviewPage;