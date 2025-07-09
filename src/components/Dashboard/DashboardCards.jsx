import React from 'react';

function DashboardCards() {
  const cards = [
    {
      label: "عدد المتاجر الجديدة",
      value: "3",
      color: "bg-orange-100",
      iconColor: "text-orange-500", 
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M4 6h16v2H4V6zm0 5h10v2H4v-2zm0 5h7v2H4v-2z" />
        </svg>
      ),
    },
    {
      label: "عدد الاستبيانات المنجزة",
      value: "56",
      color: "bg-teal-100",
      iconColor: "text-teal-500",
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14l4-4h12c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
        </svg>
      ),
    },
    {
      label: "عدد العقود الموقعة",
      value: "56",
      color: "bg-yellow-100",
      iconColor: "text-yellow-500",
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M21 7l-9 9-5-5L3 15l9 9 13-13z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex gap-3 rtl w-full">
      {cards.map((card, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md p-4 w-64 h-36 flex-shrink-0 flex flex-col justify-between text-right relative">
          {/* النقاط الثلاث في الزاوية العلوية اليسرى */}
          <div className="absolute top-2 left-2 text-gray-400">
            &#x2022;&#x2022;&#x2022;
          </div>
          <div className="flex items-center gap-2 justify-end mt-2"> {/* إضافة mt-2 لدفعها قليلاً لأسفل بعيداً عن النقاط */}
            <div className={`w-8 h-8 rounded-full ${card.color} flex items-center justify-center`}>
              {React.cloneElement(card.icon, { className: `${card.icon.props.className} ${card.iconColor}` })}
            </div>
            <span className="text-gray-700 text-xs ml-20  font-medium">{card.label}</span>
          </div>
          <div className="text-gray-800 text-3xl font-bold text-center mt-auto mb-2">
            {/* استخدام mt-auto لدفع القيمة للأسفل و mb-2 لبعض المسافة من الحافة */}
            {card.value}
          </div>
        </div>
      ))}
    </div>
  );
}

export default DashboardCards;