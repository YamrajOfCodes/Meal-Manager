import React, { useRef, useEffect } from 'react'

const MEAL_TIME_LABEL = {
  Breakfast: "7:00 – 10:00 AM",
  Lunch:     "12:00 – 3:00 PM",
  Snacks:    "4:00 – 6:00 PM",
  Dinner:    "7:00 – 10:00 PM",
}

const MenuPage = ({
  mealFilter,
  setMealFilter,
  MEAL_EMOJI,
  MEAL_ORDER,
  vegOnly,
  setVegOnly,
  VegBox,
  grouped,
  cartCount,
  cartTotal,
  cart,
  inc,
  dec,
  loading,
  setTab,
  loginUser
}) => {
  const tabsRef = useRef(null)
  const sectionRefs = useRef({})


  console.log(grouped)

  // Auto-scroll active tab into view
  useEffect(() => {
    if (!tabsRef.current) return
    const activeBtn = tabsRef.current.querySelector('.tab-active')
    if (activeBtn) {
      activeBtn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
    }
  }, [mealFilter])

  const meals = mealFilter === 'All'
    ? Object.entries(grouped)
    : Object.entries(grouped).filter(([meal]) => meal === mealFilter)

  return (
    <div className="flex flex-col min-h-screen bg-[#f5f0e8]">

      {/* ── Sticky header: tabs + veg toggle ── */}
      <div className="sticky top-0 z-20 bg-white border-b border-[#e8e2d9]">

        {/* Veg toggle row */}
        <div className="flex items-center justify-end px-4 py-2 border-b border-[#f0ebe3]">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <span className="text-[12px] font-medium text-[#6b6157]">Veg only</span>
            <div
              onClick={() => setVegOnly(v => !v)}
              className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${vegOnly ? 'bg-[#3B6D11]' : 'bg-[#d4cfc8]'}`}
            >
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${vegOnly ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </div>
            {/* Veg dot indicator */}
            <span className={`w-3 h-3 rounded-sm border-2 ${vegOnly ? 'border-[#3B6D11]' : 'border-[#9a8f82]'} flex items-center justify-center`}>
              <span className={`w-1.5 h-1.5 rounded-full ${vegOnly ? 'bg-[#3B6D11]' : 'bg-[#9a8f82]'}`} />
            </span>
          </label>
        </div>

        {/* Meal tabs */}
        <div
          ref={tabsRef}
          className="flex overflow-x-auto scrollbar-hide px-2"
          style={{ scrollbarWidth: 'none' }}
        >
          {["All", ...MEAL_ORDER].map(m => {
            const isActive = mealFilter === m
            const count = m === 'All'
              ? Object.values(grouped).flat().length
              : (grouped[m]?.length ?? 0)

            return (
              <button
                key={m}
                onClick={() => setMealFilter(m)}
                className={`tab-active-check flex-shrink-0 flex flex-col items-center gap-1 px-4 pt-3 pb-2.5 border-b-2 transition-all duration-200 ${
                  isActive
                    ? 'tab-active border-[#c2620a] text-[#c2620a]'
                    : 'border-transparent text-[#9a8f82] hover:text-[#5a5048]'
                }`}
              >
                <span className="text-xl leading-none">{MEAL_EMOJI[m] ?? '🍽'}</span>
                <span className={`text-[11px] font-semibold tracking-wide uppercase ${isActive ? 'text-[#c2620a]' : 'text-[#9a8f82]'}`}>
                  {m}
                </span>
                {count > 0 && (
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-[#fdebd8] text-[#c2620a]' : 'bg-[#f0ebe3] text-[#9a8f82]'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="flex flex-col gap-3 p-3 pb-28">
        {loading ? (
          <LoadingSkeletons />
        ) : meals.length === 0 ? (
          <EmptyState vegOnly={vegOnly} />
        ) : (
          meals.map(([meal, items]) => (
            <MealSection
              key={meal}
              meal={meal}
              items={items}
              emoji={MEAL_EMOJI[meal]}
              timeLabel={MEAL_TIME_LABEL[meal]}
              cart={cart}
              inc={inc}
              dec={dec}
              VegBox={VegBox}
              sectionRefs={sectionRefs}
              discount = {loginUser?.label?.labelPrice}
            />
          ))
        )}
      </div>

      {/* ── Floating cart bar ── */}
      {cartCount > 0 && (
        <div className="fixed bottom-[72px] left-1/2 z-30 w-full max-w-lg px-4"
          style={{ transform: 'translateX(-50%)' }}>
          <button
            onClick={() => setTab('cart')}
            className="w-full flex items-center justify-between px-5 py-4 bg-[#c2620a] hover:bg-[#a8520a] active:scale-[0.98] text-white rounded-2xl transition-all duration-150"
          >
            <div className="flex items-center gap-2">
              <span className="bg-white/20 text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
                {cartCount} {cartCount === 1 ? 'item' : 'items'}
              </span>
            </div>
            <span className="text-[14px] font-bold tracking-wide cursor-pointer" onClick={()=>{setTab('cart')}}>View Cart</span>
            <span className="text-[14px] font-bold">₹{cartTotal}</span>
          </button>
        </div>
      )}
    </div>
  )
}

/* ── Meal section ── */
const MealSection = ({ meal, items, emoji, timeLabel, cart, inc, dec, VegBox, sectionRefs,discount }) => (
  <div
    ref={el => sectionRefs.current[meal] = el}
    className="bg-white rounded-2xl overflow-hidden border border-[#ede8e0]"
  >
    {/* Section header */}
    <div className="flex items-center gap-3 px-4 py-3.5 bg-[#faf7f3] border-b border-[#ede8e0]">
      <div className="w-9 h-9 rounded-xl bg-[#fdebd8] flex items-center justify-center text-lg leading-none">
        {emoji}
      </div>
      <div className="flex-1">
        <p className="text-[14px] font-bold text-[#1c1812]">{meal}</p>
        {timeLabel && (
          <p className="text-[11px] text-[#9a8f82] mt-0.5">{timeLabel}</p>
        )}
      </div>
      <span className="text-[11px] font-semibold text-[#c2620a] bg-[#fdebd8] px-2.5 py-1 rounded-full">
        {items.length} items
      </span>
    </div>

    {/* Items */}
    {items.map((item, idx) => {
      const qty = cart[item._id] ?? 0
      return (
        <div
          key={item._id}
          className={`flex items-center gap-3 px-4 py-3.5 ${idx !== items.length - 1 ? 'border-b border-[#f0ebe3]' : ''} hover:bg-[#fdf9f5] transition-colors`}
        >
          <VegBox isVeg={item.isVeg} />

          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-[#1c1812] truncate">{item.name}</p>
            <p className="text-[11px] text-[#9a8f82] mt-0.5">
              {item.messCode} · {item.isVeg ? 'Pure Veg' : 'Non-Veg'}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <p className="text-[14px] font-bold text-[#1c1812]">₹{ discount ? item.price - discount : item.price}</p>

            {qty === 0 ? (
              <button
                onClick={() => inc(item._id)}
                className="text-[12px] font-bold text-[#c2620a] border border-[#c2620a] px-3.5 py-1.5 rounded-lg hover:bg-[#c2620a] hover:text-white active:scale-95 transition-all duration-150"
              >
                ADD
              </button>
            ) : (
              <div className="flex items-center gap-0 rounded-lg border border-[#c2620a] overflow-hidden">
                <button
                  onClick={() => dec(item._id)}
                  className="w-8 h-8 text-[16px] font-bold text-[#c2620a] hover:bg-[#fdebd8] active:scale-95 transition-all flex items-center justify-center"
                >
                  −
                </button>
                <span className="w-7 text-center text-[13px] font-bold text-[#1c1812] border-x border-[#c2620a]">
                  {qty}
                </span>
                <button
                  onClick={() => inc(item._id)}
                  className="w-8 h-8 text-[16px] font-bold text-[#c2620a] hover:bg-[#fdebd8] active:scale-95 transition-all flex items-center justify-center"
                >
                  +
                </button>
              </div>
            )}
          </div>
        </div>
      )
    })}
  </div>
)

