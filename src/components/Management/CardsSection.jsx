import React from 'react';
import moment from 'moment';

const CardsSection = ({ cardsData, userReports, reportsLoading, reportsError }) => {
  if (reportsLoading) {
    return <div className="text-center p-5 text-gray-600">جاري تحميل فواتير البطاقات...</div>;
  }

  if (reportsError) {
    return <div className="text-red-500 text-center p-5">خطأ في جلب فواتير البطاقات: {reportsError}</div>;
  }

  // Calculate totals for the final row
  const totalOneYearReports = userReports.reduce((sum, report) => sum + (report.cardCategory?.oneYear || 0), 0);
  const totalTwoYearsReports = userReports.reduce((sum, report) => sum + (report.cardCategory?.twoYears || 0), 0);
  const totalVirtualReports = userReports.reduce((sum, report) => sum + (report.cardCategory?.virtual || 0), 0);
  const totalAllCardsFromReports = userReports.reduce((sum, report) => 
    sum + (report.cardCategory?.oneYear || 0) + (report.cardCategory?.twoYears || 0) + (report.cardCategory?.virtual || 0)
  , 0);


  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-medium text-gray-700">فواتير البطاقات الصادرة</h4>
        {/* Search and date pickers - place holders for now as per image */}
        <div className="flex items-center space-x-2 space-x-reverse">
          <div className="flex items-center border border-gray-300 rounded-md p-2">
            <span className="text-gray-500 ml-2">إلى تاريخ</span>
            <input type="text" className="w-24 text-center text-sm" placeholder="تاريخ" readOnly />
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
          </div>
          <div className="flex items-center border border-gray-300 rounded-md p-2">
            <span className="text-gray-500 ml-2">من تاريخ</span>
            <input type="text" className="w-24 text-center text-sm" placeholder="تاريخ" readOnly />
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="البحث"
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
          <button className="p-2 border border-gray-300 rounded-md hover:bg-gray-50">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01.293.707l-6.414 6.414a1 1 0 00-.293.707V19l-4 2v-6.586a1 1 0 00-.293-.707L3.707 7.293A1 1 0 013 6.586V4z"></path></svg>
          </button>
        </div>
      </div>


      {userReports.length === 0 ? (
        <p className="text-gray-500 text-center py-4">لا توجد فواتير بطاقات لهذا المستخدم.</p>
      ) : (
        <table className="min-w-full divide-y divide-gray-200 mt-4">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-3 text-right text-xs font-semibold text-gray-600 uppercase">إجمالي البطاقات</th>
              <th className="py-2 px-3 text-right text-xs font-semibold text-gray-600 uppercase">بطاقة فئة السنتين</th>
              <th className="py-2 px-3 text-right text-xs font-semibold text-gray-600 uppercase">بطاقة فئة السنة</th>
              <th className="py-2 px-3 text-right text-xs font-semibold text-gray-600 uppercase">بطاقة Virtual</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {userReports.map((report, index) => (
              <tr key={report._id || index} className="hover:bg-gray-50">
                <td className="py-2 px-3 text-sm text-gray-800">
                  {(report.cardCategory?.oneYear || 0) + (report.cardCategory?.twoYears || 0) + (report.cardCategory?.virtual || 0)}
                </td>
                <td className="py-2 px-3 text-sm text-gray-800">{report.cardCategory?.twoYears || 0}</td>
                <td className="py-2 px-3 text-sm text-gray-800">{report.cardCategory?.oneYear || 0}</td>
                <td className="py-2 px-3 text-sm text-gray-800">{report.cardCategory?.virtual || 0}</td>

              </tr>
            ))}
            <tr className="bg-gray-100 font-bold">
              <td className="py-2 px-3 text-sm text-gray-800">{totalAllCardsFromReports}</td>
              <td className="py-2 px-3 text-sm text-gray-800">{totalTwoYearsReports}</td>
              <td className="py-2 px-3 text-sm text-gray-800">{totalOneYearReports}</td>
              <td className="py-2 px-3 text-sm text-gray-800">{totalVirtualReports}</td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CardsSection;