import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ContractsWithoutSurveyPage = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const getToken = useCallback(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      throw new Error('No token found');
    }
    return token;
  }, [navigate]);

  const fetchContractsWithoutSurvey = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('https://hawkama.cbc-api.app/api/merchant/contracts/without-survey', {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      setContracts(response.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'فشل جلب العقود بدون استبيانات.');
      if (err.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [getToken, navigate]);

  useEffect(() => {
    fetchContractsWithoutSurvey();
  }, [fetchContractsWithoutSurvey]);

  const handleCreateSurvey = (contractId, storeName) => {
    navigate(`/followupsurveys/create/${contractId}`, { state: { storeName } });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 rtl">
        <div className="text-center p-8 text-lg text-gray-600 animate-pulse">جاري تحميل العقود بدون استبيانات...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 rtl">
        <div className="text-center p-8 text-lg text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="m-4 sm:m-16 p-4 sm:p-6 bg-gray-50 min-h-screen text-right font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 sm:gap-0">
        <h2 className="text-2xl font-bold text-gray-700">العقود التي لم يتم عمل استبيان لها</h2>
        <button 
          onClick={() => navigate('/followupsurveys')}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
        >
          العودة لقائمة الاستبيانات
        </button>
      </div>

      <div className="bg-white shadow rounded-lg p-4">
        {contracts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right border-collapse">
              <thead className="bg-gray-100 text-gray-600 font-bold">
                <tr>
                  <th className="px-4 py-2 whitespace-nowrap">اسم المتجر</th>
                  <th className="px-4 py-2 whitespace-nowrap">رقم العقد</th>
                  <th className="px-4 py-2 whitespace-nowrap">تاريخ التوقيع</th>
                  <th className="px-4 py-2 whitespace-nowrap">الإجراء</th>
                </tr>
              </thead>
              <tbody>
                {contracts.map((contract) => (
                  <tr key={contract._id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2 whitespace-nowrap">{contract.storeName || 'غير محدد'}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{contract.contractNumber || 'غير محدد'}</td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {contract.signingDate ? new Date(contract.signingDate).toLocaleDateString('ar-EG') : 'غير محدد'}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <button
                        onClick={() => handleCreateSurvey(contract._id, contract.storeName)}
                        className="bg-[#25BC9D] text-white px-3 py-1 rounded hover:bg-[#20A080] transition"
                      >
                        إنشاء استبيان
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500 py-4">لا توجد عقود تحتاج إلى استبيانات متابعة.</p>
        )}
      </div>
    </div>
  );
};

export default ContractsWithoutSurveyPage;
