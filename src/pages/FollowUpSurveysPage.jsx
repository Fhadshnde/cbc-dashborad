import React, { useState, useEffect } from 'react';
import FollowUpSurveyForm from '../components/FollowUpSurvey/FollowUpSurveyForm';

const FollowUpSurveysPage = () => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState(null);

  const fetchSurveys = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/followupsurveys', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('فشل في جلب الاستبيانات');
      
      const data = await response.json();
      setSurveys(data.data || data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteSurvey = async (id) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`https://hawkama.cbc-api.app/api/followupsurveys/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('فشل في حذف الاستبيان');
      
      fetchSurveys();
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchSurveys();
  }, []);

  const hasRole = (roles) => {
    const user = JSON.parse(localStorage.getItem('userData'));
    return user && user.role && roles.includes(user.role);
  };

  // ... (بقية الكود الخاص بعرض الاستبيانات)

  return (
    <div>
      {/* شريط العنوان وأزرار التحكم */}
      {showForm ? (
        <FollowUpSurveyForm 
          survey={selectedSurvey}
          onSave={() => {
            setShowForm(false);
            fetchSurveys();
          }}
          onCancel={() => setShowForm(false)}
        />
      ) : (
        /* عرض قائمة الاستبيانات */
        surveys.map(survey => (
          <div key={survey._id}>
            <h3>{survey.storeName}</h3>
            <p>العنوان: {survey.storeAddress}</p>
            <p>القسم: {survey.section}</p>
            {/* عرض جميع الحقول الأخرى */}
            <p>ملاحظات المتابعة: {survey.followUpNotes}</p>
            
            {/* أزرار التعديل والحذف */}
          </div>
        ))
      )}
    </div>
  );
};

export default FollowUpSurveysPage;