import React, { useState } from 'react';
import {
  FaSearch,
  FaFilter,
  FaTimesCircle,
  FaChevronDown,
  FaStar,
  FaRegStar,
  FaCheckCircle,
  FaEllipsisV,
} from 'react-icons/fa';

const Stores = () => {
  const [tableData, setTableData] = useState([
    { id: 1, storeName: 'متجر بغداد المركزي', ownerName: 'احمد سالم', visits: 3, rating: 3, cooperation: '21%', lastVisit: '12/2/2025', status: 'فعال', province: 'بغداد', area: 'الرصافة', section: 'إلكترونيات', employee: 'علياء احمد', followUpStatus: 'تمت المتابعة' },
    { id: 2, storeName: 'متجر التقنية بغداد', ownerName: 'سارة كاظم', visits: 2, rating: 4, cooperation: '33%', lastVisit: '1/2/2025', status: 'فعال', province: 'بغداد', area: 'الكرادة', section: 'ملابس', employee: 'فاطمة الزهراء', followUpStatus: 'قيد الانتظار' },
    { id: 3, storeName: 'متجر السالمية', ownerName: 'محمد جاسم', visits: 4, rating: 2, cooperation: '12%', lastVisit: '3/2/2025', status: 'متوقف', province: 'بغداد', area: 'الأعظمية', section: 'مواد غذائية', employee: 'محمد جاسم', followUpStatus: 'لم يتم البدء' },
    { id: 4, storeName: 'متجر شمال بغداد', ownerName: 'عبير حسن', visits: 5, rating: 5, cooperation: '90%', lastVisit: '4/2/2025', status: 'فعال', province: 'بغداد', area: 'الكاظمية', section: 'إلكترونيات', employee: 'ليلى خالد', followUpStatus: 'تمت المتابعة' },
    { id: 5, storeName: 'متجر الجنوب', ownerName: 'علاء خالد', visits: 1, rating: 3, cooperation: '45%', lastVisit: '5/2/2025', status: 'فعال', province: 'بغداد', area: 'البياع', section: 'أثاث', employee: 'أحمد علي', followUpStatus: 'قيد الانتظار' },
    { id: 6, storeName: 'متجر الغربية', ownerName: 'نور زيد', visits: 2, rating: 4, cooperation: '55%', lastVisit: '6/2/2025', status: 'متوقف', province: 'بغداد', area: 'العامرية', section: 'ملابس', employee: 'سارة يوسف', followUpStatus: 'لم يتم البدء' },
    { id: 7, storeName: 'متجر الشرق', ownerName: 'إياد محمود', visits: 3, rating: 1, cooperation: '20%', lastVisit: '7/2/2025', status: 'فعال', province: 'بغداد', area: 'مدينة الصدر', section: 'مواد غذائية', employee: 'مصطفى قاسم', followUpStatus: 'تمت المتابعة' },
    { id: 8, storeName: 'متجر زهور بغداد', ownerName: 'صفاء علي', visits: 4, rating: 5, cooperation: '75%', lastVisit: '8/2/2025', status: 'فعال', province: 'بغداد', area: 'المنصور', section: 'إلكترونيات', employee: 'زينب هادي', followUpStatus: 'قيد الانتظار' },
    { id: 9, storeName: 'متجر الحياة', ownerName: 'حسن عبد', visits: 3, rating: 2, cooperation: '31%', lastVisit: '9/2/2025', status: 'متوقف', province: 'بغداد', area: 'الدورة', section: 'أثاث', employee: 'علياء احمد', followUpStatus: 'لم يتم البدء' },
    { id: 10, storeName: 'متجر الكرادة', ownerName: 'أحمد جواد', visits: 2, rating: 3, cooperation: '38%', lastVisit: '10/2/2025', status: 'فعال', province: 'بغداد', area: 'الكرادة', section: 'ملابس', employee: 'فاطمة الزهراء', followUpStatus: 'تمت المتابعة' },
    { id: 11, storeName: 'متجر البصرة الأول', ownerName: 'كريم يوسف', visits: 4, rating: 4, cooperation: '65%', lastVisit: '12/2/2025', status: 'فعال', province: 'البصرة', area: 'المدينة', section: 'مواد غذائية', employee: 'محمد جاسم', followUpStatus: 'قيد الانتظار' },
    { id: 12, storeName: 'متجر البصرة الجنوبي', ownerName: 'ليلى حسن', visits: 1, rating: 3, cooperation: '40%', lastVisit: '10/2/2025', status: 'متوقف', province: 'البصرة', area: 'الكرامة', section: 'إلكترونيات', employee: 'ليلى خالد', followUpStatus: 'لم يتم البدء' },
    { id: 13, storeName: 'متجر أربيل التجاري', ownerName: 'رعد مصطفى', visits: 5, rating: 5, cooperation: '90%', lastVisit: '8/2/2025', status: 'فعال', province: 'أربيل', area: 'المدينة', section: 'ملابس', employee: 'أحمد علي', followUpStatus: 'تمت المتابعة' },
    { id: 14, storeName: 'متجر أربيل الغربي', ownerName: 'شيماء عبد', visits: 2, rating: 2, cooperation: '30%', lastVisit: '9/2/2025', status: 'فعال', province: 'أربيل', area: 'المنطقة الصناعية', section: 'أثاث', employee: 'سارة يوسف', followUpStatus: 'قيد الانتظار' },
    { id: 15, storeName: 'متجر نينوى المركزي', ownerName: 'أكرم سامي', visits: 3, rating: 3, cooperation: '50%', lastVisit: '11/2/2025', status: 'فعال', province: 'نينوى', area: 'الموصل', section: 'مواد غذائية', employee: 'مصطفى قاسم', followUpStatus: 'لم يتم البدء' },
    { id: 16, storeName: 'متجر ديالى الجديد', ownerName: 'سامي فاضل', visits: 4, rating: 4, cooperation: '70%', lastVisit: '12/2/2025', status: 'متوقف', province: 'ديالى', area: 'بعقوبة', section: 'إلكترونيات', employee: 'زينب هادي', followUpStatus: 'تمت المتابعة' },
  ]);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [currentRating, setCurrentRating] = useState(0);
  const [selectedStoreIdForRating, setSelectedStoreIdForRating] = useState(null);

  const [search, setSearch] = useState('');
  const [filterProvince, setFilterProvince] = useState('');
  const [filterArea, setFilterArea] = useState('');
  const [filterSection, setFilterSection] = useState('');
  const [filterRating, setFilterRating] = useState(0);
  const [filterEmployee, setFilterEmployee] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [filterFollowUpStatus, setFilterFollowUpStatus] = useState('');

  const provinceAreas = {
    بغداد: ['الرصافة', 'الكرادة', 'الأعظمية', 'الكاظمية', 'البياع', 'العامرية', 'مدينة الصدر', 'المنصور', 'الدورة'],
    البصرة: ['المدينة', 'الكرامة'],
    أربيل: ['المدينة', 'المنطقة الصناعية'],
    نينوى: ['الموصل'],
    ديالى: ['بعقوبة'],
  };

  const sections = ['إلكترونيات', 'ملابس', 'مواد غذائية', 'أثاث'];
  const employees = [...new Set(tableData.map(item => item.employee))];
  const followUpStatuses = [...new Set(tableData.map(item => item.followUpStatus))];

  const activateStore = (id) => {
    setTableData((prev) => prev.map(row => row.id === id ? {...row, status: 'فعال'} : row));
  };

  const deactivateStore = (id) => {
    setTableData((prev) => prev.map(row => row.id === id ? {...row, status: 'متوقف'} : row));
  };

  const openRatingModal = (id, rating) => {
    setSelectedStoreIdForRating(id);
    setCurrentRating(rating);
    setIsRatingModalOpen(true);
  };

  const closeRatingModal = () => {
    setIsRatingModalOpen(false);
    setCurrentRating(0);
    setSelectedStoreIdForRating(null);
  };

  const submitRating = () => {
    if (selectedStoreIdForRating) {
      setTableData((prev) =>
        prev.map(row =>
          row.id === selectedStoreIdForRating ? { ...row, rating: currentRating } : row
        )
      );
      alert(`تم تقييم المتجر رقم ${selectedStoreIdForRating} بـ ${currentRating} نجوم.`);
      closeRatingModal();
    }
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const filteredData = tableData.filter(row => {
    const matchesSearch =
      row.storeName.includes(search) || row.ownerName.includes(search);

    const matchesProvince = filterProvince ? row.province === filterProvince : true;
    const matchesArea = filterArea ? row.area === filterArea : true;
    const matchesSection = filterSection ? row.section === filterSection : true;
    const matchesRating = filterRating ? row.rating === filterRating : true;
    const matchesEmployee = filterEmployee ? row.employee === filterEmployee : true;
    const matchesFollowUpStatus = filterFollowUpStatus ? row.followUpStatus === filterFollowUpStatus : true;

    const lastVisitDate = new Date(row.lastVisit);
    const fromDate = filterDateFrom ? new Date(filterDateFrom) : null;
    const toDate = filterDateTo ? new Date(filterDateTo) : null;

    const matchesDateFrom = fromDate ? lastVisitDate >= fromDate : true;
    const matchesDateTo = toDate ? lastVisitDate <= toDate : true;

    return matchesSearch && matchesProvince && matchesArea && matchesSection && matchesRating && matchesEmployee && matchesFollowUpStatus && matchesDateFrom && matchesDateTo;
  });

  const currentAreas = filterProvince ? provinceAreas[filterProvince] || [] : [];

  const getFilterCount = (filterType, value) => {
    if (filterType === 'province') {
      return tableData.filter(row => row.province === value).length;
    } else if (filterType === 'area' && filterProvince) {
      return tableData.filter(row => row.province === filterProvince && row.area === value).length;
    } else if (filterType === 'section') {
      return tableData.filter(row => row.section === value).length;
    } else if (filterType === 'rating') {
      return tableData.filter(row => row.rating === value).length;
    } else if (filterType === 'employee') {
      return tableData.filter(row => row.employee === value).length;
    } else if (filterType === 'followUpStatus') {
      return tableData.filter(row => row.followUpStatus === value).length;
    }
    return 0;
  };

  const resetAllFilters = () => {
    setSearch('');
    setFilterProvince('');
    setFilterArea('');
    setFilterSection('');
    setFilterRating(0);
    setFilterEmployee('');
    setFilterDateFrom('');
    setFilterDateTo('');
    setFilterFollowUpStatus('');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8" style={{ direction: 'rtl' }}>
      <div className="flex items-center justify-between mb-6 p-4 rounded-lg shadow-sm">
        <div className="flex items-center border border-gray-300 rounded-[40px] overflow-hidden w-80">
          <input
            type="text"
            placeholder="البحث ماذا تبحث عن..."
            className="flex-grow rounded-[60px] p-2 outline-none focus:ring-0 text-right"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className="p-2 border-l border-gray-300">
            <FaSearch className="text-lg text-[#25BC9D]" />
          </div>
        </div>
        <button
          onClick={toggleFilter}
          className="flex items-center w-20 justify-center p-3 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 transition duration-150 ease-in-out"
        >
          <FaFilter className="text-xl text-[#25BC9D]" />
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">اسم المتجر</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">اسم المالك</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المحافظة</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المنطقة</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">القسم</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الموظف</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">حالة المتابعة</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">عدد الزيارات</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">تقييم التعاون</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">نسبة التفاعل</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">آخر زيارة</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">حالة التفعيل</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.map(row => (
              <tr key={row.id} className="bg-white border-b hover:bg-gray-50 transition duration-150 ease-in-out">
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-800">{row.storeName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-800">{row.ownerName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-600">{row.province}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-600">{row.area}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-600">{row.section}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-600">{row.employee}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-600">{row.followUpStatus}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-600">{row.visits}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-600">
                  <div className="flex items-center justify-end">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={`ml-1 ${i < row.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                    <span className="mr-1">({row.rating})</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-600">{row.cooperation}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-600">{row.lastVisit}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                    ${row.status === 'فعال' ? 'bg-green-100 text-green-700 border-green-300' : 'bg-red-100 text-red-700 border-red-300'}`}>
                    {row.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                  <div className="flex items-center justify-center space-x-2 space-x-reverse">
                    <button
                      onClick={() => openRatingModal(row.id, row.rating)}
                      className="inline-flex items-center px-3 py-1.5 border border-yellow-300 rounded-md shadow-sm text-sm font-medium text-yellow-700 bg-yellow-50 hover:bg-yellow-100 transition duration-150 ease-in-out"
                    >
                      <FaRegStar className="ml-1.5 -mr-0.5 h-4 w-4" />
                      تقييم
                    </button>
                    <button
                      onClick={() => activateStore(row.id)}
                      className="inline-flex items-center px-3 py-1.5 border border-green-300 rounded-md shadow-sm text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 transition duration-150 ease-in-out"
                    >
                      <FaCheckCircle className="ml-1.5 -mr-0.5 h-4 w-4" />
                      تفعيل
                    </button>
                    <button
                      onClick={() => deactivateStore(row.id)}
                      className="inline-flex items-center px-3 py-1.5 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 transition duration-150 ease-in-out"
                    >
                      <FaTimesCircle className="ml-1.5 -mr-0.5 h-4 w-4" />
                      تعطيل
                    </button>
                    <button className="p-1 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-full">
                      <FaEllipsisV className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredData.length === 0 && (
              <tr>
                <td colSpan="13" className="text-center py-8 text-gray-400 text-sm">لا توجد بيانات مطابقة للبحث والفلتر.</td>
              </tr>
            )}
          </tbody>
        </table>
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
          <button onClick={toggleFilter} className="text-gray-500 hover:text-gray-700 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
            <FaTimesCircle className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pt-6 px-4 space-y-6">
          <div>
            <label htmlFor="searchFilter" className="block text-gray-700 text-sm font-medium mb-2">البحث</label>
            <div className="relative">
              <input
                type="text"
                id="searchFilter"
                placeholder="ابحث عن اسم المتجر أو اسم المالك..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-right bg-white"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <FaSearch className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="province" className="block text-gray-700 text-sm font-medium">المحافظة</label>
              <button
                className="text-gray-400 text-xs hover:text-gray-600"
                onClick={() => { setFilterProvince(''); setFilterArea(''); }}
              >
                مسح
              </button>
            </div>
            <div className="relative">
              <select
                id="province"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-right bg-white appearance-none"
                value={filterProvince}
                onChange={(e) => {
                  setFilterProvince(e.target.value);
                  setFilterArea('');
                }}
              >
                <option value="">اختر</option>
                {Object.keys(provinceAreas).map(prov => (
                  <option key={prov} value={prov}>{prov} ({getFilterCount('province', prov)})</option>
                ))}
              </select>
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaChevronDown className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="area" className="block text-gray-700 text-sm font-medium">المنطقة</label>
              <button
                className="text-gray-400 text-xs hover:text-gray-600"
                onClick={() => setFilterArea('')}
                disabled={!filterProvince}
              >
                مسح
              </button>
            </div>
            <div className="relative">
              <select
                id="area"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-right bg-white appearance-none"
                value={filterArea}
                onChange={(e) => setFilterArea(e.target.value)}
                disabled={!filterProvince}
              >
                <option value="">اختر</option>
                {currentAreas.map(area => (
                  <option key={area} value={area}>{area} ({getFilterCount('area', area)})</option>
                ))}
              </select>
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaChevronDown className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="section" className="block text-gray-700 text-sm font-medium">القسم</label>
              <button
                className="text-gray-400 text-xs hover:text-gray-600"
                onClick={() => setFilterSection('')}
              >
                مسح
              </button>
            </div>
            <div className="relative">
              <select
                id="section"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-right bg-white appearance-none"
                value={filterSection}
                onChange={(e) => setFilterSection(e.target.value)}
              >
                <option value="">اختر</option>
                {sections.map(sec => (
                  <option key={sec} value={sec}>{sec} ({getFilterCount('section', sec)})</option>
                ))}
              </select>
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaChevronDown className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="employee" className="block text-gray-700 text-sm font-medium">الموظف</label>
              <button
                className="text-gray-400 text-xs hover:text-gray-600"
                onClick={() => setFilterEmployee('')}
              >
                مسح
              </button>
            </div>
            <div className="relative">
              <select
                id="employee"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-right bg-white appearance-none"
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
              <label htmlFor="followUpStatus" className="block text-gray-700 text-sm font-medium">حالة المتابعة</label>
              <button
                className="text-gray-400 text-xs hover:text-gray-600"
                onClick={() => setFilterFollowUpStatus('')}
              >
                مسح
              </button>
            </div>
            <div className="relative">
              <select
                id="followUpStatus"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-right bg-white appearance-none"
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
              <label className="block text-gray-700 text-sm font-medium">التقييم</label>
              <button
                className="text-gray-400 text-xs hover:text-gray-600"
                onClick={() => setFilterRating(0)}
              >
                مسح
              </button>
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
              <label htmlFor="dateFrom" className="block text-gray-700 text-sm font-medium">تاريخ الزيارة من</label>
              <button
                className="text-gray-400 text-xs hover:text-gray-600"
                onClick={() => setFilterDateFrom('')}
              >
                مسح
              </button>
            </div>
            <input
              type="date"
              id="dateFrom"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-right bg-white"
              value={filterDateFrom}
              onChange={(e) => setFilterDateFrom(e.target.value)}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="dateTo" className="block text-gray-700 text-sm font-medium">تاريخ الزيارة إلى</label>
              <button
                className="text-gray-400 text-xs hover:text-gray-600"
                onClick={() => setFilterDateTo('')}
              >
                مسح
              </button>
            </div>
            <input
              type="date"
              id="dateTo"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-right bg-white"
              value={filterDateTo}
              onChange={(e) => setFilterDateTo(e.target.value)}
            />
          </div>
        </div>

        <div className="px-6 py-4 flex justify-between space-x-4 space-x-reverse border-t border-gray-200">
          <button
            onClick={resetAllFilters}
            className="w-1/2 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            مسح الكل
          </button>
          <button
            onClick={toggleFilter}
            className="w-1/2 py-2 bg-gradient-to-r from-teal-400 to-green-500 text-white rounded-lg shadow-md hover:from-teal-500 hover:to-green-600 transition-colors"
          >
            تطبيق ({filteredData.length})
          </button>
        </div>
      </div>

      {isRatingModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ direction: 'rtl' }}>
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
            <div className="flex justify-end -mt-4 -mr-4">
              <button onClick={closeRatingModal} className="text-gray-400 hover:text-gray-600">
                <FaTimesCircle className="h-6 w-6" />
              </button>
            </div>
            <div className="flex justify-center mb-6">
              <img
                src="https://via.placeholder.com/80"
                alt="document icon"
                className="w-20 h-20 rounded-full p-3 bg-gray-100"
              />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">قم بتقييم المتجر</h3>
            <p className="text-gray-600 mb-6">يساعدنا تقييمك للمتجر</p>
            <div className="flex justify-center space-x-1 space-x-reverse mb-8">
              {[1, 2, 3, 4, 5].map(star => (
                <FaStar
                  key={star}
                  className={`cursor-pointer text-4xl ${star <= currentRating ? 'text-yellow-400' : 'text-gray-300'}`}
                  onClick={() => setCurrentRating(star)}
                />
              ))}
            </div>
            <div className="flex justify-center space-x-4 space-x-reverse">
              <button
                onClick={closeRatingModal}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition duration-150 ease-in-out"
              >
                إلغاء
              </button>
              <button
                onClick={submitRating}
                className="px-6 py-2 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-full hover:from-green-500 hover:to-green-700 transition duration-150 ease-in-out"
              >
                تم التقييم
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stores;