
const STATUS_STYLES = {
  paid:    { pill: "bg-green-100 text-green-700",  label:"Paid"    },
  due:     { pill: "bg-red-100 text-red-600",      label:"Due"     },
  partial: { pill: "bg-amber-100 text-amber-700",  label:"Partial" },
};

export function Avatar({ initials, hue, size = 34 }) {
  return (
    <div
      className="flex items-center justify-center rounded-full font-bold flex-shrink-0 text-xs"
      style={{ width: size, height: size, background: `${hue}18`, color: hue }}
    >
      {initials}
    </div>
  );
}

export function Pill({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.due;
  return (
    <span className={`inline-flex items-center text-[10px] font-semibold rounded-full px-2.5 py-0.5 ${s.pill}`}>
      {s.label}
    </span>
  );
}

export function CardWrap({ children, className = "" }) {
  return (
    <div className={`bg-white border border-[#e8e2d9] rounded-[14px] shadow-sm overflow-hidden ${className}`}>
      {children}
    </div>
  );
}

export function CardHead({ title, sub, right }) {
  return (
    <div className="px-5 py-4 border-b border-[#e8e2d9] flex items-center justify-between">
      <div>
        <div className="text-sm font-bold text-[#1a1510]">{title}</div>
        {sub && <div className="text-[11px] text-[#9a8f82] mt-0.5">{sub}</div>}
      </div>
      {right}
    </div>
  );
}


export function DueRow({ d }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-[#e8e2d9] last:border-0">
      <Avatar initials={d.av} hue={d.hue} />
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-semibold text-[#1a1510]">{d.name}</div>
        <div className="text-[11px] text-[#9a8f82] mt-0.5">Due since {d.since}</div>
      </div>
      <div className="text-[13px] font-bold text-[#c0392b]">{d.amt}</div>
      <button className="px-3 py-1.5 rounded-[6px] bg-[#fdecea] text-[#c0392b] text-[11px] font-semibold border border-[rgba(192,57,43,.15)] cursor-pointer hover:opacity-80 transition-opacity whitespace-nowrap ml-2">
        Remind
      </button>
    </div>
  );
}

 export function MenuRow({ m }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[#e8e2d9] last:border-0">
      <span className="text-[10px] font-bold uppercase tracking-wider text-[#9a8f82] min-w-[68px]">{m.slot}</span>
      <span className="flex-1 text-[13px] text-[#1a1510] font-medium">{m.dish}</span>
      <span className="text-[11px] text-[#9a8f82]">{m.kcal}</span>
    </div>
  );
}

 export function ChipBadge({ type, children }) {
  const styles = {
    "chip-green": "bg-green-100 text-green-700",
    "chip-red":   "bg-red-100 text-red-600",
    "chip-amber": "bg-amber-100 text-amber-700",
    "chip-blue":  "bg-blue-100 text-blue-700",
  };
  return (
    <span className={`text-[10px] font-semibold rounded-full px-2.5 py-0.5 ${styles[type] || styles["chip-blue"]}`}>
      {children}
    </span>
  );
}