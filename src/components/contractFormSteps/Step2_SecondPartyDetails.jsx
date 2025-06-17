import React from 'react';
import FloatingInput from '../common/FloatingInput';

const apiRequest = async (method, url, data = null, isFormData = false, getToken) => {
  const userToken = getToken();
  const headers = {};
  if (userToken) {
    headers['Authorization'] = `Bearer ${userToken}`;
  }
  let body = data;
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(data);
  }
  try {
    const response = await fetch(`https://hawkama.cbc-api.app/api/merchant/contracts${url}`, {
      method: method,
      headers: headers,
      body: body,
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'حدث خطأ في الشبكة.');
    }
    return response.json();
  } catch (error) {
    console.error(`API request error (${method} ${url}):`, error);
    throw error;
  }
};

const updateContractDetailsApi = (id, detailsData, getToken) => apiRequest('PUT', `/${id}/details`, detailsData, false, getToken);
const Step2_SecondPartyDetails = ({ formData, handleChange, setFormData, setCurrentStep, contract, setError, setSuccess, setLoading, loading, getToken }) => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    const contractId = contract?._id || formData._id;
    if (!contractId) {
      setError("الرجاء إنشاء العقد الأولي أولاً والانتظار حتى يتم حفظه.");
      setLoading(false);
      return;
    }
    try {
      if (!formData.secondPartyOwnerName || !formData.commercialActivityType || !formData.ownerPersonalPhone || !formData.contractFullAddress || !formData.contractGovernorate) {
        throw new Error("الرجاء ملء جميع حقول معلومات الطرف الثاني المطلوبة.");
      }
      const res = await updateContractDetailsApi(contractId, formData, getToken);
      setFormData(res.contract);
      setSuccess('تم تحديث تفاصيل الطرف الثاني بنجاح.');
      setCurrentStep(3);
    } catch (err) {
      setError(err.message || 'حدث خطأ أثناء تحديث تفاصيل الطرف الثاني.');
      console.error("Error updating contract details:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">تفاصيل الطرف الثاني</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <FloatingInput
          label="اسم صاحب الطرف الثاني *"
          placeholder="ادخل اسم المالك"
          name="secondPartyOwnerName"
          value={formData.secondPartyOwnerName || ''}
          onChange={handleChange}
          required
        />
        <FloatingInput
          label="نوع النشاط التجاري *"
          placeholder="ادخل نوع النشاط"
          name="commercialActivityType"
          value={formData.commercialActivityType || ''}
          onChange={handleChange}
          required
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <FloatingInput
          label="رقم هاتف المالك *"
          placeholder="ادخل رقم هاتف المالك"
          name="ownerPersonalPhone"
          value={formData.ownerPersonalPhone || ''}
          onChange={handleChange}
          required
        />
        <FloatingInput
          label="هاتف خدمة العملاء (اختياري)"
          placeholder="ادخل هاتف خدمة العملاء"
          name="customerServicePhone"
          value={formData.customerServicePhone || ''}
          onChange={handleChange}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <FloatingInput
          label="بريد العقد الإلكتروني (اختياري)"
          placeholder="ادخل بريد العقد"
          name="contractEmail"
          value={formData.contractEmail || ''}
          onChange={handleChange}
          type="email"
        />
        <FloatingInput
          label="المحافظة *"
          placeholder="ادخل المحافظة"
          name="contractGovernorate"
          value={formData.contractGovernorate || ''}
          onChange={handleChange}
          required
        />
      </div>
      <FloatingInput
        label="العنوان الكامل *"
        placeholder="ادخل العنوان الكامل"
        name="contractFullAddress"
        value={formData.contractFullAddress || ''}
        onChange={handleChange}
        required
        className="mb-6"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <FloatingInput
          label="بريد المتجر الإلكتروني (اختياري)"
          placeholder="ادخل بريد المتجر"
          name="storeEmail"
          value={formData.storeEmail || ''}
          onChange={handleChange}
          type="email"
        />
        <FloatingInput
          label="رابط فيسبوك (اختياري)"
          placeholder="ادخل رابط الفيسبوك"
          name="facebook"
          value={formData.facebook || ''}
          onChange={handleChange}
        />
      </div>
      <FloatingInput
        label="رابط انستغرام (اختياري)"
        placeholder="ادخل رابط الانستغرام"
        name="instagram"
        value={formData.instagram || ''}
        onChange={handleChange}
        className="mb-6"
      />
      <div className="flex justify-between gap-4 mt-6">
        <button type="button" onClick={() => setCurrentStep(1)} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline w-full sm:w-auto transition-colors duration-300" disabled={loading}>السابق</button>
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline w-full sm:w-auto transition-colors duration-300" disabled={loading}>المتابعة إلى الخصومات والخدمات</button>
      </div>
    </form>
  );
};

export default Step2_SecondPartyDetails;