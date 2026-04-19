import React from 'react'

const MenuStat = ({setTab,times = {},slotItems = [],preview = "",more = "",isActive = false,slot}) => {
  const total = slotItems.reduce((sum, item) => sum + (item.price || 0), 0);

  return (
    <div>
       <div
        key={slot}
        onClick={() => setTab(slot)}
        className={`cursor-pointer rounded-2xl border p-5 transition-all ${
        isActive ? "bg-gray-900 border-gray-900" : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{slot}</span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    isActive ? "bg-white/10 text-gray-300" : "bg-gray-100 text-gray-500"
                  }`}>
                    {times[slot] ? times[slot].split("–")[0].trim() : ""}
                  </span>
                </div>
                <p className={`text-2xl font-bold tracking-tight leading-none mb-1 ${isActive ? "text-white" : "text-gray-900"}`}>
                  ₹{total}
                </p>
                <p className={`text-xs font-medium mb-3 ${isActive ? "text-gray-400" : "text-gray-500"}`}>
                  {slotItems.length} item{slotItems.length !== 1 ? "s" : ""}
                </p>
                {slotItems.length > 0 ? (
                  <p className={`text-[11px] leading-relaxed truncate ${isActive ? "text-gray-500" : "text-gray-400"}`}>
                    {preview}{more}
                  </p>
                ) : (
                  <p className={`text-[11px] ${isActive ? "text-gray-600" : "text-gray-300"}`}>No items yet</p>
                )}
              </div> 
    </div>
  )
}

export default MenuStat
