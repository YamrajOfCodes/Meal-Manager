import { useState } from "react";
import { CardHead, CardWrap } from "../../../../components/AdminComponents/Shared/SharedComponents";
import { useGetNotices, usePostNotice } from "../../../../hooks/Admin/adminHooks";
import { jwtDecode } from "jwt-decode";
import Loader from "../../../../components/AdminComponents/Shared/Loader";
import toast from "react-hot-toast";

function NoticesPage() {

  const {mutate:postNoticess} = usePostNotice();
  const [loader,setLoader] = useState(false);

  
  const token = localStorage.getItem("login");
  const decoded = jwtDecode(token);
  const messCode = decoded?.messCode;
  
  const {data:getNotices} = useGetNotices(messCode);

  console.log(getNotices)

  const NOTICES_INIT = [
  { id:1, text:"Lunch will be served at 1 PM tomorrow due to kitchen maintenance.", type:"info",    time:"Today 9:00 AM" },
  { id:2, text:"October monthly fees due by 5th. Late payments attract ₹50 penalty.", type:"payment", time:"Yesterday 6 PM" },
];

const TYPE_META = {
  info:    { label:"Info",    bg:"#e8f0fb", color:"#1d5fa6" },
  payment: { label:"Payment", bg:"#fff4e8", color:"#c2620a" },
  menu:    { label:"Menu",    bg:"#e8f5ef", color:"#1a7f5a" },
  urgent:  { label:"Urgent",  bg:"#fdecea", color:"#c0392b" },
};

  const [noticeText, setNoticeText] = useState("");
  const [noticeType, setNoticeType] = useState("info");
  const [notices, setNotices] = useState();

  const postNotice = () => {
    if (!noticeText.trim()){
      toast.error("please add something");
      return;
    }
    
    setNotices([{ id: Date.now(), text: noticeText, type: noticeType, time: "Just now" }]);
    
    const data = {
      text: notices?.[0]?.text || "",
      type: notices?.[0]?.type || "",
      messCode
    };

    setLoader(true)
    postNoticess(data,{
      onSuccess:()=>{
        setLoader(false)
      },
      onError: ()=>{
        setLoader(false)
      }
    })
    setNoticeText("");
  };

  return (
    <CardWrap>
      <CardHead title="Notice Board" sub="Post updates to all your customers" />
      <div className="p-5">
        {/* Compose area */}
        <div className="bg-[#faf8f5] border border-[#e8e2d9] rounded-[9px] overflow-hidden mb-4">
          <textarea
            className="w-full bg-transparent border-none outline-none font-sans text-[13px] text-[#1a1510] px-4 py-3.5 resize-none min-h-[80px] leading-relaxed placeholder:text-[#9a8f82]"
            placeholder="Write a notice for your customers…"
            value={noticeText}
            onChange={e => setNoticeText(e.target.value)}
          />
          <div className="flex items-center justify-between px-3.5 py-2.5 border-t border-[#e8e2d9] flex-wrap gap-2">
            <div className="flex gap-1.5 flex-wrap">
              {["info","payment","menu","urgent"].map(t => {
                const m = TYPE_META[t];
                const sel = noticeType === t;
                return (
                  <button
                    key={t}
                    onClick={() => setNoticeType(t)}
                    className="text-[10px] font-semibold rounded-[6px] px-2.5 py-1 cursor-pointer border transition-all"
                    style={sel
                      ? { background: m.bg, color: m.color, borderColor: `${m.color}40` }
                      : { background: "transparent", color: "#9a8f82", borderColor: "#e8e2d9" }
                    }
                  >
                    {m.label}
                  </button>
                );
              })}
            </div>
            <button
              onClick={postNotice}
              className="px-4 py-1.5 rounded-[6px] bg-[#c2620a] text-white text-[11px] font-semibold border-none cursor-pointer transition-opacity hover:opacity-90"
              style={{ boxShadow: "0 2px 6px rgba(194,98,10,.2)" }}
            >
              Post Notice
            </button>
          </div>
        </div>

        {/* Notices list */}
        {getNotices?.map(n => {
          const m = TYPE_META[n.type] || TYPE_META.info;
          return (
            <div key={n.id} className="flex items-start gap-3 py-3 border-b border-[#e8e2d9] last:border-0">
              <div className="w-[30px] h-[30px] rounded-[8px] flex items-center justify-center flex-shrink-0" style={{ background: m.bg }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={m.color} strokeWidth="2.2" strokeLinecap="round">
                  <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/>
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-xs text-[#5a5048] leading-relaxed">{n.text}</div>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[10px] text-[#9a8f82]">{n.time}</span>
                  <span className="text-[10px] font-semibold rounded px-1.5 py-px" style={{ background: m.bg, color: m.color }}>{m.label}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
           {loader && (
  <div className="fixed inset-0 flex items-center justify-center bg-[#f6f3ef]/40 backdrop-blur-sm z-50">
    <Loader />
  </div>
)}
    </CardWrap>
  );
}

export default NoticesPage;