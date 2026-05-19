import { useEffect, useState } from "react";
import {useRegister,useLogin} from "../../hooks/authHooks/authHooks";
import { protectRoute } from "../../utils/ProtectedRoutes/ProtectedRoutes";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

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


const loginFields = [
  { id: "email", label: "Email address", type: "email", ph: "you@example.com" },
  { id: "password", label: "Password", type: "password", ph: "••••••••" },
];

const registerOwnerFields = [
  { id: "name", label: "Full name", type: "text", ph: "Ramesh Patil" },
  { id: "email", label: "Email address", type: "email", ph: "you@example.com" },
  { id: "phone", label: "Phone number", type: "tel", ph: "+91 98765 43210" },
  { id: "password", label: "Password", type: "password", ph: "••••••••" },
  { id: "messName", label: "Mess name", type: "text", ph: "Shree Sai Mess" },
  { id: "messCode", label: "Mess code", type: "text", ph: "Choose a unique code" },
  { id: "city", label: "City", type: "text", ph: "Enter your city" },
  { id: "address", label: "Address", type: "text", ph: "Enter your address" },

];

const registerUserFields = [
  { id: "name", label: "Full name", type: "text", ph: "Ramesh Patil" },
  { id: "email", label: "Email address", type: "email", ph: "you@example.com" },
  { id: "phone", label: "Phone number", type: "tel", ph: "+91 98765 43210" },
  { id: "password", label: "Password", type: "password", ph: "••••••••" },
  { id: "city", label: "City", type: "text", ph: "Enter your city" },
  { id: "messCode", label: "Mess code", type: "text", ph: "Code from your mess owner" },
  { id: "address", label: "Address", type: "text", ph: "Enter your address" },
  { id: "advance", label: "Advance", type: "text", ph: "Enter collected advance" },
];

const stats = [
  { num: "5+", label: "Mess owners" },
  { num: "100+", label: "Meals tracked daily" },
  { num: "99%", label: "Uptime SLA" },
  { num: "4.9★", label: "Avg. rating" },
];


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
  const {mutate:login,isSuccess:isLoginSuccess,isPending:isLoginPending} = useLogin();
  const {mutate:register,isSuccess:isRegisterSuccess,isPending:isRegisterPending} = useRegister();

  const [mode, setMode] = useState("login");
  const [role, setRole] = useState("owner");
  const [form, setForm] = useState({});

  const navigate = useNavigate();

   useEffect(()=>{
 
    const login = localStorage.getItem("login");
    if(login){
      const {role} = jwtDecode(login);
      if(role === "owner"){
        navigate("/admin");
      }else if(role === "customer"){
        navigate("/customer");
      }else if(role === "super-admin"){
        navigate("/super-admin");
      }else{
        localStorage.removeItem("login");
       navigate("/login");
       return;
      }
    }

   },[]);


  const switchMode = (m) => {
    setMode(m);
    setForm({});
  };

  const fields =
    mode === "login"
      ? loginFields
      : role === "owner"
      ? registerOwnerFields
      : registerUserFields;

  const inputCls =
    "w-full px-3 py-2.5 text-sm rounded-lg border border-stone-200 bg-white text-stone-900 placeholder:text-stone-400 outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-100 transition";

  const labelCls = "block text-[11px] font-medium text-stone-500 mb-1";
const update = (k, v) => setForm({ ...form, [k]: v });

