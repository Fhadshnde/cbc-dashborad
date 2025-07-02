import React from 'react';

function UrgentNotesCard() {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 w-full lg:w-96 flex flex-col text-right rtl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">تنبيهات عاجلة</h3>
        <span className="text-gray-400 text-2xl leading-none">...</span>
      </div>
      <div className="space-y-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-3">
          <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div>
            <p className="text-red-700 text-sm font-medium">يرجى التوجه نحو متجر الرصافة في أقرب وقت</p>
            <p className="text-gray-500 text-xs mt-1">2025 يناير / 7 / 12:07 pm</p>
          </div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-3">
          <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div>
            <p className="text-yellow-800 text-sm font-medium">يرجى التوجه نحو متجر الرصافة في أقرب وقت</p>
            <p className="text-gray-500 text-xs mt-1">2025 يناير / 7 / 12:07 pm</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UrgentNotesCard;