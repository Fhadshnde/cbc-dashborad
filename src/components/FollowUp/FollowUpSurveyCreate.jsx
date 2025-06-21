import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import FloatingInput from '../common/FloatingInput';
import FloatingSelect from '../common/FloatingSelect';

const API_BASE_URL = 'https://hawkama.cbc-api.app/api';

const CreateFollowUpSurvey = () => {
  const navigate = useNavigate();
  const { contractId } = useParams();
  const location = useLocation();

  const [storeNameFromState, setStoreNameFromState] = useState('');
  const [formData, setFormData] = useState({
    contractId: contractId || '',
    storeName: '',
    storeAddress: '',
    section: '',
    storeRepresentativeName: '',
    cbcCardHoldersVisits: '',
    promotionalVideoShot: false,
    promotionalDesignPublished: false,
    desirePosDevice: false,
    companyCommunicationRating: '',
    customerQualitySatisfaction: '',
    storeBehaviorRating: '',
    notes: '',
    internalNotes: '',
    followUpNotes: '',
    personName: '',
    status: 'draft',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const getToken = useCallback(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      throw new Error('No token found');
    }
    return token;
  }, [navigate]);

  useEffect(() => {
    if (location.state?.storeName) {
      setStoreNameFromState(location.state.storeName);
      setFormData(prev => ({ ...prev, storeName: location.state.storeName }));
    }
  }, [location.state]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

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
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const requiredFields = [
        'storeName', 'storeAddress', 'section', 'storeRepresentativeName',
        'cbcCardHoldersVisits', 'companyCommunicationRating',
        'customerQualitySatisfaction', 'storeBehaviorRating', 'personName'
      ];
      for (const field of requiredFields) {
        if (!formData[field] || formData[field].toString().trim() === '') {
          throw new Error(`الرجاء ملء حقل: ${field}`);
        }
      }

      if (typeof formData.promotionalVideoShot !== 'boolean' || typeof formData.promotionalDesignPublished !== 'boolean') {
        throw new Error('قيم "تصوير فيديو ترويجي" و "نشر تصميم ترويجي" يجب أن تكون صحيحة أو خاطئة.');
      }

      await axios.post(`${API_BASE_URL}/followupsurveys`, formData, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          'Content-Type': 'application/json',
        },
      });

      setSuccess('تم إنشاء استبيان المتابعة بنجاح!');
      setLoading(false);
      navigate('/followupsurveys');
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'حدث خطأ غير متوقع.';
      setError(`خطأ في الإضافة: ${errorMessage}`);
      setLoading(false);
    }
  };

  return (
    <div className="m-4 sm:m-16 p-4 sm:p-6 bg-gray-50 min-h-screen text-right font-sans">
      <h2 className="text-2xl font-bold text-gray-700 mb-6">إنشاء استبيان متابعة</h2>
      {error && <div className="fixed top-20 right-5 bg-red-500 text-white p-3 rounded-lg shadow-lg z-50">{error}</div>}
      {success && <div className="fixed top-20 right-5 bg-green-500 text-white p-3 rounded-lg shadow-lg z-50">{success}</div>}

      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <FloatingInput
            label="معرف العقد (يملأ تلقائياً)"
            name="contractId"
            value={formData.contractId || ''}
            onChange={() => {}}
            readOnly
          />
          <FloatingInput
            label="اسم المتجر"
            name="storeName"
            value={formData.storeName || ''}
            onChange={handleChange}
            required
            readOnly={!!storeNameFromState}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <FloatingSelect
            label="عنوان المتجر (المحافظة) *"
            name="storeAddress"
            value={formData.storeAddress || ''}
            onChange={handleChange}
            required
          >
            <option value="">اختر المحافظة</option>
            <option value="كرخ">كرخ</option>
            <option value="رصافة">رصافة</option>
            <option value="بصرة">بصرة</option>
            <option value="كربلاء">كربلاء</option>
            <option value="انبار">انبار</option>
            <option value="اربيل">اربيل</option>
          </FloatingSelect>

          <FloatingInput
            label="القسم (نوع النشاط التجاري) *"
            name="section"
            value={formData.section || ''}
            onChange={handleChange}
            required
          />
        </div>

        <FloatingInput
          label="اسم مندوب المتجر *"
          name="storeRepresentativeName"
          value={formData.storeRepresentativeName || ''}
          onChange={handleChange}
          required
          className="mb-6"
        />

        <FloatingInput
          label="اسم الشخص (يكتب يدوياً) *"
          name="personName"
          value={formData.personName || ''}
          onChange={handleChange}
          required
          className="mb-6"
        />

        <FloatingSelect
          label="عدد زيارات حاملي بطاقة CBC شهرياً *"
          name="cbcCardHoldersVisits"
          value={formData.cbcCardHoldersVisits || ''}
          onChange={handleChange}
          required
          className="mb-6"
        >
          <option value="">اختر العدد</option>
          <option value="اقل من 10">أقل من 10</option>
          <option value="من 10 الى 50">من 10 إلى 50</option>
          <option value="من 50 الى 100">من 50 إلى 100</option>
          <option value="من 100 الى 1000">من 100 إلى 1000</option>
          <option value="اكثر من 1000">أكثر من 1000</option>
        </FloatingSelect>

        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="promotionalVideoShot"
              name="promotionalVideoShot"
              checked={formData.promotionalVideoShot}
              onChange={handleChange}
              className="form-checkbox h-5 w-5 text-[#25BC9D] rounded"
            />
            <label htmlFor="promotionalVideoShot" className="text-gray-700 text-right w-full">هل تم تصوير فيديو ترويجي؟</label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="promotionalDesignPublished"
              name="promotionalDesignPublished"
              checked={formData.promotionalDesignPublished}
              onChange={handleChange}
              className="form-checkbox h-5 w-5 text-[#25BC9D] rounded"
            />
            <label htmlFor="promotionalDesignPublished" className="text-gray-700 text-right w-full">هل تم نشر تصميم ترويجي؟</label>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="desirePosDevice"
              name="desirePosDevice"
              checked={formData.desirePosDevice}
              onChange={handleChange}
              className="form-checkbox h-5 w-5 text-[#25BC9D] rounded"
            />
            <label htmlFor="desirePosDevice" className="text-gray-700 text-right w-full">هل يرغب المتجر بجهاز POS؟</label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <FloatingSelect
            label="تقييم تواصل الشركة *"
            name="companyCommunicationRating"
            value={formData.companyCommunicationRating || ''}
            onChange={handleChange}
            required
          >
            <option value="">اختر التقييم</option>
            <option value="ضعيف">ضعيف</option>
            <option value="جيد">جيد</option>
            <option value="جيد جدا">جيد جدا</option>
            <option value="ممتاز">ممتاز</option>
          </FloatingSelect>

          <FloatingSelect
            label="رضا العميل عن جودة الخدمات/المنتجات *"
            name="customerQualitySatisfaction"
            value={formData.customerQualitySatisfaction || ''}
            onChange={handleChange}
            required
          >
            <option value="">اختر التقييم</option>
            <option value="ضعيف">ضعيف</option>
            <option value="جيد">جيد</option>
            <option value="جيد جدا">جيد جدا</option>
            <option value="ممتاز">ممتاز</option>
          </FloatingSelect>

          <FloatingSelect
            label="تقييم سلوك المتجر *"
            name="storeBehaviorRating"
            value={formData.storeBehaviorRating || ''}
            onChange={handleChange}
            required
          >
            <option value="">اختر التقييم</option>
            <option value="ضعيف">ضعيف</option>
            <option value="جيد">جيد</option>
            <option value="جيد جدا">جيد جدا</option>
            <option value="ممتاز">ممتاز</option>
          </FloatingSelect>
        </div>

        <FloatingInput
          label="ماهي ملاحظات عن النافذة الخاصة بالمتجر داخل التطبيق *"
          name="notes"
          value={formData.notes || ''}
          onChange={handleChange}
          textarea
          rows={3}
          className="mb-6"
        />
        <FloatingInput
          label="ماهي المشاكل التي واجهتها خلال فتره التعاون *"
          name="internalNotes"
          value={formData.internalNotes || ''}
          onChange={handleChange}
          textarea
          rows={3}
          className="mb-6"
        />

        <button
          type="submit"
          className="bg-[#25BC9D] text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline w-full transition-colors duration-300"
          disabled={loading}
        >
          {loading ? 'جاري الإضافة...' : 'إضافة استبيان المتابعة'}
        </button>
      </form>
    </div>
  );
};

export default CreateFollowUpSurvey;
