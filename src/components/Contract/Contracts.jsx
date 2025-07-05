import React, { useState } from 'react';
import { Link } from 'react-router-dom';
const Contracts = () => {
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);

  const contracts = [
    { id: 1, storeName: "متجر رصافة", employeeName: "رشا محمود", signDate: "12/2/2025", status: "تعديل مطلوب" },
    { id: 2, storeName: "متجر رصافة", employeeName: "رشا محمود", signDate: "12/2/2025", status: "جديد" },
    { id: 3, storeName: "متجر رصافة", employeeName: "رشا محمود", signDate: "12/2/2025", status: "منتهي" },
    { id: 4, storeName: "متجر رصافة", employeeName: "رشا محمود", signDate: "12/2/2025", status: "مرفوض" },
    { id: 5, storeName: "متجر رصافة", employeeName: "رشا محمود", signDate: "12/2/2025", status: "تعديل مطلوب" },
    { id: 6, storeName: "متجر رصافة", employeeName: "رشا محمود", signDate: "12/2/2025", status: "جديد" },
    { id: 7, storeName: "متجر رصافة", employeeName: "رشا محمود", signDate: "12/2/2025", status: "تعديل مطلوب" },
    { id: 8, storeName: "متجر رصافة", employeeName: "رشا محمود", signDate: "12/2/2025", status: "مرفوض" },
    { id: 9, storeName: "متجر رصافة", employeeName: "رشا محمود", signDate: "12/2/2025", status: "منتهي" },
  ];

  const getStatusClasses = (status) => {
    switch (status) {
      case "تعديل مطلوب":
        return "bg-orange-100 text-orange-700";
      case "جديد":
        return "bg-green-100 text-green-700";
      case "منتهي":
        return "bg-yellow-100 text-yellow-700";
      case "مرفوض":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="flex min-h-screen rtl font-sans bg-gray-100">
      <div
        className={`flex-1 p-6 transition-all duration-300 ${isFilterSidebarOpen ? 'ml-80' : 'ml-0'
          }`}
      >
        <div className="flex items-center justify-end mb-6">
          <div className="flex items-center space-x-3 space-x-reverse">
            <Link to="/add-contract">
              <button className="flex items-center px-4 py-2 bg-teal-500 text-white rounded-lg shadow-md hover:bg-teal-600 transition-colors">
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                <span>إضافة عقد</span>
              </button>
            </Link>

            <button className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg shadow-md hover:bg-gray-300 transition-colors">
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
              <span>تصدير</span>
            </button>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-800">العقود</h1>
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="relative w-72">
                <input
                  type="text"
                  placeholder="ابحث عن..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-right"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
              </div>
              <button
                onClick={() => setIsFilterSidebarOpen(true)}
                className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg shadow-sm hover:bg-gray-100 transition-colors"
                style={{ borderRadius: '0.5rem', background: '#e0f2f7' }}
              >
                <svg className="w-5 h-5 ml-2 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 8a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zm0 8a1 1 0 011-1h8a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z"></path></svg>
                <span className="text-teal-700 font-semibold">تصفية</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="pr-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input type="checkbox" className="form-checkbox h-4 w-4 text-teal-600 transition duration-150 ease-in-out rounded-sm" />
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    اسم المتجر
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    اسم الموظفة
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    تاريخ توقيع العقد
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الحالة
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    إجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {contracts.map((contract) => (
                  <tr key={contract.id}>
                    <td className="pr-4 py-4 whitespace-nowrap">
                      <input type="checkbox" className="form-checkbox h-4 w-4 text-teal-600 transition duration-150 ease-in-out rounded-sm" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {contract.storeName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {contract.employeeName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {contract.signDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(contract.status)}`}>
                        {contract.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <Link to={"/contract-details"}>
                          <button className="text-gray-600 hover:text-teal-600 flex items-center">
                            <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                            عرض
                          </button>
                        </Link>

                        <button className="text-gray-600 hover:text-blue-600 flex items-center">
                          <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                          تعديل
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div
        className={`fixed inset-y-0 left-0 w-80 shadow-lg transform transition-transform duration-300 z-50 p-6 rtl
          ${isFilterSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          flex flex-col`}
        style={{
          background: 'linear-gradient(to bottom, #eff8f7, #c1e0e8)',
          borderRadius: '0 1.5rem 1.5rem 0',
        }}
      >
        <div className="absolute top-0 left-0 h-full w-2 rounded-tl-3xl rounded-bl-3xl bg-gradient-to-b from-teal-400 to-green-400"></div>

        <div
          className="relative px-6 py-4 flex items-center justify-between"
          style={{
            background: 'linear-gradient(to left, #e8f5f2, #d1e7e4)',
            borderRadius: '1.5rem 0 0 0',
            marginTop: '-1.5rem',
            marginLeft: '-1.5rem',
            marginRight: '-1.5rem',
          }}
        >
          <h2 className="text-xl font-bold text-gray-800">الفلاتر</h2>
          <button onClick={() => setIsFilterSidebarOpen(false)} className="text-gray-500 hover:text-gray-700 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pt-6 px-4">
          <div className="mb-6">
            <label htmlFor="searchFilter" className="block text-gray-700 text-sm font-medium mb-2">البحث</label>
            <div className="relative">
              <input
                type="text"
                id="searchFilter"
                placeholder="ابحث عن .."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-right bg-white"
                style={{ background: '#eaf4f7', border: 'none' }}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="province" className="block text-gray-700 text-sm font-medium">المحافظة</label>
              <button className="text-gray-400 text-xs hover:text-gray-600">مسح</button>
            </div>
            <div className="relative">
              <select id="province" className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-right bg-white appearance-none" style={{ background: '#eaf4f7', border: 'none' }}>
                <option>اختر</option>
                <option>بغداد</option>
                <option>البصرة</option>
                <option>أربيل</option>
              </select>
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="subscriptionType" className="block text-gray-700 text-sm font-medium">نوع الاشتراك</label>
              <button className="text-gray-400 text-xs hover:text-gray-600">مسح</button>
            </div>
            <div className="relative">
              <select id="subscriptionType" className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-right bg-white appearance-none" style={{ background: '#eaf4f7', border: 'none' }}>
                <option>اختر</option>
                <option>شهري</option>
                <option>سنوي</option>
              </select>
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="contractStatus" className="block text-gray-700 text-sm font-medium">حالة العقد</label>
              <button className="text-gray-400 text-xs hover:text-gray-600">مسح</button>
            </div>
            <div className="relative">
              <select id="contractStatus" className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-right bg-white appearance-none" style={{ background: '#eaf4f7', border: 'none' }}>
                <option>اختر</option>
                <option>جديد</option>
                <option>مكتمل</option>
                <option>معلق</option>
              </select>
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 flex justify-between space-x-4 space-x-reverse border-t border-gray-200">
          <button className="w-1/2 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors" style={{ background: '#eaf4f7', border: 'none' }}>مسح الكل</button>
          <button className="w-1/2 py-2 bg-gradient-to-r from-teal-400 to-green-500 text-white rounded-lg shadow-md hover:from-teal-500 hover:to-green-600 transition-colors">تطبيق (3)</button>
        </div>
      </div>
    </div>
  );
};

export default Contracts;