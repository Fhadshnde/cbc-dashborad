import React, { useState, useEffect } from 'react';
import StepIndicator from './common/StepIndicator';
import Step1_InitialInfo from './contractFormSteps/Step1_InitialInfo';
import Step2_SecondPartyDetails from './contractFormSteps/Step2_SecondPartyDetails';
import Step3_DiscountsServices from './contractFormSteps/Step3_DiscountsServices';
import Step4_BranchesData from './contractFormSteps/Step4_BranchesData';
import Step5_FinalizeContract from './contractFormSteps/Step5_FinalizeContract';

// دالة لجلب بيانات المستخدم من localStorage
const getUserData = () => {
  const userData = localStorage.getItem('userData');
  return userData ? JSON.parse(userData) : null;
};

// دالة لجلب توكن المصادقة من localStorage
// **تم التعديل هنا لضمان استخدام المفتاح الصحيح 'token'**
const getToken = () => {
  return localStorage.getItem('token');
};

// دالة للتحقق مما إذا كان المستخدم يمتلك دورًا معينًا
const hasRole = (roles) => {
  const user = getUserData();
  if (!user || !user.role) return false;
  return roles.includes(user.role);
};

const ContractForm = ({ contract, onSave, onCancel }) => {
  const [formData, setFormData] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  const user = getUserData();
  const isAdminOrSupervisor = hasRole(['admin', 'supervisor']);

  // useEffect لمعالجة التغيرات في كائن العقد (contract)
  useEffect(() => {
    if (contract) {
      setFormData(contract);
      // ضبط الخطوة الحالية بناءً على حالة العقد
      if (contract.status === 'draft') setCurrentStep(1);
      else if (contract.status === 'pending') setCurrentStep(2);
      else if (contract.status === 'approved' || contract.status === 'rejected') setCurrentStep(3);
      else if (contract.status === 'finalized') setCurrentStep(5);
    } else {
      // إعادة تعيين النموذج إذا لم يكن هناك عقد محدد (لوضع إنشاء جديد)
      setFormData({});
      setCurrentStep(1);
    }
    // مسح الرسائل والحالة عند تغيير العقد
    setError('');
    setSuccess('');
    setFile(null);
  }, [contract]);

  // دالة لمعالجة التغييرات في حقول الإدخال
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // دالة لمعالجة تغيير ملف الصورة
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // دالة لعرض الخطوة الحالية من نموذج العقد
  const renderStep = () => (
    <>
      {currentStep === 1 && (
        <Step1_InitialInfo
          formData={formData}
          handleChange={handleChange}
          setFormData={setFormData}
          setCurrentStep={setCurrentStep}
          contract={contract}
          setError={setError}
          setSuccess={setSuccess}
          setLoading={setLoading}
          loading={loading}
          getToken={getToken} // تمرير دالة getToken
        />
      )}
      {currentStep === 2 && (
        <Step2_SecondPartyDetails
          formData={formData}
          handleChange={handleChange}
          setFormData={setFormData}
          setCurrentStep={setCurrentStep}
          contract={contract}
          setError={setError}
          setSuccess={setSuccess}
          setLoading={setLoading}
          loading={loading}
          getToken={getToken} // تمرير دالة getToken
        />
      )}
      {currentStep === 3 && (
        <Step3_DiscountsServices
          formData={formData}
          handleChange={handleChange}
          setFormData={setFormData}
          setCurrentStep={setCurrentStep}
          contract={contract}
          setError={setError}
          setSuccess={setSuccess}
          setLoading={setLoading}
          loading={loading}
          getToken={getToken} // تمرير دالة getToken
        />
      )}
      {currentStep === 4 && (
        <Step4_BranchesData
          formData={formData}
          handleChange={handleChange}
          setFormData={setFormData}
          setCurrentStep={setCurrentStep}
          contract={contract}
          setError={setError}
          setSuccess={setSuccess}
          setLoading={setLoading}
          loading={loading}
          getToken={getToken} // تمرير دالة getToken
        />
      )}
      {currentStep === 5 && (
        <Step5_FinalizeContract
          formData={formData}
          handleChange={handleChange}
          setFormData={setFormData}
          setCurrentStep={setCurrentStep}
          contract={contract}
          setError={setError}
          setSuccess={setSuccess}
          setLoading={setLoading}
          loading={loading}
          file={file}
          handleFileChange={handleFileChange}
          onSave={onSave}
          getToken={getToken} // تمرير دالة getToken
          getUserData={getUserData} // تمرير دالة getUserData
        />
      )}
    </>
  );

  // تحديد ما إذا كان العقد قابلاً للتعديل
  const isEditable = !contract || (isAdminOrSupervisor && contract.status !== 'finalized');
  const isCreateMode = !contract;

  return (
    <div className="p-6 rounded max-w-4xl mx-auto">
      <h2 className="text-3xl font-semibold mb-6 text-gray-800">
        {isCreateMode ? 'إنشاء عقد جديد' : `تعديل العقد رقم: ${formData.contractNumber || ''}`}
      </h2>

      {/* مؤشر الخطوات */}
      <div className="flex justify-between mb-6">
        <StepIndicator
          stepNumber={1}
          label="معلومات العقد"
          isActive={currentStep === 1}
          isCompleted={currentStep > 1}
        />
        <StepIndicator
          stepNumber={2}
          label="معلومات الطرف الثاني"
          isActive={currentStep === 2}
          isCompleted={currentStep > 2}
        />
        <StepIndicator
          stepNumber={3}
          label="الخدمات المقدمة من قبل الطرف الثاني"
          isActive={currentStep === 3}
          isCompleted={currentStep > 3}
        />
        <StepIndicator
          stepNumber={4}
          label="قائمة الفروع"
          isActive={currentStep === 4}
          isCompleted={currentStep > 4}
        />
        <StepIndicator
          stepNumber={5}
          label="الخدمات المقدمة من شركتنا"
          isActive={currentStep === 5}
          isCompleted={currentStep > 5}
        />
      </div>

      {loading && <p className="text-blue-600 mb-4">جاري التحميل...</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {success && <p className="text-green-600 mb-4">{success}</p>}

      {!isEditable && !isCreateMode && (
        <p className="mb-4 text-gray-500 italic">
          لا يمكن تعديل هذا العقد لأنه تم إنهاؤه أو لا تملك الصلاحيات.
        </p>
      )}

      {(isEditable || isCreateMode) && renderStep()}


    </div>
  );
};

export default ContractForm;
