import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import ContractForm from '../components/ContractForm';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

const ContractsPage = () => {
  const navigate = useNavigate();
  const API_BASE_URL = 'https://hawkama.cbc-api.app/api';

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

  const getAllContracts = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/merchant/contracts`, {
        headers: { Authorization: `Bearer ${getToken()}` },
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
        headers: { Authorization: `Bearer ${getToken()}` },
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

  const [governorateFilter, setGovernorateFilter] = useState('');
  const [subscriptionTypeFilter, setSubscriptionTypeFilter] = useState('');
  const [contractStatusFilter, setContractStatusFilter] = useState('');

  const isAdminOrSupervisor = hasRole(['admin', 'supervisor']);
  const canDelete = hasRole(['admin']);

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
  }, [getAllContracts]);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    fetchContracts();
  }, [isAuthenticated, navigate, fetchContracts]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const translateStatus = (status) => {
    switch (status) {
      case 'جديد': return 'جديد';
      case 'مرفوض': return 'مرفوض';
      case 'منتهي': return 'منتهي';
      case 'مسودة': return 'مسودة';
      case 'قيد الانتظار': return 'قيد الانتظار';
      case 'معتمد': return 'معتمد';
      default: return status || 'غير معروف';
    }
  };

  const applyFilters = () => {
    let result = contracts;

    if (governorateFilter) {
      result = result.filter(c => c.contractGovernorate && c.contractGovernorate.toLowerCase() === governorateFilter.toLowerCase());
    }
    if (subscriptionTypeFilter) {
      result = result.filter(c => c.subscriptionType && c.subscriptionType.toLowerCase() === subscriptionTypeFilter.toLowerCase());
    }
    if (contractStatusFilter) {
      if (contractStatusFilter === 'منتهي') {
        const now = new Date();
        result = result.filter(c => c.expiryDate && new Date(c.expiryDate) < now);
      } else {
        result = result.filter(c => c.status && c.status === contractStatusFilter);
      }
    }
    setFilteredContracts(result);
  };

  useEffect(() => {
    applyFilters();
  }, [governorateFilter, subscriptionTypeFilter, contractStatusFilter, contracts]);

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
      await fetchContracts();
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

  const exportPDF = () => {
    const doc = new jsPDF({ putOnlyUsedFonts:true, orientation:'landscape' });
    const tableColumn = ['اسم المتجر', 'اسم الموظفة', 'تاريخ التوقيع', 'حالة العقد', 'نوع الاشتراك', 'المحافظة'];
    const tableRows = [];
    filteredContracts.forEach(contract => {
      const rowData = [
        contract.storeName || '',
        contract.executedBy || '',
        contract.signingDate ? new Date(contract.signingDate).toLocaleDateString('ar-EG') : '',
        translateStatus(contract.status),
        contract.subscriptionType || '',
        contract.contractGovernorate || '',
      ];
      tableRows.push(rowData);
    });
    autoTable(doc, { head: [tableColumn], body: tableRows, styles: { font: 'helvetica', fontSize: 10 }, margin: { top: 20 } });
    doc.text('تقرير العقود', 14, 15);
    doc.save('contracts_report.pdf');
  };

  const exportExcel = () => {
    const wsData = [
      ['اسم المتجر', 'اسم الموظفة', 'تاريخ التوقيع', 'حالة العقد', 'نوع الاشتراك', 'المحافظة'],
      ...filteredContracts.map(contract => [
        contract.storeName || '',
        contract.executedBy || '',
        contract.signingDate ? new Date(contract.signingDate).toLocaleDateString('ar-EG') : '',
        translateStatus(contract.status),
        contract.subscriptionType || '',
        contract.contractGovernorate || '',
      ])
    ];
    const worksheet = XLSX.utils.aoa_to_sheet(wsData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Contracts');
    XLSX.writeFile(workbook, 'contracts_report.xlsx');
  };

  return loading ? (
    <div className="flex justify-center items-center h-screen bg-gray-100 rtl">
      <div className="text-center p-8 text-lg text-gray-600 animate-pulse">جاري تحميل العقود...</div>
    </div>
  ) : (
    <div className="m-4 sm:m-16 p-4 sm:p-6 bg-gray-50 min-h-screen text-right font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 sm:gap-0">
        <h2 className="text-2xl font-bold text-gray-700">العقود</h2>
      </div>

      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 justify-end flex-wrap">

          <div className="flex flex-col">
            <label htmlFor="governorateFilter" className="text-sm text-gray-600 mb-1">المحافظة</label>
            <select id="governorateFilter" value={governorateFilter} onChange={e => setGovernorateFilter(e.target.value)} className="border px-3 py-2 rounded w-full md:w-auto">
              <option value="">جميع المحافظات</option>
              <option>كرخ</option>
              <option>رصافة</option>
              <option>بصرة</option>
              <option>كربلاء</option>
              <option>انبار</option>
              <option>اربيل</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="subscriptionTypeFilter" className="text-sm text-gray-600 mb-1">نوع الاشتراك</label>
            <select id="subscriptionTypeFilter" value={subscriptionTypeFilter} onChange={e => setSubscriptionTypeFilter(e.target.value)} className="border px-3 py-2 rounded w-full md:w-auto">
              <option value="">جميع الأنواع</option>
              <option value="free">free</option>
              <option value="lite">lite</option>
              <option value="cbs+">cbs+</option>
              <option value="premium">premium</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="contractStatusFilter" className="text-sm text-gray-600 mb-1">حالة العقد</label>
            <select id="contractStatusFilter" value={contractStatusFilter} onChange={e => setContractStatusFilter(e.target.value)} className="border px-3 py-2 rounded w-full md:w-auto">
              <option value="">كل الحالات</option>
              <option value="جديد">جديد</option>
              <option value="مسودة">مسودة</option>
              <option value="قيد الانتظار">قيد الانتظار</option>
              <option value="معتمد">معتمد</option>
              <option value="مرفوض">مرفوض</option>
              <option value="منتهي">منتهي</option>
            </select>
          </div>

          <button onClick={exportPDF} className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition w-full md:w-auto self-end mt-6">تصدير PDF</button>

          <button onClick={exportExcel} className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition w-full md:w-auto self-end mt-6">تصدير Excel</button>

          {isAdminOrSupervisor && <button onClick={handleAddContract} className="bg-[#25BC9D] text-white px-6 py-2 rounded hover:bg-[#20A080] transition w-full md:w-auto self-end mt-6">إضافة عقد جديد</button>}

        </div>
      </div>

      {error && <div className="fixed top-20 right-5 bg-red-500 text-white p-3 rounded-lg shadow-lg z-50 animate-bounce-in-right">{error}</div>}

      {successMessage && <div className="fixed top-20 right-5 bg-green-500 text-white p-3 rounded-lg shadow-lg z-50 animate-bounce-in-right">{successMessage}</div>}

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full sm:min-w-[700px] text-sm text-right border-collapse">
          <thead className="bg-gray-100 text-gray-600 font-bold">
            <tr>
              <th className="px-4 py-2 whitespace-nowrap">اسم المتجر</th>
              <th className="px-4 py-2 whitespace-nowrap">اسم الموظفة</th>
              <th className="px-4 py-2 whitespace-nowrap">تاريخ توقيع العقد</th>
              <th className="px-4 py-2 whitespace-nowrap">تاريخ انتهاء العقد</th>
              <th className="px-4 py-2 whitespace-nowrap">حالة العقد</th>
              <th className="px-4 py-2 whitespace-nowrap">نوع الاشتراك</th>
              <th className="px-4 py-2 whitespace-nowrap">المحافظة</th>
              <th className="px-4 py-2 whitespace-nowrap">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filteredContracts.length > 0 ? (
              filteredContracts.map(contract => (
                <tr key={contract._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2 whitespace-nowrap">{contract.storeName || 'N/A'}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{contract.executedBy || 'N/A'}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{contract.signingDate ? new Date(contract.signingDate).toLocaleDateString('ar-EG') : 'N/A'}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{contract.expiryDate ? new Date(contract.expiryDate).toLocaleDateString('ar-EG') : 'N/A'}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{translateStatus(contract.status)}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{contract.subscriptionType || 'N/A'}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{contract.contractGovernorate || 'N/A'}</td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <div className="flex gap-2 justify-start">
                      <Link to={`/contracts/${contract._id}`} className="text-blue-600 hover:text-blue-800">تفاصيل</Link>
                      <Link to={`/contracts/edit/${contract._id}`} className="text-blue-600 hover:text-blue-800">تعديل</Link>
                      {canDelete && <button onClick={() => handleDeleteContract(contract._id)} className="text-red-600 hover:text-red-800">حذف</button>}
                      <Link to={`/contracts/activity/${contract._id}`} className="text-purple-600 hover:text-purple-800">سجل النشاطات</Link>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="px-4 py-4 text-center text-gray-500">لا توجد نتائج مطابقة لبحثك</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showForm && <ContractForm contract={selectedContract} onSave={handleFormSave} onCancel={handleFormCancel} />}

      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[1002] p-4">
          <div className="bg-white p-8 rounded-lg shadow-xl w-11/12 max-w-sm text-right rtl">
            <h3 className="text-xl font-bold mb-4 text-gray-800">تأكيد الحذف</h3>
            <p className="mb-6 text-gray-700">هل أنت متأكد أنك تريد حذف هذا العقد بشكل دائم؟ لا يمكن التراجع عن هذا الإجراء.</p>
            <div className="flex justify-end gap-3">
              <button onClick={cancelDelete} className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition">إلغاء</button>
              <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition">حذف</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractsPage;