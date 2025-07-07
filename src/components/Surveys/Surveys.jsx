import React, { useState } from 'react';
import { FaHome, FaAngleRight, FaFilter, FaSearch, FaChevronDown, FaStar, FaRegStar, FaEdit, FaTimes } from 'react-icons/fa'; // Added FaTimes for the close button
import { Link } from 'react-router-dom';
const Surveys = () => {
  const [tableData, setTableData] = useState([
    {
      id: 1,
      storeName: 'متجر رصافة',
      responsibleEmployee: 'علياء احمد',
      attachedImage: true,
      initialRating: 3,
      followUpStatus: 'منجز',
      teamNotes: 'هذه ملاحظات الفريق للمتجر الأول: المتجر يحتاج إلى تجديد الديكورات الداخلية وتحسين خدمة العملاء.',
    },
    {
      id: 2,
      storeName: 'متجر رصافة',
      responsibleEmployee: 'علياء احمد',
      attachedImage: true,
      initialRating: 3,
      followUpStatus: 'قيد المتابعة',
      teamNotes: 'هذه ملاحظات الفريق للمتجر الثاني: يوجد بعض المشاكل في المخزون ويجب التحقق منها.',
    },
    {
      id: 3,
      storeName: 'متجر رصافة',
      responsibleEmployee: 'علياء احمد',
      attachedImage: true,
      initialRating: 3,
      followUpStatus: 'منجز',
      teamNotes: 'هذه ملاحظات الفريق للمتجر الثالث: الأداء ممتاز ولا توجد ملاحظات سلبية.',
    },
    {
      id: 4,
      storeName: 'متجر رصافة',
      responsibleEmployee: 'علياء احمد',
      attachedImage: true,
      initialRating: 3,
      followUpStatus: 'غير منجز',
      teamNotes: 'هذه ملاحظات الفريق للمتجر الرابع: العميل رفض بعض التعديلات المقترحة.',
    },
    {
      id: 5,
      storeName: 'متجر رصافة',
      responsibleEmployee: 'علياء احمد',
      attachedImage: true,
      initialRating: 3,
      followUpStatus: 'منجز',
      teamNotes: 'هذه ملاحظات الفريق للمتجر الخامس: تم حل جميع المشاكل السابقة بنجاح.',
    },
    {
      id: 6,
      storeName: 'متجر رصافة',
      responsibleEmployee: 'علياء احمد',
      attachedImage: true,
      initialRating: 3,
      followUpStatus: 'قيد المتابعة',
      teamNotes: 'هذه ملاحظات الفريق للمتجر السادس: فريق الصيانة سيزور المتجر قريباً.',
    },
    {
      id: 7,
      storeName: 'متجر رصافة',
      responsibleEmployee: 'علياء احمد',
      attachedImage: true,
      initialRating: 3,
      followUpStatus: 'منجز',
      teamNotes: 'هذه ملاحظات الفريق للمتجر السابع: تم تحقيق الأهداف الشهرية.',
    },
    {
      id: 8,
      storeName: 'متجر رصافة',
      responsibleEmployee: 'علياء احمد',
      attachedImage: true,
      initialRating: 3,
      followUpStatus: 'قيد المتابعة',
      teamNotes: 'هذه ملاحظات الفريق للمتجر الثامن: انتظار موافقة الإدارة على التغييرات.',
    },
    {
      id: 9,
      storeName: 'متجر رصافة',
      responsibleEmployee: 'علياء احمد',
      attachedImage: true,
      initialRating: 3,
      followUpStatus: 'منجز',
      teamNotes: 'هذه ملاحظات الفريق للمتجر التاسع: كل شيء على ما يرام.',
    },
  ]);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isAttachedImagesModalOpen, setIsAttachedImagesModalOpen] = useState(false);
  const [isTeamNotesModalOpen, setIsTeamNotesModalOpen] = useState(false); // New state for Team Notes modal
  const [currentTeamNotes, setCurrentTeamNotes] = useState(''); // State to hold the notes to display

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
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
    setCurrentTeamNotes(''); // Clear notes when closing
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex items-center justify-between mb-6 p-4 bg-white rounded-lg shadow-sm" style={{ direction: 'rtl' }}>
        <div className="flex items-center border border-gray-300 rounded-md overflow-hidden flex-grow-0 w-80">
          <input
            type="text"
            placeholder="البحث ماذا تبحث عن..."
            className="flex-grow p-2 outline-none focus:ring-0 text-right"
          />
          <div className="bg-gray-50 p-2 border-l border-gray-300">
            <FaSearch className="text-[#25BC9D] text-lg" />
          </div>
        </div>
        {/* <button
          onClick={toggleFilter}
          className="flex items-center w-20 justify-center p-3 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 transition duration-150 ease-in-out"
        >
          <FaFilter className="text-xl" />
        </button> */}
        <Link
          to="/surveys/add"
          className="flex items-center px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-blue-700 transition duration-150 ease-in-out"
        >
          <FaEdit className="mr-2" />
          إضافة استبيان
        </Link>
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
            {tableData.map((row) => (
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
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-blue-600 cursor-pointer hover:underline"
                    onClick={() => openTeamNotesModal(row.teamNotes)}>
                  {row.teamNotes.length > 20 ? `${row.teamNotes.substring(0, 20)}...` : row.teamNotes}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                  <Link  to={"/Surveys/edit"}> 
                                    <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out">
                    <FaEdit className="ml-1.5 -mr-0.5 h-4 w-4" />
                    تعديل
                  </button>
                  </Link>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Attached Images Modal */}
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
                  <img src="/attachments/4GjktXWyTPrL8jnS5vAav.jpeg" alt="signature" className="w-full h-full object-cover" />
                </div>
                <button className="bg-blue-600 text-white text-sm px-6 py-2 rounded-full hover:bg-blue-700 transition">عرض</button>
              </div>
              <div className="border border-gray-300 rounded-xl p-4 flex flex-col items-center bg-white shadow-sm">
                <div className="w-full h-40 rounded-md overflow-hidden mb-4">
                  <img src="/attachments/4GjktXWyTPrL8jnS5vAav.jpeg" alt="signature" className="w-full h-full object-cover" />
                </div>
                <button className="bg-blue-600 text-white text-sm px-6 py-2 rounded-full hover:bg-blue-700 transition">عرض</button>
              </div>
              <div className="border border-gray-300 rounded-xl p-4 flex flex-col items-center bg-white shadow-sm">
                <div className="w-full h-40 rounded-md overflow-hidden mb-4">
                  <img src="/attachments/4GjktXWyTPrL8jnS5vAav.jpeg" alt="signature" className="w-full h-full object-cover" />
                </div>
                <button className="bg-blue-600 text-white text-sm px-6 py-2 rounded-full hover:bg-blue-700 transition">عرض</button>
              </div>
              <div className="border border-gray-300 rounded-xl p-4 flex flex-col items-center bg-white shadow-sm">
                <div className="w-full h-40 rounded-md overflow-hidden mb-4">
                  <img src="/attachments/4GjktXWyTPrL8jnS5vAav.jpeg" alt="signature" className="w-full h-full object-cover" />
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

      {/* Team Notes Modal */}
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
                readOnly // Make it read-only as per the image for display purposes
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