import React, { useState, useMemo } from 'react';
import { FaSearch, FaChevronDown, FaStar, FaRegStar, FaTimes, FaUser, FaFilter, FaAngleLeft } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";

const Employees = () => {
    const navigate = useNavigate();

    // حالة بيانات الموظفين - تم تحديثها لتشمل القسم والمنطقة
    const [employeesData, setEmployeesData] = useState([
        {
            id: 1,
            name: 'علياء احمد',
            contractCount: 67,
            monthlyRating: 3,
            weeklyRating: 3,
            accountStatus: 'مغلق',
            notes: 'ملاحظات علياء احمد الأولى: أداء ممتاز هذا الشهر.',
            department: 'قسم المبيعات', // إضافة حقل القسم
            region: 'بغداد', // إضافة حقل المنطقة
        },
        {
            id: 2,
            name: 'فاطمة الزهراء', // اسم موظف مختلف لتوضيح الفلترة
            contractCount: 72,
            monthlyRating: 4,
            weeklyRating: 4,
            accountStatus: 'موقوف',
            notes: 'ملاحظات فاطمة الزهراء الثانية: تحتاج إلى متابعة في إدارة المشاريع.',
            department: 'قسم التقنية',
            region: 'البصرة',
        },
        {
            id: 3,
            name: 'محمد جاسم', // اسم موظف مختلف لتوضيح الفلترة
            contractCount: 50,
            monthlyRating: 2,
            weeklyRating: 2,
            accountStatus: 'مغلق',
            notes: 'ملاحظات محمد جاسم الثالثة: تم حل مشكلة سابقة بنجاح.',
            department: 'قسم المبيعات',
            region: 'بغداد',
        },
        {
            id: 4,
            name: 'ليلى خالد', // اسم موظف مختلف لتوضيح الفلترة
            contractCount: 80,
            monthlyRating: 5,
            weeklyRating: 5,
            accountStatus: 'مغلق',
            notes: 'ملاحظات ليلى خالد الرابعة: يجب تدريبها على أدوات جديدة.',
            department: 'قسم التقنية',
            region: 'أربيل', // منطقة جديدة
        },
        {
            id: 5,
            name: 'أحمد علي', // اسم موظف مختلف لتوضيح الفلترة
            contractCount: 55,
            monthlyRating: 3,
            weeklyRating: 3,
            accountStatus: 'مغلق',
            notes: 'ملاحظات أحمد علي الخامسة: تواصل جيد مع العملاء.',
            department: 'قسم المبيعات',
            region: 'البصرة',
        },
        {
            id: 6,
            name: 'سارة يوسف', // اسم موظف مختلف لتوضيح الفلترة
            contractCount: 60,
            monthlyRating: 4,
            weeklyRating: 4,
            accountStatus: 'موقوف',
            notes: 'ملاحظات سارة يوسف السادسة: أخرت بعض المهام.',
            department: 'قسم التقنية',
            region: 'بغداد',
        },
        {
            id: 7,
            name: 'مصطفى قاسم', // اسم موظف مختلف لتوضيح الفلترة
            contractCount: 70,
            monthlyRating: 1,
            weeklyRating: 1,
            accountStatus: 'مغلق',
            notes: 'ملاحظات مصطفى قاسم السابعة: مبادرة في تقديم الحلول.',
            department: 'قسم المبيعات',
            region: 'أربيل',
        },
        {
            id: 8,
            name: 'زينب هادي', // اسم موظف مختلف لتوضيح الفلترة
            contractCount: 65,
            monthlyRating: 5,
            weeklyRating: 5,
            accountStatus: 'موقوف',
            notes: 'ملاحظات زينب هادي الثامنة: تحتاج إلى دعم إضافي في البرمجيات.',
            department: 'قسم التقنية',
            region: 'البصرة',
        },
        {
            id: 9,
            name: 'علياء احمد', // تكرار الاسم لتوضيح البحث
            contractCount: 75,
            monthlyRating: 2,
            weeklyRating: 2,
            accountStatus: 'مغلق',
            notes: 'ملاحظات علياء احمد التاسعة: ملتزمة بالمواعيد النهائية.',
            department: 'قسم المبيعات',
            region: 'بغداد',
        },
    ]);

    // حالات المودال للملاحظات والتقييم
    const [isTeamNotesModalOpen, setIsTeamNotesModalOpen] = useState(false);
    const [currentTeamNotes, setCurrentTeamNotes] = useState('');
    const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
    const [currentRating, setCurrentRating] = useState(0);
    const [employeeToRateId, setEmployeeToRateId] = useState(null);

    // حالات الفلاتر الجانبية
    const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
    const [filterSearch, setFilterSearch] = useState(''); // حقل البحث داخل الفلتر الجانبي
    const [filterDepartment, setFilterDepartment] = useState('');
    const [filterRegion, setFilterRegion] = useState('');
    const [filterPerformance, setFilterPerformance] = useState([]); // مصفوفة لتخزين التقييمات المختارة

    // قائمة الأقسام والمناطق الفريدة من البيانات
    const departments = useMemo(() => [...new Set(employeesData.map(emp => emp.department))], [employeesData]);
    const regions = useMemo(() => [...new Set(employeesData.map(emp => emp.region))], [employeesData]);

    // منطق تصفية البيانات بناءً على جميع الفلاتر
    const filteredEmployees = useMemo(() => {
        return employeesData.filter(employee => {
            // تصفية البحث (اسم الموظف أو الملاحظات)
            const matchesSearch =
                employee.name.toLowerCase().includes(filterSearch.toLowerCase()) ||
                employee.notes.toLowerCase().includes(filterSearch.toLowerCase());

            // تصفية القسم
            const matchesDepartment = filterDepartment ? employee.department === filterDepartment : true;

            // تصفية المنطقة
            const matchesRegion = filterRegion ? employee.region === filterRegion : true;

            // تصفية الأداء (التقييم الشهري)
            const matchesPerformance = filterPerformance.length > 0
                ? filterPerformance.includes(employee.monthlyRating)
                : true;

            return matchesSearch && matchesDepartment && matchesRegion && matchesPerformance;
        });
    }, [employeesData, filterSearch, filterDepartment, filterRegion, filterPerformance]);

    // دالة لفتح مودال الملاحظات
    const openTeamNotesModal = (notes) => {
        setCurrentTeamNotes(notes);
        setIsTeamNotesModalOpen(true);
    };

    // دالة لإغلاق مودال الملاحظات
    const closeTeamNotesModal = () => {
        setIsTeamNotesModalOpen(false);
        setCurrentTeamNotes('');
    };

    // دالة لفتح/إغلاق الفلتر الجانبي
    const toggleFilterSidebar = () => {
        setIsFilterSidebarOpen(!isFilterSidebarOpen);
    };

    // دالة لإغلاق الفلتر الجانبي
    const closeFilterSidebar = () => {
        setIsFilterSidebarOpen(false);
    };

    // دالة للتعامل مع تغييرات فلاتر الأداء (التقييم)
    const handleFilterPerformanceChange = (rating) => {
        setFilterPerformance((prev) =>
            prev.includes(rating) ? prev.filter((r) => r !== rating) : [...prev, rating]
        );
    };

    // دوال لمسح فلاتر محددة
    const clearFilterDepartment = () => setFilterDepartment('');
    const clearFilterRegion = () => setFilterRegion('');
    const clearFilterPerformance = () => setFilterPerformance([]);

    // دالة لمسح جميع الفلاتر
    const clearAllFilters = () => {
        setFilterSearch('');
        setFilterDepartment('');
        setFilterRegion('');
        setFilterPerformance([]);
    };

    // دالة لتطبيق الفلاتر (في هذه الحالة، فقط إغلاق الشريط الجانبي لأن useMemo يقوم بالتصفية تلقائياً)
    const applyFilters = () => {
        closeFilterSidebar();
    };

    // دالة لفتح مودال التقييم
    const openRatingModal = (employeeId) => {
        setEmployeeToRateId(employeeId);
        const employee = employeesData.find(emp => emp.id === employeeId);
        setCurrentRating(employee ? employee.monthlyRating : 0);
        setIsRatingModalOpen(true);
    };

    // دالة لإغلاق مودال التقييم
    const closeRatingModal = () => {
        setIsRatingModalOpen(false);
        setCurrentRating(0);
        setEmployeeToRateId(null);
    };

    // دالة لإرسال التقييم
    const handleRatingSubmit = () => {
        if (employeeToRateId !== null) {
            setEmployeesData((prevData) =>
                prevData.map((employee) =>
                    employee.id === employeeToRateId
                        ? { ...employee, monthlyRating: currentRating, weeklyRating: currentRating } // تحديث التقييم الشهري والأسبوعي
                        : employee
                )
            );
        }
        closeRatingModal();
    };

    // دالة لعرض النجوم بناءً على التقييم
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

    // دالة لعرض النجوم القابلة للتعديل في مودال التقييم
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

    // دالة لحساب عدد الفلاتر المطبقة
    const getAppliedFilterCount = () => {
        let count = 0;
        if (filterSearch) count++;
        if (filterDepartment) count++;
        if (filterRegion) count++;
        if (filterPerformance.length > 0) count++; // يعتبر فلتر الأداء فلترًا واحدًا إذا تم اختيار أي تقييم
        return count;
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8 flex" style={{ direction: 'rtl' }}>
            <div className="flex-1">
                <div className="flex items-center justify-between mb-6 p-4 bg-white rounded-lg shadow-sm">
                    {/* حقل البحث الرئيسي في الشريط العلوي */}
                    <div className="flex items-center border border-gray-300 rounded-full overflow-hidden flex-grow-0 w-80">
                        <input
                            type="text"
                            placeholder="البحث ماذا تبحث عن..."
                            className="flex-grow p-2 outline-none focus:ring-0 text-right"
                            value={filterSearch} // ربط حقل البحث الرئيسي بحالة filterSearch
                            onChange={(e) => setFilterSearch(e.target.value)}
                        />
                        <div className="bg-gray-50 p-2 border-l border-gray-300">
                            <FaSearch className="text-[#2EC19F] text-lg" />
                        </div>
                    </div>
                    {/* زر فتح الفلتر الجانبي */}
                    <button
                        onClick={toggleFilterSidebar}
                        className="flex items-center p-3 border border-gray-300 rounded-full text-gray-600 hover:bg-gray-50 transition duration-150 ease-in-out mr-4"
                    >
                        <FaFilter className="text-xl text-[#2EC19F]" />
                    </button>
                </div>

                {/* جدول الموظفين */}
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
                            {filteredEmployees.length > 0 ? (
                                filteredEmployees.map((employee) => (
                                    <tr key={employee.id} className="bg-white border-b hover:bg-gray-50 transition duration-150 ease-in-out">
                                        <td className="px-6 py-4 text-center">
                                            <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600 rounded" />
                                        </td>
                                        <td
                                            className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-800 cursor-pointer"
                                            onClick={() => navigate(`/monthly-plan/${employee.name}`)}
                                        >
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
                                                    <FaStar className="ml-1.5 -mr-0.5 h-4 w-4 text-yellow-500" />
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
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center py-8 text-gray-400 text-sm">
                                        لا توجد بيانات مطابقة للفلاتر المحددة.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* مودال ملاحظات الفريق */}
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

            {/* مودال التقييم */}
            {isRatingModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
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
                                {/* تم إزالة FaRegStar الإضافية هنا لتجنب تكرار النجمة الأخيرة */}
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

            {/* الفلتر الجانبي */}
            {isFilterSidebarOpen && (
                <div
                    className="fixed inset-0 flex justify-end z-40"
                    onClick={closeFilterSidebar}
                >
                    <div
                        className={`w-80 shadow-lg p-6 transform transition-transform duration-300 ease-in-out h-full
                            ${isFilterSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}
                        style={{ direction: 'rtl', background: 'linear-gradient(to bottom, #eff8f7, #c1e0e8)', borderRadius: '0 1.5rem 1.5rem 0' }}
                        onClick={(e) => e.stopPropagation()}
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
                            <h3 className="text-xl font-bold text-gray-800">الفلاتر</h3>
                            <button
                                onClick={closeFilterSidebar}
                                className="text-gray-600 hover:text-gray-900 text-xl bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto pt-6 px-4">
                            {/* حقل البحث داخل الفلتر */}
                            <div className="mb-6">
                                <label htmlFor="filterSearch" className="block text-md font-medium text-gray-700 mb-2">
                                    البحث
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        id="filterSearch"
                                        placeholder="ابحث عن .."
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-right bg-white"
                                        style={{ background: '#eaf4f7', border: 'none' }}
                                        value={filterSearch}
                                        onChange={(e) => setFilterSearch(e.target.value)}
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                        <FaSearch className="w-5 h-5 text-gray-400" />
                                    </div>
                                </div>
                            </div>

                            {/* فلتر القسم */}
                            <div className="mb-6">
                                <div className="flex justify-between items-center mb-2">
                                    <label htmlFor="filterDepartment" className="block text-md font-medium text-gray-700">
                                        القسم
                                    </label>
                                    <button onClick={clearFilterDepartment} className="text-[#25BC9D] text-sm hover:underline">
                                        مسح
                                    </button>
                                </div>
                                <div className="relative">
                                    <select
                                        id="filterDepartment"
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-right bg-white appearance-none"
                                        style={{ background: '#eaf4f7', border: 'none' }}
                                        value={filterDepartment}
                                        onChange={(e) => setFilterDepartment(e.target.value)}
                                    >
                                        <option value="">اختر</option>
                                        {departments.map(dept => (
                                            <option key={dept} value={dept}>{dept}</option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <FaChevronDown className="w-5 h-5 text-gray-400" />
                                    </div>
                                </div>
                            </div>

                            {/* فلتر المنطقة */}
                            <div className="mb-6">
                                <div className="flex justify-between items-center mb-2">
                                    <label htmlFor="filterRegion" className="block text-md font-medium text-gray-700">
                                        المنطقة
                                    </label>
                                    <button onClick={clearFilterRegion} className="text-[#25BC9D] text-sm hover:underline">
                                        مسح
                                    </button>
                                </div>
                                <div className="relative">
                                    <select
                                        id="filterRegion"
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-right bg-white appearance-none"
                                        style={{ background: '#eaf4f7', border: 'none' }}
                                        value={filterRegion}
                                        onChange={(e) => setFilterRegion(e.target.value)}
                                    >
                                        <option value="">اختر</option>
                                        {regions.map(reg => (
                                            <option key={reg} value={reg}>{reg}</option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <FaChevronDown className="w-5 h-5 text-gray-400" />
                                    </div>
                                </div>
                            </div>

                            {/* فلتر الأداء العام */}
                            <div className="mb-8">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-md font-medium text-gray-700">
                                        الأداء العام
                                    </label>
                                    <button onClick={clearFilterPerformance} className="text-[#25BC9D] text-sm hover:underline">
                                        مسح
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {[1, 2, 3, 4, 5].map((rating) => (
                                        <label key={rating} className="flex items-center justify-end cursor-pointer">
                                            <span>({rating})</span>
                                            {renderStars(rating)}
                                            <input
                                                type="checkbox"
                                                className="form-checkbox h-5 w-5 text-teal-600 transition duration-150 ease-in-out rounded-sm mr-3"
                                                checked={filterPerformance.includes(rating)}
                                                onChange={() => handleFilterPerformanceChange(rating)}
                                            />
                                        </label>
                                    ))}
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
                                onClick={applyFilters}
                                className="w-1/2 py-2 bg-gradient-to-r from-teal-400 to-green-500 text-white rounded-lg shadow-md hover:from-teal-500 hover:to-green-600 transition-colors"
                            >
                                تطبيق ({getAppliedFilterCount()})
                            </button>ظ
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Employees;
