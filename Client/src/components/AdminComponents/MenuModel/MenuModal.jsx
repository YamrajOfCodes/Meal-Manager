import { useState, useEffect, useRef } from "react"
import { X, Plus, Trash2, Calendar, Clock, ChevronDown } from "lucide-react"

const MEAL_TIMES = [
  { value: "Breakfast", label: "Breakfast", },
  { value: "Lunch",     label: "Lunch",     },
  { value: "Dinner",    label: "Dinner",    },
  // { value: "Snacks",    label: "Snacks",    },
]

const emptyRow = () => ({ id: Date.now() + Math.random(), name: "", price: "", isVeg: true })

const MenuModal = ({ closeModal, save, initialTab = "" }) => {
  const [date, setDate]       = useState(new Date().toISOString().split("T")[0])
  const [meal, setMeal]       = useState(initialTab.toLowerCase() || "")
  const [rows, setRows]       = useState([emptyRow()])

  const dateRef = useRef(null)
  const mealRef = useRef(null)

  const updateRow = (id, field, value) =>
    setRows(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r))

  const removeRow = (id) =>
    setRows(prev => prev.length > 1 ? prev.filter(r => r.id !== id) : prev)

  const readyCount = rows.filter(r => r.name.trim()).length
  const canSave    = readyCount > 0 && date && meal

  const handleSave = () => {
    if (!canSave) return
    const validRows = rows.filter(r => r.name.trim())
    save?.({ date, meal, items: validRows })
    closeModal?.()
  }

  // close on Escape
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && closeModal?.()
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [closeModal])

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-2 sm:p-4"
      onClick={closeModal}
    >
      <div
        className="w-full sm:max-w-[480px] bg-white sm:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >

        {/* ── Header ── */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <h3 className="text-[17px] font-semibold text-gray-900 tracking-tight">
              Add menu items
            </h3>
            <p className="text-[12px] text-gray-400 mt-0.5">
              Fill in details below and save
            </p>
          </div>
          <button
            onClick={closeModal}
            className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors mt-0.5"
          >
            <X size={14} />
          </button>
        </div>

        {/* ── Date + Meal dropdown ── */}
        <div className="px-6 pt-5 grid grid-cols-2 gap-3">

          {/* Date */}
          <div>
            <label
              htmlFor="menu-date"
              className="block text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1.5 cursor-pointer"
            >
              Date
            </label>
            <div
              className="relative cursor-pointer"
              onClick={() => dateRef.current?.showPicker?.()}
              role="button"
              aria-label="Open date picker"
              tabIndex={-1}
            >
              <Calendar
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
              <input
                id="menu-date"
                ref={dateRef}
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                onClick={() => dateRef.current?.showPicker?.()}
                onFocus={() => dateRef.current?.showPicker?.()}
                className="w-full pl-8 pr-3 py-2.5 text-[13px] text-gray-800 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-gray-400 focus:bg-white transition-all cursor-pointer"
                aria-label="Select date"
              />
            </div>
          </div>

          {/* Meal time dropdown */}
          <div>
            <label
              htmlFor="menu-meal"
              className="block text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1.5 cursor-pointer"
            >
              Meal time
            </label>
            <div
              className="relative cursor-pointer"
              onClick={() => mealRef.current?.focus()}
              role="button"
              aria-label="Open meal time selector"
              tabIndex={-1}
            >
              <Clock
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10"
              />
              <select
                id="menu-meal"
                ref={mealRef}
                value={meal}
                onChange={(e) => setMeal(e.target.value)}
                className="w-full appearance-none pl-8 pr-8 py-2.5 text-[13px] text-gray-800 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-gray-400 focus:bg-white transition-all cursor-pointer"
                aria-label="Select meal time"
              >
                <option value="">Select…</option>
                {MEAL_TIMES.map(m => (
                  <option key={m.value} value={m.value}>
                    {m.emoji} {m.label}
                  </option>
                ))}
              </select>
              <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* ── Quick-select pills ── */}
        <div className="px-6 pt-3 flex gap-2 flex-wrap">
          {MEAL_TIMES.map(m => (
            <button
              key={m.value}
              onClick={() => setMeal(m.value)}
              className={`px-3 py-1.5 rounded-full text-[12px] font-medium border transition-all ${
                meal === m.value
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-gray-50 text-gray-500 border-gray-200 hover:border-gray-400 hover:text-gray-700"
              }`}
            >
              {m.emoji} {m.label}
            </button>
          ))}
        </div>

        {/* ── Divider ── */}
        <div className="mx-6 my-4 border-t border-gray-100" />

        {/* ── Column headers ── */}
        <div className="grid gap-3 px-6 pb-2" style={{ gridTemplateColumns: "1fr 108px 72px 32px" }}>
          {["Item name", "Price (₹)", "Type", ""].map((h) => (
            <p key={h} className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 m-0">
              {h}
            </p>
          ))}
        </div>

        {/* ── Rows ── */}
        <div
          className="px-6 flex flex-col gap-2.5 overflow-y-auto"
          style={{ maxHeight: 240 }}
        >
          {rows.map((row) => (
            <div
              key={row.id}
              className="grid gap-3 items-center"
              style={{ gridTemplateColumns: "1fr 108px 72px 32px" }}
            >
              {/* Name */}
              <input
                placeholder="e.g. Idli Sambhar"
                value={row.name}
                onChange={(e) => updateRow(row.id, "name", e.target.value)}
                className="rounded-xl border border-gray-200 px-3 py-2.5 text-[13px] text-gray-900 placeholder-gray-300 outline-none focus:border-gray-400 bg-white transition-colors"
              />

              {/* Price */}
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[13px] pointer-events-none select-none">
                  ₹
                </span>
                <input
                  type="number"
                  placeholder="0"
                  value={row.price}
                  onChange={(e) => updateRow(row.id, "price", e.target.value)}
                  className="w-full rounded-xl border border-gray-200 pl-7 pr-2 py-2.5 text-[13px] text-gray-900 outline-none focus:border-gray-400 bg-white transition-colors"
                />
              </div>

              {/* Veg toggle */}
              <button
                type="button"
                onClick={() => updateRow(row.id, "isVeg", !row.isVeg)}
                className={`rounded-xl border py-2.5 text-[11px] font-semibold tracking-wide transition-all ${
                  row.isVeg
                    ? "bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                    : "bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                }`}
              >
                {row.isVeg ? "Veg" : "Non-veg"}
              </button>

              {/* Delete */}
              <button
                onClick={() => removeRow(row.id)}
                disabled={rows.length === 1}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-300 hover:bg-red-50 hover:text-red-400 disabled:opacity-20 transition-colors"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>

        {/* ── Add row ── */}
        <div className="px-6 pt-3 pb-1">
          <button
            onClick={() => setRows(prev => [...prev, emptyRow()])}
            className="flex items-center gap-1.5 text-[12px] font-semibold text-gray-400 hover:text-gray-700 transition-colors"
          >
            <Plus size={13} strokeWidth={2.5} /> Add another row
          </button>
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center justify-between px-6 py-4 mt-3 border-t border-gray-100 bg-gray-50">
          <span className="text-[12px] text-gray-400">
            {readyCount} item{readyCount !== 1 ? "s" : ""} ready
          </span>
          <div className="flex gap-2">
            <button
              onClick={closeModal}
              className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-[13px] font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!canSave}
              className="px-5 py-2 rounded-xl bg-gray-900 text-[13px] font-semibold text-white hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Save items
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default MenuModal