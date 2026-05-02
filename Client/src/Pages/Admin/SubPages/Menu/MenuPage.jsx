import { useEffect, useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { useAddMenuItem, useGetMenuItems } from "../../../../hooks/Admin/adminHooks";
import MenuModal from "../../../../components/AdminComponents/MenuModel/MenuModal";
import MenuStat from "../../../../components/AdminComponents/MenuStats/MenuStat";
import Loader from "../../../../components/AdminComponents/Shared/Loader";

const INIT_MENU = {
  Breakfast: [
    { id: 1, name: "Poha",        price: 30, isVeg: true,  mealTime: "Breakfast" },
    { id: 2, name: "Masala Chai", price: 10, isVeg: true,  mealTime: "Breakfast" },
    { id: 3, name: "Boiled Eggs", price: 20, isVeg: false, mealTime: "Breakfast" },
  ],
  Lunch: [
    { id: 4, name: "Dal Tadka",  price: 60, isVeg: true, mealTime: "Lunch" },
    { id: 5, name: "Jeera Rice", price: 40, isVeg: true, mealTime: "Lunch" },
    { id: 6, name: "Roti (×2)",  price: 20, isVeg: true, mealTime: "Lunch" },
    { id: 7, name: "Papad",      price: 10, isVeg: true, mealTime: "Lunch" },
  ],
  Dinner: [
    { id: 8,  name: "Rajma Masala", price: 70, isVeg: true, mealTime: "Dinner" },
    { id: 9,  name: "Steamed Rice", price: 30, isVeg: true, mealTime: "Dinner" },
    { id: 10, name: "Green Salad",  price: 20, isVeg: true, mealTime: "Dinner" },
  ],
};

const SLOTS     = ["Breakfast", "Lunch", "Dinner"];
const SLOT_TIME = { Breakfast: "7:00 – 10:00 AM", Lunch: "12:00 – 3:00 PM", Dinner: "7:00 – 10:00 PM" };

let uid = 300;

export default function MenuPage() {


  const [tab, setTab]     = useState("Breakfast");
  const [modal, setModal] = useState(false);
  const [rows, setRows]   = useState([{ name: "", price: "", isVeg: true }]);
  const [times, setTimes] = useState({ ...SLOT_TIME });
  const [menu, setMenu] = useState({ Breakfast: [], Lunch: [], Dinner: [] });
  const { mutate: addMenuItems } = useAddMenuItem();
  const [messCode, setMessCode] = useState(null);
  const { data: fetchedItems = [] } = useGetMenuItems(messCode);
  const [loader,setLoader] = useState(false);


useEffect(() => {
  const token = localStorage.getItem("login");
  if (token) {
    const decoded = jwtDecode(token);
    setMessCode(decoded?.messCode);
  }
}, []);

 useEffect(() => {
  if (!fetchedItems.length) return;

 const today = new Date().toDateString();

const grouped = fetchedItems.reduce((acc, item) => {
  const itemDate = new Date(item.updatedAt).toDateString();

  if (itemDate !== today) return acc; 

  const mealTime = item.mealTime || "Breakfast";

  if (!acc[mealTime]) acc[mealTime] = [];
  acc[mealTime].push(item);

  return acc;
}, { Breakfast: [], Lunch: [], Snacks: [], Dinner: [] });

  console.log(grouped)

  setMenu(prev =>
    JSON.stringify(prev) !== JSON.stringify(grouped) ? grouped : prev
  );
}, [fetchedItems]);

  console.log(menu)

  const items    = menu?.[tab] || [];
  const subtotal = items?.reduce((a, i) => a + i.price, 0);
  const dayTotal = Object?.values(menu)?.flat()?.reduce((a, i) => a + i.price, 0);


  const openModal  = () => { setRows([{ name: "", price: "", isVeg: true }]); setModal(true); };
  const closeModal = () => setModal(false);
  const updateRowField = (rowIndex, fieldName, value) =>
    setRows((previousRows) =>
      previousRows.map((row, index) =>
        index === rowIndex ? { ...row, [fieldName]: value } : row
      )
    );

  const save = () => {
    setLoader(true);
    const valid = rows.filter((r) => r.name.trim());
    console.log(valid)
    if (!valid.length) return;
    setMenu((p) => ({
      ...p,
      [tab]: [
        ...p[tab],
        ...valid.map((r) => ({
          id:       uid++,
          name:     r.name.trim(),
          price:    Number(r.price) || 0,
          isVeg:    r.isVeg,
          mealTime: tab,    
        })),
      ],
    }));
     
    const data = {
      messCode,
      name: valid[0].name.trim(),
      price: Number(valid[0].price) || 0, 
      isVeg: valid[0].isVeg,
      mealTime: tab, 
    }

    addMenuItems(data,{
      onSuccess:()=>{
        setLoader(false);
      
      },
      onError:()=>{
        setLoader(false);
      }
    });

    closeModal();
  };

  const del = (id) => setMenu((p) => ({ ...p, [tab]: p[tab].filter((i) => i.id !== id) }));

  return (
    <div className="min-h-screen p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
              {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
            </p>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Menu Manager</h1>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400 mb-0.5">Day total</p>
            <p className="text-xl font-bold text-gray-900">₹{dayTotal}</p>
          </div>
        </div>

     
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">

        
          <div className="flex border-b border-gray-200">
            {SLOTS.map((s) => {
              const count  = menu[s].length;
              const active = tab === s;
              return (
                <button
                  key={s}
                  onClick={() => setTab(s)}
                  className={`flex-1 flex flex-col items-center py-4 px-3 transition-colors relative text-sm font-semibold
                    ${active ? "text-gray-900 bg-white" : "text-gray-400 bg-gray-50 hover:text-gray-600 hover:bg-gray-50"}`}
                >
                  {active && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 rounded-t-full" />}
                  {s}
                  <span className={`text-[10px] font-semibold mt-0.5 ${active ? "text-gray-500" : "text-gray-300"}`}>
                    {count} item{count !== 1 ? "s" : ""} · ₹{menu[s].reduce((a, i) => a + i.price, 0)}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">Serving time</span>
              <input
                value={times[tab]}
                onChange={(e) => setTimes((p) => ({ ...p, [tab]: e.target.value }))}
                className="text-xs font-semibold text-gray-700 bg-transparent outline-none border-b border-dashed border-gray-300 focus:border-gray-600 transition-colors w-36"
              />
            </div>
            <button
              onClick={openModal}
              className="flex items-center gap-1.5 text-xs font-bold text-white bg-gray-900 hover:bg-gray-700 transition-colors px-3.5 py-1.5 rounded-lg"
            >
              <Plus size={13} strokeWidth={2.5} />
              Add item
            </button>
          </div>

          {/* Table */}
          {items.length > 0 ? (
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400 w-8">#</th>
                  <th className="px-2 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">Name</th>
                  <th className="px-2 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400 w-24">Meal Time</th>
                  <th className="px-2 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400 w-20">Type</th>
                  <th className="px-2 py-3 text-right text-[10px] font-bold uppercase tracking-widest text-gray-400 w-24">Price</th>
                  <th className="px-5 py-3 w-10" />
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors group">
                    <td className="px-5 py-3.5 text-xs text-gray-300 font-mono">
                      {String(idx + 1).padStart(2, "0")}
                    </td>
                    <td className="px-2 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <span className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${item.isVeg ? "bg-green-500" : "bg-red-500"}`} />
                        <span className="text-sm font-medium text-gray-800">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-2 py-3.5">
                      <span className="text-xs text-gray-400">{item.mealTime}</span>
                    </td>
                    <td className="px-2 py-3.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.isVeg ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                        {item.isVeg ? "Veg" : "Non-veg"}
                      </span>
                    </td>
                    <td className="px-2 py-3.5 text-right text-sm font-semibold text-gray-900">₹{item.price}</td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => del(item.id)}
                        className="opacity-0 group-hover:opacity-100 flex h-6 w-6 items-center justify-center rounded-md text-gray-300 hover:bg-red-50 hover:text-red-500 transition-all"
                      >
                        <Trash2 size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50 border-t border-gray-200">
                  <td colSpan={4} className="px-5 py-3 text-xs font-semibold text-gray-500">
                    {tab} subtotal — {items.length} item{items.length !== 1 ? "s" : ""}
                  </td>
                  <td className="px-2 py-3 text-right text-sm font-bold text-gray-900">₹{subtotal}</td>
                  <td />
                </tr>
              </tfoot>
            </table>
          ) : (
            <div onClick={openModal} className="flex flex-col items-center justify-center py-16 cursor-pointer group">
              <div className="h-10 w-10 rounded-full border-2 border-dashed border-gray-200 flex items-center justify-center mb-3 group-hover:border-gray-400 transition-colors">
                <Plus size={16} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
              </div>
              <p className="text-sm text-gray-400 group-hover:text-gray-600 transition-colors font-medium">
                No items for {tab} yet
              </p>
              <p className="text-xs text-gray-300 mt-1">Click to add items</p>
            </div>
          )}
        </div>

        {/* ── Slot stat boxes ── */}
        <div className="mt-5 grid grid-cols-3 gap-4">
          {SLOTS.map((slot) => {
            const slotItems = menu[slot];
            const total     = slotItems.reduce((a, i) => a + i.price, 0);
            const isActive  = tab === slot;
            const preview   = slotItems.slice(0, 2).map((i) => i.name).join(", ");
            const more      = slotItems.length > 2 ? ` +${slotItems.length - 2} more` : "";
            return (
            <>
            <MenuStat
              setTab={setTab}
              times={times}
              slotItems={slotItems}
              preview={preview}
              more={more}
              isActive={isActive}
              slot={slot}
            />
            </>
            );
          })}
        </div>

      </div>

      {modal && (
       <MenuModal
      closeModal={closeModal}
      rows={rows}
      tab={tab}
      updateRowField={updateRowField}
      setRows={setRows}
      save={save}
       />
      )}

      {loader && (
        <div className="fixed inset-0 flex items-center justify-center bg-[#f6f3ef]/40 backdrop-blur-sm z-50">
          <Loader />
        </div>
      )}
    </div>
  );
}