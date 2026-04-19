import React, { useState } from 'react'
import { Pencil, Trash2, X } from 'lucide-react'

const STATIC_CUSTOMERS = [
  {
    _id: '1',
    name: 'system',
    email: 'system@123',
    isactive: true,
    messCode: 'OM01',
    messName: 'OM Mess',
    city: 'Pune',
    phone: '2345678978',
  },
]

const initials = (name = '') =>
  name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()

const COLORS = [
  { bg: 'bg-orange-100', text: 'text-orange-700' },
  { bg: 'bg-violet-100', text: 'text-violet-700' },
  { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  { bg: 'bg-blue-100', text: 'text-blue-700' },
]

export default function CustomersPage() {
  const [customers, setCustomers] = useState(STATIC_CUSTOMERS)
  const [editItem, setEditItem]   = useState(null)
  const [form, setForm]           = useState({})
  const [delItem, setDelItem]     = useState(null)

  const openEdit   = (c) => { setEditItem(c); setForm({ ...c }) }
  const closeEdit  = () => setEditItem(null)
  const saveEdit   = () => {
    setCustomers((prev) => prev.map((c) => (c._id === form._id ? { ...form } : c)))
    closeEdit()
  }

  const openDel    = (c) => setDelItem(c)
  const closeDel   = () => setDelItem(null)
  const confirmDel = () => {
    setCustomers((prev) => prev.filter((c) => c._id !== delItem._id))
    closeDel()
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Customers</h1>
            <p className="text-sm text-gray-500">{customers.length} total</p>
          </div>
        </div>

        {/* ── DESKTOP TABLE ── */}
        <div className="hidden md:block rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {['Name', 'Email', 'Mess', 'City', 'Phone', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-400">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {customers.map((c, i) => {
                const col = COLORS[i % COLORS.length]
                return (
                  <tr key={c._id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${col.bg} ${col.text}`}>
                          {initials(c.name)}
                        </div>
                        <span className="text-sm font-semibold text-gray-900 capitalize">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{c.email}</td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-gray-900">{c.messName}</div>
                      <div className="text-xs text-gray-400 font-mono">{c.messCode}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{c.city}</td>
                    <td className="px-4 py-3 text-sm font-mono text-gray-600">{c.phone}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${c.isactive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${c.isactive ? 'bg-green-500' : 'bg-gray-400'}`} />
                        {c.isactive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(c)} className="h-8 w-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => openDel(c)} className="h-8 w-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* ── MOBILE CARDS ── */}
        <div className="flex flex-col gap-3 md:hidden">
          {customers.map((c, i) => {
            const col = COLORS[i % COLORS.length]
            return (
              <div key={c._id} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${col.bg} ${col.text}`}>
                      {initials(c.name)}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-900 capitalize">{c.name}</div>
                      <div className="text-xs text-gray-400">{c.email}</div>
                    </div>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${c.isactive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${c.isactive ? 'bg-green-500' : 'bg-gray-400'}`} />
                    {c.isactive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 rounded-xl bg-gray-50 p-3 mb-3">
                  {[
                    { label: 'Mess',  value: c.messName },
                    { label: 'Code',  value: c.messCode, mono: true },
                    { label: 'City',  value: c.city },
                    { label: 'Phone', value: c.phone, mono: true },
                  ].map((f) => (
                    <div key={f.label}>
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">{f.label}</div>
                      <div className={`text-sm text-gray-800 ${f.mono ? 'font-mono' : 'font-medium'}`}>{f.value}</div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end gap-2">
                  <button onClick={() => openEdit(c)} className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-colors">
                    <Pencil size={12} /> Edit
                  </button>
                  <button onClick={() => openDel(c)} className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors">
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* ── EDIT MODAL ── */}
        {editItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={closeEdit}>
            <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                <h2 className="text-sm font-bold text-gray-900">Edit Customer</h2>
                <button onClick={closeEdit} className="h-7 w-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100">
                  <X size={16} />
                </button>
              </div>
              <div className="p-5 grid grid-cols-2 gap-4">
                {[
                  { label: 'Name',      key: 'name' },
                  { label: 'Email',     key: 'email' },
                  { label: 'Mess Name', key: 'messName' },
                  { label: 'Mess Code', key: 'messCode' },
                  { label: 'City',      key: 'city' },
                  { label: 'Phone',     key: 'phone' },
                ].map((f) => (
                  <div key={f.key} className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">{f.label}</label>
                    <input
                      value={form[f.key] || ''}
                      onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                      className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-400 focus:bg-white transition-colors"
                    />
                  </div>
                ))}
                <div className="col-span-2 flex items-center gap-3">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Status</label>
                  <button
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, isactive: !p.isactive }))}
                    className={`relative inline-flex h-5 w-9 rounded-full transition-colors ${form.isactive ? 'bg-green-500' : 'bg-gray-300'}`}
                  >
                    <span className={`inline-block h-4 w-4 mt-0.5 rounded-full bg-white shadow transition-transform ${form.isactive ? 'translate-x-4' : 'translate-x-0.5'}`} />
                  </button>
                  <span className={`text-sm font-semibold ${form.isactive ? 'text-green-700' : 'text-gray-400'}`}>
                    {form.isactive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              <div className="flex justify-end gap-2 border-t border-gray-100 px-5 py-3">
                <button onClick={closeEdit} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
                <button onClick={saveEdit} className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700">Save</button>
              </div>
            </div>
          </div>
        )}

        {/* ── DELETE MODAL ── */}
        {delItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={closeDel}>
            <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                <h2 className="text-sm font-bold text-gray-900">Delete Customer</h2>
                <button onClick={closeDel} className="h-7 w-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100">
                  <X size={16} />
                </button>
              </div>
              <div className="px-5 py-5">
                <p className="text-sm text-gray-500 leading-relaxed">
                  Are you sure you want to delete{' '}
                  <span className="font-bold text-gray-900 capitalize">{delItem.name}</span>? This cannot be undone.
                </p>
              </div>
              <div className="flex justify-end gap-2 border-t border-gray-100 px-5 py-3">
                <button onClick={closeDel} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
                <button onClick={confirmDel} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700">Delete</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}