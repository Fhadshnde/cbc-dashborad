import React, { useState, useMemo } from 'react';
import { FaHome, FaAngleRight, FaFilter, FaSearch, FaChevronDown, FaStar, FaRegStar, FaEdit, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Surveys = () => {
  const [tableData, setTableData] = useState([
    {
      id: 1,
      storeName: 'متجر بغداد المركزي',
      responsibleEmployee: 'علياء احمد',
      attachedImage: true,
      initialRating: 3,
      followUpStatus: 'منجز',
      teamNotes: 'هذه ملاحظات الفريق للمتجر الأول: المتجر يحتاج إلى تجديد الديكورات الداخلية وتحسين خدمة العملاء.',
      surveyDate: '2025-01-10',
    },
    {
      id: 2,
      storeName: 'متجر التقنية بغداد',
      responsibleEmployee: 'فاطمة الزهراء',
      attachedImage: true,
      initialRating: 4,
      followUpStatus: 'قيد المتابعة',
      teamNotes: 'هذه ملاحظات الفريق للمتجر الثاني: يوجد بعض المشاكل في المخزون ويجب التحقق منها.',
      surveyDate: '2025-01-15',
    },
    {
      id: 3,
      storeName: 'متجر السالمية',
      responsibleEmployee: 'محمد جاسم',
      attachedImage: true,
      initialRating: 2,
      followUpStatus: 'منجز',
      teamNotes: 'هذه ملاحظات الفريق للمتجر الثالث: الأداء ممتاز ولا توجد ملاحظات سلبية.',
      surveyDate: '2025-01-20',
    },
    {
      id: 4,
      storeName: 'متجر شمال بغداد',
      responsibleEmployee: 'ليلى خالد',
      attachedImage: true,
      initialRating: 5,
      followUpStatus: 'غير منجز',
      teamNotes: 'هذه ملاحظات الفريق للمتجر الرابع: العميل رفض بعض التعديلات المقترحة.',
      surveyDate: '2025-02-01',
    },
    {
      id: 5,
      storeName: 'متجر الجنوب',
      responsibleEmployee: 'أحمد علي',
      attachedImage: true,
      initialRating: 3,
      followUpStatus: 'منجز',
      teamNotes: 'هذه ملاحظات الفريق للمتجر الخامس: تم حل جميع المشاكل السابقة بنجاح.',
      surveyDate: '2025-02-05',
    },
    {
      id: 6,
      storeName: 'متجر الغربية',
      responsibleEmployee: 'سارة يوسف',
      attachedImage: true,
      initialRating: 4,
      followUpStatus: 'قيد المتابعة',
      teamNotes: 'هذه ملاحظات الفريق للمتجر السادس: فريق الصيانة سيزور المتجر قريباً.',
      surveyDate: '2025-02-10',
    },
    {
      id: 7,
      storeName: 'متجر الشرق',
      responsibleEmployee: 'مصطفى قاسم',
      attachedImage: true,
      initialRating: 1,
      followUpStatus: 'منجز',
      teamNotes: 'هذه ملاحظات الفريق للمتجر السابع: تم تحقيق الأهداف الشهرية.',
      surveyDate: '2025-02-15',
    },
    {
      id: 8,
      storeName: 'متجر زهور بغداد',
      responsibleEmployee: 'زينب هادي',
      attachedImage: true,
      initialRating: 5,
      followUpStatus: 'قيد المتابعة',
      teamNotes: 'هذه ملاحظات الفريق للمتجر الثامن: انتظار موافقة الإدارة على التغييرات.',
      surveyDate: '2025-02-20',
    },
    {
      id: 9,
      storeName: 'متجر الحياة',
      responsibleEmployee: 'علياء احمد',
      attachedImage: true,
      initialRating: 2,
      followUpStatus: 'منجز',
      teamNotes: 'هذه ملاحظات الفريق للمتجر التاسع: كل شيء على ما يرام.',
      surveyDate: '2025-03-01',
    },
  ]);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEmployee, setFilterEmployee] = useState('');
  const [filterRating, setFilterRating] = useState(0);
  const [filterFollowUpStatus, setFilterFollowUpStatus] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');

  const [isAttachedImagesModalOpen, setIsAttachedImagesModalOpen] = useState(false);
  const [isTeamNotesModalOpen, setIsTeamNotesModalOpen] = useState(false);
  const [currentTeamNotes, setCurrentTeamNotes] = useState('');

  const employees = useMemo(() => [...new Set(tableData.map(item => item.responsibleEmployee))], [tableData]);
  const followUpStatuses = useMemo(() => [...new Set(tableData.map(item => item.followUpStatus))], [tableData]);

  const filteredData = useMemo(() => {
    return tableData.filter(row => {
      const matchesSearch =
        row.storeName.includes(searchTerm) ||
        row.responsibleEmployee.includes(searchTerm);

      const matchesEmployee = filterEmployee ? row.responsibleEmployee === filterEmployee : true;
      const matchesRating = filterRating ? row.initialRating === filterRating : true;
      const matchesFollowUpStatus = filterFollowUpStatus ? row.followUpStatus === filterFollowUpStatus : true;

      const surveyDate = new Date(row.surveyDate);
      const fromDate = filterDateFrom ? new Date(filterDateFrom) : null;
      const toDate = filterDateTo ? new Date(filterDateTo) : null;

      const matchesDateFrom = fromDate ? surveyDate >= fromDate : true;
      const matchesDateTo = toDate ? surveyDate <= toDate : true;

      return matchesSearch && matchesEmployee && matchesRating && matchesFollowUpStatus && matchesDateFrom && matchesDateTo;
    });
  }, [tableData, searchTerm, filterEmployee, filterRating, filterFollowUpStatus, filterDateFrom, filterDateTo]);

  const getFilterCount = (filterType, value) => {
    if (filterType === 'employee') {
      return tableData.filter(row => row.responsibleEmployee === value).length;
    } else if (filterType === 'rating') {
      return tableData.filter(row => row.initialRating === value).length;
    } else if (filterType === 'followUpStatus') {
      return tableData.filter(row => row.followUpStatus === value).length;
    }
    return 0;
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setFilterEmployee('');
    setFilterRating(0);
    setFilterFollowUpStatus('');
    setFilterDateFrom('');
    setFilterDateTo('');
  };

  const openAttachedImagesModal = () => {
    setIsAttachedImagesModalOpen(true);
  };

  const closeAttachedImagesModal = () => {
    setIsAttachedImagesModalOpen(false);
  };

  const openTeamNotesModal = (notes) => {
    setCurrentTeamNotes(notes);
    setIsTeamNotesModalOpen(true);
  };

  const closeTeamNotesModal = () => {
    setIsTeamNotesModalOpen(false);
    setCurrentTeamNotes('');
  };

  return (
    <div className="flex min-h-screen rtl font-sans bg-gray-100">
      <div
        className={`flex-1 p-6 transition-all duration-300 ${isFilterOpen ? 'ml-80' : 'ml-0'}`}
      >
        <div className="flex items-center justify-between mb-6 p-4 bg-white rounded-lg shadow-sm" style={{ direction: 'rtl' }}>
          <div className="flex items-center border border-gray-300 rounded-md overflow-hidden flex-grow-0 w-80">
            <input
              type="text"
              placeholder="البحث ماذا تبحث عن..."
              className="flex-grow p-2 outline-none focus:ring-0 text-right"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="bg-gray-50 p-2 border-l border-gray-300">
              <FaSearch className="text-[#25BC9D] text-lg" />
            </div>
          </div>
          <Link
            to="/surveys/add"
            className="flex items-center mr-[560px] px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-blue-700 transition duration-150 ease-in-out"
          >
            <FaEdit className="ml-2" />
            إضافة استبيان
          </Link>
          <button
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg shadow-sm hover:bg-gray-100 transition-colors"
            style={{ borderRadius: '0.5rem', background: '#e0f2f7' }}
          >
            <FaFilter className="w-5 h-5 ml-2 text-teal-600" />
            <span className="text-teal-700 font-semibold">تصفية</span>
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600 rounded" />
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center justify-end">
                    <span>اسم المتجر</span>
                    <FaChevronDown className="ml-1 text-gray-400 text-xs" />
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center justify-end">
                    <span>الموظف المسؤولة</span>
                    <FaChevronDown className="ml-1 text-gray-400 text-xs" />
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center justify-end">
                    <span>الصور المرفقة</span>
                    <FaChevronDown className="ml-1 text-gray-400 text-xs" />
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center justify-end">
                    <span>تقييم أولي</span>
                    <FaChevronDown className="ml-1 text-gray-400 text-xs" />
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center justify-end">
                    <span>حالة المتابعة</span>
                    <FaChevronDown className="ml-1 text-gray-400 text-xs" />
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center justify-end">
                    <span>تاريخ الاستبيان</span>
                    <FaChevronDown className="ml-1 text-gray-400 text-xs" />
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center justify-end">
                    <span>ملاحظات الفريق</span>
                    <FaChevronDown className="ml-1 text-gray-400 text-xs" />
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((row) => (
                <tr key={row.id} className="bg-white border-b hover:bg-gray-50 transition duration-150 ease-in-out">
                  <td className="px-6 py-4 text-center">
                    <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600 rounded" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-800">
                    {row.storeName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-600">
                    {row.responsibleEmployee}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-600">
                    <div className="flex items-center justify-end">
                      {row.attachedImage ? (
                        <button
                          onClick={openAttachedImagesModal}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-300 hover:bg-blue-200 transition duration-150 ease-in-out"
                        >
                          مرفق
                        </button>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-300">
                          لا يوجد
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-600">
                    <div className="flex items-center justify-end">
                      <span className="ml-1">({row.initialRating})</span>
                      <FaStar className="text-yellow-400" />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-600">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                      ${row.followUpStatus === 'منجز' ? 'bg-green-100 text-green-700 border-green-300' :
                         row.followUpStatus === 'قيد المتابعة' ? 'bg-yellow-100 text-yellow-700 border-yellow-300' :
                         'bg-red-100 text-red-700 border-red-300'}`}>
                      {row.followUpStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-600">
                    {row.surveyDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-blue-600 cursor-pointer hover:underline"
                      onClick={() => openTeamNotesModal(row.teamNotes)}>
                    {row.teamNotes.length > 20 ? `${row.teamNotes.substring(0, 20)}...` : row.teamNotes}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <Link to={`/surveys/edit`}>
                      <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out">
                        <FaEdit className="ml-1.5 -mr-0.5 h-4 w-4" />
                        تعديل
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan="9" className="text-center py-8 text-gray-400 text-sm">لا توجد بيانات مطابقة للبحث والتصفية.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div
        className={`fixed inset-y-0 left-0 w-80 shadow-lg transform transition-transform duration-300 z-50 p-6 rtl
          ${isFilterOpen ? 'translate-x-0' : '-translate-x-full'}
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
          <button onClick={() => setIsFilterOpen(false)} className="text-gray-500 hover:text-gray-700 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
            <FaTimes className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pt-6 px-4 space-y-6">
          <div>
            <label htmlFor="searchFilter" className="block text-gray-700 text-sm font-medium mb-2">البحث</label>
            <div className="relative">
              <input
                type="text"
                id="searchFilter"
                placeholder="ابحث عن اسم المتجر أو الموظف..."
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

          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="employeeFilter" className="block text-gray-700 text-sm font-medium">الموظف المسؤول</label>
              <button onClick={() => setFilterEmployee('')} className="text-gray-400 text-xs hover:text-gray-600">مسح</button>
            </div>
            <div className="relative">
              <select
                id="employeeFilter"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-right bg-white appearance-none"
                style={{ background: '#eaf4f7', border: 'none' }}
                value={filterEmployee}
                onChange={(e) => setFilterEmployee(e.target.value)}
              >
                <option value="">اختر</option>
                {employees.map(emp => (
                  <option key={emp} value={emp}>{emp} ({getFilterCount('employee', emp)})</option>
                ))}
              </select>
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaChevronDown className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-gray-700 text-sm font-medium">التقييم الأولي</label>
              <button onClick={() => setFilterRating(0)} className="text-gray-400 text-xs hover:text-gray-600">مسح</button>
            </div>
            {[0, 1, 2, 3, 4, 5].map(r => (
              <div key={r} className="flex items-center justify-end mb-2 cursor-pointer" onClick={() => setFilterRating(r)}>
                {r === 0 ? (
                  <span className={`text-sm mr-2 ${filterRating === 0 ? 'font-semibold text-teal-600' : 'text-gray-700'}`}>الكل</span>
                ) : (
                  <>
                    <span className={`text-sm mr-2 ${filterRating === r ? 'font-semibold text-teal-600' : 'text-gray-700'}`}>({getFilterCount('rating', r)})</span>
                    <FaStar className={`text-yellow-400 ml-1 ${filterRating === r ? 'scale-110' : ''}`} />
                  </>
                )}
                <input
                  type="radio"
                  name="ratingFilter"
                  className="form-radio h-4 w-4 text-teal-600 rounded-sm"
                  checked={filterRating === r}
                  onChange={() => setFilterRating(r)}
                />
              </div>
            ))}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="followUpStatusFilter" className="block text-gray-700 text-sm font-medium">حالة المتابعة</label>
              <button onClick={() => setFilterFollowUpStatus('')} className="text-gray-400 text-xs hover:text-gray-600">مسح</button>
            </div>
            <div className="relative">
              <select
                id="followUpStatusFilter"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-right bg-white appearance-none"
                style={{ background: '#eaf4f7', border: 'none' }}
                value={filterFollowUpStatus}
                onChange={(e) => setFilterFollowUpStatus(e.target.value)}
              >
                <option value="">اختر</option>
                {followUpStatuses.map(status => (
                  <option key={status} value={status}>{status} ({getFilterCount('followUpStatus', status)})</option>
                ))}
              </select>
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaChevronDown className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="dateFrom" className="block text-gray-700 text-sm font-medium">تاريخ الاستبيان من</label>
              <button onClick={() => setFilterDateFrom('')} className="text-gray-400 text-xs hover:text-gray-600">مسح</button>
            </div>
            <input
              type="date"
              id="dateFrom"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-right bg-white"
              value={filterDateFrom}
              onChange={(e) => setFilterDateFrom(e.target.value)}
              style={{ background: '#eaf4f7', border: 'none' }}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="dateTo" className="block text-gray-700 text-sm font-medium">تاريخ الاستبيان إلى</label>
              <button onClick={() => setFilterDateTo('')} className="text-gray-400 text-xs hover:text-gray-600">مسح</button>
            </div>
            <input
              type="date"
              id="dateTo"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-right bg-white"
              value={filterDateTo}
              onChange={(e) => setFilterDateTo(e.target.value)}
              style={{ background: '#eaf4f7', border: 'none' }}
            />
          </div>
        </div>

        <div className="px-6 py-4 flex justify-between space-x-4 space-x-reverse border-t border-gray-200">
          <button
            onClick={clearAllFilters}
            className="w-1/2 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            style={{ background: '#eaf4f7', border: 'none' }}
          >
            مسح الكل
          </button>
          <button
            onClick={() => setIsFilterOpen(false)}
            className="w-1/2 py-2 bg-gradient-to-r from-teal-400 to-green-500 text-white rounded-lg shadow-md hover:from-teal-500 hover:to-green-600 transition-colors"
          >
            تطبيق ({filteredData.length})
          </button>
        </div>
      </div>

      {isAttachedImagesModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-5xl w-full relative rtl" style={{ direction: 'rtl' }}>
            <button
              onClick={closeAttachedImagesModal}
              className="absolute top-4 left-4 text-gray-600 hover:text-gray-900 text-lg bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center"
            >
              <FaTimes />
            </button>
            <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">الصور المرفقة</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="border border-gray-300 rounded-xl p-4 flex flex-col items-center bg-white shadow-sm">
                <div className="w-full h-40 rounded-md overflow-hidden mb-4">
                  <img src="https://placehold.co/400x200/E0F2F7/25BC9D?text=صورة+1" alt="صورة مرفقة 1" className="w-full h-full object-cover" />
                </div>
                <button className="bg-blue-600 text-white text-sm px-6 py-2 rounded-full hover:bg-blue-700 transition">عرض</button>
              </div>
              <div className="border border-gray-300 rounded-xl p-4 flex flex-col items-center bg-white shadow-sm">
                <div className="w-full h-40 rounded-md overflow-hidden mb-4">
                  <img src="https://placehold.co/400x200/E0F2F7/25BC9D?text=صورة+2" alt="صورة مرفقة 2" className="w-full h-full object-cover" />
                </div>
                <button className="bg-blue-600 text-white text-sm px-6 py-2 rounded-full hover:bg-blue-700 transition">عرض</button>
              </div>
              <div className="border border-gray-300 rounded-xl p-4 flex flex-col items-center bg-white shadow-sm">
                <div className="w-full h-40 rounded-md overflow-hidden mb-4">
                  <img src="https://placehold.co/400x200/E0F2F7/25BC9D?text=صورة+3" alt="صورة مرفقة 3" className="w-full h-full object-cover" />
                </div>
                <button className="bg-blue-600 text-white text-sm px-6 py-2 rounded-full hover:bg-blue-700 transition">عرض</button>
              </div>
              <div className="border border-gray-300 rounded-xl p-4 flex flex-col items-center bg-white shadow-sm">
                <div className="w-full h-40 rounded-md overflow-hidden mb-4">
                  <img src="https://placehold.co/400x200/E0F2F7/25BC9D?text=صورة+4" alt="صورة مرفقة 4" className="w-full h-full object-cover" />
                </div>
                <button className="bg-blue-600 text-white text-sm px-6 py-2 rounded-full hover:bg-blue-700 transition">عرض</button>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={closeAttachedImagesModal}
                className="px-8 py-2 bg-gray-300 text-gray-800 rounded-full hover:bg-gray-400 transition"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {isTeamNotesModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full relative rtl" style={{ direction: 'rtl', background: 'linear-gradient(135deg, #f0f4f8 0%, #e0e8ed 100%)' }}>
            <button
              onClick={closeTeamNotesModal}
              className="absolute top-3 left-3 text-gray-600 hover:text-gray-900 text-xl bg-gray-200 rounded-full w-7 h-7 flex items-center justify-center focus:outline-none"
            >
              <FaTimes />
            </button>
            <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">ملاحظات الفريق</h3>

            <div className="mb-6">
              <label htmlFor="teamNotes" className="block text-sm font-medium text-gray-700 text-right mb-2">
                الملاحظات
              </label>
              <textarea
                id="teamNotes"
                className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-blue-500 focus:border-blue-500 text-right resize-none"
                rows="8"
                value={currentTeamNotes}
                readOnly
                placeholder="اجابتك"
                style={{ direction: 'rtl' }}
              ></textarea>
            </div>

            <div className="text-center">
              <button
                onClick={closeTeamNotesModal}
                className="px-8 py-2 bg-gray-300 text-gray-800 rounded-full hover:bg-gray-400 transition"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Surveys;
