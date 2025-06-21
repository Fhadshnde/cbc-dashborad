import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = "https://hawkama.cbc-api.app/api/followupsurveys"; // نقطة نهاية API للاستبيانات

const SurveyCompletionButton = ({ surveyId, currentStatus, onCompletionSuccess, onError }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const getAuthHeader = useCallback(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return null;
    }
    return { Authorization: `Bearer ${token}` };
  }, [navigate]);

  const handleMarkAsCompleted = async () => {
    setIsProcessing(true);
    try {
      const headers = getAuthHeader();
      if (!headers) {
        setIsProcessing(false);
        return;
      }

      // إرسال تحديث لحالة الاستبيان إلى 'completed'
      const response = await axios.put(
        `${API_URL}/${surveyId}`,
        { status: 'completed' }, // هذا هو الجزء الحيوي: إرسال حالة 'completed'
        { headers }
      );

      if (response.data.success) {
        onCompletionSuccess("تم وضع علامة على الاستبيان كمكتمل بنجاح.");
      } else {
        onError(response.data.message || "فشل وضع علامة على الاستبيان كمكتمل.");
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        navigate('/login');
      } else {
        onError(err.response?.data?.message || err.message || "حدث خطأ أثناء إكمال الاستبيان.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // عرض الزر فقط إذا لم يكن الاستبيان مكتملًا بالفعل
  if (currentStatus === 'completed' || currentStatus === 'archived') {
    return (
      <div className="text-green-600 font-semibold text-center mt-4">
        تم إكمال الاستبيان بنجاح
      </div>
    );
  }

  return (
    <button
      onClick={handleMarkAsCompleted}
      className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors duration-300 mt-4 w-full"
      disabled={isProcessing}
    >
      {isProcessing ? 'جاري الإكمال...' : 'وضع علامة كمكتمل'}
    </button>
  );
};

export default SurveyCompletionButton;
