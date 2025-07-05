import React, { useState } from 'react';
import { FaSearch, FaChevronDown, FaStar, FaRegStar, FaTimes, FaUser, FaFilter, FaAngleLeft } from 'react-icons/fa';

const Employees = () => {
  const [employeesData, setEmployeesData] = useState([
    {
      id: 1,
      name: 'علياء احمد',
      contractCount: 67,
      monthlyRating: 3,
      weeklyRating: 3,
      accountStatus: 'مغلق',
      notes: 'ملاحظات علياء احمد الأولى: أداء ممتاز هذا الشهر.',
    },
    {
      id: 2,
      name: 'علياء احمد',
      contractCount: 67,
      monthlyRating: 3,
      weeklyRating: 3,
      accountStatus: 'موقوف',
      notes: 'ملاحظات علياء احمد الثانية: تحتاج إلى متابعة في إدارة المشاريع.',
    },
    {
      id: 3,
      name: 'علياء احمد',
      contractCount: 67,
      monthlyRating: 3,
      weeklyRating: 3,
      accountStatus: 'موقوف',
      notes: 'ملاحظات علياء احمد الثالثة: تم حل مشكلة سابقة بنجاح.',
    },
    {
      id: 4,
      name: 'علياء احمد',
      contractCount: 67,
      monthlyRating: 3,
      weeklyRating: 3,
      accountStatus: 'مغلق',
      notes: 'ملاحظات علياء احمد الرابعة: يجب تدريبها على أدوات جديدة.',
    },
    {
      id: 5,
      name: 'علياء احمد',
      contractCount: 67,
      monthlyRating: 3,
      weeklyRating: 3,
      accountStatus: 'مغلق',
      notes: 'ملاحظات علياء احمد الخامسة: تواصل جيد مع العملاء.',
    },
    {
      id: 6,
      name: 'علياء احمد',
      contractCount: 67,
      monthlyRating: 3,
      weeklyRating: 3,
      accountStatus: 'موقوف',
      notes: 'ملاحظات علياء احمد السادسة: أخرت بعض المهام.',
    },
    {
      id: 7,
      name: 'علياء احمد',
      contractCount: 67,
      monthlyRating: 3,
      weeklyRating: 3,
      accountStatus: 'مغلق',
      notes: 'ملاحظات علياء احمد السابعة: مبادرة في تقديم الحلول.',
    },
    {
      id: 8,
      name: 'علياء احمد',
      contractCount: 67,
      monthlyRating: 3,
      weeklyRating: 3,
      accountStatus: 'موقوف',
      notes: 'ملاحظات علياء احمد الثامنة: تحتاج إلى دعم إضافي في البرمجيات.',
    },
    {
      id: 9,
      name: 'علياء احمد',
      contractCount: 67,
      monthlyRating: 3,
      weeklyRating: 3,
      accountStatus: 'مغلق',
      notes: 'ملاحظات علياء احمد التاسعة: ملتزمة بالمواعيد النهائية.',
    },
  ]);

  const [isTeamNotesModalOpen, setIsTeamNotesModalOpen] = useState(false);
  const [currentTeamNotes, setCurrentTeamNotes] = useState('');
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const [filterSearch, setFilterSearch] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterRegion, setFilterRegion] = useState('');
  const [filterPerformance, setFilterPerformance] = useState([]);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [currentRating, setCurrentRating] = useState(0);
  const [employeeToRateId, setEmployeeToRateId] = useState(null);

  const openTeamNotesModal = (notes) => {
    setCurrentTeamNotes(notes);
    setIsTeamNotesModalOpen(true);
  };

  const closeTeamNotesModal = () => {
    setIsTeamNotesModalOpen(false);
    setCurrentTeamNotes('');
  };

  const toggleFilterSidebar = () => {
    setIsFilterSidebarOpen(!isFilterSidebarOpen);
  };

  const closeFilterSidebar = () => {
    setIsFilterSidebarOpen(false);
  };

  const handleFilterPerformanceChange = (rating) => {
    setFilterPerformance((prev) =>
      prev.includes(rating) ? prev.filter((r) => r !== rating) : [...prev, rating]
    );
  };

  const clearFilterDepartment = () => setFilterDepartment('');
  const clearFilterRegion = () => setFilterRegion('');
  const clearFilterPerformance = () => setFilterPerformance([]);
  const clearAllFilters = () => {
    setFilterSearch('');
    setFilterDepartment('');
    setFilterRegion('');
    setFilterPerformance([]);
  };

  const applyFilters = () => {
    console.log('Applying filters:', { filterSearch, filterDepartment, filterRegion, filterPerformance });
    closeFilterSidebar();
  };

  const openRatingModal = (employeeId) => {
    setEmployeeToRateId(employeeId);
    // Find the current monthly rating of the employee to pre-fill the stars
    const employee = employeesData.find(emp => emp.id === employeeId);
    setCurrentRating(employee ? employee.monthlyRating : 0);
    setIsRatingModalOpen(true);
  };

  const closeRatingModal = () => {
    setIsRatingModalOpen(false);
    setCurrentRating(0);
    setEmployeeToRateId(null);
  };

  const handleRatingSubmit = () => {
    if (employeeToRateId !== null) {
      setEmployeesData((prevData) =>
        prevData.map((employee) =>
          employee.id === employeeToRateId
            ? { ...employee, monthlyRating: currentRating, weeklyRating: currentRating }
            : employee
        )
      );
    }
    closeRatingModal();
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < rating) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-gray-300" />);
      }
    }
    return stars;
  };

  const renderEditableStars = (ratingValue, setRatingValue) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar
          key={i}
          className={`cursor-pointer text-4xl ${i <= ratingValue ? 'text-yellow-400' : 'text-gray-300'}`}
          onClick={() => setRatingValue(i)}
        />
      );
    }
    return stars;
  };

  const getAppliedFilterCount = () => {
    let count = 0;
    if (filterSearch) count++;
    if (filterDepartment) count++;
    if (filterRegion) count++;
    count += filterPerformance.length;
    return count;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex" style={{ direction: 'rtl' }}>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-6 p-4 bg-white rounded-lg shadow-sm">
          <div className="flex items-center border border-gray-300 rounded-full overflow-hidden flex-grow-0 w-80">
            <input
              type="text"
              placeholder="البحث ماذا تبحث عن..."
              className="flex-grow p-2 outline-none focus:ring-0 text-right"
            />
            <div className="bg-gray-50 p-2 border-l border-gray-300">
              <FaSearch className="text-gray-500 text-lg" />
            </div>
          </div>
          <button
            onClick={toggleFilterSidebar}
            className="flex items-center p-3 border border-gray-300 rounded-full text-gray-600 hover:bg-gray-50 transition duration-150 ease-in-out mr-4"
          >
            <FaFilter className="text-xl" />
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
                    <span>اسم الموظف</span>
                    <FaChevronDown className="ml-1 text-gray-400 text-xs" />
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center justify-end">
                    <span>عدد العقود</span>
                    <FaChevronDown className="ml-1 text-gray-400 text-xs" />
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center justify-end">
                    <span>تقييم الأداء الشهري</span>
                    <FaChevronDown className="ml-1 text-gray-400 text-xs" />
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center justify-end">
                    <span>تقييم أسبوعي</span>
                    <FaChevronDown className="ml-1 text-gray-400 text-xs" />
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center justify-end">
                    <span>حالة الحساب</span>
                    <FaChevronDown className="ml-1 text-gray-400 text-xs" />
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {employeesData.map((employee) => (
                <tr key={employee.id} className="bg-white border-b hover:bg-gray-50 transition duration-150 ease-in-out">
                  <td className="px-6 py-4 text-center">
                    <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600 rounded" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-800">
                    {employee.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-600">
                    {employee.contractCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-600">
                    <div className="flex items-center justify-end">
                      <span>({employee.monthlyRating})</span>
                      {renderStars(employee.monthlyRating)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-600">
                    <div className="flex items-center justify-end">
                      <span>({employee.weeklyRating})</span>
                      {renderStars(employee.weeklyRating)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                      ${employee.accountStatus === 'مغلق' ? 'bg-green-100 text-green-700 border-green-300' :
                        'bg-red-100 text-red-700 border-red-300'}`}>
                      {employee.accountStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <div className="flex justify-center items-center space-x-2 space-x-reverse">
                      <button
                        onClick={() => openRatingModal(employee.id)}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-amber-100 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                      >
                        <FaStar className="ml-1.5 -mr-0.5  h-4 w-4 text-yellow-500" />
                        تقييم
                      </button>
                      <button
                        onClick={() => openTeamNotesModal(employee.notes)}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-[#25BC9D12] hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                      >
                        <FaUser className="ml-1.5 -mr-0.5 h-4 w-4" />
                        اضافة تعليق
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isTeamNotesModalOpen && (
        <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50 p-4">
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
                onChange={(e) => setCurrentTeamNotes(e.target.value)}
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

      {isRatingModalOpen && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full relative text-center rtl" style={{ direction: 'rtl', background: 'linear-gradient(135deg, #f0f4f8 0%, #e0e8ed 100%)' }}>
            <button
              onClick={closeRatingModal}
              className="absolute top-3 left-3 text-gray-600 hover:text-gray-900 text-xl bg-gray-200 rounded-full w-7 h-7 flex items-center justify-center focus:outline-none"
            >
              <FaTimes />
            </button>
            <div className="flex flex-col items-center mb-6">
              <div className="p-4 bg-blue-100 rounded-full mb-4">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-blue-600"
                >
                  <path
                    d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM17 12H7V10H17V12ZM17 16H7V14H17V16Z"
                    fill="currentColor"
                  />
                  <rect x="6" y="6" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M9 10L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M9 14L15 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>

              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">قم بتقييم الموظفة</h3>
              <p className="text-gray-600 mb-4">يساعدنا تقييمك للموظفة</p>
              <div className="flex justify-center space-x-1 space-x-reverse mb-6">
                {renderEditableStars(currentRating, setCurrentRating)}
                <FaRegStar className="text-yellow-400 text-4xl" />
              </div>
            </div>

            <div className="flex justify-center space-x-4 space-x-reverse">
              <button
                onClick={closeRatingModal}
                className="px-8 py-2 bg-gray-300 text-gray-800 rounded-full hover:bg-gray-400 transition"
              >
                إلغاء
              </button>
              <button
                onClick={handleRatingSubmit}
                className="px-8 py-2 rounded-full text-white transition"
                style={{ background: 'linear-gradient(90deg, #25BC9D, #308F87)' }}
              >
                تم التقييم
              </button>
            </div>
          </div>
        </div>
      )}

      {isFilterSidebarOpen && (
        <div
          className="fixed inset-0 flex justify-end z-40"
          onClick={closeFilterSidebar}
        >
          <div
            className={`w-80 bg-white shadow-lg p-6 transform transition-transform duration-300 ease-in-out h-full
              ${isFilterSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}
            style={{ direction: 'rtl', background: 'linear-gradient(180deg, #f0f8f8 0%, #d0e0e0 100%)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold text-gray-800">الفلاتر</h3>
              <button
                onClick={closeFilterSidebar}
                className="text-gray-600 hover:text-gray-900 text-xl bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center"
              >
                <FaTimes />
              </button>
            </div>

            <div className="mb-6">
              <label htmlFor="filterSearch" className="block text-md font-medium text-gray-700 mb-2">
                البحث
              </label>
              <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                <input
                  type="text"
                  id="filterSearch"
                  placeholder="ابحث عن .."
                  className="flex-grow p-2 outline-none focus:ring-0 text-right"
                  value={filterSearch}
                  onChange={(e) => setFilterSearch(e.target.value)}
                />
                <div className="bg-gray-50 p-2 border-l border-gray-300">
                  <FaSearch className="text-gray-500 text-lg" />
                </div>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="filterDepartment" className="block text-md font-medium text-gray-700">
                  القسم
                </label>
                <button onClick={clearFilterDepartment} className="text-blue-500 text-sm hover:underline">
                  مسح
                </button>
              </div>
              <select
                id="filterDepartment"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-right bg-white"
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
              >
                <option value="">اختر</option>
                <option value="قسم التقنية">قسم التقنية</option>
                <option value="قسم المبيعات">قسم المبيعات</option>
              </select>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="filterRegion" className="block text-md font-medium text-gray-700">
                  المنطقة
                </label>
                <button onClick={clearFilterRegion} className="text-blue-500 text-sm hover:underline">
                  مسح
                </button>
              </div>
              <select
                id="filterRegion"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-right bg-white"
                value={filterRegion}
                onChange={(e) => setFilterRegion(e.target.value)}
              >
                <option value="">اختر</option>
                <option value="بغداد">بغداد</option>
                <option value="البصرة">البصرة</option>
              </select>
            </div>

            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-md font-medium text-gray-700">
                  الأداء العام
                </label>
                <button onClick={clearFilterPerformance} className="text-blue-500 text-sm hover:underline">
                  مسح
                </button>
              </div>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <label key={rating} className="flex items-center justify-end">
                    <span>({rating})</span>
                    {renderStars(rating)}
                    <input
                      type="checkbox"
                      className="form-checkbox h-5 w-5 text-blue-600 rounded-md mr-3"
                      checked={filterPerformance.includes(rating)}
                      onChange={() => handleFilterPerformanceChange(rating)}
                    />
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-center space-x-4 space-x-reverse">
              <button
                onClick={clearAllFilters}
                className="px-6 py-2 bg-gray-300 text-gray-800 rounded-full hover:bg-gray-400 transition"
              >
                مسح الكل
              </button>
              <button
                onClick={applyFilters}
                className="px-6 py-2 rounded-full text-white transition"
                style={{ background: 'linear-gradient(90deg, #25BC9D, #308F87)' }}
              >
                تطبيق ({getAppliedFilterCount()})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;