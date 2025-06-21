import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const ContractsWithoutSurveyPage = () => {
  const navigate = useNavigate();
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const getToken = useCallback(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      throw new Error('No token found');
    }
    return token;
  }, [navigate]);

  useEffect(() => {
    const fetchContractsWithoutSurvey = async () => {
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
        setError(err.response?.data?.message || 'فشل جلب العقود بدون استبيان.');
        if (err.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchContractsWithoutSurvey();
  }, [getToken, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 rtl">
        <div className="text-center p-8 text-lg text-gray-600 animate-pulse">جاري تحميل العقود...</div>
      </div>
    );
  }

  return (
    <div className="m-4 sm:m-16 p-4 sm:p-6 bg-gray-50 min-h-screen text-right font-sans">
      <h2 className="text-2xl font-bold text-gray-700 mb-6">العقود بدون استبيانات متابعة</h2>

      {error && (
        <div className="fixed top-20 right-5 bg-red-500 text-white p-3 rounded-lg shadow-lg z-50 animate-bounce-in-right">
          {error}
        </div>
      )}

      <div className="mb-6 flex justify-end">
        <button
          onClick={() => navigate('/followupsurveys')}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          العودة إلى استبيانات المتابعة
        </button>
      </div>

      {!loading && contracts.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-6 text-center text-gray-500">
          لا توجد عقود بدون استبيانات متابعة حالياً.
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="w-full sm:min-w-[700px] text-sm text-right border-collapse">
            <thead className="bg-gray-100 text-gray-600 font-bold">
              <tr>
                <th className="px-4 py-2 whitespace-nowrap">رقم العقد</th>
                <th className="px-4 py-2 whitespace-nowrap">اسم المتجر</th>
                <th className="px-4 py-2 whitespace-nowrap">تاريخ التوقيع</th>
                <th className="px-4 py-2 whitespace-nowrap">تاريخ الانتهاء</th>
                <th className="px-4 py-2 whitespace-nowrap">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {contracts.map((contract) => (
                <tr key={contract._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2 whitespace-nowrap">{contract.contractNumber || 'N/A'}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{contract.storeName || 'N/A'}</td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {contract.signingDate ? new Date(contract.signingDate).toLocaleDateString('ar-EG') : 'N/A'}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {contract.expiryDate ? new Date(contract.expiryDate).toLocaleDateString('ar-EG') : 'N/A'}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <div className="flex gap-2 justify-start">
                      <Link
                        to={`/contracts/${contract._id}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        تفاصيل العقد
                      </Link>
                      <button
                        onClick={() => navigate(`/followupsurveys/create/${contract._id}`, { state: { storeName: contract.storeName } })}
                        className="bg-[#25BC9D] text-white px-3 py-1 rounded hover:bg-[#20A080] transition text-xs"
                      >
                        إنشاء استبيان
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ContractsWithoutSurveyPage;