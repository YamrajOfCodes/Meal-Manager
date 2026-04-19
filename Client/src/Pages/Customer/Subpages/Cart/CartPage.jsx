import React from 'react'
import { Ic } from '../../CustomerDashboard'

const CartPage = ({cartRows,cartCount,cartTotal,placeOrder,balance,clear,VegBox,IC}) => {
  return (
    <div>
         <div className="slide max-w-lg mx-auto w-full flex flex-col gap-4">
            <div className="card overflow-hidden">
              <div className="card-hd">
                <div>
                  <p className="font-semibold text-[14px] text-[#1c1812]">Your Cart</p>
                  <p className="text-[11px] text-[#9a8f82] mt-0.5">{cartCount} item{cartCount!==1?"s":""} · ₹{cartTotal} total</p>
                </div>
                {cartCount>0 && (
                  <button className="text-[11px] text-[#9a8f82] hover:text-[#c0392b]" onClick={clear}>Clear all</button>
                )}
              </div>

              {cartRows.length===0
                ? <div className="p-12 text-center flex flex-col items-center gap-3">
                    <span className="text-5xl">🛒</span>
                    <p className="text-[#9a8f82] text-sm">Cart is empty</p>
                    <button onClick={()=>setTab("menu")} className="text-[12px] font-semibold text-[#c2620a]">Browse menu →</button>
                  </div>
                : <>
                    <div>
                      {cartRows.map(({item, qty})=>(
                        <div key={item._id} className="row-hover flex items-center gap-3 px-5 py-3.5 border-b border-[#ebe6de] last:border-0 transition-colors">
                          <VegBox isVeg={item.isVeg}/>
                          <div className="flex-1">
                            <p className="text-[13px] font-semibold text-[#1c1812]">{item.name}</p>
                            <p className="text-[11px] text-[#9a8f82]">₹{item.price} each</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button className="qty-ring bg-[#faf8f5] text-[#5a5048] hover:bg-[#fdecea] hover:text-[#c0392b]" onClick={()=>dec(item._id)}>−</button>
                            <span className="text-[13px] font-bold w-5 text-center">{qty}</span>
                            <button className="qty-ring bg-[#faf8f5] text-[#5a5048] hover:bg-[#eaf5ef] hover:text-[#1a7f5a]" onClick={()=>inc(item._id)}>+</button>
                          </div>
                          <p className="font-bold text-[14px] text-[#1c1812] w-14 text-right">₹{item.price*qty}</p>
                        </div>
                      ))}
                    </div>

                    {/* order summary */}
                    <div className="bg-[#faf8f5] border-t border-[#ebe6de] px-5 py-4 flex flex-col gap-2">
                      {[
                        ["Subtotal", `₹${cartTotal}`],
                        ["Delivery", "₹0"],
                        ["Taxes", "₹0"],
                      ].map(([l,v])=>(
                        <div key={l} className="flex justify-between text-[13px] text-[#9a8f82]">
                          <span>{l}</span><span>{v}</span>
                        </div>
                      ))}
                      <div className="flex justify-between font-bold text-[15px] text-[#1c1812] border-t border-[#ebe6de] pt-2 mt-1">
                        <span>Total</span><span>₹{cartTotal}</span>
                      </div>

                      {/* balance impact notice */}
                      <div className="flex gap-2 items-start bg-[#fff4e8] border border-[#fde0bc] rounded-xl px-4 py-3 mt-2 text-[12px] text-[#c2620a]">
                        <Ic d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" s={14} c="#c2620a"/>
                        <span>
                          Current balance: <strong>₹{balance}</strong>. After ordering it will be{" "}
                          <strong>₹{balance+cartTotal}</strong>.
                        </span>
                      </div>

                      <button onClick={placeOrder}
                        className="mt-2 w-full bg-[#c2620a] text-white font-bold text-[14px] py-4 rounded-xl hover:bg-[#a8520a] transition-colors flex items-center justify-center gap-2 shadow-lg"
                        style={{boxShadow:"0 6px 24px rgba(194,98,10,.3)"}}>
                        <Ic d="M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3" s={16} c="white"/>
                        Place Order · ₹{cartTotal}
                      </button>
                    </div>
                  </>
              }
            </div>
          </div>
    </div>
  )
}

export default CartPage
