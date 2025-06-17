import React, { useState, useEffect } from 'react';

export const setToken = (token) => {
  localStorage.setItem('authToken', token);
};

export const getToken = () => {
  return localStorage.getItem('authToken');
};

export const removeToken = () => {
  localStorage.removeItem('authToken');
};

export const isAuthenticated = () => {
  return !!getToken();
};

export const setUserData = (user) => {
  localStorage.setItem('userData', JSON.stringify(user));
};

export const getUserData = () => {
  const userData = localStorage.getItem('userData');
  return userData ? JSON.parse(userData) : null;
};

export const removeUserData = () => {
  localStorage.removeItem('userData');
};

export const hasRole = (roles) => {
  const user = getUserData();
  if (!user || !user.role) return false;
  return roles.includes(user.role);
};

const apiRequest = async (method, url, data = null, isFormData = false) => {
  const userToken = getToken();
  const headers = {};
  if (userToken) {
    headers['Authorization'] = `Bearer ${userToken}`;
  }

  let body = data;
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`http://localhost:5000/api${url}`, {
      method: method,
      headers: headers,
      body: body,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Network error.');
    }
    return response.json();
  } catch (error) {
    console.error(`API request error (${method} ${url}):`, error);
    throw error;
  }
};

const createInitialContractApi = (contractData) => apiRequest('POST', '/contracts', contractData);
const updateContractApi = (id, contractData) => apiRequest('PUT', `/contracts/${id}`, contractData);
const updateContractDetailsApi = (id, detailsData) => apiRequest('PUT', `/contracts/${id}/details`, detailsData);
const updateDiscountsAndServicesApi = (id, data) => apiRequest('PUT', `/contracts/${id}/discounts-services`, data);
const updateBranchesApi = (id, data) => apiRequest('PUT', `/contracts/${id}/branches`, data);
const finalizeContractApi = (id, formData) => apiRequest('PUT', `/contracts/${id}/finalize`, formData, true);

const StepIndicator = ({ stepNumber, label, isActive, isCompleted }) => {
  return (
    <div className="flex flex-col items-center relative flex-1">
      <div
        className={`w-10 h-10 rounded-full flex justify-center items-center font-bold border-2 z-20 transition-colors ${
          isActive || isCompleted ? 'bg-[#25BC9D] text-white' : 'bg-gray-200 text-gray-700'
        } ${isActive ? 'border-[#00ACC1]' : 'border-gray-200'}`}
      >
        {stepNumber}
      </div>
      <span
        className={`mt-2 text-sm text-center whitespace-nowrap transition-colors ${
          isActive || isCompleted ? 'text-[#25BC9D]' : 'text-gray-700'
        }`}
      >
        {label}
      </span>
      {stepNumber < 5 && (
        <div className="absolute top-5 right-[calc(50%+20px)] w-[calc(100%-40px)] h-0.5 bg-gray-200 z-10"></div>
      )}
    </div>
  );
};

const FloatingInput = ({ label, placeholder, name, value, onChange, type = 'text', required = false }) => {
  const [isFocused, setIsFocused] = useState(false);
  const showPlaceholderText = !isFocused && !value;

  return (
    <div className="relative flex-1 mb-4">
      <label
        htmlFor={name}
        className="absolute top-0.5 right-4 text-lg text-black bg-white px-1 pointer-events-none transition-all duration-200 z-10"
      >
        {label}
      </label>
      {showPlaceholderText && (
        <span className="absolute top-9 right-4 text-base text-gray-600 pointer-events-none transition-all duration-200 z-10">
          {placeholder}
        </span>
      )}
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="w-full pt-9 pb-3 px-4 rounded-lg border border-gray-300 text-base text-black bg-white outline-none box-border"
      />
    </div>
  );
};

const FloatingTextArea = ({ label, placeholder, name, value, onChange, required = false, rows = 3 }) => {
  const [isFocused, setIsFocused] = useState(false);
  const showPlaceholderText = !isFocused && !value;

  return (
    <div className="relative mb-4">
      <label
        htmlFor={name}
        className="absolute top-0.5 right-4 text-base text-black bg-white px-1 pointer-events-none transition-all duration-200 z-10"
      >
        {label}
      </label>
      {showPlaceholderText && (
        <span className="absolute top-9 right-4 text-base text-gray-600 pointer-events-none transition-all duration-200 z-10">
          {placeholder}
        </span>
      )}
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        rows={rows}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="w-full pt-9 pb-3 px-4 rounded-lg border border-gray-300 text-base text-black bg-white outline-none box-border resize-y"
      ></textarea>
    </div>
  );
};

