import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StepIndicator from './common/StepIndicator';
import Step1_InitialInfo from './contractFormSteps/Step1_InitialInfo';
import Step2_SecondPartyDetails from './contractFormSteps/Step2_SecondPartyDetails';
import Step3_DiscountsServices from './contractFormSteps/Step3_DiscountsServices';
import Step4_BranchesData from './contractFormSteps/Step4_BranchesData';
import Step5_FinalizeContract from './contractFormSteps/Step5_FinalizeContract';
import axios from 'axios';

const getUserData = () => {
  const userData = localStorage.getItem('userData');
  return userData ? JSON.parse(userData) : null;
};

const getToken = () => {
  return localStorage.getItem('token');
};

const hasRole = (roles) => {
  const user = getUserData();
  if (!user || !user.role) return false;
  return roles.includes(user.role);
};

const getEmptyFormData = () => ({
  contractType: '',
  contractNumber: '',
  contractPeriod: '',
  signingDate: '',
  expiryDate: '',
  storeName: '',
  contractGovernorate: '',
  location: null,
  secondPartyOwnerName: '',
  commercialActivityType: '',
  ownerPersonalPhone: '',
  customerServicePhone: '',
  contractEmail: '',
  contractFullAddress: '',
  storeEmail: '',
  facebook: '',
  instagram: '',
  discount1: '', service1: '',
  discount2: '', service2: '',
  discount3: '', service3: '',
  discount4: '', service4: '',
  discount5: '', service5: '',
  discount6: '', service6: '',
  branchName1: '', branchAddress1: '', branchPhone1: '',
  branchName2: '', branchAddress2: '', branchPhone2: '',
  branchName3: '', branchAddress3: '', branchPhone3: '',
  branchName4: '', branchAddress4: '', branchPhone4: '',
  branchName5: '', branchAddress5: '', branchPhone5: '',
  branchName6: '', branchAddress6: '', branchPhone6: '',
  branchName7: '', branchAddress7: '', branchPhone7: '',
  branchName8: '', branchAddress8: '', branchPhone8: '',
  subscriptionType: 'free',
  subscriptionAmount: '',
  notes: '',
  executedBy: '',
  contractImage: '',
  electronicSignature: '',
  status: 'draft',
  _id: '',
});

const ContractForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(getEmptyFormData());
  const [contract, setContract] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  const user = getUserData();
  const isAdminOrSupervisor = hasRole(['admin', 'supervisor']);

  useEffect(() => {
    if (!id) {
      setFormData(getEmptyFormData());
      setCurrentStep(1);
      setError('');
      setSuccess('');
      setFile(null);
      return;
    }

    const fetchContract = async () => {
      setLoading(true);
      setError('');
      try {
        const token = getToken();
        if (!token) {
          navigate('/login');
          return;
        }
        const response = await axios.get(`https://hawkama.cbc-api.app/api/merchant/contracts/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const contractData = response.data;

        setContract(contractData);
        setFormData({
          ...getEmptyFormData(),
          ...contractData,
          signingDate: contractData.signingDate ? new Date(contractData.signingDate).toISOString().split('T')[0] : '',
          expiryDate: contractData.expiryDate ? new Date(contractData.expiryDate).toISOString().split('T')[0] : '',
        });

        if (contractData.status === 'draft') setCurrentStep(1);
        else if (contractData.status === 'pending') setCurrentStep(2);
        else if (contractData.status === 'approved' || contractData.status === 'rejected') setCurrentStep(3);
        else if (contractData.status === 'finalized') setCurrentStep(5);
        else setCurrentStep(1);

      } catch (err) {
        setError('فشل جلب بيانات العقد');
      } finally {
        setLoading(false);
      }
    };

    fetchContract();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

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
          getToken={getToken}
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
          getToken={getToken}
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
          getToken={getToken}
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
          getToken={getToken}
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
          onSave={() => {}}
          getToken={getToken}
          getUserData={getUserData}
        />
      )}
    </>
  );

  const isEditable = !id || (isAdminOrSupervisor && formData.status !== 'finalized');
  const isCreateMode = !id;

  return (
    <div className="p-6 rounded max-w-4xl mx-auto">
      <h2 className="text-3xl font-semibold mb-6 text-gray-800">
        {isCreateMode ? 'إنشاء عقد جديد' : `تعديل العقد رقم: ${formData.contractNumber || ''}`}
      </h2>

      <div className="flex justify-between mb-6">
        <StepIndicator stepNumber={1} label="معلومات العقد" isActive={currentStep === 1} isCompleted={currentStep > 1} />
        <StepIndicator stepNumber={2} label="معلومات الطرف الثاني" isActive={currentStep === 2} isCompleted={currentStep > 2} />
        <StepIndicator stepNumber={3} label="الخدمات المقدمة من قبل الطرف الثاني" isActive={currentStep === 3} isCompleted={currentStep > 3} />
        <StepIndicator stepNumber={4} label="قائمة الفروع" isActive={currentStep === 4} isCompleted={currentStep > 4} />
        <StepIndicator stepNumber={5} label="الخدمات المقدمة من شركتنا" isActive={currentStep === 5} isCompleted={currentStep > 5} />
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
