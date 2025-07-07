import React, { useState } from 'react';
import { FaHome, FaAngleRight, FaFilter, FaSearch, FaChevronDown, FaStar, FaEllipsisV, FaCheckCircle, FaTimesCircle, FaRegStar } from 'react-icons/fa';

const Stores = () => {
  const [tableData, setTableData] = useState([
    { id: 1, ownerName: 'احمد سالم', visits: 3, rating: 3, cooperation: '21%', lastVisit: '12/2/2025', status: 'فعال' },
    { id: 2, ownerName: 'احمد سالم', visits: 3, rating: 3, cooperation: '21%', lastVisit: '12/2/2025', status: 'متوقف' },
    { id: 3, ownerName: 'احمد سالم', visits: 3, rating: 3, cooperation: '21%', lastVisit: '12/2/2025', status: 'فعال' },
    { id: 4, ownerName: 'احمد سالم', visits: 3, rating: 3, cooperation: '21%', lastVisit: '12/2/2025', status: 'متوقف' },
    { id: 5, ownerName: 'احمد سالم', visits: 3, rating: 3, cooperation: '21%', lastVisit: '12/2/2025', status: 'فعال' },
    { id: 6, ownerName: 'احمد سالم', visits: 3, rating: 3, cooperation: '21%', lastVisit: '12/2/2025', status: 'متوقف' },
    { id: 7, ownerName: 'احمد سالم', visits: 3, rating: 3, cooperation: '21%', lastVisit: '12/2/2025', status: 'فعال' },
    { id: 8, ownerName: 'احمد سالم', visits: 3, rating: 3, cooperation: '21%', lastVisit: '12/2/2025', status: 'متوقف' },
    { id: 9, ownerName: 'احمد سالم', visits: 3, rating: 3, cooperation: '21%', lastVisit: '12/2/2025', status: 'فعال' },
  ]);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [currentRating, setCurrentRating] = useState(0);
  const [selectedStoreIdForRating, setSelectedStoreIdForRating] = useState(null);

  const activateStore = (id) => {
    setTableData(prevData =>
      prevData.map(row =>
        row.id === id ? { ...row, status: 'فعال' } : row
      )
    );
  };

  const deactivateStore = (id) => {
    setTableData(prevData =>
      prevData.map(row =>
        row.id === id ? { ...row, status: 'متوقف' } : row
      )
    );
  };

  const openRatingModal = (id, initialRating) => {
    setSelectedStoreIdForRating(id);
    setCurrentRating(initialRating);
    setIsRatingModalOpen(true);
  };

  const closeRatingModal = () => {
    setIsRatingModalOpen(false);
    setCurrentRating(0);
    setSelectedStoreIdForRating(null);
  };

  const submitRating = () => {
    if (selectedStoreIdForRating) {
      setTableData(prevData =>
        prevData.map(row =>
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

  return (
    <div className="min-h-screen bg-gray-100 p-8" style={{ direction: 'rtl' }}>
      <div className="flex items-center justify-between mb-6 p-4 rounded-lg shadow-sm">
        <div className="flex items-center border border-gray-300 rounded-[40px] overflow-hidden flex-grow-0 w-80">
          <input
            type="text"
            placeholder="البحث ماذا تبحث عن..."
            className="flex-grow rounded-[60px] p-2 outline-none focus:ring-0 text-right"
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
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600 rounded" />
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center justify-end">
                  <span>اسم المالك</span>
                </div>
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center justify-end">
                  <span>عدد الزيارات</span>
                </div>
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center justify-end">
                  <span>تقييم التعاون</span>
                </div>
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center justify-end">
                  <span>نسبة التفاعل</span>
                </div>
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center justify-end">
                  <span>آخر زيارة</span>
                </div>
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center justify-end">
                  <span>حالة التفعيل</span>
                </div>
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                الإجراءات
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tableData.map((row) => (
              <tr key={row.id} className="bg-white border-b hover:bg-gray-50 transition duration-150 ease-in-out">
                <td className="px-6 py-4 text-center">
                  <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600 rounded" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-800">{row.ownerName}</td>
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
          </tbody>
        </table>
      </div>

      {/* تصميم الفلتر الجانبي المدمج من Contracts.jsx */}
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
                <FaSearch className="w-5 h-5 text-gray-400" />
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
                <FaChevronDown className="w-5 h-5 text-gray-400" />
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
                <FaChevronDown className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* تم تعديل هذا القسم ليناسب محتوى Stores (التقييم بدلاً من حالة العقد) */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-gray-700 text-sm font-medium">التقييم</label>
              <button className="text-gray-400 text-xs hover:text-gray-600">مسح</button>
            </div>
            {/* خيارات النجوم للتقييم */}
            {[1, 2, 3, 4, 5].map((starCount) => (
              <div key={starCount} className="flex items-center justify-end mb-2">
                <span className="text-sm text-gray-700 mr-2">({starCount})</span>
                <FaStar className="text-yellow-400 ml-1" />
                <input type="checkbox" className="form-checkbox h-4 w-4 text-teal-600 transition duration-150 ease-in-out rounded-sm" />
              </div>
            ))}
          </div>
        </div>

        <div className="px-6 py-4 flex justify-between space-x-4 space-x-reverse border-t border-gray-200">
          <button className="w-1/2 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors" style={{ background: '#eaf4f7', border: 'none' }}>مسح الكل</button>
          <button className="w-1/2 py-2 bg-gradient-to-r from-teal-400 to-green-500 text-white rounded-lg shadow-md hover:from-teal-500 hover:to-green-600 transition-colors">تطبيق (3)</button>
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
              {[1, 2, 3, 4, 5].map((star) => (
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