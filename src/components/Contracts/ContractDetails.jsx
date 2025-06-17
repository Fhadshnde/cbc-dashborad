import React from 'react';

export const getUserData = () => {
  const userData = localStorage.getItem('userData');
  try {
    return userData ? JSON.parse(userData) : null;
  } catch (e) {
    console.error("Failed to parse user data from localStorage", e);
    return null;
  }
};

export const hasRole = (roles) => {
  const user = getUserData();
  if (!user || !user.role) return false;
  return roles.includes(user.role);
};

const ContractDetails = ({ contract, onClose, onEdit, onDelete }) => {
  const user = getUserData();
  const isAdminOrSupervisor = hasRole(['admin', 'supervisor']);

  if (!contract) {
    return <div className="p-5 bg-white rounded-lg shadow-md max-w-2xl mx-auto my-5 text-right">No contract to display.</div>;
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'draft': return 'bg-gray-400';
      case 'pending': return 'bg-yellow-500';
      case 'approved': return 'bg-green-600';
      case 'rejected': return 'bg-red-600';
      case 'finalized': return 'bg-blue-600';
      default: return 'bg-gray-700';
    }
  };

  return (
    <div className="p-5 bg-white rounded-lg shadow-lg max-w-4xl mx-auto my-5 text-right">
      <h2 className="text-center mb-6 text-gray-800 border-b-2 border-gray-200 pb-2.5">تفاصيل العقد</h2>
      <div className="mb-2.5 leading-relaxed flex flex-wrap justify-end gap-1.5">
        <strong>رقم العقد:</strong> {contract.contractNumber}
      </div>
      <div className="mb-2.5 leading-relaxed flex flex-wrap justify-end gap-1.5">
        <strong>نوع العقد:</strong> {contract.contractType}
      </div>
      <div className="mb-2.5 leading-relaxed flex flex-wrap justify-end gap-1.5">
        <strong>المدة:</strong> {contract.contractPeriod}
      </div>
      <div className="mb-2.5 leading-relaxed flex flex-wrap justify-end gap-1.5">
        <strong>تاريخ التوقيع:</strong> {new Date(contract.signingDate).toLocaleDateString()}
      </div>
      <div className="mb-2.5 leading-relaxed flex flex-wrap justify-end gap-1.5">
        <strong>تاريخ الانتهاء:</strong> {new Date(contract.expiryDate).toLocaleDateString()}
      </div>
      <div className="mb-2.5 leading-relaxed flex flex-wrap justify-end gap-1.5">
        <strong>الحالة:</strong> <span className={`px-2.5 py-1 rounded-full text-white font-bold text-sm ${getStatusColor(contract.status)}`}>{contract.status}</span>
      </div>
      <div className="mb-2.5 leading-relaxed flex flex-wrap justify-end gap-1.5">
        <strong>المنشئ:</strong> {contract.createdBy ? `${contract.createdBy.username} (${contract.createdBy.email})` : 'N/A'}
      </div>
      <div className="mb-2.5 leading-relaxed flex flex-wrap justify-end gap-1.5">
        <strong>آخر تعديل بواسطة:</strong> {contract.lastModifiedBy ? `${contract.lastModifiedBy.username} (${contract.lastModifiedBy.email})` : 'N/A'}
      </div>
      <div className="mb-2.5 leading-relaxed flex flex-wrap justify-end gap-1.5">
        <strong>تاريخ الإنشاء:</strong> {new Date(contract.createdAt).toLocaleString()}
      </div>
      <div className="mb-2.5 leading-relaxed flex flex-wrap justify-end gap-1.5">
        <strong>تاريخ آخر تحديث:</strong> {new Date(contract.updatedAt).toLocaleString()}
      </div>

      <h3 className="mt-7 mb-4 text-gray-700 border-b border-gray-200 pb-2">تفاصيل الطرف الثاني</h3>
      <div className="mb-2.5 leading-relaxed flex flex-wrap justify-end gap-1.5">
        <strong>اسم صاحب الطرف الثاني:</strong> {contract.secondPartyOwnerName || 'N/A'}
      </div>
      <div className="mb-2.5 leading-relaxed flex flex-wrap justify-end gap-1.5">
        <strong>نوع النشاط التجاري:</strong> {contract.commercialActivityType || 'N/A'}
      </div>
      <div className="mb-2.5 leading-relaxed flex flex-wrap justify-end gap-1.5">
        <strong>هاتف المالك:</strong> {contract.ownerPersonalPhone || 'N/A'}
      </div>
      <div className="mb-2.5 leading-relaxed flex flex-wrap justify-end gap-1.5">
        <strong>هاتف خدمة العملاء:</strong> {contract.customerServicePhone || 'N/A'}
      </div>
      <div className="mb-2.5 leading-relaxed flex flex-wrap justify-end gap-1.5">
        <strong>بريد العقد الإلكتروني:</strong> {contract.contractEmail || 'N/A'}
      </div>
      <div className="mb-2.5 leading-relaxed flex flex-wrap justify-end gap-1.5">
        <strong>المحافظة:</strong> {contract.contractGovernorate || 'N/A'}
      </div>
      <div className="mb-2.5 leading-relaxed flex flex-wrap justify-end gap-1.5">
        <strong>العنوان الكامل:</strong> {contract.contractFullAddress || 'N/A'}
      </div>
      <div className="mb-2.5 leading-relaxed flex flex-wrap justify-end gap-1.5">
        <strong>بريد المتجر الإلكتروني:</strong> {contract.storeEmail || 'N/A'}
      </div>
      <div className="mb-2.5 leading-relaxed flex flex-wrap justify-end gap-1.5">
        <strong>فيسبوك:</strong> {contract.facebook || 'N/A'}
      </div>
      <div className="mb-2.5 leading-relaxed flex flex-wrap justify-end gap-1.5">
        <strong>انستغرام:</strong> {contract.instagram || 'N/A'}
      </div>

      <h3 className="mt-7 mb-4 text-gray-700 border-b border-gray-200 pb-2">الخصومات والخدمات</h3>
      {[1, 2, 3, 4, 5, 6].map(i => (
        <div key={i} className="mb-2.5 leading-relaxed flex flex-wrap justify-end gap-1.5">
          <strong>خصم {i}:</strong> {contract[`discount${i}`] || 'N/A'} | <strong>خدمة {i}:</strong> {contract[`service${i}`] || 'N/A'}
        </div>
      ))}

      <h3 className="mt-7 mb-4 text-gray-700 border-b border-gray-200 pb-2">بيانات الفروع</h3>
      {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
        <div key={i} className="border border-gray-200 rounded-md p-2.5 mb-4 bg-gray-50">
          <h4>فرع {i}</h4>
          <div className="mb-2.5 leading-relaxed"><strong>الاسم:</strong> {contract[`branchName${i}`] || 'N/A'}</div>
          <div className="mb-2.5 leading-relaxed"><strong>العنوان:</strong> {contract[`branchAddress${i}`] || 'N/A'}</div>
          <div className="mb-2.5 leading-relaxed"><strong>الهاتف:</strong> {contract[`branchPhone${i}`] || 'N/A'}</div>
        </div>
      ))}

      <h3 className="mt-7 mb-4 text-gray-700 border-b border-gray-200 pb-2">تفاصيل الاشتراك وإنهاء العقد</h3>
      <div className="mb-2.5 leading-relaxed flex flex-wrap justify-end gap-1.5">
        <strong>نوع الاشتراك:</strong> {contract.subscriptionType || 'N/A'}
      </div>
      <div className="mb-2.5 leading-relaxed flex flex-wrap justify-end gap-1.5">
        <strong>مبلغ الاشتراك:</strong> {contract.subscriptionAmount || 'N/A'}
      </div>
      <div className="mb-2.5 leading-relaxed flex flex-wrap justify-end gap-1.5">
        <strong>ملاحظات:</strong> {contract.notes || 'N/A'}
      </div>
      <div className="mb-2.5 leading-relaxed flex flex-wrap justify-end gap-1.5">
        <strong>نفذ بواسطة:</strong> {contract.executedBy || 'N/A'}
      </div>
      {contract.contractImage && (
        <div className="mb-2.5 leading-relaxed flex flex-wrap justify-end gap-1.5">
          <strong>صورة العقد:</strong>
          <img
            src={`http://localhost:5000/uploads/${contract.contractImage}`}
            alt="Contract"
            className="max-w-full h-auto mt-4 rounded-lg shadow-sm"
          />
        </div>
      )}

      <div className="flex justify-center mt-8 gap-4">
        <button onClick={onClose} className="py-2.5 px-6 rounded-md border-none bg-blue-600 text-white cursor-pointer text-base transition-colors duration-300 hover:bg-blue-700">إغلاق</button>
        {isAdminOrSupervisor && contract.status !== 'finalized' && (
          <button onClick={() => onEdit(contract)} className="py-2.5 px-6 rounded-md border-none bg-yellow-500 text-gray-800 cursor-pointer text-base transition-colors duration-300 hover:bg-yellow-600">تعديل</button>
        )}
        {hasRole(['admin']) && (
          <button onClick={() => onDelete(contract._id)} className="py-2.5 px-6 rounded-md border-none bg-red-600 text-white cursor-pointer text-base transition-colors duration-300 hover:bg-red-700">حذف</button>
        )}
      </div>
    </div>
  );
};

export default ContractDetails;