import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = "https://hawkama.cbc-api.app/api/reports/all";

const SupervisorAccessReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData && storedUserData !== "undefined") {
      try {
        const userData = JSON.parse(storedUserData);
        setUserRole(userData?.role);
      } catch {
        setUserRole(null);
      }
    }
  }, []);

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("توكن المصادقة غير موجود. يرجى تسجيل الدخول.");
      throw new Error("توكن المصادقة غير موجود");
    }
    return { Authorization: `Bearer ${token}` };
  };

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);
      const headers = { headers: getAuthHeader() };
      const res = await axios.get(API_URL, headers);
      setReports(res.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError("فشل في جلب التقارير: " + (err.response?.data?.message || err.message));
    }
  };

  useEffect(() => {
    if (userRole !== null) {
      fetchReports();
    }
  }, [userRole]);

  const handleStatusChange = async (id, currentStatus, newStatus) => {
    if (userRole === "supervisor") {
      const validStatuses = ["pending", "rejected", "canceled", "received", "processing", "approved"];
      if (!validStatuses.includes(newStatus)) {
        setError("المشرف لا يمكنه تغيير الحالة إلى هذه القيمة.");
        return;
      }
    } else if (userRole === "admin") {
      if (newStatus !== "canceled") {
        setError("المدير يمكنه تغيير الحالة إلى 'ملغاة' فقط.");
        return;
      }
    } else {
      setError("ليس لديك صلاحية لتغيير حالة التقرير.");
      return;
    }

    if (currentStatus === newStatus) return;
    if (!window.confirm(`هل أنت متأكد من تغيير الحالة إلى "${newStatus}"؟`)) return;

    try {
      setLoading(true);
      const headers = { headers: getAuthHeader() };
      await axios.patch(`${API_URL}/${id}/status`, { status: newStatus }, headers);
      await fetchReports();
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError("فشل في تحديث الحالة: " + (err.response?.data?.message || err.message));
    }
  };

  const formatNumber = (number) => {
    if (isNaN(number)) return number;
    return Number(number).toLocaleString("en-US");
  };

  const filteredReports = reports.filter((r) =>
    r.name_ar?.includes(searchQuery) ||
    r.name_en?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.phoneNumber?.includes(searchQuery) ||
    r.admin?.includes(searchQuery)
  );

  const totalPages = Math.ceil(filteredReports.length / reportsPerPage);
  const indexOfLast = currentPage * reportsPerPage;
  const indexOfFirst = indexOfLast - reportsPerPage;
  const currentReports = filteredReports.slice(indexOfFirst, indexOfLast);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // تعديل عداد الصفحات ليعرض أول ٥ وأخير ٥ صفحات مع التالي والسابق فقط

  const getPageNumbers = () => {
    if (totalPages <= 10) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const firstPages = [1, 2, 3, 4, 5];
    const lastPages = [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];

    // دمج الأول والأخير مع فاصل نقاط إذا لزم الأمر
    if (currentPage <= 5) {
      return [...firstPages, "...", ...lastPages];
    } else if (currentPage > totalPages - 5) {
      return [...firstPages, "...", ...lastPages];
    } else {
      // الصفحة وسط بين الأول والأخير، عرض 3 صفحات حول الصفحة الحالية
      const middlePages = [currentPage - 1, currentPage, currentPage + 1];
      return [...firstPages, "...", ...middlePages, "...", ...lastPages];
    }
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="p-4 bg-gray-50 min-h-screen text-right font-sans">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">تقارير المشرف</h1>

      <input
        type="text"
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setCurrentPage(1);
        }}
        placeholder="ابحث بالاسم أو رقم الهاتف أو المندوب"
        className="mb-4 px-4 py-2 border rounded w-full max-w-md"
      />

      {loading && <p className="text-center py-4 text-gray-600">جاري التحميل...</p>}
      {error && <p className="text-center py-4 text-red-600">{error}</p>}

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full border-collapse text-sm">
          <thead className="bg-gray-100 text-gray-600 font-bold">
            <tr>
              <th className="p-2 border">الاسم بالعربي</th>
              <th className="p-2 border">الاسم بالإنجليزي</th>
              <th className="p-2 border">رقم الهاتف</th>
              <th className="p-2 border">المبلغ الكامل</th>
              <th className="p-2 border">المدفوع</th>
              <th className="p-2 border">المتبقي</th>
              <th className="p-2 border">العنوان</th>
              <th className="p-2 border">الوزارة</th>
              <th className="p-2 border">التاريخ</th>
              <th className="p-2 border">المندوب</th>
              <th className="p-2 border">الحالة</th>
              <th className="p-2 border">تغيير الحالة</th>
            </tr>
          </thead>
          <tbody>
            {currentReports.length > 0 ? (
              currentReports.map((r) => (
                <tr key={r._id} className="border-t hover:bg-gray-50">
                  <td className="p-2 border">{r.name_ar}</td>
                  <td className="p-2 border">{r.name_en}</td>
                  <td className="p-2 border">{r.phoneNumber}</td>
                  <td className="p-2 border">{formatNumber(r.quantity)}</td>
                  <td className="p-2 border">{formatNumber(r.moneyPaid)}</td>
                  <td className="p-2 border">{formatNumber(r.moneyRemain)}</td>
                  <td className="p-2 border">{r.address}</td>
                  <td className="p-2 border">{r.ministry}</td>
                  <td className="p-2 border">{r.date}</td>
                  <td className="p-2 border">{r.admin}</td>
                  <td className="p-2 border">{r.status}</td>
                  <td className="p-2 border">
                    {(userRole === "supervisor" || userRole === "admin") ? (
                      <select
                        value={r.status}
                        onChange={(e) => handleStatusChange(r._id, r.status, e.target.value)}
                        className="border p-1 rounded text-sm w-full"
                      >
                        {userRole === "supervisor" && <option value="pending">قيد الانتظار</option>}
                        {userRole === "supervisor" && <option value="rejected">مرفوضة</option>}
                        <option value="canceled">ملغاة</option>
                        {userRole === "supervisor" && <option value="received">تم الاستلام</option>}
                        {userRole === "supervisor" && <option value="processing">قيد المعالجة</option>}
                        {userRole === "supervisor" && <option value="approved">موافق عليها</option>}
                      </select>
                    ) : (
                      <span className="text-gray-500">{r.status}</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="12" className="text-center py-4">لا توجد تقارير</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2 rtl:space-x-reverse flex-wrap gap-2">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            السابق
          </button>

          {pageNumbers.map((num, idx) =>
            num === "..." ? (
              <span key={"ellipsis-" + idx} className="px-2 py-1 select-none">...</span>
            ) : (
              <button
                key={num}
                onClick={() => goToPage(num)}
                className={`px-3 py-1 rounded ${currentPage === num ? "bg-blue-500 text-white" : "bg-gray-100"}`}
              >
                {num}
              </button>
            )
          )}

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            التالي
          </button>
        </div>
      )}
    </div>
  );
};

export default SupervisorAccessReports;
