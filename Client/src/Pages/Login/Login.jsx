import { useState } from "react";

// Tiffin box SVG icon
const TiffinIcon = ({ size = 24, color = "white", strokeWidth = 2 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="11" width="18" height="3" rx="1" />
    <rect x="5" y="7" width="14" height="4" rx="1" />
    <rect x="4" y="14" width="16" height="4" rx="1" />
    <line x1="8" y1="18" x2="8" y2="21" />
    <line x1="16" y1="18" x2="16" y2="21" />
  </svg>
);

const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const features = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#b45309" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    bgColor: "bg-orange-50",
    title: "Order Management",
    desc: "Daily tiffin orders, pauses & custom meals",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    bgColor: "bg-green-50",
    title: "Delivery Tracking",
    desc: "Real-time dispatch & delivery status",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
      </svg>
    ),
    bgColor: "bg-blue-50",
    title: "Billing & Payments",
    desc: "Subscriptions, invoices & UPI collection",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87" />
        <path d="M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
    bgColor: "bg-violet-50",
    title: "Customer CRM",
    desc: "Subscriber profiles, history & feedback",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e11d48" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
      </svg>
    ),
    bgColor: "bg-rose-50",
    title: "Menu Planning",
    desc: "Weekly menus, nutrition & diet plans",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
    bgColor: "bg-teal-50",
    title: "Analytics",
    desc: "Revenue, growth & operational reports",
  },
];

const stats = [
  { num: "500+", label: "Mess owners" },
  { num: "1.2L+", label: "Meals tracked daily" },
  { num: "99.8%", label: "Uptime SLA" },
  { num: "4.9★", label: "Avg. rating" },
];

const roles = ["Owner / Admin", "Delivery Staff", "Cook"];

