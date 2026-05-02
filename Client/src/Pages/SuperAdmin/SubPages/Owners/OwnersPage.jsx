import { useState } from "react";
import { ActionBtn, Avatar, Badge, Card, FieldLabel, InputRow, Modal, Toggle } from "../../../../components/SuperAdmin/Shared/SharedComponents";
import { useDeleteMessOwner, useUpdateMessOwner, useUpdateMessStatus } from "../../../../hooks/SuperAdmin/superAdminHooks";
import Loader from "../../../../components/AdminComponents/Shared/Loader";

function OwnersPage({ owners, setOwners }){



  const {mutate: updateMessStatus,isPending,isSuccess} = useUpdateMessStatus();
  const {mutate: updateMessOwner} = useUpdateMessOwner();
  const {mutate: deleteMessOwner} = useDeleteMessOwner();

    const fmt      = n => "₹" + Number(n).toLocaleString("en-IN");
  const ownerHue = id => HUES[(id-1) % HUES.length];
  const HUES = ["#c2620a","#7c3aed","#1a7f5a","#db2777","#1d5fa6","#b45309","#0f766e","#9333ea"];

  const PLAN_META = {
  Pro:   { bg:"#ede9fe", color:"#6d28d9" },
  Basic: { bg:"#f0fdf4", color:"#15803d" },
};

  const [search,  setSearch]  = useState("");
  const [filter,  setFilter]  = useState("All");
  const [editOwner, setEditOwner] = useState(null);
  const [deleteId,  setDeleteId]  = useState(null);
  const [form, setForm] = useState({});
  const [loader,setLoader] = useState(false);

  const filtered = owners.filter(o=>{
    const q = search.toLowerCase();
    const matchQ = o.name.toLowerCase().includes(q)||o.mess.toLowerCase().includes(q)||o.city.toLowerCase().includes(q)||o.email.toLowerCase().includes(q);
    const matchF =
      filter==="All"      ? true :
      filter==="Active"   ? o.isactive===true :
      filter==="Inactive" ? o.isactive===false :
      filter==="Pro"      ? o.plan==="Pro" :
      filter==="Basic"    ? o.plan==="Basic" : true;
    return matchQ && matchF;
  });

  const toggleStatus = (id)=>{
   
    setLoader(true);

     let flagdata;
    if(owners?.[0]?.isactive==true){
      flagdata=false;
    }else{
      flagdata=true;
    }
  console.log(!owners.isactive)
  const data = {
    ownerId:id, 
    newStatus:flagdata
  };
  updateMessStatus(data,{
    onSuccess:()=>{
      setLoader(false);
    },

    onError:()=>{
      setLoader(false);
    }
  });
  }
  const openEdit     = o  => { setEditOwner(o); setForm({...o}); };

   const saveEdit = ()=>{
     setLoader(true);
     updateMessOwner(form,{
      onSuccess:()=>{
      setLoader(false);
    },

    onError:()=>{
      setLoader(false);
    }
     });
     setEditOwner(null);
   }

  const confirmDel   = () => { 
    setLoader(true);
    deleteMessOwner(deleteId,{
      onSuccess:()=>{
      setLoader(false);
    },

    onError:()=>{
      setLoader(false);
    }
    });
    setDeleteId(null);
   };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

      {/* Toolbar */}
      <div style={{ display:"flex", gap:10, alignItems:"center", flexWrap:"wrap" }}>
        <div style={{ position:"relative", flex:1, minWidth:200 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9a8f82" strokeWidth="2"
            style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }}>
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input placeholder="Search owners, mess, city…" value={search} onChange={e=>setSearch(e.target.value)}
            style={{ width:"100%", padding:"9px 12px 9px 33px", borderRadius:9, border:"1px solid #d4ccc0",
              fontSize:13, background:"#fff", outline:"none", fontFamily:"inherit", boxSizing:"border-box" }}/>
        </div>
        {["All","Active","Inactive","Pro","Basic"].map(f=>(
          <button key={f} onClick={()=>setFilter(f)} style={{
            padding:"8px 14px", borderRadius:9, cursor:"pointer", fontFamily:"inherit",
            border:"1px solid", fontSize:12, fontWeight:600,
            borderColor: filter===f?"#c2620a":"#d4ccc0",
            background:  filter===f?"#fff4e8":"#fff",
            color:       filter===f?"#c2620a":"#5a5048",
          }}>{f}</button>
        ))}
        <div style={{ fontSize:12, color:"#9a8f82", marginLeft:"auto" }}>{filtered.length} owner{filtered.length!==1?"s":""}</div>
      </div>

      {/* Table */}
      <Card>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", minWidth:780 }}>
            <thead>
              <tr style={{ background:"#faf8f5" }}>
                {["Owner","Mess · City","Plan","Status","Actions"].map(h=>(
                  <th key={h} style={{ padding:"11px 16px", fontSize:11, fontWeight:700, color:"#9a8f82",
                    textAlign:"left", borderBottom:"1px solid #e8e2d9", whiteSpace:"nowrap",
                    textTransform:"uppercase", letterSpacing:".05em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((o,i)=>(
                <tr key={o.id} style={{
                  borderBottom: i<filtered.length-1?"1px solid #e8e2d9":"none",
                  background: o.status==="inactive"?"#fafafa":"#fff",
                }}>
                  <td style={{ padding:"12px 16px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <Avatar name={o.name} hue={ownerHue(o.id)} size={32}/>
                      <div>
                        <div style={{ fontSize:13, fontWeight:600, color:"#1a1510" }}>{o.name}</div>
                        <div style={{ fontSize:11, color:"#9a8f82" }}>{o.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding:"12px 16px" }}>
                    <div style={{ fontSize:13, fontWeight:500, color:"#1a1510" }}>{o.messName}</div>
                    <div style={{ fontSize:11, color:"#9a8f82" }}>{o.city}</div>
                  </td>
                  {/* <td style={{ padding:"12px 16px", fontSize:13, fontWeight:600, color:"#1a1510", textAlign:"center" }}>{o.customers}</td> */}
                  {/* <td style={{ padding:"12px 16px", fontSize:13, fontWeight:700, color:"#1a1510" }}>{fmt(o.revenue)}</td> */}
                  <td style={{ padding:"12px 16px" }}>
                    <Badge bg={PLAN_META["Pro"].bg} color={PLAN_META["Pro"].color}>Pro</Badge>
                  </td>
                  <td style={{ padding:"12px 16px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <Toggle on={o.isactive===true} onChange={()=>toggleStatus(o._id)}/>
                      <span style={{ fontSize:11, fontWeight:600, color:o.isactive===true?"#15803d":"#9a8f82" }}>
                        {o.isactive===true?"Active":"Inactive"}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding:"12px 16px" }}>
                    <div style={{ display:"flex", gap:6 }}>
                      <ActionBtn onClick={()=>openEdit(o)} bg="#eff6ff" color="#1d5fa6">Edit</ActionBtn>
                      <ActionBtn onClick={()=>setDeleteId(o._id)} bg="#fef2f2" color="#b91c1c">Delete</ActionBtn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Edit Modal */}
      <Modal open={!!editOwner} onClose={()=>setEditOwner(null)} title={`Edit — ${editOwner?.name}`}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 16px" }}>
          <InputRow label="Owner Name" value={form.name||""}  onChange={v=>setForm({...form,name:v})}/>
          <InputRow label="Mess Name"  value={form.messName||""}  onChange={v=>setForm({...form,messName:v})}/>
          <InputRow label="City"       value={form.city||""}  onChange={v=>setForm({...form,city:v})}/>
          <InputRow label="Phone"      value={form.phone||""} onChange={v=>setForm({...form,phone:v})}/>
          <div style={{ gridColumn:"span 2" }}>
            <InputRow label="Email" value={form.email||""} onChange={v=>setForm({...form,email:v})} type="email"/>
          </div>
          <div style={{ marginBottom:14 }}>
            <FieldLabel>Plan</FieldLabel>
            <select value={form.plan||"Basic"} onChange={e=>setForm({...form,plan:e.target.value})}
              style={{ width:"100%", padding:"9px 12px", borderRadius:8, border:"1px solid #d4ccc0",
                fontSize:13, color:"#1a1510", background:"#faf8f5", fontFamily:"inherit", outline:"none" }}>
              <option>Basic</option><option>Pro</option>
            </select>
          </div>
        </div>
        <div style={{ display:"flex", justifyContent:"flex-end", gap:10, marginTop:8 }}>
          <button onClick={()=>setEditOwner(null)} style={{ padding:"9px 20px", borderRadius:8,
            border:"1px solid #d4ccc0", background:"#fff", color:"#5a5048", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>
            Cancel
          </button>
          <button onClick={saveEdit} style={{ padding:"9px 20px", borderRadius:8,
            border:"none", background:"#c2620a", color:"#fff", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit",
            boxShadow:"0 2px 8px rgba(194,98,10,.3)" }}>
            Save Changes
          </button>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal open={!!deleteId} onClose={()=>setDeleteId(null)} title="Confirm Delete">
        <p style={{ fontSize:14, color:"#5a5048", lineHeight:1.6, marginBottom:20 }}>
          Are you sure you want to delete this mess owner? All associated data will be permanently removed.
        </p>
        <div style={{ display:"flex", justifyContent:"flex-end", gap:10 }}>
          <button onClick={()=>setDeleteId(null)} style={{ padding:"9px 20px", borderRadius:8,
            border:"1px solid #d4ccc0", background:"#fff", color:"#5a5048", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>
            Cancel
          </button>
          <button onClick={confirmDel} style={{ padding:"9px 20px", borderRadius:8,
            border:"none", background:"#b91c1c", color:"#fff", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>
            Yes, Delete
          </button>
        </div>
      </Modal>

         {loader && (
        <div className="fixed inset-0 flex items-center justify-center bg-[#f6f3ef]/40 backdrop-blur-sm z-50">
          <Loader />
        </div>
      )}
    </div>
  );
}

export default OwnersPage;