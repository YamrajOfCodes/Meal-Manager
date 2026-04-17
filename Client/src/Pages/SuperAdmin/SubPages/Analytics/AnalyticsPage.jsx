import { Avatar, Badge, Card, CardHead } from "../../../../components/SuperAdmin/Shared/SharedComponents";

function AnalyticsPage({ owners }){
 
    const fmt      = n => "₹" + Number(n).toLocaleString("en-IN");
  const ownerHue = id => HUES[(id-1) % HUES.length];
  const HUES = ["#c2620a","#7c3aed","#1a7f5a","#db2777","#1d5fa6","#b45309","#0f766e","#9333ea"];

  const PLAN_META = {
  Pro:   { bg:"#ede9fe", color:"#6d28d9" },
  Basic: { bg:"#f0fdf4", color:"#15803d" },
};


  const cities  = {};
  owners.forEach(o=>{ cities[o.city]=(cities[o.city]||0)+1; });
  const sorted  = Object.entries(cities).sort((a,b)=>b[1]-a[1]);
  const maxC    = sorted[0]?.[1]||1;
  const totalRev= owners.reduce((a,o)=>a+o.revenue,0);
  const avgRev  = Math.round(totalRev/owners.length);
  const maxRevO = Math.max(...owners.map(o=>o.revenue));

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
        {[
          { label:"Total Platform Revenue",  val:fmt(totalRev),                          note:"All-time" },
          { label:"Avg Revenue / Owner",      val:fmt(avgRev),                            note:"This month" },
          { label:"Total Customers Served",   val:owners.reduce((a,o)=>a+o.customers,0), note:"Active subscriptions" },
        ].map(k=>(
          <Card key={k.label} style={{ padding:"18px 20px" }}>
            <div style={{ fontSize:11, color:"#9a8f82", fontWeight:600, textTransform:"uppercase",
              letterSpacing:".05em", marginBottom:10 }}>{k.note}</div>
            <div style={{ fontSize:24, fontWeight:700, color:"#1a1510", letterSpacing:"-.02em" }}>{k.val}</div>
            <div style={{ fontSize:12, color:"#9a8f82", marginTop:4 }}>{k.label}</div>
          </Card>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:18 }}>
        <Card>
          <CardHead title="Owners by City"/>
          <div style={{ padding:"12px 22px 16px" }}>
            {sorted.map(([city,count])=>(
              <div key={city} style={{ marginBottom:12 }}>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:"#5a5048", marginBottom:4 }}>
                  <span style={{ fontWeight:500 }}>{city}</span>
                  <span style={{ fontWeight:700 }}>{count}</span>
                </div>
                <div style={{ height:7, background:"#e8e2d9", borderRadius:4, overflow:"hidden" }}>
                  <div style={{ height:"100%", width:`${(count/maxC)*100}%`,
                    background:"#c2620a", borderRadius:4, transition:"width .5s" }}/>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHead title="Active vs Inactive"/>
          <div style={{ padding:"20px 22px" }}>
            {[
              { label:"Active Owners",   count:owners.filter(o=>o.status==="active").length,   color:"#16a34a", total:owners.length },
              { label:"Inactive Owners", count:owners.filter(o=>o.status==="inactive").length, color:"#dc2626", total:owners.length },
              { label:"Pro Plan",        count:owners.filter(o=>o.plan==="Pro").length,         color:"#6d28d9", total:owners.length },
              { label:"Basic Plan",      count:owners.filter(o=>o.plan==="Basic").length,       color:"#15803d", total:owners.length },
            ].map(r=>(
              <div key={r.label} style={{ marginBottom:14 }}>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:"#5a5048", marginBottom:4 }}>
                  <span>{r.label}</span>
                  <span style={{ fontWeight:700 }}>{r.count} / {r.total}</span>
                </div>
                <div style={{ height:7, background:"#e8e2d9", borderRadius:4, overflow:"hidden" }}>
                  <div style={{ height:"100%", width:`${(r.count/r.total)*100}%`,
                    background:r.color, borderRadius:4, transition:"width .5s" }}/>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <CardHead title="Revenue per Owner" sub="All owners ranked"/>
        <div style={{ padding:"0 22px 16px" }}>
          {[...owners].sort((a,b)=>b.revenue-a.revenue).map((o,i)=>(
            <div key={o.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 0",
              borderBottom: i<owners.length-1?"1px solid #e8e2d9":"none" }}>
              <span style={{ width:22, fontSize:11, color:"#9a8f82", fontWeight:700 }}>#{i+1}</span>
              <Avatar name={o.name} hue={ownerHue(o.id)} size={28}/>
              <span style={{ flex:1, fontSize:13, color:"#1a1510", fontWeight:500 }}>{o.name}</span>
              <span style={{ fontSize:11, color:"#9a8f82", minWidth:90 }}>{o.customers} customers</span>
              <div style={{ width:100, height:6, background:"#e8e2d9", borderRadius:3, overflow:"hidden" }}>
                <div style={{ height:"100%", width:`${(o.revenue/maxRevO)*100}%`,
                  background:"#c2620a", borderRadius:3 }}/>
              </div>
              <span style={{ fontSize:13, fontWeight:700, color:"#1a1510", minWidth:80, textAlign:"right" }}>{fmt(o.revenue)}</span>
              <Badge bg={PLAN_META[o.plan].bg} color={PLAN_META[o.plan].color}>{o.plan}</Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default AnalyticsPage;