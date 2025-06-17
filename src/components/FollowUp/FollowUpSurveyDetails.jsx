import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const FollowUpSurveyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [survey, setSurvey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSurvey = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`https://hawkama.cbc-api.app/api/followupsurveys/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSurvey(res.data.data);
      } catch (err) {
        setError("فشل في تحميل التفاصيل: " + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };
    fetchSurvey();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("هل أنت متأكد من حذف هذا الاستبيان؟")) return;
    try {
      await axios.delete(`https://hawkama.cbc-api.app/api/followupsurveys/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/followupsurveys");
    } catch (err) {
      alert("فشل في الحذف: " + err.message);
    }
  };

  return (
    <div className="m-4 sm:m-16 p-4 sm:p-6 bg-gray-50 min-h-screen text-right font-sans">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-700">تفاصيل استبيان المتابعة</h2>
        <button 
          onClick={() => navigate("/followupsurveys")}
          className="bg-[#25BC9D] text-white px-4 py-2 rounded "
        >
          العودة للقائمة
        </button>
      </div>

      {loading && (
        <div className="text-center py-4 text-gray-600">...جاري تحميل البيانات</div>
      )}

      {error && <div className="text-center py-4 text-red-600">{error}</div>}

      {!loading && !error && survey && (
        <div className="bg-white shadow rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">معلومات المتجر</h3>
              <div className="space-y-3">
                <p><span className="font-medium text-gray-600">اسم المتجر:</span> {survey.storeName}</p>
                <p><span className="font-medium text-gray-600">عنوان المتجر:</span> {survey.storeAddress}</p>
                <p><span className="font-medium text-gray-600">القسم:</span> {survey.section}</p>
                <p><span className="font-medium text-gray-600">ممثل المتجر:</span> {survey.storeRepresentativeName}</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">التقييمات</h3>
              <div className="space-y-3">
                <p><span className="font-medium text-gray-600">زيارات حاملي بطاقة CBC:</span> {survey.cbcCardHoldersVisits}</p>
                <p><span className="font-medium text-gray-600">تقييم التواصل مع الشركة:</span> {survey.companyCommunicationRating}</p>
                <p><span className="font-medium text-gray-600">رضا الزبائن عن الجودة:</span> {survey.customerQualitySatisfaction}</p>
                <p><span className="font-medium text-gray-600">تقييم سلوك المتجر:</span> {survey.storeBehaviorRating}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">معلومات ترويجية</h3>
              <div className="space-y-3">
                <p>
                  <span className="font-medium text-gray-600">هل تم تصوير فيديو إعلاني؟</span>{" "}
                  {survey.promotionalVideoShot ? "نعم" : "لا"}
                </p>
                <p>
                  <span className="font-medium text-gray-600">هل تم نشر تصميم إعلاني؟</span>{" "}
                  {survey.promotionalDesignPublished ? "نعم" : "لا"}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-6">
  <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">الملاحظات</h3>
  <div className="space-y-6 text-gray-700">
    <div>
      <h4 className="font-medium text-gray-600 mb-1">ماهي ملاحظات عن النافذة الخاصة بالمتجر داخل التطبيق *</h4>
      <p className="whitespace-pre-wrap">{survey.notes || "لا توجد ملاحظات"}</p>
    </div>
    <div>
      <h4 className="font-medium text-gray-600 mb-1">ماهي المشاكل التي واجهتها خلال فتره التعاون *</h4>
      <p className="whitespace-pre-wrap">{survey.internalNotes || "لا توجد ملاحظات"}</p>
    </div>
    <div>
      <h4 className="font-medium text-gray-600 mb-1">ملاحظات متابعة</h4>
      <p className="whitespace-pre-wrap">{survey.followUpNotes || "لا توجد ملاحظات"}</p>
    </div>
  </div>
</div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={() => navigate(`/followupsurveys/${id}/edit`)}
              className="bg-blue-600 text-white px-6 py-2 rounded 
              "
            >
              تعديل
            </button>
            <button
              onClick={handleDelete}
              className="bg-[#25BC9D] text-white px-6 py-2 rounded "
            >
              حذف
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FollowUpSurveyDetails;
