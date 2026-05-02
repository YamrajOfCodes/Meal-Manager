import { Edit } from "lucide-react";
import { Avatar, CardHead, CardWrap, ChipBadge, DueRow, Pill } from "../../../../components/AdminComponents/Shared/SharedComponents";
import { useState } from "react";
import { useUpdatePayment } from "../../../../hooks/Admin/adminHooks";
import Loader from "../../../../components/AdminComponents/Shared/Loader";

function PaymentsPage({ users }) {

  console.log(users)

  const {mutate:updatePayment,isPending:isUpdating} = useUpdatePayment();

  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
   const [loader,setLoader] = useState(false);

  let yourCollection = 0;
  let yettoRecieve  = 0;

  users?.forEach((element,index)=>{
    yourCollection += element.paid;
    yettoRecieve += element.payment
  })

  const handleEdit = (id, text) => {
    setEditId(id);
    setEditText(text);
  }

  const handleUpdate = () => {
  setLoader(true);

  let data = {
    userId: editId,
    letestDue: editText
  };

  updatePayment(data, {
    onSuccess: () => {
      setLoader(false);
      setEditId(null);
      setEditText("");
    },
    onError: () => {
      setLoading(false);
    }
  });
};

  const handleCancel = () => {
    setEditId(null);
    setEditText("");
  }

  const DUES = [
    { name: "Sneha Desai", av: "SD", hue: "#7c3aed", since: "8 days", amt: "₹1,800" },
    { name: "Meera Kulkarni", av: "MK", hue: "#c2620a", since: "12 days", amt: "₹3,200" },
    { name: "Rohan Verma", av: "RV", hue: "#1d5fa6", since: "3 days", amt: "₹900" },
  ];

  const ORDERS = [
    { name: "Rahul Patil", room: "B-204", meals: "Lunch + Dinner", amount: "₹3,200", status: "paid", av: "RP", hue: "#c2620a" },
    { name: "Sneha Desai", room: "A-102", meals: "Lunch only", amount: "₹1,800", status: "due", av: "SD", hue: "#7c3aed" },
    { name: "Arjun Mehta", room: "C-310", meals: "Lunch + Dinner", amount: "₹900", status: "paid", av: "AM", hue: "#1a7f5a" },
    { name: "Priya Sharma", room: "B-105", meals: "Dinner only", amount: "₹1,500", status: "partial", av: "PS", hue: "#db2777" },
    { name: "Karan Joshi", room: "D-401", meals: "Lunch + Dinner", amount: "₹180", status: "paid", av: "KJ", hue: "#1d5fa6" },
    { name: "Meera Kulkarni", room: "A-208", meals: "Lunch + Dinner", amount: "₹3,200", status: "due", av: "MK", hue: "#c2620a" },
  ];

  return (
    <div className="flex flex-col gap-5">

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-3.5">
        {[
          {
            iconColor: "#1a7f5a", iconBg: "#e8f5ef",
            icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1a7f5a" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>,
            num: yourCollection, label: "Collected this month", trend: "+12%"
          },
          {
            iconColor: "#c0392b", iconBg: "#fdecea",
            icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c0392b" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01" /></svg>,
            num: yettoRecieve, label: "Yet to receive", trend: "3 pending"
          },
        ].map((k, i) => (
          <div
            key={i}
            className="bg-white border border-[#ede8e1] rounded-2xl p-4 shadow-sm flex flex-col gap-3 relative overflow-hidden"
          >
            {/* Subtle background circle */}
            <div
              className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full opacity-[0.07]"
              style={{ background: k.iconColor }}
            />
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: k.iconBg }}
            >
              {k.icon}
            </div>
            <div>
              <div className="text-[22px] font-bold text-[#1a1510] tracking-tight leading-none">{k.num}</div>
              <div className="flex items-center justify-between mt-1.5">
                <div className="text-[11px] text-[#9a8f82] font-medium">{k.label}</div>
                <span
                  className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                  style={{
                    background: i === 0 ? "#e8f5ef" : "#fdecea",
                    color: i === 0 ? "#1a7f5a" : "#c0392b"
                  }}
                >
                  {k.trend}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>



      {/* Future Feature */}

      {/* <CardWrap>
        <CardHead title="Overdue Payments" right={<ChipBadge type="chip-red">3 pending</ChipBadge>} />
        <div className="px-4 pb-3 pt-1">
          {DUES.map(d => <DueRow key={d.name} d={d} />)}
        </div>
      </CardWrap> */}



      {/* All Payments */}
      <CardWrap>
        <CardHead title="All Payments" />
        <div>
          {users?.map((payment, idx) => (
            <div
              key={payment.name}
              className="group flex items-center gap-3 px-5 py-3.5 border-b border-[#ede8e1] last:border-0 hover:bg-[#faf8f5] transition-all duration-150"
            >
              {/* Row number */}
              <span className="text-[11px] text-[#c5bdb3] font-mono w-4 shrink-0 select-none">
                {String(idx + 1).padStart(2, "0")}
              </span>

              <Avatar initials={payment.name.slice(0, 2)} hue={"#c2620a"} />

              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-semibold text-[#1a1510] truncate">{payment.name}</div>
                <div className="text-[11px] text-[#b0a598] mt-0.5 truncate">{payment.address}</div>
              </div>

              {editId === payment._id ? (
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-24 text-[13px] font-bold text-[#1a1510] border border-[#d4cdc4] rounded-lg px-2 py-1 bg-[#faf8f5] focus:outline-none focus:ring-2 focus:ring-[#c2620a]/30 focus:border-[#c2620a] transition-all"
                    autoFocus
                  />
                  <button
                    onClick={handleUpdate}
                    className="px-2.5 cursor-pointer py-1 text-[11px] font-semibold text-white bg-[#1a7f5a] rounded-lg hover:bg-[#166b4c] active:scale-95 transition-all duration-100 shadow-sm"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-2.5 cursor-pointer py-1 text-[11px] font-semibold text-[#7a6f64] bg-[#ede8e1] rounded-lg hover:bg-[#e0d9cf] active:scale-95 transition-all duration-100"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="text-[13px] font-bold text-[#1a1510] tabular-nums">
                  {payment.payment}
                </div>
              )}

              <Pill status={payment.payment > 0 ? "due" : "paid"} />

              {/* Edit icon — appears on hover */}
              <button
                onClick={() => handleEdit(payment._id, payment.payment)}
                className="cursor-pointer  w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#ede8e1] text-[#9a8f82] hover:text-[#1a1510]"
              >
                <Edit size={13} />
              </button>
            </div>
          ))}
        </div>
      </CardWrap>

     {loader && (
  <div className="fixed inset-0 flex items-center justify-center bg-[#f6f3ef]/40 backdrop-blur-sm z-50">
    <Loader />
  </div>
)}
    </div>
  );
}

export default PaymentsPage;