/* ── Skeleton loader ── */
const LoadingSkeletons = () => (
  <>
    {[1, 2].map(i => (
      <div key={i} className="bg-white rounded-2xl overflow-hidden border border-[#ede8e0] animate-pulse">
        <div className="flex items-center gap-3 px-4 py-3.5 bg-[#faf7f3] border-b border-[#ede8e0]">
          <div className="w-9 h-9 rounded-xl bg-[#ede8e0]" />
          <div className="flex-1">
            <div className="h-3.5 w-24 bg-[#ede8e0] rounded-full" />
            <div className="h-2.5 w-16 bg-[#f0ebe3] rounded-full mt-1.5" />
          </div>
        </div>
        {[1, 2, 3].map(j => (
          <div key={j} className="flex items-center gap-3 px-4 py-3.5 border-b border-[#f0ebe3] last:border-0">
            <div className="w-4 h-4 rounded-sm bg-[#ede8e0] shrink-0" />
            <div className="flex-1">
              <div className="h-3 w-32 bg-[#ede8e0] rounded-full" />
              <div className="h-2.5 w-20 bg-[#f0ebe3] rounded-full mt-1.5" />
            </div>
            <div className="h-3 w-10 bg-[#ede8e0] rounded-full" />
            <div className="h-8 w-16 bg-[#ede8e0] rounded-lg" />
          </div>
        ))}
      </div>
    ))}
  </>
)

/* ── Empty state ── */
const EmptyState = ({ vegOnly }) => (
  <div className="bg-white rounded-2xl border border-[#ede8e0] p-12 flex flex-col items-center gap-3 text-center">
    <span className="text-4xl">🥗</span>
    <p className="text-[14px] font-semibold text-[#1c1812]">
      {vegOnly ? 'No veg items here' : 'Nothing here'}
    </p>
    <p className="text-[12px] text-[#9a8f82]">
      {vegOnly ? 'Try turning off veg filter' : 'No items match your filter'}
    </p>
  </div>
)

export default MenuPage