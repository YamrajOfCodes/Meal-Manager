{/* HEADER */}
<div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
  <div>
    <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
    <p className="text-sm text-gray-500">Manage all your mess customers</p>
  </div>

  <button className="rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800">
    + Add Customer
  </button>
</div>

{/* STATS */}
<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
  <div className="bg-white p-4 rounded-xl border">
    <p className="text-sm text-gray-400">Total</p>
    <p className="text-xl font-bold">{customers.length}</p>
  </div>

  <div className="bg-white p-4 rounded-xl border">
    <p className="text-sm text-green-500">Active</p>
    <p className="text-xl font-bold">
      {customers.filter(c => c.isactive).length}
    </p>
  </div>

  <div className="bg-white p-4 rounded-xl border">
    <p className="text-sm text-gray-400">Inactive</p>
    <p className="text-xl font-bold">
      {customers.filter(c => !c.isactive).length}
    </p>
  </div>
</div>

{/* SEARCH + FILTER */}
<div className="mb-4 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
  <input
    type="text"
    placeholder="Search customers..."
    className="w-full md:w-80 rounded-xl border px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
  />

  <select className="rounded-xl border px-3 py-2 text-sm">
    <option>All</option>
    <option>Active</option>
    <option>Inactive</option>
  </select>
</div>

{/* TABLE */}
<div className="rounded-2xl border bg-white overflow-hidden shadow-sm">
  <table className="w-full text-sm">
    <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
      <tr>
        <th className="px-4 py-3 text-left">Customer</th>
        <th className="px-4 py-3 text-left">Mess</th>
        <th className="px-4 py-3 text-left">City</th>
        <th className="px-4 py-3 text-left">Phone</th>
        <th className="px-4 py-3 text-left">Status</th>
        <th className="px-4 py-3 text-right">Actions</th>
      </tr>
    </thead>

    <tbody>
      {customers.map((c, i) => {
        const col = COLORS[i % COLORS.length]
        return (
          <tr key={c._id} className="border-t hover:bg-gray-50 transition">
            <td className="px-4 py-3">
              <div className="flex items-center gap-3">
                <div className={`h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold ${col.bg} ${col.text}`}>
                  {initials(c.name)}
                </div>
                <div>
                  <p className="font-semibold">{c.name}</p>
                  <p className="text-xs text-gray-400">{c.email}</p>
                </div>
              </div>
            </td>

            <td className="px-4 py-3">
              <p className="font-medium">{c.messName}</p>
              <p className="text-xs text-gray-400">{c.messCode}</p>
            </td>

            <td className="px-4 py-3">{c.city}</td>
            <td className="px-4 py-3 font-mono">{c.phone}</td>

            <td className="px-4 py-3">
              <span className={`px-2 py-1 text-xs rounded-full font-semibold ${
                c.isactive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
              }`}>
                {c.isactive ? 'Active' : 'Inactive'}
              </span>
            </td>

            <td className="px-4 py-3 text-right">
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => openEdit(c)}
                  className="px-3 py-1 text-xs rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100"
                >
                  Edit
                </button>
                <button
                  onClick={() => openDel(c)}
                  className="px-3 py-1 text-xs rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        )
      })}
    </tbody>
  </table>
</div>