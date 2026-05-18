import { useState } from "react";
import {
  useAssignLabel,
  useCreateLabel,
  useDeleteLabel,
  useGetLabels,
  useunAssignLabel,
} from "../../../../hooks/Admin/adminHooks";
import { jwtDecode } from "jwt-decode";

const TIERS = ["basic", "silver", "gold", "vip", "custom"];

const TIER_CONFIG = {
  basic:  { color: "#16a34a", light: "#f0fdf4", label: "Basic"  },
  silver: { color: "#71717a", light: "#f4f4f5", label: "Silver" },
  gold:   { color: "#d97706", light: "#fffbeb", label: "Gold"   },
  vip:    { color: "#7c3aed", light: "#f5f3ff", label: "VIP"    },
  custom: { color: "#dc2626", light: "#fef2f2", label: "Custom" },
};

const AVATAR_POOL = ["#dbeafe", "#dcfce7", "#fce7f3", "#fef3c7", "#ede9fe"];

export default function DiscountLabels({ users, refetchUsers }) {
  const [showCreate, setShowCreate]     = useState(false);
  const [activeLabel, setActiveLabel]   = useState(null);
  const [form, setForm]                 = useState({ name: "", tier: "basic", discount: "", minOrder: "", desc: "" });
  const [checkedUsers, setCheckedUsers] = useState(new Set());
  const [saving, setSaving]             = useState(false);

  const { mutate: createLabel }     = useCreateLabel();
  const { mutate: deleteLabel }     = useDeleteLabel();
  const { mutate: assigneLabel }    = useAssignLabel();
  const { mutate: unassignedLabel } = useunAssignLabel();

  const token   = localStorage.getItem("login");
  const decoded = jwtDecode(token);

  const { data: getlabels } = useGetLabels(decoded?._id);

  const maxDiscount = getlabels?.length
    ? Math.max(...getlabels.map(l => l.discount))
    : 0;

  /* ─── Create ─── */
  const handleCreate = () => {
    if (!form.name || !form.discount) return;
    createLabel({
      userId:        decoded._id,
      labelName:     form.name,
      tier:          form.tier,
      discount:      Number(form.discount),
      minOrderValue: Number(form.minOrder) || 0,
      description:   form.desc,
    });
    setShowCreate(false);
    setForm({ name: "", tier: "basic", discount: "", minOrder: "", desc: "" });
  };

  /* ─── Delete ─── */
  const handleDelete = (id) => deleteLabel(id);

  /* ─── Open modal ───
     Initialize checkedUsers purely from server data (users prop).
     Whoever already has this label → checked. Simple and reliable.
  */
  const openAssign = (label) => {
    const alreadyAssigned = new Set(
      users
        ?.filter(u => u?.label?.labelName === label.labelName)
        .map(u => u._id) || []
    );
    setCheckedUsers(alreadyAssigned);
    setActiveLabel(label);
  };

  const closeAssign = () => {
    setActiveLabel(null);
    setCheckedUsers(new Set());
  };

  /* ─── Toggle checkbox ─── */
  const toggleUser = (userId) => {
    setCheckedUsers(prev => {
      const next = new Set(prev);
      if (next.has(userId)) next.delete(userId);
      else next.add(userId);
      return next;
    });
  };

  /* ─── Save ───
     Diff what user wants (checkedUsers) vs what server has (users prop).
     Fire assign for new additions, unassign for removals.
     Refetch users after all mutations so next modal open is fresh.
  */
 const saveAssign = async () => {
  if (!activeLabel) return;
  setSaving(true);

  const serverAssigned = new Set(
    users
      ?.filter(u => u?.label?.labelName === activeLabel.labelName)
      .map(u => u._id) || []
  );

  const toAssign   = [...checkedUsers].filter(id => !serverAssigned.has(id));
  const toUnassign = [...serverAssigned].filter(id => !checkedUsers.has(id));

  try {
    // ✅ Wait for ALL mutations to complete
    await Promise.all([
      ...toAssign.map(userId =>
        new Promise((resolve, reject) =>
          assigneLabel(
            { labelName: activeLabel.labelName, discount: activeLabel.discount, userId },
            { onSuccess: resolve, onError: reject }
          )
        )
      ),
      ...toUnassign.map(userId =>
        new Promise((resolve, reject) =>
          unassignedLabel(
            { userId },
            { onSuccess: resolve, onError: reject }
          )
        )
      ),
    ]);

    // ✅ Wait for users to refetch before closing
    if (refetchUsers) await refetchUsers();

  } catch (e) {
    console.error("Save failed", e);
    setSaving(false);
    return; // don't close if it failed
  }

  setSaving(false);
  closeAssign(); // ✅ Only close AFTER users prop is fresh
};

  /* ─── Styles ─── */
  const inputStyle = {
    width: "100%", padding: "9px 12px",
    border: "1px solid #e2e8f0", borderRadius: 8,
    fontSize: 14, color: "#1e293b", background: "#f8fafc",
    outline: "none", boxSizing: "border-box",
    fontFamily: "inherit", transition: "border-color 0.15s",
  };
  const btnPrimary = {
    display: "inline-flex", alignItems: "center", gap: 6,
    background: "#1e293b", color: "#fff", border: "none",
    borderRadius: 8, padding: "9px 18px", fontSize: 14,
    fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
  };
  const btnSecondary = {
    background: "none", border: "1px solid #e2e8f0",
    borderRadius: 8, padding: "9px 16px", fontSize: 14,
    fontWeight: 500, cursor: "pointer", color: "#64748b",
    fontFamily: "inherit",
  };
  const overlay = {
    position: "fixed", inset: 0,
    background: "rgba(15,23,42,0.45)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 200, padding: "16px",
  };
  const modal = {
    background: "#fff", borderRadius: 14,
    width: "100%", maxWidth: 440,
    padding: "24px", boxSizing: "border-box",
    maxHeight: "90vh", overflowY: "auto",
  };

  /* ─── Render ─── */
  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", padding: "clamp(16px,4vw,36px) clamp(12px,4vw,28px)", fontFamily: "'Inter', system-ui, sans-serif", color: "#1e293b" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, gap: 12, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ fontSize: "clamp(20px,3vw,26px)", fontWeight: 700, margin: "0 0 4px", letterSpacing: "-0.4px" }}>Discount Labels</h1>
          <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>Assign labels to customers for automatic order discounts</p>
        </div>
        <button style={btnPrimary} onClick={() => setShowCreate(true)}>+ Create Label</button>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
        {[
          { label: "Labels",       val: getlabels?.length ?? 0 },
          { label: "Max discount", val: `₹${maxDiscount}`      },
        ].map(s => (
          <div key={s.label} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, padding: "10px 16px", display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#64748b" }}>
            <span style={{ fontWeight: 700, fontSize: 15, color: "#1e293b" }}>{s.val}</span>
            <span>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Label grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 280px), 1fr))", gap: 14 }}>
        {getlabels?.length === 0 && (
          <div style={{ textAlign: "center", padding: "52px 24px", background: "#fff", border: "1.5px dashed #e2e8f0", borderRadius: 14, gridColumn: "1 / -1", color: "#94a3b8" }}>
            <p style={{ margin: 0, fontSize: 14 }}>No discount labels yet.<br />Create your first label to start rewarding customers.</p>
          </div>
        )}

        {getlabels?.map(label => {
          const tc = TIER_CONFIG[label.tier] || TIER_CONFIG.basic;
          const assignedCount = users?.filter(u => u?.label?.labelName === label.labelName).length ?? 0;

          return (
            <div key={label._id} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: 18, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: tc.color, borderRadius: "14px 14px 0 0" }} />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 9px", borderRadius: 6, fontSize: 11, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", background: tc.light, color: tc.color }}>
                  {tc.label}
                </span>
                <button onClick={() => handleDelete(label._id)} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: 16, padding: "2px 6px", borderRadius: 6, lineHeight: 1 }} title="Delete">✕</button>
              </div>

              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4, letterSpacing: "-0.2px" }}>{label.labelName}</div>
              <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.55, marginBottom: 14 }}>{label.description || "No description."}</div>

              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 14 }}>
                <span style={{ fontSize: 38, fontWeight: 800, letterSpacing: "-1px", color: tc.color, lineHeight: 1 }}>₹{label.discount}</span>
                <span style={{ fontSize: 12, color: "#94a3b8" }}>
                  off {label.minOrderValue > 0 ? `on orders ≥ ₹${label.minOrderValue.toLocaleString("en-IN")}` : "all orders"}
                </span>
              </div>

              <div style={{ height: 1, background: "#f1f5f9", margin: "0 0 14px" }} />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, color: "#94a3b8" }}>
                  {assignedCount > 0
                    ? `${assignedCount} customer${assignedCount > 1 ? "s" : ""} assigned`
                    : "No customers assigned"}
                </span>
                <button
                  style={{ ...btnSecondary, padding: "6px 12px", fontSize: 12 }}
                  onClick={() => openAssign(label)}
                >
                  Assign
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Create Modal ── */}
      {showCreate && (
        <div style={overlay} onClick={e => e.target === e.currentTarget && setShowCreate(false)}>
          <div style={modal}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, letterSpacing: "-0.3px" }}>Create Label</h2>
              <button onClick={() => setShowCreate(false)} style={{ background: "#f1f5f9", border: "none", width: 30, height: 30, borderRadius: 7, cursor: "pointer", fontSize: 14, color: "#64748b", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.04em" }}>Label Name</label>
              <input style={inputStyle} placeholder="e.g. Gold Member" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>

            <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.04em" }}>Tier</label>
                <select style={{ ...inputStyle, cursor: "pointer" }} value={form.tier} onChange={e => setForm({ ...form, tier: e.target.value })}>
                  {TIERS.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.04em" }}>Discount (₹)</label>
                <input style={inputStyle} type="number" min="1" placeholder="e.g. 20" value={form.discount} onChange={e => setForm({ ...form, discount: e.target.value })} />
              </div>
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.04em" }}>Min. Order Value (₹) — 0 for any</label>
              <input style={inputStyle} type="number" min="0" placeholder="e.g. 500" value={form.minOrder} onChange={e => setForm({ ...form, minOrder: e.target.value })} />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.04em" }}>Description</label>
              <textarea style={{ ...inputStyle, resize: "none" }} rows={2} placeholder="Brief description..." value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} />
            </div>

            {Number(form.discount) > 0 && (
              <div style={{ background: "#fff7ed", border: "1px dashed #fdba74", borderRadius: 9, padding: "12px 14px", display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
                <span style={{ fontSize: 30, fontWeight: 800, color: "#ea580c", lineHeight: 1 }}>₹{form.discount}</span>
                <span style={{ fontSize: 13, color: "#c2410c", lineHeight: 1.5 }}>
                  <strong style={{ display: "block", fontWeight: 600 }}>Preview</strong>
                  ₹{form.discount} off {Number(form.minOrder) > 0 ? `on orders ≥ ₹${Number(form.minOrder).toLocaleString("en-IN")}` : "all orders"}
                </span>
              </div>
            )}

            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button style={btnSecondary} onClick={() => setShowCreate(false)}>Cancel</button>
              <button style={btnPrimary} onClick={handleCreate}>Create Label</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Assign Modal ── */}
      {activeLabel && (
        <div style={overlay} onClick={e => e.target === e.currentTarget && closeAssign()}>
          <div style={modal}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, letterSpacing: "-0.3px" }}>Assign Customers</h2>
              <button onClick={closeAssign} style={{ background: "#f1f5f9", border: "none", width: 30, height: 30, borderRadius: 7, cursor: "pointer", fontSize: 14, color: "#64748b", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
            </div>

            <div style={{ background: "#f8fafc", borderRadius: 8, padding: "10px 13px", marginBottom: 14, fontSize: 13, color: "#64748b" }}>
              <strong style={{ color: "#1e293b" }}>{activeLabel.labelName}</strong> — ₹{activeLabel.discount} off applied at checkout
            </div>

            <div style={{ maxHeight: 280, overflowY: "auto", marginBottom: 14 }}>
              {users?.map((customer, i) => {
                const checked = checkedUsers.has(customer._id);
                return (
                  <div
                    key={customer._id}
                    onClick={() => toggleUser(customer._id)}
                    style={{
                      display: "flex", alignItems: "center", gap: 12,
                      padding: "9px 10px", borderRadius: 9, cursor: "pointer",
                      background: checked ? "#f0fdf4" : "transparent",
                      marginBottom: 2, transition: "background 0.15s",
                    }}
                  >
                    {/* Avatar */}
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: AVATAR_POOL[i % AVATAR_POOL.length], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, flexShrink: 0, color: "#475569" }}>
                      {customer.name?.slice(0, 2).toUpperCase() || "??"}
                    </div>

                    {/* Name + email */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{customer.name}</div>
                      <div style={{ fontSize: 12, color: "#94a3b8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{customer.email}</div>
                    </div>

                    {/* Show existing label if it's a different one */}
                    {customer?.label?.labelName && customer.label.labelName !== activeLabel.labelName && (
                      <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 100, background: "#fef3c7", color: "#d97706", fontWeight: 600, flexShrink: 0 }}>
                        {customer.label.labelName}
                      </span>
                    )}

                    {/* Checkbox */}
                    <div style={{
                      width: 20, height: 20, borderRadius: 6, flexShrink: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 12, fontWeight: 700,
                      border: checked ? "none" : "1.5px solid #cbd5e1",
                      background: checked ? "#16a34a" : "transparent",
                      color: "#fff", transition: "all 0.15s",
                    }}>
                      {checked && "✓"}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div style={{ display: "flex", gap: 8, justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 12, color: "#94a3b8" }}>
                {checkedUsers.size} customer{checkedUsers.size !== 1 ? "s" : ""} selected
              </span>
              <div style={{ display: "flex", gap: 8 }}>
                <button style={btnSecondary} onClick={closeAssign} disabled={saving}>Cancel</button>
                <button style={{ ...btnPrimary, opacity: saving ? 0.7 : 1 }} onClick={saveAssign} disabled={saving}>
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}