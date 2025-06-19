import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import ContractForm from '../components/ContractForm';

const ContractsPage = () => {
  const navigate = useNavigate();

  const getToken = useCallback(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      throw new Error('No token found');
    }
    return token;
  }, [navigate]);

  const getUserData = useCallback(() => {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  }, []);

  const isAuthenticated = useCallback(() => {
    return !!localStorage.getItem('token');
  }, []);

  const hasRole = useCallback((roles) => {
    const user = getUserData();
    if (!user || !user.role) return false;
    return roles.includes(user.role);
  }, [getUserData]);

  const API_BASE_URL = 'https://hawkama.cbc-api.app/api';

  const getAllContracts = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/merchant/contracts`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        navigate('/login');
      }
      throw error.response?.data?.message || error.message;
    }
  }, [getToken, navigate]);

  const deleteContract = useCallback(async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/merchant/contracts/${id}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        navigate('/login');
      }
      throw error.response?.data?.message || error.message;
    }
  }, [getToken, navigate]);

  const [contracts, setContracts] = useState([]);
  const [filteredContracts, setFilteredContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [contractToDeleteId, setContractToDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  
  const isAdminOrSupervisor = hasRole(['admin', 'supervisor']);
  const canDelete = hasRole(['admin']);

  // *** هنا قمنا بنقل تعريف fetchContracts إلى الأعلى ***
  const fetchContracts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAllContracts();
      setContracts(data);
      setFilteredContracts(data);
    } catch (err) {
      setError(err || 'فشل جلب العقود.');
    } finally {
      setLoading(false);
    }
  }, [getAllContracts]); // تعتمد على getAllContracts

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    fetchContracts(); // الآن fetchContracts معرفة عند هذه النقطة
  }, [isAuthenticated, navigate, fetchContracts]); // أضف fetchContracts إلى التبعيات

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

  const handleSearch = () => {
    let result = contracts;

    if (searchTerm.trim()) {
      result = result.filter((contract) =>
        (contract.contractNumber && contract.contractNumber.toLowerCase().includes(searchTerm.toLowerCase().trim())) ||
        (contract.contractType && contract.contractType.toLowerCase().includes(searchTerm.toLowerCase().trim())) ||
        (contract.storeName && contract.storeName.toLowerCase().includes(searchTerm.toLowerCase().trim()))
      );
    }

    if (startDate || endDate) {
      result = result.filter((contract) => {
        const signingDate = contract.signingDate ? new Date(contract.signingDate) : null;
        if (!signingDate) return false;

        const start = startDate ? new Date(startDate) : null;
        if (start) start.setHours(0, 0, 0, 0);

        const end = endDate ? new Date(endDate) : null;
        if (end) end.setHours(23, 59, 59, 999);

        if (start && end) {
          return signingDate >= start && signingDate <= end;
        } else if (start) {
          return signingDate >= start;
        } else if (end) {
          return signingDate <= end;
        }
        return true;
      });
    }

    setFilteredContracts(result);
  };

  const handleAddContract = () => {
    setSelectedContract(null);
    setShowForm(true);
  };

  const handleEditContract = (contract) => {
    setSelectedContract(contract);
    setShowForm(true);
  };

  const handleDeleteContract = (id) => {
    setContractToDeleteId(id);
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    setShowConfirmModal(false);
    setError('');
    try {
      await deleteContract(contractToDeleteId);
      setSuccessMessage('تم حذف العقد بنجاح.');
      fetchContracts();
    } catch (err) {
      setError(err || 'فشل حذف العقد.');
    } finally {
      setContractToDeleteId(null);
    }
  };

  const cancelDelete = () => {
    setShowConfirmModal(false);
    setContractToDeleteId(null);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setSelectedContract(null);
  };

  const handleFormSave = () => {
    setShowForm(false);
    setSelectedContract(null);
    setSuccessMessage('تم حفظ العقد بنجاح!');
    fetchContracts();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 rtl">
        <div className="text-center p-8 text-lg text-gray-600 animate-pulse">جاري تحميل العقود...</div>
      </div>
    );
  }

  return (
    <div className="m-4 sm:m-16 p-4 sm:p-6 bg-gray-50 min-h-screen text-right font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 sm:gap-0">
        <h2 className="text-2xl font-bold text-gray-700">العقود</h2>
        <div className="relative w-full sm:w-auto">
          <input
            type="text"
            placeholder="ابحث برقم العقد أو نوعه أو اسم المتجر..."
            className="border px-4 py-2 rounded-lg pr-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            onClick={handleSearch}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 justify-end flex-wrap">
          <div className="flex flex-col">
            <label htmlFor="startDate" className="text-sm text-gray-600 mb-1">
              من تاريخ
            </label>
            <input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border px-3 py-2 rounded w-full md:w-auto"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="endDate" className="text-sm text-gray-600 mb-1">
              إلى تاريخ
            </label>
            <input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border px-3 py-2 rounded w-full md:w-auto"
            />
          </div>

          <button
            onClick={handleSearch}
            className="bg-teal-600 text-white px-6 py-2 rounded hover:bg-teal-700 transition w-full md:w-auto self-end mt-6"
          >
            بحث
          </button>
          
          {isAdminOrSupervisor && (
            <button
              onClick={handleAddContract}
              className="bg-[#25BC9D] text-white px-6 py-2 rounded hover:bg-[#20A080] transition w-full md:w-auto self-end mt-6"
            >
              إضافة عقد جديد
            </button>
          )}
        </div>
      </div>

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

      {!loading && !error && (
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="w-full sm:min-w-[700px] text-sm text-right border-collapse">
            <thead className="bg-gray-100 text-gray-600 font-bold">
              <tr>
                <th className="px-4 py-2 whitespace-nowrap">رقم العقد</th>
                <th className="px-4 py-2 whitespace-nowrap">اسم المتجر</th>
                <th className="px-4 py-2 whitespace-nowrap">نوع العقد</th>
                <th className="px-4 py-2 whitespace-nowrap">تاريخ التوقيع</th>
                <th className="px-4 py-2 whitespace-nowrap">تاريخ الانتهاء</th>
                <th className="px-4 py-2 whitespace-nowrap">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredContracts.length > 0 ? (
                filteredContracts.map((contract) => (
                  <tr key={contract._id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2 whitespace-nowrap">{contract.contractNumber || 'N/A'}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{contract.storeName || 'N/A'}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{contract.contractType || 'N/A'}</td>
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
                          تفاصيل
                        </Link>
                        {isAdminOrSupervisor && (
                          <button 
                            onClick={() => handleEditContract(contract)}
                            className="text-yellow-600 hover:text-yellow-800"
                          >
                            تعديل
                          </button>
                        )}
                        {canDelete && (
                          <button 
                            onClick={() => handleDeleteContract(contract._id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            حذف
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-4 py-4 text-center text-gray-500">
                    لا توجد نتائج مطابقة لبحثك
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <ContractForm
          contract={selectedContract}
          onSave={handleFormSave}
          onCancel={handleFormCancel}
        />
      )}

      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[1002] p-4">
          <div className="bg-white p-8 rounded-lg shadow-xl w-11/12 max-w-sm text-right rtl">
            <h3 className="text-xl font-bold mb-4 text-gray-800">تأكيد الحذف</h3>
            <p className="mb-6 text-gray-700">هل أنت متأكد أنك تريد حذف هذا العقد بشكل دائم؟ لا يمكن التراجع عن هذا الإجراء.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
              >
                إلغاء
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                حذف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractsPage;