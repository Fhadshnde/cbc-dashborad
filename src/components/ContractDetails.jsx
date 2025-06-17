import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ContractDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const getToken = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      throw new Error('No token found');
    }
    return token;
  };

  const getUserData = () => {
    const userData = localStorage.getItem('userData');
    try {
      return userData ? JSON.parse(userData) : null;
    } catch (e) {
      return null;
    }
  };

  const hasRole = (roles) => {
    const user = getUserData();
    if (!user || !user.role) return false;
    return roles.includes(user.role);
  };

  const fetchContract = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/merchant/contracts/${id}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      });
      
      if (!response.ok) {
        throw new Error('فشل في جلب بيانات العقد');
      }
      
      const data = await response.json();
      setContract(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContract();
  }, [id]);

  const getStatusColor = () => {
    if (!contract) return 'bg-gray-500';
    switch (contract.status) {
      case 'draft': return 'bg-gray-400';
      case 'pending': return 'bg-yellow-400';
      case 'approved': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      case 'finalized': return 'bg-blue-500';
      default: return 'bg-gray-600';
    }
  };

  const handleEdit = () => {
    navigate(`/contracts/edit/${id}`);
  };

  const handleDelete = async () => {
    if (window.confirm('هل أنت متأكد من حذف هذا العقد؟')) {
      try {
        await fetch(`http://localhost:5000/api/merchant/contracts/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${getToken()}`
          }
        });
        navigate('/contracts');
      } catch (err) {
        setError('فشل في حذف العقد');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl">جاري تحميل بيانات العقد...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl">لا يوجد عقد لعرضه</div>
      </div>
    );
  }

  const isAdminOrSupervisor = hasRole(['admin', 'supervisor']);
  const canDelete = hasRole(['admin']);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md rtl text-right">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">تفاصيل العقد: {contract.contractNumber}</h2>
        <button 
          onClick={() => navigate('/contracts')}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          رجوع للقائمة
        </button>
      </div>

      {/* المعلومات الأساسية */}
      <div className="mb-8 p-6 border rounded-xl  bg-white overflow-auto" dir="rtl">
  <h3 className="text-2xl font-bold mb-4 pb-2  text-gray-800">المعلومات الأساسية</h3>
  <div className="flex flex-wrap gap-x-12 gap-y-6 text-center">
    <div className="flex flex-col">
      <span className="text-gray-600 font-medium mb-1">رقم العقد</span>
      <span className="text-gray-800">{contract.contractNumber}</span>
    </div>
    <div className="flex flex-col">
      <span className="text-gray-600 font-medium mb-1">نوع العقد</span>
      <span className="text-gray-800">{contract.contractType}</span>
    </div>
    <div className="flex flex-col">
      <span className="text-gray-600 font-medium mb-1">تاريخ التوقيع</span>
      <span className="text-gray-800">{new Date(contract.signingDate).toLocaleDateString('ar-EG')}</span>
    </div>
    <div className="flex flex-col">
      <span className="text-gray-600 font-medium mb-1">تاريخ الانتهاء</span>
      <span className="text-gray-800">{new Date(contract.expiryDate).toLocaleDateString('ar-EG')}</span>
    </div>
    <div className="flex flex-col">
      <span className="text-gray-600 font-medium mb-1">المنشئ</span>
      <span className="text-gray-800">{contract.createdBy?.username || 'غير معروف'}</span>
    </div>
  </div>
</div>


      {/* معلومات الطرف الثاني */}
      <div className="mb-8 p-4 border rounded-lg">
        <h3 className="text-xl font-semibold mb-4 pb-2">معلومات الطرف الثاني</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex justify-between">
            <span className="font-medium">اسم صاحب العقد:</span>
            <span>{contract.secondPartyOwnerName || 'غير محدد'}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">نوع النشاط:</span>
            <span>{contract.commercialActivityType || 'غير محدد'}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">هاتف المالك:</span>
            <span>{contract.ownerPersonalPhone || 'غير محدد'}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">البريد الإلكتروني:</span>
            <span>{contract.contractEmail || 'غير محدد'}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">المحافظة:</span>
            <span>{contract.contractGovernorate || 'غير محدد'}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">العنوان:</span>
            <span>{contract.contractFullAddress || 'غير محدد'}</span>
          </div>
        </div>
      </div>

      {/* الخصومات والخدمات */}
      <div className="mb-8 p-4 border rounded-lg">
        <h3 className="text-xl font-semibold mb-4 pb-2">الخصومات والخدمات</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <React.Fragment key={i}>
              <div className="flex justify-between">
                <span className="font-medium">خصم {i}:</span>
                <span>{contract[`discount${i}`] || 'غير محدد'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">خدمة {i}:</span>
                <span>{contract[`service${i}`] || 'غير محدد'}</span>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* بيانات الفروع */}
      <div className="mb-8 p-4 border rounded-lg">
        <h3 className="text-xl font-semibold mb-4 ">بيانات الفروع</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="p-3 border rounded bg-gray-50">
              <h4 className="font-medium mb-2">فرع {i}</h4>
              <div className="flex justify-between">
                <span>الاسم:</span>
                <span>{contract[`branchName${i}`] || 'غير محدد'}</span>
              </div>
              <div className="flex justify-between">
                <span>العنوان:</span>
                <span>{contract[`branchAddress${i}`] || 'غير محدد'}</span>
              </div>
              <div className="flex justify-between">
                <span>الهاتف:</span>
                <span>{contract[`branchPhone${i}`] || 'غير محدد'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* معلومات الاشتراك */}
      <div className="mb-8 p-4 border rounded-lg">
        <h3 className="text-xl font-semibold mb-4 pb-2 ">معلومات الاشتراك</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex justify-between">
            <span className="font-medium">نوع الاشتراك:</span>
            <span>{contract.subscriptionType || 'غير محدد'}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">مبلغ الاشتراك:</span>
            <span>{contract.subscriptionAmount || 'غير محدد'}</span>
          </div>
          <div className="flex justify-between col-span-1 md:col-span-2">
            <span className="font-medium">ملاحظات:</span>
            <span className="text-right">{contract.notes || 'لا توجد ملاحظات'}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">نفذ بواسطة:</span>
            <span>{contract.executedBy || 'غير محدد'}</span>
          </div>
        </div>
      </div>

      {/* صورة العقد */}
      {contract.contractImage && (
        <div className="mb-8 p-4 border rounded-lg">
          <h3 className="text-xl font-semibold mb-4">صورة العقد</h3>
          <img
            src={`http://localhost:5000/uploads/${contract.contractImage}`}
            alt="صورة العقد"
            className="max-w-full h-auto rounded shadow"
          />
        </div>
      )}

      {/* أزرار التحكم */}
      <div className="flex justify-center gap-4 mt-6">
        {isAdminOrSupervisor && contract.status !== 'finalized' && (
          <button 
            onClick={handleEdit}
            className="px-6 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            تعديل العقد
          </button>
        )}
        {canDelete && (
          <button
            onClick={handleDelete}
            className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            حذف العقد
          </button>
        )}
      </div>
    </div>
  );
};

export default ContractDetailsPage;