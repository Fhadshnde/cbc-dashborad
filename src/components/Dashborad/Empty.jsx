import React from 'react'

const Empty = () => {
  return (
    <div className="
      bg-white rounded-lg p-4 shadow-md
      mx-auto mt-5
      w-[95vw] h-[180px]  /* للجوال - يتناسب مع عرض الشاشة */
      sm:w-[85vw] sm:h-[240px]  /* للأجهزة اللوحية الصغيرة */
      md:w-[600px] md:h-[320px]  /* للابتوب - الحجم الأصلي */
      transition-all duration-300  /* تأثير سلس عند تغيير الحجم */
    ">
      {/* محتوى المكون */}
    </div>
  )
}

export default Empty