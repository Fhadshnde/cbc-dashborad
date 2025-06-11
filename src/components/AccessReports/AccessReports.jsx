import React, { useState, useEffect } from "react";
import axios from "axios";
import TotalBills from "./TotalBills";
import { Link } from "react-router-dom";

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

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("خطأ: توكن المصادقة غير موجود. يرجى تسجيل الدخول.");
      throw new Error("توكن المصادقة غير موجود");
    }
    return { Authorization: `Bearer ${token}` };
  };

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData && storedUserData !== "undefined") {
      try {
        const userData = JSON.parse(storedUserData);
        setUserRole(userData?.role);
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
        setUserRole(null);
      }
    }

    const fetchReports = async () => {
      setLoading(true);
      setError(null);
      try {
        const headers = { headers: getAuthHeader() };
        const response = await axios.get(API_URL, headers); // استخدم API_URL هنا
        setReports(response.data);
        setFilteredReports(response.data);
      } catch (err) {
        setError("حدث خطأ أثناء جلب البيانات: " + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const handleSearch = () => {
    let result = reports;

    if (admin.trim() || startDate || endDate) {
      result = reports.filter((report) => {
        const adminMatch =
          admin.trim() === "" ||
          report.admin.toLowerCase().includes(admin.toLowerCase().trim());

        let dateMatch = true;
        if (startDate || endDate) {
          const reportDate = new Date(report.date);
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
  };

  const getCardTypeText = (cardCategory) => {
    if (!cardCategory) return "غير محدد";
    if (cardCategory.oneYear === 1) return "بطاقة سنة واحدة";
    if (cardCategory.twoYears === 1) return "بطاقة سنتين";
    if (cardCategory.virtual === 1) return "بطاقة افتراضية";
    return "غير محدد";
  };

  return (
    <div className="m-4 sm:m-16 p-4 sm:p-6 bg-gray-50 min-h-screen text-right font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 sm:gap-0">
        <h2 className="text-2xl font-bold text-gray-700">قسم المحاسبة</h2>
      </div>

      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 justify-end flex-wrap">
          <div className="flex flex-col">
            <label htmlFor="startDate" className="text-sm text-gray-600 mb-1">
              من تاريخ
            </label>
            <input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border px-3 py-2 rounded w-full md:w-auto"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="endDate" className="text-sm text-gray-600 mb-1">
              إلى تاريخ
            </label>
            <input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border px-3 py-2 rounded w-full md:w-auto"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="admin" className="text-sm text-gray-600 mb-1">
              اسم المسؤول
            </label>
            <input
              id="admin"
              type="text"
              value={admin}
              onChange={(e) => setAdmin(e.target.value)}
              className="border px-3 py-2 rounded w-full md:w-auto"
              placeholder="ابحث باسم المسؤول"
            />
          </div>
          <button
            onClick={handleSearch}
            className="bg-teal-600 text-white px-6 py-2 rounded hover:bg-teal-700 transition w-full md:w-auto self-end mt-6"
          >
            بحث
          </button>
          <Link to={"./add-report"}>
            <button
              className="bg-teal-600 text-white px-6 py-2 rounded hover:bg-teal-700 transition w-full md:w-auto self-end mt-6"
            >
              اضافة فاتورة جديدة
            </button>
          </Link>

          {userRole === "supervisor" && (
            <Link to={"./supervisor/reports"}>
              <button
                className="bg-teal-600 text-white px-6 py-2 rounded hover:bg-teal-700 transition w-full md:w-auto self-end mt-6"
              >
                تعديل التقارير
              </button>
            </Link>
          )}
        </div>
      </div>

      <div className="w-full mb-8">
        <TotalBills />
      </div>

      {loading && (
        <div className="text-center py-4 text-gray-600">...جاري تحميل البيانات</div>
      )}

      {error && <div className="text-center py-4 text-red-600">{error}</div>}

      {!loading && !error && (
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="w-full sm:min-w-[1000px] text-sm text-right border-collapse">
            <thead className="bg-gray-100 text-gray-600 font-bold">
              <tr>
                <th className="px-2 py-2 whitespace-nowrap">الاسم بالعربي</th>
                <th className="px-2 py-2 whitespace-nowrap">الاسم بالإنجليزي</th>
                <th className="px-2 py-2 whitespace-nowrap">رقم الهاتف</th>
                <th className="px-2 py-2 whitespace-nowrap">المبلغ الكامل</th>
                <th className="px-2 py-2 whitespace-nowrap">المدفوع</th>
                <th className="px-2 py-2 whitespace-nowrap">المتبقي</th>
                <th className="px-2 py-2 whitespace-nowrap">العنوان</th>
                <th className="px-2 py-2 whitespace-nowrap">عنوان الوزارة</th>
                <th className="px-2 py-2 whitespace-nowrap">فئة البطاقة</th>
                <th className="px-2 py-2 whitespace-nowrap">المسؤول</th>
                <th className="px-2 py-2 whitespace-nowrap">الملاحظات</th> {/* تم إضافة هذا */}
                <th className="px-2 py-2 whitespace-nowrap">على الراتب</th> {/* تم إضافة هذا */}
                <th className="px-2 py-2 whitespace-nowrap">أنشأ في</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.length > 0 ? (
                filteredReports.map((report, i) => (
                  <tr key={i} className="border-t hover:bg-gray-50">
                    <td className="px-2 py-2 whitespace-nowrap">{report.name}</td>
                    <td className="px-2 py-2 whitespace-nowrap">{report.nameEn}</td>
                    <td className="px-2 py-2 whitespace-nowrap">{report.phone}</td>
                    <td className="px-2 py-2 whitespace-nowrap">{report.quantity}</td>
                    <td className="px-2 py-2 whitespace-nowrap">{report.paid}</td>
                    <td className="px-2 py-2 whitespace-nowrap">{report.remaining}</td>
                    <td className="px-2 py-2 whitespace-nowrap">{report.address}</td>
                    <td className="px-2 py-2 whitespace-nowrap">{report.ministry}</td>
                    <td className="px-2 py-2 whitespace-nowrap">
                      {getCardTypeText(report.cardCategory)}
                    </td>
                    <td className="px-2 py-2 whitespace-nowrap">{report.admin}</td>
                    <td className="px-2 py-2 whitespace-nowrap">{report.notes}</td> {/* تم إضافة هذا */}
                    <td className="px-2 py-2 whitespace-nowrap">
                      {report.onPayroll ? "على الراتب" : "-"} {/* تم إضافة هذا */}
                    </td>
                    <td className="px-2 py-2 whitespace-nowrap">{report.date}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="13" className="px-4 py-4 text-center text-gray-500"> {/* تم تغيير colSpan */}
                    لا توجد نتائج مطابقة لبحثك
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AccessReports;