const FloatingSelect = ({ label, placeholder, name, value, onChange, children, required = false }) => {
  const [isFocused, setIsFocused] = useState(false);
  const showPlaceholderText = !isFocused && !value;

  return (
    <div className="relative flex-1 mb-4">
      <label
        htmlFor={name}
        className="absolute top-0.5 right-4 text-lg text-black bg-white px-1 pointer-events-none transition-all duration-200 z-10"
      >
        {label}
      </label>
      {showPlaceholderText && (
        <span className="absolute top-9 right-4 text-base text-gray-600 pointer-events-none transition-all duration-200 z-10">
          {placeholder}
        </span>
      )}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="w-full pt-9 pb-3 px-4 rounded-lg border border-gray-300 text-base text-black bg-white outline-none box-border appearance-none bg-no-repeat bg-[left_15px_center] bg-[length:1.2em] pl-10"
        style={{
          backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
        }}
      >
        {children}
      </select>
    </div>
  );
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

  useEffect(() => {
    if (contract) {
      setFormData(contract);
      if (contract.status === 'draft') setCurrentStep(1);
      else if (contract.status === 'pending') setCurrentStep(2);
      else if (contract.status === 'approved' || contract.status === 'rejected') setCurrentStep(3);
      else if (contract.status === 'finalized') setCurrentStep(5);
    } else {
      setFormData({});
      setCurrentStep(1);
    }
    setError('');
    setSuccess('');
    setFile(null);
  }, [contract]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmitStep1 = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      if (
        !formData.contractType ||
        !formData.contractNumber ||
        !formData.contractPeriod ||
        !formData.signingDate ||
        !formData.expiryDate
      ) {
        throw new Error('Please fill in all required initial contract information fields.');
      }
      let res;
      if (contract && contract._id) {
        res = await updateContractApi(contract._id, {
          contractType: formData.contractType,
          contractNumber: formData.contractNumber,
          contractPeriod: formData.contractPeriod,
          signingDate: formData.signingDate,
          expiryDate: formData.expiryDate,
        });
        setSuccess('Initial information updated successfully.');
      } else {
        res = await createInitialContractApi({
          ...formData,
          status: 'draft',
        });
        setSuccess('Initial contract created successfully. You can now add details.');
      }
      setFormData(res.contract);
      setCurrentStep(2);
    } catch (err) {
      setError(err.message || 'An error occurred while creating/updating the initial contract.');
      console.error('Error creating/updating initial contract:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitStep2 = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    const contractId = contract?._id || formData._id;
    if (!contractId) {
      setError('Please create the initial contract first and wait for it to be saved.');
      setLoading(false);
      return;
    }

    try {
      if (
        !formData.secondPartyOwnerName ||
        !formData.commercialActivityType ||
        !formData.ownerPersonalPhone ||
        !formData.contractFullAddress ||
        !formData.contractGovernorate
      ) {
        throw new Error('Please fill in all required second party details fields.');
      }
      const res = await updateContractDetailsApi(contractId, formData);
      setFormData(res.contract);
      setSuccess('Second party details updated successfully.');
      setCurrentStep(3);
    } catch (err) {
      setError(err.message || 'An error occurred while updating second party details.');
      console.error('Error updating contract details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitStep3 = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    const contractId = contract?._id || formData._id;
    if (!contractId) {
      setError('Please complete the previous steps first.');
      setLoading(false);
      return;
    }
    try {
      const res = await updateDiscountsAndServicesApi(contractId, formData);
      setFormData(res.contract);
      setSuccess('Discounts and services updated successfully.');
      setCurrentStep(4);
    } catch (err) {
      setError(err.message || 'An error occurred while updating discounts and services.');
      console.error('Error updating discounts and services:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitStep4 = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    const contractId = contract?._id || formData._id;
    if (!contractId) {
      setError('Please complete the previous steps first.');
      setLoading(false);
      return;
    }
    try {
      const res = await updateBranchesApi(contractId, formData);
      setFormData(res.contract);
      setSuccess('Branch data updated successfully.');
      setCurrentStep(5);
    } catch (err) {
      setError(err.message || 'An error occurred while updating branch data.');
      console.error('Error updating branches:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitStep5 = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    const contractId = contract?._id || formData._id;
    if (!contractId) {
      setError('Please complete the previous steps first.');
      setLoading(false);
      return;
    }
    try {
      const formFinalizeData = new FormData();
      formFinalizeData.append('subscriptionType', formData.subscriptionType || '');
      formFinalizeData.append('subscriptionAmount', formData.subscriptionAmount || 0);
      formFinalizeData.append('notes', formData.notes || '');
      formFinalizeData.append('executedBy', formData.executedBy || user?.username || '');
      if (file) {
        formFinalizeData.append('contractImage', file);
      }

      const res = await finalizeContractApi(contractId, formFinalizeData);
      setFormData(res.contract);
      setSuccess('Contract finalized successfully.');
      onSave();
    } catch (err) {
      setError(err.message || 'An error occurred while finalizing the contract.');
      console.error('Error finalizing contract:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    return (
      <div className="mb-5">
        {loading && <p className="text-center text-blue-600">Loading...</p>}
        {currentStep === 1 && (
          <form onSubmit={handleSubmitStep1}>
            <h3 className="mt-5 mb-4 text-black pb-2.5">Initial Contract Information</h3>
            <div className="flex justify-between gap-4 mb-4">
              <FloatingSelect
                label="Contract Type *"
                name="contractType"
                value={formData.contractType || ''}
                onChange={handleChange}
                required
              >
                <option value="">Select Contract Type</option>
                <option value="new">New Contract</option>
                <option value="renewal">Contract Renewal</option>
              </FloatingSelect>
              <FloatingInput
                label="Contract Number *"
                placeholder="Enter Contract Number"
                name="contractNumber"
                value={formData.contractNumber || ''}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex justify-between gap-4 mb-4">
              <FloatingInput
                label="Contract Period *"
                placeholder="Enter Contract Period"
                name="contractPeriod"
                value={formData.contractPeriod || ''}
                onChange={handleChange}
                required
              />
              <FloatingInput
                label="Signing Date*"
                name="signingDate"
                value={formData.signingDate ? formData.signingDate.split('T')[0] : ''}
                onChange={handleChange}
                required
                type="date"
              />
            </div>
            <FloatingInput
              label="Expiry Date *"
              name="expiryDate"
              value={formData.expiryDate ? formData.expiryDate.split('T')[0] : ''}
              onChange={handleChange}
              required
              type="date"
            />
            <button type="submit" className="py-2.5 px-5 mx-1 my-2.5 rounded-md border-none bg-gradient-to-b from-[#00ACC1] to-[#25BC9D] text-white cursor-pointer text-base transition-colors" disabled={loading}>
              Continue to Second Party Details
            </button>
          </form>
        )}

        {currentStep === 2 && (
          <form onSubmit={handleSubmitStep2}>
            <h3 className="mt-5 mb-4 text-black pb-2.5">Second Party Details</h3>
            <div className="flex justify-between gap-4 mb-4">
              <FloatingInput
                label="Second Party Owner Name *"
                placeholder="Enter Owner Name"
                name="secondPartyOwnerName"
                value={formData.secondPartyOwnerName || ''}
                onChange={handleChange}
                required
              />
              <FloatingInput
                label="Commercial Activity Type *"
                placeholder="Enter Activity Type"
                name="commercialActivityType"
                value={formData.commercialActivityType || ''}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex justify-between gap-4 mb-4">
              <FloatingInput
                label="Owner Personal Phone *"
                placeholder="Enter Owner Phone Number"
                name="ownerPersonalPhone"
                value={formData.ownerPersonalPhone || ''}
                onChange={handleChange}
                required
              />
              <FloatingInput
                label="Customer Service Phone (Optional)"
                placeholder="Enter Customer Service Phone"
                name="customerServicePhone"
                value={formData.customerServicePhone || ''}
                onChange={handleChange}
              />
            </div>
            <div className="flex justify-between gap-4 mb-4">
              <FloatingInput
                label="Contract Email (Optional)"
                placeholder="Enter Contract Email"
                name="contractEmail"
                value={formData.contractEmail || ''}
                onChange={handleChange}
                type="email"
              />
              <FloatingInput
                label="Governorate *"
                placeholder="Enter Governorate"
                name="contractGovernorate"
                value={formData.contractGovernorate || ''}
                onChange={handleChange}
                required
              />
            </div>
            <FloatingInput
              label="Full Address *"
              placeholder="Enter Full Address"
              name="contractFullAddress"
              value={formData.contractFullAddress || ''}
              onChange={handleChange}
              required
            />
            <div className="flex justify-between gap-4 mb-4">
              <FloatingInput
                label="Store Email (Optional)"
                placeholder="Enter Store Email"
                name="storeEmail"
                value={formData.storeEmail || ''}
                onChange={handleChange}
                type="email"
              />
              <FloatingInput
                label="Facebook Link (Optional)"
                placeholder="Enter Facebook Link"
                name="facebook"
                value={formData.facebook || ''}
                onChange={handleChange}
              />
            </div>
            <FloatingInput
              label="Instagram Link (Optional)"
              placeholder="Enter Instagram Link"
              name="instagram"
              value={formData.instagram || ''}
              onChange={handleChange}
            />
            <button type="button" onClick={() => setCurrentStep(1)} className="py-2.5 px-5 mx-1 my-2.5 rounded-md border-none bg-gradient-to-b from-[#00ACC1] to-[#25BC9D] text-white cursor-pointer text-base transition-colors" disabled={loading}>
              Previous
            </button>
            <button type="submit" className="py-2.5 px-5 mx-1 my-2.5 rounded-md border-none bg-gradient-to-b from-[#00ACC1] to-[#25BC9D] text-white cursor-pointer text-base transition-colors" disabled={loading}>
              Continue to Discounts and Services
            </button>
          </form>
        )}

        {currentStep === 3 && (
          <form onSubmit={handleSubmitStep3}>
            <h3 className="mt-5 mb-4 text-black pb-2.5">Discounts and Services</h3>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex justify-between gap-4 mb-4">
                <FloatingInput
                  label={`Discount ${i}`}
                  placeholder={`Enter Discount ${i}`}
                  name={`discount${i}`}
                  value={formData[`discount${i}`] || ''}
                  onChange={handleChange}
                  type="number"
                />
                <FloatingInput
                  label={`Service ${i}`}
                  placeholder={`Enter Service ${i}`}
                  name={`service${i}`}
                  value={formData[`service${i}`] || ''}
                  onChange={handleChange}
                />
              </div>
            ))}
            <button type="button" onClick={() => setCurrentStep(2)} className="py-2.5 px-5 mx-1 my-2.5 rounded-md border-none bg-gradient-to-b from-[#00ACC1] to-[#25BC9D] text-white cursor-pointer text-base transition-colors" disabled={loading}>
              Previous
            </button>
            <button type="submit" className="py-2.5 px-5 mx-1 my-2.5 rounded-md border-none bg-gradient-to-b from-[#00ACC1] to-[#25BC9D] text-white cursor-pointer text-base transition-colors" disabled={loading}>
              Continue to Branches
            </button>
          </form>
        )}

        {currentStep === 4 && (
          <form onSubmit={handleSubmitStep4}>
            <h3 className="mt-5 mb-4 text-black pb-2.5">Branch Data</h3>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4 mb-5 bg-gray-50">
                <h4 className="text-gray-600 mb-2.5">Branch {i}</h4>
                <div className="flex justify-between gap-4 mb-4">
                  <FloatingInput
                    label={`Branch Name ${i}`}
                    placeholder={`Enter Branch Name ${i}`}
                    name={`branchName${i}`}
                    value={formData[`branchName${i}`] || ''}
                    onChange={handleChange}
                  />
                  <FloatingInput
                    label={`Branch Address ${i}`}
                    placeholder={`Enter Branch Address ${i}`}
                    name={`branchAddress${i}`}
                    value={formData[`branchAddress${i}`] || ''}
                    onChange={handleChange}
                  />
                </div>
                <FloatingInput
                  label={`Branch Phone ${i}`}
                  placeholder={`Enter Branch Phone ${i}`}
                  name={`branchPhone${i}`}
                  value={formData[`branchPhone${i}`] || ''}
                  onChange={handleChange}
                />
              </div>
            ))}
            <button type="button" onClick={() => setCurrentStep(3)} className="py-2.5 px-5 mx-1 my-2.5 rounded-md border-none bg-gradient-to-b from-[#00ACC1] to-[#25BC9D] text-white cursor-pointer text-base transition-colors" disabled={loading}>
              Previous
            </button>
            <button type="submit" className="py-2.5 px-5 mx-1 my-2.5 rounded-md border-none bg-gradient-to-b from-[#00ACC1] to-[#25BC9D] text-white cursor-pointer text-base transition-colors" disabled={loading}>
              Continue to Finalize Contract
            </button>
          </form>
        )}

        {currentStep === 5 && (
          <form onSubmit={handleSubmitStep5}>
            <h3 className="mt-5 mb-4 text-black pb-2.5">Finalize Contract</h3>
            <div className="flex justify-between gap-4 mb-4">
              <FloatingSelect
                label="Subscription Type"
                placeholder="Select Subscription Type"
                name="subscriptionType"
                value={formData.subscriptionType || 'free'}
                onChange={handleChange}
              >
                <option value="free">Free</option>
                <option value="lite">Lite</option>
                <option value="cbs+">CBS+</option>
                <option value="premium">Premium</option>
              </FloatingSelect>
              <FloatingInput
                label="Subscription Amount"
                placeholder="Enter Subscription Amount"
                name="subscriptionAmount"
                value={formData.subscriptionAmount || ''}
                onChange={handleChange}
                type="number"
              />
            </div>
            <FloatingTextArea
              label="Notes"
              placeholder="Enter any notes"
              name="notes"
              value={formData.notes || ''}
              onChange={handleChange}
              rows={4}
            />
            <FloatingInput
              label="Executed By"
              placeholder="Enter Executed By Name"
              name="executedBy"
              value={formData.executedBy || user?.username || ''}
              onChange={handleChange}
            />
            <div className="mb-4">
              <label htmlFor="contractImage" className="block mb-1 text-base text-black">Contract Image</label>
              <input type="file" id="contractImage" name="contractImage" onChange={handleFileChange} className="block w-full py-2.5 px-4 rounded-lg border border-gray-300 text-base text-black bg-white cursor-pointer box-border" />
              {formData.contractImage && !file && <p className="text-sm text-gray-700 mt-1 text-right pr-1.5">Current Image: {formData.contractImage}</p>}
            </div>
            <button type="button" onClick={() => setCurrentStep(4)} className="py-2.5 px-5 mx-1 my-2.5 rounded-md border-none bg-gradient-to-b from-[#00ACC1] to-[#25BC9D] text-white cursor-pointer text-base transition-colors" disabled={loading}>
              Previous
            </button>
            <button type="submit" className="py-2.5 px-5 mx-1 my-2.5 rounded-md border-none bg-gradient-to-b from-[#00ACC1] to-[#25BC9D] text-white cursor-pointer text-base transition-colors" disabled={loading}>
              Finalize Contract
            </button>
          </form>
        )}
      </div>
    );
  };

  const isEditable = !contract || (isAdminOrSupervisor && contract.status !== 'finalized');
  const isCreateMode = !contract;

  return (
    <div className="p-5 rounded-lg max-w-5xl mx-auto my-5 text-right" dir="rtl">
      <h2 className="text-center mb-5 text-gray-800">
        {isCreateMode ? 'Create New Contract' : `Edit Contract Number: ${formData.contractNumber}`}
      </h2>

      <div className="flex justify-center items-start mb-10 mt-5 rtl:direction-rtl">
        <StepIndicator
          stepNumber={1}
          label="Contract Information"
          isActive={currentStep === 1}
          isCompleted={currentStep > 1}
        />
        <StepIndicator
          stepNumber={2}
          label="Second Party Information"
          isActive={currentStep === 2}
          isCompleted={currentStep > 2}
        />
        <StepIndicator
          stepNumber={3}
          label="Services Provided by Second Party"
          isActive={currentStep === 3}
          isCompleted={currentStep > 3}
        />
        <StepIndicator
          stepNumber={4}
          label="Branch List"
          isActive={currentStep === 4}
          isCompleted={currentStep > 4}
        />
        <StepIndicator
          stepNumber={5}
          label="Services Provided by Our Company"
          isActive={currentStep === 5}
          isCompleted={currentStep > 5}
        />
      </div>

      {error && <p className="text-red-600 bg-red-100 p-2.5 rounded-md mb-4 text-center">{error}</p>}
      {success && <p className="text-green-600 bg-green-100 p-2.5 rounded-md mb-4 text-center">{success}</p>}

      {!isEditable && !isCreateMode && (
        <p className="text-blue-700 bg-blue-50 p-2.5 rounded-md mb-4 text-center">
          This contract cannot be edited because it has been finalized or you do not have the permissions.
        </p>
      )}

      {(isEditable || isCreateMode) ? renderStep() : null}

      <button onClick={onCancel} className="py-2.5 px-5 mx-1 my-2.5 rounded-md border-none bg-gray-600 text-white cursor-pointer text-base transition-colors mt-5" disabled={loading}>
        Cancel
      </button>
    </div>
  );
};

export default ContractForm;