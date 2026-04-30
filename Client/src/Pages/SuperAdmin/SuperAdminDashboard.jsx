import { useEffect, useState } from "react";
import OverviewPage from "./SubPages/OverView/OverViewPage";
import OwnersPage from "./SubPages/Owners/OwnersPage";
import NoticePage from "./SubPages/Notice/NoticePage";
import ComplaintsPage from "./SubPages/Complaint/ComplaintPage";
import AnalyticsPage from "./SubPages/Analytics/AnalyticsPage";
import { useGetAllOwners } from "../../hooks/SuperAdmin/superAdminHooks";
import { useLogout } from "../../hooks/authHooks/authHooks";

/* ─── seed data ─────────────────────────────────────────────────── */
const OWNERS_INIT = [
  { id:1, name:"Ramesh Patil",    mess:"Patil Mess",      city:"Pune",       phone:"9876543210", email:"ramesh@patilmess.in",    customers:24, revenue:44300, plan:"Pro",   status:"active",   joined:"Jan 2024" },
  { id:2, name:"Sunita Sharma",   mess:"Sharma Tiffin",   city:"Nashik",     phone:"9812345670", email:"sunita@sharmatiffin.in", customers:18, revenue:32400, plan:"Basic", status:"active",   joined:"Mar 2024" },
  { id:3, name:"Anil Deshmukh",   mess:"Desh Kitchen",    city:"Nagpur",     phone:"9823456780", email:"anil@deshkitchen.in",    customers:31, revenue:58900, plan:"Pro",   status:"active",   joined:"Nov 2023" },
  { id:4, name:"Priya Kulkarni",  mess:"Homely Bites",    city:"Aurangabad", phone:"9834567890", email:"priya@homelybites.in",   customers:9,  revenue:14800, plan:"Basic", status:"inactive", joined:"Feb 2024" },
  { id:5, name:"Vijay Nair",      mess:"Nair's Meals",    city:"Mumbai",     phone:"9845678901", email:"vijay@nairmeals.in",     customers:42, revenue:82000, plan:"Pro",   status:"active",   joined:"Oct 2023" },
  { id:6, name:"Kavitha Menon",   mess:"Menon Tiffin",    city:"Kolhapur",   phone:"9856789012", email:"kavitha@menon.in",       customers:15, revenue:27300, plan:"Basic", status:"active",   joined:"May 2024" },
  { id:7, name:"Suresh Joshi",    mess:"Joshi Mess",      city:"Solapur",    phone:"9867890123", email:"suresh@joshimess.in",    customers:7,  revenue:9800,  plan:"Basic", status:"inactive", joined:"Jun 2024" },
  { id:8, name:"Deepa Iyer",      mess:"South Flavours",  city:"Pune",       phone:"9878901234", email:"deepa@southflavours.in", customers:28, revenue:51200, plan:"Pro",   status:"active",   joined:"Dec 2023" },
];


