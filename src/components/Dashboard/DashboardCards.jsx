import React from 'react';

function DashboardCards() {
  return (
    <div className="flex flex-wrap gap-5 justify-center lg:justify-start">
      <div className="bg-white rounded-xl shadow-md p-6 w-72 h-48 flex flex-col justify-between text-right rtl">
        <div className="text-left mb-5">
          <span className="text-gray-400 text-2xl leading-none">...</span>
        </div>
        <div className="flex items-center gap-4 mb-4 justify-end">
          <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
          </div>
          <span className="text-gray-700 text-lg font-medium">عدد المتاجر الجديدة</span>
        </div>
        <div className="text-gray-800 text-5xl font-bold">3</div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 w-72 h-48 flex flex-col justify-between text-right rtl">
        <div className="text-left mb-5">
          <span className="text-gray-400 text-2xl leading-none">...</span>
        </div>
        <div className="flex items-center gap-4 mb-4 justify-end">
          <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center">
          </div>
          <span className="text-gray-700 text-lg font-medium">عدد الاستبيانات المنجزة</span>
        </div>
        <div className="text-gray-800 text-5xl font-bold">56</div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 w-72 h-48 flex flex-col justify-between text-right rtl">
        <div className="text-left mb-5">
          <span className="text-gray-400 text-2xl leading-none">...</span>
        </div>
        <div className="flex items-center gap-4 mb-4 justify-end">
          <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
          </div>
          <span className="text-gray-700 text-lg font-medium">عدد العقود الموقعة</span>
        </div>
        <div className="text-gray-800 text-5xl font-bold">56</div>
      </div>
    </div>
  );
}

export default DashboardCards;