import { useEffect, useState } from "react";
import { useAssignLabel, useCreateLabel, useDeleteLabel, useGetLabels, useunAssignLabel } from "../../../../hooks/Admin/adminHooks";
import {jwtDecode} from "jwt-decode"

const CUSTOMERS = [
  { id: 1, name: "Rohit Sharma", email: "rohit@email.com", initials: "RS", bg: "#d4e8d4", orders: 24 },
  { id: 2, name: "Priya Patel",  email: "priya@email.com", initials: "PP", bg: "#d4d4e8", orders: 11 },
  { id: 3, name: "Arjun Mehta",  email: "arjun@email.com", initials: "AM", bg: "#e8d4d4", orders: 38 },
  { id: 4, name: "Neha Singh",   email: "neha@email.com",  initials: "NS", bg: "#e8e4d4", orders: 7  },
  { id: 5, name: "Vikram Das",   email: "vikram@email.com",initials: "VD", bg: "#d4e4e8", orders: 15 },
];

const TIERS = ["basic", "silver", "gold", "vip", "custom"];

const TIER_STYLES = {
  basic:  { bar: "#1a7a4a", badge: { bg: "#e8f5ee", color: "#1a7a4a" }, pct: "#1a7a4a" },
  silver: { bar: "#8a857e", badge: { bg: "#f0eeeb", color: "#8a857e" }, pct: "#8a857e" },
  gold:   { bar: "#c5911a", badge: { bg: "#fdf6e8", color: "#c5911a" }, pct: "#c5911a" },
  vip:    { bar: "#6b3fa0", badge: { bg: "#f2ecfb", color: "#6b3fa0" }, pct: "#6b3fa0" },
  custom: { bar: "#d4541a", badge: { bg: "#fdf0ea", color: "#d4541a" }, pct: "#d4541a" },
};

const AVATAR_COLORS = ["#d4e8d4", "#d4d4e8", "#e8d4d4", "#e8e4d4"];