const NAV = [
  { key:"overview",   label:"Overview",    dot:false,
    icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg> },
  { key:"owners",     label:"Mess Owners", dot:false, showCount:true,
    icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000-8z"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg> },
  { key:"notices",    label:"Broadcast",   dot:false,
    icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 17H2a3 3 0 003-3V9a7 7 0 0114 0v5a3 3 0 003 3z"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg> },
  { key:"complaints", label:"Complaints",  dot:true,
    icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg> },
  { key:"analytics",  label:"Analytics",   dot:false,
    icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V10M12 20V4M6 20v-6"/></svg> },
];

const PAGE_TITLES = {
  overview:"Overview", owners:"Mess Owners", notices:"Broadcast Notices",
  complaints:"Complaints", analytics:"Analytics",
};

export default function SuperAdminDashboard(){
  const [page,   setPage]   = useState("overview");
  const {data:getOwnersData,isPending} = useGetAllOwners();
  const {mutate:logout} = useLogout();
  console.log(getOwnersData);
  const [owners, setOwners] = useState(OWNERS_INIT);

  const active   = owners?.filter(o=>o.status==="active").length;
  const inactive = owners?.filter(o=>o.status==="inactive").length;

  useEffect(()=>{
    if(getOwnersData){
      setOwners(getOwnersData.data);
    }
  },[])


const handleLogout = async () => {
  logout();
};
  

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"#f5f2ee", fontFamily:"system-ui,sans-serif" }}>

      {/* ── Sidebar ── */}
      <aside style={{ width:230, flexShrink:0, background:"#0f172a", display:"flex",
        flexDirection:"column", position:"sticky", top:0, height:"100vh", overflowY:"auto" }}>

        {/* Brand */}
        <div style={{ padding:"20px 20px 16px", borderBottom:"1px solid rgba(255,255,255,.08)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:34, height:34, borderRadius:9, background:"#c2620a",
              display:"flex", alignItems:"center", justifyContent:"center" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.4" strokeLinecap="round">
                <path d="M3 11h18M3 7h18M7 3h10M5 11v8a2 2 0 002 2h10a2 2 0 002-2v-8"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize:14, fontWeight:700, color:"#fff", letterSpacing:"-.01em" }}>TiffinTrack</div>
              <div style={{ fontSize:10, color:"rgba(255,255,255,.4)", marginTop:1 }}>Super Admin Portal</div>
            </div>
          </div>
        </div>

        {/* Quick stats pill */}
        <div style={{ margin:"12px 14px", background:"rgba(255,255,255,.05)", borderRadius:10,
          padding:"12px 14px", border:"1px solid rgba(255,255,255,.07)" }}>
          <div style={{ fontSize:9, fontWeight:700, textTransform:"uppercase", letterSpacing:".1em",
            color:"rgba(255,255,255,.35)", marginBottom:8 }}>Platform Status</div>
          <div style={{ display:"flex", justifyContent:"space-between" }}>
            {[{val:owners?.length,lbl:"Total"},{val:active,lbl:"Active",c:"#4ade80"},{val:inactive,lbl:"Inactive",c:"#f87171"}].map(s=>(
              <div key={s.lbl} style={{ textAlign:"center" }}>
                <div style={{ fontSize:18, fontWeight:700, color:s.c||"#fff", letterSpacing:"-.02em" }}>{s.val}</div>
                <div style={{ fontSize:9, color:"rgba(255,255,255,.35)", textTransform:"uppercase", letterSpacing:".06em" }}>{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ fontSize:9, fontWeight:700, letterSpacing:".1em", textTransform:"uppercase",
          color:"rgba(255,255,255,.3)", padding:"10px 20px 4px" }}>Navigation</div>

        <nav style={{ display:"flex", flexDirection:"column", gap:2, padding:"0 10px" }}>
          {NAV.map(n=>{
            const isActive = page===n.key;
            return (
              <div key={n.key} onClick={()=>setPage(n.key)} style={{
                display:"flex", alignItems:"center", gap:10, padding:"9px 12px",
                borderRadius:9, cursor:"pointer", transition:"background .12s",
                background: isActive?"rgba(194,98,10,.25)":"transparent",
                color: isActive?"#fbbf24":"rgba(255,255,255,.55)",
              }}>
                <span style={{ color:isActive?"#fbbf24":"rgba(255,255,255,.4)", display:"flex" }}>{n.icon}</span>
                <span style={{ fontSize:13, fontWeight:isActive?600:500 }}>{n.label}</span>
                {n.dot && !isActive && (
                  <span style={{ marginLeft:"auto", width:6, height:6, borderRadius:"50%", background:"#f87171" }}/>
                )}
                {n.showCount && (
                  <span style={{ marginLeft:"auto", fontSize:10, fontWeight:700,
                    background:"rgba(255,255,255,.1)", color:"rgba(255,255,255,.5)",
                    padding:"1px 7px", borderRadius:100 }}>{owners?.length}</span>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer */}
      <div className="mt-auto px-4 py-3.5 border-t border-white/10 flex items-center gap-2.5">
  <div className="w-8 h-8 rounded-full bg-orange-900/30 flex items-center justify-center text-[11px] font-bold text-yellow-400 shrink-0">
    SA
  </div>
  <div className="flex-1">
    <div className="text-xs font-semibold text-white">Super Admin</div>
    <div className="text-[10px] text-white/35">admin@tiffintrack.in</div>
  </div>
  <button
    onClick={handleLogout}
    title="Logout"
    className="w-[30px] h-[30px] rounded-lg flex items-center justify-center bg-red-400/15 border border-red-400/25 hover:bg-red-400/25 transition-colors cursor-pointer"
  >
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
    </svg>
  </button>
</div>
      </aside>

      {/* ── Main ── */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0 }}>

        {/* Topbar */}
        <div style={{ background:"#fff", borderBottom:"1px solid #e8e2d9", padding:"14px 28px",
          display:"flex", alignItems:"center", justifyContent:"space-between",
          position:"sticky", top:0, zIndex:30 }}>
          <div>
            <div style={{ fontFamily:"Georgia,serif", fontSize:21, color:"#1a1510" }}>
              {PAGE_TITLES[page]}
            </div>
            <div style={{ fontSize:11, color:"#9a8f82", marginTop:1 }}>
              {new Date().toLocaleDateString("en-IN",{ weekday:"long", day:"numeric", month:"long", year:"numeric" })}
            </div>
          </div>
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            <div style={{ fontSize:12, color:"#5a5048", background:"#f5f2ee",
              padding:"6px 14px", borderRadius:8, border:"1px solid #e8e2d9" }}>
              {active} active · {inactive} inactive
            </div>
          </div>
        </div>

        {/* Page content */}
        <div style={{ padding:"24px 28px 60px", overflowY:"auto" }}>
          {page==="overview"   && <OverviewPage   owners={owners} setPage={setPage}/>}
          {page==="owners"     && <OwnersPage     owners={getOwnersData.data} setOwners={setOwners}/>}
          {page==="notices"    && <NoticePage/>}
          {page==="complaints" && <ComplaintsPage/>}
          {page==="analytics"  && <AnalyticsPage  owners={owners}/>}
        </div>
      </div>
    </div>
  );
}