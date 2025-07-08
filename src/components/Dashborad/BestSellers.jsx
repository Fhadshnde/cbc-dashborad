import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

const API_REPORTS_URL = "https://hawkama.cbc-api.app/api/reports";
const API_USERS_URL = "https://hawkama.cbc-api.app/api/users"; // نقطة نهاية API لجلب بيانات المستخدمين
const API_STATIC_BASE_URL = "https://hawkama.cbc-api.app"; // المسار الأساسي لجلب الملفات الثابتة مثل الصور

const BestSellers = () => {
  const [bestSellersData, setBestSellersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const getAuthHeader = useCallback(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return null;
    }
    return { Authorization: `Bearer ${token}` };
  }, [navigate]);

  const fetchAndProcessBestSellers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const headers = getAuthHeader();
      if (!headers) {
        setLoading(false);
        return;
      }

      // جلب جميع التقارير
      const reportsResponse = await axios.get(`${API_REPORTS_URL}/`, { headers });
      const allReports = reportsResponse.data;

      // جلب جميع المستخدمين للحصول على صورهم
      const usersResponse = await axios.get(`${API_USERS_URL}/`, { headers });
      const allUsers = usersResponse.data;

      // إنشاء خريطة لربط اسم المستخدم برابط صورته
      const userImageMap = new Map();
      allUsers.forEach(user => {
        if (user.username && user.imageUrl) {
          // بناء رابط الصورة باستخدام المسار الأساسي للملفات الثابتة
          userImageMap.set(user.username, `${API_STATIC_BASE_URL}${user.imageUrl}`);
        }
      });

      // تجميع الفواتير المستلمة حسب المسؤول (admin)
      const sellersMap = new Map();

      allReports.forEach(report => {
        // التحقق من أن التقرير مستلم وأن له مسؤولاً (admin)
        if (report.status === "received" && report.admin) {
          const adminUsername = report.admin;

          let sellerData = sellersMap.get(adminUsername);
          if (!sellerData) {
            sellerData = { name: adminUsername, total: 0, imageUrl: userImageMap.get(adminUsername) || null };
            sellersMap.set(adminUsername, sellerData);
          }
          sellerData.total += 1;
        }
      });

      // تحويل الخريطة إلى مصفوفة وفرزها بناءً على إجمالي المبيعات (المستلمة) بترتيب تنازلي
      const sortedSellers = Array.from(sellersMap.values())
        .sort((a, b) => b.total - a.total);

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
      p-4 rounded-lg bg-white shadow-md overflow-y-auto relative left-[100px]
        w-[600px] max-w-[520px] min-w-[360px] h-auto md:h-[450px] mx-auto
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
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://placehold.co/32x32/cccccc/ffffff?text=U';
                      }}
                    />
                  ) : (
                    <FaUserCircle className="text-gray-400 text-3xl" />
                  )}
                </div>
              </div>
              <div className="flex flex-col text-right flex-1 pr-2">
                <span className="text-sm font-semibold text-gray-700">{item.name}</span>
                <span className="text-sm text-gray-500">{item.total} عملية بيع</span>
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
