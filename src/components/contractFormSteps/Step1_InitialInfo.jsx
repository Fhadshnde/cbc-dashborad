import React, { useState, useEffect } from 'react'; // تم إضافة useEffect
import FloatingInput from '../common/FloatingInput';
import FloatingSelect from '../common/FloatingSelect';

const apiRequest = async (method, url, data = null, isFormData = false, getToken) => {
    const userToken = getToken();
    const headers = {};
    if (userToken) {
        headers['Authorization'] = `Bearer ${userToken}`;
    }
    let body = data;
    if (!isFormData && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        headers['Content-Type'] = 'application/json';
        body = JSON.stringify(data);
    }
    try {
        const response = await fetch(`https://hawkama.cbc-api.app/api/merchant/contracts${url}`, {
            method: method,
            headers: headers,
            body: body,
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Network error occurred.');
        }
        return response.json();
    } catch (error) {
        throw error;
    }
};

const createInitialContractApi = (contractData, getToken) => apiRequest('POST', '/', contractData, false, getToken);
const updateContractApi = (id, contractData, getToken) => apiRequest('PUT', `/${id}`, contractData, false, getToken);

const Step1_InitialInfo = ({ formData, handleChange, setFormData, setCurrentStep, contract, setError, setSuccess, setLoading, loading, getToken }) => {

    // Helper function to update expiry date based on signing date and contract period
    const calculateExpiryDate = (signingDateStr, period) => {
        if (!signingDateStr || !period) return '';

        const signingDate = new Date(signingDateStr);
        if (isNaN(signingDate.getTime())) return ''; // If signing date is invalid

        let newExpiryDate = new Date(signingDate);

        switch (period) {
            case '6 أشهر':
                newExpiryDate.setMonth(newExpiryDate.getMonth() + 6);
                break;
            case 'سنة':
                newExpiryDate.setFullYear(newExpiryDate.getFullYear() + 1);
                break;
            case 'سنتين':
                newExpiryDate.setFullYear(newExpiryDate.getFullYear() + 2);
                break;
            default:
                return ''; // If period is unknown
        }

        // Format date to YYYY-MM-DD to fit input type="date"
        const year = newExpiryDate.getFullYear();
        const month = String(newExpiryDate.getMonth() + 1).padStart(2, '0');
        const day = String(newExpiryDate.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // useEffect to ensure expiryDate is calculated on initial mount or when
    // formData.signingDate or formData.contractPeriod are initially set/changed externally.
    useEffect(() => {
        // Only run if signingDate and contractPeriod are present and expiryDate needs an update
        if (formData.signingDate && formData.contractPeriod) {
            const newExpiryDate = calculateExpiryDate(formData.signingDate, formData.contractPeriod);
            if (formData.expiryDate !== newExpiryDate) {
                setFormData(prev => ({
                    ...prev,
                    expiryDate: newExpiryDate
                }));
            }
        }
    }, [formData.signingDate, formData.contractPeriod, setFormData, formData.expiryDate]);


    const handleLocalChange = (e) => {
        const { name, value } = e.target;
        
        // Create a temporary object with the updated field
        let updatedFormData = { ...formData, [name]: value };

        // If the changed field is signingDate or contractPeriod,
        // recalculate and update expiryDate immediately
        if (name === 'signingDate' || name === 'contractPeriod') {
            const newExpiryDate = calculateExpiryDate(
                name === 'signingDate' ? value : formData.signingDate,
                name === 'contractPeriod' ? value : formData.contractPeriod
            );
            updatedFormData.expiryDate = newExpiryDate;
        }

        // Now call the original handleChange to sync with parent,
        // and update internal state with the calculated expiryDate
        setFormData(updatedFormData);
        handleChange({ target: { name: name, value: value } }); // Ensure parent's handleChange is called for the direct input change
    };


    const handleGetLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { longitude, latitude } = position.coords;
                    setFormData(prev => ({
                        ...prev,
                        location: {
                            type: 'Point',
                            coordinates: [longitude, latitude]
                        }
                    }));
                    setSuccess('Location successfully determined.');
                    setError('');
                },
                (error) => {
                    setError('Failed to determine location: ' + error.message);
                    setSuccess('');
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
        } else {
            setError('Your browser does not support geolocation.');
            setSuccess('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);
        try {
            if (!formData.contractType || !formData.contractNumber || !formData.contractPeriod || !formData.signingDate || !formData.expiryDate || !formData.storeName || !formData.contractGovernorate) {
                throw new Error("Please fill in all required initial contract information fields, including store name and governorate.");
            }

            let payload = {
                contractType: formData.contractType,
                contractNumber: formData.contractNumber,
                contractPeriod: formData.contractPeriod,
                signingDate: formData.signingDate,
                expiryDate: formData.expiryDate, // Ensure the updated expiryDate is sent
                storeName: formData.storeName,
                contractGovernorate: formData.contractGovernorate,
            };

            if (formData.location && formData.location.coordinates && formData.location.coordinates.length === 2) {
                payload.location = formData.location;
            }

            let res;
            if (contract && contract._id) {
                res = await updateContractApi(contract._id, payload, getToken);
                setSuccess('Initial information updated successfully.');
            } else {
                res = await createInitialContractApi({
                    ...payload,
                    status: "draft",
                }, getToken);
                setSuccess('Initial contract created successfully. You can now add details.');
            }
            // Ensure the parent component's state is updated correctly with the contract details
            // The `handleChange` from props might need adjustment in parent if it's not designed
            // to receive full object updates. For now, we rely on setFormData to update this component's state.
            setFormData(res.data.contract || res.contract);
            setCurrentStep(2);
        } catch (err) {
            setError(err.message || 'An error occurred while creating/updating the initial contract.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 rounded-lg">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">المعلومات الأولية للعقد</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <FloatingSelect
                    label="نوع العقد *"
                    name="contractType"
                    value={formData.contractType || ''}
                    onChange={handleLocalChange}
                    required
                >
                    <option value="">اختر نوع العقد</option>
                    <option value="new">عقد جديد</option>
                    <option value="renewal">تجديد عقد</option>
                </FloatingSelect>
                <FloatingInput
                    label="رقم العقد *"
                    placeholder="ادخل رقم العقد"
                    name="contractNumber"
                    value={formData.contractNumber || ''}
                    onChange={handleLocalChange}
                    required
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <FloatingSelect
                    label="مدة العقد *"
                    name="contractPeriod"
                    value={formData.contractPeriod || ''}
                    onChange={handleLocalChange}
                    required
                >
                    <option value="">اختر مدة العقد</option>
                    <option value="6 أشهر">6 أشهر</option>
                    <option value="سنة">سنة</option>
                    <option value="سنتين">سنتين</option>
                </FloatingSelect>
                <FloatingInput
                    label="تاريخ التوقيع*"
                    name="signingDate"
                    value={formData.signingDate ? formData.signingDate : ''}
                    onChange={handleLocalChange}
                    required
                    type="date"
                />
            </div>
            <FloatingInput
                label="تاريخ الانتهاء *"
                name="expiryDate"
                value={formData.expiryDate ? formData.expiryDate : ''}
                onChange={handleLocalChange}
                required
                type="date"
                className="mb-6"
                // تم إزالة خاصية readOnly للسماح بالتعديل المباشر، ولكن سيتم تحديثها تلقائياً عند تغيير المدة أو تاريخ التوقيع
            />
            <FloatingInput
                label="اسم المتجر *"
                placeholder="ادخل اسم المتجر"
                name="storeName"
                value={formData.storeName || ''}
                onChange={handleLocalChange}
                required
                className="mb-6"
            />
            <FloatingSelect
                label="المحافظة *"
                name="contractGovernorate"
                value={formData.contractGovernorate || ''}
                onChange={handleLocalChange}
                required
            >
                <option value="">اختر المحافظة</option>
                <option>كرخ</option>
                <option>رصافة</option>
                <option>بصرة</option>
                <option>كربلاء</option>
                <option>انبار</option>
                <option>اربيل</option>
            </FloatingSelect>

            <div className="mb-6 mt-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">تحديد موقع المتجر (GPS)</label>
                <button
                    type="button"
                    onClick={handleGetLocation}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300 ease-in-out"
                    disabled={loading}
                >
                    تحديد موقعي
                </button>
                {formData.location && formData.location.coordinates && formData.location.coordinates.length === 2 && (
                    <p className="text-gray-600 text-sm mt-2">
                        الموقع المحدد: خط الطول {formData.location.coordinates[0]}, خط العرض {formData.location.coordinates[1]}
                    </p>
                )}
            </div>

            <button type="submit" className="bg-[#25BC9D] text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline w-full transition-colors duration-300" disabled={loading}>المتابعة إلى تفاصيل الطرف الثاني</button>
        </form>
    );
};

export default Step1_InitialInfo;
