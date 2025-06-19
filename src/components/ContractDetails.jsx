import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const ContractDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contract, setContract] = useState(null);
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

  const getUserData = useCallback(() => {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  }, []);

  const hasRole = useCallback((roles) => {
    const user = getUserData();
    if (!user || !user.role) return false;
    return roles.includes(user.role);
  }, [getUserData]);

  const API_BASE_URL = 'https://hawkama.cbc-api.app/api';

  const getContractDetails = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${API_BASE_URL}/merchant/contracts/${id}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      setContract(response.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'فشل جلب تفاصيل العقد.');
      if (err.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [id, getToken, navigate]);

  useEffect(() => {
    getContractDetails();
  }, [getContractDetails]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 rtl">
        <div className="text-center p-8 text-lg text-gray-600 animate-pulse">جاري تحميل تفاصيل العقد...</div>
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

  if (!contract) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 rtl">
        <div className="text-center p-8 text-lg text-gray-600">لم يتم العثور على العقد.</div>
      </div>
    );
  }

  const isAdminOrSupervisor = hasRole(['admin', 'supervisor']);

  return (
    <div className="m-4 sm:m-16 p-4 sm:p-6 bg-gray-50 min-h-screen text-right font-sans">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-700">تفاصيل العقد: {contract.contractNumber}</h2>
        <div className="flex gap-2">
          {isAdminOrSupervisor && (
            <button
              onClick={() => navigate(`/contracts/edit/${contract._id}`)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              تعديل العقد
            </button>
          )}
          <Link
            to="/contracts"
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
          >
            العودة للقائمة
          </Link>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">معلومات أساسية</h3>
            <div className="space-y-3 text-gray-700">
              <p><span className="font-medium text-gray-600">رقم العقد:</span> {contract.contractNumber}</p>
              <p><span className="font-medium text-gray-600">نوع العقد:</span> {contract.contractType}</p>
              <p><span className="font-medium text-gray-600">اسم المتجر:</span> {contract.storeName || 'غير محدد'}</p>
              <p><span className="font-medium text-gray-600">تاريخ التوقيع:</span> {contract.signingDate ? new Date(contract.signingDate).toLocaleDateString('ar-EG') : 'غير محدد'}</p>
              <p><span className="font-medium text-gray-600">تاريخ الانتهاء:</span> {contract.expiryDate ? new Date(contract.expiryDate).toLocaleDateString('ar-EG') : 'غير محدد'}</p>
              <p><span className="font-medium text-gray-600">الحالة:</span> {contract.status}</p>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">معلومات الطرف الثاني</h3>
            <div className="space-y-3 text-gray-700">
              <p><span className="font-medium text-gray-600">اسم صاحب المتجر:</span> {contract.secondPartyOwnerName}</p>
              <p><span className="font-medium text-gray-600">عنوان المتجر الكامل:</span> {contract.contractFullAddress}</p>
              <p><span className="font-medium text-gray-600">نوع النشاط التجاري:</span> {contract.commercialActivityType}</p>
              <p><span className="font-medium text-gray-600">هاتف صاحب المتجر:</span> {contract.ownerPersonalPhone || 'غير محدد'}</p>
              <p><span className="font-medium text-gray-600">هاتف خدمة الزبائن:</span> {contract.customerServicePhone || 'غير محدد'}</p>
              <p><span className="font-medium text-gray-600">بريد العقد الإلكتروني:</span> {contract.contractEmail || 'غير محدد'}</p>
              <p><span className="font-medium text-gray-600">المحافظة:</span> {contract.contractGovernorate || 'غير محدد'}</p>
              <p><span className="font-medium text-gray-600">بريد المتجر الإلكتروني:</span> {contract.storeEmail || 'غير محدد'}</p>
              <p><span className="font-medium text-gray-600">فيسبوك:</span> {contract.facebook || 'غير محدد'}</p>
              <p><span className="font-medium text-gray-600">انستغرام:</span> {contract.instagram || 'غير محدد'}</p>
            </div>
          </div>
        </div>

        {/* معلومات الخصومات والخدمات (تم تعديلها لتناسب الحقول الجديدة) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">الخصومات</h3>
            <div className="space-y-3 text-gray-700">
              {contract.discount1 && <p><span className="font-medium text-gray-600">الخصم 1:</span> {contract.discount1}%</p>}
              {contract.discount2 && <p><span className="font-medium text-gray-600">الخصم 2:</span> {contract.discount2}%</p>}
              {contract.discount3 && <p><span className="font-medium text-gray-600">الخصم 3:</span> {contract.discount3}%</p>}
              {contract.discount4 && <p><span className="font-medium text-gray-600">الخصم 4:</span> {contract.discount4}%</p>}
              {contract.discount5 && <p><span className="font-medium text-gray-600">الخصم 5:</span> {contract.discount5}%</p>}
              {contract.discount6 && <p><span className="font-medium text-gray-600">الخصم 6:</span> {contract.discount6}%</p>}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">الخدمات</h3>
            <div className="space-y-3 text-gray-700">
              {contract.service1 && <p><span className="font-medium text-gray-600">الخدمة 1:</span> {contract.service1}</p>}
              {contract.service2 && <p><span className="font-medium text-gray-600">الخدمة 2:</span> {contract.service2}</p>}
              {contract.service3 && <p><span className="font-medium text-gray-600">الخدمة 3:</span> {contract.service3}</p>}
              {contract.service4 && <p><span className="font-medium text-gray-600">الخدمة 4:</span> {contract.service4}</p>}
              {contract.service5 && <p><span className="font-medium text-gray-600">الخدمة 5:</span> {contract.service5}</p>}
              {contract.service6 && <p><span className="font-medium text-gray-600">الخدمة 6:</span> {contract.service6}</p>}
            </div>
          </div>
        </div>

        {/* فروع المتجر (تم تعديلها لتناسب الحقول الجديدة) */}
        {(contract.branchName1 || contract.branchName2 || contract.branchName3 || contract.branchName4 || contract.branchName5 || contract.branchName6 || contract.branchName7 || contract.branchName8) && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">فروع المتجر</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-right border-collapse">
                <thead className="bg-gray-100 text-gray-600 font-bold">
                  <tr>
                    <th className="px-4 py-2 whitespace-nowrap">اسم الفرع</th>
                    <th className="px-4 py-2 whitespace-nowrap">عنوان الفرع</th>
                    <th className="px-4 py-2 whitespace-nowrap">هاتف الفرع</th>
                  </tr>
                </thead>
                <tbody>
                  {contract.branchName1 && <tr className="border-t hover:bg-gray-50"><td className="px-4 py-2">{contract.branchName1}</td><td className="px-4 py-2">{contract.branchAddress1}</td><td className="px-4 py-2">{contract.branchPhone1}</td></tr>}
                  {contract.branchName2 && <tr className="border-t hover:bg-gray-50"><td className="px-4 py-2">{contract.branchName2}</td><td className="px-4 py-2">{contract.branchAddress2}</td><td className="px-4 py-2">{contract.branchPhone2}</td></tr>}
                  {contract.branchName3 && <tr className="border-t hover:bg-gray-50"><td className="px-4 py-2">{contract.branchName3}</td><td className="px-4 py-2">{contract.branchAddress3}</td><td className="px-4 py-2">{contract.branchPhone3}</td></tr>}
                  {contract.branchName4 && <tr className="border-t hover:bg-gray-50"><td className="px-4 py-2">{contract.branchName4}</td><td className="px-4 py-2">{contract.branchAddress4}</td><td className="px-4 py-2">{contract.branchPhone4}</td></tr>}
                  {contract.branchName5 && <tr className="border-t hover:bg-gray-50"><td className="px-4 py-2">{contract.branchName5}</td><td className="px-4 py-2">{contract.branchAddress5}</td><td className="px-4 py-2">{contract.branchPhone5}</td></tr>}
                  {contract.branchName6 && <tr className="border-t hover:bg-gray-50"><td className="px-4 py-2">{contract.branchName6}</td><td className="px-4 py-2">{contract.branchAddress6}</td><td className="px-4 py-2">{contract.branchPhone6}</td></tr>}
                  {contract.branchName7 && <tr className="border-t hover:bg-gray-50"><td className="px-4 py-2">{contract.branchName7}</td><td className="px-4 py-2">{contract.branchAddress7}</td><td className="px-4 py-2">{contract.branchPhone7}</td></tr>}
                  {contract.branchName8 && <tr className="border-t hover:bg-gray-50"><td className="px-4 py-2">{contract.branchName8}</td><td className="px-4 py-2">{contract.branchAddress8}</td><td className="px-4 py-2">{contract.branchPhone8}</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">معلومات إضافية</h3>
            <div className="space-y-3 text-gray-700">
              <p><span className="font-medium text-gray-600">نوع الاشتراك:</span> {contract.subscriptionType || 'غير محدد'}</p>
              <p><span className="font-medium text-gray-600">مبلغ الاشتراك:</span> {contract.subscriptionAmount || 'غير محدد'}</p>
              <p><span className="font-medium text-gray-600">ملاحظات:</span> {contract.notes || 'لا يوجد'}</p>
              <p><span className="font-medium text-gray-600">تم التنفيذ بواسطة:</span> {contract.executedBy || 'غير محدد'}</p>
              {contract.contractImage && (
                <p><span className="font-medium text-gray-600">صورة العقد:</span> <a href={`https://hawkama.cbc-api.app/${contract.contractImage}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">عرض الصورة</a></p>
              )}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">حالة العقد والتواريخ</h3>
            <div className="space-y-3 text-gray-700">
              <p><span className="font-medium text-gray-600">الحالة:</span> {contract.status}</p>
              <p><span className="font-medium text-gray-600">تاريخ الإنشاء:</span> {contract.createdAt ? new Date(contract.createdAt).toLocaleDateString('ar-EG') : 'غير محدد'}</p>
              <p><span className="font-medium text-gray-600">آخر تحديث:</span> {contract.updatedAt ? new Date(contract.updatedAt).toLocaleDateString('ar-EG') : 'غير محدد'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractDetailsPage;