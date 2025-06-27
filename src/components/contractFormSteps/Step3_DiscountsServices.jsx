import React from 'react';
import FloatingInput from '../common/FloatingInput';

const apiRequest = async (method, url, data = null, isFormData = false, getToken) => {
  const userToken = getToken();
  const headers = {};
  if (userToken) {
    headers['Authorization'] = `Bearer ${userToken}`;
  }
  let body = data;
  if (!isFormData && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(data);
  }
  try {
    const response = await fetch(`https://hawkama.cbc-api.app/api/merchant/contracts${url}`, {
      method,
      headers,
      body,
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'حدث خطأ في الشبكة.');
    }
    return response.json();
  } catch (error) {
    throw error;
  }
};

const updateDiscountsAndServicesApi = (id, data, getToken) =>
  apiRequest('PUT', `/${id}/discounts-services`, data, false, getToken);

const Step3_DiscountsServices = ({
  formData,
  handleChange,
  setFormData,
  setCurrentStep,
  contract,
  setError,
  setSuccess,
  setLoading,
  loading,
  getToken
}) => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const contractId = contract?._id || formData._id;
    if (!contractId) {
      setError("الرجاء إكمال الخطوات السابقة أولاً.");
      setLoading(false);
      return;
    }

    const payload = {};
    for (let i = 1; i <= 6; i++) {
      const discountValue = formData[`discount${i}`];
      payload[`discount${i}`] = discountValue !== '' && !isNaN(Number(discountValue))
                                ? Number(discountValue)
                                : null;

      payload[`service${i}`] = formData[`service${i}`] || '';
    }

    try {
      const res = await updateDiscountsAndServicesApi(contractId, payload, getToken);
      setFormData(res.contract);
      setSuccess('تم تحديث الخصومات والخدمات بنجاح.');
      setCurrentStep(4);
    } catch (err) {
      setError(err.message || 'حدث خطأ أثناء تحديث الخصومات والخدمات.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">الخصومات والخدمات</h3>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <FloatingInput
            label={`خصم ${i}`}
            placeholder={`ادخل خصم ${i}`}
            name={`discount${i}`}
            value={formData[`discount${i}`] || ''}
            onChange={handleChange}
            type="number"
          />
          <FloatingInput
            label={`خدمة ${i}`}
            placeholder={`ادخل خدمة ${i}`}
            name={`service${i}`}
            value={formData[`service${i}`] || ''}
            onChange={handleChange}
          />
        </div>
      ))}
      <div className="flex justify-between gap-4 mt-6">
        <button
          type="button"
          onClick={() => setCurrentStep(2)}
          className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline w-full sm:w-auto transition-colors duration-300"
          disabled={loading}
        >
          السابق
        </button>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline w-full sm:w-auto transition-colors duration-300"
          disabled={loading}
        >
          المتابعة إلى الفروع
        </button>
      </div>
    </form>
  );
};

export default Step3_DiscountsServices;