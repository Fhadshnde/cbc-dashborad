import React from 'react';

function TotalEmployeesCards() {
  const cards = [
    {
      label: "إجمالي الموظفات",
      count: "65",
      bgColor: "bg-pink-50",
      iconBg: "bg-pink-100",
      textColor: "text-pink-700",
    },
    {
      label: "إجمالي الموظفات",
      count: "65",
      bgColor: "bg-orange-50",
      iconBg: "bg-orange-100",
      textColor: "text-orange-700",
    },
    {
      label: "إجمالي الموظفات",
      count: "65",
      bgColor: "bg-yellow-50",
      iconBg: "bg-yellow-100",
      textColor: "text-yellow-700",
    },
    {
      label: "إجمالي الموظفات",
      count: "65",
      bgColor: "bg-teal-50",
      iconBg: "bg-teal-100",
      textColor: "text-teal-700",
    },
  ];

  return (
    <div className="flex bg-white flex-wrap gap-5 justify-center lg:justify-start rtl">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`${card.bgColor} rounded-xl shadow-sm p-4 w-44 h-44 flex flex-col items-center justify-center text-center`}
        >
          <h3 className="text-lg font-semibold text-gray-700 mb-2">{card.label}</h3>
          <div className={`w-16 h-16 rounded-full ${card.iconBg} flex items-center justify-center mb-2`}>
            <svg className="w-6 h-6 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 2H4C2.9 2 2 2.9 2 4v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"></path>
            </svg>
          </div>
          <div className={`${card.textColor} text-4xl font-bold`}>{card.count}</div>
        </div>
      ))}
    </div>
  );
}

export default TotalEmployeesCards;
