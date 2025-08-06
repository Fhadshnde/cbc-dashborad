import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import TotalBills from "./TotalBills";

const API_URL = "https://hawkama.cbc-api.app/api/reports";

const fieldArabicNames = {
  name_ar: "الاسم بالعربي",
  name_en: "الاسم بالإنجليزي",
  phoneNumber: "رقم الهاتف",
  quantity: "المبلغ الكامل",
  moneyPaid: "المدفوع",
  moneyRemain: "المتبقي",
  address: "العنوان",
  ministry: "الوزارة",
  cardCategory: "الفئة",
  admin: "المسؤول",
  notes: "الملاحظات",
  onPayroll: "على الراتب",
  createdAt: "تاريخ الفاتورة",
  status: "الحالة",
  isEdited: "تم التعديل",
  editedAt: "وقت التعديل",
  remainingEditTime: "الوقت المتبقي للتعديل"
};

const getCardTypeText = (cardCategory) => {
  if (!cardCategory) return "غير محدد";
  if (cardCategory.oneYear === 1) return "بطاقة سنة واحدة";
  if (cardCategory.twoYears === 1) return "بطاقة سنتين";
  if (cardCategory.virtual === 1) return "بطاقة 6 اشهر";
  return "غير محدد";
};

const formatDateOnly = (dateString) => {
  if (!dateString) return "";
  const d = new Date(dateString);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatDateTime = (dateString) => {
  if (!dateString) return "";
  const d = new Date(dateString);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const seconds = String(d.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const formatNumber = (number) => {
  if (isNaN(number)) return number;
  return Number(number).toLocaleString("en-US");
};

const AccessReports = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [admin, setAdmin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [currentUsername, setCurrentUsername] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 13;

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("توكن المصادقة غير موجود. يرجى تسجيل الدخول.");
      throw new Error("توكن المصادقة غير موجود");
    }
    return { Authorization: `Bearer ${token}` };
  };

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData && storedUserData !== "undefined") {
      try {
        const userData = JSON.parse(storedUserData);
        setUserRole(userData?.role);
        setCurrentUsername(userData?.username);
      } catch {
        setUserRole(null);
        setCurrentUsername(null);
      }
    }

    const fetchReports = async () => {
      setLoading(true);
      setError(null);
      try {
        const headers = { headers: getAuthHeader() };
        const response =await axios.get(`${API_URL}/all`, headers);
        const allReports = response.data;
        setReports(allReports);
        setFilteredReports(allReports);
        setCurrentPage(1);
      } catch (err) {
        setError("حدث خطأ أثناء جلب البيانات: " + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };

    if (userRole && currentUsername) {
      fetchReports();
    }
  }, [userRole, currentUsername]);

  const handleSearch = () => {
    let result = reports;
    const searchTerm = admin.trim().toLowerCase();
    
    if (searchTerm || startDate || endDate) {
      result = reports.filter((report) => {
        const textMatch = 
          searchTerm === "" || 
          (report.name_ar && report.name_ar.toLowerCase().includes(searchTerm)) ||
          (report.name_en && report.name_en.toLowerCase().includes(searchTerm)) ||
          (report.phoneNumber && report.phoneNumber.includes(searchTerm)) ||
          (report.admin && report.admin.toLowerCase().includes(searchTerm));
        
        let dateMatch = true;
        if (startDate || endDate) {
          const reportDate = new Date(report.createdAt);
          reportDate.setHours(0, 0, 0, 0);
          const start = startDate ? new Date(startDate) : null;
          if (start) start.setHours(0, 0, 0, 0);
          const end = endDate ? new Date(endDate) : null;
          if (end) end.setHours(23, 59, 59, 999);
          
          if (start && end) {
            dateMatch = reportDate >= start && reportDate <= end;
          } else if (start) {
            dateMatch = reportDate >= start;
          } else if (end) {
            dateMatch = reportDate <= end;
          }
        }
        
        return textMatch && dateMatch;
      });
    }
    
    setFilteredReports(result);
    setCurrentPage(1);
  };

  const renewal = async (mongoId, numericId) => {
    try {
      const headers = { headers: getAuthHeader() };

      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1;

      const newYear = currentYear + 1;
      const newExpiryDate = `${newYear}/${String(currentMonth).padStart(2, '0')}`;

      await axios.post(
        `https://cbc-api.app/v4/renew`,
        {
          renewalDate: newExpiryDate,
          id: numericId,
          expire_period: newExpiryDate,
        },
        headers
      );

      await axios.put(
        `${API_URL}/${mongoId}`,
        {
          expire_period: newExpiryDate,
          date: newExpiryDate,
          remainingEditTime: "06:00:00"
        },
        headers
      );

      setReports(prev =>
        prev.map(r =>
          r._id === mongoId ? { ...r, expire_period: newExpiryDate, date: newExpiryDate, remainingEditTime: "06:00:00" } : r
        )
      );
      setFilteredReports(prev =>
        prev.map(r =>
          r._id === mongoId ? { ...r, expire_period: newExpiryDate, date: newExpiryDate, remainingEditTime: "06:00:00" } : r
        )
      );

      setError(null);
    } catch (err) {
      setError("حدث خطأ أثناء التجديد: " + (err.response?.data?.message || err.message));
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredReports.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  const totalQuantity = currentItems.reduce((acc, item) => acc + Number(item.quantity || 0), 0);
  const totalPaid = currentItems.reduce((acc, item) => acc + Number(item.moneyPaid || 0), 0);
  const totalRemain = currentItems.reduce((acc, item) => acc + Number(item.moneyRemain || 0), 0);

  const renderPaginationButtons = () => {
    if (totalPages <= 8) {
      return Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i + 1}
          onClick={() => paginate(i + 1)}
          className={`px-4 py-2 rounded-lg ${currentPage === i + 1 ? "bg-teal-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
        >
          {i + 1}
        </button>
      ));
    } else {
      const buttons = [];
      for (let i = 1; i <= 5; i++) {
        buttons.push(
          <button
            key={i}
            onClick={() => paginate(i)}
            className={`px-4 py-2 rounded-lg ${currentPage === i ? "bg-teal-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
          >
            {i}
          </button>
        );
      }
      buttons.push(
        <span key="dots" className="px-3 py-2 select-none text-gray-700">
          ...
        </span>
      );
      for (let i = totalPages - 2; i <= totalPages; i++) {
        buttons.push(
          <button
            key={i}
            onClick={() => paginate(i)}
            className={`px-4 py-2 rounded-lg ${currentPage === i ? "bg-teal-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
          >
            {i}
          </button>
        );
      }
      return buttons;
    }
  };

  return (
    <div className="m-4 sm:m-16 p-4 sm:p-6 bg-gray-50 min-h-screen text-right font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 sm:gap-0">
        <h2 className="text-2xl font-bold text-gray-700">قسم المحاسبة</h2>
      </div>
      <div>
        <TotalBills />
      </div>
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 justify-end flex-wrap">
          <div className="flex flex-col">
            <input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border px-3 py-2 rounded w-full md:w-auto"
            />
          </div>
          <div className="flex flex-col">
            <input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border px-3 py-2 rounded w-full md:w-auto"
            />
          </div>
          <div className="flex flex-col">
            <input
              id="admin"
              type="text"
              value={admin}
              onChange={(e) => setAdmin(e.target.value)}
              className="border px-3 py-2 rounded w-full md:w-auto"
            />
          </div>
          <button
            onClick={handleSearch}
            className="bg-teal-600 text-white px-6 py-2 rounded hover:bg-teal-700 transition w-full md:w-auto self-end mt-6"
          >
            بحث
          </button>
          <Link to={"./add-report"}>
            <button className="bg-teal-600 text-white px-6 py-2 rounded hover:bg-teal-700 transition w-full md:w-auto self-end mt-6">
              اضافة فاتورة جديدة
            </button>
          </Link>
          {userRole === "supervisor" && (
            <Link to={"./supervisor/reports"}>
              <button className="bg-teal-600 text-white px-6 py-2 rounded hover:bg-teal-700 transition w-full md:w-auto self-end mt-6">
                تعديل التقارير
              </button>
            </Link>
          )}
        </div>
      </div>
      {loading && <div className="text-center py-4 text-gray-600">...جاري تحميل البيانات</div>}
      {error && <div className="text-center py-4 text-red-600">{error}</div>}
      {!loading && !error && (
        <>
          <div className="overflow-x-auto bg-white rounded shadow">
            <table className="w-full sm:min-w-[1700px] text-sm text-right border-collapse">
              <thead className="bg-gray-100 text-gray-600 font-bold">
                <tr>
                  <th className="px-2 py-2">رقم التقرير</th>
                  <th className="px-2 py-2">الاسم بالعربي</th>
                  <th className="px-2 py-2">الاسم بالإنجليزي</th>
                  <th className="px-2 py-2">رقم الهاتف</th>
                  <th className="px-2 py-2">المبلغ الكامل</th>
                  <th className="px-2 py-2">المدفوع</th>
                  <th className="px-2 py-2">المتبقي</th>
                  <th className="px-2 py-2">العنوان</th>
                  <th className="px-2 py-2">الوزارة</th>
                  <th className="px-2 py-2">الفئة</th>
                  <th className="px-2 py-2">المسؤول</th>
                  <th className="px-2 py-2">الملاحظات</th>
                  <th className="px-2 py-2">على الراتب</th>
                  <th className="px-2 py-2">تاريخ الفاتورة</th>
                  <th className="px-2 py-2">الحالة</th>
                  <th className="px-2 py-2">تم التعديل</th>
                  <th className="px-2 py-2">وقت التعديل</th>
                  <th className="px-2 py-2">فترة الانتهاء</th>
                  <th className="px-2 py-2">الوقت المتبقي للتعديل</th>
                  <th className="px-2 py-2">الحقول المعدلة</th>
                  <th className="px-2 py-2">تعديل</th>
                  <th className="px-2 py-2">تجديد</th>
                  {/* <th className="px-2 py-2">الاسم بالاختبار</th> */}
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((report, i) => (
                    <tr key={i} className="border-t hover:bg-gray-50">
                      <td className="px-2 py-2">{report.number || "-"}</td>
                      <td className="px-2 py-2">{report.name_ar}</td>
                      <td className="px-2 py-2">{report.name_en}</td>
                      <td className="px-2 py-2">{report.phoneNumber}</td>
                      <td className="px-2 py-2">{formatNumber(report.quantity)}</td>
                      <td className="px-2 py-2">{formatNumber(report.moneyPaid)}</td>
                      <td className="px-2 py-2">{formatNumber(report.moneyRemain)}</td>
                      <td className="px-2 py-2">{report.address}</td>
                      <td className="px-2 py-2">{report.ministry}</td>
                      <td className="px-2 py-2">{getCardTypeText(report.cardCategory)}</td>
                      <td className="px-2 py-2">{report.admin}</td>
                      <td className="px-2 py-2">{report.notes}</td>
                      <td className="px-2 py-2">{report.onPayroll ? "نعم" : "لا"}</td>
                      <td className="px-2 py-2">{formatDateOnly(report.createdAt)}</td>
                      <td className="px-2 py-2">{report.status}</td>
                      <td className="px-2 py-2">{report.isEdited ? "نعم" : "لا"}</td>
                      <td className="px-2 py-2">{report.editedAt ? formatDateTime(report.editedAt) : "-"}</td>
                      <td className="px-2 py-2">{report.expire_period || "-"}</td>
                      <td className="px-2 py-2">{report.remainingEditTime || "-"}</td>
                      <td className="px-2 py-2 whitespace-pre-line">
                        {Array.isArray(report.editedFields) && report.editedFields.length > 0
                          ? report.editedFields
                            .filter(
                              (field) =>
                                field !== "editedAt" &&
                                field !== "remainingEditTime" &&
                                fieldArabicNames[field]
                            )
                            .map((field) => fieldArabicNames[field] || field)
                            .join("\n")
                          : "-"}
                      </td>
                      <td className="px-2 py-2">
                        <Link to={`/edit-report/${report._id}`}>
                          <button className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition">
                            تعديل
                          </button>
                        </Link>
                      </td>
                      <td className="px-2 py-2">
                        <button
                          onClick={() => {
                            if (!report.id) {
                              setError("الـ id الرقمي غير موجود في التقرير.");
                              return;
                            }
                            if (!report._id) {
                              setError("المعرف الداخلي (_id) غير موجود.");
                              return;
                            }
                            renewal(report._id, report.id);
                          }}
                          className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition"
                        >
                          تجديد سنة واحدة
                        </button>
                      </td>
                      {/* <td className="px-2 py-2">{report.name_test}</td> */}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="23" className="px-4 py-4 text-center text-gray-500">
                      لا توجد نتائج
                    </td>
                  </tr>
                )}
                <tr className="bg-gray-100 font-bold text-gray-800 border-t">
                  <td colSpan="4" className="px-2 py-2 text-center">
                    المجاميع للصفحة الحالية
                  </td>
                  <td className="px-2 py-2">{formatNumber(totalQuantity)}</td>
                  <td className="px-2 py-2">{formatNumber(totalPaid)}</td>
                  <td className="px-2 py-2">{formatNumber(totalRemain)}</td>
                  <td colSpan="16"></td>
                </tr>
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 space-x-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
              >
                السابق
              </button>
              {renderPaginationButtons()}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
              >
                التالي
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AccessReports;