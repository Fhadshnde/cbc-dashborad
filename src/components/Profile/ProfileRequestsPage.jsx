import React, { useState, useEffect, useCallback, useMemo } from "react"; // إضافة useMemo و useCallback
import axios from "axios";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import "moment/locale/ar";

moment.locale("ar");

const API_BASE_URL = "https://hawkama.cbc-api.app/api";

const ProfileRequestsPage = ({ setIsAuthenticated }) => {
  const [profileUpdateRequests, setProfileUpdateRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);

  const navigate = useNavigate();

  // استخدام useMemo لضمان استقرار مرجع token و userData
  // سيتم قراءتهما من localStorage مرة واحدة فقط عند التحميل الأولي للمكون
  const memoizedToken = useMemo(() => localStorage.getItem("token"), []);
  const memoizedUserData = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("userData"));
    } catch (e) {
      console.error("فشل في تحليل بيانات المستخدم من التخزين المحلي:", e);
      return null;
    }
  }, []);

  // استخدام useMemo لضمان استقرار مرجع axiosInstance
  // سيتم إعادة إنشائه فقط إذا تغير memoizedToken
  const axiosInstance = useMemo(() => {
    return axios.create({
      baseURL: API_BASE_URL,
      headers: {
        Authorization: `Bearer ${memoizedToken}`,
        "Content-Type": "application/json",
      },
    });
  }, [memoizedToken]);

  // استخدام useCallback لضمان استقرار مرجع الدالة fetchProfileUpdateRequests
  // سيتم إعادة إنشائها فقط إذا تغيرت axiosInstance
  const fetchProfileUpdateRequests = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/profiles/requests/all");
      setProfileUpdateRequests(response.data);
    } catch (err) {
      console.error("خطأ في جلب طلبات تحديث الملفات الشخصية:", err.response || err.message || err);
      setError("فشل في جلب طلبات تحديث الملفات الشخصية: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  }, [axiosInstance]); // axiosInstance هو التبعية هنا

  useEffect(() => {
    // استخدام المتغيرات memoizedToken و memoizedUserData
    if (!memoizedToken || !memoizedUserData || memoizedUserData.role !== "supervisor") {
      navigate("/login");
      setIsAuthenticated(false);
      return;
    }
    fetchProfileUpdateRequests();
  }, [memoizedToken, memoizedUserData, navigate, setIsAuthenticated, fetchProfileUpdateRequests]);
  // الآن جميع التبعيات في useEffect مستقرة:
  // memoizedToken: مستقر بفضل useMemo
  // memoizedUserData: مستقر بفضل useMemo
  // navigate: مستقر (دالة React)
  // setIsAuthenticated: مستقر (دالة React)
  // fetchProfileUpdateRequests: مستقر بفضل useCallback

  const handleReviewRequest = async (requestId, status, userId) => {
    setReviewLoading(true);
    try {
      await axiosInstance.put(`/profiles/requests/${requestId}/review`, { status, adminNote: "" });
      fetchProfileUpdateRequests(); // استدعاء الدالة المستقرة
      alert(`تم ${status === 'approved' ? 'الموافقة على' : 'رفض'} الطلب بنجاح.`);
    } catch (err) {
      console.error("خطأ في مراجعة الطلب:", err.response || err.message || err);
      setError("فشل في مراجعة الطلب: " + (err.response?.data?.message || err.message));
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl text-gray-700">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 font-sans" dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">جميع طلبات تحديث الملفات الشخصية</h1>
        <button
          onClick={() => navigate("/supervisor")}
          className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300"
        >
          العودة للوحة التحكم
        </button>
      </div>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{error}</div>}

      {profileUpdateRequests.length === 0 ? (
        <p className="text-gray-500">لا توجد طلبات تحديث معلقة حالياً.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-lg p-6">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">الموظف</th>
                <th className="py-3 px-6 text-left">التغييرات المطلوبة</th>
                <th className="py-3 px-6 text-left">الحالة</th>
                <th className="py-3 px-6 text-left">تاريخ الطلب</th>
                <th className="py-3 px-6 text-left">تاريخ المراجعة</th>
                <th className="py-3 px-6 text-left">المراجع</th>
                <th className="py-3 px-6 text-left">ملاحظات المشرف</th>
                <th className="py-3 px-6 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm font-light">
              {profileUpdateRequests.map((request) => (
                <tr key={request._id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    {request.profile?.fullName || request.requestedBy?.username || "غير معروف"}
                  </td>
                  <td className="py-3 px-6 text-left max-w-xs">
                    {Object.entries(request.changes).map(([key, value]) => (
                      <p key={key}>
                        <span className="font-semibold">{key}:</span> {JSON.stringify(value)}
                      </p>
                    ))}
                  </td>
                  <td className="py-3 px-6 text-left">
                    <span
                      className={`py-1 px-3 rounded-full text-xs font-semibold ${
                        request.status === "pending" ? "bg-yellow-200 text-yellow-800" :
                        request.status === "approved" ? "bg-green-200 text-green-800" :
                        "bg-red-200 text-red-800"
                      }`}
                    >
                      {request.status === "pending" ? "قيد الانتظار" : request.status === "approved" ? "تمت الموافقة" : "مرفوض"}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-left">{moment(request.requestDate).format("LLL")}</td>
                  <td className="py-3 px-6 text-left">{request.reviewDate ? moment(request.reviewDate).format("LLL") : "لم تتم المراجعة"}</td>
                  <td className="py-3 px-6 text-left">{request.reviewer?.username || "لا يوجد"}</td>
                  <td className="py-3 px-6 text-left max-w-xs truncate">{request.adminNote || "لا يوجد"}</td>
                  <td className="py-3 px-6 text-center">
                    {request.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleReviewRequest(request._id, "approved", request.profile?.user || request.requestedBy._id)}
                          className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded-md text-xs mr-2"
                          disabled={reviewLoading}
                        >
                          {reviewLoading ? "جاري..." : "موافقة"}
                        </button>
                        <button
                          onClick={() => handleReviewRequest(request._id, "rejected", request.profile?.user || request.requestedBy._id)}
                          className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-md text-xs"
                          disabled={reviewLoading}
                        >
                          {reviewLoading ? "جاري..." : "رفض"}
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProfileRequestsPage;