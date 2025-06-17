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

const updateBranchesApi = (id, data, getToken) => apiRequest('PUT', `/${id}/branches`, data, false, getToken);
const Step4_BranchesData = ({ formData, handleChange, setFormData, setCurrentStep, contract, setError, setSuccess, setLoading, loading, getToken }) => {
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
    try {
      const res = await updateBranchesApi(contractId, formData, getToken);
      setFormData(res.contract);
      setSuccess('تم تحديث بيانات الفروع بنجاح.');
      setCurrentStep(5);
    } catch (err) {
      setError(err.message || 'حدث خطأ أثناء تحديث بيانات الفروع.');
      console.error("Error updating branches:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">بيانات الفروع</h3>
      {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
        <div key={i} className="mb-8 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <h4 className="text-xl font-semibold text-gray-700 mb-4">فرع {i}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <FloatingInput
              label={`اسم الفرع ${i}`}
              placeholder={`ادخل اسم الفرع ${i}`}
              name={`branchName${i}`}
              value={formData[`branchName${i}`] || ''}
              onChange={handleChange}
            />
            <FloatingInput
              label={`عنوان الفرع ${i}`}
              placeholder={`ادخل عنوان الفرع ${i}`}
              name={`branchAddress${i}`}
              value={formData[`branchAddress${i}`] || ''}
              onChange={handleChange}
            />
          </div>
          <FloatingInput
            label={`هاتف الفرع ${i}`}
            placeholder={`ادخل هاتف الفرع ${i}`}
            name={`branchPhone${i}`}
            value={formData[`branchPhone${i}`] || ''}
            onChange={handleChange}
          />
        </div>
      ))}
      <div className="flex justify-between gap-4 mt-6">
        <button type="button" onClick={() => setCurrentStep(3)} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline w-full sm:w-auto transition-colors duration-300" disabled={loading}>السابق</button>
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline w-full sm:w-auto transition-colors duration-300" disabled={loading}>المتابعة إلى إنهاء العقد</button>
      </div>
    </form>
  );
};

export default Step4_BranchesData;