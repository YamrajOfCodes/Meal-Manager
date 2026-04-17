import { CardHead, CardWrap, MenuRow } from "../../../../components/AdminComponents/Shared/SharedComponents";

function MenuPage() {

  const MENU = [
  { slot:"Breakfast", dish:"Poha + Chai",                  kcal:"320 kcal" },
  { slot:"Lunch",     dish:"Dal Tadka · Jeera Rice · Roti", kcal:"680 kcal" },
  { slot:"Snack",     dish:"Biscuits + Tea",               kcal:"150 kcal" },
  { slot:"Dinner",    dish:"Rajma · Rice · Salad",         kcal:"720 kcal" },
];

  return (
    <CardWrap>
      <CardHead
        title="Today's Menu"
        right={
          <button className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-[9px] bg-[#c2620a] text-white text-xs font-semibold border-none cursor-pointer hover:opacity-90 transition-opacity" style={{ boxShadow: "0 2px 8px rgba(194,98,10,.25)" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            Edit
          </button>
        }
      />
      <div className="px-5 pb-2 pt-1">
        {MENU.map(m => <MenuRow key={m.slot} m={m} />)}
      </div>
      <div className="px-5 pb-5">
        <button className="w-full flex items-center justify-center gap-1.5 py-2 rounded-[9px] border border-[#e8e2d9] text-xs font-semibold text-[#5a5048] bg-transparent hover:bg-[#faf8f5] transition-colors cursor-pointer">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
          Set Tomorrow's Menu
        </button>
      </div>
    </CardWrap>
  );
}

export default MenuPage;