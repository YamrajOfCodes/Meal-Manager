import React, { useState } from "react";
import { Avatar, CardWrap, ChipBadge } from "../../../../components/AdminComponents/Shared/SharedComponents";
import { useGetUsers } from "../../../../hooks/Admin/adminHooks";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const getPaymentStatus = (user) => {
  if (user.payment === 0) return "paid";
  if (user.paid > 0)      return "partial";
  return "due";
};

const CustomersPage = () => {
  const [search,       setSearch]  = useState("");
  const [statusFilter, setFilter]  = useState("all");
  const [sortKey,      setSortKey] = useState("name");
  const [sortDir,      setSortDir] = useState("asc");

  const token = localStorage.getItem('login');
  const decoded = token ? jwtDecode(token) : null;
  const navigate = useNavigate();
  const messCode = decoded?.messCode;

   
  const { data: users, refetch: refetchUsers } = useGetUsers(messCode);

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  const filtered = users
    .filter(user => {
      const matchesSearch =
        user.name?.toLowerCase().includes(search.toLowerCase()) ||
        user.email?.toLowerCase().includes(search.toLowerCase()) ||
        user.messCode?.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active"   &&  user.isactive) ||
        (statusFilter === "inactive" && !user.isactive);

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let valA = a[sortKey] ?? "";
      let valB = b[sortKey] ?? "";
      if (typeof valA === "string") valA = valA.toLowerCase();
      if (typeof valB === "string") valB = valB.toLowerCase();
      if (valA < valB) return sortDir === "asc" ? -1 :  1;
      if (valA > valB) return sortDir === "asc" ?  1 : -1;
      return 0;
    });

  const SortIcon = ({ col }) => (
    <span style={{ marginLeft: 4, opacity: sortKey === col ? 1 : 0.3, fontSize: 10 }}>
      {sortKey === col ? (sortDir === "asc" ? "↑" : "↓") : "↕"}
    </span>
  );

  const columns = [
    { key: "name",     label: "Member",  sortable: true  },
    { key: "phone",    label: "Phone",   sortable: false },
    { key: "messCode", label: "Mess",    sortable: true  },
    { key: "city",     label: "City",    sortable: true  },
    { key: "paid",     label: "Paid",    sortable: true, align: "right" },
    { key: "payment",  label: "Due",     sortable: true, align: "right" },
    { key: "isactive", label: "Status",  sortable: false, align: "center" },
    { key: "pstatus",  label: "Payment", sortable: false, align: "center" },
  ];

  return (
    <div style={{ padding: "24px", fontFamily: "'Outfit', sans-serif", display: "flex", flexDirection: "column", gap: 16 }}>
      <style>{`
        .cust-table { width: 100%; border-collapse: collapse; }

        .cust-table thead th {
          padding: 10px 16px;
          font-size: 11px; font-weight: 700;
          color: #9a8f82;
          text-transform: uppercase; letter-spacing: 0.07em;
          background: #faf8f5;
          border-bottom: 1px solid #e8e2d9;
          white-space: nowrap;
          user-select: none;
        }
        .cust-table thead th.sortable { cursor: pointer; }
        .cust-table thead th.sortable:hover { color: #1a1510; }

        .cust-table tbody td {
          padding: 12px 16px;
          font-size: 13px; color: #5a5048;
          border-bottom: 1px solid #e8e2d9;
          vertical-align: middle;
        }
        .cust-table tbody tr:last-child td { border-bottom: none; }
        .cust-table tbody tr:hover td     { background: #faf8f5; }

        .search-box {
          padding: 8px 14px;
          border: 1px solid #e8e2d9; border-radius: 8px;
          font-size: 13px; font-family: inherit; color: #1a1510;
          background: #fff; outline: none; width: 260px;
        }
        .search-box:focus       { border-color: #fde0bc; }
        .search-box::placeholder { color: #c4b9ad; }

        .flt {
          font-size: 12px; font-weight: 600;
          padding: 7px 14px; border-radius: 99px;
          border: 1px solid #e8e2d9; background: #fff;
          color: #9a8f82; cursor: pointer; font-family: inherit;
          transition: all .12s; text-transform: capitalize;
        }
        .flt:hover { border-color: #c4b9ad; color: #5a5048; }
        .flt.on    { background: #fff4e8; color: #c2620a; border-color: #fde0bc; }
      `}</style>

      {/* toolbar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <input
          className="search-box"
          placeholder="Search name, email, mess code…"
          value={search}
          onChange={e => { setSearch(e.target.value); }}
        />
        <div style={{ display: "flex", gap: 6 }}>
          {["all", "active", "inactive"].map(f => (
            <button key={f} className={`flt${statusFilter === f ? " on" : ""}`} onClick={() => setFilter(f)}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* table */}
      <CardWrap>
        {/* table meta bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: "1px solid #e8e2d9", background: "#faf8f5" }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#1a1510" }}>All Members</span>
          <span style={{ fontSize: 11, color: "#9a8f82", background: "#e8e2d9", padding: "2px 8px", borderRadius: 99 }}>
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {filtered.length === 0 ? (
          <div style={{ padding: "48px", textAlign: "center", color: "#9a8f82", fontSize: 13 }}>
            No members match your search.
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="cust-table">
              <thead>
                <tr>
                  {columns.map(col => (
                    <th
                      key={col.key}
                      className={col.sortable ? "sortable" : ""}
                      style={{ textAlign: col.align ?? "left" }}
                      onClick={() => col.sortable && toggleSort(col.key)}
                    >
                      {col.label}
                      {col.sortable && <SortIcon col={col.key} />}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(user => {
                  const paymentStatus = getPaymentStatus(user);
                  const initials      = user.name?.slice(0, 2).toUpperCase() ?? "??";
                  const hue           = `hsl(${user.name?.charCodeAt(0) % 360 ?? 0},55%,40%)`;

                  return (
                    <tr key={user._id ?? user.email}>

                      {/* member */}
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <Avatar initials={initials} hue={hue} size={32} />
                          <div>
                            <p style={{ fontSize: 13, fontWeight: 600, color: "#1a1510", textTransform: "capitalize", lineHeight: 1.3 }}>
                              {user.name}
                            </p>
                            <p style={{ fontSize: 11, color: "#9a8f82", marginTop: 1 }}>
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* phone */}
                      <td style={{ fontSize: 12 }}>
                        {user.phone ? `+91 ${user.phone}` : "—"}
                      </td>

                      {/* mess code */}
                      <td>
                        <span style={{ fontSize: 11, fontWeight: 600, fontFamily: "monospace", background: "#f4f1ec", border: "1px solid #e8e2d9", padding: "2px 8px", borderRadius: 6, color: "#5a5048" }}>
                          {user.messCode}
                        </span>
                      </td>

                      {/* city */}
                      <td style={{ fontSize: 12, textTransform: "capitalize" }}>
                        {user.city ?? "—"}
                      </td>

                      {/* paid */}
                      <td style={{ textAlign: "right", fontWeight: 600, color: "#15803d", fontVariantNumeric: "tabular-nums" }}>
                        ₹{(user.paid ?? 0).toLocaleString("en-IN")}
                      </td>

                      {/* due */}
                      <td style={{ textAlign: "right", fontWeight: 700, color: user.payment > 0 ? "#c2620a" : "#15803d", fontVariantNumeric: "tabular-nums" }}>
                        ₹{(user.payment ?? 0).toLocaleString("en-IN")}
                      </td>

                      {/* active status */}
                      <td style={{ textAlign: "center" }}>
                        <ChipBadge type={user.isactive ? "chip-green" : "chip-red"}>
                          {user.isactive ? "Active" : "Inactive"}
                        </ChipBadge>
                      </td>

                      {/* payment status */}
                      <td style={{ textAlign: "center" }}>
                        <ChipBadge type={
                          paymentStatus === "paid"    ? "chip-green" :
                          paymentStatus === "partial" ? "chip-amber" : "chip-red"
                        }>
                          {paymentStatus === "paid" ? "Paid" : paymentStatus === "partial" ? "Partial" : "Due"}
                        </ChipBadge>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardWrap>
    </div>
  );
};

export default CustomersPage;