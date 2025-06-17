import React from 'react';
import FloatingInput from '../common/FloatingInput';
import FloatingSelect from '../common/FloatingSelect';

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
    const response = await fetch(`http://localhost:5000/api/merchant/contracts${url}`, {
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

const createInitialContractApi = (contractData, getToken) => apiRequest('POST', '/', contractData, false, getToken);
const updateContractApi = (id, contractData, getToken) => apiRequest('PUT', `/${id}`, contractData, false, getToken);
const Step1_InitialInfo = ({ formData, handleChange, setFormData, setCurrentStep, contract, setError, setSuccess, setLoading, loading, getToken }) => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      if (!formData.contractType || !formData.contractNumber || !formData.contractPeriod || !formData.signingDate || !formData.expiryDate) {
        throw new Error("الرجاء ملء جميع حقول معلومات العقد الأولية المطلوبة.");
      }
      let res;
      if (contract && contract._id) {
        res = await updateContractApi(contract._id, {
          contractType: formData.contractType,
          contractNumber: formData.contractNumber,
          contractPeriod: formData.contractPeriod,
          signingDate: formData.signingDate,
          expiryDate: formData.expiryDate,
        }, getToken);
        setSuccess('تم تحديث المعلومات الأولية بنجاح.');
      } else {
        res = await createInitialContractApi({
          ...formData,
          status: "draft",
        }, getToken);
        setSuccess('تم إنشاء العقد الأولي بنجاح. يمكنك الآن إضافة التفاصيل.');
      }
      setFormData(res.contract);
      setCurrentStep(2);
    } catch (err) {
      setError(err.message || 'حدث خطأ أثناء إنشاء/تحديث العقد الأولي.');
      console.error("Error creating/updating initial contract:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6  rounded-lg ">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">المعلومات الأولية للعقد</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <FloatingSelect
          label="نوع العقد *"
          name="contractType"
          value={formData.contractType || ''}
          onChange={handleChange}
          required
        >
          <option value="">اختر نوع العقد</option>
          <option value="new">عقد جديد</option>
          <option value="renewal">تجديد عقد</option>
        </FloatingSelect>
        <FloatingInput
          label="رقم العقد *"
          placeholder="ادخل رقم العقد"
          name="contractNumber"
          value={formData.contractNumber || ''}
          onChange={handleChange}
          required
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <FloatingInput
          label="مدة العقد *"
          placeholder="ادخل مدة العقد"
          name="contractPeriod"
          value={formData.contractPeriod || ''}
          onChange={handleChange}
          required
        />
        <FloatingInput
          label="تاريخ التوقيع*"
          name="signingDate"
          value={formData.signingDate ? formData.signingDate.split('T')[0] : ''}
          onChange={handleChange}
          required
          type="date"
        />
      </div>
      <FloatingInput
        label="تاريخ الانتهاء *"
        name="expiryDate"
        value={formData.expiryDate ? formData.expiryDate.split('T')[0] : ''}
        onChange={handleChange}
        required
        type="date"
        className="mb-6"
      />
      <button type="submit" className="bg-[#25BC9D]  text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline w-full transition-colors duration-300" disabled={loading}>المتابعة إلى تفاصيل الطرف الثاني</button>
    </form>
  );
};

export default Step1_InitialInfo;