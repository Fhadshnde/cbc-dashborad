import React from 'react';

function DailyScheduleTable() {
  const data = [
    { date: '2025 أبريل / 25', title: 'Al-Harrya', total: '۸۰', employee: 'علي' },
    { date: '2025 أبريل / 25', title: 'Al-Harrya', total: '۸۰', employee: 'علي' },
    { date: '2025 أبريل / 25', title: 'Al-Harrya', total: '۸۰', employee: 'علي' },
    { date: '2025 أبريل / 25', title: 'Al-Harrya', total: '۸۰', employee: 'علي' },
    { date: '2025 أبريل / 25', title: 'Al-Harrya', total: '۸۰', employee: 'علي' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6 w-full flex flex-col text-right rtl overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">جدول اليوم</h3>
        <span className="text-gray-400 text-2xl leading-none">...</span>
      </div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              <span>تاريخ التسليم</span>
              <svg className="inline-block w-4 h-4 mr-1 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              <span>العنوان</span>
              <svg className="inline-block w-4 h-4 mr-1 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              <span>مجموع البطاقات</span>
              <svg className="inline-block w-4 h-4 mr-1 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              <span>اسم موظف المبيعات</span>
              <svg className="inline-block w-4 h-4 mr-1 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, index) => (
            <tr key={index}>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{row.date}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{row.title}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{row.total}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                <div className="flex items-center justify-end gap-2">
                  <span>{row.employee}</span>
                  <input type="checkbox" className="form-checkbox h-4 w-4 text-teal-600 rounded" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DailyScheduleTable;