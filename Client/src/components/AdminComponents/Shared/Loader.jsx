import React from 'react'

const Loader = () => {
  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-[3px] border-[#fde0bc] border-t-[#c2620a] animate-spin" />
        <span className="absolute inset-0 flex items-center justify-center text-base font-bold text-[#c2620a]">
          M
        </span>
      </div>
      <span className="text-[13px] font-medium text-[#9a8f82]">
        We are proceeding...
      </span>
    </div>
  )
}

export default Loader