const styles = {
  page: {
    fontFamily: "'DM Sans', sans-serif",
    background: "#f5f2ee",
    minHeight: "100vh",
    padding: "32px 24px",
    color: "#1a1714",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 36,
  },
  h1: {
    fontFamily: "'DM Serif Display', serif",
    fontSize: "2.4rem",
    letterSpacing: "-0.02em",
    lineHeight: 1,
    margin: 0,
  },
  subtext: { color: "#8a857e", fontSize: "0.88rem", marginTop: 4 },
  btnCreate: {
    display: "flex", alignItems: "center", gap: 8,
    background: "#1a1714", color: "#fff",
    border: "none", borderRadius: 10,
    padding: "11px 20px",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "0.88rem", fontWeight: 500,
    cursor: "pointer",
  },
  statsRow: { display: "flex", gap: 12, marginBottom: 28, flexWrap: "wrap" },
  statChip: {
    background: "#fff", border: "1px solid #e4dfd8",
    borderRadius: 10, padding: "10px 18px",
    fontSize: "0.82rem", color: "#8a857e",
    display: "flex", alignItems: "center", gap: 8,
  },
  statStrong: { color: "#1a1714", fontSize: "1rem", fontWeight: 600 },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: 16,
  },
  card: {
    background: "#fff", border: "1px solid #e4dfd8",
    borderRadius: 16, padding: 20,
    position: "relative", overflow: "hidden",
    transition: "box-shadow 0.2s, transform 0.2s",
    cursor: "default",
  },
  cardTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 },
  badge: {
    display: "inline-flex", alignItems: "center", gap: 6,
    padding: "4px 10px", borderRadius: 6,
    fontSize: "0.74rem", fontWeight: 600,
    letterSpacing: "0.04em", textTransform: "uppercase",
    fontFamily: "'DM Mono', monospace",
  },
  cardMenuBtn: {
    background: "none", border: "none",
    color: "#8a857e", cursor: "pointer",
    fontSize: "1rem", padding: "4px 8px",
    borderRadius: 6,
  },
  cardName: {
    fontFamily: "'DM Serif Display', serif",
    fontSize: "1.4rem", letterSpacing: "-0.01em",
    marginBottom: 6,
  },
  cardDesc: { fontSize: "0.82rem", color: "#8a857e", lineHeight: 1.5, marginBottom: 16 },
  discountDisplay: { display: "flex", alignItems: "baseline", gap: 4, marginBottom: 16 },
  discountPct: {
    fontFamily: "'DM Serif Display', serif",
    fontSize: "2.6rem", lineHeight: 1, letterSpacing: "-0.03em",
  },
  discountLabel: { fontSize: "0.8rem", color: "#8a857e", fontWeight: 500 },
  divider: { height: 1, background: "#e4dfd8", marginBottom: 14 },
  cardMeta: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  avatarStack: { display: "flex" },
  avatar: {
    width: 22, height: 22, borderRadius: "50%",
    border: "2px solid #fff",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "0.6rem", fontWeight: 700,
    marginLeft: -6, position: "relative",
  },
  customersText: { fontSize: "0.8rem", color: "#8a857e", marginLeft: 6 },
  btnAssign: {
    display: "flex", alignItems: "center", gap: 5,
    background: "none", border: "1.5px solid #e4dfd8",
    borderRadius: 8, padding: "6px 12px",
    fontSize: "0.78rem", fontWeight: 500,
    fontFamily: "'DM Sans', sans-serif",
    color: "#1a1714", cursor: "pointer",
  },
  // Modal
  overlay: {
    position: "fixed", inset: 0,
    background: "rgba(26,23,20,0.5)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 100, backdropFilter: "blur(3px)",
  },
  modal: {
    background: "#fff", borderRadius: 20,
    width: 420, maxWidth: "calc(100vw - 32px)",
    padding: 28,
    boxShadow: "0 24px 60px rgba(0,0,0,0.18)",
  },
  modalHeader: {
    display: "flex", justifyContent: "space-between",
    alignItems: "center", marginBottom: 22,
  },
  modalTitle: {
    fontFamily: "'DM Serif Display', serif",
    fontSize: "1.5rem", letterSpacing: "-0.01em",
    margin: 0,
  },
  modalClose: {
    background: "#f5f2ee", border: "none",
    width: 32, height: 32, borderRadius: 8,
    fontSize: "1rem", cursor: "pointer",
    color: "#8a857e",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  field: { marginBottom: 14 },
  label: {
    display: "block", fontSize: "0.78rem",
    fontWeight: 600, color: "#8a857e",
    letterSpacing: "0.04em", textTransform: "uppercase",
    marginBottom: 6,
  },
  input: {
    width: "100%", padding: "10px 12px",
    border: "1.5px solid #e4dfd8", borderRadius: 10,
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "0.9rem", color: "#1a1714",
    background: "#f5f2ee", outline: "none",
    boxSizing: "border-box",
  },
  fieldRow: { display: "flex", gap: 10 },
  discountPreview: {
    background: "#fdf0ea", border: "1.5px dashed #e8b090",
    borderRadius: 10, padding: "12px 16px",
    display: "flex", alignItems: "center", gap: 12,
    marginBottom: 18,
  },
  previewPct: {
    fontFamily: "'DM Serif Display', serif",
    fontSize: "2rem", color: "#d4541a", lineHeight: 1,
  },
  previewText: { fontSize: "0.82rem", color: "#d4541a", lineHeight: 1.5 },
  modalActions: { display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 6 },
  btnCancel: {
    background: "none", border: "1.5px solid #e4dfd8",
    borderRadius: 10, padding: "10px 18px",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "0.88rem", fontWeight: 500,
    cursor: "pointer", color: "#8a857e",
  },
  btnSave: {
    background: "#1a1714", color: "#fff",
    border: "none", borderRadius: 10,
    padding: "10px 22px",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "0.88rem", fontWeight: 500,
    cursor: "pointer",
  },
  customerList: { maxHeight: 220, overflowY: "auto", marginBottom: 16 },
  customerRow: {
    display: "flex", alignItems: "center", gap: 12,
    padding: "10px 12px", borderRadius: 10, cursor: "pointer",
  },
  customerAvatar: {
    width: 34, height: 34, borderRadius: "50%",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "0.8rem", fontWeight: 700, flexShrink: 0,
  },
  customerName: { fontSize: "0.9rem", fontWeight: 600, display: "block" },
  customerSub: { fontSize: "0.78rem", color: "#8a857e" },
  check: {
    width: 18, height: 18, borderRadius: 5,
    border: "2px solid #e4dfd8", flexShrink: 0,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "0.7rem",
  },
  checkActive: {
    background: "#1a1714", border: "2px solid #1a1714", color: "#fff",
  },
  assignInfo: {
    background: "#f5f2ee", borderRadius: 10,
    padding: "10px 14px", marginBottom: 14,
    fontSize: "0.82rem", color: "#8a857e",
  },
  emptyState: {
    textAlign: "center", padding: "48px 24px",
    color: "#8a857e", background: "#fff",
    border: "1px dashed #e4dfd8", borderRadius: 16,
    gridColumn: "1 / -1",
  },
};

