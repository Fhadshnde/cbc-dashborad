import React from 'react';

function EmployeePerformanceCard() {
  const topPerformers = [
    {
      name: "علاء العلي",
      role: "موظف مبيعات",
      description: "ممتاز! لقد حققت أفضل المبيعات في هذا الشهر",
      imageUrl: "https://via.placeholder.com/80x80/0000FF/FFFFFF?text=User1"
    },
    {
      name: "نور سالم",
      role: "موظفة مبيعات",
      description: "ممتاز! لقد حققت أفضل المبيعات في هذا الشهر",
      imageUrl: "https://via.placeholder.com/80x80/FF0000/FFFFFF?text=User2"
    },
    {
      name: "رشا محمود",
      role: "موظفة مبيعات",
      description: "ممتاز! لقد حققت أفضل المبيعات في هذا الشهر",
      imageUrl: "https://via.placeholder.com/80x80/00FF00/FFFFFF?text=User3"
    },
  ];

  return (
    <div className="flex flex-col items-center bg-white p-6 rounded-xl w-[800px] max-w-[1000px] rtl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">الموظفين المتميزين</h2>
      <div className="flex gap-6 justify-center overflow-x-auto w-full">
        {topPerformers.map((employee, index) => (
          <div key={index} className="bg-gray-50 border border-gray-200 rounded-xl shadow-md p-5 w-56 flex-shrink-0 flex flex-col items-center text-center">
            <div className="flex justify-between items-center w-full mb-3">
              <h4 className="text-base font-semibold text-gray-800">المتميز في المبيعات</h4>
              <div className="w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.083 4.29a.75.75 0 01.166 0l1.246.335a.75.75 0 00.94.498l1.455-.727a.75.75 0 011.01.213l.858 1.488a.75.75 0 00.58.33l1.637.19a.75.75 0 01.696.837l-.234 1.638a.75.75 0 00.322.628l1.353 1.054a.75.75 0 01.173 1.002l-.634 1.503a.75.75 0 00.173.805l1.045 1.137a.75.75 0 01.077 1.077l-1.076 1.045a.75.75 0 00-.33.579l.19 1.638a.75.75 0 01-.837.696l-1.638-.234a.75.75 0 00-.628.322l-1.054 1.353a.75.75 0 01-1.002.173l-1.503-.634a.75.75 0 00-.805.173l-1.137 1.045a.75.75 0 01-1.077.077l-1.045-1.076a.75.75 0 00-.579-.33l-1.638.19a.75.75 0 01-.696-.837l.234-1.638a.75.75 0 00-.322-.628l-1.353-1.054a.75.75 0 01-.173-1.002l.634-1.503a.75.75 0 00-.173-.805l-1.045-1.137a.75.75 0 01-.077-1.077l1.076-1.045a.75.75 0 00.33-.579l-.19-1.638a.75.75 0 01.837-.696l1.638.234a.75.75 0 00.628-.322l1.054-1.353a.75.75 0 011.002-.173l1.503.634a.75.75 0 00.805-.173z"></path>
                </svg>
              </div>
            </div>
            <div className="relative w-24 h-24 rounded-full mb-3 flex items-center justify-center">
              <img
                src={employee.imageUrl}
                alt={employee.name}
                className="w-20 h-20 rounded-full object-cover z-10"
                onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/80x80/cccccc/333333?text=User"; }}
              />
              <div className="absolute inset-0 rounded-full border-4 border-green-500"></div>
            </div>
            <h3 className="text-lg font-bold text-gray-800">{employee.name}</h3>
            <p className="text-gray-500 text-sm font-medium mb-2">{employee.role}</p>
            <p className="text-gray-600 text-sm text-center px-2">{employee.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EmployeePerformanceCard;
