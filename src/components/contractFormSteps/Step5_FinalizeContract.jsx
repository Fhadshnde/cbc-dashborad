import React, { useRef } from 'react';
import FloatingInput from '../common/FloatingInput';
import FloatingTextArea from '../common/FloatingTextArea';
import FloatingSelect from '../common/FloatingSelect';
import SignatureCanvas from 'react-signature-canvas';

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
      method: method,
      headers: headers,
      body: body,
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `حدث خطأ في الشبكة: ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    throw error;
  }
};

const finalizeContractApi = (id, formData, getToken) => apiRequest('PUT', `/${id}/finalize`, formData, true, getToken);
const uploadSignatureApi = (id, formData, getToken) => apiRequest('PUT', `/${id}/signature`, formData, true, getToken);

const getUserData = () => {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
};

const Step5_FinalizeContract = ({ formData, handleChange, setFormData, setCurrentStep, contract, setError, setSuccess, setLoading, loading, file, handleFileChange, onSave, getToken }) => {
  const user = getUserData();
  const sigCanvas = useRef({});

  const clearSignature = () => {
    sigCanvas.current.clear();
  };

  const handleFinalizeAndSignatureSubmit = async (e) => {
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
      const formFinalizeData = new FormData();
      formFinalizeData.append('subscriptionType', formData.subscriptionType || 'free');
      formFinalizeData.append('subscriptionAmount', formData.subscriptionAmount || 0);
      formFinalizeData.append('notes', formData.notes || '');
      formFinalizeData.append('executedBy', formData.executedBy || user?.username || '');
      if (file) {
        formFinalizeData.append('contractImage', file);
      }

      const finalizeRes = await finalizeContractApi(contractId, formFinalizeData, getToken);
      setFormData(finalizeRes.contract);
      setSuccess('تم إنهاء العقد بنجاح.');

      if (sigCanvas.current && !sigCanvas.current.isEmpty()) {
        const signatureImage = sigCanvas.current.getCanvas().toDataURL('image/png');
        
        const byteString = atob(signatureImage.split(',')[1]);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([ab], { type: 'image/png' });
        const signatureFile = new File([blob], 'signature.png', { type: 'image/png' });

        const formSignatureData = new FormData();
        formSignatureData.append('electronicSignature', signatureFile);

        const signatureRes = await uploadSignatureApi(contractId, formSignatureData, getToken);
        setFormData(signatureRes.contract);
        setSuccess('تم إنهاء العقد وإضافة التوقيع بنجاح.');
      } else {
        setSuccess('تم إنهاء العقد بنجاح (لم يتم إضافة توقيع إلكتروني).');
      }

      onSave();
    } catch (err) {
      setError(err.message || 'حدث خطأ أثناء إنهاء العقد أو إضافة التوقيع.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleFinalizeAndSignatureSubmit} className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">إنهاء العقد</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <FloatingSelect
          label="نوع الاشتراك"
          placeholder="اختر نوع الاشتراك"
          name="subscriptionType"
          value={formData.subscriptionType || 'free'}
          onChange={handleChange}
        >
          <option value="free">مجاني</option>
          <option value="lite">لايت</option>
          <option value="cbs+">CBS+</option>
          <option value="premium">بريميوم</option>
        </FloatingSelect>
        <FloatingInput
          label="مبلغ الاشتراك"
          placeholder="ادخل مبلغ الاشتراك"
          name="subscriptionAmount"
          value={formData.subscriptionAmount || ''}
          onChange={handleChange}
          type="number"
        />
      </div>
      <FloatingTextArea
        label="ملاحظات"
        placeholder="ادخل أي ملاحظات"
        name="notes"
        value={formData.notes || ''}
        onChange={handleChange}
        rows={4}
        className="mb-6"
      />
      <FloatingInput
        label="نفذ بواسطة"
        placeholder="ادخل اسم المنفذ"
        name="executedBy"
        value={formData.executedBy || user?.username || ''}
        onChange={handleChange}
        readOnly={true}
        className="mb-6"
      />
      <div className="mb-6">
        <label htmlFor="contractImage" className="block text-gray-700 text-sm font-bold mb-2">صورة العقد</label>
        <input type="file" id="contractImage" name="contractImage" onChange={handleFileChange} className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
        {formData.contractImage && !file && <p className="mt-2 text-gray-600 text-sm">الصورة الحالية: <a href={`https://hawkama.cbc-api.app/api/uploads/${formData.contractImage}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{formData.contractImage.split('/').pop()}</a></p>}
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">التوقيع الإلكتروني للطرف الثاني (ارسم هنا)</label>
        <div className="border border-gray-300 rounded-lg overflow-hidden">
          <SignatureCanvas
            ref={sigCanvas}
            penColor='black'
            canvasProps={{ width: 500, height: 200, className: 'sigCanvas border border-gray-200' }}
            backgroundColor='rgb(249, 250, 251)'
          />
        </div>
        <button
          type="button"
          onClick={clearSignature}
          className="mt-2 bg-red-500 hover:bg-red-600 text-white text-sm py-1 px-3 rounded-md focus:outline-none focus:shadow-outline transition-colors duration-300"
        >
          مسح التوقيع
        </button>
        {formData.electronicSignature && (
            <p className="mt-2 text-gray-600 text-sm">التوقيع الحالي: <a href={`https://hawkama.cbc-api.app/api/uploads/${formData.electronicSignature}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">عرض التوقيع</a></p>
        )}
      </div>

      <div className="flex justify-between gap-4 mt-6">
        <button type="button" onClick={() => setCurrentStep(4)} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline w-full sm:w-auto transition-colors duration-300" disabled={loading}>السابق</button>
        <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline w-full sm:w-auto transition-colors duration-300" disabled={loading}>إنهاء العقد</button>
      </div>
    </form>
  );
};

export default Step5_FinalizeContract;