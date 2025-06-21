import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import SurveyCompletionButton from '../SurveyCompletionButton'; // تأكد من المسار الصحيح

const API_URL = "https://hawkama.cbc-api.app/api/followupsurveys";

const FollowUpSurveyDetails = () => {
  const { id } = useParams(); // الحصول على ID الاستبيان من الرابط
  const navigate = useNavigate();
  const [survey, setSurvey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const getToken = useCallback(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return null;
    }
    return { Authorization: `Bearer ${token}` };
  }, [navigate]);

  const fetchSurveyDetails = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const headers = getToken();
      if (!headers) return;
      const response = await axios.get(`${API_URL}/${id}`, { headers });
      setSurvey(response.data.data);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        setError("خطأ في تحميل تفاصيل الاستبيان: " + (err.response?.data?.message || err.message));
      }
    } finally {
      setLoading(false);
    }
  }, [id, getToken, navigate]);

  useEffect(() => {
    fetchSurveyDetails();
  }, [fetchSurveyDetails]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleCompletionSuccess = (message) => {
    setSuccessMessage(message);
    fetchSurveyDetails(); // إعادة جلب التفاصيل لتحديث حالة الاستبيان وزر الإكمال
  };

  const handleError = (errorMessage) => {
    setError(errorMessage);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 rtl">
        <div className="text-center p-8 text-lg text-gray-600 animate-pulse">جاري تحميل تفاصيل الاستبيان...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4 text-red-600">خطأ: {error}</div>
    );
  }

  if (!survey) {
    return (
      <div className="text-center py-4 text-gray-500">لا يمكن العثور على تفاصيل الاستبيان.</div>
    );
  }

  return (
    <div className="m-4 sm:m-16 p-4 sm:p-6 bg-gray-50 min-h-screen text-right font-sans">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-700">تفاصيل استبيان المتابعة</h2>
        <Link to="/followupsurveys" className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition">
          العودة للقائمة
        </Link>
      </div>

      {successMessage && (
        <div className="fixed top-20 right-5 bg-green-500 text-white p-3 rounded-lg shadow-lg z-50 animate-bounce-in-right">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="fixed top-20 right-5 bg-red-500 text-white p-3 rounded-lg shadow-lg z-50 animate-bounce-in-right">
          {error}
        </div>
      )}

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">معلومات المتجر</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <p><strong>اسم المتجر:</strong> {survey.storeName}</p>
          <p><strong>عنوان المتجر:</strong> {survey.storeAddress}</p>
          <p><strong>القسم:</strong> {survey.section}</p>
          <p><strong>ممثل المتجر:</strong> {survey.storeRepresentativeName}</p>
          {survey.contractId && (
            <p>
              <strong>معرف العقد:</strong> {survey.contractId.contractNumber || 'N/A'} ({survey.contractId.storeName || 'N/A'})
            </p>
          )}
          <p><strong>الحالة:</strong> {survey.status}</p>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">التقييمات</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <p><strong>زيارات حاملي بطاقة CBC:</strong> {survey.cbcCardHoldersVisits}</p>
          <p><strong>تقييم التواصل مع الشركة:</strong> {survey.companyCommunicationRating}</p>
          <p><strong>رضا الزبائن عن الجودة:</strong> {survey.customerQualitySatisfaction}</p>
          <p><strong>تقييم سلوك المتجر:</strong> {survey.storeBehaviorRating}</p>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">معلومات ترويجية</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <p><strong>هل تم تصوير فيديو إعلاني؟</strong> {survey.promotionalVideoShot ? 'نعم' : 'لا'}</p>
          <p><strong>هل تم نشر تصميم إعلاني؟</strong> {survey.promotionalDesignPublished ? 'نعم' : 'لا'}</p>
        </div>
      </div>

      {survey.visitLocation && survey.visitLocation.coordinates && survey.visitLocation.coordinates.length === 2 && (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">موقع الزيارة (GPS)</h3>
          <p>
            <strong>خط الطول:</strong> {survey.visitLocation.coordinates[0]}, <strong>خط العرض:</strong> {survey.visitLocation.coordinates[1]}
          </p>
          {/* هنا يمكنك إضافة زر "عرض على الخريطة" إذا كان لديك مكون خريطة */}
          {/* <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">عرض على الخريطة</button> */}
        </div>
      )}

      {survey.notes && (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">الملاحظات</h3>
          <p className="whitespace-pre-wrap">{survey.notes}</p>
        </div>
      )}

      {survey.internalNotes && (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">الملاحظات الداخلية</h3>
          <p className="whitespace-pre-wrap">{survey.internalNotes}</p>
        </div>
      )}
      
      <div className="flex justify-end gap-3 mt-6">
        <Link
          to={`/followupsurveys/${survey._id}/edit`}
          className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition-colors duration-300"
        >
          تعديل
        </Link>
        {/* زر إكمال الاستبيان */}
        <SurveyCompletionButton
          surveyId={survey._id}
          currentStatus={survey.status}
          onCompletionSuccess={handleCompletionSuccess}
          onError={handleError}
        />
      </div>
    </div>
  );
};

export default FollowUpSurveyDetails;
