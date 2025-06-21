import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa"; // استخدام أيقونة مستخدم عامة

const API_URL = "https://hawkama.cbc-api.app/api/reports"; // نقطة نهاية API لجلب التقارير

const BestSellers = () => {
  const [bestSellersData, setBestSellersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // دالة للحصول على التوكن من Local Storage
  const getAuthHeader = useCallback(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return null;
    }
    return { Authorization: `Bearer ${token}` };
  }, [navigate]);

  // دالة لجلب التقارير ومعالجة بيانات أفضل البائعين
  const fetchAndProcessBestSellers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const headers = getAuthHeader();
      if (!headers) {
        setLoading(false);
        return;
      }

      const response = await axios.get(API_URL, { headers });
      const allReports = response.data;

      // تجميع الفواتير المستلمة حسب المسؤول (admin)
      const sellersMap = new Map(); // Map<adminName, count>

      allReports.forEach(report => {
        // نعتبر "أفضل البائعين" هم من لديهم فواتير بحالة "received"
        if (report.status === "received" && report.admin) {
          const currentCount = sellersMap.get(report.admin) || 0;
          sellersMap.set(report.admin, currentCount + 1);
        }
      });

      // تحويل Map إلى مصفوفة وتصنيفها
      const sortedSellers = Array.from(sellersMap.entries())
        .map(([name, total]) => ({ name, total: total }))
        .sort((a, b) => b.total - a.total); // تصنيف تنازليًا حسب عدد الفواتير

      setBestSellersData(sortedSellers);

    } catch (err) {
      if (err.response && err.response.status === 401) {
        navigate('/login');
      } else {
        setError("حدث خطأ أثناء جلب بيانات أفضل البائعين: " + (err.response?.data?.message || err.message));
      }
    } finally {
      setLoading(false);
    }
  }, [getAuthHeader, navigate]);

  // جلب البيانات عند تحميل المكون
  useEffect(() => {
    fetchAndProcessBestSellers();
  }, [fetchAndProcessBestSellers]);

  if (loading) {
    return (
      <div
        className="
          p-4 rounded-lg bg-white shadow-md
          w-[420px] max-w-[420px] min-w-[320px] h-auto md:h-[450px] mx-auto
          transition-all duration-300 flex items-center justify-center
        "
      >
        <div className="text-center text-gray-600">...جاري تحميل أفضل البائعين</div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="
          p-4 rounded-lg bg-white shadow-md
          w-[420px] max-w-[420px] min-w-[320px] h-auto md:h-[450px] mx-auto
          transition-all duration-300 flex items-center justify-center
        "
      >
        <div className="text-center text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div
      className="
        p-4 rounded-lg bg-white shadow-md overflow-y-auto
        w-[420px] max-w-[420px] min-w-[320px] h-auto md:h-[450px] mx-auto
        transition-all duration-300
        [@media(max-width:600px)]:w-[320px]
        [@media(max-width:600px)]:max-w-[100vw]
        [@media(max-width:600px)]:min-w-0
        [@media(max-width:600px)]:mr-[36px]
      "
    >
      <h2 className="text-lg font-bold text-center mb-6">أفضل البائعين</h2>
      <div className="flex flex-col gap-4">
        {bestSellersData.length > 0 ? (
          bestSellersData.map((item, index) => (
            <div key={index} className="flex items-start">
              <div className="ml-3">
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 overflow-hidden">
                  {/* استخدام أيقونة مستخدم عامة بدلاً من الصورة العشوائية */}
                  <FaUserCircle className="text-gray-400 text-3xl" />
                </div>
              </div>
              <div className="flex flex-col text-right flex-1 pr-2">
                <span className="text-sm font-semibold text-gray-700">{item.name}</span>
                <span className="text-sm text-gray-500">{item.total} عملية بيع</span> {/* عرض العدد الحقيقي */}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-4">
            لا توجد بيانات لأفضل البائعين حالياً.
          </div>
        )}
      </div>
    </div>
  );
};

export default BestSellers;