// Google Fonts loader
const FontLoader = () => (
  <link
    href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500;600&display=swap"
    rel="stylesheet"
  />
);

const INITIAL_getlabels = [
  { id: 1, name: "Basic Saver", tier: "basic",  discount: 5,  minOrder: 0,    desc: "Entry-level discount for regular customers.", assigned: [1, 4] },
  { id: 2, name: "Silver Deal", tier: "silver", discount: 12, minOrder: 500,  desc: "Rewarding loyal buyers with mid-tier savings.", assigned: [2] },
  { id: 3, name: "Gold Member", tier: "gold",   discount: 20, minOrder: 1500, desc: "Premium savings for high-value customers.", assigned: [3, 5] },
];

export default function Discountgetlabels({users}) {
  const [showCreate, setShowCreate] = useState(false);
  const [assignLabelId, setAssignLabelId] = useState(null);
  const [form, setForm] = useState({ name: "", tier: "basic", discount: "", minOrder: "", desc: "" });
  const [assignSelected, setAssignSelected] = useState([]);
  const {mutate:createLabel} = useCreateLabel();
  const {data:getlabels} = useGetLabels();
  const {mutate:deleteLabel} = useDeleteLabel();
  const {mutate:assigneLabel} = useAssignLabel();
  const {mutate:unassignedLabel} = useunAssignLabel();
  const [labelss,setLabels] = useState(null);
  const [assigned,setAssigned] = useState([])
  console.log(users)

  const token = localStorage.getItem("login");
  const decoded = jwtDecode(token);
  const [unassignedId,setUnassignedId] = useState(null);

  const totalAssigned = () => {
    
  };

  const maxDiscount = getlabels?.length ? Math.max(...getlabels.map(l => l.discount)) : 0;

  const handleCreate = () => {
    if (!form.name || !form.discount) return;
    const data = {
      userId:decoded._id,
      labelName:form.name,
      tier:form.tier,
      discount:Number(form.discount),
      minOrderValue:Number(form.minOrder) || 0,
      description:form.desc
    }
    setShowCreate(false);
    createLabel(data);
    setForm({ name: "", tier: "basic", discount: "", minOrder: "", desc: "" });
  };

  const handleDelete = (id) => {
    deleteLabel(id);
  };

  console.log(getlabels)

  const openAssign = (id,labell) => {
    setLabels(labell);
    setAssignLabelId(id);
    const label = getlabels?.find(l => l.id === id);
    setAssignSelected([...label.assigned]);
  };

  const saveAssign = () => {

    if(unassignedId !== null){
      unassignedLabel(unassignedId,{
        onSuccess:()=>{
          setUnassignedId(null);
        }
      });
      setAssignLabelId(null);
      return;
    }

    const data = {...labelss}
    data.userId = assignSelected[0];
    console.log(data);
   assigneLabel(data);
   setAssignLabelId(null);
  };

 const toggleCustomer = (id) => {
  console.log(id);

  setAssignSelected(prev => {
    if (prev?.includes(id)) {
      setUnassignedId(id);
      return prev?.filter(x => x !== id);
    } else {
      return [...prev, id];
    }
  });
};

 useEffect(()=>{
const data = users?.reduce((acc, element) => {
  if (element?.label?.labelName) {
    acc.push(element._id);
  }
  return acc;
}, []);

console.log(data);
setAssignSelected(data);
 },[]);

  const assignLabel = getlabels?.find(l => l.id === assignLabelId);

  return (
    <>
      <FontLoader />
      <div style={styles.page}>

        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.h1}>Discount getlabels</h1>
            <p style={styles.subtext}>Assign getlabels to customers for automatic order discounts</p>
          </div>
          <button style={styles.btnCreate} onClick={() => setShowCreate(true)}>
            + Create Label
          </button>
        </div>

        {/* Stats */}
        <div style={styles.statsRow}>
          <div style={styles.statChip}>📋 <strong style={styles.statStrong}>{getlabels?.length}</strong> getlabels</div>
          <div style={styles.statChip}>👥 <strong style={styles.statStrong}>{totalAssigned()}</strong> Customers Assigned</div>
          <div style={styles.statChip}>🏷️ Up to <strong style={styles.statStrong}>{maxDiscount}%</strong> Discount</div>
        </div>

        {/* getlabels Grid */}
        <div style={styles.grid}>
          {getlabels?.length === 0 && (
            <div style={styles.emptyState}>
              <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>🏷️</div>
              <p>No discount getlabels yet.<br />Create your first label to start rewarding customers.</p>
            </div>
          )}
          {getlabels?.map(label => {
            const ts = TIER_STYLES[label.tier];
            // const assigned = CUSTOMERS.filter(c => label.assigned.includes(c.id));
            return (
              <div key={label.id} style={styles.card}>
                {/* Top color bar */}
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: ts.bar }} />

                <div style={styles.cardTop}>
                  <span style={{ ...styles.badge, background: ts.badge.bg, color: ts.badge.color }}>
                    {label.tier}
                  </span>
                  <button style={styles.cardMenuBtn} onClick={() => handleDelete(label._id)} title="Delete">✕</button>
                </div>

                <div style={styles.cardName}>{label.labelName}</div>
                <div style={styles.cardDesc}>{label.description || "No description."}</div>

                <div style={styles.discountDisplay}>
                  <span style={{ ...styles.discountPct, color: ts.pct }}>{label.discount}%</span>
                  <span style={styles.discountLabel}>
                    discount on orders{label.minOrder > 0 ? ` ≥ ₹${label.minOrder.toLocaleString("en-IN")}` : ""}
                  </span>
                </div>

                <div style={styles.divider} />

                <div style={styles.cardMeta}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    {assigned.length > 0 ? (
                      <>
                        <div style={styles.avatarStack}>
                          {assigned.slice(0, 4).map((c, i) => (
                            <div key={c.id} style={{ ...styles.avatar, background: AVATAR_COLORS[i % 4], marginLeft: i === 0 ? 0 : -6 }} title={c.name}>
                              {c.initials}
                            </div>
                          ))}
                          {assigned.length > 4 && (
                            <div style={{ ...styles.avatar, background: "#e4dfd8", marginLeft: -6 }}>+{assigned.length - 4}</div>
                          )}
                        </div>
                        <span style={styles.customersText}>{assigned.length} customer{assigned.length > 1 ? "s" : ""}</span>
                      </>
                    ) : (
                      <span style={{ fontSize: "0.8rem", color: "#8a857e" }}>No customers assigned</span>
                    )}
                  </div>
                  <button style={styles.btnAssign} onClick={() => openAssign(label.id,label)}>
                    👤 Assign
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Create Modal */}
        {showCreate && (
          <div style={styles.overlay} onClick={(e) => e.target === e.currentTarget && setShowCreate(false)}>
            <div style={styles.modal}>
              <div style={styles.modalHeader}>
                <h2 style={styles.modalTitle}>Create Label</h2>
                <button style={styles.modalClose} onClick={() => setShowCreate(false)}>✕</button>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Label Name</label>
                <input style={styles.input} placeholder="e.g. Gold Member" value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>

              <div style={styles.fieldRow}>
                <div style={{ ...styles.field, flex: 1 }}>
                  <label style={styles.label}>Tier</label>
                  <select style={styles.input} value={form.tier} onChange={e => setForm({ ...form, tier: e.target.value })}>
                    {TIERS.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                  </select>
                </div>
                <div style={{ ...styles.field, flex: 1 }}>
                  <label style={styles.label}>Discount %</label>
                  <input style={styles.input} type="number" min="1" max="100" placeholder="e.g. 20"
                    value={form.discount} onChange={e => setForm({ ...form, discount: e.target.value })} />
                </div>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Min. Order Value (₹) — 0 for any order</label>
                <input style={styles.input} type="number" min="0" placeholder="e.g. 500"
                  value={form.minOrder} onChange={e => setForm({ ...form, minOrder: e.target.value })} />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Description</label>
                <textarea style={{ ...styles.input, resize: "none" }} rows={2}
                  placeholder="Brief description of this label..."
                  value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} />
              </div>

              {form.discount > 0 && (
                <div style={styles.discountPreview}>
                  <div style={styles.previewPct}>{form.discount}%</div>
                  <div style={styles.previewText}>
                    <strong style={{ fontWeight: 600, display: "block" }}>Discount preview</strong>
                    Customers with this label get {form.discount}% off
                    {form.minOrder > 0 ? ` on orders ≥ ₹${Number(form.minOrder).toLocaleString("en-IN")}` : " on all orders"} automatically.
                  </div>
                </div>
              )}

              <div style={styles.modalActions}>
                <button style={styles.btnCancel} onClick={() => setShowCreate(false)}>Cancel</button>
                <button style={styles.btnSave} onClick={handleCreate}>Create Label</button>
              </div>
            </div>
          </div>
        )}

        {/* Assign Modal */}
        {assignLabelId !== null && assignLabel && (
          <div style={styles.overlay} onClick={(e) => e.target === e.currentTarget && setAssignLabelId(null)}>
            <div style={styles.modal}>
              <div style={styles.modalHeader}>
                <h2 style={styles.modalTitle}>Assign Customers</h2>
                <button style={styles.modalClose} onClick={() => setAssignLabelId(null)}>✕</button>
              </div>

              <div style={styles.assignInfo}>
                🏷️ <strong>{assignLabel.name}</strong> — {assignLabel.discount}% discount applies automatically at checkout.
              </div>

              <div style={styles.customerList}>
                {users?.map(customer => {
                  const checked = assignSelected?.includes(customer._id);
                  return (
                    <div key={customer.id} style={{ ...styles.customerRow, background: checked ? "#f5f2ee" : "transparent" }}
                      onClick={() => toggleCustomer(customer._id)}>
                      <div style={{ ...styles.customerAvatar, background: customer.bg }}>{customer.initials}</div>
                      <div style={{ flex: 1 }}>
                        <span style={styles.customerName}>{customer.name}</span>
                        <span style={styles.customerSub}>{customer.email}</span>
                      </div>
                      <div style={{ ...styles.check, ...(checked ? styles.checkActive : {}) }}>
                        {checked && "✓"}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={styles.modalActions}>
                <button style={styles.btnCancel} onClick={() => setAssignLabelId(null)}>Cancel</button>
                <button style={styles.btnSave} onClick={saveAssign}>
                  Save ({assignSelected?.length} selected)
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}