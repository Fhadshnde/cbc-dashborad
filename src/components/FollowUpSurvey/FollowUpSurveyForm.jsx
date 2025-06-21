import React, { useState, useEffect } from 'react';

const FollowUpSurveyForm = ({ survey, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    storeName: '',
    storeAddress: '',
    section: '',
    storeRepresentativeName: '',
    cbcCardHoldersVisits: 'اقل من 10',
    promotionalVideoShot: false,
    promotionalDesignPublished: false,
    desirePosDevice: false,
    companyCommunicationRating: 'ضعيف',
    customerQualitySatisfaction: 'ضعيف',
    storeBehaviorRating: 'ضعيف',
    notes: '',
    internalNotes: '',
    followUpNotes: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [step, setStep] = useState(1);
  const user = JSON.parse(localStorage.getItem('userData'));

  useEffect(() => {
    if (survey) {
      setFormData({
        storeName: survey.storeName || '',
        storeAddress: survey.storeAddress || '',
        section: survey.section || '',
        storeRepresentativeName: survey.storeRepresentativeName || '',
        cbcCardHoldersVisits: survey.cbcCardHoldersVisits || 'اقل من 10',
        promotionalVideoShot: survey.promotionalVideoShot || false,
        promotionalDesignPublished: survey.promotionalDesignPublished || false,
        desirePosDevice: survey.desirePosDevice || false,
        companyCommunicationRating: survey.companyCommunicationRating || 'ضعيف',
        customerQualitySatisfaction: survey.customerQualitySatisfaction || 'ضعيف',
        storeBehaviorRating: survey.storeBehaviorRating || 'ضعيف',
        notes: survey.notes || '',
        internalNotes: survey.internalNotes || '',
        followUpNotes: survey.followUpNotes || ''
      });
    }
  }, [survey]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNextStep = () => {
    if (!formData.storeName || !formData.storeAddress || !formData.section || !formData.storeRepresentativeName) {
      setError('الرجاء تعبئة جميع الحقول المطلوبة في هذه الصفحة.');
      return;
    }
    setError('');
    setStep(2);
  };

  const handlePreviousStep = () => {
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      const token = localStorage.getItem('authToken');
      const url = survey && survey._id 
        ? `/api/followupsurveys/${survey._id}`
        : '/api/followupsurveys';
      
      const method = survey && survey._id ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('حدث خطأ أثناء حفظ الاستبيان');
      }

      setSuccess(survey && survey._id ? 'تم تحديث الاستبيان بنجاح!' : 'تم إنشاء الاستبيان بنجاح!');
      onSave();
    } catch (err) {
      setError(err.message);
      console.error("Error saving survey:", err);
    }
  };

  // ... (بقية الكود الخاص بالنماذج والأزرار كما هو)
  
  return (
    <div style={styles.formContainer}>
      <h2>{survey ? `تعديل استبيان: ${survey.storeName}` : 'إنشاء استبيان متابعة جديد'}</h2>
      
      {/* الخطوة الأولى - المعلومات الأساسية */}
      {step === 1 && (
        <div>
          <h3>معلومات المتجر الأساسية</h3>
          <input type="text" name="storeName" placeholder="اسم المتجر" value={formData.storeName} onChange={handleChange} required />
          
          <select name="storeAddress" value={formData.storeAddress} onChange={handleChange} required>
            <option value="">اختر العنوان</option>
            <option value="كرخ">كرخ</option>
            <option value="رصافة">رصافة</option>
            <option value="بصرة">بصرة</option>
            <option value="كربلاء">كربلاء</option>
            <option value="انبار">انبار</option>
            <option value="اربيل">اربيل</option>
          </select>
          
          {/* بقية حقول الخطوة الأولى */}
        </div>
      )}

      {/* الخطوة الثانية - الملاحظات */}
      {step === 2 && (
        <div>
          <h3>ملاحظات</h3>
          <textarea name="notes" placeholder="ملاحظات عامة" value={formData.notes} onChange={handleChange} rows="3"></textarea>
          
          <textarea name="internalNotes" placeholder="ملاحظات داخلية" value={formData.internalNotes} onChange={handleChange} rows="3"></textarea>
          
          
          {/* أزرار التنقل */}
        </div>
      )}
    </div>
  );
};

const styles = {
    formContainer: {
      padding: '20px',
      backgroundColor: '#f9f9f9',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      maxWidth: '800px',
      margin: '20px auto',
      direction: 'rtl',
      textAlign: 'right'
    },
    h2: {
      textAlign: 'center',
      marginBottom: '20px',
      color: '#333',
    },
    h3: {
      marginTop: '20px',
      marginBottom: '15px',
      color: '#555',
      borderBottom: '1px solid #eee',
      paddingBottom: '10px',
    },
    input: {
      display: 'block',
      width: 'calc(100% - 22px)',
      padding: '10px',
      margin: '10px 0',
      borderRadius: '4px',
      border: '1px solid #ddd',
      fontSize: '16px',
      resize: 'vertical',
    },
    select: {
      display: 'block',
      width: '100%',
      padding: '10px',
      margin: '10px 0',
      borderRadius: '4px',
      border: '1px solid #ddd',
      fontSize: '16px',
      backgroundColor: '#fff',
    },
    label: {
      display: 'block',
      marginTop: '15px',
      marginBottom: '5px',
      fontWeight: 'bold',
      color: '#333',
    },
    checkboxLabel: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '10px',
      cursor: 'pointer',
      color: '#333',
    },
    checkbox: {
      marginRight: '10px',
      transform: 'scale(1.2)',
    },
    buttonGroup: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '20px',
    },
    button: {
      padding: '10px 20px',
      margin: '0 5px',
      borderRadius: '5px',
      border: 'none',
      backgroundColor: '#007bff',
      color: 'white',
      cursor: 'pointer',
      fontSize: '16px',
      transition: 'background-color 0.3s ease',
      flexGrow: 1, // لجعل الأزرار تتوزع بالتساوي
      textAlign: 'center',
    },
    cancelButton: {
      backgroundColor: '#6c757d',
    },
    error: {
      color: 'red',
      backgroundColor: '#ffe6e6',
      padding: '10px',
      borderRadius: '4px',
      marginBottom: '15px',
      textAlign: 'center',
    },
    success: {
      color: 'green',
      backgroundColor: '#e6ffe6',
      padding: '10px',
      borderRadius: '4px',
      marginBottom: '15px',
      textAlign: 'center',
    },
    info: {
      color: '#007bff',
      backgroundColor: '#e0f7fa',
      padding: '10px',
      borderRadius: '4px',
      marginBottom: '15px',
      textAlign: 'center',
    },
  };

export default FollowUpSurveyForm;