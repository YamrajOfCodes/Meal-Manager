 
 const initials = n => n.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();

 
 export function Avatar({ name, hue="#c2620a", size=34 }){
  return (
    <div style={{
      width:size, height:size, borderRadius:"50%",
      background:`${hue}20`, color:hue,
      display:"flex", alignItems:"center", justifyContent:"center",
      fontWeight:700, fontSize:size*0.32, flexShrink:0,
    }}>{initials(name)}</div>
  );
}

 export function Badge({ bg, color, children }){
  return (
    <span style={{ background:bg, color, fontSize:10, fontWeight:700,
      padding:"2px 9px", borderRadius:100, whiteSpace:"nowrap" }}>
      {children}
    </span>
  );
}

 export function Toggle({ on, onChange }){
  return (
    <div onClick={onChange} style={{
      width:40, height:22, borderRadius:11, cursor:"pointer", flexShrink:0,
      background: on ? "#16a34a" : "#d1d5db", position:"relative", transition:"background .2s",
    }}>
      <div style={{
        position:"absolute", top:3, left: on ? 21 : 3,
        width:16, height:16, borderRadius:"50%", background:"#fff",
        transition:"left .2s", boxShadow:"0 1px 3px rgba(0,0,0,.2)",
      }}/>
    </div>
  );
}

 export function Card({ children, style={} }){
  return (
    <div style={{
      background:"#fff", border:"1px solid #e8e2d9",
      borderRadius:14, overflow:"hidden",
      boxShadow:"0 1px 4px rgba(0,0,0,.05)", ...style,
    }}>{children}</div>
  );
}

 export function CardHead({ title, sub, right }){
  return (
    <div style={{ padding:"14px 20px", borderBottom:"1px solid #e8e2d9",
      display:"flex", alignItems:"center", justifyContent:"space-between" }}>
      <div>
        <div style={{ fontSize:14, fontWeight:700, color:"#1a1510" }}>{title}</div>
        {sub && <div style={{ fontSize:11, color:"#9a8f82", marginTop:2 }}>{sub}</div>}
      </div>
      {right && <div>{right}</div>}
    </div>
  );
}

 export function Modal({ open, onClose, title, children }){
  if(!open) return null;
  return (
    <div onClick={onClose} style={{
      position:"fixed", inset:0, background:"rgba(0,0,0,.45)",
      zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:16,
    }}>
      <div onClick={e=>e.stopPropagation()} style={{
        background:"#fff", borderRadius:16, width:"100%", maxWidth:520,
        boxShadow:"0 20px 60px rgba(0,0,0,.18)", overflow:"hidden",
      }}>
        <div style={{ padding:"18px 22px", borderBottom:"1px solid #e8e2d9",
          display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ fontSize:15, fontWeight:700, color:"#1a1510" }}>{title}</div>
          <button onClick={onClose} style={{
            background:"none", border:"none", cursor:"pointer",
            color:"#9a8f82", fontSize:22, lineHeight:1, padding:0,
          }}>×</button>
        </div>
        <div style={{ padding:"20px 22px" }}>{children}</div>
      </div>
    </div>
  );
}

 export function FieldLabel({ children }){
  return (
    <div style={{ fontSize:11, fontWeight:600, color:"#5a5048", marginBottom:5,
      textTransform:"uppercase", letterSpacing:".06em" }}>{children}</div>
  );
}

 export function TextInput({ value, onChange, type="text", placeholder="" }){
  return (
    <input type={type} value={value} onChange={e=>onChange(e.target.value)}
      placeholder={placeholder}
      style={{ width:"100%", padding:"9px 12px", borderRadius:8, border:"1px solid #d4ccc0",
        fontSize:13, color:"#1a1510", outline:"none", fontFamily:"inherit",
        background:"#faf8f5", boxSizing:"border-box" }}/>
  );
}

 export function InputRow({ label, value, onChange, type="text", placeholder="" }){
  return (
    <div style={{ marginBottom:14 }}>
      <FieldLabel>{label}</FieldLabel>
      <TextInput value={value} onChange={onChange} type={type} placeholder={placeholder}/>
    </div>
  );
}

 export function ActionBtn({ onClick, bg, color, children }){
  return (
    <button onClick={onClick} style={{
      padding:"5px 12px", borderRadius:7, background:bg, color,
      border:"none", fontSize:11, fontWeight:600, cursor:"pointer", fontFamily:"inherit",
    }}>{children}</button>
  );
}