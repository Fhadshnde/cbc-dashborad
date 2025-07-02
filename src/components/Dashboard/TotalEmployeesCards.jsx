import React from 'react';

function TotalEmployeesCards() {
  return (
    <div className="flex flex-wrap gap-5 justify-center lg:justify-start">
      <div className="bg-orange-50 rounded-xl shadow-sm p-4 w-44 h-44 flex flex-col items-center justify-center text-center rtl">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">إجمالي الموظفين</h3>
        <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mb-2">
        </div>
        <div className="text-orange-700 text-4xl font-bold">65</div>
      </div>

      <div className="bg-pink-50 rounded-xl shadow-sm p-4 w-44 h-44 flex flex-col items-center justify-center text-center rtl">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">إجمالي الموظفين</h3>
        <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center mb-2">
        </div>
        <div className="text-pink-700 text-4xl font-bold">65</div>
      </div>

      <div className="bg-yellow-50 rounded-xl shadow-sm p-4 w-44 h-44 flex flex-col items-center justify-center text-center rtl">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">إجمالي الموظفين</h3>
        <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mb-2">
        </div>
        <div className="text-yellow-700 text-4xl font-bold">65</div>
      </div>

      <div className="bg-teal-50 rounded-xl shadow-sm p-4 w-44 h-44 flex flex-col items-center justify-center text-center rtl">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">إجمالي الموظفين</h3>
        <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center mb-2">
        </div>
        <div className="text-teal-700 text-4xl font-bold">65</div>
      </div>
    </div>
  );
}

export default TotalEmployeesCards;