// ─── Feature Card ────────────────────────────────────────────────────────────
function FeatureCard({ feature }) {
  return (
    <div className="group bg-amber-50 border border-amber-100 rounded-2xl p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:shadow-amber-900/10 cursor-default">
      <div className={`w-9 h-9 ${feature.bgColor} rounded-xl flex items-center justify-center mb-2.5`}>
        {feature.icon}
      </div>
      <p className="text-xs font-semibold text-stone-700 mb-0.5">{feature.title}</p>
      <p className="text-[11px] text-stone-500 leading-relaxed">{feature.desc}</p>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function TiffinTrackSignIn() {
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1800);
  };

  return (
    <div className="flex min-h-screen overflow-hidden bg-amber-50 font-sans">

      {/* ══════════ LEFT PANEL ══════════ */}
      <div className="flex-1 bg-white flex flex-col px-12 py-10 relative overflow-hidden hidden md:flex">
        {/* Decorative radial glow */}

        {/* Brand Header */}
        <div className="flex items-center gap-3 mb-12 relative z-10">
          <div className="w-11 h-11 bg-amber-900 rounded-xl flex items-center justify-center shrink-0">
            <TiffinIcon size={24} />
          </div>
          <div>
            <p className="font-serif text-[22px] text-amber-950 leading-none">TiffinTrack</p>
            <p className="text-[11px] text-stone-500 mt-0.5 tracking-wide">All-in-one Mess Management Platform</p>
          </div>
        </div>

        {/* Hero */}
        <div className="relative z-10 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 text-[11px] font-medium px-3 py-1 rounded-full mb-4 tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
            Trusted by 500+ mess owners across India
          </div>
          <h1 className="font-serif text-4xl text-amber-950 leading-snug mb-3.5">
            "Complete Digital<br />
            Solution for Your{" "}
            <span className="text-amber-700">Mess"</span>
          </h1>
          <p className="text-sm text-stone-500 leading-relaxed max-w-md">
            Upgrade your mess operations in this digital era with TiffinTrack — increase
            customer satisfaction, track deliveries in real-time, and grow your business
            effortlessly.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3.5 mb-10 relative z-10">
          {features.map((f, i) => (
            <FeatureCard key={i} feature={f} />
          ))}
        </div>

        {/* Stats Row */}
        <div className="flex gap-8 relative z-10">
          {stats.map((s, i) => (
            <div key={i} className="flex items-stretch gap-8">
              {i > 0 && <div className="w-px bg-stone-300 self-stretch" />}
              <div>
                <p className="font-serif text-[28px] text-amber-800 leading-none">{s.num}</p>
                <p className="text-[11px] text-stone-500 mt-1">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom wave decoration */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1.5 opacity-10"
          style={{
            background:
              "repeating-linear-gradient(90deg, #78350f 0px, #78350f 20px, #d97706 20px, #d97706 40px, transparent 40px, transparent 50px)",
          }}
        />
      </div>

      {/* ══════════ RIGHT PANEL ══════════ */}
     <div className="w-full md:w-[440px] shrink-0 bg-amber-50 border-l border-amber-100 flex flex-col items-center justify-center px-9 py-10 relative">

  {/* ─── Inner Card (depth added) ─── */}
  <div className="w-full bg-white rounded-2xl shadow-xl border border-amber-100 p-7">

    {/* Logo */}
    <div className="flex flex-col items-center mb-6">
      <div className="w-14 h-14 bg-amber-900 rounded-2xl flex items-center justify-center mb-2 shadow-lg shadow-amber-900/30">
        <TiffinIcon size={28} />
      </div>
      <p className="font-serif text-lg text-amber-950">TiffinTrack</p>
      <p className="text-[11px] text-stone-500 mt-0.5 tracking-wide">
        Mess Management Platform
      </p>
    </div>

    {/* Heading */}
    <div className="text-center mb-5">
      <h2 className="font-serif text-[22px] text-amber-950 mb-1">
        Welcome Back
      </h2>
      <p className="text-xs text-stone-500 leading-relaxed">
        Sign in to manage orders, deliveries & customers
      </p>
    </div>

  

    {/* Email / Mobile */}
    <div className="mb-3.5">
      <label className="block text-[11px] font-medium text-stone-700 mb-1 uppercase tracking-wide">
        Mobile / Email
      </label>

      <div className="relative">
        <input
          type="text"
          placeholder="9876543210 or you@mess.com"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          className="w-full px-3.5 py-2.5 pr-9 rounded-xl border border-stone-300 bg-white text-sm focus:border-amber-600 focus:ring-2 focus:ring-amber-600/10 outline-none"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400">
          <UserIcon />
        </span>
      </div>
    </div>

    {/* Password */}
    <div className="mb-3.5">
      <label className="block text-[11px] font-medium text-stone-700 mb-1 uppercase tracking-wide">
        Password
      </label>

      <div className="relative">
        <input
          type={showPass ? "text" : "password"}
          placeholder="••••••••"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          className="w-full px-3.5 py-2.5 pr-9 rounded-xl border border-stone-300 bg-white text-sm focus:border-amber-600 focus:ring-2 focus:ring-amber-600/10 outline-none"
        />

        <button
          type="button"
          onClick={() => setShowPass(!showPass)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
        >
          {showPass ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
    </div>

    {/* Remember / Forgot */}
    <div className="flex justify-between items-center mb-5 text-xs">
      <label className="flex items-center gap-2 text-stone-500 cursor-pointer">
        <input type="checkbox" className="w-3.5 h-3.5 accent-amber-900" />
        Remember me
      </label>

      <a href="#" className="text-amber-700 font-medium hover:underline">
        Forgot?
      </a>
    </div>

    {/* Button */}
    <button
      onClick={handleLogin}
      disabled={loading}
      className="w-full py-3 rounded-xl bg-amber-900 text-white text-sm font-semibold shadow-lg shadow-amber-900/30 hover:bg-amber-950 hover:-translate-y-px transition"
    >
      {loading ? "Signing in..." : "Sign In"}
    </button>

    {/* Trust */}
    <div className="flex justify-center gap-4 text-[10px] text-stone-400 mt-4">
      <span>🔒 Secure</span>
      <span>⚡ Fast</span>
      <span>📦 Real-time</span>
    </div>
  </div>

  {/* Version */}
  <span className="absolute bottom-4 right-5 text-[10px] text-stone-300">
    Build v2.4.1
  </span>
</div>
    </div>
  );
}