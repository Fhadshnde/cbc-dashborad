import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import TotalBills from "./TotalBills";

const API_URL = "https://hawkama.cbc-api.app/api/reports";

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

  const formatDateOnly = (dateString) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleStatusChange = async (reportId, newStatus) => {
    try {
      const headers = { headers: getAuthHeader() };
      await axios.patch(`${API_URL}/${reportId}/status`, { status: newStatus }, headers);
      const response = await axios.get(`${API_URL}`, headers);
      setReports(response.data);
      setFilteredReports(response.data);
    } catch (err) {
      setError("فشل في تغيير الحالة: " + (err.response?.data?.message || err.message));
    }
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
        const response = userRole === "admin"
          ? await axios.get(`${API_URL}/by-admin/${currentUsername}`, headers)
          : await axios.get(API_URL, headers);
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
    if (admin.trim() || startDate || endDate) {
      result = reports.filter((report) => {
        const adminMatch = admin.trim() === "" || (report.admin && report.admin.toLowerCase().includes(admin.toLowerCase().trim()));
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
        return adminMatch && dateMatch;
      });
    }
    setFilteredReports(result);
    setCurrentPage(1);
  };

  const getCardTypeText = (cardCategory) => {
    if (!cardCategory) return "غير محدد";
    if (cardCategory.oneYear === 1) return "بطاقة سنة واحدة";
    if (cardCategory.twoYears === 1) return "بطاقة سنتين";
    if (cardCategory.virtual === 1) return "بطاقة افتراضية";
    return "غير محدد";
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredReports.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // ** حساب المجاميع حسب البيانات في الصفحة الحالية فقط **
  const totalQuantity = currentItems.reduce((acc, item) => acc + Number(item.quantity || 0), 0);
  const totalPaid = currentItems.reduce((acc, item) => acc + Number(item.moneyPaid || 0), 0);
  const totalRemain = currentItems.reduce((acc, item) => acc + Number(item.moneyRemain || 0), 0);

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
            <label htmlFor="startDate" className="text-sm text-gray-600 mb-1">من تاريخ</label>
            <input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="border px-3 py-2 rounded w-full md:w-auto" />
          </div>
          <div className="flex flex-col">
            <label htmlFor="endDate" className="text-sm text-gray-600 mb-1">إلى تاريخ</label>
            <input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="border px-3 py-2 rounded w-full md:w-auto" />
          </div>
          <div className="flex flex-col">
            <label htmlFor="admin" className="text-sm text-gray-600 mb-1">اسم المسؤول</label>
            <input id="admin" type="text" value={admin} onChange={(e) => setAdmin(e.target.value)} className="border px-3 py-2 rounded w-full md:w-auto" />
          </div>
          <button onClick={handleSearch} className="bg-teal-600 text-white px-6 py-2 rounded hover:bg-teal-700 transition w-full md:w-auto self-end mt-6">بحث</button>
          <Link to={"./add-report"}>
            <button className="bg-teal-600 text-white px-6 py-2 rounded hover:bg-teal-700 transition w-full md:w-auto self-end mt-6">اضافة فاتورة جديدة</button>
          </Link>
          {userRole === "supervisor" && (
            <Link to={"./supervisor/reports"}>
              <button className="bg-teal-600 text-white px-6 py-2 rounded hover:bg-teal-700 transition w-full md:w-auto self-end mt-6">تعديل التقارير</button>
            </Link>
          )}
        </div>
      </div>

      {loading && <div className="text-center py-4 text-gray-600">...جاري تحميل البيانات</div>}
      {error && <div className="text-center py-4 text-red-600">{error}</div>}

      {!loading && !error && (
        <>
          <div className="overflow-x-auto bg-white rounded shadow">
            <table className="w-full sm:min-w-[1400px] text-sm text-right border-collapse">
              <thead className="bg-gray-100 text-gray-600 font-bold">
                <tr>
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
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((report, i) => (
                    <tr key={i} className="border-t hover:bg-gray-50">
                      <td className="px-2 py-2">{report.name_ar}</td>
                      <td className="px-2 py-2">{report.name_en}</td>
                      <td className="px-2 py-2">{report.phoneNumber}</td>
                      <td className="px-2 py-2">{report.quantity}</td>
                      <td className="px-2 py-2">{report.moneyPaid}</td>
                      <td className="px-2 py-2">{report.moneyRemain}</td>
                      <td className="px-2 py-2">{report.address}</td>
                      <td className="px-2 py-2">{report.ministry}</td>
                      <td className="px-2 py-2">{getCardTypeText(report.cardCategory)}</td>
                      <td className="px-2 py-2">{report.admin}</td>
                      <td className="px-2 py-2">{report.notes}</td>
                      <td className="px-2 py-2">{report.onPayroll ? "نعم" : "لا"}</td>
                      <td className="px-2 py-2">{formatDateOnly(report.createdAt)}</td>
                      <td className="px-2 py-2">{report.status}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="14" className="px-4 py-4 text-center text-gray-500">لا توجد نتائج</td>
                  </tr>
                )}
                <tr className="bg-gray-100 font-bold text-gray-800 border-t">
                  <td colSpan="3" className="px-2 py-2 text-center">المجاميع للصفحة الحالية</td>
                  <td className="px-2 py-2">{totalQuantity}</td>
                  <td className="px-2 py-2">{totalPaid}</td>
                  <td className="px-2 py-2">{totalRemain}</td>
                  <td colSpan="8"></td>
                </tr>
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-6 space-x-2">
              <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50">السابق</button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button key={i + 1} onClick={() => paginate(i + 1)} className={`px-4 py-2 rounded-lg ${currentPage === i + 1 ? "bg-teal-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}>{i + 1}</button>
              ))}
              <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50">التالي</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AccessReports;