const handleLogin = () => {
  const payload = { ...form, role };

  setLoading(true);

  if (mode === "login") {
    login(payload, {
      onSuccess: () => {
        setLoading(false);
      },
      onError: () => {
        setLoading(false);
      },
    });
  } else {
    register(payload, {
      onSuccess: () => {
        setLoading(false);
        setMode("login");
        setForm({
          email: form.email,
          password: form.password,
        });
      },
      onError: () => {
        setLoading(false);
      },
    });
  }
};

  return (
    <div className="flex min-h-screen overflow-hidden bg-amber-50 font-sans">

      {/* ══════════ LEFT PANEL ══════════ */}
      <div className="flex-1 bg-white flex flex-col px-12 py-10 relative overflow-hidden hidden md:flex">

        <div className="flex items-center gap-3 mb-12 relative z-10">
          <div className="w-11 h-11 bg-amber-900 rounded-xl flex items-center justify-center shrink-0">
            <TiffinIcon size={24} />
          </div>
          <div>
            <p className="font-serif text-[22px] text-amber-950 leading-none">TiffinTrack</p>
            <p className="text-[11px] text-stone-500 mt-0.5 tracking-wide">All-in-one Mess Management Platform</p>
          </div>
        </div>

        <div className="relative z-10 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 text-[11px] font-medium px-3 py-1 rounded-full mb-4 tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
            Trusted by 5+ mess owners across Pune
          </div>
          <h1 className="font-serif text-4xl text-amber-950 leading-snug mb-3.5">
            "Complete Digital<br />
            Solution for Your{" "}
            <span className="text-amber-700">Mess"</span>
          </h1>
          <p className="text-sm text-stone-500 leading-relaxed max-w-md">
            Upgrade your mess operations in this digital era with TiffinTrack, increase
            customer satisfaction, track deliveries in real-time, and grow your business
            effortlessly.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3.5 mb-10 relative z-10">
          {features.map((f, i) => (
            <FeatureCard key={i} feature={f} />
          ))}
        </div>

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

        <div
          className="absolute bottom-0 left-0 right-0 h-1.5 opacity-10"
          style={{
            background:
              "repeating-linear-gradient(90deg, #78350f 0px, #78350f 20px, #d97706 20px, #d97706 40px, transparent 40px, transparent 50px)",
          }}
        />
      </div>

      {/* ══════════ RIGHT PANEL ══════════ */}

     <div className="flex w-full md:w-[440px] items-center justify-center min-h-screen bg-stone-100 px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl border border-stone-200 overflow-hidden">

        <div className="h-1 bg-amber-700 w-full" />

        <div className="px-7 py-7">

      
          <div className="flex items-center gap-2.5 mb-7">
            <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                stroke="#854F0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-stone-900 leading-tight">TifinTrack</p>
              <p className="text-[11px] text-stone-400">modern mess management solution.</p>
            </div>
          </div>

      
          <div className="mb-5">
            <p className="text-lg font-medium text-stone-900">
              {mode === "login" ? "Welcome back" : "Create account"}
            </p>
            <p className="text-[12px] text-stone-400 mt-0.5">
              {mode === "login"
                ? "Sign in to continue to your mess dashboard"
                : "Start managing your mess digitally"}
            </p>
          </div>

     
          {mode === "register" && (
            <div className="flex gap-2 mb-5">
              {[
                { val: "owner", label: "Mess owner" },
                { val: "customer", label: "Customer" },
              ].map(({ val, label }) => (
                <button
                  key={val}
                  onClick={() => setRole(val)}
                  className={`flex-1 py-2 text-xs font-medium rounded-lg border transition ${
                    role === val
                      ? "bg-amber-50 border-amber-600 text-amber-900"
                      : "bg-white border-stone-200 text-stone-500"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}

          {/* Fields */}
          <div className="space-y-3">
            {fields.map(({ id, label, type, ph }) => (
              <div key={id}>
                <label className={labelCls}>{label}</label>
                <input
                  type={type}
                  placeholder={ph}
                  value={form[id] || ""}
                  onChange={(e) => update(id, e.target.value)}
                  className={inputCls}
                />
              </div>
            ))}
          </div>

          {/* CTA */}
          <button className="w-full cursor-pointer mt-5 py-2.5 rounded-lg bg-amber-800 hover:bg-amber-900 text-amber-50 text-sm font-medium transition" onClick={handleLogin} disabled={isLoginPending || isRegisterPending}>
            {(isLoginPending || isRegisterPending) ? (mode === "login" ? "Signing in..." : "Creating account...") : (mode === "login" ? "Sign in" : "Create account")}
          </button>

          {/* Switch */}
          <p className="text-center text-[11px] text-stone-400 mt-4">
            {mode === "login" ? "New here?" : "Already have an account?"}
            <button
              onClick={() => switchMode(mode === "login" ? "register" : "login")}
              className="ml-1 text-amber-700 font-medium"
            >
              {mode === "login" ? "Register" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
    </div>
  );
}