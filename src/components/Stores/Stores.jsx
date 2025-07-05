import React, { useState } from 'react';
import { FaHome, FaAngleRight, FaFilter, FaSearch, FaChevronDown, FaStar, FaEllipsisV, FaCheckCircle, FaTimesCircle, FaRegStar, FaCogs } from 'react-icons/fa';

const Stores = () => {
  const [tableData, setTableData] = useState([
    {
      id: 1,
      ownerName: 'احمد سالم',
      visits: 3,
      rating: 3,
      cooperation: '21%',
      lastVisit: '12/2/2025',
      status: 'فعال'
    },
    {
      id: 2,
      ownerName: 'احمد سالم',
      visits: 3,
      rating: 3,
      cooperation: '21%',
      lastVisit: '12/2/2025',
      status: 'متوقف'
    },
    {
      id: 3,
      ownerName: 'احمد سالم',
      visits: 3,
      rating: 3,
      cooperation: '21%',
      lastVisit: '12/2/2025',
      status: 'فعال'
    },
    {
      id: 4,
      ownerName: 'احمد سالم',
      visits: 3,
      rating: 3,
      cooperation: '21%',
      lastVisit: '12/2/2025',
      status: 'متوقف'
    },
    {
      id: 5,
      ownerName: 'احمد سالم',
      visits: 3,
      rating: 3,
      cooperation: '21%',
      lastVisit: '12/2/2025',
      status: 'فعال'
    },
    {
      id: 6,
      ownerName: 'احمد سالم',
      visits: 3,
      rating: 3,
      cooperation: '21%',
      lastVisit: '12/2/2025',
      status: 'متوقف'
    },
    {
      id: 7,
      ownerName: 'احمد سالم',
      visits: 3,
      rating: 3,
      cooperation: '21%',
      lastVisit: '12/2/2025',
      status: 'فعال'
    },
    {
      id: 8,
      ownerName: 'احمد سالم',
      visits: 3,
      rating: 3,
      cooperation: '21%',
      lastVisit: '12/2/2025',
      status: 'متوقف'
    },
    {
      id: 9,
      ownerName: 'احمد سالم',
      visits: 3,
      rating: 3,
      cooperation: '21%',
      lastVisit: '12/2/2025',
      status: 'فعال'
    },
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
    <div className="min-h-screen bg-gray-100 p-8">

      <div className="flex items-center justify-between mb-6 p-4  rounded-lg shadow-sm" style={{ direction: 'rtl' }}>
        <div className="flex items-center border border-gray-300 rounded-[40px] overflow-hidden flex-grow-0 w-80">
          <input
            type="text"
            placeholder="البحث ماذا تبحث عن..."
            className="flex-grow rounded-[60px] p-2 outline-none focus:ring-0 text-right"
          />
          <div className="p-2 border-l border-gray-300">
            <FaSearch className="text-gray-500 text-lg" />
          </div>
        </div>
        <button
          onClick={toggleFilter}
          className="flex items-center w-20 justify-center p-3 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 transition duration-150 ease-in-out"
        >
          <FaFilter className="text-xl" />
        </button>
      </div>

      {/* Main Table */}
      <div className="bg-white p-6 rounded-lg shadow-sm overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600 rounded" />
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center justify-end">
                  <span>اسم المالك</span>
                  {/* <FaChevronDown className="ml-1 text-gray-400 text-xs" /> */}
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center justify-end">
                  <span>عدد الزيارات</span>
                  {/* <FaChevronDown className="ml-1 text-gray-400 text-xs" /> */}
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center justify-end">
                  <span>تقييم التعاون</span>
                  {/* <FaChevronDown className="ml-1 text-gray-400 text-xs" /> */}
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center justify-end">
                  <span>نسبة التفاعل</span>
                  {/* <FaChevronDown className="ml-1 text-gray-400 text-xs" /> */}
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center justify-end">
                  <span>آخر زيارة</span>
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center justify-end">
                  <span>حالة التفعيل</span>
                  {/* <FaChevronDown className="ml-1 text-gray-400 text-xs" /> */}
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-800">
                  {row.ownerName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-600">
                  {row.visits}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-600">
                  <div className="flex items-center justify-end">
                    <span className="ml-1">({row.rating})</span>
                    <FaStar className="text-yellow-400" />
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-600">
                  {row.cooperation}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-600">
                  {row.lastVisit}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                    ${row.status === 'فعال' ? 'bg-green-100 text-green-700 border-green-300' : 'bg-red-100 text-red-700 border-red-300'}`}>
                    {row.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                  <div className="flex items-center justify-center space-x-2 space-x-reverse">
                    {/* زر التقييم */}
                    <button
                      onClick={() => openRatingModal(row.id, row.rating)}
                      className="inline-flex items-center px-3 py-1.5 border border-yellow-300 rounded-md shadow-sm text-sm font-medium text-yellow-700 bg-yellow-50 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition duration-150 ease-in-out"
                    >
                      <FaRegStar className="ml-1.5 -mr-0.5 h-4 w-4" />
                      تقييم
                    </button>

                    {/* زر التفعيل */}
                    <button
                      onClick={() => activateStore(row.id)}
                      className="inline-flex items-center px-3 py-1.5 border border-green-300 rounded-md shadow-sm text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out"
                    >
                      <FaCheckCircle className="ml-1.5 -mr-0.5 h-4 w-4" />
                      تفعيل
                    </button>

                    {/* زر التعطيل */}
                    <button
                      onClick={() => deactivateStore(row.id)}
                      className="inline-flex items-center px-3 py-1.5 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out"
                    >
                      <FaTimesCircle className="ml-1.5 -mr-0.5 h-4 w-4" />
                      تعطيل
                    </button>

                    {/* زر المزيد (ثلاث نقاط) */}
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

      {/* Filter Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50
          ${isFilterOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ direction: 'rtl' }}
      >
        <div className="p-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">الفلاتر</h2>
            <button onClick={toggleFilter} className="text-gray-500 hover:text-gray-700">
              <FaTimesCircle className="h-6 w-6" />
            </button>
          </div>

          {/* Search within Filter */}
          <div className="mb-4">
            <label htmlFor="filter-search" className="block text-sm font-medium text-gray-700 mb-2">البحث</label>
            <div className="relative">
              <input
                type="text"
                id="filter-search"
                placeholder="أبحث عن .."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-right"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
            </div>
            <button className="text-blue-500 text-sm mt-2">مسح</button>
          </div>

          {/* Governorate Filter */}
          <div className="mb-4">
            <label htmlFor="governorate" className="block text-sm font-medium text-gray-700 mb-2">المحافظة</label>
            <div className="relative">
              <select
                id="governorate"
                className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-right"
              >
                <option>اختر</option>
                {/* Add more options here */}
              </select>
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaChevronDown className="text-gray-400" />
              </div>
            </div>
            <button className="text-blue-500 text-sm mt-2">مسح</button>
          </div>

          {/* Interaction Filter */}
          <div className="mb-4">
            <label htmlFor="interaction" className="block text-sm font-medium text-gray-700 mb-2">التفاعل</label>
            <div className="relative">
              <select
                id="interaction"
                className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-right"
              >
                <option>اختر</option>
                {/* Add more options here */}
              </select>
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaChevronDown className="text-gray-400" />
              </div>
            </div>
            <button className="text-blue-500 text-sm mt-2">مسح</button>
          </div>

          {/* Rating Filter */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">التقييم</label>
            {[1, 2, 3, 4, 5].map((starCount) => (
              <div key={starCount} className="flex items-center mb-2 justify-end">
                <span className="text-sm text-gray-700 mr-2">({starCount})</span>
                <FaStar className="text-yellow-400 ml-1" />
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-blue-600 rounded"
                />
              </div>
            ))}
            <button className="text-blue-500 text-sm mt-2">مسح</button>
          </div>

          {/* Action buttons */}
          <div className="mt-auto flex justify-around p-4 border-t border-gray-200">
            <button className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition duration-150 ease-in-out">
              مسح الكل
            </button>
            <button className="px-6 py-2 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-md hover:from-green-500 hover:to-green-700 transition duration-150 ease-in-out">
              تطبيق (3)
            </button>
          </div>
        </div>
      </div>

      {/* Rating Modal */}
      {isRatingModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ direction: 'rtl' }}>
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
            <div className="flex justify-end -mt-4 -mr-4">
              <button onClick={closeRatingModal} className="text-gray-400 hover:text-gray-600">
                <FaTimesCircle className="h-6 w-6" />
              </button>
            </div>
            <div className="flex justify-center mb-6">
              <img src="https://via.placeholder.com/80" alt="document icon" className="w-20 h-20 rounded-full p-3 bg-gray-100" /> {/* Placeholder for document icon */}
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