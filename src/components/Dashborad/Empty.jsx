import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = "https://hawkama.cbc-api.app/api/reports";

const DeliveryReports = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState("daily");
  const navigate = useNavigate();

  const getAuthHeader = useCallback(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return null;
    }
    return { Authorization: `Bearer ${token}` };
  }, [navigate]);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const headers = getAuthHeader();
      if (!headers) {
        setLoading(false);
        return;
      }
      const response = await axios.get(API_URL, { headers });
      setReports(response.data);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        navigate('/login');
      } else {
        setError("حدث خطأ أثناء جلب تقارير التسليم: " + (err.response?.data?.message || err.message));
      }
    } finally {
      setLoading(false);
    }
  }, [getAuthHeader, navigate]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  useEffect(() => {
    filterReportsByDate();
  }, [reports, filterType]);

  const filterReportsByDate = () => {
    const now = new Date();
    let filtered = [];

    if (filterType === "daily") {
      const start = new Date(now);
      start.setHours(0, 0, 0, 0);
      const end = new Date(now);
      end.setHours(23, 59, 59, 999);

      filtered = reports.filter((report) => {
        const reportDate = new Date(report.createdAt);
        return reportDate >= start && reportDate <= end;
      });
    } else if (filterType === "weekly") {
      const start = new Date(now);
      start.setDate(start.getDate() - start.getDay());
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setDate(end.getDate() + 6);
      end.setHours(23, 59, 59, 999);

      filtered = reports.filter((report) => {
        const reportDate = new Date(report.createdAt);
        return reportDate >= start && reportDate <= end;
      });
    } else if (filterType === "monthly") {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      start.setHours(0, 0, 0, 0);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      end.setHours(23, 59, 59, 999);

      filtered = reports.filter((report) => {
        const reportDate = new Date(report.createdAt);
        return reportDate >= start && reportDate <= end;
      });
    }

    setFilteredReports(filtered);
  };

  const getTotalCards = (cardCategory) => {
    if (!cardCategory) return 0;
    return (cardCategory.oneYear || 0) + (cardCategory.twoYears || 0) + (cardCategory.virtual || 0);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 rtl">
        <div className="text-center p-8 text-lg text-gray-600 animate-pulse">جاري تحميل تقارير التسليم...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 rtl">
        <div className="text-center p-8 text-lg text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div
      className="
        bg-gray-50 rounded-xl shadow-md p-4 mx-auto overflow-y-auto
        w-[600px] max-w-[600px] min-w-[320px] h-[320px]
        transition-all duration-300 text-right font-sans
        [@media(max-width:600px)]:w-[320px]
        [@media(max-width:600px)]:max-w-[100vw]
        [@media(max-width:600px)]:min-w-0
        [@media(max-width:600px)]:mr-[36px] mt-7
      "
    >
      <h2 className="text-lg font-bold text-gray-700 mb-4 text-center">تقارير التسليم</h2>

      <div className="flex justify-center gap-2 mb-4">
        <button
          onClick={() => setFilterType("daily")}
          className={`px-4 py-1 rounded ${filterType === "daily" ? "bg-teal-600 text-white" : "bg-gray-200 text-gray-700"}`}
        >
          يومي
        </button>
        <button
          onClick={() => setFilterType("weekly")}
          className={`px-4 py-1 rounded ${filterType === "weekly" ? "bg-teal-600 text-white" : "bg-gray-200 text-gray-700"}`}
        >
          أسبوعي
        </button>
        <button
          onClick={() => setFilterType("monthly")}
          className={`px-4 py-1 rounded ${filterType === "monthly" ? "bg-teal-600 text-white" : "bg-gray-200 text-gray-700"}`}
        >
          شهري
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full sm:min-w-[700px] text-sm text-right border-collapse">
          <thead className="bg-gray-100 text-gray-600 font-bold">
            <tr>
              <th className="px-4 py-2 whitespace-nowrap">اسم موظف المبيعات</th>
              <th className="px-4 py-2 whitespace-nowrap">مجموع البطاقات</th>
              <th className="px-4 py-2 whitespace-nowrap">العنوان</th>
              <th className="px-4 py-2 whitespace-nowrap">تاريخ التسليم</th>
              <th className="px-4 py-2 whitespace-nowrap"></th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.length > 0 ? (
              filteredReports.map((report) => (
                <tr key={report._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2 whitespace-nowrap">{report.admin || 'غير محدد'}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{getTotalCards(report.cardCategory)}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{report.address || 'غير محدد'}</td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {report.createdAt ? new Date(report.createdAt).toLocaleDateString('ar-EG') : 'غير محدد'}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <input type="checkbox" className="form-checkbox h-4 w-4 text-teal-600 rounded" />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-4 py-4 text-center text-gray-500">
                  لا توجد تقارير تسليم لعرضها.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DeliveryReports;
