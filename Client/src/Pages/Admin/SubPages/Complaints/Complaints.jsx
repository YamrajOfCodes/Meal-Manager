import React, { useState, useEffect } from "react";
import { useUpdateComplaint } from "../../../../hooks/Admin/adminHooks";

// ── category visual config ───────────────────────────────────────
const categoryConfig = {
  "Food Quality":    { background: "#FCEBEB", iconColor: "#A32D2D", iconPath: "M12 2a5 5 0 015 5v1H7V7a5 5 0 015-5zM7 8h10l-1 11H8L7 8z" },
  "Late Delivery":   { background: "#FAEEDA", iconColor: "#854F0B", iconPath: "M12 2v10l4 4M22 12A10 10 0 112 12a10 10 0 0120 0z" },
  "Quantity Issue":  { background: "#E6F1FB", iconColor: "#185FA5", iconPath: "M3 6h18M3 12h18M3 18h12" },
  "Hygiene Concern": { background: "#EAF3DE", iconColor: "#3B6D11", iconPath: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" },
  "Wrong Item":      { background: "#EEEDFE", iconColor: "#534AB7", iconPath: "M10 14l2-2 2 2M12 12l2-2M21 12A9 9 0 113 12a9 9 0 0118 0z" },
  "Other":           { background: "#F1EFE8", iconColor: "#5F5E5A", iconPath: "M12 16h.01M12 8v4M22 12A10 10 0 112 12a10 10 0 0120 0z" },
};

const fallbackConfig = categoryConfig["Other"];

// ── utils ────────────────────────────────────────────────────────
function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
}

// ── small reusable components ────────────────────────────────────
function Ic({ d, s = 16, c = "#9a8f82", sw = 1.9 }) {
  return (
    <svg
      width={s} height={s} viewBox="0 0 24 24"
      fill="none" stroke={c} strokeWidth={sw}
      strokeLinecap="round" strokeLinejoin="round"
      style={{ display: "block", flexShrink: 0 }}
    >
      {[].concat(d).map((path, i) => <path key={i} d={path} />)}
    </svg>
  );
}

function CategoryIcon({ category }) {
  const config = categoryConfig[category] || fallbackConfig;
  const paths = config.iconPath.split("M").filter(Boolean).map(p => "M" + p);
  return (
    <div style={{
      width: 38, height: 38, borderRadius: 10,
      background: config.background,
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0,
    }}>
      <Ic d={paths} s={15} c={config.iconColor} />
    </div>
  );
}

function StatusBadge({ status }) {
  const isOpen = status === "open";
  return (
    <span style={{
      fontSize: 11, fontWeight: 600,
      padding: "3px 10px", borderRadius: 99,
      background: isOpen ? "#FCEBEB" : "#EAF3DE",
      color: isOpen ? "#791F1F" : "#27500A",
    }}>
      {isOpen ? "Open" : "Resolved"}
    </span>
  );
}

function Dot() {
  return (
    <span style={{ width: 3, height: 3, borderRadius: "50%", background: "#c4b9ad", display: "inline-block" }} />
  );
}

// ── main page ────────────────────────────────────────────────────
export default function AdminComplaintsPage({complaints}) {
  const [activeFilter, setActiveFilter] = useState("all");
  const {mutate:updatecomplaint} = useUpdateComplaint();
  const [loading, setLoading] = useState(true);


  async function updateStatus(complaintId, newStatus) {
    // optimistic update — update UI immediately

    console.log(complaintId, newStatus)

    const data = {
        complaintId,
        newStatus
    }

    updatecomplaint(data);
  
  }

  const filteredComplaints = complaints.filter(complaint => {
    if (activeFilter === "all") return true;
    return complaint.status === activeFilter;
  });

  const openCount = complaints.filter(c => c.status === "open").length;

  const filters = ["all", "open", "resolved"];

  return (
   <div style={{
  width: "100%",
  padding: "28px 24px 60px",
  display: "flex", flexDirection: "column", gap: 20,
  fontFamily: "'Outfit', sans-serif",
}}>

      {/* page heading */}
      <div>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#1c1812" }}>Complaints</h1>
        <p style={{ fontSize: 13, color: "#9a8f82", marginTop: 3 }}>
          Review and resolve student complaints
        </p>
      </div>

      {/* filter tabs */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {filters.map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            style={{
              fontSize: 12, fontWeight: 600,
              padding: "7px 16px", borderRadius: 99,
              border: `1px solid ${activeFilter === filter ? "#fde0bc" : "#ebe6de"}`,
              background: activeFilter === filter ? "#fff4e8" : "#fff",
              color: activeFilter === filter ? "#c2620a" : "#9a8f82",
              cursor: "pointer", fontFamily: "inherit",
              textTransform: "capitalize",
            }}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* complaints card */}
      <div style={{
        background: "#fff",
        border: "1px solid #ebe6de",
        borderRadius: 16,
        overflow: "hidden",
      }}>

        {/* card header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 20px",
          borderBottom: "1px solid #ebe6de",
          background: "#faf8f5",
        }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#1c1812" }}>
            All Complaints
          </span>
          <span style={{
            fontSize: 11, fontWeight: 600,
            padding: "3px 10px", borderRadius: 99,
            background: "#fdecea", color: "#c0392b",
          }}>
            {openCount} open
          </span>
        </div>

        {/* body */}
        {
          filteredComplaints.map(complaint => (
            <div
              key={complaint._id}
              style={{
                display: "flex", gap: 14, padding: "16px 20px",
                borderBottom: "1px solid #ebe6de",
                alignItems: "flex-start",
              }}
            >
              {/* category icon */}
              <CategoryIcon category={complaint.category} />

              {/* content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#1c1812" }}>
                    {complaint.category}
                  </span>
                  <StatusBadge status={complaint.status} />
                </div>
                <p style={{ fontSize: 12, color: "#5a5048", lineHeight: 1.6 }}>
                  {complaint.details}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8, fontSize: 11, color: "#9a8f82", flexWrap: "wrap" }}>
                  <span>{complaint.userName}</span>
                  <Dot />
                  <span>{complaint.messCode}</span>
                  <Dot />
                  <span>{formatDate(complaint.date)}</span>
                </div>
              </div>

              {/* status dropdown */}
              <select
                value={complaint.status}
                onChange={e => updateStatus(complaint._id, e.target.value)}
                style={{
                  fontSize: 11, fontWeight: 600,
                  padding: "5px 10px", borderRadius: 99,
                  border: "1px solid #ebe6de",
                  background: "#fff", color: "#5a5048",
                  cursor: "pointer", fontFamily: "inherit",
                  outline: "none", flexShrink: 0, marginTop: 2,
                }}
              >
                <option value="open">Open</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          )
        )}
      </div>
    </div>
  );
}