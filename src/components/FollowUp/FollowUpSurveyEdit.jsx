import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import FloatingInput from "../common/FloatingInput";
import FloatingSelect from "../common/FloatingSelect";
import StepIndicator from "../common/StepIndicator";

const getUserData = () => {
  const userData = localStorage.getItem('userData');
  return userData ? JSON.parse(userData) : null;
};

const FollowUpSurveyEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = getUserData();

  const [formData, setFormData] = useState({
    storeName: '',
    storeAddress: '',
    section: '',
    storeRepresentativeName: '',
    cbcCardHoldersVisits: '',
    promotionalVideoShot: false,
    promotionalDesignPublished: false,
    companyCommunicationRating: '',
    customerQualitySatisfaction: '',
    storeBehaviorRating: '',
    notes: '',
    internalNotes: '',
    followUpNotes: '',
    followUpEmployee: user?.username || '',
    visitLocation: null,
  });
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const getToken = useCallback(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      throw new Error("No token found");
    }
    return token;
  }, [navigate]);

  useEffect(() => {
    const fetchSurvey = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get(`https://hawkama.cbc-api.app/api/followupsurveys/${id}`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        const data = res.data.data;
        setFormData({
          storeName: data.storeName || '',
          storeAddress: data.storeAddress || '',
          section: data.section || '',
          storeRepresentativeName: data.storeRepresentativeName || '',
          cbcCardHoldersVisits: data.cbcCardHoldersVisits || '',
          promotionalVideoShot: typeof data.promotionalVideoShot === 'boolean' ? data.promotionalVideoShot : false,
          promotionalDesignPublished: typeof data.promotionalDesignPublished === 'boolean' ? data.promotionalDesignPublished : false,
          companyCommunicationRating: data.companyCommunicationRating || '',
          customerQualitySatisfaction: data.customerQualitySatisfaction || '',
          storeBehaviorRating: data.storeBehaviorRating || '',
          notes: data.notes || '',
          internalNotes: data.internalNotes || '',
          followUpNotes: data.followUpNotes || '',
          followUpEmployee: data.followUpEmployee || user?.username || '',
          visitLocation: data.visitLocation || null,
        });
      } catch (err) {
        setError("فشل في جلب البيانات: " + (err.response?.data?.message || err.message));
        if (err.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchSurvey();
  }, [id, getToken, navigate, user?.username]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'promotionalVideoShot' || name === 'promotionalDesignPublished') {
      setFormData(prev => ({ ...prev, [name]: value === 'true' }));
    } else if (type === "checkbox") {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          setFormData(prev => ({
            ...prev,
            visitLocation: {
              type: 'Point',
              coordinates: [longitude, latitude]
            }
          }));
          setSuccessMessage('تم تحديد موقع الزيارة بنجاح.');
          setError('');
        },
        (error) => {
          setError('فشل تحديد موقع الزيارة: ' + error.message);
          setSuccessMessage('');
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setError('متصفحك لا يدعم تحديد الموقع الجغرافي.');
      setSuccessMessage('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);
    try {
      const requiredFields = [
        'storeName', 'storeAddress', 'section', 'storeRepresentativeName',
        'cbcCardHoldersVisits', 'companyCommunicationRating',
        'customerQualitySatisfaction', 'storeBehaviorRating', 'notes',
        'followUpEmployee'
      ];
      for (const field of requiredFields) {
        if (!formData[field] || formData[field].toString().trim() === '') {
          throw new Error(`الرجاء ملء حقل: ${field}`);
        }
      }
      await axios.put(`https://hawkama.cbc-api.app/api/followupsurveys/${id}`, formData, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setSuccessMessage('تم تحديث الاستبيان بنجاح!');
      navigate(`/followupsurveys/${id}`);
    } catch (err) {
      setError("خطأ في التعديل: " + (err.response?.data?.message || err.message));
      if (err.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const next = () => setStep(s => Math.min(s + 1, 4));
  const prev = () => setStep(s => Math.max(s - 1, 1));

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 rtl">
        <div className="text-center p-8 text-lg text-gray-600 animate-pulse">جاري تحميل البيانات...</div>
      </div>
    );
  }

  return (
    <div className="m-4 sm:m-16 p-4 sm:p-6 bg-gray-50 min-h-screen text-right font-sans">
      <h2 className="text-2xl font-bold text-gray-700 mb-6">تعديل استبيان المتابعة</h2>

      {error && (
        <div className="fixed top-20 right-5 bg-red-500 text-white p-3 rounded-lg shadow-lg z-50 animate-bounce-in-right">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="fixed top-20 right-5 bg-green-500 text-white p-3 rounded-lg shadow-lg z-50 animate-bounce-in-right">
          {successMessage}
        </div>
      )}

      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between mb-8">
          <StepIndicator stepNumber={1} label="بيانات المتجر" isActive={step === 1} isCompleted={step > 1} />
          <StepIndicator stepNumber={2} label="تقييم المتابعة" isActive={step === 2} isCompleted={step > 2} />
          <StepIndicator stepNumber={3} label="الملاحظات" isActive={step === 3} isCompleted={step > 3} />
          <StepIndicator stepNumber={4} label="الموظف" isActive={step === 4} isCompleted={false} />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {step === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FloatingInput label="اسم المتجر *" name="storeName" value={formData.storeName} onChange={handleChange} required />
              <FloatingSelect label="عنوان المتجر *" name="storeAddress" value={formData.storeAddress} onChange={handleChange} required>
                <option value="">اختر العنوان</option>
                <option>كرخ</option><option>رصافة</option><option>بصرة</option>
                <option>كربلاء</option><option>انبار</option><option>اربيل</option>
              </FloatingSelect>
              <FloatingInput label="القسم *" name="section" value={formData.section} onChange={handleChange} required />
              <FloatingInput label="ممثل المتجر *" name="storeRepresentativeName" value={formData.storeRepresentativeName} onChange={handleChange} required />
              <div className="mb-6 mt-4 md:col-span-2">
                <label className="block text-gray-700 text-sm font-bold mb-2">تحديد موقع الزيارة (GPS)</label>
                <button
                  type="button"
                  onClick={handleGetLocation}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300 ease-in-out"
                  disabled={loading}
                >
                  تحديد موقعي
                </button>
                {formData.visitLocation?.coordinates?.length === 2 && (
                  <p className="text-gray-600 text-sm mt-2">
                    الموقع المحدد: خط الطول {formData.visitLocation.coordinates[0]}, خط العرض {formData.visitLocation.coordinates[1]}
                  </p>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FloatingSelect label="عدد زيارات حاملي CBC *" name="cbcCardHoldersVisits" value={formData.cbcCardHoldersVisits} onChange={handleChange} required>
                <option value="">اختر عدد الزيارات</option>
                <option>اقل من 10</option><option>من 10 الى 50</option>
                <option>من 50 الى 100</option><option>من 100 الى 1000</option>
                <option>اكثر من 1000</option>
              </FloatingSelect>

              <FloatingSelect
                label="هل تم عمل فيديو إعلاني؟ *"
                name="promotionalVideoShot"
                value={formData.promotionalVideoShot ? "true" : "false"}
                onChange={handleChange}
                required
              >
                <option value="">اختر</option>
                <option value="true">نعم</option>
                <option value="false">لا</option>
              </FloatingSelect>

              <FloatingSelect
                label="هل تم نشر تصميم إعلاني؟ *"
                name="promotionalDesignPublished"
                value={formData.promotionalDesignPublished ? "true" : "false"}
                onChange={handleChange}
                required
              >
                <option value="">اختر</option>
                <option value="true">نعم</option>
                <option value="false">لا</option>
              </FloatingSelect>

              <FloatingSelect label="تقييم تواصل الشركة *" name="companyCommunicationRating" value={formData.companyCommunicationRating} onChange={handleChange} required>
                <option value="">اختر التقييم</option>
                <option>ضعيف</option><option>جيد</option><option>جيد جدا</option><option>ممتاز</option>
              </FloatingSelect>

              <FloatingSelect label="رضا الزبائن *" name="customerQualitySatisfaction" value={formData.customerQualitySatisfaction} onChange={handleChange} required>
                <option value="">اختر الرضا</option>
                <option>ضعيف</option><option>جيد</option><option>جيد جدا</option><option>ممتاز</option>
              </FloatingSelect>

              <FloatingSelect label="سلوك المتجر *" name="storeBehaviorRating" value={formData.storeBehaviorRating} onChange={handleChange} required>
                <option value="">اختر السلوك</option>
                <option>ضعيف</option><option>جيد</option><option>جيد جدا</option><option>ممتاز</option>
              </FloatingSelect>
            </div>
          )}

          {step === 3 && (
            <div className="grid grid-cols-1 gap-6">
              <FloatingInput label="ماهي ملاحظات عن النافذة الخاصة بالمتجر داخل التطبيق *" name="notes" value={formData.notes} onChange={handleChange} textarea rows={3} />
              <FloatingInput label="ماهي المشاكل التي واجهتها خلال فتره التعاون *" name="internalNotes" value={formData.internalNotes} onChange={handleChange} textarea rows={3} />
              <FloatingInput
                label="اسم موظف المتابعة *"
                name="followUpEmployee"
                value={formData.followUpEmployee}
                onChange={handleChange}  
              />
            </div>
          )}

{/* 
          {step === 4 && (
            <FloatingInput
              label="اسم موظف المتابعة *"
              name="followUpEmployee"
              value={formData.followUpEmployee}
              onChange={handleChange}  
            />
          )} */}


          <div className="flex justify-between pt-6">
            {step > 1 && (
              <button type="button" onClick={prev} className="bg-gray-300 text-black px-4 py-2 rounded-lg">السابق</button>
            )}
            {step < 4 ? (
              <button type="button" onClick={next} className="bg-blue-600 text-white px-4 py-2 rounded-lg">التالي</button>
            ) : (
              <button type="submit" className="bg-yellow-600 text-white px-4 py-2 rounded-lg" disabled={loading}>حفظ التعديلات</button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default FollowUpSurveyEdit;
