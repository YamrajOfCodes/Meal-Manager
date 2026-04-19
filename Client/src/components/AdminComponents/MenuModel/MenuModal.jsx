import { Plus, Trash2, X } from 'lucide-react'
import React from 'react'

const MenuModal = ({closeModal,rows,tab,updateRowField,setRows,save}) => {
  return (
    <div>
       <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0.5 mb-12 sm:mb-0" onClick={closeModal}>
          <div
            className="w-full sm:max-w-md bg-white sm:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* header */}
            <div className="flex items-center justify-between px-6 py-6 border-b border-gray-100">
              <div>
                <h3 className="text-[16px] font-bold text-gray-900">Add to {tab}</h3>
                <p className="text-xs text-gray-400 mt-0.5">mealTime: <span className="font-semibold text-gray-600">"{tab}"</span></p>
              </div>
              <button onClick={closeModal} className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors">
                <X size={15} />
              </button>
            </div>

            {/* col headers */}
            <div className="grid grid-cols-[1fr_120px_72px_32px] gap-3 px-6 pt-5 pb-2">
              {["name", "price (₹)", "isVeg", ""].map((h) => (
                <p key={h} className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{h}</p>
              ))}
            </div>

            {/* rows */}
            <div className="px-6 space-y-3 pb-3" style={{ maxHeight: 300, overflowY: "auto" }}>
              {rows.map((row, i) => (
                <div key={i} className="grid grid-cols-[1fr_120px_72px_32px] gap-3 items-center">
                  <input
                    placeholder="e.g. Idli Sambhar"
                    value={row.name}
                    onChange={(e) => updateRowField(i, "name", e.target.value)}
                    className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-300 outline-none focus:border-gray-400 transition-colors w-full bg-white"
                  />
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none select-none">₹</span>
                    <input
                      type="number"
                      placeholder="0"
                      value={row.price}
                      onChange={(e) => updateRowField(i, "price", e.target.value)}
                      className="w-full rounded-xl border border-gray-200 pl-7 pr-3 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-400 transition-colors bg-white"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => updateRowField(i, "isVeg", !row.isVeg)}
                    className={`rounded-xl border py-2.5 text-[11px] font-bold tracking-wide transition-all ${
                      row.isVeg
                        ? "bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                        : "bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                    }`}
                  >
                    {row.isVeg ? "Veg" : "Non"}
                  </button>
                  <button
                    onClick={() => rows.length > 1 && setRows((p) => p.filter((_, idx) => idx !== i))}
                    disabled={rows.length === 1}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-300 hover:bg-red-50 hover:text-red-500 disabled:opacity-20 transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>

            <div className="px-6 pb-5 pt-1">
              <button
                onClick={() => setRows((p) => [...p, { name: "", price: "", isVeg: true }])}
                className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-gray-700 transition-colors"
              >
                <Plus size={13} strokeWidth={2.5} /> Add another row
              </button>
            </div>

            {/* footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
              <span className="text-xs text-gray-400">
                {rows.filter((r) => r.name.trim()).length} item{rows.filter((r) => r.name.trim()).length !== 1 ? "s" : ""} ready
              </span>
              <div className="flex gap-2">
                <button onClick={closeModal} className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button
                  onClick={save}
                  disabled={!rows.some((r) => r.name.trim())}
                  className="px-5 py-2 rounded-xl bg-gray-900 text-sm font-semibold text-white hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}

export default MenuModal
