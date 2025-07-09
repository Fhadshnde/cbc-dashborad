import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  FaSearch,
  FaFilter,
  FaTimesCircle,
  FaChevronDown,
} from 'react-icons/fa';

const Contracts = () => {
  // حالة لفتح وإغلاق الفلتر الجانبي
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);

  // حالات الفلاتر
  const [searchTerm, setSearchTerm] = useState(''); // لحقل البحث الرئيسي وفي الفلتر الجانبي
  const [filterProvince, setFilterProvince] = useState('');
  const [filterSubscriptionType, setFilterSubscriptionType] = useState('');
  const [filterContractStatus, setFilterContractStatus] = useState('');

  // بيانات العقود (تم تعديل نوع الاشتراك ليكون 'جديد' أو 'متجدد' فقط)
  const contractsData = useMemo(() => [
    { id: 1, storeName: "متجر رصافة", employeeName: "رشا محمود", signDate: "12/2/2025", status: "تعديل مطلوب", province: "بغداد", subscriptionType: "جديد" },
    { id: 2, storeName: "متجر الكرادة", employeeName: "أحمد علي", signDate: "15/2/2025", status: "جديد", province: "بغداد", subscriptionType: "متجدد" },
    { id: 3, storeName: "متجر البصرة", employeeName: "ليلى خالد", signDate: "20/2/2025", status: "منتهي", province: "البصرة", subscriptionType: "جديد" },
    { id: 4, storeName: "متجر أربيل", employeeName: "محمد جاسم", signDate: "1/3/2025", status: "مرفوض", province: "أربيل", subscriptionType: "متجدد" },
    { id: 5, storeName: "متجر المنصور", employeeName: "علياء احمد", signDate: "5/3/2025", status: "تعديل مطلوب", province: "بغداد", subscriptionType: "جديد" },
    { id: 6, storeName: "متجر النجف", employeeName: "فاطمة الزهراء", signDate: "10/3/2025", status: "جديد", province: "النجف", subscriptionType: "متجدد" },
    { id: 7, storeName: "متجر الموصل", employeeName: "زينب هادي", signDate: "12/3/2025", status: "تعديل مطلوب", province: "نينوى", subscriptionType: "جديد" },
    { id: 8, storeName: "متجر كربلاء", employeeName: "مصطفى قاسم", signDate: "18/3/2025", status: "مرفوض", province: "كربلاء", subscriptionType: "متجدد" },
    { id: 9, storeName: "متجر الديوانية", employeeName: "سارة يوسف", signDate: "22/3/2025", status: "منتهي", province: "الديوانية", subscriptionType: "جديد" },
  ], []); // استخدام useMemo لضمان عدم إعادة إنشاء البيانات إلا عند الضرورة

  // قائمة المحافظات وأنواع الاشتراكات وحالات العقود المتاحة
  const provinces = useMemo(() => [...new Set(contractsData.map(c => c.province))], [contractsData]);
  // تم تحديد أنواع الاشتراكات لتكون 'جديد' و 'متجدد' فقط
  const subscriptionTypes = useMemo(() => ['جديد', 'متجدد'], []);
  const contractStatuses = useMemo(() => [...new Set(contractsData.map(c => c.status))], [contractsData]);

  // دالة لتحديد فئات CSS بناءً على حالة العقد
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

  // منطق تصفية العقود بناءً على حالات الفلاتر
  const filteredContracts = useMemo(() => {
    return contractsData.filter(contract => {
      const matchesSearch =
        contract.storeName.includes(searchTerm) ||
        contract.employeeName.includes(searchTerm);

      const matchesProvince = filterProvince ? contract.province === filterProvince : true;
      const matchesSubscriptionType = filterSubscriptionType ? contract.subscriptionType === filterSubscriptionType : true;
      const matchesContractStatus = filterContractStatus ? contract.status === filterContractStatus : true;

      return matchesSearch && matchesProvince && matchesSubscriptionType && matchesContractStatus;
    });
  }, [contractsData, searchTerm, filterProvince, filterSubscriptionType, filterContractStatus]);

  // دالة لمسح جميع الفلاتر
  const clearAllFilters = () => {
    setSearchTerm('');
    setFilterProvince('');
    setFilterSubscriptionType('');
    setFilterContractStatus('');
  };

  return (
    <div className="flex min-h-screen rtl font-sans bg-gray-100">
      {/* المحتوى الرئيسي للجدول */}
      <div
        className={`flex-1 p-6 transition-all duration-300 ${isFilterSidebarOpen ? 'ml-80' : 'ml-0'
          }`}
      >
        {/* أزرار الإجراءات العلوية */}
        <div className="flex items-center justify-end mb-6">
          <div className="flex items-center space-x-3 space-x-reverse">
            <Link to="/contracts/create">
              <button className="flex items-center px-4 py-2 bg-teal-500 text-white rounded-lg shadow-md hover:bg-teal-600 transition-colors">
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                <span>إضافة عقد</span>
              </button>
            </Link>

            <button className="flex items-center text-[#25BC9D] px-4 py-2 bg-gray-200 rounded-lg shadow-md hover:bg-gray-300 transition-colors">
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
              <span>تصدير</span>
            </button>
          </div>
        </div>

        {/* قسم البحث والفلترة والجدول */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-800">العقود</h1>
            <div className="flex items-center space-x-4 space-x-reverse">
              {/* حقل البحث الرئيسي */}
              <div className="relative w-72">
                <input
                  type="text"
                  placeholder="ابحث عن..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-right"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <FaSearch className="w-5 h-5 text-gray-400" />
                </div>
              </div>
              {/* زر فتح الفلتر الجانبي */}
              <button
                onClick={() => setIsFilterSidebarOpen(true)}
                className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg shadow-sm hover:bg-gray-100 transition-colors"
                style={{ borderRadius: '0.5rem', background: '#e0f2f7' }}
              >
                <FaFilter className="w-5 h-5 ml-2 text-teal-600" />
                <span className="text-teal-700 font-semibold">تصفية</span>
              </button>
            </div>
          </div>

          {/* الجدول الذي يعرض العقود المفلترة */}
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
                    المحافظة
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    نوع الاشتراك
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
                {filteredContracts.map((contract) => (
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {contract.province}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {contract.subscriptionType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(contract.status)}`}>
                        {contract.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        {/* رابط لعرض تفاصيل العقد */}
                        <Link to={`/contracts/${contract.id}`}>
                          <button className="text-gray-600 hover:text-teal-600 flex items-center">
                            <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                            عرض
                          </button>
                        </Link>
                        {/* رابط لتعديل العقد */}
                        <Link to={`/contracts/create}`}>
                          <button className="text-gray-600 hover:text-blue-600 flex items-center">
                            <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                            تعديل
                          </button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
                {/* رسالة في حال عدم وجود بيانات مطابقة */}
                {filteredContracts.length === 0 && (
                  <tr>
                    <td colSpan="8" className="text-center py-8 text-gray-400 text-sm">لا توجد بيانات مطابقة للبحث والتصفية.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* الفلتر الجانبي */}
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

        {/* رأس الفلتر مع زر الإغلاق */}
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
            <FaTimesCircle className="w-6 h-6" />
          </button>
        </div>

        {/* محتوى الفلاتر */}
        <div className="flex-1 overflow-y-auto pt-6 px-4 space-y-6">
          {/* حقل البحث داخل الفلتر */}
          <div>
            <label htmlFor="searchFilter" className="block text-gray-700 text-sm font-medium mb-2">البحث</label>
            <div className="relative">
              <input
                type="text"
                id="searchFilter"
                placeholder="ابحث عن .."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-right bg-white"
                style={{ background: '#eaf4f7', border: 'none' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <FaSearch className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* فلتر المحافظة */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="province" className="block text-gray-700 text-sm font-medium">المحافظة</label>
              <button onClick={() => setFilterProvince('')} className="text-gray-400 text-xs hover:text-gray-600">مسح</button>
            </div>
            <div className="relative">
              <select
                id="province"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-right bg-white appearance-none"
                style={{ background: '#eaf4f7', border: 'none' }}
                value={filterProvince}
                onChange={(e) => setFilterProvince(e.target.value)}
              >
                <option value="">اختر</option>
                {provinces.map(prov => (
                  <option key={prov} value={prov}>{prov}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaChevronDown className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* فلتر نوع الاشتراك */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="subscriptionType" className="block text-gray-700 text-sm font-medium">نوع الاشتراك</label>
              <button onClick={() => setFilterSubscriptionType('')} className="text-gray-400 text-xs hover:text-gray-600">مسح</button>
            </div>
            <div className="relative">
              <select
                id="subscriptionType"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-right bg-white appearance-none"
                style={{ background: '#eaf4f7', border: 'none' }}
                value={filterSubscriptionType}
                onChange={(e) => setFilterSubscriptionType(e.target.value)}
              >
                <option value="">اختر</option>
                {/* تم تحديد الخيارات لتكون 'جديد' و 'متجدد' فقط */}
                {subscriptionTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaChevronDown className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* فلتر حالة العقد */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="contractStatus" className="block text-gray-700 text-sm font-medium">حالة العقد</label>
              <button onClick={() => setFilterContractStatus('')} className="text-gray-400 text-xs hover:text-gray-600">مسح</button>
            </div>
            <div className="relative">
              <select
                id="contractStatus"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-right bg-white appearance-none"
                style={{ background: '#eaf4f7', border: 'none' }}
                value={filterContractStatus}
                onChange={(e) => setFilterContractStatus(e.target.value)}
              >
                <option value="">اختر</option>
                {contractStatuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaChevronDown className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* أزرار مسح الكل وتطبيق الفلاتر */}
        <div className="px-6 py-4 flex justify-between space-x-4 space-x-reverse border-t border-gray-200">
          <button
            onClick={clearAllFilters}
            className="w-1/2 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            style={{ background: '#eaf4f7', border: 'none' }}
          >
            مسح الكل
          </button>
          <button
            onClick={() => setIsFilterSidebarOpen(false)} // إغلاق الفلتر بعد التطبيق
            className="w-1/2 py-2 bg-gradient-to-r from-teal-400 to-green-500 text-white rounded-lg shadow-md hover:from-teal-500 hover:to-green-600 transition-colors"
          >
            تطبيق ({filteredContracts.length})
          </button>
        </div>
      </div>
    </div>
  );
};

export default Contracts;